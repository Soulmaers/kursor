
export function dashViewProtector() {
    const group = Array.from(document.querySelectorAll('.groups'))
    const name = group.map(el => {
        return Array.from(el.children[1].children).map(it => [it.children[0].textContent])
    }).flat()
    const ids = group.map(el => {
        return Array.from(el.children[1].children).map(it => [it.id])
    }).flat()
    const box = document.querySelectorAll('.check_box')
    const listTitleProt = document.querySelector('.listTitleProt')
    console.log(name)
    if (!listTitleProt) {
        for (let i = 0; i < name.length; i++) {
            const list = document.createElement('p')
            list.classList.add('listTitleProt')
            list.innerHTML = `<input class="inputProt" type="checkbox" rel=${ids[i]}
    value=${ids[i]}p id=${ids[i]}p>${name[i]}`
            box[1].appendChild(list)
        }
    }
}

export async function protDash() {
    const group = Array.from(document.querySelectorAll('.groups'))
    const ids = group.map(el => {
        return Array.from(el.children[1].children).map(it => it.id)
    }).flat()
    const result = await Promise.all(ids.map(async el => {
        return waitArrProtek(el)
    })
    )
    dashAllSort(result)
}

async function waitArrProtek(el) {
    const idw = el
    //  console.log(idw)
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ idw }))
    }
    const tyr = await fetch('api/techViewAll', param)
    const params = await tyr.json();
    console.log(params)
    const par = params.values

    //  console.log(par)

    const dashObject = {
        id: idw,
        params: par
    }
    return dashObject
}

export function dashAllSort(test) {
    const globalParams = test.map(el => {
        return el.params.map(it => {
            return {
                id: it.idw,
                params: [it.N1, it.N2, it.N3, it.N4],
                identificator: it.identificator,
                maxMM: it.maxMM
            }
        })
    }).flat()

    // Функция, сравнивающая два элемента массива
    function compare(a, b) {
        if (a.identificator !== b.identificator) {
            // Если поля identificator не совпадают, то сравниваем по ним
            return a.identificator - b.identificator;
        } else if (a.id !== b.id) {
            // Если поля identificator совпадают, а поля id не совпадают, то сравниваем по ним
            return a.id - b.id;
        } else {
            // Если поля identificator и id совпадают, то считаем, что элементы равны
            return 0;
        }
    }
    // Сортируем массив
    globalParams.sort(compare);
    // Удаляем дубликаты
    const result = [];
    for (let i = globalParams.length - 1; i >= 0; i--) {
        const item = globalParams[i];
        if (!result.find(x => x.identificator === item.identificator)) {
            result.push(item);
        }
    }
    const checkboxes = document.querySelectorAll('.inputProt');
    const ide = document.getElementById('ВсеProt')
    let enabledSettings = []
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            const mas = [];
            if (this.id !== "ВсеProt") {
                ide.checked = false;
                enabledSettings = Array.from(checkboxes).filter(i => i.checked).map(i => i.value)
                enabledSettings.forEach(el => {
                    result.forEach(it => {
                        console.log(it)
                        if (el == it.id + 'p') {
                            mas.push(it)
                        }
                    })
                })
                console.log(mas)
                dashDav(mas)
                const allChecked = Array.from(checkboxes).every(c => !c.checked);
                if (allChecked) {
                    ide.checked = true;
                    dashDav(result)
                }
            }
            if (this.id == "ВсеProt") {
                const ide = document.getElementById('ВсеProt')
                checkboxes.forEach(el => {
                    el.checked = false
                })
                ide.checked = true;
                dashDav(result)
            }

        })
    });

    if (ide.checked) {
        dashDav(result)
    }
}

function dashDav(arr) {
    console.log(arr)
    function fnMin(arra) {
        let numbers = arra.filter(num => num !== '').map(num => Number(num));
        let min = Math.min(...numbers);
        return min
    }

    const array = arr.map(e => {
        return {
            id: e.id,
            params: fnMin(e.params),
            identificator: e.identificator,
            maxMM: e.maxMM
        }
    })
    console.log(array)
    const length = arr.length
    const color = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: []
    }
    function generProt(el) {
        let generatedValue;
        if (el >= 80 && el < 100) {
            generatedValue = 1;
        }
        if (el >= 60 && el < 80) {
            generatedValue = 2;
        }
        if (el >= 40 && el < 60) {
            generatedValue = 3;
        }
        if (el < 40) {
            generatedValue = 4;
        }
        return generatedValue;
    };
    array.forEach((el) => {
        if (el.params === Infinity) {
            color[5].push(el.params)
        }
        else {
            const percent = (el.params / Number(el.maxMM) * 100).toFixed(0)
            color[generProt(percent)].push(el.params)
        }
    })
    console.log(color)
    const resultRed = Math.round(color[4].length / arr.length * 100);
    const resultOrange = Math.round(color[3].length / arr.length * 100);
    const resultYellow = Math.round(color[2].length / arr.length * 100);
    const resultGreen = Math.round(color[1].length / arr.length * 100);
    const resultGray = Math.round(color[5].length / arr.length * 100);
    const arrD = [[resultRed, 'Требует немедленной замены'], [resultOrange, 'Критический износ'], [resultYellow, 'Изношено'], [resultGreen, 'Норма'], [resultGray, 'Нет данных']];
    const arrDC = [color[4].length, color[3].length, color[2].length, color[1].length, color[5].length];
    newBoard(arrD, arrDC, length)
}

function newBoard(ArrD, ArrDC, length) {
    const newBoad = document.querySelector('.axis1')
    if (length === 0) {
        newBoad.style.opacity = 0;
        return
    }
    const mass = [];
    mass.push(length)
    if (newBoad) {
        newBoad.remove();
    }
    const data = [];
    for (let i = 0; i < ArrD.length; i++) {
        data.push({ browser: ArrD[i][1], rate: ArrD[i][0], value: ArrDC[i] })
    }
    const height = 350,
        width = 300,
        margin = 30
    const colorScale = d3.scaleOrdinal()
        .domain(['Требует немедленной замены', 'Критический износ', 'Изношено', 'Норма', 'Нет данных'])
        .range(['#FF0000', '#FF6633', '#FFFF00', '#009933', 'gray']);
    // задаем радиус
    const radius = Math.min(width - 2 * margin, height - 2 * margin) / 2.5;
    console.log(radius)
    // создаем элемент арки с радиусом
    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(40);

    const pie = d3.pie()
        .sort(null)
        .value(function (d) { return d.rate; });
    const svg = d3.select(".prot").append("svg")
        .attr("class", "axis1")
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


    const legendTable = d3.select(".prot").select('svg').append("g")
        .attr("transform", "translate(0, 10)")
        .attr("class", "legendTable");

    var legenda = legendTable.selectAll(".legenda")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "legenda")
        .style('margin', '5px 0')
        .attr("transform", function (d, i) {
            return "translate(0, " + i * 12 + ")";
        });

    legenda.append("rect")
        .attr("x", width - 10)
        .attr("y", 4)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d) { return colorScale(d.data.browser); });

    legenda.append("text")
        .attr("x", width - 34)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style('font-size', '0.9rem')
        .text(function (d) { return d.data.browser; });


    var g1 = svg.append("g")
        .attr("transform", function (d, i) {
            return "translate(0,0)";
        });

    g1.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 45)
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







