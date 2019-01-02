const publicSpreadsheetUrl = '1eo10PIQrAZcXUxCObB2KQeAnkM7BrKo2Q9NmzxPieBU';
const isMocked = true;


function load() {
    if (!isMocked) {
        return Tabletop.init({
            key: publicSpreadsheetUrl,
            parseNumbers: true,
            wanted: ['Серии', 'Игры', 'Составы', 'Раунды', 'Вопросы'],
            callback: data => draw(process(strip(data))['Игры'])
        });
    }

    const processedSheets = process({
        //'Серии': SERIES,
        'Игры': GAMES,
        //'Составы': LINEUPS,
        //'Раунды': ROUNDS,
        //'Вопросы': QUESTIONS
    });
    draw(processedSheets['Игры']);
}

window.addEventListener('DOMContentLoaded', load);
