const draw = async () => {
    const statsArray = await d3.json('https://raw.githubusercontent.com/antoniokov/igra/master/data/raw/%D0%97%D0%BD%D0%B0%D1%82%D0%BE%D0%BA%D0%B8.json');
    const stats = statsArray.reduce((result, s) => Object.assign(result, { [s['Знаток']]: s } ), {});

    const measuresSplit = {
        'Ответов': {
            '+': s => s['Правильных'],
            '-': s => s['Ответов'] - s['Правильных']
        },
        'Игр': {
            '+': s => s['Побед'],
            '-': s => s['Игр'] - s['Побед']
        },
        'Финалов': {
            '+': s => s['Выигранных финалов'],
            '-': s => s['Финалов'] - s['Выигранных финалов']
        },
        'Призов лучшему знатоку': {
            '+': s => s['Призов лучшему знатоку'],
            '-': s => 0
        },
        'Суперблицев': {
            '+': s => s['Взятых суперблицев'],
            '-': s => s['Суперблицев'] - s['Взятых суперблицев']
        },
        'Решающих раундов': {
            '+': s => s['Взятых решающих раундов'],
            '-': s => s['Решающих раундов'] - s['Взятых решающих раундов']
        }
    };

    const statsPrepared = Object.keys(stats)
        .filter(s => stats[s]['Малых сов'] + stats[s]['Больших сов'] === 0 && stats[s]['Только в благотворительных'] !== 'Да')
        .reduce((result, s) => {
            ['+', '-'].forEach(r => {
                const obj = { 'Знаток': s, 'Результат': r };
                Object.keys(measuresSplit).forEach(m => obj[m] = measuresSplit[m][r](stats[s]));
                result.push(obj);
        });

        return result;
    }, []);

    const defaultMeasure = 'Ответов';
    const sortingFunctionTemplate = measure => {
        const getPluses = p => measuresSplit[measure]['+'](stats[p]);
        return (s1, s2) => {
            const difference = getPluses(s2['Знаток']) - getPluses(s1['Знаток']);
            return difference || (stats[s2['Знаток']][measure] - stats[s1['Знаток']][measure]);
        }
    };

    statsPrepared.sort(sortingFunctionTemplate(defaultMeasure));

    const topCutoff = 24;

    const howNotToWinACrystalOwlConfig = {
        data: statsPrepared.slice(0, topCutoff*2),
        type: 'horizontal-stacked-bar',
        x: defaultMeasure,
        y: 'Знаток',
        color: 'Результат',
        guide: {
            color: {
                brewer: {
                    '+': '#24693D',
                    '-': '#9E9E9E'
                }
            },
            showGridLines: ''
        },
        settings: {
            fitModel: 'entire-view'
        },
        plugins: [
            Taucharts.api.plugins.get('tooltip')(),
            Taucharts.api.plugins.get('annotations')({
                items: [
                    {
                        dim: 'Ответов',
                        val: 48,
                        color: '#24693D',
                        text: 'Алексей Полевой'
                    },
                    {
                        dim: 'Игр',
                        val: 17,
                        color: '#24693D',
                        text: 'Юлия Бейнер'
                    },
                    {
                        dim: 'Финалов',
                        val: 6,
                        color: '#24693D',
                        text: 'Елена Шибут'
                    },
                    {
                        dim: 'Призов лучшему знатоку',
                        val: 7,
                        color: '#24693D',
                        text: 'Алексей Полевой'
                    },
                    {
                        dim: 'Суперблицев',
                        val: 2,
                        color: '#24693D',
                        text: 'Алексей Полевой'
                    },
                    {
                        dim: 'Решающих раундов',
                        val: 2,
                        color: '#24693D',
                        text: 'Евгений Зайцев'
                    }
                ]
            })
        ]
    };

    const howNotToWinACrystalOwlChart = new Taucharts.Chart(howNotToWinACrystalOwlConfig);

    howNotToWinACrystalOwlChart.renderTo('#chart-how-not-to-win-a-crystal-owl');

    document.querySelector('#select-how-not-to-win-a-crystal-owl').addEventListener('change', (e) => {
        howNotToWinACrystalOwlConfig.x = e.currentTarget.value;
        statsPrepared.sort(sortingFunctionTemplate(e.currentTarget.value));
        howNotToWinACrystalOwlConfig.data = statsPrepared.slice(0, topCutoff*2);
        howNotToWinACrystalOwlChart.updateConfig(howNotToWinACrystalOwlConfig);
    });
};

draw();