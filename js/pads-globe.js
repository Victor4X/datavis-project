import pads from '../data/Pads.json' assert { type: 'json' };

const padsArray = [];

pads.forEach(pad => {
    padsArray.push([parseFloat(pad.longitude), parseFloat(pad.latitude), pad.total_launch_count]);
});

const dom = document.getElementById('pad-globe-container');
const myChart = echarts.init(dom, 'dark-theme', {
    renderer: 'canvas',
    useDirtyRect: false
});
var ROOT_PATH = 'https://echarts.apache.org/examples';

const option = {
    backgroundColor: '#000',
    globe: {
        baseTexture: '../assets/night.jpg',
        heightTexture: '/assets/world.topo.bathy.200401.jpg',
        shading: 'lambert',
        globeRadius: 40,
        globeOuterRadius: 60,
        light: {
            main: {
                intensity: 2
            },
            ambient: {
                intensity: 1.5
            },
        },
        viewControl: {
            autoRotate: true,
            alpha: 10,
        },
    },
    visualMap: {
        max: 200,
        calculable: true,
        realtime: false,
        textStyle: {
            color: '#fff'
        },
        inRange: {
            color: ['red', 'white'],
        }
    },
    series: [
        {
            type: 'bar3D',
            coordinateSystem: 'globe',
            data: padsArray,
            barSize: 1,
            minHeight: 1,
            silent: true,
        }
    ]
};
myChart.setOption(option);

window.addEventListener('resize', myChart.resize);