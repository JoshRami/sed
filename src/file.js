const fs = require('fs');

const isValidFile = (path, writable = false) => {
  const permissions = [fs.constants.F_OK, fs.constants.R_OK];
  if (writable) {
    permissions.push(fs.constants.W_OK);
  }
  try {
    fs.accessSync(path, ...permissions);
    return true;
  } catch (error) {
    // Not returns a Error object because it's not intended to show the error stack trace
    console.error('No such file, or does not have enough permissions');
    process.exit();
  }
};
const getCheckedFilePath = (path) => {
  if (isValidFile(path)) {
    return path;
  }
};

const createFile = (path) => {
  fs.open(path, 'w', function (err) {
    if (err) throw err;
  });
};
const readCommands = (path) => {
  const commands = [];
  if (isValidFile(path)) {
    try {
      const data = fs.readFileSync(path, 'UTF-8');
      commands.push(...data.split(/\r?\n/));
    } catch (err) {
      console.log(
        `Something bad happened while reading process of file ${path}`
      );
    }
  }
  return commands;
};
module.exports = {
  createFile,
  readCommands,
  getCheckedFilePath,
};
