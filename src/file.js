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
    return false;
  }
};
const createFile = (path) => {
  fs.open(path, 'w', function (err) {
    if (err) throw err;
  });
};

module.exports = {
  isValidFile,
  createFile,
};
