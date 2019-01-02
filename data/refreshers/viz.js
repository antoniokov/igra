const getAllSheetsAsync = require('./helpers/get-all-sheets').getAllSheetsAsync;
const refreshes = [
    require('./vizualisations/before-owls').refresh
];


const refreshViz = async () => {
    const sheets = await getAllSheetsAsync();
    refreshes.forEach(r => r(sheets));
};

module.exports = refreshViz;
