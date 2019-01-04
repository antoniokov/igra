function getTeams(games, config) {
    games.sort((a,b) => a['Дата'] - b['Дата']);

    const teamsObj = games
        .filter(g => g['Тип'] !== 'Благотворительная')
        .reduce((grouped, g) => {
            const team = g['Команда'];

            if (!grouped[team]) {
                grouped[team] = {
                    name: team,
                    wins: 0,
                    losses: 0,
                    percentage: 0.0,
                    games: []
                };
            }

            grouped[team].games.push(g);
            g['Выиграл'] === 'Знатоки' ? grouped[team].wins++ : grouped[team].losses++;
            grouped[team].percentage = (100* grouped[team].wins / grouped[team].games.length).toFixed(1).toString();

            return grouped;
        }, {});

    const teams = Object.keys(teamsObj)
        .map(t => teamsObj[t])
        .filter(t => t.games.length >= (config.cutoff || 0));

    const sortingFunctions = {
        gamesCount: (a, b) => b.games.length - a.games.length,
        winningPercentage: (a, b) => parseFloat(b.wins)/b.games.length - parseFloat(a.wins)/a.games.length
    };

    teams.sort(sortingFunctions[config.sort || 'winningPercentage']);
    return teams
}