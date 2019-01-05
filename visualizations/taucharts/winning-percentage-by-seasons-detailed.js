import { loadAsync } from '../../helpers/load.js';


loadAsync('winning-percentage-by-seasons-detailed')
    .then(data => {
        const chart = new Taucharts.Chart({
            data: data,
            type: 'stacked-bar',
            x: 'Сезон',
            y: 'Процент игр',
            color: 'Счёт',
            guide: {
                y: {
                    tickFormat: '.0%',
                    min: 0,
                    max: 1
                },
                color: {
                    brewer: {
                        '6:0': '#002F03',
                        '6:1': '#0C4C10',
                        '6:2': '#206925',
                        '6:3': '#37813C',
                        '6:4': '#5A9F5F',
                        '6:5': '#87BD8B',
                        '5:6': '#CECECE',
                        '4:6': '#ACACAC',
                        '3:6': '#9A9A9A',
                        '2:6': '#6E6E6E',
                        '1:6': '#4C4C4C',
                        '0:6': '#2A2A2A'
                    }
                },
                showGridLines: ''
            },
            settings: {
                fitModel: 'entire-view'
            },
            plugins: [
                Taucharts.api.plugins.get('tooltip')({ fields: ['Сезон', 'Счёт', 'Игр', 'Процент игр'] }),
                Taucharts.api.plugins.get('legend')()
            ]
        });

        chart.renderTo('#chart-winning-percentage-by-seasons-2');
    });
