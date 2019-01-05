import { loadBatchAsync } from '../../helpers/load.js';

import prepareData from './js/prepare-data.js';
import sortTeams from './js/sort-teams.js'
import buildSkeleton from './js/build-skeleton.js'
import { drawTable, updateTable } from './js/draw-table.js';
import { drawBricks, updateBricks } from './js/draw-bricks.js';
import drawLegend from './js/draw-legend.js';


loadBatchAsync(['teams', 'games'])
    .then(dataSets => {
        const teams = prepareData(dataSets.teams, dataSets.games);
        const teamsSorted = sortTeams(teams, 'Игр');

        const chartId = 'chart-bricks';
        buildSkeleton(chartId);
        drawTable(teamsSorted, chartId);
        drawBricks(teamsSorted, chartId);
        drawLegend(chartId);


        const selectSortBy = document.querySelector('#select-bricks-sort-by');
        selectSortBy.addEventListener('change', (e) => {
            const sortBy = e.target.value;
            updateTable(chartId, { param: 'sortBy', value: sortBy });
            updateBricks(chartId, { param: 'sortBy', value: sortBy });
        });

        const selectGroupBy = document.querySelector('#select-bricks-group-by');
        selectGroupBy.addEventListener('change', (e) => {
            const groupBy = e.target.value;
            updateBricks(chartId, { param: 'groupBy', value: groupBy });
        });
    });
