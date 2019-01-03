const draw = async () => {
    const processedGames = await d3.json('https://raw.githubusercontent.com/antoniokov/igra/master/data/raw/%D0%98%D0%B3%D1%80%D1%8B.json');

    function addMinMaxLabels(data, measure, formatFunction) {
        const minMax = data.reduce((extrema, d, i, arr) => {
            if (d[measure] > arr[extrema.maxIndex][measure])
                return { minIndex: extrema.minIndex, maxIndex: i };
            else if (d[measure] < arr[extrema.minIndex][measure])
                return { minIndex: i, maxIndex: extrema.maxIndex };
            else
                return { minIndex: extrema.minIndex, maxIndex: extrema.maxIndex };
        }, { minIndex: 0, maxIndex: 0 });

        const dataLabeled = data.slice();
        Object.keys(minMax).forEach(k => {
            const index = minMax[k];
            dataLabeled[index].label = formatFunction(dataLabeled[index][measure]);
        });

        return dataLabeled;
    }

    const statisticsBySeason = processedGames.reduce((result, g) => {
        const season = g['Сезон'] + 2008;

        if (!(season in result))
            result[season] = { wins: 0, total: 0 };

        result[season].total++;

        if (g['Выиграл'] === 'Знатоки')
            result[season].wins++;

        return result;
    }, {});

    const winningPercentageBySeasons = Object.keys(statisticsBySeason)
        .map(s => ({
            season: s,
            winningPercentage: statisticsBySeason[s].wins/statisticsBySeason[s].total
        }));

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
};

draw();
