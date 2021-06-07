const path = require('path');

module.exports = function resolveThisPkg(p) {
  return path.resolve(__dirname, '../../', p);
};
