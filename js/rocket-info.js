import launches_by_year from '../data/Launches-by-year.json' assert {type: 'json'};
import theme from '../themes/dark.theme.json' assert {type: 'json'};

const rockets = {};

Object.keys(launches_by_year).filter(year => year <= 2022).forEach(year => {
    launches_by_year[year].forEach(launch => {
        const conf = launch.rocket.configuration;
        const rocketFamily = conf.family;
        if (!rockets[rocketFamily]) {
            rockets[rocketFamily] = {
                total_launches: 0,
                successful_launches: 0,
                description: conf.description,
                country: conf.manufacturer.country_code,
                specs: {
                    length: [],
                    diameter: [],
                    launch_mass: [],
                    leo_capacity: []
                }
            };
        }

        rockets[rocketFamily].total_launches += 1;
        rockets[rocketFamily].successful_launches += launch.status.id === 3 ? 1 : 0;
        if (conf.length && conf.length > 0) {
            rockets[rocketFamily].specs.length.push(conf.length);
        }

        if (conf.diameter && conf.diameter > 0) {
            rockets[rocketFamily].specs.diameter.push(conf.diameter);
        }

        if (conf.launch_mass && conf.launch_mass > 0) {
            rockets[rocketFamily].specs.launch_mass.push(conf.launch_mass);
        }

        if (conf.leo_capacity && conf.leo_capacity > 0) {
            rockets[rocketFamily].specs.leo_capacity.push(conf.leo_capacity);
        }
    });
});

Object.keys(rockets).forEach(key => {
    const rocket = rockets[key];
    rocket.specs.length = rocket.specs.length.reduce((a, b) => a + b, 0) / rocket.specs.length.length;
    rocket.specs.diameter = rocket.specs.diameter.reduce((a, b) => a + b, 0) / rocket.specs.diameter.length;
    rocket.specs.launch_mass = rocket.specs.launch_mass.reduce((a, b) => a + b, 0) / rocket.specs.launch_mass.length;
    rocket.specs.leo_capacity = rocket.specs.leo_capacity.reduce((a, b) => a + b, 0) / rocket.specs.leo_capacity.length;
});

const rocketImages = {
    Atlas: 'Atlas',
    Delta: 'Delta',
    Falcon: 'Falcon',
    Kosmos: 'kosmos',
    'Proton / UR-500': 'Proton',
    'R-7': 'R-7',
    'Soyuz': 'soyuz',
    'Titan': 'titan'
}

let topTenRocketsKeys = Object.keys(rockets)
    .sort((a, b) => rockets[b].total_launches - rockets[a].total_launches)
    .splice(0, 10);

const topTenRocketsObjs = {};

topTenRocketsKeys.forEach(key => { topTenRocketsObjs[key] = rockets[key] })

console.log(topTenRocketsObjs)

topTenRocketsKeys = topTenRocketsKeys.sort((a, b) => topTenRocketsObjs[a].specs.length - topTenRocketsObjs[b].specs.length)

const filteredKeys = Object.keys(topTenRocketsObjs).filter(key => Object.keys(rocketImages).includes(key));

var chartDom = document.getElementById('rocket-info-container');
var myChart = echarts.init(chartDom, 'dark-theme');
var option;

option = {
    tooltip: {
        formatter: (param) => {
            const specs = topTenRocketsObjs[param.name].specs;
            return `Length: ${specs.length.toFixed(1)}m<br> 
                    Diameter: ${specs.diameter.toFixed(1)}m<br> 
                    Launch mass: ${specs.launch_mass.toFixed(1)}t<br>
                    LEO capacity: ${specs.leo_capacity.toFixed(1)}t`; 
        }
    },
    xAxis: [
        {
            data: filteredKeys,
            axisLabel: {
                margin: 20,
                color: '#ddd',
                fontSize: 14
            },
        }
    ],
    yAxis: {
        name: 'Length in meters',
        axisLabel: {
            margin: 20,
            color: '#ddd',
            fontSize: 14
        },
        splitLine: {
            lineStyle: {
                color: '#777',
                type: 'dashed'
            }
        }
    },
    animationEasing: 'elasticOut',
    series: [
        {
            type: 'pictorialBar',
            name: 'Rocket height',
            emphasis: {
                scale: true
            },
            label: {
                show: true,
                position: 'top',
                formatter: (param) => 'Ø ' + topTenRocketsObjs[param.name].specs.diameter.toFixed(1) + "m",
                fontSize: 16,
                color: theme.color[2]
            },
            data: filteredKeys.map(key => {
                return {
                    value: topTenRocketsObjs[key].specs.length.toFixed(1),
                    symbol:
                        `image://../assets/rockets/${rocketImages[key]}.png`,
                    symbolSize: [50, '100%']
                }
            })
        },
        
    ]
};

option && myChart.setOption(option);
