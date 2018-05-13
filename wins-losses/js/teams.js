function getTeams(games) {
    const teams = games
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

            if (g['Выиграл'] === 'Знатоки') {
                grouped[team].wins++;
            } else {
                grouped[team].losses++;
            }
            
            grouped[team].percentage = (100* grouped[team].wins / grouped[team].games.length).toFixed(1).toString();

            return grouped;
        }, {});

    return Object.keys(teams)
        .map(t => teams[t])
        .filter(t => t.games.length >= 3);
}