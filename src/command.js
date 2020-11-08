const file = require('./file.js');

const parseInput = (argv) => {
  const commands = {
    commands: [],
    n: argv.n,
    i: argv.i,
    path: '',
  };
  const hasManyCommands = hasOptions(argv);

  if (!hasManyCommands) {
    const parsedCommand = getValidCommand(argv._[0]);
    const filePath = file.getCheckedFilePath(argv._[1]);
    commands.commands.push(parsedCommand);
    commands.path = filePath;
  } else {
    const parsedCommands = parseCommands(argv);
    const filePath = file.getCheckedFilePath(argv._[0]);
    commands.commands.push(...parsedCommands);
    commands.path = filePath;
  }

  return commands;
};
const parseCommands = (argv) => {
  let commands = [];
  let commandsFilePath = '';
  if (argv.e) {
    commands.push(...argv.e);
  }
  if (argv.f) {
    commandsFilePath = file.getCheckedFilePath(argv.f);
    commands.push(...file.readCommands(commandsFilePath));
  }
  commands = commands.filter((command) => {
    return isValidCommand(command);
  });
  return commands;
};

const containsFlags = (searchString, ...paramsStr) => {
  return paramsStr.some((str) => {
    return searchString.includes(str) && str.length === searchString.length;
  });
};
const hasOptions = (argv) => {
  const FILESCRIPT = 'f';
  const MULTIPLE_COMMANDS = 'e';
  return FILESCRIPT in argv || MULTIPLE_COMMANDS in argv;
};

const isValidCommand = (cmd) => {
  try {
    const PARTS_LENGTH = 4;
    const cmdParts = cmd.split('/');

    if (cmdParts.length !== PARTS_LENGTH) {
      return false;
    }
    const [command, search, , flags] = cmdParts;
    const isSubsitute = command === 's';
    const nonEmptySearch = search !== '';
    const validFlags =
      flags === '' || containsFlags(flags, 'g', 'p', 'gp', 'pg');
    return isSubsitute && nonEmptySearch && validFlags;
  } catch (error) {
    throw Error(error.message);
  }
};
const getValidCommand = (command) => {
  if (isValidCommand(command)) {
    return command;
  }
};
console.log(parseInput(require('./cli.js').commands));
