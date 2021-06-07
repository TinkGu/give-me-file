/**
 * the prompt object config: https://github.com/SBoudrias/Inquirer.js#question
 */
const inquirer = require('inquirer');

module.exports = async function ask(metadata) {
  const prompts = metadata && metadata.prompts;
  if (!prompts) {
    return {};
  }

  try {
    const answers = await inquirer.prompt(metadata.prompts);
    return answers;
  } catch (err) {
    console.error(err?.message);
  }
};
