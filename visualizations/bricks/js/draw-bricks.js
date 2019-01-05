import { showTooltip, hideTooltip } from './tooltip.js';
import sortTeams from './sort-teams.js';


const differenceToOpacity = d3.scaleLinear()
    .domain([0, 6])
    .range([0.3, 1.0]);


const groupBrickBlocks = (teams, groupBy) => {
    if (!groupBy) {
        return [ { id: 'basic', teams: teams, header: '' } ];
    }

    const headers = {
        'Сезон': s => s + 2008
    };

    const games = teams.reduce((result, t) => [...result, ...t['Игры']], []);
    const groups = [...new Set(games.map(g => g[groupBy]))];

    return groups.map(group => {
        const groupTeams = teams
            .map(t => Object.assign({}, t, { 'Игры': t['Игры'].filter(g => g[groupBy] === group) } ));

        const header = headers[groupBy] ? headers[groupBy](group) : group;
        return { id: group, teams: groupTeams, header: header };
    });
};


export function drawBricks (teams, chartId, groupBy = null) {
    const brickBlocks = groupBrickBlocks(teams, groupBy);
    updateBricks(chartId, { param: 'brickBlocks', value: brickBlocks })
}

export function updateBricks (chartId, change) {
    const update = {
        'brickBlocks': (brickBlocks) => {
            const tables = d3.select(`#right-${chartId}`).selectAll('table').data(brickBlocks, bb => bb.id);
            const newTables = tables.enter().append('table');
            const updatedTables = newTables.merge(tables)
                .attr('id', bb => `brick-block-${bb.id}`)
                .attr('class', 'brick-block');
            tables.exit().remove();

            const ths = updatedTables.selectAll('th');
            const newThs = newTables.append('thead').append('th');
            newThs.merge(ths)
                .attr('colspan', bb => Math.max(...bb.teams.map(t => t['Игры'].length)))
                .text(bb => bb.header);

            newTables.append('tbody');
            updatedTables.select('tbody');// inherit new data
            const rows = updatedTables.selectAll('tbody').selectAll('tr')
                .data(bb => bb.teams, (t,i) => `${i}-${t['Команда']}`);
            const newRows = rows.enter().append('tr');
            rows.exit().remove();

            const cells = newRows.merge(rows).selectAll('td').data(t => t['Игры'], (g,i) => `${i}-${g['ID игры']}`);
            const newCells = cells.enter().append('td');
            newCells.append('a');
            cells.exit().remove();

            const bricks = newCells.merge(cells).selectAll('a')
                .attr('href', g => g['Видео'] || 'javascript:void(0)')
                .attr('target', g => g['Видео'] ? '_blank' : null)
                .attr('class', 'result')
                .classed('win', g => g['Выиграл'] === 'Знатоки')
                .classed('series-final', g => g['Тип'] === 'Финал' && g['Серия'] !== 'Зима')
                .classed('year-final', g => g['Тип'] === 'Финал' && g['Серия'] === 'Зима')
                .classed('all-in', g => g['РР'] === 'РР')
                .style('opacity', g => differenceToOpacity(Math.abs(g['Знатоки'] - g['Телезрители'])))
                .on('mouseover', e => showTooltip(e, chartId))
                .on('mouseout', e => hideTooltip(chartId));
        },
        'groupBy': (groupBy) => {
            const teams = d3.selectAll(`#left-${chartId} tbody tr`).data();
            drawBricks(teams, chartId, groupBy);
        },
        'sortBy': (sortBy) => {
            const currentBrickBlocks = d3.selectAll(`#right-${chartId} table`).data();
            const brickBlocks = currentBrickBlocks.map(bb => Object.assign({}, bb, {
                teams: sortTeams(bb.teams, sortBy)
            }));
            update.brickBlocks(brickBlocks);
        }
    };

    update[change.param](change.value);
}
