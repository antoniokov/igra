import { loadBatchAsync } from '../../helpers/load.js'
import visualize from './visualize.js';

import beforeOwl from './players/before-owl.js';
import withoutOwl from './players/without-owl.js';
import bestPlayers from './players/best-players.js';

const visualizationsAvailable = [ beforeOwl, withoutOwl, bestPlayers ];

const nodes = document.getElementsByClassName('interactive-stacked-bars');
const visualizations = visualizationsAvailable.filter(v => [...nodes].some(n => n.id === v.id));
const dataSourcesIds = [...new Set(visualizations.map(v => v.dataSource))];
loadBatchAsync(dataSourcesIds)
    .then(dataSets => {
        const rendered = visualizations.map(v => visualize(dataSets[v.dataSource], v));
        visualizations.forEach(v => v.postRender && v.postRender(rendered));
    });