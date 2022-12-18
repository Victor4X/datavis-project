import launches from '../data/Launches-by-year.json' assert {type: 'json'};
import darkTheme from '../themes/dark.theme.json' assert {type: 'json'};

echarts.registerTheme('dark-theme', darkTheme)


//const eur = ["AUT,BEL,CZE,DNK,FIN,FRA,DEU,GRC,IRE,ITA,LUZ,NLD,NOR,POL,PRT,ROU,ESP,SWE,CHE,GBR", "FRA", "GBR", "CZE", "DEU", "ITA"]

// function calcTotalLaunches(data) {
//     const launches_per_provider = {};

//     data.forEach((element) => {
//         let name = element["launch_service_provider"]["type"];
//         //country = eur.includes(country) ? 'EUR' : country;

//         launches_per_provider[name] = launches_per_provider[name]
//             ? launches_per_provider[name] + 1
//             : 1;
//     });
//     return launches_per_provider;
// }

// const years = Object.keys(launches).sort().filter(year => year <= 2022);

// // Setup dataset as 2d array
// const headers = [
//     "Launches",
//     "Provider",
//     "Year",
// ];

// const launches_array = [headers];
// const seriesList = [];

// years.forEach(year => {
//     const total_launches = calcTotalLaunches(launches[year])

//     Object.keys(total_launches).forEach(name => {
//         launches_array.push([total_launches[name], name, year]);
//     });
// });


// const chartDom = document.getElementById('stacked-area');
// const myChart = echarts.init(chartDom, 'dark-theme');
// let option;


// let providers = [];

// years.forEach(year => {
//     // Get all launch_service_provider.name for this year
//     const providers_this_year = launches[year].map(launch => launch["launch_service_provider"]["type"]);
//     // Add them to the set
//     providers_this_year.forEach(provider => {
//         if (!providers.includes(provider)) {
//             providers.push(provider)
//         }
//     });
// });

// const datasetWithFilters = [];

// providers = providers.filter(provider => provider != "Multinational");


// echarts.util.each(providers, function (name) {
//     var datasetId = 'dataset_' + name;

//     datasetWithFilters.push({
//         id: datasetId,
//         fromDatasetId: 'dataset_raw',
//         transform: {
//             type: 'filter',
//             config: {
//                 and: [
//                     { dimension: 'Provider', '=': name },
//                 ]
//             }
//         }
//     });

//     seriesList.push({
//         type: 'line',
//         lineStyle: {
//             width: 0
//         },
//         stack: 'Total',
//         areaStyle: {},
//         datasetId: datasetId,
//         showSymbol: false,
//         name: name,
//         endLabel: {
//             show: true,
//             formatter: function (params) {
//                 return params.value[1] + ': ' + params.value[0];
//             }
//         },
//         labelLayout: {
//             moveOverlap: 'shiftY'
//         },
//         emphasis: {
//             focus: 'series'
//         },
//         encode: {
//             x: 'Year',
//             y: 'Launches',
//             label: ['Provider', 'Launches'],
//             itemName: 'Year',
//             tooltip: ['Launches']
//         },
//     });
// });

// console.log(providers);

// option = {
//     // animationDuration: lineRaceTime,
//     dataset: [
//         {
//             id: 'dataset_raw',
//             source: launches_array
//         },
//         ...datasetWithFilters
//     ],
//     tooltip: {
//         order: 'valueDesc',
//         trigger: 'axis'
//     },
//     xAxis: {
//         name: 'Year',
//         type: 'category',
//     },
//     yAxis: {
//         name: 'Launches'
//     },
//     grid: {
//         right: 140,
//     },
//     series: seriesList
// };


// myChart.setOption(option);

// window.addEventListener("resize", myChart.resize);
const years = Object.keys(launches).sort().filter(year => year <= 2022);
const all_provider_types = {};

years
    .forEach(year => launches[year]
        .forEach(launch => {
            if (!['Multinational', null].includes(launch.launch_service_provider.type)) {
                all_provider_types[launch.launch_service_provider.type] = 0
            }
        })
    )

console.log(all_provider_types)

const provider_types_pr_year = Object.keys(launches).map(year => {
    const provider_types = { ...all_provider_types };
    launches[year].forEach(launch => {
        provider_types[launch.launch_service_provider.type] += 1;
    });

    return provider_types
});

console.log(provider_types_pr_year)


const chartDom = document.getElementById('stacked-area');
const myChart = echarts.init(chartDom, 'dark-theme');
let option;


option = {
    tooltip: {
        order: 'valueDesc',
        trigger: 'axis'
    },
    legend: {
        data: Object.keys(all_provider_types)
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            data: years
        }
    ],
    yAxis: [
        {
            name: 'Launches'
        }
    ],
    series: Object.keys(all_provider_types).map(providerType => {
        return {
            name: providerType,
            type: 'line',
            stack: 'Total',
            lineStyle: {
                width: 0
            },
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            labelLayout: {
                moveOverlap: 'shiftY'
            },
            endLabel: {
                show: true,
                formatter: function (params) {
                    return params.seriesName + ': ' + params.value;
                }
            },
            showSymbol: false,
            data: provider_types_pr_year.map(year => year[providerType])
        }
    })
};

option && myChart.setOption(option);
