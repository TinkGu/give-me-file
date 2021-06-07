const ora = require('ora');
const path = require('path');
const ask = require('./ask');
const clean = require('./clean');
const generate = require('./generate');
const preCheck = require('./pre-check');
const { runTasks, HOOKS } = require('./task');

module.exports = async function giveMeFile({ src, dest }) {
  let cleanSpin;
  let genSpin;
  try {
    const result = await preCheck({ src, dest });
    const isOk = result && result.ok;
    if (!isOk) {
      return;
    }

    if (result.clean) {
      cleanSpin = ora('clean target dir').start();
      await clean(dest);
      cleanSpin.succeed();
    }

    const { metadata } = result;
    metadata.src = src;
    metadata.dest = dest;
    await runTasks(metadata.task, HOOKS.beforeAsk, metadata);
    const answers = await ask(metadata);
    await runTasks(metadata.task, HOOKS.afterAsk, metadata);
    metadata.renderData = answers;
    genSpin = ora('generate files').start();
    await generate({
      dest,
      metadata,
      template: path.join(src, 'template'),
    });
    genSpin.succeed();
    await runTasks(metadata.task, HOOKS.complete, metadata);
  } catch (err) {
    cleanSpin && cleanSpin.stop();
    genSpin && genSpin.stop();
    if (err && err.code) {
      console.error(err.message || err);
      return;
    }
    console.error(err);
    return;
  }
};
