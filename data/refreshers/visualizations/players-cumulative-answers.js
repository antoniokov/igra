const refresh = sheets => {
    const playerCategory = {
        'Мария Морозова': 'Раскрылись не сразу',
        'Александр Курзинер': 'Раскрылись не сразу',
        'Ольга Клюева': 'Раскрылись не сразу',
        //'Дмитрий Старикович': 'Раскрылись не сразу',
        //'Ростислав Миневич': 'Засухи',
        // 'Сергей Капустников': 'Засухи',
        // 'Максим Воронецкий': 'Засухи',
        // 'Вера Артамонова': 'Засухи',
        //'Мария Орановская': 'Засухи',
        //'Роман Ольшевский': 'Засухи',
        // 'Дмитрий Герчиков': 'Засухи',
        //'Алексей Голубов': 'Засухи',
        //'Валерий Семёнов': 'Засухи',
        //'Сергей Башлыкевич': 'Раскрылись не сразу',
    };

    const categoryOrder = {
        'Лидеры': 0,
        'Засухи': 1,
        'Раскрылись не сразу': 2
    };


    sheets['Знатоки'].sort((p1, p2) => p2['Правильных'] - p1['Правильных']);
    const cumulativeLeaders = sheets['Знатоки'].slice(0, 5).map(p => p['Знаток']);
    sheets['Знатоки'].sort((p1, p2) => p2['Правильных ответов за игру'] - p1['Правильных ответов за игру']);
    const perGameLeaders = sheets['Знатоки'].slice(0, 5).map(p => p['Знаток']);

    const leaders = [...new Set([...cumulativeLeaders, ...perGameLeaders])];

    const players = sheets['Знатоки']
        .filter(p => p['Только в благотворительных'] !== 'Да')
        .reduce((result, p) => {
            const games = sheets['Составы']
                .filter(l => l['Знаток'] === p['Знаток'])
                .map((l, i) => ({
                    'Номер игры': i + 1,
                    'Правильных ответов': sheets['Вопросы'].filter(q => q['ID игры'] === l['ID игры'] &&
                        q['Отвечал'] === p['Знаток'] && q['Результат'] === 'Проиграл').length
                }));

            const longestDraught = games
                .filter(g => !g['Правильных ответов'])
                .reduce((res, g) => {
                    if (g['Номер игры'] === res.prevIndex + 1) {
                        return {
                            prevIndex: g['Номер игры'],
                            curr: res.curr + 1,
                            max: res.curr + 1 > res.max ? res.curr + 1 : res.max
                        };
                    } else {
                        return {
                            prevIndex: g['Номер игры'],
                            curr: 0,
                            max: res.max
                        };
                    }
                }, { prevIndex: 0, curr: 0, max: 0 });

            // cumulative
            const m = 'Правильных ответов';
            games.reduce((prev, curr) =>  {
                const sum = curr[m] + prev;
                Object.assign(curr, { 'Сумма правильных ответов': sum });
                return sum;
            }, 0);

            return [...result, { 'Знаток': p['Знаток'], 'Длиннейшая засуха': longestDraught.max, 'Игры': games }];
        }, []);

    players.sort((p1, p2) => p2['Длиннейшая засуха'] - p1['Длиннейшая засуха']);
    const draughtLeaders = players
        .slice(0, 5)
        .filter(p => p['Длиннейшая засуха'] >= 5)
        .map(p => p['Знаток']);

    const data = players.reduce((result, p) => {
        const category = playerCategory[p['Знаток']] || (leaders.includes(p['Знаток'])
            ? 'Лидеры'
            : draughtLeaders.includes(p['Знаток']) ? 'Засухи' : null);

        if (category) {
            p['Игры'].forEach(g => result.push(Object.assign({
                'Знаток': p['Знаток'],
                'Категория': category,
                'Длиннейшая засуха': p['Длиннейшая засуха']
            }, g)));
        }

        return result;
    }, []);

    data.sort((d1, d2) => {
        const categoryDiff = categoryOrder[d1['Категория']] - categoryOrder[d2['Категория']];
        return categoryDiff;
    });

    return data;
};

module.exports.refresh = refresh;
