import { loadAsync } from '../../helpers/load.js';

loadAsync('https://raw.githubusercontent.com/antoniokov/igra/master/data/raw/%D0%98%D0%B3%D1%80%D1%8B.json')
    .then(games => {
        const teams = getTeams(games, { sort: 'winningPercentage' });
        drawTable(teams);
        drawBricks(teams);
        drawLegend();
    });
