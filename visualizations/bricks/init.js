import { loadBatchAsync } from '../../helpers/load.js';
import drawTable from './js/draw-table.js';
import drawBricks from './js/draw-bricks.js';
import drawLegend from './js/draw-legend.js';

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


        const nodes = document.getElementsByClassName('bricks');
        [...nodes].map(n => n.id).forEach(id => {
            const sortBy = id === 'basic' ? 'winningPercentage' : 'gamesCount';
            teams.sort(sortingFunctions[sortBy]);
            drawTable(teams, id);

            if (id === 'basic') {
                drawBricks(teams, id);
            } else {
                const seasons = [...new Set(dataSets.games.map(g => g['Сезон']))];
                seasons.forEach(s => {
                    const seasonTeams = teams.map(t => Object.assign({}, t, { 'Игры': t['Игры'].filter(g => g['Сезон'] === s) } ));
                    drawBricks(seasonTeams, id, { header: s + 2008 })
                });
            }

            drawLegend(id);
        });
    });
