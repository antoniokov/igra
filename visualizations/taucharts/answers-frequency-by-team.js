import { loadAsync } from '../../helpers/load.js';


loadAsync('answers-frequency-by-team')
    .then(data => {
        const chart = new Taucharts.Chart({
            data: data,
            type: 'horizontal-bar',
            x: 'Процент ответов',
            y: ['Команда', 'Знаток'],
            color: 'Тип игрока',
            label: 'Процент ответов ',
            guide: [
                {},
                {
                    color: {
                        brewer: {
                            'Капитан': '#DF2B59',
                            'Полевой': '#6FA1D9',
                            'Бывший': '#5C7A76'
                        }
                    },
                    x: { tickFormat: '.0%' },
                    showGridLines: 'x'
                }
            ],
            settings: {
                fitModel: 'normal'
            },
            plugins: [
                Taucharts.api.plugins.get('tooltip')(),
                Taucharts.api.plugins.get('floating-axes')(),
                Taucharts.api.plugins.get('annotations')({ items: [{
                        dim: 'Процент ответов',
                        val: 1/6,
                        color: '#4C3862',
                        text: `1/6`
                    }] })
            ]
        });

        chart.renderTo('#chart-answers-frequency-by-team');
    });