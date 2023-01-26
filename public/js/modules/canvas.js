

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