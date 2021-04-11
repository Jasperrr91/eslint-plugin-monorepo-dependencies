import { Rule } from "eslint";

import fs from 'fs';
import path from 'path';

const dependencyIsInDependencyList = (dependency: string, dependencies: string[]): boolean => {
  const parts = dependency.split('/');

  for (let i = parts.length; i > 0; i--) {
    const possibleName = parts.slice(0, i).join('/');
    if (dependencies.includes(possibleName)) return true;
  }

  return false;
}

const findPackageJson = (curPath: string): string => {
  const packagePath = path.join(curPath, 'package.json');
  if (fs.existsSync(packagePath)) return packagePath;

  return findPackageJson(path.join(curPath, '..'));
}

const findTwoPackageJsons = (curPath: string): string[] => {
  const firstPackageJson = findPackageJson(curPath);
  const firstPackageDir = getPathWithoutFile(firstPackageJson);

  // TODO: Preferably only read the packages once
  // This is a quick workaround to catch files that hang between
  // root and children packages in a monorepo
  // we assume that the package.json containing eslint is in the root
  if (getDependenciesFromPackageJson(firstPackageJson).includes('eslint')) {
    return [firstPackageJson];
  }
  const secondPackageJson = findPackageJson(path.join(firstPackageDir, '..'));
  return [firstPackageJson, secondPackageJson];
}

const getDependenciesFromPackageJson = (file: string): string[] => {
  const packageJson = JSON.parse(fs.readFileSync(file, 'utf-8'));
  return [
    ...Object.keys(packageJson.dependencies || []),
    ...Object.keys(packageJson.devDependencies || []),
    ...Object.keys(packageJson.peerDependencies || []),
  ]
};

const getDependenciesFromPackageJsons = (files: string[]): string[] =>
  files.map(getDependenciesFromPackageJson).flat();

const getPathWithoutFile = (file: string): string => {
  const parts = file.split('/');
  parts.pop();
  return parts.join('/');
}

const isDependency = (importName: string): boolean =>
  !!!(importName.match(/^\.{1,2}\//));

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: "disallow the import of dependencies not added to package.json",
      category: "Possible Errors",
      recommended: true
    },
    schema: [], // no options
    messages: {
      unlistedPackage: "'{{package}}' is imported but has not been added to any package.json.",
    },
  },
  create: context => {
    // const filenames = fs.readdirSync(`${__dirname}/../../../`);

    // console.log("\nCurrent directory filenames:");
    // filenames.forEach(file => {
    //   console.log(file);
    // });
    // console.log("[FILENAME]");

    // console.log(JSON.stringify(context.getFilename()));
    // console.log("[PACKAGES]");

    const filePath = getPathWithoutFile(context.getFilename());
    const packages = findTwoPackageJsons(filePath);
    const dependencies = getDependenciesFromPackageJsons(packages);
    // console.log(JSON.stringify(findTwoPackageJsons(filePath)));
    // console.log(JSON.stringify(dependencies));

    return {
      ImportDeclaration: (node) => {
        if (!node.specifiers.length) return; // ignore plain less imports and such

        const importName = node.source.value?.toString() || '';
        if (!importName || !isDependency(importName)) return;

        if (!dependencyIsInDependencyList(importName, dependencies)) {
          context.report({
            // message: `Dependency ${importName} has not been added to either package.json`,
            node,
            messageId: 'unlistedPackage',
            data: {
              package: importName
            }
          });
        }
      }
      // CallExpression: function (node) {
      //   const callee = node.callee as any;
      //   // console.log(callee);
      //   if (
      //     callee.object &&
      //     callee.object.name === 'yup' &&
      //     callee.property &&
      //     callee.property.name === 'validateSync'
      //   ) {
      //     // check one of the parents to see if "CHECK &&" is present
      //     const calleeLogicalExpression = callee.parent.parent;
      //     if (calleeLogicalExpression.type !== 'LogicalExpression') {
      //       // if that "grand parent" expression is not of type 'LogicalExpression' (meaning there's no logical operator || or &&)
      //       // or that the left part of that expression is not CHECK (the right part being yup.validateSync)
      //       // then we report this case as a lint error
      //       context.report({ node, messageId: 'unexpected' });
      //     }
      //   }
      // }

      // "CallExpression > MemberExpression > Identifier.property[name='apply']": (node: Node) => {
      //   context.report({
      //     // message: "Don't use 'apply'",
      //     message: `Hello ${context}`,
      //     node,
      //   });
      // },
    };
  },
};

export = rule;
