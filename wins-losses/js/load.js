const publicSpreadsheetUrl = '1eo10PIQrAZcXUxCObB2KQeAnkM7BrKo2Q9NmzxPieBU';
const isMocked = true;


function loadFromSheets() {
    Tabletop.init( { key: publicSpreadsheetUrl,
        callback: draw,
        simpleSheet: true } )
}

function loadFromFile() {
    draw(GAMES);
}

window.addEventListener('DOMContentLoaded', isMocked ? loadFromFile : loadFromSheets);
