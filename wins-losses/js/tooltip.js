const label = {
    'name': game => {
        const typeLabel = game['Тип'] === 'Финал' ? 'Финал' : `${game['Тип']} игра`;
        const seriesLabel = {
            'Зима': 'года',
            'Весна': 'весны',
            'Лето': 'лета',
            'Осень': 'осени',
        }[game['Серия']];

        return `${typeLabel} ${seriesLabel}, ${game['Дата'].getFullYear()}`;
    },

    'team': game => game['Команда'],
    'result': game => {
        const allInLabel = game['РР'] ? ' (РР)' : '';
        return `${game['Знатоки']}:${game['Телезрители']}${allInLabel}`;
    },
    'best-player': game => game['Лучший знаток']
};


function showTooltip(game, index) {
    ['name', 'team', 'result', 'best-player'].forEach(part => d3.select(`#tooltip-${part}`).text(label[part](game)));

    const rect = d3.event.target.getBoundingClientRect();
    const margin = 4;

    const tooltip = d3.select('#tooltip');

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
