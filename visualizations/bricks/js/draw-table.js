export default function drawTable (teams, id) {
    const table = d3.select(`#left-${id}`)
        .append('table')
        .attr('class', 'left');

    const columns = [
        { id: 'Команда', class: 'name', label: 'Команда'},
        { id: 'Побед', class: 'wins', label: '+' },
        { id: 'Поражений', class: 'losses', label: '−' },
        { id: 'Процент побед', class: 'percentage', label: '%' },
    ];
    const thead = table.append('thead');
    thead.append('tr')
        .selectAll('th')
        .data(columns)
        .enter().append('th')
        .attr('class', c => c.class)
        .text(c => c.label);

    const tbody = table.append('tbody');
    const rows = tbody.selectAll('tr')
        .data(teams)
        .enter().append('tr');

    const cells = rows.selectAll('td')
        .data(t => columns.map(c => ({
            id: c.id,
            class: c.class,
            label: t[c.id]
        })))
        .enter().append('td')
        .attr('class', c => c.class)
        .text(c => c.label);
}
