import launches from '../data/Launches-by-year.json' assert {type: 'json'};
import darkTheme from '../themes/dark.theme.json' assert {type: 'json'};

echarts.registerTheme('dark-theme', darkTheme)


function calcTotalLaunches(data) {
    const launches_per_provider = {};

    data.forEach((element) => {
        let name = element["launch_service_provider"]["type"];
        //country = eur.includes(country) ? 'EUR' : country;

        launches_per_provider[name] = launches_per_provider[name]
            ? launches_per_provider[name] + 1
            : 1;
    });
    return launches_per_provider;
}

const years = Object.keys(launches).sort().filter(year => year <= 2022);

// Setup dataset as 2d array
const headers = [
    "Launches",
    "Provider",
    "Year",
];

const launches_array = [headers];
const seriesList = [];

years.forEach(year => {
    const total_launches = calcTotalLaunches(launches[year])

    Object.keys(total_launches).forEach(name => {
        launches_array.push([total_launches[name], name, year]);
    });
});


const lineRaceTime = 30000;

const chartDom = document.getElementById('successRate');
const myChart = echarts.init(chartDom, 'dark-theme');
let option;


let providers = [];

// 
// soviet: [2, 3, 4, 5, 6, 7, 8],
// us: [1, 3, 4, 5, 6, 7, 8],
// providername: [2, 3, 4, 5, 6, 7, 8],


years.forEach(year => {
    // Get all launch_service_provider.name for this year
    const providers_this_year = launches[year].map(launch => launch["launch_service_provider"]["type"]);
    // Add them to the set
    providers_this_year.forEach(provider => {
        if (!providers.includes(provider)) {
            providers.push(provider)
        }
    });
});

// console.log(providersObj);

// Object.entries(providersObj).forEach((key, value) => {
//     seriesList.push({
//         name: key,
//         type: 'line',
//         stack: 'Total',
//         areaStyle: {},
//         emphasis: {
//             focus: 'series'
//         },
//         data: [1957, 1958]
//     })
// });


function historyMarker(text, year) {
    const position = year - years[0];
    return {
        type: 'line',
        data: [],
        showSymbol: false,
        markLine: {
            symbol: ['none', 'pin'],
            symbolSize: 40,
            emphasis: {
                label: {
                    position: 'top',
                    formatter: () => text
                },
                lineStyle: {
                    width: 2
                }
            },
            label: {
                formatter: () => ""
            },
            data: [{ xAxis: position }],
            animationDuration: 500,
            animationDelay: lineRaceTime / (years.length / position),
            lineStyle: {
                width: 2
            }
        }
    }
}

const datasetWithFilters = [];

providers = providers.filter(provider => provider != "Multinational");


echarts.util.each(providers, function (name) {
    var datasetId = 'dataset_' + name;

    datasetWithFilters.push({
        id: datasetId,
        fromDatasetId: 'dataset_raw',
        transform: {
            type: 'filter',
            config: {
                and: [
                    { dimension: 'Provider', '=': name },
                ]
            }
        }
    });

    seriesList.push({
        type: 'line',
        lineStyle: {
            width: 0
        },
        stack: 'Total',
        areaStyle: {},
        datasetId: datasetId,
        showSymbol: false,
        name: name,
        endLabel: {
            show: true,
            formatter: function (params) {
                return params.value[1] + ': ' + params.value[0];
            }
        },
        labelLayout: {
            moveOverlap: 'shiftY'
        },
        emphasis: {
            focus: 'series'
        },
        encode: {
            x: 'Year',
            y: 'Launches',
            label: ['Provider', 'Launches'],
            itemName: 'Year',
            tooltip: ['Launches']
        },
    });
});

console.log(providers);

option = {
    // animationDuration: lineRaceTime,
    dataset: [
        {
            id: 'dataset_raw',
            source: launches_array
        },
        ...datasetWithFilters
    ],
    tooltip: {
        order: 'valueDesc',
        trigger: 'axis'
    },
    xAxis: {
        name: 'Year',
        type: 'category',
    },
    yAxis: {
        name: 'Launches'
    },
    grid: {
        right: 140,
    },
    series: seriesList
};


myChart.setOption(option);

window.addEventListener("resize", myChart.resize);

