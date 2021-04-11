## Installation

```
$ yarn add --dev eslint eslint-plugin-jest
```

**Note:** If you installed ESLint globally then you must also install
`eslint-plugin-jest` globally.

## Usage

Add `monorepo-dependencies` to the plugins section of your `.eslintrc` configuration file. You
should omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["monorepo-dependencies"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "monorepo-dependencies/no-unlisted-package-import": "error"
  }
}
```

## Rules

<!-- begin base rules list -->

| Rule                                                                         | Description                                                     | Configurations   | Fixable      |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------------- | ------------ |
| [no-unlisted-package-import](docs/rules/no-unlisted-package-import.md)       | Enforce valid titles                                            | ![recommended][] |              |

<!-- end base rules list -->

## Credit

- [eslint-plugin-tutorial (serving as a template)](https://github.com/Quramy/eslint-plugin-tutorial)

## LICENSE

MIT
