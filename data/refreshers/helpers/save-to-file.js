const fs = require('fs').promises;


module.exports = async (path, data) => fs.writeFile(path, JSON.stringify(data), 'utf8');
