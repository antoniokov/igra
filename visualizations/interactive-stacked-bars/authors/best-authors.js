export default {
    id: 'best-authors',
    entity: 'Телезритель',
    dataSource: 'authors',
    preFilter: (row) => row['Людей'] !== 0 && row['Игр'] >= 5,
    preProcess: (row) => {
        const owls = row['Малых сов'] + row['Больших сов'];
        if (!owls)
            return row;

        const owlSymbols = Array(owls).fill('🦉').join('');
        return Object.assign({}, row, { 'Телезритель': `${owlSymbols} ${row['Телезритель']}` });
    },
    measures: ['Игр', 'Процент побед', 'Лучший телезритель', 'Процент лучших'],
    top: 24
};
