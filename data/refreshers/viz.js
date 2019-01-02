const refreshes = [
    require('./vizualisations/before-owls').refresh
];


const refreshViz = () => {
    refreshes.forEach(r => r());
};

module.exports = refreshViz;
