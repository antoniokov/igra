function drawLeft(teams) {
    const table = d3.select('body')
        .append('table');

    const columns = [
        { id: 'name', label: 'Команда' },
        { id: 'wins', label: '+' },
        { id: 'losses', label: '−' },
        { id: 'percentage', label: '%' },
    ];
    const thead = table.append('thead');
    thead.append('tr')
        .selectAll('th')
        .data(columns)
        .enter().append('th')
        .text(c => c.label);

    const tbody = table.append('tbody');
    const rows = tbody.selectAll('tr')
        .data(teams)
        .enter().append('tr');

    const cells = rows.selectAll('td')
        .data(t => columns.map(c => t[c.id]))
        .enter().append('td')
        .text(c => c);
}