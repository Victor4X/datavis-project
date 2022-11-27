import pads from '../data/Pads.json' assert { type: 'json' };

const padsArray = [];

pads.forEach(pad => {
    padsArray.push([parseFloat(pad.latitude), parseFloat(pad.longitude), pad.total_launch_count]);
});

const dom = document.getElementById('pad-globe-container');
const myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
});
var ROOT_PATH = 'https://echarts.apache.org/examples';

const option = {
    backgroundColor: '#000',
    globe: {
        baseTexture: '../assets/world.topo.bathy.200401.jpg',
        heightTexture: '/assets/world.topo.bathy.200401.jpg',
        shading: 'lambert',
        environment: '/assets/starfield.jpg',
        globeRadius: 40,
        globeOuterRadius: 80,
        light: {
            main: {
                intensity: 1
            },
            ambient: {
                intensity: 0.5
            },
        },
        viewControl: {
            autoRotate: true,
            rotateMouseButton: 'left'
        },
    },
    visualMap: {
        max: 200,
        calculable: true,
        realtime: false,
        textStyle: {
            color: '#fff'
        },
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