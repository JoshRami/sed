const file = require('./file.js');

const parseCommands = (argv) => {
  const commands = {
    commands: [],
    n: argv.n,
    i: argv.i,
    path: '',
  };
  const hasManyCommands = hasOptions(argv);
  if (!hasManyCommands) {
    const { filePath, command } = parseSingleCommand(argv);
    commands.commands.push(command);
    commands.path = filePath;
    return commands;
  }
  const { filePath, manyCommands } = parseMultipleCommands(argv);
  commands.commands.push(...manyCommands);
  commands.path = filePath;

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
  const validFlags = flags === '' || containsFlags(flags, 'g', 'p', 'gp', 'pg');

  return isSubsitute && nonEmptySearch && validFlags;
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
const parseSingleCommand = (argv) => {
  const command = argv._[0];
  const filePath = argv._[1];

  const parsedCmd = { filePath: undefined, command: undefined };
  if (isValidCommand(command)) {
    parsedCmd.command = command;
  }
  if (file.isValidFile(filePath)) {
    parsedCmd.filePath = filePath;
  }

  return parsedCmd;
};
const parseMultipleCommands = (argv) => {
  let commands = [];
  const commandsFilePath = argv.f;
  const filePath = argv._[0];
  const parsedCmd = { filePath: undefined, manyCommands: [] };
  if (file.isValidFile(filePath)) {
    parsedCmd.filePath = filePath;
  }
  if (argv.e) {
    commands.push(...argv.e);
  }

  commands.push(...file.readCommands(commandsFilePath));
  commands = commands.map((command) => {
    return isValidCommand(command) ? command : undefined;
  });
  parsedCmd.manyCommands.push(...commands);
  return parsedCmd;
};
console.log(parseCommands(require('./cli.js').commands.argv));
