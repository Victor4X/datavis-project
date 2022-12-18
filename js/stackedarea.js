import launches from '../data/Launches-by-year.json' assert {type: 'json'};
import darkTheme from '../themes/dark.theme.json' assert {type: 'json'};

echarts.registerTheme('dark-theme', darkTheme)

const years = Object.keys(launches).sort().filter(year => year <= 2022);
const all_provider_types = {};

years.forEach(year => 
    launches[year].forEach(launch => {
        if (!['Multinational', null].includes(launch.launch_service_provider.type)) {
            all_provider_types[launch.launch_service_provider.type] = 0
        }
    })
)

const provider_types_pr_year = Object.keys(launches).map(year => {
    const provider_types = { ...all_provider_types };
    launches[year].forEach(launch => {
        provider_types[launch.launch_service_provider.type] += 1;
    });

    return provider_types
});

const chartDom = document.getElementById('stacked-area');
const myChart = echarts.init(chartDom, 'dark-theme');

const option = {
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
            symbol: 'circle',
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
