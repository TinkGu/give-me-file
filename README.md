# give-me-file

> generate files by generators, inspired of vue-cli

[中文](./README_zh.md)

# Install

in cli tools (not supported now)

```bash
npm i give-me-file -g
```

in your project

```bash
npm i give-me-file
```

# Usage

```javascript
const gm5 = require('give-me-file');

gm5({
  // source code dir in absolute path
  src: path.resolve(__dirname, 'src'),
  // output dir in absolute path
  dest: path.resolve(__dirname, 'dist'),
});
```

# How to work

- query your project configs by `meta.js`
- get files from `template` dir，render file with the configs you setted on the last step
- copy files to dest dir

# Rules for source code

the source code dir (aka `src` dir) should match the following directory structure

```
- meta.js       # your project configs and tasks
- template/
```

`template` just some `ejs` template files.
for details [EJS \-\- Embedded JavaScript templates](https://ejs.co/#docs)

## Ask for Configs

we want to show the cli ui to ask some questions, these configs will restored for rendering ejs templates.

you can handle this by setting the `prompts` filed in the `meta.js`

for example:

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

// after asking, you will get the following data to render ejs

metadata.renderData = {
  preset: 'airbnb-base',
  withWepack: true,
  webpackConfig: 'webpack.config.js',
};
```

this structure for prompts comes from [inquirer.js](https://github.com/SBoudrias/Inquirer.js#question)

## 任务

In `meta.js`, you can config `task` to run some tasks after some specific hooks.

```javascript
// meta.js

module.exports = {
  // ...
  task(when, helpers) {
    return [
      when.beforeAsk((metadata) => {
        console.log('before ask');
      }),
      when.afterAsk((metadata) => {
        // inject yet another renderData
        metadata.renderData.a = 1;
      }),
      when.complete((metadata) => {
        // modify the generated package.json
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
  /** source code dir, absoluted */
  src: string;
  /** output dir, absoluted */
  dest: string;
}
```

## metadata

```typescript
interface Metadta {
  src: string;
  dest: string;
  /** these data using in ejs templates */
  renderData: Record<string, any>;
  /** these tasks running atfer ask or generated files */
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
  beforeAsk: (metadata: Metadata) => void;
  afterAsk: (metadata: Metadata) => void;
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

- [ ] support cli
- [ ] download repo from remote
