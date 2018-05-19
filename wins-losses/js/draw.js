function draw(games, tabletop) {
    const teams = getTeams(games, { sort: 'gamesCount' });
    drawTable(teams);

    const seasons = [...new Set(games.map(g => g['Сезон']))];
    seasons.forEach(s => {
        const filteredTeams = teams.map(t => {
            const team = Object.assign({}, t);
            team.games = t.games.filter(g => g['Сезон'] === s);
            team.games.sort((a,b) => a['Дата'] - b['Дата']);
            return team;
        });
        drawBricks(filteredTeams, { header: s + 2008 })
    });
    drawLegend();
}
