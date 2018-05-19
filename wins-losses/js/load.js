const publicSpreadsheetUrl = '1eo10PIQrAZcXUxCObB2KQeAnkM7BrKo2Q9NmzxPieBU';
const isMocked = true;


function load() {
    if (!isMocked) {
        return Tabletop.init({
            key: publicSpreadsheetUrl,
            callback: data => draw(process(strip(data)))
        });
    }

    const processedGames = process({ 'Игры': GAMES });
    draw(processedGames);
}

window.addEventListener('DOMContentLoaded', load);
