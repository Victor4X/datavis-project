import launches from './dataset/Launches.json' assert {type: 'json'};

const launches_modified = launches.map(launch => { return { ...launch, year: new Date(launch["window_end"]).getFullYear() } })

let years = new Set()

launches_modified.forEach(launch => years.add(launch.year))
years = Array.from(years)

function calcTotalLaunches(data) {
    const launches_per_country = {}
    
    data.forEach(element => {
        const country = element["launch_service_provider"]["country_code"]
        launches_per_country[country] = launches_per_country[country] ? launches_per_country[country] + 1 : 1;
    });


    return launches_per_country
}

// Se https://echarts.apache.org/examples/en/editor.html?c=bar-race

// Initialize the echarts instance based on the prepared dom
var myChart = echarts.init(document.getElementById('main'));

const updateFrequency = 2000;
// Specify the configuration items and data for the chart
var option = {
    title: {
        text: 'Launches pr country'
    },
    tooltip: {},
    legend: {
        data: ['launches']
    },
    xAxis: {
        
    },
    yAxis: {
        inverse: true,
        data: Object.keys(calcTotalLaunches(launches_modified)).map(name => name.substring(0, 3)),
        max: 10,
        axisLabel: {
            show: true,
            fontSize: 14,
            formatter: function (value) {
              return value + '';
            },
          },
          animationDuration: 300,
          animationDurationUpdate: 300
    },
    series: [
        {
            realtimeSort: true,
            name: 'sales',
            type: 'bar',
            data: [],
            label: {
                show: true,
                precision: 0,
                position: 'right',
                valueAnimation: true,
                fontFamily: 'monospace'
              }
        }
    ],
    // Disable init animation.
    animationDuration: 500,
    animationDurationUpdate: updateFrequency,
    animationEasing: 'cubicInOut',
    animationEasingUpdate: 'cubicInOut',
    graphic: {
        elements: [
            {
                type: 'text',
                right: 160,
                bottom: 60,
                style: {
                    text: years[0],
                    font: 'bolder 80px monospace',
                    fill: 'rgba(100, 100, 100, 0.25)'
                },
                z: 100
            }
        ]
    }
};

const startIndex = 0;

for (let i = startIndex; i < years.length - 1; ++i) {
    (function (i) {
        setTimeout(function () {
            updateYear(years[i + 1]);
        }, (i - startIndex) * updateFrequency);
    })(i);
}
function updateYear(year) {
    let source = launches_modified.filter(d => {
        return d.year === year;
    });
    const launches = calcTotalLaunches(source);
    option.series[0].data = Object.values(launches);
    // option.yAxis.data = Object.keys(launches).map(name => name.substring(0, 3)),
    option.graphic.elements[0].style.text = year;
    myChart.setOption(option);
}

// Display the chart using the configuration items and data just specified.
myChart.setOption(option);
window.addEventListener('resize', myChart.resize);