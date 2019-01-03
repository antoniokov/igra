const refresh = sheets => {
    const statisticsBySeason = sheets['Игры'].reduce((result, g) => {
        const season = g['Сезон'] + 2008;

        if (!(season in result))
            result[season] = { wins: 0, total: 0 };

        result[season].total++;

        if (g['Выиграл'] === 'Знатоки')
            result[season].wins++;

        return result;
    }, {});

    return Object.keys(statisticsBySeason)
        .map(s => ({
            season: s,
            winningPercentage: statisticsBySeason[s].wins/statisticsBySeason[s].total
        }));
};

module.exports.refresh = refresh;
