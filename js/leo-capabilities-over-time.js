import launchers from '../data/Launchers-expanded.json' assert {type: 'json'};
import darkTheme from '../themes/dark.theme.json' assert {type: 'json'};

echarts.registerTheme('dark-theme', darkTheme)

var chartDom = document.getElementById('leo-capabilities-over-time');
var myChart = echarts.init(chartDom, 'dark-theme');
var mainOption;

// Go through all the launchers, and extract the data we need according to the schema
const dataActive = [];
const dataInactive = [];

const dataGovernment = [];
const dataCommercial = [];

const countries = {};

launchers.forEach(launcher => {
    var entry = [];
    entry.push(launcher.first_flight);
    entry.push(launcher.leo_capacity);
    entry.push(launcher.total_launch_count);
    entry.push(launcher.full_name);
    entry.push(launcher.last_flight);
    entry.push(launcher.active);
    entry.push(launcher.manufacturer.type);
    entry.push(launcher.manufacturer.country_code);

    // If all the data is present, add it to the datasets
    if (entry.every(e => e !== null)) {
        // Add the launcher to the active/inactive object
        if (launcher.active) {
            dataActive.push(entry);
        } else {
            dataInactive.push(entry);
        }

        // Add the launcher to the government/private object
        if (launcher.manufacturer.type === "Government") {
            dataGovernment.push(entry);
        } else {
            dataCommercial.push(entry);
        }

        // Get the country code
        var country = launcher.manufacturer.country_code;
        // France is part of EUR in this visualization
        if (country === "FRA") {
            country = "EUR";
        }
        if (country === "UKR") {
            country = "RUS";
        }
        // Group IND, IRN, GBR, KOR, BRA into other
        if (["IND", "IRN", "GBR", "KOR", "BRA"].includes(country)) {
            country = "OTHER";
        }

        // Add the launcher to the countries object
        // Initialize the country if it doesn't exist
        if (!countries[country]) {
            countries[country] = {
                launchers: 1,
                data: [entry]
            }
        } else {
            countries[country].launchers += 1;
            countries[country].data.push(entry);
        }
    }
});

// Sort countries by number of launchers
const sortedCountries = Object.entries(countries).sort((a, b) => b[1].launchers - a[1].launchers);

// Temporary value for easier indexing
var counter = 0;
const schema = {
    first_flight: { index: counter++, text: 'First Launch' },
    leo_capacity: { index: counter++, text: 'Mass to LEO (t)' },
    total_launch_count: { index: counter++, text: 'Total Launches' },
    name: { index: counter++, text: 'Configuration Name' },
    last_flight: { index: counter++, text: 'Latest Launch' },
    active: { index: counter++, text: 'Currently in use?' },
    manufacturer_type: { index: counter++, text: 'Type of Manufacturer' },
    country: { index: counter++, text: 'Country of Manufacturer' }
};

const itemStyle = {
    opacity: 0.8,
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowColor: 'rgba(0,0,0,0.3)'
};

// Line that indicates the future launchers
const futureLine = {
    type: 'line',
    data: [],
    showSymbol: false,
    markLine: {
        symbol: ['none', 'none'],
        symbolSize: 40,
        emphasis: {
            lineStyle: {
                width: 2,
            }
        },
        label: {
            formatter: () => 'Future Launchers',
            color: 'grey'
        },
        data: [{ xAxis: "2022-09-20T19:55:22Z" }],
        lineStyle: {
            color: darkTheme.color[2],
            width: 2
        },
        tooltip: {
            show: false
        },
        z: -1,
        silent: true,
        animation: false
    }
}

// Option that classifies the launchers by active/inactive
const activityOption = {
    legend: {
        top: '10%',
        data: ['Active', 'Inactive'],
        textStyle: {
            fontSize: 16
        }
    },
    series: [
        futureLine,
        {
            name: 'Active',
            type: 'scatter',
            itemStyle: { ...itemStyle, color: darkTheme.color[1] },
            data: dataActive,
            animation: false,
        },
        {
            name: 'Inactive',
            type: 'scatter',
            itemStyle: { ...itemStyle, color: darkTheme.color[0] },
            data: dataInactive,
            animation: false,
        },
    ]
};

