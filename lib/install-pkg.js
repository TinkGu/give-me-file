const exec = require('child_process').execSync
const ora = require('ora')
const logger = require('./logger')

module.exports = function installPkg (cwd) {
  const spinner = ora('install the dependencies...')
  spinner.start()

  try {
    exec('npm install --only=prod', { cwd })
    spinner.stop()
    console.log()
    logger.success('Installed dependencies!')
  } catch (err) {
    spinner.stop()
    logger.fatal(err)
  }
}
