const fs = require('fs-extra');

const blacklist = ['.git', 'node_modules', '.vscode'];

module.exports = function getAllFiles(dir, result) {
  result = result || [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (let i = 0; i < files.length; i++) {
    const name = dir + '/' + files[i].name;
    if (blacklist.includes(files[i].name)) {
      continue;
    }
    if (files[i].isDirectory()) {
      getAllFiles(name, result);
    } else {
      result.push(name);
    }
  }
  return result;
};
