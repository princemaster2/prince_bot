// commands.js
const chalk = require("chalk");
const figlet = require("figlet");

const color = (text, color) => {
  return !color ? chalk.green(text) : chalk.keyword(color)(text);
};

module.exports = { color, figlet };
