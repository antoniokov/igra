export default [
    {
        id: 'winning-percentage',
        url: 'https://raw.githubusercontent.com/antoniokov/igra/master/data/viz/winning-percentage-by-seasons.json'
    },
    {
        id: 'winning-percentage-by-seasons-detailed',
        url: 'https://raw.githubusercontent.com/antoniokov/igra/master/data/viz/winning-percentage-by-seasons-detailed.json'
    },
    {
        id: 'round-types',
        url: 'https://raw.githubusercontent.com/antoniokov/igra/master/data/viz/round-types.json'
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
        url: 'https://raw.githubusercontent.com/antoniokov/igra/master/data/raw/%D0%9A%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%D1%8B.json',
        postProcess: teams => teams.filter(t => t['Команда'])
    },
    {
        id: 'authors',
        url: 'https://raw.githubusercontent.com/antoniokov/igra/master/data/raw/%D0%A2%D0%B5%D0%BB%D0%B5%D0%B7%D1%80%D0%B8%D1%82%D0%B5%D0%BB%D0%B8.json',
        postProcess: authors => authors.filter(a => a['№'] > 0)
    },
    {
        id: 'best-player-sexism',
        url: 'https://raw.githubusercontent.com/antoniokov/igra/master/data/viz/best-player-sexism.json'
    },
    {
        id: 'questions',
        url: 'https://raw.githubusercontent.com/antoniokov/igra/master/data/raw/%D0%92%D0%BE%D0%BF%D1%80%D0%BE%D1%81%D1%8B.json'
    },
    {
        id: 'lineups',
        url: 'https://raw.githubusercontent.com/antoniokov/igra/master/data/raw/%D0%A1%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D1%8B.json'
    },
    {
        id: 'players-cumulative-answers',
        url: 'https://raw.githubusercontent.com/antoniokov/igra/master/data/viz/players-cumulative-answers.json'
    },
    {
        id: 'answers-frequency-by-team',
        url: 'https://raw.githubusercontent.com/antoniokov/igra/master/data/viz/answers-frequency-by-team.json'
    },
    {
        id: 'clutch-players',
        url: 'https://raw.githubusercontent.com/antoniokov/igra/master/data/viz/clutch-players.json'
    }
];
