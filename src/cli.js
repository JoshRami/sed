const yargs = require('yargs/yargs')(process.argv.slice(2));

exports.commands = yargs
  .command('f', 'expects a file path containing commands', {
    url: {
      alias: 'file',
      default: undefined,
    },
  })
  .command('e', 'accept a command', {
    url: {
      default: undefined,
    },
  })
  .option('n', {
    demandOption: false,
    default: false,
    describe: 'line should not be printed unless specified',
    type: 'boolean',
  })
  .option('i', {
    demandOption: false,
    default: false,
    describe: 'output will be save in a new file',
    type: 'boolean',
  })
  .help().argv;
