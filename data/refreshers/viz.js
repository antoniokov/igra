const getAllSheetsAsync = require('./helpers/get-all-sheets').getAllSheetsAsync;
const saveToFileAsync = require('./helpers/save-to-file');
const visualizations = [
    { name: 'before-owl', refresh: require('./visualizations/before-owl').refresh },
    { name: 'winning-percentage-by-seasons', refresh: require('./visualizations/winning-percentage-by-seasons').refresh },
    { name: 'winning-percentage-by-seasons-detailed', refresh: require('./visualizations/winning-percentage-by-seasons-detailed').refresh }
];


const refreshViz = async () => {
    const sheets = await getAllSheetsAsync();
    console.info('raw files read');
    return Promise.all(visualizations.map(v => saveToFileAsync(`./viz/${v.name}.json`, v.refresh(sheets))));
};

module.exports = refreshViz;
