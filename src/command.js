const file = require('./file.js');

const parseCommands = (argv) => {
  const commands = { commands: [], n: argv.n, i: argv.i, path: '' };
  const hasManyCommands = hasOptions(argv);
  if (!hasManyCommands) {
    const { filePath, command } = parseSingleCommand(argv);
    if (!filePath) {
      throw Error('File not exist, or does not have permissions');
    }
    commands.commands.push(command);
    commands.path = filePath;
  }
  return commands;
};

const isValidCommand = (cmd) => {
  const PARTS_LENGTH = 4;
  const cmdParts = cmd.split('/');

  if (cmdParts.length !== PARTS_LENGTH) {
    return false;
  }
  const [command, search, , flags] = cmdParts;
  const isSubsitute = command === 's';
  const nonEmptySearch = search !== '';
  const validFlags = useFlags(flags, 'g', 'p', 'gp', 'pg') || flags !== '';
  return isSubsitute && nonEmptySearch && validFlags;
};
const useFlags = (searchString, ...paramsStr) => {
  return paramsStr.some((str) => {
    return searchString.includes(str) && str.length === searchString.length;
  });
};
const hasOptions = (argv) => {
  const FILESCRIPT = 'f';
  const MULTIPLE_COMMANDS = 'e';
  return FILESCRIPT in argv && MULTIPLE_COMMANDS in argv;
};
const parseSingleCommand = (argv) => {
  const filePath = argv._[1];
  const command = argv._[0];
  const parsedCmd = { filePath: undefined, command: undefined };

  if (file.isValidFile(filePath)) {
    parsedCmd.filePath = filePath;
  }
  if (isValidCommand(command)) {
    parsedCmd.command = command;
  }
  return parsedCmd;
};
