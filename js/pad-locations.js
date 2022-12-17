import worldJson from "../assets/world.json" assert { type: "json" };
import locations from "../data/Locations.json" assert { type: "json" };
import orbits from "../data/Orbits.json" assert { type: "json" };
import launches from "../data/Launches.json" assert { type: "json" };


const concatPadLocations = [];

const locRadius = 5;

for(let launch of launches) {
    if (!launch.pad) continue;
    const latitude = launch.pad.latitude;
    const longitude = launch.pad.longitude;

    let isConcat = false;

    for(let i = 0; i < concatPadLocations.length; i++) {
        const concatLoc = concatPadLocations[i];
        const dx = concatLoc.latitude - latitude;
        const dy = concatLoc.longitude - longitude;
        if(Math.sqrt(dx * dx + dy * dy) <= locRadius) {
            concatPadLocations[i].launches += 1;
            isConcat = true;
            if(launch.mission?.type) {
                const type = concatPadLocations[i].missions[launch.mission.type]
                concatPadLocations[i].missions[launch.mission.type] = type !== undefined ? type + 1 : 0;
            }
            break;
        }
    }
    
    if(!isConcat) {
        concatPadLocations.push({
            latitude,
            longitude,
            launches: 1,
            missions: {
                [launch.mission?.type]: 1
            }
        });
    }
}


var dom = document.getElementById('pad-locations-container');
var myChart = echarts.init(dom, 'dark-theme', {
    renderer: 'canvas',
    useDirtyRect: false
});
var option;

let maxTotalLaunchCount = Math.max(...locations.map(o => o.total_launch_count))


myChart.showLoading();

for(let loc of concatPadLocations) {
    const maxMission = Object.keys(loc.missions)
        .reduce((a, b) => loc.missions[a] > loc.missions[b] ? a : b);

    loc.maxMission = maxMission;
}

echarts.registerMap('world', worldJson);
function createScatter(center, radius) {
    return {
        type: 'scatter',
        coordinateSystem: 'geo',
        tooltip: {
            formatter: (entity) => { 
                const maxMission = concatPadLocations[entity.seriesIndex].maxMission;
                const maxMissionValue = concatPadLocations[entity.seriesIndex].missions[maxMission];
                const totalLaunches = concatPadLocations[entity.seriesIndex].launches;
                return maxMission + ": " + Math.round((maxMissionValue / totalLaunches) * 100) + "% <br> Total launches: " + totalLaunches
            }
        },
        itemStyle: {
            color: "#f9c74f",
            opacity: 0.7,
        },
        label: {
            show: false,
        },
        labelLine: {
            show: false
        },
        animationDuration: 0,
        symbolSize: (radius * 80 | 10) * (window.innerWidth / window.innerHeight),
        data: [center],
    };
}
option = {
    geo: {
        map: 'world',
        roam: true,
        itemStyle: {
            areaColor: "#277da1",
            borderColor: "#000",
        },
        silent: true,
        scaleLimit: {
            min: 1,
            max: 1
        },
    },
    tooltip: {
        
    },
    legend: {
        textStyle: {
            color: "#fff"
        }
    },
    series: concatPadLocations.map(loc => createScatter([loc.longitude, loc.latitude], loc.launches / maxTotalLaunchCount))
};
myChart.hideLoading();
myChart.setOption(option);


if (option && typeof option === 'object') {
    myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);