function drawTable(teams) {
    const table = d3.select('#left')
        .append('table')
        .attr('class', 'left');

    const columns = [
        { id: 'name', label: 'Команда'},
        { id: 'wins', label: '+' },
        { id: 'losses', label: '−' },
        { id: 'percentage', label: '%' },
    ];
    const thead = table.append('thead');
    thead.append('tr')
        .selectAll('th')
        .data(columns)
        .enter().append('th')
        .attr('class', c => c.id)
        .text(c => c.label);

    const tbody = table.append('tbody');
    const rows = tbody.selectAll('tr')
        .data(teams)
        .enter().append('tr');

    const cells = rows.selectAll('td')
        .data(t => columns.map(c => ({
            id: c.id,
            label: t[c.id]
        })))
        .enter().append('td')
        .attr('class', c => c.id)
        .text(c => c.label);
}