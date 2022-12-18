import worldJson from "../assets/world.json" assert { type: "json" };
import locations from "../data/Locations.json" assert { type: "json" };
import orbits from "../data/Orbits.json" assert { type: "json" };
import launches from "../data/Launches.json" assert { type: "json" };
function sortPoints(points) {
    points = points.splice(0);
    var p0 = {};
    p0.y = Math.min.apply(null, points.map(p=>p[1]));
    p0.x = Math.max.apply(null, points.filter(p=>p.y == p0.y).map(p=>p.x));
    points.sort((a,b)=>angleCompare(p0, a, b));
    return points;
};

const concatPadLocations = [];

const locRadius = 5;

for (let launch of launches) {
    if (!launch.pad) continue;
    const latitude = parseFloat(launch.pad.latitude);
    const longitude = parseFloat(launch.pad.longitude);

    let isConcat = false;

    for (let i = 0; i < concatPadLocations.length; i++) {
        const concatLoc = concatPadLocations[i];
        const dx = concatLoc.latitude - latitude;
        const dy = concatLoc.longitude - longitude;
        if (Math.sqrt(dx * dx + dy * dy) <= locRadius) {
            concatPadLocations[i].launches += 1;
            isConcat = true;
            if (launch.mission?.type) {
                const type = concatPadLocations[i].missions[launch.mission.type]
                concatPadLocations[i].missions[launch.mission.type] = type !== undefined ? type + 1 : 0;
            }
            break;
        }
    }

    if (!isConcat) {
        concatPadLocations.push({
            name: launch.pad.location?.name,
            latitude,
            longitude,
            launches: 1,
            missions: {
                [launch.mission?.type]: 1
            }
        });
    }
}

let maxTotalLaunchCount = Math.max(...locations.map(o => o.total_launch_count))


for (let loc of concatPadLocations) {
    const maxMission = Object.keys(loc.missions)
        .reduce((a, b) => loc.missions[a] > loc.missions[b] ? a : b);

    loc.maxMission = maxMission;
}

const sets = {};

concatPadLocations.forEach((loc, i) => {
    if (!sets[loc.maxMission]) sets[loc.maxMission] = { list: [] }
    sets[loc.maxMission].list.push({ ...loc, index: i });

});



Object.keys(sets).forEach(missionType => {
    const links = [];
    sets[missionType].list.sort((a, b) => a.longitude - b.longitude);
    for (let i = 1; i < sets[missionType].list.length; i++) {
        const link = {
            source: i - 1,
            target: i
        }

        links.push(link);
    }

    sets[missionType].links = links;
});


var chartDom = document.getElementById('pad-mission-container');
var myChart = echarts.init(chartDom);
echarts.registerMap('world', worldJson);
var option;

const size = 10;

option = {
    geo: {
        map: 'world',
        roam: true,
        itemStyle: {
            areaColor: "#000",
            borderColor: "#000",
        },
        silent: true,
        scaleLimit: {
            min: 1,
            max: 1
        },
    },
    tooltip: {
        formatter: (entity) => entity.seriesName
    },
    legend: {
        textStyle: {
            color: "#fff",
            fontSize: 18
        }
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: Object.keys(sets).filter(key => key != "undefined" && sets[key].list.length > 1).map(key => {
        let data = sets[key].list.map(loc => {
            return [loc.longitude, loc.latitude]
        }).filter(d => !Number.isNaN(d[0]) || !Number.isNaN(d[0]))
        
        data = [
            data.find(d => d[1] == Math.max(...data.map(d => d[1]))),
            data.find(d => d[0] == Math.min(...data.map(d => d[0]))),
            data.find(d => d[1] == Math.min(...data.map(d => d[1]))),
            data.find(d => d[0] == Math.max(...data.map(d => d[0]))),
        ];
        console.log(data)
        return {
            name: key,
            type: 'custom',
            coordinateSystem: 'geo',
            renderItem: function (params, api) {
              if (params.context.rendered) {
                return;
              }
              params.context.rendered = true;
              let points = [];
              for (let i = 0; i < data.length; i++) {
                points.push(api.coord(data[i]));
              }
              let color = api.visual('color');
              return {
                type: 'polygon',
                transition: ['shape'],
                shape: {
                  points: points,
                  smooth: 0.5
                },
                style: api.style({
                  fill: color,
                  opacity: 0.4,
                }),
                focus: 'series'
              };
            },
            clip: true,
            data: data
          }
        //     name: key,
        //     type: 'graph',
        //     layout: 'none',
        //     coordinateSystem: 'geo',
        //     symbolSize: 30 * (window.innerWidth / window.innerHeight),
        //     label: {
        //         show: false
        //     },
        //     emphasis: {
        //         focus: 'series'
        //     },
        //     edgeSymbol: ['square', 'none'],
        //     edgeSymbolSize: [4, 10],
        //     edgeLabel: {
        //         fontSize: 20
        //     },
        //     data: sets[key].list.map(loc => {
        //         return [loc.longitude, loc.latitude]
        //     }),
        //     // links: sets[key].links,
        //     lineStyle: {
        //         opacity: 1,
        //         width: size * (window.innerWidth / window.innerHeight),
        //         curveness: 0,
        //         color: 'source',
        //         cap: 'round',
        //         // type: 'dotted',
        //     }
        // }
    })
};

if (option && typeof option === 'object') {
    myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);