function buildTooltip (container, id) {
    const tooltip = container.append('div')
        .attr('id', `bricks-tooltip-${id}`)
        .attr('class', 'tooltip');

    tooltip.append('h3').attr('id', `bricks-tooltip-name-${id}`);

    const meta = [
        { id: 'team', text: 'Команда: ' },
        { id: 'result', text: 'Счёт: ' },
        { id: 'best-player', text: 'Лучший игрок: ' }
    ];

    meta.forEach(m => {
        tooltip.append('p')
            .text(m.text)
            .append('span')
            .attr('id', `bricks-tooltip-${m.id}-${id}`);
    });
}


export default function buildSkeleton (id) {
    const container = d3.select(`#${id}`)
        .classed('grid-container', true);

    buildTooltip(container, id);

    ['left', 'right'].forEach(side => {
        container.append('div')
            .attr('id', `${side}-${id}`)
            .attr('class', side)
    });

    container.append('div');
    container.append('div');

    container.append('div')
        .attr('id', `legend-${id}`)
        .attr('class', 'legend');
};
