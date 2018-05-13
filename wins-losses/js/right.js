function drawRight(teams) {
    const table = d3.select('body')
        .append('table');

    const thead = table.append('thead');
    thead.append('tr')
        .append('th');

    const tbody = table.append('tbody');
    const rows = tbody.selectAll('tr')
        .data(teams)
        .enter().append('tr');

    const cells = rows.selectAll('td')
        .data(t => t.games.map(g => ({
            team: t.name,
            game: g
        })))
        .enter().append('td')
        .text(g => g.game['Выиграл'] === 'Знатоки' ? 'З' : 'Т');
}