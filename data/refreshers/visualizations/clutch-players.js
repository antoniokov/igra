const insertOwls = require('../helpers/insert-owls');

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
        .filter(r => r.pointsAgainst === 5 || r['РР'] === 'РР');

    const clutchRoundIds = clutchRounds.map(r => r['ID раунда']);

    const clutchPlayersStats = sheets['Вопросы']
        .filter(q => clutchRoundIds.includes(q['ID раунда']))
        .reduce((result, q) => {
            const player = q['Отвечал'];
            if (!(player in result))
                result[player] = { 'Ответов': 0, 'Правильных': 0 };

            result[player]['Ответов']++;
            if (q['Результат'] === 'Проиграл')
                result[player]['Правильных']++;

            return result;
        }, {});

    const clutchPlayers = Object.keys(clutchPlayersStats).map(p => {
        const gameIds = sheets['Составы']
            .filter(l => l['Знаток'] === p)
            .map(l => l['ID игры']);
        const chances = clutchRounds.filter(r => gameIds.includes(r['ID игры'])).length;

        const player = sheets['Знатоки'].filter(plr => plr['Знаток'] === p)[0];
        return Object.assign({
            'Знаток': insertOwls(player, 'Знаток'),
            'Игр': player['Игр'],
            'Шансов взять ответственность на себя': chances,
            'Процент правильных': Math.round(1000*clutchPlayersStats[p]['Правильных']/clutchPlayersStats[p]['Ответов'])/10,
            'Процент принятия ответственности': Math.round(1000*clutchPlayersStats[p]['Ответов']/chances)/10,
            'Процент успешного принятия ответственности': Math.round(1000*clutchPlayersStats[p]['Правильных']/chances)/10,
            'Попыток спасений за игру': Math.round(10*clutchPlayersStats[p]['Ответов']/gameIds.length)/10,
            'Успешных спасений за игру': Math.round(10*clutchPlayersStats[p]['Правильных']/gameIds.length)/10
        }, clutchPlayersStats[p]);
    });

    return clutchPlayers;
};

module.exports.refresh = refresh;
