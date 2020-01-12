
var ctxSc = document.getElementById('scatterChart').getContext('2d');
var myData = []

var attendeeData = document.getElementsByClassName('attendeeCount');
var startTimes = document.getElementsByClassName('startTime');
var yMax = 0;


for(var i = 0; i < attendeeData.length; i++){
    console.log("data: " + attendeeData[i].innerHTML);
    let item = attendeeData[i].innerHTML;
    let startTime = startTimes[i].innerHTML;
    if(item > yMax){
        yMax = parseInt(item) + 10;
    }
    let thisDataPiece = {
        x: startTime,
        y: item
    }
    myData.push(thisDataPiece);
}

console.log("ymax: " + yMax)
var scatterData = {
    datasets: [{
        borderColor: 'rgba(99,0,125, .2)',
        backgroundColor: 'rgba(99,0,125, .5)',
        label: 'Population',
        data: myData
    }]
}

var config1 = new Chart.Scatter(ctxSc, {
    data: scatterData,
    options: {
        title: {
            display: true,
            text: 'Scatter Chart - Logarithmic X-Axis'
        },
        scales: {
            xAxes: [{
                type: 'time',
                time:{
                    unit:'Day'
                },
                position: 'bottom',
                scaleLabel: {
                    labelString: 'Date',
                    display: true,
                }
            }],
            yAxes: [{
                type: 'linear',
                ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 20,
                    min: 0,
                    max: yMax,
                    stepSize: 5
                },
                scaleLabel: {
                    labelString: 'Population',
                    display: true
                }
            }]
        }
    }
});