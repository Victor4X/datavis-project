import launches from "../data/Launches-small.json" assert { type: "json" };
import { settings, callbacks, addSetting } from "../js/common.js";

// Settings callback test callback
callbacks.push(() => {
    console.log(`test ${settings.test.value}`);
});

// Add update delay setting
addSetting("updateDelay", {
    label: "Update Delay",
    value: 3000,
    type: "number",
    attrs: { min: 0, max: 10000 },
});

// Add animation speed setting
addSetting("animationSpeed", {
    label: "Animation Speed",
    value: 2000,
    type: "number",
    attrs: { min: 0, max: 10000 },
});

const launches_modified = launches.map((launch) => {
    return { ...launch, year: new Date(launch["net"]).getFullYear() };
});

let years = new Set();

launches_modified.forEach((launch) => years.add(launch.year));
years = Array.from(years);

function calcTotalLaunches(data) {
    const launches_per_country = {};

    data.forEach((element) => {
        const country = element["launch_service_provider"]["country_code"];
        launches_per_country[country] = launches_per_country[country]
            ? launches_per_country[country] + 1
            : 1;
    });

    return launches_per_country;
}

// Se https://echarts.apache.org/examples/en/editor.html?c=bar-race

// Initialize the echarts instance based on the prepared dom
var myChart = echarts.init(document.getElementById("barrace"));

const colors = [
  '#dd6b66',
  '#759aa0',
  '#e69d87',
  '#8dc1a9',
  '#ea7e53',
  '#eedd78',
  '#73a373',
  '#73b9bc',
  '#7289ab',
  '#91ca8c',
  '#f49f42'
]

// Specify the configuration items and data for the chart
var option = {
    title: {
        text: "Launches pr country",
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
        data: ["launches"],
    },
    xAxis: {},
    yAxis: {
        inverse: true,
        data: Object.keys(calcTotalLaunches(launches_modified)).map((name) =>
            name.substring(0, 3)
        ),

        max: 10,
        axisLabel: {
            show: true,
            fontSize: 14,
            formatter: function (value) {
                return value + "";
            },
        },
        animationDuration: 300,
        animationDurationUpdate: 300,
    },
    series: [
        {
            realtimeSort: true,
            name: "launches",
            type: "bar",
            data: [],
            label: {
                show: true,
                precision: 0,
                position: "right",
                valueAnimation: true,
                fontFamily: "monospace",
            },
        },
    ],
    // Disable init animation.
    animationDuration: 500,
    animationDurationUpdate: settings.animationSpeed.value,
    animationEasing: "cubicInOut",
    animationEasingUpdate: "cubicInOut",
    graphic: {
        elements: [
            {
                type: "text",
                right: 160,
                bottom: 60,
                style: {
                    text: years[0],
                    font: "bolder 80px monospace",
                    fill: "rgba(100, 100, 100, 0.25)",
                },
                z: 100,
            },
        ],
    },
};

let y = 1;
function repeatOften(timestamp, startDate) {
    // Do whatever
    if (timestamp - startDate >= settings.updateDelay.value) {
        startDate = timestamp;
        if (checkbox.checked) {
            updateYear(years[y]);
            yearSlider.value = y;
            y++;
            y %= years.length;
        }
    }
    window.requestAnimationFrame((timestamp) =>
        repeatOften(timestamp, startDate)
    );
}

function updateYear(year) {
    let source = launches_modified.filter((d) => {
        return d.year <= year;
    });
    const launches = calcTotalLaunches(source);
    option.series[0].data = Object.values(launches).map((launch, i) => { return {
      value: launch,
      itemStyle: {
        color: colors[i]
      }
    }});
    // option.yAxis.data = Object.keys(launches).map(name => name.substring(0, 3)),
    option.graphic.elements[0].style.text = year;
    myChart.setOption(option);
}

// Animation toggle
const checkbox = document.body.querySelector("#animationCheckbox");

// Display the chart using the configuration items and data just specified.
myChart.setOption(option);
updateYear(years[0]);
window.requestAnimationFrame((timestamp) => repeatOften(timestamp, performance.now()));
window.addEventListener("resize", myChart.resize);


const yearSlider = document.querySelector("#year_slider");
yearSlider.min = 0;
yearSlider.max = years.length - 1;
yearSlider.value = 0;
yearSlider.addEventListener("input", (e) => {
    y = parseInt(e.target.value);
    updateYear(years[y])
});
