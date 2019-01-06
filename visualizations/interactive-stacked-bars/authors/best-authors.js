export default {
    id: 'best-authors',
    entity: 'Телезритель',
    dataSource: 'authors',
    preFilter: (row) => row['Игр'] >= 5,
    measures: ['Игр', 'Процент побед', 'Лучший телезритель', 'Процент лучших'],
    top: 24
};
