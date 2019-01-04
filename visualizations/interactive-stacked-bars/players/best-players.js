export default {
    id: 'best-players',
    dataSource: 'players',
    preFilter: (row) => row['Только в благотворительных'] !== 'Да' && row['Игр'] >= 5,
    top: 24
};
