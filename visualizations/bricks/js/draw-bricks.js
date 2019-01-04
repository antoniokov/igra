const differenceToOpacity = d3.scaleLinear()
    .domain([0, 6])
    .range([0.3, 1.0]);


export default function drawBricks (teams, config = {}) {
    const table = d3.select('#right')
        .append('table')
            .attr('class', 'bricks');

    const mostGames = Math.max(...teams.map(t => t['Игры'].length));
    const thead = table.append('thead');
    thead.append('tr')
        .append('th')
        .attr('colspan', mostGames)
        .text(config.header || '');

    const tbody = table.append('tbody');
    const rows = tbody.selectAll('tr')
        .data(teams)
        .enter().append('tr');

    const cells = rows.selectAll('td')
        .data(t => t['Игры'])
        .enter().append('td');

    const bricks = cells.append('a')
        .attr('href', g => g['Видео'] || 'javascript:void(0)')
        .attr('target', g => g['Видео'] ? '_blank' : null)
        .attr('class', 'result')
        .classed('win', g => g['Выиграл'] === 'Знатоки')
        .classed('series-final', g => g['Тип'] === 'Финал' && g['Серия'] !== 'Зима')
        .classed('year-final', g => g['Тип'] === 'Финал' && g['Серия'] === 'Зима')
        .classed('all-in', g => g['РР'] === 'РР')
        .style('opacity', g => differenceToOpacity(Math.abs(g['Знатоки'] - g['Телезрители'])))
        .on('mouseover', showTooltip)
        .on('mouseout', hideTooltip);
}