function draw(games, tabletop) {
    const teams = getTeams(games, { sort: 'winningPercentage' });
    drawTable(teams);
    drawBricks(teams);
    drawLegend();
}
