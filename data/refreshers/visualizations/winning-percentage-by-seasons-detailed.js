const refresh = sheets => {
    const differences = [...Array.from({length: 6}, (v, k) => k+1), ...Array.from({length: 6}, (v, k) => -1-k) ];
    const differencesCounters = differences.reduce((obj, d) => Object.assign(obj, { [d]: 0 }), {});

    const stats = sheets['Игры'].reduce((seasons, g) => {
        if (!(g['Сезон'] in seasons)) {
            seasons[g['Сезон']] = Object.assign({ total: 0 }, differencesCounters);
        }

        const difference = g['Знатоки'] - g['Телезрители'];
        seasons[g['Сезон']][difference]++;
        seasons[g['Сезон']].total++;
        return seasons;
    }, {});

    const statsPrepared = Object.keys(stats).reduce((result, s) => {
        Object.keys(stats[s]).filter(d => d !== 'total').forEach(d => {
            const dif = Number.parseInt(d);
            result.push({
                'Сезон': (Number.parseInt(s) + 2008).toString(),
                'Разница': d,
                'Выиграли': dif > 0 ? 'Знатоки' : 'Телезрители',
                'Счёт': `${dif > 0 ? 6 : 6 + dif}:${dif < 0 ? 6 : 6 - dif}`,
                'Игр': stats[s][d],
                'Процент игр': stats[s][d] / stats[s].total
            });
        });
        return result;
    }, []);

    statsPrepared.sort((s1, s2) => {
        const seasonsDiff = s1['Сезон'] - s2['Сезон'];
        return seasonsDiff || (s1['Разница'] - s2['Разница']);
    });

    return statsPrepared;
};

module.exports.refresh = refresh;
