import { loadBatchAsync } from '../../helpers/load.js';

import buildSkeleton from './js/build-skeleton.js'
import drawTable from './js/draw-table.js';
import drawBricks from './js/draw-bricks.js';
import drawLegend from './js/draw-legend.js';

const sortingFunctions = {
    'Процент побед': (a, b) => parseFloat(b['Побед'])/b['Игр'] - parseFloat(a['Побед'])/a['Игр']
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
        [...nodes].forEach(n => {
            buildSkeleton(n.id);

            const sortBy = n.dataset.sortBy || 'Процент побед';
            const sortingFunction = sortingFunctions[sortBy] || ((a, b) => b[sortBy] - a[sortBy]);
            teams.sort(sortingFunction);

            drawTable(teams, n.id);

            if (n.dataset.groupBy) {
                const groups = [...new Set(dataSets.games.map(g => g[n.dataset.groupBy]))];

                groups.forEach(group => {
                    const groupTeams = teams
                        .map(t => Object.assign({}, t, { 'Игры': t['Игры'].filter(g => g[n.dataset.groupBy] === group) } ));

                    const header = n.dataset.groupBy === 'Сезон' ? group + 2008 : group;
                    drawBricks(groupTeams, n.id, { header: header })
                });
            } else {
                drawBricks(teams, n.id);
            }

            drawLegend(n.id);
        });
    });
