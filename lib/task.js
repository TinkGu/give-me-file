const chalk = require('chalk');
const pkgUtils = require('./utils/pkg-utils');

function injectHook(hook) {
  return (callback) => {
    return {
      hook,
      callback,
    };
  };
}

const HOOKS = {
  beforeAsk: 'beforeAsk',
  afterAsk: 'afterAsk',
  complete: 'complete',
};

const when = {
  beforeAsk: injectHook(HOOKS.beforeAsk),
  afterAsk: injectHook(HOOKS.afterAsk),
  complete: injectHook(HOOKS.complete),
};

/** create tasks from constructor */
async function resolveTasks(ctor, config) {
  if (typeof ctor !== 'function') {
    throw new Error('meta.task must be a function');
  }

  const api = {
    pkg: pkgUtils(config.dest),
    chalk,
  };
  const tasks = await ctor(when, api);
  if (!Array.isArray(tasks)) {
    throw new Error('meta.task must return an array');
  }

  return tasks;
}

/** run the tasks with specified hook */
async function runTasks(tasks, hook, ...args) {
  if (!tasks) {
    return;
  }

  if (!tasks.length) {
    return;
  }

  try {
    const callbacks = tasks.filter((x) => x.hook === hook && typeof x.callback === 'function').map((x) => x.callback);
    for (let callback of callbacks) {
      await callback(...args);
    }
  } catch (err) {
    err.message = `\n    Error when running task at ${chalk.red(hook)}, see: \n ${err.message}`;
    throw err;
  }
}

module.exports = {
  runTasks,
  resolveTasks,
  HOOKS,
};
