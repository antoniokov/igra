const fs = require('fs').promises;


const sheetsNames = ['Серии', 'Игры', 'Составы', 'Раунды', 'Вопросы', 'Знатоки'];

const getAllSheetsAsync = async () => {
    const sheets = {};

    return Promise.all(sheetsNames.map(s => {
        return fs.readFile(`./raw/${s}.json`, 'utf8')
            .then(json => sheets[s] = JSON.parse(json))
    })).then(() => sheets);
};

module.exports.sheetsNames = sheetsNames;
module.exports.getAllSheetsAsync = getAllSheetsAsync;