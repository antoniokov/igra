function strip(data) {
    const sheets = {};
    Object.keys(data).forEach(s => sheets[s] = data[s].elements);
    return sheets;
}

function process(sheets) {
    const parse = {
        date: d => new Date(d),
        number: n => Number.parseInt(n) // using Tabletop's parseNumbers instead
    };

    const meta = {
        date: ['Дата']
        //number: ['З', 'Т', 'Знатоки', 'Телезрители', 'Сезон', 'Игра', 'Лучший вопрос']
    };

    const processed = Object.keys(sheets).reduce((result, s) => {
        return Object.assign(result, {
            [s]: sheets[s].map(r => {
                const row = Object.assign({}, r);
                Object.keys(meta).forEach(type => meta[type]
                    .filter(field => field in row)
                    .forEach(field => row[field] = parse[type](r[field])));
                return row;
            })
        });
    }, {});

    return processed;
}
