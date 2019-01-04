export default [
    {
        id: 'winning-percentage',
        url: 'https://raw.githubusercontent.com/antoniokov/igra/master/data/viz/winning-percentage-by-seasons.json'
    },
    {
        id: 'before-owl',
        url: 'https://raw.githubusercontent.com/antoniokov/igra/master/data/viz/before-owl.json'
    },
    {
        id: 'players',
        url: 'https://raw.githubusercontent.com/antoniokov/igra/master/data/raw/%D0%97%D0%BD%D0%B0%D1%82%D0%BE%D0%BA%D0%B8.json'
    },
    {
        id: 'games',
        url: 'https://raw.githubusercontent.com/antoniokov/igra/master/data/raw/%D0%98%D0%B3%D1%80%D1%8B.json'
    },
    {
        id: 'teams',
        url: 'https://github.com/antoniokov/igra/blob/master/data/raw/%D0%9A%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%D1%8B.json',
        postProcess: teams => teams.filter(t => t['Команда'])
    },
    {
        id: 'authors',
        url: 'https://raw.githubusercontent.com/antoniokov/igra/master/data/raw/%D0%A2%D0%B5%D0%BB%D0%B5%D0%B7%D1%80%D0%B8%D1%82%D0%B5%D0%BB%D0%B8.json',
        postProcess: authors => authors.filter(a => a['№'] > 0)
    }
];
