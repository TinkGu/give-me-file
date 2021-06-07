const path = require('path');
const fs = require('fs-extra');
const writePkg = require('write-pkg');

const merge = (f, x) => (typeof f === 'function' ? f(x) : Object.assign({}, x, f));

function extendsPkg(pk, v) {
  const props = Object.keys(v);
  return props.reduce((res, prop) => {
    const propV = res[prop];
    const newPropV =
      typeof propV === 'object'
        ? {
            ...res[prop],
            ...v[prop],
          }
        : v[prop];
    return {
      ...res,
      [prop]: newPropV,
    };
  }, pk);
}

/** provide get/set utils for the package.json of the generated project */
module.exports = function pkg(dest) {
  const defaultPkg = path.join(dest, 'package.json');
  const read = (p) => require(p || defaultPkg);
  const write = (v, p) => writePkg(p || defaultPkg, v);
  const update = (setter, p) => {
    const pkgpath = p || defaultPkg;
    if (fs.existsSync(pkgpath)) {
      const data = read(p);
      return write(merge(setter, data), p);
    } else {
      return Promise.resolve();
    }
  };
  const _merge = (v, p) => update((x) => extendsPkg(x, v), p);

  return {
    read,
    write,
    update,
    merge: _merge,
  };
};
