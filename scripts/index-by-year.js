const launches = require('../data/Launches.json');

const fs = require('fs');

const launchesByYear = {};

launches.forEach(launch => {
    const year = new Date(launch.window_end).getFullYear();
    if (!launchesByYear.hasOwnProperty(year)) {
        launchesByYear[year] = [];
    }

    launchesByYear[year].push(launch)
});

fs.writeFileSync("../data/Launches-by-year.json", JSON.stringify(launchesByYear));