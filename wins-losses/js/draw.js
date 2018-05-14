function draw(games, tabletop) {
    const teams = getTeams(games);
    drawLeft(teams);
    drawRight(teams);
    drawLegend();
}
