const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const ejs = require('ejs');
const getAllFiles = require('./utils/get-all-files');
const resolveThisPkg = require('./utils/resolve-this-pkg');

module.exports = async function generate({ template, dest, metadata, logLevel }) {
  const files = getAllFiles(template);
  const tmpDir = resolveThisPkg('tmp');
  const resolveDest = (file) => path.join(tmpDir, path.relative(template, file));

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
