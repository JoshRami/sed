const fs = require('fs');
const readline = require('readline');
const command = require('./command.js');
const file = require('./file.js');
const cli = require('./cli.js');

async function Substitute() {
  let writeStream;
  const input = command.parseInput(cli.commands);
  const fileStream = fs.createReadStream(input.path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  if (input.i) {
    const newFilePath = file.createEmptyFile(input.path);
    writeStream = fs.createWriteStream(newFilePath);
  }
  const linesInFile = file.countInputFileLines(input.path);

  let countLines = 1;
  for await (const line of rl) {
    let cmd = '';
    let newLine = line;
    const isLastLine = linesInFile === countLines;
    let isLastCommand;
    for (cmd of input.commands) {
      isLastCommand =
        input.commands.lastIndexOf(cmd) === input.commands.length - 1;
      newLine = replaceLine(newLine, cmd.search, cmd.replace, cmd.g);
      if (newLine !== line && cmd.p) {
        outputLine(
          newLine,
          writeStream,
          input.i,
          isLastLine,
          isLastCommand,
          input.n
        );
      }
    }

    if (!input.n) {
      outputLine(
        newLine,
        writeStream,
        input.i,
        isLastLine,
        isLastCommand,
        true
      );
    }
    countLines += 1;
  }
}

const replaceLine = (line, search, replace, isGlobal) => {
  let newLine = line;
  if (isGlobal) {
    const searchExp = new RegExp(search, 'g');
    newLine = line.replace(searchExp, replace);
  } else {
    newLine = line.replace(search, replace);
  }
  return newLine;
};
const outputLine = (
  line,
  writeStream,
  i,
  isLastLine,
  isLastCommand,
  lastOutput
) => {
  if (i) {
    isLastLine && isLastCommand && lastOutput
      ? writeStream.write(`${line}`)
      : writeStream.write(`${line}\n`);
  } else {
    isLastLine && isLastCommand && lastOutput
      ? process.stdout.write(`${line}`)
      : process.stdout.write(`${line}\n`);
  }
};
module.exports = { Substitute };
