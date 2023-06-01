import { generDav } from './content.js'

export function dashView() {
    const group = Array.from(document.querySelectorAll('.groups'))
    const name = group.map(el => {
        return Array.from(el.children[1].children).map(it => [it.children[0].textContent])
    }).flat()
    const ids = group.map(el => {
        return Array.from(el.children[1].children).map(it => [it.id])
    }).flat()
    const box = document.querySelector('.check_box')
    const listTitle = document.querySelector('.listTitle')
    if (!listTitle) {
        for (let i = 0; i < name.length; i++) {
            const list = document.createElement('p')
            list.classList.add('listTitle')
            list.innerHTML = `<input class="input" type="checkbox" rel=${ids[i]}
    value=${ids[i]} id=${ids[i]}>${name[i]}`
            box.appendChild(list)
        }
    }
}

export async function getDash() {
    const group = Array.from(document.querySelectorAll('.groups'))
    const ids = group.map(el => {
        return Array.from(el.children[1].children).map(it => it.id)
    }).flat()
    const result = await Promise.all(ids.map(async el => {
        return waitArr(el)
    })
    )
    dashAllSort(result)
}

async function waitArr(el) {
    const idw = el
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ idw }))
    }
    const tyr = await fetch('api/tyresView', param)
    const params = await tyr.json();
    const os = await fetch('api/barView', param)
    const osi = await os.json()
    const res = await reqSensDash(idw)
    const osss = osi.values
    const par = params.values

    osss.forEach(it => {
        delete it.id
        delete it.nameCar
    })
    par.forEach(el => {
        osss.forEach(e => {
            if (el.osNumber === e.idOs) {
                el.bar = e
            }
        })
    })
    const itog = res.filter(el => {
        return par.some(param => {
            return param.pressure === el[1];
        });
    });
    const finish = itog.filter(elem => {
        return par.some(param => {
            return elem[1] === param.pressure;
        });
    }).map(elem => {
        const param = par.find(param => {
            return elem[1] === param.pressure;
        });
        return elem.concat(param.bar);
    });

    const dashObject = {
        id: idw,
        params: finish
    }
    return dashObject
}

export function dashAllSort(test) {
    console.log(test)
    const globalParams = test.map(el => {
        return el.params.map(it => {
            return [it[2], it[3]]
        })
    }).flat()
    const checkboxes = document.querySelectorAll('.input');
    const ide = document.getElementById('Все')
    let enabledSettings = []
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            const mas = [];
            if (this.id !== "Все") {
                ide.checked = false;
                enabledSettings = Array.from(checkboxes).filter(i => i.checked).map(i => i.value)
                enabledSettings.forEach(el => {
                    test.forEach(it => {
                        if (el == it.id) {
                            it.params.forEach(e => {
                                mas.push([e[2], e[3]])
                            })
                        }
                    })
                })
                console.log(mas)
                dashDav(mas)
                const allChecked = Array.from(checkboxes).every(c => !c.checked);
                if (allChecked) {
                    ide.checked = true;
                    dashDav(globalParams)
                }
            }
            if (this.id == "Все") {
                const ide = document.getElementById('Все')
                checkboxes.forEach(el => {
                    el.checked = false
                })
                ide.checked = true;
                dashDav(globalParams)
            }

        })
    });

    if (ide.checked) {
        dashDav(globalParams)
    }
}


function dashDav(arr) {
    console.log(arr)
    const length = arr.length
    const color = {
        1: [],
        2: [],
        3: [],
        4: []
    }
    arr.forEach((el) => {
        if (el[0] === -348201.3876) {
            color[4].push(el[0])
        }
        else {
            color[generDav(el[0], el[1])].push(el[0])
        }
    })
    const resultRed = Math.round(color[1].length / arr.length * 100);
    const resultYellow = Math.round(color[2].length / arr.length * 100);
    const resultGreen = Math.round(color[3].length / arr.length * 100);
    const resultGray = Math.round(color[4].length / arr.length * 100);
    const arrD = [[resultRed, 'Критически'], [resultYellow, 'Повышенное/Пониженное'], [resultGreen, 'Норма'], [resultGray, 'Потеря датчика']];
    const arrDC = [color[1].length, color[2].length, color[3].length, color[4].length];
    newBoard(arrD, arrDC, length)
}

function newBoard(ArrD, ArrDC, length) {
    const newBoad = document.querySelector('.axis')
    if (length === 0) {
        newBoad.style.opacity = 0;
        return
    }
    console.log(ArrD, ArrDC, length)
    const mass = [];
    mass.push(length)
    console.log(ArrD)

    if (newBoad) {
        newBoad.remove();
    }
    const data = [];
    for (let i = 0; i < ArrD.length; i++) {
        data.push({ browser: ArrD[i][1], rate: ArrD[i][0], value: ArrDC[i] })
    }

    const height = 500,
        width = 500,
        margin = 30

    const colorScale = d3.scaleOrdinal()
        .domain(['Критически', 'Повышенное/Пониженное', 'Норма', 'Потеря датчика'])
        .range(['#FF0000', '#FFFF00', '#009933', 'gray']);
    // задаем радиус
    const radius = Math.min(width - 2 * margin, height - 2 * margin) / 2.5;

    // создаем элемент арки с радиусом
    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(85);

    const pie = d3.pie()
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

async function reqSensDash(id) {
    const flagss = 4096
    const prmss = {
        'id': id,
        'flags': flagss
    }
    return new Promise(function (resolve, reject) {
        const remote11 = wialon.core.Remote.getInstance();
        remote11.remoteCall('core/search_item', prmss,
            async function (code, result) {
                if (code) {
                    console.log(wialon.core.Errors.getErrorText(code));
                }
                const nameSens = Object.entries(result.item.sens)
                const arrNameSens = [];
                nameSens.forEach(el => {
                    arrNameSens.push([el[1].n, el[1].p])
                })
                const prms = {
                    "unitId":
                        id,
                    "sensors": []
                }
                const remote1 = wialon.core.Remote.getInstance();
                remote1.remoteCall('unit/calc_last_message', prms,
                    async function (code, result) {
                        if (code) {
                            console.log(wialon.core.Errors.getErrorText(code));
                        }
                        if (result) {
                            const valueSens = [];
                            Object.entries(result).forEach(e => {
                                valueSens.push(e[1])
                            })
                            const allArr = [];
                            arrNameSens.forEach((e, index) => {
                                allArr.push([...e, valueSens[index]])

                            })
                            resolve(allArr)
                        }

                    });
            })
    })
}







