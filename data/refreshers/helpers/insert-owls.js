module.exports = (row, entity) => {
    const owls = row['Малых сов'] + row['Больших сов'];
    if (!owls)
        return row[entity];

    const owlSymbols = Array(owls).fill('🦉').join('');
    return `${owlSymbols} ${row[entity]}`;
};
