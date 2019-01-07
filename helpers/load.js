import dataSources from './data-sources.js';


const dateFields = ['Дата', 'Первая игра', 'Последняя игра'];


export async function loadAsync (dataSourceId) {
    const source = dataSources.filter(ds => ds.id === dataSourceId)[0];

    const data = await d3.json(source.url);
    const dataPostProcessed = source.postProcess ? source.postProcess(data) : data;
    return dataPostProcessed.map(d => {
        dateFields
            .filter(f => f in d)
            .forEach(f => d[f] = new Date(d[f]));
        return d;
    });
}

export async function loadBatchAsync (dataSourceIds) {
    const load = async (ds) => {
        const data = await loadAsync(ds.id);
        return { [ds.id]: data };
    };

    const sources = dataSources.filter(ds => dataSourceIds.includes(ds.id));
    return Promise.all(sources.map(ds => load(ds)))
        .then(results => results.reduce((merged, obj) => Object.assign(merged, obj), {}))
}
