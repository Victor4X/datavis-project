import worldJson from "../assets/world.json" assert { type: "json" };
import locations from "../data/Locations.json" assert { type: "json" };
import orbits from "../data/Orbits.json" assert { type: "json" };
import launches from "../data/Launches.json" assert { type: "json" };


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


console.log(sets)

var chartDom = document.getElementById('pad-mission-container');
var myChart = echarts.init(chartDom);
echarts.registerMap('world', worldJson);
var option;

const size = 40;

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
        return {
            name: key,
            type: 'graph',
            layout: 'none',
            coordinateSystem: 'geo',
            symbolSize: size * (window.innerWidth / window.innerHeight),
            label: {
                show: false
            },
            emphasis: {
                focus: 'series'
            },
            edgeSymbol: ['circle', 'none'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
                fontSize: 20
            },
            data: sets[key].list.map(loc => {
                return [loc.longitude, loc.latitude]
            }),
            // links: sets[key].links,
            lineStyle: {
                opacity: 1,
                width: size * (window.innerWidth / window.innerHeight),
                curveness: 0,
                color: 'source',
                cap: 'round',
                type: 'dotted',
            }
        }
    })
};

if (option && typeof option === 'object') {
    myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);