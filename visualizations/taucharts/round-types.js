import { loadAsync } from '../../helpers/load.js';


loadAsync('round-types')
    .then(roundTypes => {
        const chart = new Taucharts.Chart({
            data: roundTypes,
            type: 'horizontal-bar',
            x: 'Процент взятых',
            y: 'Раунд',
            guide: {
                x: {
                    tickFormat: '.0%',
                    min: 0,
                    max: 1
                },
                color: {
                    brewer: ['#24693D']
                },
                showGridLines: 'x'
            },
            settings: {
                fitModel: 'fit-width'
            },
            plugins: [
                Taucharts.api.plugins.get('tooltip')()
            ]
        });

        chart.renderTo('#chart-round-types');
    });