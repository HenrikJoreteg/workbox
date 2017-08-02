const chalk = require('chalk');

const prefix = function() {
  return chalk.inverse(`[Workbox Infra]:`);
};

module.exports = {
  log: (...arguments) => {
    console.log(prefix(), ...arguments);
  }
};
