const path = require('path')
const exec = require('child_process').execSync
const exists = require('fs').existsSync
const ora = require('ora')
const logger = require('./logger')

module.exports = function installPkg (cwd) {
  const spinner = ora('install the dependencies...')
  const pkgPath = path.join(cwd, 'package.json')
  spinner.start()

  try {
    if (exists(pkgPath)) {
      exec('npm install --only=prod', { cwd })
    }
    spinner.stop()
    console.log()
    logger.success('Installed dependencies!')
  } catch (err) {
    spinner.stop()
    logger.fatal(err)
  }
}
