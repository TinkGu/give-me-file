# give-me-file

> generate files by generators, inspired of vue-cli

# NOTE

**just copy some code from vue-cli@2, thanks for their work**

# Install

```bash
npm i give-me-file -g
```

# Usage

you can use this cli tool as vue-cli@2.x, you can see the basic usage at its docs: [vuejs/vue\-cli: 🛠️ CLI for rapid Vue\.js development](https://github.com/vuejs/vue-cli)

give-me-file just add some convient features, such as

## use template in repo subdir

> `--dir <dirname>` : run gmfile with a specified directory at the repo

Look at the files tree of TinkGu/my-templates

```
- package.json
- meta.js
- template/a.js
- sub
  - meta.js
  - template/b.js
```

run this cmd, you may get `a.js`

```bash
gmfile TinkGu/my-templates my-project
```

run this cmd, you may get `b.js`

```bash
gmfile TinkGu/my-templates my-project --dir sub
```

## task

task will run before/after generating files

```javasript
// meta.js

module.exports = {
  // ...
  task: {
    before: gt => {
      // print sth
      gt.helpers.logger.log('using gmfile')
    },
    after: gt => {
      // update package.json
      gt.pkg.update(pkg => ({
        ...pkg,
        scripts: {
          ...(pkg.scripts || {}),
          lint: 'eslint src'
        }
      }))
    }
  }
}
```

## install deps for meta.js

```bash
gmfile TinkGu/my-templates my-project --install
```

then gmfile will install the deps at package.json for this repo, only after downloading.

# api

task-api

```typescript
interface Task {
  (gt: GT) => void
}

interface GT {
  metalsmith: Metalsmith,
  meta: Meta, // the meta obj you defined in meta.js
  helpers: {
    chalk: Chalk, // see npm package called chalk
    logger: Logger,
  },
  pkg: {
    read: (path?: string) => Promise,
    write: (path?: string, obj: Object) => Promise,
    update: (path?: string, setter: object => object) => Promise,
  }
}

interface Logger {
  log: string => void,
  success: string => void,
  fatal: string => void,
}
```

you can see the api for Metalsmith at  [segmentio/metalsmith](https://github.com/segmentio/metalsmith/blob/master/lib/index.js)
