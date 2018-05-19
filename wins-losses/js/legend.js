function drawLegend() {
    const legend = d3.select('#legend');

    const encodings = [
        { id: 'all-in', label: 'решающий раунд' },
        { id: 'series-final', label: 'финал серии' },
        { id: 'year-final', label: 'финал года' }
    ];

    const divs = legend.selectAll('div')
        .data(encodings)
        .enter().append('div')
        .attr('class', 'encoding');

    divs.append('div')
        .attr('class', e => `result ${e.id}`);

    divs.append('span')
        .attr('class', 'legend-label')
        .text(e => e.label);
}
