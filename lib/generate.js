const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const ejs = require('ejs');
const getAllFiles = require('./utils/get-all-files');

const replacementMap = {
  _gitignore: '.gitignore',
  _npmrc: '.npmrc',
};

module.exports = async function generate({ template, dest, metadata, logLevel }) {
  const files = getAllFiles(template);
  const tmpDir = path.join(global.os.tmpdir(), 'give-me-file');
  const resolveDest = (file) => {
    const filename = path.basename(file);
    // replace some filename
    if (filename in replacementMap) {
      const dirname = path.dirname(file);
      file = path.join(dirname, replacementMap[filename]);
    }
    return path.join(tmpDir, path.relative(template, file));
  };

  // clean tmp
  await fs.remove(tmpDir);
  for (let file of files) {
    try {
      const str = await ejs.renderFile(file, metadata.renderData, {
        async: true,
      });
      const destFile = resolveDest(file);
      await fs.outputFile(destFile, str);
      if (logLevel === 'info') {
        console.log();
        console.log(`success: ${chalk.green(destFile)}`);
      }
    } catch (err) {
      err.message = `[${file}] ${err.message}`;
      fs.remove(tmpDir);
      throw err;
    }
  }
  await fs.copy(tmpDir, dest);
  await fs.remove(tmpDir);
};
