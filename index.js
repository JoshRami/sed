const sed = require('./src/sed.js');

sed.Substitute().catch((error) => console.error(error.message));
