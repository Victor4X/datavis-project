import launches from '../data/Launches.json' assert {type: 'json'};
import darkTheme from '../themes/dark.theme.json' assert {type: 'json'};

echarts.registerTheme('dark-theme', darkTheme)

const chartDom = document.getElementById('mission-types-container');
const myChart = echarts.init(chartDom, 'dark-theme');

const orbits = new Set();

// Get all the orbits into a set
launches.forEach(launch => {
  if (launch.mission?.orbit?.name) {
    orbits.add(launch.mission.orbit.name)
  }
})

// Create an object with all the orbits as keys
const orbitTotals = {};
orbits.forEach(orbit => orbitTotals[orbit] = 0);

function calcMissionTypes(data) {
  const mission_types = {};

  data.forEach((element) => {
    if (!element.mission) return;

    const type = element.mission.type;
    const orbit = element.mission?.orbit?.name;

    if (!type) return;

    if (!mission_types[type]) {
      mission_types[type] = {}
    }

    if (!mission_types[type].total) {
      mission_types[type].total = 0;
    }

    mission_types[type].total += 1

    if (!orbit) return;

    if (!mission_types[type].orbits) {
      mission_types[type].orbits = {}
    }

    if (!mission_types[type].orbits[orbit]) {
      mission_types[type].orbits[orbit] = 0;
    }

    mission_types[type].orbits[orbit] += 1;

    orbitTotals[orbit] += 1;
  });

  return mission_types;
}

const missions = calcMissionTypes(launches);

// Merge mission types and orbit types with less than or equal to 25 launches into other

// Mission types first
const other = {
  total: 0,
  orbits: {}
}

Object.keys(missions).forEach(mission => {
  if (missions[mission].total <= 25) {
    other.total += missions[mission].total;
    Object.keys(missions[mission].orbits).forEach(orbit => {
      if (!other.orbits[orbit]) {
        other.orbits[orbit] = 0;
      }
      other.orbits[orbit] += missions[mission].orbits[orbit];
    })
    delete missions[mission];
  }
})

missions["Extraterrestrial and Other"] = other;

// Orbit types next
orbitTotals["Extraterrestrial and Other"] = 0;

Object.keys(orbitTotals).forEach(orbit => {
  if (orbitTotals[orbit] <= 25) {
    orbitTotals["Extraterrestrial and Other"] += orbitTotals[orbit];
    delete orbitTotals[orbit];

    Object.keys(missions).forEach(type => {
      if (missions[type].orbits[orbit]) {
        if (!missions[type].orbits["Extraterrestrial and Other"]) {
          missions[type].orbits["Extraterrestrial and Other"] = 0;
        }
        missions[type].orbits["Extraterrestrial and Other"] += missions[type].orbits[orbit];
        delete missions[type].orbits[orbit];
      }
    })
  }
})

// Construct the data for the heatmap

const dataMissionNorm = [];
const dataOrbitsNorm = [];


const missionKeys = Object.keys(missions).sort((a, b) => missions[b].total - missions[a].total);
const orbitKeys = Object.keys(orbitTotals).sort((a, b) => orbitTotals[b] - orbitTotals[a]);

missionKeys.forEach((mission, missionIdx) => {
  orbitKeys.forEach((orbit, orbitIdx) => {
    const amountMissionNorm = (missions[mission].orbits[orbit] / missions[mission].total).toFixed(2);
    dataMissionNorm.push([orbitIdx, missionIdx, amountMissionNorm]);
    const amountOrbitsNorm = (missions[mission].orbits[orbit] / orbitTotals[orbit]).toFixed(2);
    dataOrbitsNorm.push([orbitIdx, missionIdx, amountOrbitsNorm]);
  });
});

var data = dataMissionNorm;

const option = {
  tooltip: {
    position: 'top',
    valueFormatter: (value) => value[2] ? Math.round(value[2] * 100) + "%" : value
  },
  grid: [
    {
      top: '25%',
      right: '25%',
      height: '55%',
      width: '50%',
    },
    {
      bottom: '75.5%',
      right: '25%',
      width: '50%'
    },
    {
      top: '25%',
      left: '75.5%',
      height: '55%',
    }
  ],
  xAxis: [
    {
      gridIndex: 0,
      type: 'category',
      data: orbitKeys,
      splitArea: {
      },
      axisLabel: {
        rotate: 90,
      },
    },
    {
      type: 'category',
      gridIndex: 1,
      data: orbitKeys,
      show: false,
    },
    {
      gridIndex: 2,
      show: false,
    }
  ],
  yAxis: [
    {
      type: 'category',
      data: missionKeys,
      splitArea: {
      },
      gridIndex: 0,
    },
    {
      gridIndex: 1,
      show: false,
    },
    {
      type: 'category',
      gridIndex: 2,
      data: missionKeys,
      show: false,
    },
  ],
  visualMap: {
    min: 0,
    max: 1,
    precision: 2,
    calculable: true,
    orient: 'horizontal',
    left: '40%',
    bottom: '30px',
    seriesIndex: 0,
    textStyle: {
      color: '#fff'
    },
    text: ['1.0', '0.0']
  },
  tooltip: {
    trigger: 'item',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        width: 1,
        opacity: 0.5
      },
    },
    showContent: false,
  },
  series: [
    {
      name: 'Mission type vs orbits',
      type: 'heatmap',
      data: data,
      xAxisIndex: 0,
      yAxisIndex: 0,
      z: -1,
      label: {
        show: true,
        formatter: (params) => {
          return params.value[2] > 0 ? params.value[2] : '<0.01'
        },
        fontSize: 10
      },
      emphasis: {
        itemStyle: {
          borderWidth: 2,
          borderColor: '#aaa',
        },
      },
    },
    {
      name: 'total orbit types',
      type: 'bar',
      xAxisIndex: 1,
      yAxisIndex: 1,
      label: {
        show: true,
        position: 'top'
      },
      data: orbitKeys.map(orbit => {
        return {
          name: orbit,
          value: orbitTotals[orbit]
        }
      }),
      itemStyle: {
        color: darkTheme.color[0]
      },
    },
    {
      name: 'total mission types',
      type: 'bar',
      xAxisIndex: 2,
      yAxisIndex: 2,
      itemStyle: {
        opacity: 0.2,
      },
      label: {
        show: true,
        position: 'right'
      },
      data: missionKeys.map(mission => {
        return {
          name: missions[mission],
          value: missions[mission].total
        }
      }),
      itemStyle: {
        color: darkTheme.color[1]
      }
    },
  ]
};

window.addEventListener("resize",myChart.resize);

myChart.setOption(option);

// Create checkbox for switching between the two normalizations

const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.id = "mission-types-checkbox";
checkbox.checked = true;
checkbox.addEventListener("change", () => {
  data = checkbox.checked ? dataMissionNorm : dataOrbitsNorm;
  myChart.setOption({
    series: [{
      data: data,
    }]
  });
});

const label = document.createElement("label");
label.htmlFor = "mission-types-checkbox";
label.appendChild(document.createTextNode("Normalize by mission type"));

// Get "mission-types-settings-container"
const settingsContainer = document.getElementById("mission-types-settings-container");

settingsContainer.appendChild(checkbox);
settingsContainer.appendChild(label);