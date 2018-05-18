function generateName (game) {
    const typeLabel = game['Тип'] === 'Финал' ? 'Финал' : `${game['Тип']} игра`;
    const seriesLabel = {
        'Зима': 'года',
        'Весна': 'весны',
        'Лето': 'лета',
        'Осень': 'осени',
    }[game['Серия']];

    return `${typeLabel} ${seriesLabel}, ${game['Дата'].getFullYear()}`;
}


function showTooltip(game, index) {
    const tooltip = d3.select('#tooltip');


    d3.select('#tooltip-name').text(generateName(game));
    d3.select('#tooltip-team').text(game['Команда']);
    d3.select('#tooltip-result').text(`${game['Знатоки']}:${game['Телезрители']}`);
    d3.select('#tooltip-best-player').text(game['Лучший знаток']);

    const rect = d3.event.target.getBoundingClientRect();
    const margin = 4;

    tooltip
        .style('left',`${rect.right + margin}px`)
        .style('top', `${rect.bottom + margin}px`);

    tooltip
        .style('visibility', 'visible');
}

function hideTooltip() {
    const tooltip = d3.select('#tooltip');

    tooltip.style('visibility', 'hidden');
}
