const fs = require('fs');
const readline = require('readline');
const command = require('./command.js');
const file = require('./file.js');
const cli = require('./cli.js');

async function Substitute() {
  let writeStream;
  let fileStream;
  const input = command.parseInput(cli.commands);

  if (input.i) {
    const { newFilePath, absoluteFilePath } = file.makeFileCopy(input.path);
    writeStream = fs.createWriteStream(newFilePath);
    fileStream = fs.createReadStream(absoluteFilePath);
  } else {
    fileStream = fs.createReadStream(input.path);
  }
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (let line of rl) {
    let cmd = '';
    let originalLine = line;
    let isLineReplaced = false;
    for (cmd of input.commands) {
      cmd = command.buildCommand(cmd);
      if (cmd.g) {
        // eslint-disable-next-line prefer-const
        let searchExp = new RegExp(cmd.search, 'g');
        line = line.replace(searchExp, cmd.replace);
      } else {
        line = line.replace(cmd.search, cmd.replace);
      }

      isLineReplaced = originalLine !== line;
      if (isLineReplaced) {
        originalLine = line;
        if (input.i) {
          writeStream.write(`${line}\n`);
        } else if (cmd.p) {
          process.stdout.write(`${line}\n`);
        }
      }
    }
    if (!input.n) {
      if (input.i) {
        writeStream.write(`${line}\n`);
      } else {
        process.stdout.write(`${line}\n`);
      }
    }
  }
}

module.exports = { Substitute };
