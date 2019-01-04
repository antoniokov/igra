import { measures, measureToPlus } from '../helpers/measures.js';
import dataSources from '../helpers/data-sources.js'
import { loadBatchAsync } from '../helpers/load.js'

import beforeOwl from './players/before-owl.js';
import withoutOwl from './players/without-owl.js';
import bestPlayers from './players/best-players.js';

const visualizations = [ beforeOwl, withoutOwl, bestPlayers ];

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


const visualize = (data, v) => {
    const dataFiltered = v.preFilter ? data.filter(v.preFilter) : data;
    v.measures = measures.filter(m => !v.measuresWhiteList || v.measuresWhiteList.includes(m.id));

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
};

const relevantDataSources = dataSources.filter(ds => visualizations.some(v => v.dataSource === ds.id));
loadBatchAsync(relevantDataSources)
    .then(dataSets => {
        const rendered = visualizations.map(v => visualize(dataSets[v.dataSource], v));
        visualizations.forEach(v => v.postRender && v.postRender(rendered));
    });