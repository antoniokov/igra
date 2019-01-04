import { loadBatchAsync } from '../../../helpers/load.js';
import drawTable from '../js/draw-table.js';
import drawBricks from '../js/draw-bricks.js';
import drawLegend from '../js/draw-legend.js';

const sortingFunctions = {
    gamesCount: (a, b) => b['Игр'] - a['Игр'],
    winningPercentage: (a, b) => parseFloat(b['Побед'])/b['Игр'] - parseFloat(a['Побед'])/a['Игр']
};


loadBatchAsync(['teams', 'games'])
    .then(dataSets => {
        const teams = dataSets.teams
            .filter(t => t['Только в благотворительных'] !== 'Да')
            .map(t => Object.assign(t, {
                'Игры': dataSets.games.filter(g => g['Команда'] === t['Команда']),
                'Процент побед': (100*t['Побед']/t['Игр']).toFixed(1)
            }));

        console.log(teams);
        teams.sort(sortingFunctions['gamesCount']);

        drawTable(teams);

        const seasons = [...new Set(dataSets.games.map(g => g['Сезон']))];
        seasons.forEach(s => {
            const seasonTeams = teams.map(t => Object.assign({}, t, { 'Игры': t['Игры'].filter(g => g['Сезон'] === s) } ));
            drawBricks(seasonTeams, { header: s + 2008 })
        });
        drawLegend();
    });
