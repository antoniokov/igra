import sortTeams from './sort-teams.js';


const columns = [
    { id: 'Команда', class: 'name', label: 'Команда'},
    { id: 'Побед', class: 'wins', label: '+' },
    { id: 'Поражений', class: 'losses', label: '−' },
    { id: 'Процент побед', class: 'percentage', label: '%' },
];

export function drawTable (teams, chartId) {
    const table = d3.select(`#left-${chartId}`)
        .append('table')
        .attr('class', 'left');

    const thead = table.append('thead');
    thead.append('tr')
        .selectAll('th')
        .data(columns)
        .enter().append('th')
        .attr('class', c => c.class)
        .text(c => c.label);

    const tbody = table.append('tbody');
    updateTable(chartId, { param: 'teams', value: teams });
}

export function updateTable (chartId, change) {
    const update = {
        'teams': (teams) => {
            const tbody = d3.selectAll(`#${chartId} table.left tbody`);
            const rows = tbody.selectAll('tr').data(teams, (t,i) => `${i}-${t['Команда']}`);
            const newRows = rows.enter().append('tr');
            rows.exit().remove();

            const cells = newRows.merge(rows).selectAll('td')
                .data(t => columns.map(c => ({
                    team: t['Команда'],
                    id: c.id,
                    class: c.class,
                    label: t[c.id]
                })), cell => `${cell.team}-${cell.id}`);

            cells.enter().append('td')
                .merge(cells)
                .attr('class', c => c.class)
                .text(c => c.label);

            cells.exit().remove();
        },
        'sortBy': (sortBy) => {
            const teams = d3.selectAll(`#left-${chartId} tbody tr`).data();
            update.teams(sortTeams(teams, sortBy));
        }
    };

    update[change.param](change.value);
}
