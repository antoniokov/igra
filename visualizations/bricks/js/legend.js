function drawLegend() {
    const legend = d3.select('#legend');

    const encodings = [
        { id: 'series-final', label: 'финал серии' },
        { id: 'year-final', label: 'финал года' },
        { id: 'all-in', label: 'решающий раунд' }
    ];

    const divs = legend.selectAll('div')
        .data(encodings)
        .enter().append('div')
        .attr('class', 'encoding');

    divs.append('span')
        .attr('id', e => `legend-${e.id}`)
        .attr('class', 'legend-label')
        .text(e => e.label);
}
