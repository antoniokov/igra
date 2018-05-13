const differenceToOpacity = d3.scaleLinear()
    .domain([0, 6])
    .range([0.3, 1.0]);


function drawRight(teams) {
    const table = d3.select('body')
        .append('table')
        .attr('class', 'right');

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
        .append('div')
        .attr('class', 'result')
        .classed('win', g => g.game['Выиграл'] === 'Знатоки')
        .classed('series-final', g => g.game['Тип'] === 'Финал' && g.game['Серия'] !== 'Зима')
        .classed('year-final', g => g.game['Тип'] === 'Финал' && g.game['Серия'] === 'Зима')
        .classed('all-in', g => g.game['РР'] === 'РР')
        .style('opacity', g => differenceToOpacity(Math.abs(g.game['Знатоки'] - g.game['Телезрители'])));
}