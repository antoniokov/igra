const refresh = sheets => {
    const types = [...new Set(sheets['Раунды'].map(r => r['Тип']))];

    const counters = types.reduce((obj, t) => Object.assign(obj, { [t]: { 'Взятых': 0, 'Всего': 0 } }), {});
    const stats = sheets['Раунды']
        .filter(r => r['Тип игры'] !== 'Благотворительная')
        .reduce((result, r) => {
            counters[r['Тип']]['Всего']++;
            if (r['Выиграли'] === 'Знатоки')
                counters[r['Тип']]['Взятых']++;

            return counters;
        }, counters);

    const data = types.map(t => {
        return Object.assign({
            'Раунд': t,
            'Процент взятых': stats[t]['Взятых'] / stats[t]['Всего']
        }, stats[t]);
    });

    data.sort((r1, r2) => r1['Процент взятых'] - r2['Процент взятых']);

    return data;
};

module.exports.refresh = refresh;
