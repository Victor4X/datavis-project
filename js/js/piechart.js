import launches from "../data/Launches-small.json";

const pieDiv = document.getElementById("pie");

var pie = echarts.init(pieDiv);

var options = {
    titel: "Success/Failure",
    series: [
        {
            name: "",
            type: "pie",
            radius: "50%",
            data: [

            ]
        }
    ]
}

pie.setOption()

const data = () => {

}