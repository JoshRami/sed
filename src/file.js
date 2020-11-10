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
    throw Error(
      `sed: no such file or does not have enough permmissions: ${filePath}`
    );
  }
};
// eslint-disable-next-line consistent-return
const getCheckedFilePath = (filePath) => {
  const absoluteFilePath = getAbsoluteFilePath(filePath);
  if (isValidFile(absoluteFilePath, true)) {
    return absoluteFilePath;
  }
};

const readCommands = (filePath) => {
  const commands = [];
  if (isValidFile(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'UTF-8');
      commands.push(...data.split(/\r?\n/));
    } catch (err) {
      throw Error(
        `sed: Something bad happened while reading process of file ${filePath}`
      );
    }
  }
  return commands;
};

const createEmptyFile = (filePath) => {
  const fileName = path.basename(filePath);
  const directory = filePath.replace(fileName, '');
  const newFileName = `new_${fileName}`;
  try {
    const newFilePath = path.join(directory, newFileName);
    fs.closeSync(fs.openSync(newFilePath, 'w'));
    return newFilePath;
  } catch (error) {
    throw Error('sed: Something bad happened while making a new file');
  }
};
const getAbsoluteFilePath = (filePath) => {
  if (path.isAbsolute(filePath)) {
    return filePath;
  }
  return path.resolve(filePath);
};
const countInputFileLines = (filePath) => {
  let data;
  try {
    data = fs.readFileSync(filePath, 'UTF-8');
    data = data.split('\n').length;
  } catch (err) {
    throw Error(
      `sed: Something bad happened while reading process of file ${filePath}`
    );
  }
  return data;
};

module.exports = {
  createEmptyFile,
  readCommands,
  getCheckedFilePath,
  countInputFileLines,
};
