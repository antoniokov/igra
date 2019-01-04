const label = {
    'name': game => {
        const typeLabel = game['Тип'] === 'Финал' ? 'Финал' : `${game['Тип']} игра`;
        const seriesLabel = {
            'Зима': game['Тип'] === 'Финал' ? 'года' : 'зимы',
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


export function showTooltip (game, id) {
    ['name', 'team', 'result', 'best-player'].forEach(part => d3.select(`#bricks-tooltip-${part}-${id}`).text(label[part](game)));


    const margin = 4;
    const width = 240+12+12;
    const height = 100+12;

    const rect = d3.event.target.getBoundingClientRect();

    const left = rect.right > 550 ? rect.right - width - margin : rect.right + margin;
    const bottom = rect.bottom > 300 ? rect.bottom - height - margin : rect.bottom + margin;

    const tooltip = d3.select(`#bricks-tooltip-${id}`);

    tooltip
        .style('left',`${left}px`)
        .style('top', `${bottom}px`);

    tooltip
        .style('visibility', 'visible');
}

export function hideTooltip (id) {
    const tooltip = d3.select(`#bricks-tooltip-${id}`);

    tooltip.style('visibility', 'hidden');
}
