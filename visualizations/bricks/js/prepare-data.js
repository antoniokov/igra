export default function prepareData (teams, games) {
    return teams
        .filter(t => t['Только в благотворительных'] !== 'Да')
        .map(t => Object.assign(t, {
            'Игры': games.filter(g => g['Команда'] === t['Команда']),
            'Процент побед': (100*t['Побед']/t['Игр']).toFixed(1)
        }))
}
