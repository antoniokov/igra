const refresh = sheets => {
    const clutchRounds = sheets['Раунды']
        .filter(r => r['Тип игры'] !== 'Благотворительная')
        .reduce((result, r) => {
            const previousRound = result[result.length - 1];
            if (!previousRound || previousRound['ID игры'] !== r['ID игры']) {
                return [...result, Object.assign({ pointsAgainst: 0 }, r)];
            }

            const add = previousRound['Выиграли'] === 'Знатоки' ? 0 : 1;
            return [...result, Object.assign({ pointsAgainst: previousRound.pointsAgainst + add }, r)];
        }, [])
        .filter(r => r.pointsAgainst === 5 || r['РР'] === 'РР')
        .map(r => r['ID раунда']);

    const clutchPlayersStats = sheets['Вопросы']
        .filter(q => clutchRounds.includes(q['ID раунда']))
        .reduce((result, q) => {
            const player = q['Отвечал'];
            if (!(player in result))
                result[player] = { 'Ответов': 0, 'Правильных': 0 };

            result[player]['Ответов']++;
            if (q['Результат'] === 'Проиграл')
                result[player]['Правильных']++;

            return result;
        }, {});

    const clutchPlayers = Object.keys(clutchPlayersStats).map(p => Object.assign({
        'Знаток': p,
        'Процент правильных': Math.round(1000*clutchPlayersStats[p]['Правильных']/clutchPlayersStats[p]['Ответов'])/10
    }, clutchPlayersStats[p]));

    console.log(clutchPlayers);
    return clutchPlayers;
};

module.exports.refresh = refresh;
