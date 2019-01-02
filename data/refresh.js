const refreshRaw = require('./refreshers/raw');
const refreshViz = require('./refreshers/viz');

const refresh = {
    'all': () => refreshRaw(refreshViz),
    'raw': refreshRaw,
    'viz': refreshViz
};
const mode = process.argv[2] || 'all';

refresh[mode]();
