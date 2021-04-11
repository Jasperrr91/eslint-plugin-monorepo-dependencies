
# Enforce imported modules to be listed in package.json (`no-unlisted-package-import`)

Ensure that only dependencies specified in any of the `package.json`'s (root/module level) are imported.

## Rule details

This rule triggers when a dependency gets imported that has not been specified in any of the `package.json`'s files relating to the current file. This prevents a possible dependency contamination where monorepo application A accidentally uses dependencies managed by application B.

This rule looks at dependencies specified in:

 - dependencies
 - devDependencies
 - peerDependencies

Considering the following `package.json`:
```json
{
  "name": "@monorepo/application-a",
  "version": "1.0.0",
  "devDependencies": {
    "jest": "26.6.3",
    "prettier": "2.2.1",
  },
}
```

Examples of **incorrect** code for this rule:

```js
import Foobar from  'foobar';

import { foo } from  'foobar';
```

Examples of **correct** code for this rule:

```js
import Foobar from  'jest';

import { foo } from  'jest';

import someLocalDependency from  './utils/dependency';
```
