function getTeams(games) {
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

            const game = Object.assign(g);
            const parts = g['Дата'].split('.');
            game['Дата'] = new Date(parts[2], parts[1], parts[0]);
            grouped[team].games.push(game);

            if (g['Выиграл'] === 'Знатоки') {
                grouped[team].wins++;
            } else {
                grouped[team].losses++;
            }
            
            grouped[team].percentage = (100* grouped[team].wins / grouped[team].games.length).toFixed(1).toString();

            return grouped;
        }, {});

    const teams = Object.keys(teamsObj)
        .map(t => teamsObj[t])
        .filter(t => t.games.length >= 0);

    teams.sort((a, b) => parseFloat(b.wins)/b.games.length - parseFloat(a.wins)/a.games.length);

    return teams
}