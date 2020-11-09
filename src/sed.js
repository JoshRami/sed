const fs = require('fs');
const readline = require('readline');
const command = require('./command.js');
const file = require('./file.js');
const cli = require('./cli.js');
const { getDirectory } = require('./file.js');

async function Substitute() {
  let writeStream;
  const input = command.parseInput(cli.commands);
  const fileStream = fs.createReadStream(input.path);

  if (input.i) {
    const fileName = file.getFileName(input.path);
    const directory = getDirectory(input.path, fileName);

    const newfileName = `new_${fileName}`;
    const newFilePath = file.createEmptyFile(directory, newfileName);
    writeStream = fs.createWriteStream(newFilePath);
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
        if (cmd.p) {
          if (input.i) {
            writeStream.write(`${line}\n`);
          } else {
            process.stdout.write(`${line}\n`);
          }
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
