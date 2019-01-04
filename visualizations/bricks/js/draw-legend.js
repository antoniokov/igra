export default function drawLegend(id) {
    const legend = d3.select(`#legend-${id}`);

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
        .attr('class', e => `legend-label legend-${e.id}`)
        .text(e => e.label);
}
