const getAllSheetsAsync = require('./helpers/get-all-sheets').getAllSheetsAsync;
const saveToFileAsync = require('./helpers/save-to-file');
const vizualisations = [
    { name: 'before-owl', refresh: require('./visualizations/before-owl').refresh },
    { name: 'winning-percentage-by-seasons', refresh: require('./visualizations/winning-percentage-by-seasons').refresh }
];


const refreshViz = async () => {
    const sheets = await getAllSheetsAsync();
    return Promise.all(vizualisations.map(v => saveToFileAsync(`./viz/${v.name}.json`, v.refresh(sheets))));
};

module.exports = refreshViz;
