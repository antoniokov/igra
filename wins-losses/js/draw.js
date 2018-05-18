function draw(games, tabletop) {
    const teams = getTeams(games);
    drawTable(teams);
    drawBricks(teams);
    drawLegend();
    //drawTooltip();
}
