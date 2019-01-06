const measures = ['Ответов', 'Игр', 'Финалов', 'Призов лучшему знатоку' , 'Суперблицев', 'Решающих раундов'];
// , 'Процент лучших' - cutoff # of games

export default {
    id: 'without-owl',
    entity: 'Знаток',
    dataSource: 'players',
    preFilter: (row) => row['Малых сов'] + row['Больших сов'] === 0 && row['Только в благотворительных'] !== 'Да',
    measuresList: measures,
    top: 24,
    postRender: (results) => {
        const [beforeOwl, withoutOwl] = results;
        const averageOwlAnnotations = beforeOwl.annotations.map(a => Object.assign(a, { text: 'Средняя сова' }));

        const beforeOwlPluses = beforeOwl.dataLabeled.filter(s => s['Результат'] === '+');
        const toughestOwlAnnotations = measures
            //.filter(m => !['Процент лучших'].includes(m))
            .map(m => {
                const maximum = beforeOwlPluses.reduce((maxObj, dp) => {
                    return dp[m] > maxObj.value ? { value: dp[m], player: dp['Знаток'] } : maxObj;
                }, { value: 0, player: null });

                return {
                    dim: m,
                    val: maximum.value,
                    color: '#24693D',
                    text: maximum.player
                };
            });

        const annotations = [...averageOwlAnnotations, ...toughestOwlAnnotations];
        withoutOwl.config.plugins.push(Taucharts.api.plugins.get('annotations')({ items: annotations }));
        withoutOwl.chart.updateConfig(withoutOwl.config);
    }
};
