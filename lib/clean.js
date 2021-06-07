const fs = require('fs-extra');
const path = require('path');

const excludes = ['node_modules', '.git'];

module.exports = async function clean(dir) {
  const files = await fs.readdir(dir);

  for (const file of files) {
    if (!excludes.includes(file)) {
      await fs.remove(path.join(dir, file));
    }
  }
};
