const insertOwls = require('../helpers/insert-owls');


const refresh = sheets => {
    const playersStats = sheets['Составы'].reduce((result, l) => {
        if (!(l['Знаток'] in result))
            result[l['Знаток']] = {};

        if (!(l['Команда'] in result[l['Знаток']]))
            result[l['Знаток']][l['Команда']] = {};

        result[l['Знаток']][l['Команда']][l['ID игры']] = { 'Тип игры': l['Тип игры'], 'Правильных': 0, 'Ответов': 0 };
        return result;
    }, {});

    sheets['Вопросы']
        .filter(q => q['Отвечал'])
        .forEach(q => {
            const game = playersStats[q['Отвечал']][q['Команда']][q['ID игры']];
            game['Ответов']++;
            if (q['Результат'] === 'Проиграл')
                game['Правильных']++;
        });

    const games = [...new Set(sheets['Вопросы'].map(q => q['ID игры']))];
    const gamesStats = games.reduce((result, g) => {
        const questions = sheets['Вопросы'].filter(q => q['ID игры'] === g && q['Отвечал']);
        return Object.assign(result, { [g]: {
                'Правильных': questions.filter(q => q['Результат'] === 'Проиграл').length,
                'Ответов': questions.length
            }});
    }, {});

    const isCaptain = (player, team) => {
        const [firstName, lastName] = player.split(' ');
        const [teamFirstName, teamLastName] = team.split(' ');

        return firstName.slice(0, firstName.length -3) === teamFirstName.slice(0, firstName.length -3) &&
            lastName.slice(0, lastName.length -3) === teamLastName.slice(0, lastName.length -3);
    };

    const data = Object.keys(playersStats).reduce((result, p) => {
        const player = sheets['Знатоки'].filter(plr => plr['Знаток'] === p)[0];

        Object.keys(playersStats[p]).forEach(t => {
            const playerTeamGames = Object.keys(playersStats[p][t]);
            const gamesSummary = playerTeamGames.reduce((summary, g) => {
                return {
                    'Правильных': summary['Правильных'] + playersStats[p][t][g]['Правильных'],
                    'Ответов': summary['Ответов'] + playersStats[p][t][g]['Ответов'],
                    'Возможных правильных': summary['Возможных правильных'] + gamesStats[g]['Правильных'],
                    'Возможных ответов': summary['Возможных ответов'] + gamesStats[g]['Ответов'],
                }
            }, { 'Правильных': 0, 'Ответов': 0, 'Возможных правильных': 0, 'Возможных ответов': 0 });


            result.push(Object.assign({
                'Знаток': insertOwls(player, 'Знаток'),
                'Тип игрока': isCaptain(p, t) ? 'Капитан' : (player['Текущая команда'] === t ? 'Полевой' : 'Бывший'),
                'Команда': t,
                'Игр': playerTeamGames.length,
                'Процент правильных': gamesSummary['Правильных']/gamesSummary['Возможных правильных'],
                'Процент ответов': gamesSummary['Ответов']/gamesSummary['Возможных ответов'],
                'Процент ответов ': `${Math.round(100*gamesSummary['Ответов']/gamesSummary['Возможных ответов'])}%`
            }, gamesSummary));
        });

        return result;
    }, []);

    const getTeam = dp => sheets['Команды'].filter(t => t['Команда'] === dp['Команда'])[0];
    const dataFiltered = data.filter(d => {
        const team = getTeam(d);
        return team && team['Только в благотворительных'] !== 'Да' && d['Игр'] >= 3;
    });

    dataFiltered.sort((d1, d2) => {
        const teamDiff = new Date(getTeam(d2)['Последняя игра']) - new Date(getTeam(d1)['Последняя игра']);
        return teamDiff || (d2['Процент ответов']- d1['Процент ответов']);
    });

    return dataFiltered;
};

module.exports.refresh = refresh;
