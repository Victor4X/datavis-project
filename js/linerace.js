import launches from '../data/Launches-by-year.json' assert {type: 'json'};
import darkTheme from '../themes/dark.theme.json' assert {type: 'json'};

echarts.registerTheme('dark-theme', darkTheme)


const eur = ["AUT,BEL,CZE,DNK,FIN,FRA,DEU,GRC,IRE,ITA,LUZ,NLD,NOR,POL,PRT,ROU,ESP,SWE,CHE,GBR", "FRA", "GBR", "CZE", "DEU", "ITA"]

function calcTotalLaunches(data) {
    const launches_per_country = {};

    data.forEach((element) => {
        let country = element["launch_service_provider"]["country_code"];
        country = eur.includes(country) ? 'EUR' : country;

        launches_per_country[country] = launches_per_country[country]
            ? launches_per_country[country] + 1
            : 1;
    });
    return launches_per_country;
}

const years = Object.keys(launches).sort().filter(year => year <= 2022);

// Setup dataset as 2d array
const headers = [
    "Launches",
    "Country",
    "Year",
];

const launches_array = [headers];

years.forEach(year => {
    const total_launches = calcTotalLaunches(launches[year])

    Object.keys(total_launches).forEach(country => {
        launches_array.push([total_launches[country], country, year]);
    });
});


const lineRaceTime = 30000;

const chartDom = document.getElementById('line-race-container');
const myChart = echarts.init(chartDom, 'dark-theme');
let option;


const countries = [
    "RUS",
    "USA",
    "CHN",
    "EUR",
    // "IRN",
    // "IND",
    // "JPN"
];

const datasetWithFilters = [];
const seriesList = [];

echarts.util.each(countries, function (country) {
    var datasetId = 'dataset_' + country;

    datasetWithFilters.push({
        id: datasetId,
        fromDatasetId: 'dataset_raw',
        transform: {
            type: 'filter',
            config: {
                and: [
                    { dimension: 'Country', '=': country }
                ]
            }
        }
    });

    seriesList.push({
        type: 'line',
        lineStyle: {
            width: 4
        },
        datasetId: datasetId,
        showSymbol: false,
        name: country,
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
            label: ['Country', 'Launches'],
            itemName: 'Year',
            tooltip: ['Launches']
        },
        markLine: {
            symbol: ['none', 'pin'],
            symbolSize: 40,
            emphasis: {
                label: {
                    formatter: () => "Fall of the Soviet Union"
                },
                lineStyle: {
                    width: 2
                }
            },
            label: {
                formatter: () => ""
            },
            data: [{ xAxis: 34 }],
            animationDuration: 500,
            animationDelay: lineRaceTime / (years.length / 34),
            lineStyle: {
                width: 2
            }
        }
    });
});

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
    series: seriesList,
    graphic: {
        type: 'text',
        style: {
            text: 'This text',
            x: "100%",
            y: 100,
        },
        enterAnimation: {
            duration: 1000,
            delay: lineRaceTime / (years.length / 33),
            delay: 10,
        },
        enterFrom: {
            // Fade in
            style: { opacity: 0 },
            // Slide in from left
            x: 0
        },

    }
};


myChart.setOption(option);