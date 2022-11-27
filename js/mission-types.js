import launches from '../data/Launches.json' assert {type: 'json'};
import darkTheme from '../themes/dark.theme.json' assert {type: 'json'};

echarts.registerTheme('dark-theme', darkTheme)

const chartDom = document.getElementById('mission-types-container');
const myChart = echarts.init(chartDom, 'dark-theme');

const orbits = new Set();

launches.forEach(launch => {
  if (launch.mission?.orbit?.name) {
    orbits.add(launch.mission.orbit.name)
  }
})

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

const orbitsArray = [];

Object.keys(missions).sort().map(type => {
  const tempOrbitArray = [];
  Array.from(orbits).sort().forEach(orbit => {
    if (missions[type].orbits[orbit]) {
      tempOrbitArray.push(missions[type].orbits[orbit])
    }
  });

  orbitsArray.push(tempOrbitArray);
});


const data = [];

const missionKeys = Object.keys(missions).sort((a, b) => missions[a].total - missions[b].total);
const orbitKeys = Object.keys(orbitTotals).sort((a, b) => orbitTotals[a] - orbitTotals[b]);

missionKeys.forEach((mission, missionIdx) => {
  orbitKeys.forEach((orbit, orbitIdx) => {
    const amount = (missions[mission].orbits[orbit] / missions[mission].total).toFixed(2);
    data.push([orbitIdx, missionIdx, amount]);
  });
});

const option = {
  tooltip: {
    position: 'top',
    valueFormatter: (value) => value[2] ? Math.round(value[2] * 100) + "%" : value
  },
  title: {
    text: 'Launch missions vs. mission orbits',
    left: '40%',
    top: '5%',
  },
  grid: [
    {
      top: '25%',
      right: '25%',
      height: '55%',
      width: '50%'
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
    orient: 'horizontal',
    left: '40%',
    bottom: '30px',
    seriesIndex: 0,
    textStyle: {
      color: '#fff'
    },
    text: ['1.0', '0.0']
  },
  series: [
    {
      name: 'Mission type vs orbits',
      type: 'heatmap',
      data: data,
      xAxisIndex: 0,
      yAxisIndex: 0,
      label: {
        show: true,
        formatter: (params) => {
          return params.value[2] > 0 ? params.value[2] : '<0.01'
        },
        fontSize: 10
      },
      emphasis: {
        focus: 'self',
        itemStyle: {
          shadowBlur: 5,
          shadowColor: 'rgba(255, 255, 255, 0.5)',
        },
      },
    },
    {
      name: 'total orbit types',
      type: 'bar',
      xAxisIndex: 1,
      yAxisIndex: 1,
      realtimeSort: true,
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
      realtimeSort: true,
      data: missionKeys.map(mission => {
        return {
          name: missions[mission],
          value: missions[mission].total
        }
      }),
      itemStyle: {
        color: darkTheme.color[0]
      }
    },
  ]
};

myChart.setOption(option);