const fs = require('fs')
const path = require('path')

module.exports = function getPartials (dir) {
  const partials = []
  if (fs.existsSync(dir)) {
    const filenames = fs.readdirSync(dir)
    filenames.forEach(function (filename) {
      const fullpath = path.join(dir, filename)
      if (isFile(fullpath)) {
        const pathinfo = path.parse(filename)

        partials.push({
          fullpath,
          pathinfo,
          name: transDotTo_(pathinfo.base),
          template: fs.readFileSync(fullpath, 'utf8')
        })
      }
    })
  }

  return partials
}

function transDotTo_ (str) {
  return str.split('').map(s => s === '.' ? '_' : s).join('')
}

function isFile (path) {
  return fs.statSync(path).isFile()
}
