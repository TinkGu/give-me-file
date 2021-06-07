const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ERR_CODE = require('./utils/err-code');
const { resolveTasks } = require('./task');

module.exports = async function preCheck({ src, dest }) {
  let metadata = {};
  const isDestExists = await fs.existsSync(dest);
  if (isDestExists) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        message: 'Target directory exists. Continue?',
        name: 'ok',
      },
    ]);
    if (!answers.ok) {
      return;
    }
  }

  // check src dir is exists
  const isSrcExists = await fs.existsSync(src);
  if (!isSrcExists) {
    throw {
      code: ERR_CODE.NO_SRC,
      message: `can not found the src dir, please check ${chalk.yellow(src)}`,
    };
  }

  const isTemplateExists = await fs.existsSync(path.join(src, 'template'));
  if (!isTemplateExists) {
    throw {
      code: ERR_CODE.NO_TEMPLATE,
      message: `can not found the ${chalk.green('[template]')} dir under the src dir: ${chalk.yellow(src)}`,
    };
  }

  // get meta.js
  const metaPath = path.join(src, 'meta.js');
  const isMetaJsExists = await fs.existsSync(metaPath);
  if (isMetaJsExists) {
    const rawMetaData = require(metaPath);
    if (rawMetaData) {
      metadata = rawMetaData;
    }

    // check task ctor
    if (metadata.task) {
      const rawTask = metadata.task;
      metadata.task = await resolveTasks(rawTask, { dest });
      metadata.rawTask = rawTask;
    }
  }

  return {
    ok: true,
    // TODO: should clean
    clean: true,
    metadata,
  };
};
