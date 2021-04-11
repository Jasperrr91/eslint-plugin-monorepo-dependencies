import { RuleTester } from "eslint";

import rule from "./no-unlisted-package-import";

const tester = new RuleTester({ parserOptions: { ecmaVersion: 2015, sourceType: "module" } });

tester.run("no-unlisted-package-import", rule, {
  valid: [{ code: `import Foo from 'typescript'` }, { code: `import Bar from 'eslint'` }, { code: `import Bar from 'eslint/innerpath'` }],
  invalid: [
    {
      code: `import Foo from 'foobar'`,
      errors: [{ message: "'foobar' is imported but has not been added to any package.json." }],
    },
    {
      code: `import Store from 'redux'`,
      errors: [{ message: "'redux' is imported but has not been added to any package.json." }],
    },
  ],
});
