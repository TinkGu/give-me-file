# give-me-file

> 根据模板生成文件，灵感源自于 vue-cli@2.x

[中文](./README_zh.md)

# NOTE

**有些代码直接 copy vue-cli@2 源码, 非常感谢他们的开源工作**

# Install

```bash
npm i give-me-file -g
```

# Usage

主要用法非常类似于 vue-cli@2.x，可以参照它的官方文档 [vuejs/vue\-cli: 🛠️ CLI for rapid Vue\.js development](https://github.com/vuejs/vue-cli)

```bash
gmfile github远程仓库 本地项目文件夹地址
```

gmfile 主要加入了以下特性：

## 允许使用模板仓库中的子文件夹

> `--dir <dirname>` : run gmfile with a specified directory at the repo

vue-cli 默认使用仓库下的 template 文件夹作为模板源文件。但有时，虽然需要配置相同的功能（比如都是 eslint），其模板可能完全不同，此时直接写成多个不同的文件夹，而非 if-else 更有助于维护。


比如远程模板仓库的文件目录为：

```
- package.json
- meta.js
- template/a.js
- sub
  - meta.js
  - template/b.js
```

运行以下命令，你会得到 `a.js`

```bash
gmfile TinkGu/my-templates my-project
```

指定 `--dir`，则可以得到 `b.js`

```bash
gmfile TinkGu/my-templates my-project --dir sub
```

## 任务

在生成文件之前或之后，执行一些任务


比如

```javascript
// meta.js

module.exports = {
  // ...
  task: {
    // 在进行「命令行问答交互」前运行
    before: api => {
      // print sth
      api.helpers.logger.log('using gmfile')
    },

    // 在进行「命令行问答交互」后运行
    afterAsk: api => {
      // modify your renderData here!
      const renderData = api.metalsmith.metadata()
      if (renderData.a === true) {
        api.extraRenderData.merge({
          b: true,
        })
      }
    },

    // 在生成文件后执行
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

## 为 `meta.js` 自动安装依赖

```bash
gmfile TinkGu/my-templates my-project --install
```

只要加上 `--install` 就会通过 package.json 自动安装依赖

## 模板片段

在你的模板仓库里，添加一个 `partial` 目录，该目录下的文件，可以用于 render 你的 templates

```
- meta.js
- partial/
  - p.js
  - .rc
- template
  a.js
```

partial 的写法和 template 完全一样，它可以被嵌入到 template 中。

```bash
# partial/p.js

this is a partial, pass name to here : {{ name }}
```

通过 `{{> 文件名 属性名="属性值" }}` 的方式就可以引用 partial 了

**注意：文件名中的 `.` 必须用 `_` 代替**

比如
- `.a.js` -> `_a_js`
- `.rc` -> `_rc`

```bash
# template/a.js

{{> p_js name="a" }}
```

```bash
# output

this is a partial, pass name to here : a
```

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
    write: (obj: Object, path?: string) => Promise,
    update: (setter: object => object, path?: string) => Promise,
    merge: (v: Object, path?: string) => Promise
  },
  install: (deps: string | string[]) => void, // install deps
  installDev: (deps: string | string[]) => void, // install dev deps
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

关于 `Metalsmith` 可以查阅这个文档 [segmentio/metalsmith](https://github.com/segmentio/metalsmith/blob/master/lib/index.js)
