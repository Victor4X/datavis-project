import launchers from '../data/Launchers-expanded.json' assert {type: 'json'};
import darkTheme from '../themes/dark.theme.json' assert {type: 'json'};

echarts.registerTheme('dark-theme', darkTheme)

var chartDom = document.getElementById('leo-capabilities-over-time');
var myChart = echarts.init(chartDom, 'dark-theme');
var option;

// Go through all the launchers, and extract the data we need according to the schema
const dataGL = [];
launchers.forEach(launcher => {
    var entry = [];
    entry.push(launcher.first_flight);
    entry.push(launcher.leo_capacity);
    entry.push(launcher.total_launch_count);
    entry.push(launcher.name);
    entry.push(launcher.last_flight);
    entry.push(launcher.active);
    entry.push(launcher.manufacturer.country_code);

    // If all the data is present, add it to the dataGL array
    if (entry.every(e => e !== null)) {
        dataGL.push(entry);
    }
});

// Temporary value for easier indexing
var counter = 0;
const schema = {
    first_flight: { index: counter++, text: 'First Launch' },
    leo_capacity: { index: counter++, text: 'Mass to LEO (t)' },
    total_launch_count: { index: counter++, text: 'Total Launches' },
    name: { index: counter++, text: 'Configuration Name' },
    last_flight: { index: counter++, text: 'Latest Launch' },
    active: { index: counter++, text: 'Currently in use?' },
    country: { index: counter++, text: 'Country of Manufacturer' }
};

const itemStyle = {
    opacity: 0.8,
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowColor: 'rgba(0,0,0,0.3)'
};
option = {
    legend: {
        top: 10,
        data: ['GL'],
        textStyle: {
            fontSize: 16
        }
    },
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
                + schema["country"].text + ': ' + value[schema["country"].index] + '<br>';
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
            left: '90%',
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
        },
        {
            dimension: schema['active'].index,
            show: false,
            min: 0,
            max: 1,
            itemHeight: 120,
            text: ['Is the launcher in use?'],
            textGap: 30,
            inRange: {
                color: [darkTheme.color[0], darkTheme.color[3]]
            },
            outOfRange: {
                color: ['rgba(255,255,255,0.4)']
            },
        }
    ],
    series: [
        {
            name: 'GL',
            type: 'scatter',
            itemStyle: itemStyle,
            data: dataGL
        },
        {
            type: 'line',
            data: [],
            showSymbol: false,
            markLine: {
                symbol: ['none', 'none'],
                symbolSize: 40,
                emphasis: {
                    lineStyle: {
                        width: 2
                    }
                },
                label: {
                    formatter: () => 'Future Launchers',
                    color: 'grey'
                },
                data: [{ xAxis: "2022-09-20T19:55:22Z" }],
                lineStyle: {
                    width: 2
                }
            }
        }
    ]
};

option && myChart.setOption(option);

window.addEventListener("resize", myChart.resize);