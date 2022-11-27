import launches from '../data/Launches-by-year.json' assert {type: 'json'};
import darkTheme from '../themes/dark.theme.json' assert {type: 'json'};

echarts.registerTheme('dark-theme', darkTheme)


//const eur = ["AUT,BEL,CZE,DNK,FIN,FRA,DEU,GRC,IRE,ITA,LUZ,NLD,NOR,POL,PRT,ROU,ESP,SWE,CHE,GBR", "FRA", "GBR", "CZE", "DEU", "ITA"]

function calcTotalLaunches(data) {
    const launches_per_provider = {};

    data.forEach((element) => {
        let name = element["launch_service_provider"]["name"];
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

years.forEach(year => {
    const total_launches = calcTotalLaunches(launches[year])

    Object.keys(total_launches).forEach(name => {
        launches_array.push([total_launches[name], name, year]);
    });
});


const lineRaceTime = 30000;

const chartDom = document.getElementById('stacked-area');
const myChart = echarts.init(chartDom, 'dark-theme');
let option;


let providers = [];
years.forEach(year => {
    // Get all launch_service_provider.name for this year
    const providers_this_year = launches[year].map(launch => launch["launch_service_provider"]["name"]);
    // Add them to the set
    providers_this_year.forEach(provider => {
        if (!providers.includes(provider)) {
            providers.push(provider)
        }
    });
});



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
const seriesList = [];


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
        //stack: 'Total',
        smooth: true,
        //areaStyle: {},
        lineStyle: {
            width: 1
        },
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

console.log(datasetWithFilters);

option = {
    animationDuration: lineRaceTime,
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
        type: 'category',
        nameLocation: 'middle'
    },
    yAxis: {
        name: 'Launches'
    },
    grid: {
        right: 140,
    },
    series: [
        ...seriesList,
        historyMarker('Moon landing', 1969),
        historyMarker('Fall of the Soviet Union', 1991),
        historyMarker('Finacial crisis', 2008),
        historyMarker('Covid-19', 2019),
    ],
};


myChart.setOption(option);

window.addEventListener("resize", myChart.resize);

