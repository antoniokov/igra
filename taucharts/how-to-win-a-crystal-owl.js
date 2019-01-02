const firstPlayerOwls = SERIES
    .filter(s => s['Выиграл'] === 'Знатоки')
    .reduce((result, s) => {
        const player = s['Обладатель совы'];
        if(!(player in result)) {
            const isBeforeTemplate = (player, season, series) => (row, playerField) =>
                row[playerField] === player &&
                row['Сезон'] <= season &&
                SERIES_ORDER[row['Серия']] <= SERIES_ORDER[series];

            const isBeforeFunction = isBeforeTemplate(player, s['Сезон'], s['Серия']);

            const lineupsBefore = LINEUPS.filter(l => isBeforeFunction(l, 'Знаток'));
            const bestPlayersBefore = GAMES.filter(g => isBeforeFunction(g, 'Лучший знаток'));
            const answersBefore = QUESTIONS.filter(q => isBeforeFunction(q, 'Отвечал'));
            const roundsBefore = ROUNDS.filter(r => isBeforeFunction(r, 'Первый знаток'));

            result[player] = Object.assign({}, s, {
                before : {
                    'Игр': lineupsBefore.length,
                    'Побед': lineupsBefore.filter(g => g['Выиграл'] === 'Знатоки').length,
                    'Ответов': answersBefore.length,
                    'Правильных ответов': answersBefore.filter(a => a['Результат'] === 'Проиграл').length,
                    'Суперблицев': roundsBefore.filter(r => r['Тип'] === 'Суперблиц').length,
                    'Взятых суперблицев': roundsBefore.filter(r => r['Тип'] === 'Суперблиц' && r['Выиграли'] === 'Знатоки').length,
                    'Решающих раундов': roundsBefore.filter(r => r['РР'] === 'РР').length,
                    'Выигранных решающих раундов': roundsBefore.filter(r => r['РР'] === 'РР' && r['Выиграли'] === 'Знатоки').length,
                    'Призов лучшему знатоку': bestPlayersBefore.length
                }
            });
        }

        return result;
    }, {});


const measuresSplit = {
    'Ответов': {
        '+': s => s['Правильных ответов'],
        '-': s => s['Ответов'] - s['Правильных ответов']
    },
    'Игр': {
        '+': s => s['Побед'],
        '-': s => s['Игр'] - s['Побед']
    },
    'Призов лучшему знатоку': {
        '+': s => s['Призов лучшему знатоку'],
        '-': s => 0
    },
    'Суперблицев': {
        '+': s => s['Взятых суперблицев'],
        '-': s => s['Суперблицев'] - s['Взятых суперблицев']
    },
    'Решающих раундов': {
        '+': s => s['Выигранных решающих раундов'],
        '-': s => s['Решающих раундов'] - s['Выигранных решающих раундов']
    }
};
const statsBeforeOwl = Object.keys(firstPlayerOwls).reduce((result, p) => {
    ['+', '-'].forEach(r => {
        const obj = { 'Знаток': p, 'Результат': r };
        Object.keys(measuresSplit).forEach(m => obj[m] = measuresSplit[m][r](firstPlayerOwls[p].before));
        result.push(obj);
    });

    return result;
}, []);

const defaultMeasure = 'Ответов';
const sortingFunctionTemplate = measure => {
    const getPluses = p => measuresSplit[measure]['+'](firstPlayerOwls[p].before);
    return (s1, s2) => {
        const difference = getPluses(s2['Знаток']) - getPluses(s1['Знаток']);
        return difference || (firstPlayerOwls[s2['Знаток']].before[measure] - firstPlayerOwls[s1['Знаток']].before[measure]);
    }
};

statsBeforeOwl.sort(sortingFunctionTemplate(defaultMeasure));

const howToWinACrystalOwlConfig = {
    data: statsBeforeOwl,
    type: 'horizontal-stacked-bar',
    x: defaultMeasure,
    y: 'Знаток',
    color: 'Результат',
    guide: {
        color: {
            brewer: {
                '+': '#24693D',
                '-': '#9E9E9E'
            }
        },
        showGridLines: ''
    },
    settings: {
        fitModel: 'entire-view'
    },
    plugins: [
        Taucharts.api.plugins.get('tooltip')()
    ]
};

const howToWinACrystalOwlChart = new Taucharts.Chart(howToWinACrystalOwlConfig);

howToWinACrystalOwlChart.renderTo('#chart-how-to-win-a-crystal-owl');

document.querySelector('#select-how-to-win-a-crystal-owl').addEventListener('change', (e) => {
    howToWinACrystalOwlConfig.x = e.currentTarget.value;
    howToWinACrystalOwlConfig.data.sort(sortingFunctionTemplate(e.currentTarget.value));
    howToWinACrystalOwlChart.updateConfig(howToWinACrystalOwlConfig);
});
