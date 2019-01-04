import { loadAsync } from '../../../helpers/load.js';

loadAsync('games')
    .then(games => {
        const teams = getTeams(games, { sort: 'winningPercentage' });
        drawTable(teams);
        drawBricks(teams);
        drawLegend();
    });
