import launches from '../data/Launches.json' assert {type: 'json'};

function calcMissionTypes(data) {
    const mission_types = {};

    data.forEach((element) => {
        if(!element.mission) return;

        const type = element.mission.type;

        if(!type) return;

        mission_types[type] = mission_types[type]
            ? mission_types[type] + 1
            : 1;
    });

    return mission_types;
}

const chartDom = document.getElementById('mission-types-container');
const myChart = echarts.init(chartDom);

const missions = calcMissionTypes(launches);

const option = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    type: 'scroll',
    orient: 'vertical',
    right: 10,
    top: 20,
    bottom: 20,
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '20',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: Object.keys(missions).map(type => { return {name: type, value: missions[type]}})
    }
  ]
};

myChart.setOption(option);