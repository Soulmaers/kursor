import { objColors, gener } from './content.js'

//отрисовка графика скорости
export function chrt1(arr, time) {
    const config = {
        type: 'line',
        data: {
            datasets: [{
                data: arr,
                label: 'Скорость',
                fill: false,
                borderColor: 'green',
                yAxisID: 'left-y-axis',
                pointRadius: 1,
                borderWidth: 1,
                pointBorderWidth: 0.01,
                pointBackgroundColor: 'green'
            }],
            labels: time
        },
        options: {
            plugins: {
                datalabels: {
                    display: false,
                },
                legend: {
                    labels: {
                        font: {
                            size: 15,
                        },
                        color: 'gray'
                    }
                },

            },
            scales: {
                'left-y-axis': {
                    type: 'linear',
                    position: 'left',
                    min: 0,
                    max: 100,
                    lineWidth: 1,
                    ticks: {

                        font: {

                            size: 15,
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 1
                        }
                    }
                }
            },
        }
    };
    let chart = Chart.getChart('myChartg1'); // Pass the canvas ID
    if (chart) {
        chart.data.labels = time;
        chart.data.datasets[0].data = arr;
        chart.update();
    } else {
        new Chart('myChartg1', config)
    }

}




export function protekGrafTwo(y1, y2, arr) {
    let number;
    const arrNum = [];

    arr.forEach(el => {
        arrNum.push(Number(el));
    })
    if (arrNum[0] <= arrNum[1]) {
        number = arrNum[0]
    }
    else {
        number = arrNum[1]
    }


    console.log(typeof arrNum[0])
    const c2 = document.getElementById("drawLine2");
    c2.width = 348
    c2.heigth = 60
    const ctx2 = c2.getContext("2d");
    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 60);
    ctx2.lineTo(0, y1);
    ctx2.lineTo(348, y2);
    ctx2.lineTo(348, 60);
    ctx2.lineTo(0, 60);
    ctx2.fillStyle = objColors[gener(number)];
    ctx2.fill();
    //  ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 50);
    ctx2.lineTo(5, 50);
    ctx2.lineTo(10, 0);
    ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //  ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";

    ctx2.moveTo(166.5, 0);
    ctx2.lineTo(166.5 + 5, 50);
    ctx2.lineTo(166.5 + 10, 50);
    ctx2.lineTo(166.5 + 15, 0);
    //  ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(348, 50);
    ctx2.lineTo(348 - 5, 50);
    ctx2.lineTo(348 - 10, 0);
    ctx2.lineTo(348, 0);
    ctx2.fillStyle = "rgba(14, 12, 11, 1);";
    ctx2.fill();
    //  ctx2.stroke();

}



export function protekGrafThree(y1, y2, y3, arr) {

    let number;
    const arrNum = [];

    arr.forEach(el => {
        arrNum.push(Number(el));
    })
    if (arrNum[0] <= arrNum[1] && arrNum[0] <= arrNum[2]) {
        number = arrNum[0]
    }
    if (arrNum[1] <= arrNum[0] && arrNum[1] <= arrNum[2]) {
        number = arrNum[1]
    }
    if (arrNum[2] <= arrNum[0] && arrNum[2] <= arrNum[1]) {
        number = arrNum[2]
    }
    const c2 = document.getElementById("drawLine2");
    const ctx2 = c2.getContext("2d");
    c2.width = 174
    c2.heigth = 60
    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 60);
    ctx2.lineTo(0, y1);
    ctx2.lineTo(174, y2);
    ctx2.lineTo(174, 60);
    ctx2.lineTo(0, 60);
    ctx2.fillStyle = objColors[gener(number)];
    ctx2.fill();
    //  ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 0);
    ctx2.lineTo(0, 50);
    ctx2.lineTo(5, 50);
    ctx2.lineTo(10, 0);
    ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    // ctx2.stroke();

    ctx2.beginPath();
    //ctx2.lineWidth = "1";
    //ctx2.strokeStyle = "#000";
    ctx2.moveTo(174, 50);
    ctx2.lineTo(174 - 5, 50);
    ctx2.lineTo(174 - 10, 0);
    ctx2.lineTo(174, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //  ctx2.stroke();




    const c3 = document.getElementById("drawLine3");
    c3.width = 174
    c3.heigth = 60
    const ctx3 = c3.getContext("2d");
    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, y2);
    ctx3.lineTo(174, y3);
    ctx3.lineTo(174, 60);
    ctx3.lineTo(0, 60);
    ctx3.fillStyle = objColors[gener(number)];
    ctx3.fill();
    // ctx3.stroke();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, 0);
    ctx3.lineTo(0, 50);
    ctx3.lineTo(5, 50);
    ctx3.lineTo(10, 0);
    ctx3.lineTo(0, 0);
    //ctx2.lineTo(0, 60);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
    //  ctx3.stroke();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(174, 50);
    ctx3.lineTo(169, 50);
    ctx3.lineTo(164, 0);
    ctx3.lineTo(174, 0);
    //ctx2.lineTo(0, 60);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
    //  ctx3.stroke();


}


