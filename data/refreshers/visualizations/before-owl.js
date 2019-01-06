const SERIES_ORDER = require('../helpers/series-order');

// counting distinct id and not length because of two-team games
const sheetsMeta = {
    'Составы': {
        playerField: 'Знаток',
        idField: 'ID игры',
        measures: {
            'Игр': null,
            'Финалов': l => l['Тип игры'] === 'Финал',
            'Выигранных финалов': l => l['Тип игры'] === 'Финал' && l['Выиграл'] === 'Знатоки',
            'Побед': l => l['Выиграл'] === 'Знатоки'
        }
    },
    'Вопросы': {
        playerField: 'Отвечал',
        idField: 'ID вопроса',
        measures: {
            'Ответов': null,
            'Правильных': a => a['Результат'] === 'Проиграл'
        }
    },
    'Игры': {
        playerField: 'Лучший знаток',
        idField: 'ID игры',
        measures: {
            'Призов лучшему знатоку': null
        }
    },
    'Раунды': {
        playerField: 'Первый знаток',
        idField: 'ID раунда',
        measures: {
            'Суперблицев': r => r['Тип'] === 'Суперблиц',
            'Выигранных суперблицев': r => r['Тип'] === 'Суперблиц' && r['Выиграли'] === 'Знатоки',
            'Решающих раундов': r => r['РР'] === 'РР',
            'Выигранных решающих раундов': r => r['РР'] === 'РР' && r['Выиграли'] === 'Знатоки'
        }
    }
};

const calculatePlayerStats = (sheets, player, filterFunction = null) => {
    return Object.keys(sheetsMeta).reduce((mergedStats, s) => {
        const sheetMeasures = Object.keys(sheetsMeta[s].measures);
        const emptySets = sheetMeasures.reduce((result, m) => Object.assign(result, { [m]: new Set() }), {});

        const sheetStats = sheets[s].reduce((stats, row) => {
            if (row[sheetsMeta[s].playerField] !== player || (filterFunction && !filterFunction(row))) {
                return stats;
            }

            sheetMeasures
                .filter(m => !sheetsMeta[s].measures[m] || sheetsMeta[s].measures[m](row))
                .forEach(m => stats[m].add(row[sheetsMeta[s].idField]));

            return stats;
        }, emptySets);

        Object.keys(sheetStats).forEach(m => mergedStats[m] = sheetStats[m].size);
        return mergedStats;
    }, {});
};


const refresh = sheets => {
    const playersStats = sheets['Серии'].reduce((stats, s) => {
        const player = s['Обладатель совы'];
        if (s['Выиграл'] !== 'Знатоки' || player in stats)
            return stats;

        const isBeforeFunction = row => row['Сезон'] < s['Сезон'] ||
            (row['Сезон'] === s['Сезон'] && SERIES_ORDER[row['Серия']] <= SERIES_ORDER[s['Серия']]);
        const statsBeforeOwl = calculatePlayerStats(sheets, player, isBeforeFunction);

        stats[player] = Object.assign({
            'Знаток': player,
            'Сезон первой совы': s['Сезон'],
            'Серия первой совы': s['Серия'],
            'Первая сова': s['Сова'],
        }, statsBeforeOwl);
        return stats;
    }, {});

    return Object.keys(playersStats).map(p => playersStats[p]);
};

module.exports.refresh = refresh;
