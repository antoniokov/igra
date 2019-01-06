import { loadAsync } from '../../helpers/load.js';


loadAsync('players-cumulative-answers')
    .then(data => {
        const chart = new Taucharts.Chart({
            data: data,
            type: 'line',
            x: 'Номер игры',
            y: 'Сумма правильных ответов',
            split: 'Знаток',
            label: 'Знаток',
            color: 'Категория',
            guide: {
                color: {
                    brewer: {
                        'Засухи': '#4C3862',
                        'Лидеры': '#6FA1D9',
                        'Раскрылись не сразу': '#66DA26'
                    }
                }
            },
            settings: {
                fitModel: 'entire-view'
            },
            plugins: [
                Taucharts.api.plugins.get('tooltip')(),
                Taucharts.api.plugins.get('legend')()
            ]
        });

        chart.renderTo('#chart-players-cumulative-answers');
    });
