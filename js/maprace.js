import worldJson from "../assets/world.json" assert { type: "json" };
import launches from "../data/Launches.json" assert { type: "json" };
import { Animation } from "./animation.js";
import darkTheme from '../themes/dark.theme.json' assert {type: 'json'};
import { settings, callbacks, addSetting } from "./common.js";
import { COLORS_ARRAY } from "./constants.js";

echarts.registerTheme('dark-theme', darkTheme)

var chartDom = document.getElementById('maprace');
var myChart = echarts.init(chartDom);
var option;

const countryMapCodes = {
  "RUS": "Russia",
  "USA": "United States",
  "CHN": "China",
  "GBR": "United Kingdom",
  "ITA": "Italy",
  "FRA": "France",
  "JPN": "Japan",
  "AUS": "Australia",
  "IND": "India",
  "DEU": "Germany",
  "EUR": "Germany", // dont know what to do here
  "ISR": "Israel",
  "IRN": "Iran",
  "TWN": "China", // the map does not recognize taiwan :/
  "BRA": "Brazil",
  "KOR": "Korea",
  "AUT,BEL,CZE,DNK,FIN,FRA,DEU,GRC,IRE,ITA,LUZ,NLD,NOR,POL,PRT,ROU,ESP,SWE,CHE,GBR": "Germany", // dont know what to do here
  "PRK": "Dem. Rep. Korea",
  "FRA,RUS": "Russia" // dont know what to do here
}

const launches_modified = launches.map((launch) => {
  return { ...launch, year: new Date(launch["net"]).getFullYear() };
});

let years = new Set();

launches_modified.forEach((launch) => years.add(launch.year));
years = Array.from(years);

function calcTotalLaunches(data) {
  const launches_per_country = {};

  data.forEach((element) => {
    const country = countryMapCodes[element["launch_service_provider"]["country_code"]];
    launches_per_country[country] = launches_per_country[country]
      ? launches_per_country[country] + 1
      : 1;
  });
  return launches_per_country;
}

myChart.showLoading();
myChart.hideLoading();
echarts.registerMap('world', worldJson, {
  Alaska: {
    left: -131,
    top: 25,
    width: 15
  },
  Hawaii: {
    left: -110,
    top: 28,
    width: 5
  },
  'Puerto Rico': {
    left: -76,
    top: 26,
    width: 2
  }
});

option = {
  title: {
    text: 'Global Launches Over Time',
    left: 'right'
  },
  tooltip: {
    trigger: 'item',
    showDelay: 0,
    transitionDuration: 0.2
  },
  backgroundColor: "rgba(34,39,54,1)",
  visualMap: {
    left: 'right',
    min: 0,
    max: 3500,
    inRange: {
      color: [
        '#313695',
        '#4575b4',
        '#74add1',
        '#abd9e9',
        '#e0f3f8',
        '#ffffbf',
        '#fee090',
        '#fdae61',
        '#f46d43',
        '#d73027',
        '#a50026'
      ]
    },
    text: ['Launches'],
    calculable: true
  },
  toolbox: {
    show: true,
    //orient: 'vertical',
    left: 'left',
    top: 'top',
    feature: {
      dataView: { readOnly: false },
      restore: {},
      saveAsImage: {}
    }
  },
  series: [
    {
      name: 'Launches',
      type: 'map',
      roam: true,
      map: 'world',
      emphasis: {
        label: {
          show: true
        }
      },
      data: Object.keys(calcTotalLaunches(launches_modified)).map((name) =>
        name.substring(0, 3)
      ),
    }
  ],
  animationDuration: 500,
  animationDurationUpdate: 2000,
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
  // option.yAxis.data = Object.keys(launches).map(name => name.substring(0, 3)),
  option.graphic.elements[0].style.text = year;
  myChart.setOption(option);
}

let y = 1;
function repeatOften() {
  updateYear(years[y]);
  y++;
  y %= years.length;
}

const animation = new Animation(() => 2000, repeatOften);
animation.start()

updateYear(years[0]);

myChart.setOption(option);

window.addEventListener("resize", myChart.resize);
