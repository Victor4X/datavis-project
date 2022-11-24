import launches from "../data/Launches.json" assert { type: "json" };
import { Animation } from "./animation.js";

let chart = echarts.init(document.querySelector("#stackedarea"));
let option;

const launches_modified = launches.map((launch) => {
    return { ...launch, year: new Date(launch["net"]).getFullYear() };
});

let years = new Set();

launches_modified.forEach((launch) => years.add(launch.year));
years = Array.from(years);

function calcTotalLaunches(data) {
    const launches_per_country = {};

    data.forEach((element) => {
        const country = element["launch_service_provider"]["name"];
        launches_per_country[country] = launches_per_country[country]
            ? launches_per_country[country] + 1
            : 1;
    });
    return launches_per_country;
}

option = {
    title: {
        text: 'Attempts by launch service providers'
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
        data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
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
            data: years
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: 'Providers',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: Object.keys(calcTotalLaunches(launches_modified)).map((name) =>
                name.substring(0, 3)
            ),

        }
    ]
    /*
    {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
            focus: 'series'
        },
        data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
            focus: 'series'
        },
        data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
            focus: 'series'
        },
        data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
            focus: 'series'
        },
        data: [320, 332, 301, 334, 390, 330, 320]
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
        data: [820, 932, 901, 934, 1290, 1330, 1320]
    } */

};

function updateYear(year) {
    let source = launches_modified.filter((d) => {
        return d.year <= year;
    });
    const launches = calcTotalLaunches(source);
    option.series[0].data = Object.entries(launches).map((launch, i) => {
        return {
            name: launch[0],
            value: launch[1],
        }
    });
    //option.graphic.elements[0].style.text = year;
    chart.setOption(option);
}

let y = 1;
function repeatOften() {
    updateYear(years[y]);
    y++;
    y %= years.length;
}

const animation = new Animation(() => 2000, repeatOften);
animation.start();

updateYear(years[0]);


option && chart.setOption(option);

window.addEventListener("resize", chart.resize);