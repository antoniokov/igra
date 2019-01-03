const measuresWhiteList = ['Ответов', 'Игр', 'Финалов', 'Призов лучшему знатоку' , 'Суперблицев', 'Решающих раундов'];

export default {
    id: 'before-owl',
    dataSource: 'before-owl',
    measuresWhiteList: measuresWhiteList,
    calculateAnnotations: (dataTransformed) => {
        const dataPluses = dataTransformed.filter(s => s['Результат'] === '+');
        return measuresWhiteList.map(m => {
            const sum = dataPluses.reduce((result, s) => result + s[m], 0);
            const average = sum/dataPluses.length;
            return {
                dim: m,
                val: Math.round(average),
                color: '#24693D',
                text: `В среднем ${Math.round(average)}`
            }
        });
    }
};
