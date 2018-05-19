function strip(data) {
    const sheets = {};
    Object.keys(data).forEach(s => sheets[s] = data[s].elements);
    return sheets;
}

function process(sheets) {
    const parse = {
        date: d => new Date(...d.split('.').reverse()),
        number: n => Number.parseInt(n)
    };

    const meta = {
        date: ['Дата'],
        number: ['З', 'Т', 'Знатоки', 'Телезрители', 'Сезон', 'Игра', 'Лучший вопрос']
    };

    return sheets['Игры'].map(g => {
        const game = Object.assign({}, g);
        Object.keys(meta).forEach(type => meta[type].forEach(field => game[field] = parse[type](g[field])));
        return game;
    });
}
