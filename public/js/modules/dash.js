import { dann } from './menu.js'
import { convert } from './visual.js'


export function dashView(nameCar) {
    const box = document.querySelector('.check_box')
    console.log(nameCar)
    //  console.log(check)
    const activePost = nameCar.replace(/\s+/g, '')
    const list = document.createElement('p')
    list.classList.add('listTitle')
    list.innerHTML = `<input class="input" type="checkbox" rel=${activePost}
    value=${activePost} id=${activePost}>${activePost}`
    box.appendChild(list)

}


export function getDash() {
    const dataArr = [];
    const paramsArr = [];
    dann.forEach(el => {
        const activePost = el.nm.replace(/\s+/g, '')

        fetch('api/tyresView', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ activePost }))
        })
            .then((res) => res.json())
            .then((res) => {
                const params = res
                // console.log(params)
                paramsArr.push(params)
                fetch('api/wialon', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: (JSON.stringify({ activePost }))
                })
                    .then((res) => res.json())
                    .then((res) => {
                        const data = res
                        // console.log(data)
                        dataArr.push(data)
                        // dashAllSort(data)
                        /*
                                        data.values.sort((prev, next) => {
                                            if (prev.name < next.name) return -1;
                                            if (prev.name < next.name) return 1;
                                        })
                                          */
                    })
            })
    })
    //  setTimeout(console.log, 1000, massiv)
    setTimeout(dashAllSort, 1000, dataArr, paramsArr)

}



function dashAllSort(dataArr, paramsArr) {
    console.log(dataArr.length)
    console.log(paramsArr)
    const all = []
    const paramsNewArr = [];
    dataArr.forEach(e => {
        const arr = new Object();
        arr.name = e.message;
        arr.params = [];
        all.push(arr)
    })
    paramsArr.forEach(e => {
        paramsNewArr.push(convert(e.values))
    })
    console.log(paramsNewArr)
    const arrSmall = [];
    dataArr.forEach((el, index) => {
        el.values.forEach(e => {
            paramsNewArr[index].forEach(it => {
                if (e.name == it.pressure) {
                    all.forEach(item => {
                        if (item.name === el.message) {
                            e.value >= 100 ? item.params.push((e.value * 0.069).toFixed(1)) : item.params.push(e.value)
                            e.value >= 100 ? arrSmall.push((e.value * 0.069).toFixed(1)) : arrSmall.push(e.value)
                        }
                    })
                }
            })
        })
    })
    const checkboxes = document.querySelectorAll('.input');
    let enabledSettings = []
    checkboxes.forEach(function (checkbox) {
        const mas = [];
        checkbox.addEventListener('change', function () {
            if (this.id !== "Все") {
                const ide = document.getElementById('Все')
                ide.checked = false;
                enabledSettings = Array.from(checkboxes).filter(i => i.checked).map(i => i.value)
                console.log(enabledSettings)
                enabledSettings.forEach(el => {
                    all.forEach(it => {
                        if (el == it.name) {
                            it.params.forEach(e => {
                                mas.push(e)
                            })
                        }
                    })
                })
                console.log('мас условие')
                dashDav(mas)
                mas.length = 0;
            }
            if (this.id == "Все") {
                const ide = document.getElementById('Все')
                checkboxes.forEach(el => {
                    el.checked = false
                })
                console.log('ап')
                ide.checked = true;
                console.log('все условие')
                dashDav(arrSmall)
            }
        })
    });

    const ide = document.getElementById('Все')
    if (ide.checked) {
        console.log('все низ')
        dashDav(arrSmall)
    }
    console.log(all)
}


function dashDav(arr) {
    console.log(arr)
    let countRed = 0;
    let countYellow = 0;
    let countGreen = 0;
    arr.forEach((el) => {
        if (el >= 8 && el <= 9) {
            countGreen++
        }
        if (el >= 7.5 && el < 8 || el > 9 && el <= 13) {
            countYellow++
        }
        if (el > -100 && el < 7.5 || el > 13 || el === -348201.3876) {
            countRed++
        }
    })
    const resultRed = Math.round(countRed / arr.length * 100);
    const resultYellow = Math.round(countYellow / arr.length * 100);
    const resultGreen = Math.round(countGreen / arr.length * 100);
    const arrD = [resultRed, resultYellow, resultGreen];
    console.log(arrD)
    const newBoad = document.getElementById('myChart')
    if (newBoad) {
        newBoad.remove();
    }

    const dashBoard = document.querySelector('.dash_board')
    const board = document.createElement('canvas')
    board.setAttribute('id', 'myChart')
    dashBoard.appendChild(board)

    Chart.register(ChartDataLabels);


    const ctx = document.getElementById('myChart')
    const chart = new Chart(ctx, {

        type: 'doughnut',
        data: {
            labels: [
                'Критически',
                'Повышенное/Пониженное',
                'Норма'
            ],
            datasets: [{
                label: 'Дашбоард',
                data: arrD,
                backgroundColor: [
                    '#e03636',
                    '#9ba805',
                    '#3eb051'
                ],
                hoverOffset: 4
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 10
                        }
                    }
                },
                datalabels: {
                    color: '#423737',
                    textAlign: 'center',
                    font: {
                        size: 16,
                        lineHeight: 1.6
                    },
                    formatter: function (value) {
                        return value + '%';
                    }
                }
            }
        }
    });
    const upRender = () => {
        chart.data.datasets[0].data = arrD;
        // chart2.data.datasets[0].data = arrT;
        chart.update();
        //  chart2.update();
    }

    setInterval(upRender, 1500);

}


