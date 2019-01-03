const tabletop = require('tabletop');
const saveToFileAsync = require('./helpers/save-to-file');
const sheetsNames = require('./helpers/get-all-sheets').sheetsNames;
const publicSpreadsheetUrl = '1eo10PIQrAZcXUxCObB2KQeAnkM7BrKo2Q9NmzxPieBU';

const refreshRaw = callback => {
    const meta = {
        date: {
            parse: d => new Date(...d.split('.').reverse()),
            fields: ['Дата']
        },
        percent: {
            parse: d => parseFloat(d),
            fields: ['Процент правильных']
        }
    };

    tabletop.init({
        key: publicSpreadsheetUrl,
        parseNumbers: true,
        postProcess: row => {
            Object.keys(meta).forEach(type =>
                meta[type].fields
                    .map(field => field.toLowerCase().replace(' ', ''))
                    .filter(field => field in row)
                    .forEach(field => row[field] = meta[type].parse(row[field]))
            );
        },
        wanted: sheetsNames,
        callback: sheets => {
            return Promise.all(Object.keys(sheets).map(s => saveToFileAsync(`./raw/${s}.json`, sheets[s].elements)))
                .then(callback);
        }
    });
};

module.exports = refreshRaw;
