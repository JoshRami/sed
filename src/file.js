const fs = require('fs');
const path = require('path');

const isValidFile = (filePath, writable = false) => {
  const permissions = [fs.constants.F_OK, fs.constants.R_OK];
  if (writable) {
    permissions.push(fs.constants.W_OK);
  }
  try {
    fs.accessSync(filePath, ...permissions);
    return true;
  } catch (error) {
    throw Error('sed: no such file or does not have enough permmissions');
  }
};
// eslint-disable-next-line consistent-return
const getCheckedFilePath = (filePath) => {
  if (isValidFile(filePath)) {
    return filePath;
  }
};

const readCommands = (filePath) => {
  const commands = [];
  if (isValidFile(filePath, true)) {
    try {
      const data = fs.readFileSync(filePath, 'UTF-8');
      commands.push(...data.split(/\r?\n/));
    } catch (err) {
      throw Error(
        `Something bad happened while reading process of file ${filePath}`
      );
    }
  }
  return commands;
};

const makeFileCopy = (filePath) => {
  try {
    const absoluteFilePath = path.resolve(filePath);
    const fileName = path.basename(absoluteFilePath);
    const directory = absoluteFilePath.replace(fileName, '');
    const newFilePath = path.join(directory, `new-${fileName}`);

    fs.renameSync(absoluteFilePath, newFilePath);
    fs.copyFileSync(newFilePath, absoluteFilePath);
    return { newFilePath, absoluteFilePath };
  } catch (error) {
    throw Error('Something bad happened while making a file copy');
  }
};

module.exports = {
  makeFileCopy,
  readCommands,
  getCheckedFilePath,
};
