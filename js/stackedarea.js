import launches from "../data/Launches-small.json" assert { type: "json" };
import { Animation } from "./animation.js";

let chart = echarts.init(document.querySelector("#stackedarea"));
let option;

const launches_modified = launches.map((launch) => {
    return { ...launch, year: new Date(launch["net"]).getFullYear() };
});

let years = new Set();
launches_modified.forEach((launch) => years.add(launch.year));
years = Array.from(years);


const launches_per_year = {};
launches_modified.forEach((launch) => {
    const year = launch.year;
    const name = launch["launch_service_provider"]["name"];
    launches_per_year[name] = launches_per_year[name] || {};
    launches_per_year[name][year] = launches_per_year[name][year]
        ? launches_per_year[name][year] + 1
        : 1;
});


const getLaunchesPerYear = (data) => {
    const launches_per_year = new Set();
    Object.entries(data).forEach(entry => {
        const [key, value] = entry;
        launches_per_year.add({ name: key, value: value });
    });
    return launches_per_year;
}


option = {
    title: {
        text: 'Stacked Area Chart'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data: [""]
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
            type: 'category',
            boundaryGap: false,
            //data: years
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    dataset: {
        source: getLaunchesPerYear(launches_per_year)
    },
    series: [
        {
            name: 'launches',
            type: 'line',
            stack: 'total',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            }
        }
    ]
    /*
    series: [
        {
            name: 'Email',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: getLaunchesPerYear(launches_per_year)
        },
        
                {
                    name: 'Union Ads',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [220, 182, 191]
                },
                {
                    name: 'Video Ads',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [150, 232, 201]
                },
                {
                    name: 'Direct',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [320, 332, 301]
                },
                {
                    name: 'Search Engine',
                    type: 'line',
                    stack: 'Total',
                    label: {
                        show: true,
                        position: 'top'
                    },
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [820, 932, 901]
                }*/
};



option && chart.setOption(option);

window.addEventListener("resize", chart.resize);


console.log(getLaunchesPerYear(launches_per_year));