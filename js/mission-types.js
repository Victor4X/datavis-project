import launches from '../data/Launches.json' assert {type: 'json'};

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

const chartDom = document.getElementById('mission-types-container');
const myChart = echarts.init(chartDom);

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
    position: 'top'
  },
  grid: [
    {
      top: '33%',
      right: '33%',
      height: '45%',
      width: '50%'
    },
    {
      bottom: '67%',
      right: '33%',
      width: '50%'
    },
    {
      top: '33%',
      left: '67%',
      height: '45%',
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
        rotate: 90
      },
    },
    {
      gridIndex: 1,
      data: orbitKeys,
      show: false,
    },
    {
      gridIndex: 2,
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
    },
    {
      gridIndex: 2,
      data: missionKeys,
      show: false,
    },
  ],
  visualMap: {
    min: 0,
    max: 1,
    calculable: true,
    orient: 'horizontal',
    left: '33%',
    inRange: {
      color: ['#e0ffff', '#006edd'],
      opacity: 1
    },
  },
  series: [
    {
      name: 'Mission type vs orbits',
      type: 'heatmap',
      data: data,
      xAxisIndex: 0,
      yAxisIndex: 0,
      realtimeSort: true,
      label: {
        show: true,
        formatter: (params) => {
          console.log(params.value)
          return params.value[2] > 0 ? params.value[2] : '< 0'
        }
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    },
    {
      name: 'total mission types',
      type: 'bar',
      xAxisIndex: 2,
      yAxisIndex: 2,
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
      })
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
      })
    }
  ]
};

myChart.setOption(option);