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

```javascript
// meta.js

module.exports = {
  // ...
  task: {
    // run before ask
    before: api => {
      // print sth
      api.helpers.logger.log('using gmfile')
    },

    // run after ask
    afterAsk: api => {
      // modify your renderData here!
      const renderData = api.metalsmith.metadata()
      if (renderData.a === true) {
        api.extraRenderData.merge({
          b: true,
        })
      }
    },

    // run after generate
    complete: api => {
      // update package.json
      api.pkg.update(pkg => ({
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

## partial

you can add partial dir to your repo, then you can use these partials render your templates.

```
- meta.js
- partial/
  - p.js
  - .rc
- template
  a.js
```

```bash
# partial/p.js

this is a partial, pass name to here : {{ name }}
```

```bash
# template/a.js

{{> p_js name="a" }}
```

```bash
# output

this is a partial, pass name to here : a
```

### NOTE

**dot `.` in filename will be translate to `_`**

example:

- `.a.js` -> `_a_js`
- `.rc` -> `_rc`


# api

task-api

```typescript
interface Task {
  (api: TaskApi) => void
}

interface TaskApi {
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
  },
  extraRenderData: {
    get: () => Object,
    set: (v: Object) => void, // reassign extraRenderData
    merge: (v: Object) => void, // merge v to extraRenderData
  }
}

interface Logger {
  log: string => void,
  success: string => void,
  fatal: string => void,
}
```

you can see the api for Metalsmith at  [segmentio/metalsmith](https://github.com/segmentio/metalsmith/blob/master/lib/index.js)
