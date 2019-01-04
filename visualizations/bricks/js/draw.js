import { loadBatchAsync } from '../../../helpers/load.js';
import drawTable from './draw-table.js';
import drawBricks from './draw-bricks.js';
import drawLegend from './draw-legend.js';

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

        teams.sort(sortingFunctions['winningPercentage']);

        drawTable(teams);
        drawBricks(teams);
        drawLegend();
    });
