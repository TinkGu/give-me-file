const path = require('path')
const readPkg = require('read-pkg')
const writePkg = require('write-pkg')
const exists = require('fs').existsSync
const exec = require('child_process').execSync

const merge = (f, x) => typeof f === 'function' ? f(x) : Object.assign({}, x, f)

module.exports = function taskApi (args) {
  const dest = args.metalsmith.destination()
  return Object.assign({}, args, {
    pkg: pkg(dest),
    install: installDeps('-S')(dest),
    installDev: installDeps('-D')(dest)
  })
}

function installDeps (flags) {
  return dest => pkgs => {
    const pkgsList = typeof pkgs === 'string' ? [pkgs] : pkgs
    const pkgsStr = pkgsList.join(' ')
    exec(`npm install ${flags} ${pkgsStr}`, { cwd: dest })
  }
}

function pkg (dest) {
  const defaultPkg = path.join(dest, 'package.json')
  const read = p => readPkg(p || defaultPkg)
  const write = (p, v) => writePkg(p || defaultPkg, v)
  const update = (setter, p) => {
    const pkgpath = p || './package.json'
    if (exists(pkgpath)) {
      return read(p).then(x => write(p, merge(setter, x)))
    } else {
      return Promise.resolve()
    }
  }

  return {
    read,
    write,
    update
  }
}