export function protekGrafFour(y1, y2, y3, y4, arr) {


    let number;
    const arrNum = [];

    arr.forEach(el => {
        arrNum.push(Number(el));
    })
    if (arrNum[0] <= arrNum[1] && arrNum[0] <= arrNum[2] && arrNum[0] <= arrNum[3]) {
        number = arrNum[0]
    }
    if (arrNum[1] <= arrNum[0] && arrNum[1] <= arrNum[2] && arrNum[1] <= arrNum[3]) {
        number = arrNum[1]
    }
    if (arrNum[2] <= arrNum[0] && arrNum[2] <= arrNum[1] && arrNum[2] <= arrNum[3]) {
        number = arrNum[2]
    }
    if (arrNum[3] <= arrNum[0] && arrNum[3] <= arrNum[1] && arrNum[3] <= arrNum[2]) {
        number = arrNum[3]
    }


    const c2 = document.getElementById("drawLine2");
    const ctx2 = c2.getContext("2d");
    c2.width = 116
    c2.heigth = 60
    ctx2.beginPath();
    // ctx2.lineWidth = "1";
    // ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 60);
    ctx2.lineTo(0, y1);
    ctx2.lineTo(116, y2);
    ctx2.lineTo(116, 60);
    ctx2.lineTo(0, 60);
    ctx2.fillStyle = objColors[gener(number)];
    ctx2.fill();
    // ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 0);
    ctx2.lineTo(0, 50);
    ctx2.lineTo(5, 50);
    ctx2.lineTo(10, 0);
    ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //  ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(116, 50);
    ctx2.lineTo(116 - 5, 50);
    ctx2.lineTo(116 - 10, 0);
    ctx2.lineTo(116, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //  ctx2.stroke();

    const c3 = document.getElementById("drawLine3");
    const ctx3 = c3.getContext("2d");
    c3.width = 116
    c3.heigth = 60
    ctx3.beginPath();
    //  ctx3.lineWidth = "1";
    // ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, y2);
    ctx3.lineTo(116, y3);
    ctx3.lineTo(116, 60);
    ctx3.lineTo(0, 60);
    ctx3.fillStyle = objColors[gener(number)];
    ctx3.fill();
    // ctx3.stroke();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, 0);
    ctx3.lineTo(0, 50);
    ctx3.lineTo(5, 50);
    ctx3.lineTo(10, 0);
    ctx3.lineTo(0, 0);
    //ctx2.lineTo(0, 60);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
    // ctx3.stroke();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(116, 50);
    ctx3.lineTo(111, 50);
    ctx3.lineTo(106, 0);
    ctx3.lineTo(116, 0);
    //ctx2.lineTo(0, 60);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
    // ctx3.stroke();

    const c4 = document.getElementById("drawLine4");
    const ctx4 = c4.getContext("2d");
    c4.width = 116
    c4.heigth = 60
    ctx4.beginPath();
    //  ctx4.lineWidth = "1";
    //  ctx4.strokeStyle = "#000";
    ctx4.moveTo(0, y3);
    ctx4.lineTo(116, y4);
    ctx4.lineTo(116, 60);
    ctx4.lineTo(0, 60);
    ctx4.fillStyle = objColors[gener(number)];
    ctx4.fill();
    //  ctx4.stroke();

    ctx4.beginPath();
    ctx4.lineWidth = "1";
    ctx4.strokeStyle = "#000";
    ctx4.moveTo(0, 0);
    ctx4.lineTo(0, 50);
    ctx4.lineTo(5, 50);
    ctx4.lineTo(10, 0);
    ctx4.lineTo(0, 0);
    //ctx2.lineTo(0, 60);
    ctx4.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx4.fill();
    //  ctx4.stroke();

    ctx4.beginPath();
    ctx4.lineWidth = "1";
    ctx4.strokeStyle = "#000";
    ctx4.moveTo(116, 50);
    ctx4.lineTo(111, 50);
    ctx4.lineTo(106, 0);
    ctx4.lineTo(116, 0);
    //ctx2.lineTo(0, 60);
    ctx4.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx4.fill();
    // ctx4.stroke();

}




export function protekGrafFree() {
    const c2 = document.getElementById("drawLine2");
    const ctx2 = c2.getContext("2d");
    c2.width = 116
    c2.heigth = 60
    ctx2.beginPath();
    // ctx2.lineWidth = "1";
    // ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 60);
    ctx2.lineTo(0, 0);
    ctx2.lineTo(116, 0);
    ctx2.lineTo(116, 60);
    ctx2.lineTo(0, 60);
    ctx2.fillStyle = "rgba(255,104,0, 1)";
    ctx2.fill();
    // ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 0);
    ctx2.lineTo(0, 50);
    ctx2.lineTo(5, 50);
    ctx2.lineTo(10, 0);
    ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //  ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(116, 50);
    ctx2.lineTo(116 - 5, 50);
    ctx2.lineTo(116 - 10, 0);
    ctx2.lineTo(116, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //  ctx2.stroke();

    const c3 = document.getElementById("drawLine3");
    const ctx3 = c3.getContext("2d");
    c3.width = 116
    c3.heigth = 60
    ctx3.beginPath();
    //  ctx3.lineWidth = "1";
    // ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, 0);
    ctx3.lineTo(116, 0);
    ctx3.lineTo(116, 60);
    ctx3.lineTo(0, 60);
    ctx3.fillStyle = "rgba(255,104,0, 1)";
    ctx3.fill();
    // ctx3.stroke();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, 0);
    ctx3.lineTo(0, 50);
    ctx3.lineTo(5, 50);
    ctx3.lineTo(10, 0);
    ctx3.lineTo(0, 0);
    //ctx2.lineTo(0, 60);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
    // ctx3.stroke();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(116, 50);
    ctx3.lineTo(111, 50);
    ctx3.lineTo(106, 0);
    ctx3.lineTo(116, 0);
    //ctx2.lineTo(0, 60);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
    // ctx3.stroke();

    const c4 = document.getElementById("drawLine4");
    const ctx4 = c4.getContext("2d");
    c4.width = 116
    c4.heigth = 60
    ctx4.beginPath();
    //  ctx4.lineWidth = "1";
    //  ctx4.strokeStyle = "#000";
    ctx4.moveTo(0, 0);
    ctx4.lineTo(116, 0);
    ctx4.lineTo(116, 60);
    ctx4.lineTo(0, 60);
    ctx4.fillStyle = "rgba(255,104,0, 1)";
    ctx4.fill();
    //  ctx4.stroke();

    ctx4.beginPath();
    ctx4.lineWidth = "1";
    ctx4.strokeStyle = "#000";
    ctx4.moveTo(0, 0);
    ctx4.lineTo(0, 50);
    ctx4.lineTo(5, 50);
    ctx4.lineTo(10, 0);
    ctx4.lineTo(0, 0);
    //ctx2.lineTo(0, 60);
    ctx4.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx4.fill();
    //  ctx4.stroke();

    ctx4.beginPath();
    ctx4.lineWidth = "1";
    ctx4.strokeStyle = "#000";
    ctx4.moveTo(116, 50);
    ctx4.lineTo(111, 50);
    ctx4.lineTo(106, 0);
    ctx4.lineTo(116, 0);
    //ctx2.lineTo(0, 60);
    ctx4.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx4.fill();
    // ctx4.stroke();

}