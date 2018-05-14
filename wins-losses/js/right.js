const differenceToOpacity = d3.scaleLinear()
    .domain([0, 6])
    .range([0.3, 1.0]);


function drawRight(teams) {
    const table = d3.select('#right')
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
        .data(t => t.games)
        .enter().append('td')
        .append('a')
        .attr('href', g => g['Видео'])
        .attr('target', '_blank')
        .attr('class', 'result')
        .classed('win', g => g['Выиграл'] === 'Знатоки')
        .classed('series-final', g => g['Тип'] === 'Финал' && g['Серия'] !== 'Зима')
        .classed('year-final', g => g['Тип'] === 'Финал' && g['Серия'] === 'Зима')
        .classed('all-in', g => g['РР'] === 'РР')
        .style('opacity', g => differenceToOpacity(Math.abs(g['Знатоки'] - g['Телезрители'])));
}