const publicSpreadsheetUrl = '1eo10PIQrAZcXUxCObB2KQeAnkM7BrKo2Q9NmzxPieBU';

function init() {
    Tabletop.init( { key: publicSpreadsheetUrl,
        callback: draw,
        simpleSheet: true } )
}

window.addEventListener('DOMContentLoaded', init);
