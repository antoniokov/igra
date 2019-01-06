const refresh = sheets => {
    const games = sheets['Игры'].map(g => {
        const questions = sheets['Вопросы'].filter(q => q['ID игры'] === g['ID игры'] && q['Отвечал'] === g['Лучший знаток']);
        return {
            'ID игры': g['ID игры'],
            'Выиграл': g['Выиграл'],
            'Лучший знаток': g['Лучший знаток'],
            'Пол': sheets['Знатоки'].filter(p => p['Знаток'] === g['Лучший знаток'])[0]['Пол'],
            'Ответов': questions.length,
            'Правильных ответов':  questions.filter(q => q['Результат'] === 'Проиграл').length
        }
    });

    const sexLabels = {
        'М': 'Мужчины',
        'Ж': 'Женщины'
    };
    const sexes = ['М', 'Ж'].map(sex => {
        const g = games.filter(g => g['Пол'] === sex);
        const stats = ['Ответов', 'Правильных ответов'].reduce((obj, m) => Object.assign(obj, {
            [m]: Math.round(10 * g.reduce((sum, g) => sum + g[m], 0) / g.length)/10
        }), {});
        return Object.assign( { 'Пол': sexLabels[sex] }, stats);
    });

    return sexes;
};

module.exports.refresh = refresh;