// Option that classifies the launchers by country
const countryOption = {
    legend: {
        top: '10%',
        data: sortedCountries.map(entry => entry[0]),
        textStyle: {
            fontSize: 16
        }
    },
    series: [
        futureLine, // Add the future line
        ...sortedCountries.map(entry => {
            return {
                name: entry[0],
                type: 'scatter',
                itemStyle: { ...itemStyle, color: darkTheme.color[sortedCountries.indexOf(entry)] },
                data: entry[1].data,
                animation: false
            }
        })
    ]

};

// Option that classifies the launchers by manufacturer type
const typeOption = {
    legend: {
        top: '10%',
        data: ['Government', 'Commercial'],
        textStyle: {
            fontSize: 16
        }
    },
    series: [
        futureLine,
        {
            name: 'Government',
            type: 'scatter',
            itemStyle: { ...itemStyle, color: darkTheme.color[1] },
            data: dataGovernment,
            animation: false,
        },
        {
            name: 'Commercial',
            type: 'scatter',
            itemStyle: { ...itemStyle, color: darkTheme.color[0] },
            data: dataCommercial,
            animation: false,
        },
    ]
};

mainOption = {
    grid: {
        left: '10%',
        right: 150,
        top: '18%',
        bottom: '10%'
    },
    tooltip: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        formatter: function (param) {
            var value = param.value;
            // prettier-ignore
            return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                + '<Strong>' + value[schema["name"].index] + '</Strong>'
                + '</div>'
                + schema["leo_capacity"].text + ': ' + value[schema["leo_capacity"].index] + '<br>'
                + schema["first_flight"].text + ': ' + value[schema["first_flight"].index] + '<br>'
                + schema["last_flight"].text + ': ' + value[schema["last_flight"].index] + '<br>'
                + schema["total_launch_count"].text + ': ' + value[schema["total_launch_count"].index] + '<br>'
                + schema["active"].text + ': ' + value[schema["active"].index] + '<br>'
                + schema["country"].text + ': ' + value[schema["country"].index] + '<br>'
                + schema["manufacturer_type"].text + ': ' + value[schema["manufacturer_type"].index] + '<br>';
        }
    },
    xAxis: {
        type: 'time',
        name: 'First Launch Date',
        nameTextStyle: {
            fontSize: 16
        },
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'log',
        min: 25,
        max: 200000,
        name: 'Mass to LEO (t)',
        nameLocation: 'end',
        dimension: schema['leo_capacity'].index,
        nameTextStyle: {
            fontSize: 16
        },
        splitLine: {
            show: false
        },
    },
    visualMap: [
        {
            left: '95%',
            top: '10%',
            dimension: schema['total_launch_count'].index,
            min: 0,
            max: 250,
            itemWidth: 30,
            itemHeight: 120,
            calculable: true,
            precision: 0.1,
            text: ['Total launches'],
            textGap: 30,
            textStyle: {
                fontSize: 14,
                color: 'grey'
            },
            inRange: {
                symbolSize: [10, 70]
            },
            outOfRange: {
                symbolSize: [10, 70],
                color: ['rgba(255,255,255,0.4)']
            },
            controller: {
                inRange: {
                    color: ['#c23531']
                },
                outOfRange: {
                    color: ['#999']
                }
            }
        }
    ],
};

mainOption && myChart.setOption(mainOption);

// Default to activity based classification
myChart.setOption(activityOption);

window.addEventListener("resize", myChart.resize);

// Grab inline selection classification setting element
const classificationState = document.getElementById("leo-capabilities-classification-state");

// Add mutation observer to the normalize state element
const observer = new MutationObserver((_) => {
    var state = classificationState.textContent;
    var tmpOption = {};
    if (state === "Manufacturer Country") {
        tmpOption = countryOption;
    }
    if (state === "Manufacturer Type") {
        tmpOption = typeOption;
    }
    if (state === "Active/Inactive") {
        tmpOption = activityOption;
    }
    // Reinitialize for some reason
    myChart.setOption(mainOption, true);
    myChart.setOption(tmpOption);
});

// Observe the normalize state element
observer.observe(classificationState, { childList: true });