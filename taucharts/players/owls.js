const owlMeasures = [
    { id: 'Ответов', label: 'правильных ответов' },
    { id: 'Игр', label: 'побед' },
    { id: 'Финалов', label: 'выигранных финалов' },
    { id: 'Призов лучшему знатоку', label: 'призов лучшему знатоку' },
    { id: 'Суперблицев', label: 'взятых суперблицев' },
    { id: 'Решающих раундов', label: 'выигранных решающих раундов' }
];

const datasources = [
    { id: 'before-owl', url: 'https://raw.githubusercontent.com/antoniokov/igra/master/data/viz/before-owl.json' },
    { id: 'players', url: 'https://raw.githubusercontent.com/antoniokov/igra/master/data/raw/%D0%97%D0%BD%D0%B0%D1%82%D0%BE%D0%BA%D0%B8.json' }
];

const visualizations = [
    {
        id: 'before-owl',
        datasource: 'before-owl',
        measures: owlMeasures,
        calculateAnnotations: (dataTransformed) => {
            const dataPluses = dataTransformed.filter(s => s['Результат'] === '+');
            return owlMeasures.map(m => {
                const sum = dataPluses.reduce((result, s) => result + s[m.id], 0);
                const average = sum/dataPluses.length;
                return {
                    dim: m.id,
                    val: Math.round(average),
                    color: '#24693D',
                    text: `В среднем ${Math.round(average)}`
                }
            });
        }
    },
    {
        id: 'without-owl',
        datasource: 'players',
        preFilter: (row) => row['Малых сов'] + row['Больших сов'] === 0 && row['Только в благотворительных'] !== 'Да',
        measures: owlMeasures,
        top: 24,
        postRender: (results) => {
            const [beforeOwl, withoutOwl] = results;
            const averageOwlAnnotations = beforeOwl.annotations.map(a => Object.assign(a, { text: 'Средняя сова' }));

            const beforeOwlPluses = beforeOwl.dataTransformed.filter(s => s['Результат'] === '+');
            const toughestOwlAnnotations = owlMeasures.map(m => {
                const maximum = beforeOwlPluses.reduce((maxObj, dp) => {
                    return dp[m.id] > maxObj.value ? { value: dp[m.id], player: dp['Знаток'] } : maxObj;
                }, { value: 0, player: null });

                return {
                    dim: m.id,
                    val: maximum.value,
                    color: '#24693D',
                    text: maximum.player
                };
            });

            const annotations = [...averageOwlAnnotations, ...toughestOwlAnnotations];
            withoutOwl.config.plugins.push(Taucharts.api.plugins.get('annotations')({ items: annotations }));
            withoutOwl.chart.updateConfig(withoutOwl.config);
        }
    },
    {
        id: 'best-players',
        datasource: 'players',
        preFilter: (row) => row['Только в благотворительных'] !== 'Да' && row['Игр'] >= 5,
        measures: [...owlMeasures,
            { id: 'Досрочных', label: 'досрочных ответов' },
            { id: 'Процент правильных', label: '% правильных ответов' },
            { id: 'Ответов за игру', label: 'правильных ответов за игру' },
            { id: 'Команд', label: 'разных команд' }

            ],
        top: 24
    }
];

const measureToPlus = {
    'Ответов': 'Правильных',
    'Игр': 'Побед',
    'Финалов': 'Выигранных финалов',
    'Призов лучшему знатоку': 'Призов лучшему знатоку',
    'Суперблицев': 'Взятых суперблицев',
    'Решающих раундов': 'Взятых решающих раундов',
    'Команд': 'Команд',
    'Процент правильных': 'Процент правильных',
    'Досрочных': 'Правильных досрочных',
    'Ответов за игру': 'Правильных ответов за игру'
};

const splitMeasure = (measure, sign, row) => {
    const plus = row[measureToPlus[measure]];
    return sign === '+' ? plus : row[measure] - plus;
};

const sortMeasureTemplate = (data, measure) => (dp1, dp2) => {
    const getMeasure = (player, m) => data.filter(r => r['Знаток'] === player)[0][m];
    const plusesDiff = getMeasure(dp2['Знаток'], measureToPlus[measure]) - getMeasure(dp1['Знаток'], measureToPlus[measure]);
    return plusesDiff || (getMeasure(dp2['Знаток'], measure) - getMeasure(dp1['Знаток'], measure));
};

const getSortedTop = (dataTransformed, sortingFunction, top = null) => {
    const sorted = dataTransformed.slice();
    sorted.sort(sortingFunction);
    return top ? sorted.slice(0, top*2) : sorted;
};

const loadAllAsync = datasources.map(async (ds) => {
    const data = await d3.json(ds.url);
    return { id: ds.id, data: data }
});

const visualizeAll = datasets => visualizations.map((v) => {
    const data = datasets[v.datasource];
    const dataFiltered = v.preFilter ? data.filter(v.preFilter) : data;

    const dataTransformed = dataFiltered.reduce((result, row) => {
        ['+', '-'].forEach(r => {
            const obj = { 'Знаток': row['Знаток'], 'Результат': r };
            v.measures.forEach(m => obj[m.id] = splitMeasure(m.id, r, row));
            result.push(obj);
        });

        return result;
    }, []);

    v.dataTransformed = dataTransformed;

    const defaultMeasure = v.measures[0].id;
    const dataReady = getSortedTop(dataTransformed, sortMeasureTemplate(data, defaultMeasure), v.top);


    v.config = {
        data: dataReady,
        type: 'horizontal-stacked-bar',
        x: defaultMeasure,
        y: 'Знаток',
        color: 'Результат',
        guide: {
            color: {
                brewer: {
                    '+': '#24693D',
                    '-': '#9E9E9E'
                }
            },
            showGridLines: ''
        },
        settings: {
            fitModel: 'fit-width'
        },
        plugins: [
            Taucharts.api.plugins.get('tooltip')()
        ]
    };


    if (v.calculateAnnotations) {
        v.annotations = v.calculateAnnotations(dataTransformed);
        v.config.plugins.push(Taucharts.api.plugins.get('annotations')({ items: v.annotations }));
    }

    v.chart = new Taucharts.Chart(v.config);
    v.chart.renderTo(`#chart-${v.id}`);

    const select = document.querySelector(`#select-${v.id}`);
    v.measures.forEach((m, i) => {
        const option = document.createElement('option');
        option.value = m.id;
        option.innerHTML = m.label;
        if (i === 0)
            option.selected = true;
        select.appendChild(option);
    });


    select.addEventListener('change', (e) => {
        const measure = e.currentTarget.value;
        v.config.x = measure;
        v.config.data = getSortedTop(v.dataTransformed, sortMeasureTemplate(data, measure), v.top);
        v.chart.updateConfig(v.config);
    });

    return v;
});


Promise.all(loadAllAsync)
    .then(results => {
        const datasets = results.reduce((obj, r) => Object.assign(obj, { [r.id]: r.data }), {});
        const visuals = visualizeAll(datasets);
        visualizations.forEach(v => v.postRender && v.postRender(visuals));
    });