import { loadAsync } from '../../helpers/load.js';


loadAsync('best-player-sexism')
    .then(data => {
        const chart = new Taucharts.Chart({
            data: data,
            type: 'horizontal-bar',
            x: 'Правильных ответов',
            y: 'Пол',
            color: 'Пол',
            guide: {
                x: { label: { text: 'Среднее число правильных ответов для признания лучшим' }},
                y: { label: { text: ' ' }},
                showGridLines: 'x'
            },
            settings: {
                fitModel: 'fit-width'
            },
            plugins: [
                Taucharts.api.plugins.get('tooltip')()
            ]
        });

        chart.renderTo('#chart-best-player-sexism');
    });