import { loadAsync } from '../../../helpers/load.js';

loadAsync('games')
    .then(games => {
        const teams = getTeams(games, { sort: 'gamesCount' });
        drawTable(teams);

        const seasons = [...new Set(games.map(g => g['Сезон']))];
        seasons.forEach(s => {
            const filteredTeams = teams.map(t => {
                const team = Object.assign({}, t);
                team.games = t.games.filter(g => g['Сезон'] === s);
                return team;
            });
            drawBricks(filteredTeams, { header: s + 2008 })
        });
        drawLegend();
    });
