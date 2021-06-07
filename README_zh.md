# give-me-file

> 根据模板生成文件，灵感源自于 vue-cli@2.x

[中文](./README_zh.md)

# Install

以命令行模式安装（下一个版本中支持）

```bash
npm i give-me-file -g
```

在项目中使用

```bash
npm i give-me-file
```

# Usage

```javascript
const gm5 = require('give-me-file');

gm5({
  // 本地模板代码路径
  src: path.resolve(__dirname, 'src'),
  // 文件生成时的目标路径
  dest: path.resolve(__dirname, 'dist'),
});
```

# 工作流程

- 根据 meta.js 询问项目配置
- 读取 template 文件，根据项目配置，渲染模板
- 将渲染好的模板拷贝到目标目录

# 原始代码和模板

原始代码必须满足以下的目录结构

```
- meta.js       # 定制化语句
- template/     # 模板代码
```

其中，template 中的文件，除原样拷贝外，支持插入 `ejs` 语法，`ejs` 变量来自开始渲染前，问答式询问保存的配置。
具体 ejs 语法请查看 [EJS \-\- Embedded JavaScript templates](https://ejs.co/#docs)

## 询问项目配置

通过 `meta.js` 中的 `prompts` ，唤起命令行交互界面，可以向用户询问项目配置，保存为用于模板渲染时的变量。

例如

```javascript
// some settings for creating eslintrc.js
module.export = {
  prompts: {
    preset: {
      type: 'list',
      message: 'Pick an ESLint preset',
      choices: [
        {
          name: 'airbnb',
          value: 'airbnb-react',
        },
        {
          name: 'airbnb-base',
          value: 'airbnb-base',
        },
      ],
    },
    withWebpack: {
      type: 'confirm',
      message: 'expose webpack to eslint?',
      default: false,
    },
    webpackConfig: {
      when: 'withWebpack',
      type: 'string',
      message: 'where is your webpack config file?',
      default: 'webpack.config.js',
    },
  },
};

// 执行成功后，ejs 可以获得这样的数据结构

metadata.renderData = {
  preset: 'airbnb-base',
  withWepack: true,
  webpackConfig: 'webpack.config.js',
};
```

更详细的配置请查看 [inquirer.js](https://github.com/SBoudrias/Inquirer.js#question)

## 任务

在 `meta.js` 中，可以配置 `task` 函数，辅助用户在生成文件之前或之后，执行一些任务

```javascript
// meta.js

module.exports = {
  // ...
  task(when, helpers) {
    return [
      // 在进行「命令行问答交互」前运行
      when.beforeAsk((metadata) => {
        console.log('before ask');
      }),
      // 在进行「命令行问答交互」后运行
      when.afterAsk((metadata) => {
        // 注入其他更多的渲染数据
        metadata.renderData.a = 1;
      }),
      // 在生成文件后执行
      when.complete((metadata) => {
        // 修改 package.json
        helpers.pkg.update((pkg) => ({
          ...pkg,
          scripts: {
            ...(pkg.scripts || {}),
            lint: 'eslint src',
          },
        }));
      }),
    ];
  },
};
```

# api

## gmfile

```typescript
interface GmfileConfig {
  /** 源码所在目录，绝对路径 */
  src: string;
  /** 生成代码所在目录，绝对路径 */
  dest: string;
}
```

## metadata

```typescript
interface Metadta {
  /** 源码所在目录，绝对路径 */
  src: string;
  /** 生成代码所在目录，绝对路径 */
  dest: string;
  /** 模板渲染数据 */
  renderData: Record<string, any>;
  /** 任务 */
  task?: Task[];
}
```

## Task

```typescript
interface Task {
  hook: string;
  callback: Function;
}
```

```typescript
interface TaskConstructor {
  (when: When, api: Helpers) => Task[];
}

interface When {
  /** 在进行「命令行问答交互」前运行 */
  beforeAsk: (metadata: Metadata) => void;
  /** 在进行「命令行问答交互」后运行 */
  afterAsk: (metadata: Metadata) => void;
  /** 在生成文件后执行 */
  complete: (metadata: Metadata) => void;
}

interface Helpers {
  chalk: Chalk, // see npm package called chalk
  pkg: {
    read: (path?: string) => Package,
    write: (obj: Object, path?: string) => Promise,
    update: (setter: object => object, path?: string) => Promise,
    merge: (v: Object, path?: string) => Promise
  },
}
```

# RoadMap

- [ ] 支持 cli 模式
- [ ] 支持远程仓库
