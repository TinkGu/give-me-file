const readPkg = require('read-pkg')
const writePkg = require('write-pkg')

const merge = (f, x) => typeof f === 'function' ? f(x) : Object.assign({}, x, f)
const updatePkg = (p, setter) => readPkg(p).then(x => writePkg(p, merge(setter, x)))

const pkg = {
  read: readPkg,
  write: writePkg,
  update: updatePkg
}

module.exports = function taskApi (metalsmith, meta, helpers) {
  return {
    metalsmith,
    meta,
    helpers,
    pkg
  }
}
