export default function sortTeams (teams, sortBy) {
    const sortingFunctions = {
        'Процент побед': (a, b) => parseFloat(b['Побед'])/b['Игр'] - parseFloat(a['Побед'])/a['Игр'],
        'Первая игра': (a, b) => a[sortBy] - b[sortBy]
    };

    const sortingFunction = sortingFunctions[sortBy] || ((a, b) => b[sortBy] - a[sortBy]);
    const sortedTeams = teams.slice();
    sortedTeams.sort(sortingFunction);
    return sortedTeams;
}
