import { dann } from './menu.js'
import { convert } from './visual.js'


export function dashView(nameCar) {
    const box = document.querySelector('.check_box')
    const activePost = nameCar.replace(/\s+/g, '')
    const list = document.createElement('p')
    list.classList.add('listTitle')
    list.innerHTML = `<input class="input" type="checkbox" rel=${activePost}
    value=${activePost} id=${activePost}>${activePost}`
    box.appendChild(list)

}

export async function getDash() {
    const result = await Promise.all(dann.map(async el => {
        return waitArr(el.nm)
    })
    )
    dashAllSort(result)
}

async function waitArr(el) {
    const activePost = el.replace(/\s+/g, '')
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ activePost }))
    }
    const tyr = await fetch('api/tyresView', param)
    const params = await tyr.json();
    //  paramsArr.push(params)
    const dat = await fetch('api/wialon', param)
    const data = await dat.json();
    // dataArr.push(data)
    return [params, data]
}


export function dashAllSort(test) {
    const arrSmall = [];
    const all = []
    console.log(test)
    test.forEach(item => {

        const paramsNewArr = [];
        const arr = new Object();
        arr.name = item[1].message;
        arr.params = [];
        all.push(arr)
        paramsNewArr.push(convert(item[0].values))
        console.log(paramsNewArr)
        item[1].values.forEach((e) => {
            paramsNewArr[0].forEach(it => {
                if (e.name == it.pressure) {
                    all.forEach(items => {
                        if (items.name === item[1].message) {
                            e.value >= 100 ? items.params.push((e.value * 0.069).toFixed(1)) : items.params.push(e.value)
                            e.value >= 100 ? arrSmall.push((e.value * 0.069).toFixed(1)) : arrSmall.push(e.value)
                        }
                    })
                }
                if (e.name === it.temp) {
                    all.forEach(elem => {
                        if (elem.name === item[1].message) {
                            if (e.value == -50 || e.value == -51 || e.value == -128) {
                                elem.params.push(e.value)
                                arrSmall.push(e.value)
                            }
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
                enabledSettings.forEach(el => {
                    all.forEach(it => {
                        if (el == it.name) {
                            it.params.forEach(e => {
                                mas.push(e)
                            })
                        }
                    })
                })
                //console.log(mas)

                dashDav(mas)
                mas.length = 0;
            }
            if (this.id == "Все") {
                const ide = document.getElementById('Все')
                checkboxes.forEach(el => {
                    el.checked = false
                })
                ide.checked = true;
                //  console.log(arrSmall)
                dashDav(arrSmall)
            }
        })
    });

    const ide = document.getElementById('Все')
    if (ide.checked) {
        //  console.log(arrSmall)
        dashDav(arrSmall)
    }

}


function dashDav(arr) {

    // const y = [-51, -50]
    // y.push(...arr)
    //console.log(y)
    console.log(arr)
    console.log(arr.length)
    const length = arr.length
    let countRed = 0;
    let countYellow = 0;
    let countGreen = 0;
    let countGray = 0;
    arr.forEach((el) => {
        if (el <= '-50') {
            countGray++
            console.log('серый')
        }
        else {
            console.log('другие')
            if (el >= 8 && el <= 9) {
                countGreen++
            }
            if (el >= 7.5 && el < 8 || el > 9 && el <= 13) {
                countYellow++
            }
            if (el > -100 && el < 7.5 || el > 13) {
                countRed++
            }
        }


    })
    const resultRed = Math.round(countRed / arr.length * 100);
    const resultYellow = Math.round(countYellow / arr.length * 100);
    const resultGreen = Math.round(countGreen / arr.length * 100);
    const resultGray = Math.round(countGray / arr.length * 100);
    let arrD;
    let arrDC;

    if (countGray == 0) {
        arrD = [resultRed, resultYellow, resultGreen];
        arrDC = [countRed, countYellow, countGreen];
    }
    else {
        arrD = [resultRed, resultYellow, resultGreen, resultGray];
        arrDC = [countRed, countYellow, countGreen, countGray];
    }
    console.log(arrD)
    newBoard(arrD, arrDC, length)
}

function newBoard(ArrD, ArrDC, length) {
    const mass = [];
    mass.push(length)
    console.log(ArrD)
    const newBoad = document.querySelector('.axis')
    if (newBoad) {
        newBoad.remove();
    }

    const height = 500,
        width = 500,
        margin = 30,
        data = [
            { browser: 'Критически', rate: ArrD[0], value: ArrDC[0] },
            { browser: 'Повышенное/Пониженное', rate: ArrD[1], value: ArrDC[1] },
            { browser: 'Норма', rate: ArrD[2], value: ArrDC[2] },
            { browser: 'Потеря датчика' }
        ];

    if (ArrD.length > 3) {
        data[3].rate = ArrD[3],
            data[3].value = ArrDC[3]
    }


    const colorScale = d3.scale.ordinal()
        .domain(['Критически', 'Повышенное/Пониженное', 'Норма', 'Потеря датчика'])
        .range(['red', 'yellow', 'green', 'gray']);
    // задаем радиус
    const radius = Math.min(width - 2 * margin, height - 2 * margin) / 2.5;

    // создаем элемент арки с радиусом
    const arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(85);

    const pie = d3.layout.pie()
        .sort(null)
        .value(function (d) { return d.rate; });
    const svg = d3.select(".dash_card").append("svg")
        .attr("class", "axis")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform",
            "translate(" + (width / 2) + "," + (height / 2) + ")");

    const g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) { return colorScale(d.data.browser); });
    g.append("text")
        .attr("transform", function (d) {
            console.log(arc.centroid(d)[0])
            if (arc.centroid(d)[0] != NaN) {
                return "translate(" + arc.centroid(d) + ")";
            }

        })
        .style("text-anchor", "middle")
        .style('font-size', '1rem')
        .text(function (d) {
            if (d.data.rate !== 0) {
                return d.data.rate + "%"
            }

        });
    g.append("text")
        .attr("transform", function (d) {
            const val = arc.centroid(d)
            const ar1 = parseFloat(val[0])
            const ar2 = parseFloat(val[1] + 15)
            const m = [];
            m.push(ar1, ar2)
            console.log(m[0])
            if (m[0] != NaN) {
                return "translate(" + m + ")";
            }

        })
        .style("text-anchor", "middle")
        .style('font-size', '1rem')
        .text(function (d) {
            if (d.data.value !== 0) {
                return `(${d.data.value})`
            }

        });


    const legendTable = d3.select("svg").append("g")
        .attr("transform", "translate(0, 10)")
        .attr("class", "legendTable");

    var legend = legendTable.selectAll(".legend")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "legend")
        .style('margin', '5px 0')
        .attr("transform", function (d, i) {
            return "translate(0, " + i * 12 + ")";
        });

    console.log(legend)
    legend.append("rect")
        .attr("x", width - 10)
        .attr("y", 4)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d) { return colorScale(d.data.browser); });

    legend.append("text")
        .attr("x", width - 34)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style('font-size', '1rem')
        .text(function (d) { return d.data.browser; });

    var g1 = svg.append("g")
        .attr("transform", function (d, i) {
            return "translate(0,0)";
        });

    g1.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 85)
        .style('fill', 'white')
        .style('stroke', 'black')
    g1.append("text")
        .data(mass)
        .attr("x", 0)
        .attr("y", 5)
        .style('font-size', '1.5rem')
        .style("text-anchor", "middle")
        .text(function (d) { return d });
}



