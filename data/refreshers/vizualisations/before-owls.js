const getAllSheetsAsync = require('../helpers/get-all-sheets').getAllSheetsAsync;

const refresh = async () => {
    const sheets = await getAllSheetsAsync();
};

module.exports.refresh = refresh;
