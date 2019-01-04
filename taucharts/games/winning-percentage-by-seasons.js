import addMinMaxLabels from '../../helpers/add-min-max-labels.js';
import { loadAsync } from '../../helpers/load.js';


loadAsync('https://raw.githubusercontent.com/antoniokov/igra/master/data/viz/winning-percentage-by-seasons.json')
    .then(winningPercentageBySeasons => {
        const formatFunction = n => `${Math.round(100.0*n)}%`;
        const winningPercentageBySeasonsLabeled = addMinMaxLabels(winningPercentageBySeasons, 'winningPercentage', formatFunction);

        const chart = new Taucharts.Chart({
            data: winningPercentageBySeasonsLabeled,
            type: 'line',
            x: 'season',
            y: 'winningPercentage',
            label: 'label',
            guide: {
                x: {
                    label: { text: 'Сезон' }
                },
                y: {
                    label: { text: '% побед знатоков' },
                    tickFormat: '.0%',
                    min: 0,
                    max: 1
                },
                color: {
                    brewer: ['#24693D']
                },
                showGridLines: 'y',
                showAnchors: 'always'
            },
            settings: {
                fitModel: 'entire-view'
            },
            plugins: [
                Taucharts.api.plugins.get('tooltip')({
                    fields: ['season', 'winningPercentage']
                })
            ]
        });

        chart.renderTo('#chart-winning-percentage-by-seasons');
    });