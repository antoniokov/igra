const dateFields = ['Дата'];


export async function loadAsync (path) {
    const data = await d3.json(path);
    return data.map(d => {
        dateFields
            .filter(f => f in d)
            .forEach(f => d[f] = new Date(d[f]));
        return d;
    });
}

export async function loadBatchAsync (dataSources) {
    const load = async (ds) => {
        const data = await loadAsync(ds.url);
        return { [ds.id]: data };
    };

    return Promise.all(dataSources.map(ds => load(ds)))
        .then(results => results.reduce((merged, obj) => Object.assign(merged, obj), {}))
}
