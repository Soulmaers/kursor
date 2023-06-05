import { convert } from './helpersFunc.js'
import { dashView } from './dash.js'
import { navigator } from './navigator.js'
import { objColorFront, generDav } from './content.js'
import { sortAll } from './sort.js'
import { approximateValue } from './staticObject.js'
import { removeElem, removeArrElem } from './helpersFunc.js'
const testov = [];

export async function loadParamsViewList(car, el) {
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ car, el }))
    }
    const mod = await fetch('api/listModel', params)
    const model = await mod.json()
    const tyr = await fetch('api/listTyres', params)
    const models = await tyr.json()
    const dat = await fetch('api/wialonAll', params)
    const data = await dat.json()
    const osis = await fetch('api/barViewAll', params)
    const osi = await osis.json()
    testov.push([model, models, data, osi])
    return [model, models, data, osi, el]
}
export function conturTest(testov) {
    const groups = document.querySelectorAll('.groups')
    if (groups) {
        removeArrElem(groups)
    }
    const preloader = document.querySelector('.preloader') /* находим блок Preloader */
    preloader.classList.add('preloader_hidden') /* добавляем ему класс для скрытия */
    const listItem = document.querySelectorAll('.listItem')
    if (listItem) {
        removeArrElem(listItem)
    }
    testov.forEach(el => {
        if (el.length !== 0) {
            const wrapList = document.querySelector('.wrapList')
            const group = document.createElement('div')
            group.classList.add('groups')
            group.classList.add(`${el[0].group}`)
            group.style.display = 'flex',
                group.style.flexDirection = 'column'
            group.style.width = 100 + '%',
                wrapList.appendChild(group)
            const titleModal = document.createElement('div')
            titleModal.classList.add('titleModal')
            titleModal.textContent = `${el[0].group}` + ' ' + '(' + `${el.length}` + ')'
            group.appendChild(titleModal)
            const filterV = document.createElement('div')
            filterV.classList.add('filterV')
            titleModal.appendChild(filterV)
            const filterVN = document.createElement('div')
            filterVN.classList.add('filterVN')
            titleModal.appendChild(filterVN)
            const minusS = document.createElement('div')
            minusS.classList.add('minusS')
            const plusS = document.createElement('div')
            plusS.classList.add('plusS')
            titleModal.appendChild(plusS)
            titleModal.appendChild(minusS)
            const pAll = document.createElement('p')
            pAll.classList.add('pAll')
            pAll.innerHTML = `<input class="checkInListaLL" type="checkbox" rel="${el[0].group}" value="${el[0].group}" id="${el[0].group}"
                    >Все`
            titleModal.prepend(pAll)
            const hiddenModal = document.createElement('div')
            hiddenModal.classList.add('hiddenModal')
            group.classList.add(`${el[0].group}`)
            group.appendChild(hiddenModal)
            const listArr = document.querySelector(`.${el[0].group}`)
            el.forEach(elem => {
                const nameCar = elem[0].message.replace(/\s+/g, '')
                //   dashView(nameCar)
                const listItemCar = document.createElement('div')
                listItemCar.classList.add('listItem')
                listItemCar.classList.add(`${elem[4]}`)
                listItemCar.setAttribute('rel', `${elem[4]}`)
                listItemCar.setAttribute('id', `${elem[4]}`)
                listArr.children[1].appendChild(listItemCar)
                const listName = document.createElement('div')
                listName.classList.add('list_name2')
                listItemCar.appendChild(listName)
                listName.textContent = elem[0].message
                const listCheck = document.createElement('p')
                listCheck.classList.add('listTitlesCheck')
                listCheck.innerHTML = `<input class="checkInList" type="checkbox" 
    value=${nameCar} rel=${nameCar} id=${nameCar}OO checked>`
                listName.prepend(listCheck)
                const listProfil = document.createElement('div')
                listProfil.classList.add('list_profil2')
                listItemCar.appendChild(listProfil)
                const listTrail = document.createElement('div')
                listTrail.classList.add('list_trail2')
                listItemCar.appendChild(listTrail)
                if (nameCar === 'ЦистернаДТ') {
                    listProfil.style.width = 60 + '%'
                    removeElem(listTrail)
                    const progress = document.createElement('div')
                    progress.classList.add('progress')
                    listProfil.appendChild(progress)
                    const progressBar = document.createElement('div')
                    progressBar.classList.add('progressBar')
                    progress.appendChild(progressBar)
                    const progressBarText = document.createElement('div')
                    progressBarText.classList.add('progressBarText')
                    progress.appendChild(progressBarText)
                    fnStaticObjectOil(elem[4])
                }
                if (elem[0].result) {
                    const modelUniq = convert(elem[0].result)
                    modelUniq.forEach(os => {
                        const osi = document.createElement('div')
                        osi.classList.add('osi_list')
                        if (os.trailer !== 'Прицеп' && os.tyres === '2' || os.trailer !== 'Прицеп' && os.tyres === '4') {
                            fnTagach(os, elem[4])
                        }
                        if (os.trailer === 'Прицеп' && os.tyres === '2' || os.trailer == 'Прицеп' && os.tyres === '4') {
                            fnPricep(os, elem[4])
                        }
                    })
                }
                const listItem = document.getElementById(`${elem[4]}`)
                const numOs = listItem.querySelectorAll('.gOs');
                numOs.forEach(el => {
                    setId(el)
                })
                const shina = listItem.querySelectorAll('.arc');
                const r = [];
                let integer;
                if (elem[1].result) {
                    const modelUniqValues = convert(elem[1].result)
                    modelUniqValues.forEach(el => {
                        r.push(el.tyresdiv)
                    })
                    elem[2].result.forEach((el) => {
                        modelUniqValues.forEach((item) => {
                            if (el.name == item.pressure) {
                                shina.forEach(e => {
                                    if (e.id == item.tyresdiv) {
                                        if (el.status === 'false') {
                                            e.children[0].style.fill = 'gray'
                                            return
                                        }
                                        if (nameCar == 'А652УА198') {
                                            integer = parseFloat((el.value / 10).toFixed(1))
                                        }
                                        else {
                                            integer = el.value
                                        }
                                        elem[3].result.forEach(it => {
                                            if (it.idOs == item.osNumber) {
                                                e.children[0].style.fill = objColorFront[generDav(integer, it)]
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    })
                }
            })
        }
    })
    hiddenWindows()
    navigator();
    sortAll()
    zaprosSpisok()
}

async function fnStaticObjectOil(idw) {
    console.log('ойл?')
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ idw }))
    }

    const res = await fetch('/api/tarirView', param)
    const response = await res.json()
    const x = [];
    const y = [];
    const points = []
    response.result.forEach(el => {
        const point = []
        x.push(Number(el.DUT))
        y.push(Number(el.litrs))
        point.push(Number(el.DUT))
        point.push(Number(el.litrs))
        points.push(point)
    })
    console.log('ойл2')
    const argy = await fetch('api/wialon', param)
    const arg = await argy.json()
    const parFind = await fetch('api/iconFind', param)
    const paramssyFind = await parFind.json()
    console.log(paramssyFind)
    arg.values.forEach(el => {
        paramssyFind.result.forEach(it => {
            if (el.name === it.params) {
                if (it.icons === 'oil-card') {
                    const val = el.value
                    let degree;
                    if (x.length < 3) {
                        degree = 1
                    }
                    if (x.length >= 3) {
                        degree = 6
                    }
                    const approximated = approximateValue(val, x, y, degree);
                    const znak = (approximated[0] * 0.9987).toFixed(0)
                    console.log(znak)
                    const progressBarText = document.querySelector('.progressBarText')
                    const progressBar = document.querySelector('.progressBar')
                    const value = znak * 100 / y[y.length - 1]
                    progressBarText.textContent = znak + ' ' + 'л.'
                    progressBar.style.width = value + '%'
                    if (value > 30 && value < 70) {
                        progressBar.style.background = 'yellow'
                    }
                    if (value < 20) {
                        progressBar.style.background = 'red'
                        progressBar.style.fontSize = '0.8rem'
                        progressBar.style.color = 'black'
                    }
                }
            }
        })
    })
}

function fnTagach(arr, nameCarId) {
    const listItem = document.getElementById(`${nameCarId}`)
    const obj = [];
    let counts = 0
    for (let i = 0; i < arr.tyres; i++) {
        counts++
        const ob = {}
        ob.tyres = counts
        ob.rate = 100 / arr.tyres
        obj.push(ob)
    }
    const svg = d3.select(listItem).select(".list_profil2").append("svg")
        .attr("class", "axis2")
        .attr("width", 25)
        .attr("height", 25)
        .style('margin', '0 0.5px')
        .append("g")
        .attr('class', 'gOs')
        .attr('id', arr.osi)
        .attr("transform",
            "translate(" + (12.5) + "," + (12.5) + ")");
    // задаем радиус
    const radius = 5;
    const rr = (Math.PI / 180);
    // создаем элемент арки с радиусом
    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(12)
        .startAngle(function (d) { return d.startAngle + Math.PI })
        .endAngle(function (d) { return d.endAngle + Math.PI });
    const pie = d3.pie()
        .sort(null)
        .value(function (d) { return d.rate; });
    const g = svg.selectAll(".arc")
        .data(pie(obj))
        .enter()
        .append("g")
        .attr("class", "arc")
    g.append("path")
        .attr("d", arc)
        .style('fill', 'white')
        .style("stroke", 'black');
    const g1 = svg.append("g")
        .attr("transform", function (d, i) {
            return "translate(0,0)";
        });
    g1.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 4)
        .style('fill', 'black')
        .style('stroke', 'gray')
    const g2 = svg.append("g")
        .attr("transform", function (d, i) {
            return "translate(0,0)";
        });
    g2.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 0.5)
        .style('fill', 'white')
}
function fnPricep(arr, nameCarId) {
    const listItem = document.getElementById(`${nameCarId}`)
    // задаем радиус
    const obj = [];
    let counts = 0
    for (let i = 0; i < arr.tyres; i++) {
        counts++
        const ob = {}
        ob.tyres = counts
        ob.rate = 100 / arr.tyres
        obj.push(ob)
    }
    const svg = d3.select(listItem).select(".list_trail2").append("svg")
        .attr("class", "axis2")
        .attr("width", 25)
        .attr("height", 25)
        .style('margin', '0 0.5px')
        .append("g")
        .attr('class', 'gOs')
        .attr('id', arr.osi)
        .attr("transform",
            "translate(" + (12.5) + "," + (12.5) + ")");
    // задаем радиус
    const radius = 5;
    // создаем элемент арки с радиусом
    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(12)
        .startAngle(function (d) { return d.startAngle + Math.PI })
        .endAngle(function (d) { return d.endAngle + Math.PI });
    const pie = d3.pie()
        .sort(null)
        .value(function (d) { return d.rate; });
    const g = svg.selectAll(".arc")
        .data(pie(obj))
        .enter().append("g")
        .attr("class", "arc")
    g.append("path")
        .attr("d", arc)
        .style('fill', 'white')
        .style("stroke", 'black');
    const g1 = svg.append("g")
        .attr("transform", function (d, i) {
            return "translate(0,0)";
        });
    g1.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 4)
        .style('fill', 'black')
        .style('stroke', 'gray')
    const g2 = svg.append("g")
        .attr("transform", function (d, i) {
            return "translate(0,0)";
        });
    g2.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 0.5)
        .style('fill', 'white')
}
let countt = 0;
export function zaprosSpisok() {
    const list = document.querySelectorAll('.listItem')
    list.forEach(async el => {
        const idw = el.id
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw }))
        }
        const par = await fetch('api/listTyres', param)
        const params = await par.json()
        const dat = await fetch('api/wialonAll', param)
        const data = await dat.json()
        const osis = await fetch('api/barViewAll', param)
        const osi = await osis.json()
        viewListKoleso(data, params, osi, el)
    })
    countt++
    if (countt === 1) {
        setTimeout(load, 500)
        function load() {
            const preloader = document.querySelector('.preloader') /* находим блок Preloader */
            preloader.classList.add('preloader_hidden') /* добавляем ему класс для скрытия */
        }
    }
    const updateTime = document.querySelector('.update_time')
    let today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    today = day + '.' + month + '.' + year;
    let time = new Date();
    const hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    time = hour + ':' + minutes
    const todays = today + ' ' + time
    updateTime.textContent = 'Актуальность данных' + ' ' + todays
}
setInterval(zaprosSpisok, 300000)
function viewListKoleso(arg, params, osi, nameCar) {
    const massItog = [];
    const shina = nameCar.querySelectorAll('.arc');
    if (params.result) {
        const modelUniqValues = convert(params.result)
        const activePost = nameCar.children[0].textContent.replace(/\s+/g, '')
        const r = [];
        let integer;
        modelUniqValues.forEach(el => {
            r.push(el.tyresdiv)
        })
        arg.result.forEach((el) => {
            modelUniqValues.forEach((item) => {
                if (el.name == item.pressure) {
                    shina.forEach(e => {
                        if (e.id == item.tyresdiv) {
                            if (el.status === 'false') {
                                e.children[0].style.fill = 'gray'
                                return
                            }
                            if (activePost == 'А652УА198') {
                                integer = parseFloat((el.value / 10).toFixed(1))
                            }
                            else {
                                integer = el.value
                            }
                            arg.result.forEach((it) => {
                                if (it.name === item.temp) {
                                    massItog.push([activePost, e, item.pressure, integer, parseFloat(it.value)])
                                }
                            })
                            osi.result.forEach(it => {
                                if (it.idOs === item.osNumber) {
                                    e.children[0].style.fill = objColorFront[generDav(integer, it)]
                                }
                            })
                        }
                    })
                }
            })
        })
    }
}
function setId(el) {
    let num = 0;
    Array.from(el.children).forEach(e => {
        if (e.classList.contains('arc')) {
            num++
        }
    })
    if (el.id == 1) {
        let k = 0;
        num === 2 ? (el.children[0].setAttribute('id', 1), el.children[1].setAttribute('id', 4)) :
            (Array.from(el.querySelectorAll('.arc')).forEach(e => {
                k++
                e.setAttribute('id', k)
            })
            )
    }
    if (el.id == 2) {
        let k = 4;
        num === 2 ? (el.children[0].setAttribute('id', 5), el.children[1].setAttribute('id', 8)) :
            (Array.from(el.querySelectorAll('.arc')).forEach(e => {
                k++
                e.setAttribute('id', k)
            })
            )
    }
    if (el.id == 3) {
        let k = 8;
        num === 2 ? (el.children[0].setAttribute('id', 9), el.children[1].setAttribute('id', 12)) :
            (Array.from(el.querySelectorAll('.arc')).forEach(e => {
                k++
                e.setAttribute('id', k)
            })
            )
    }
    if (el.id == 4) {
        let k = 12;
        num === 2 ? (el.children[0].setAttribute('id', 13), el.children[1].setAttribute('id', 16)) :
            (Array.from(el.querySelectorAll('.arc')).forEach(e => {
                k++
                e.setAttribute('id', k)
            })
            )
    }
    if (el.id == 5) {
        let k = 16;
        num === 2 ? (el.children[0].setAttribute('id', 17), el.children[1].setAttribute('id', 20)) :
            (Array.from(el.querySelectorAll('.arc')).forEach(e => {
                k++
                e.setAttribute('id', k)
            })
            )
    }
    if (el.id == 6) {
        let k = 20;
        num === 2 ? (el.children[0].setAttribute('id', 21), el.children[1].setAttribute('id', 24)) :
            (Array.from(el.querySelectorAll('.arc')).forEach(e => {
                k++
                e.setAttribute('id', k)
            })
            )
    }
    if (el.id == 7) {
        let k = 24;
        num === 2 ? (el.children[0].setAttribute('id', 25), el.children[1].setAttribute('id', 28)) :
            (Array.from(el.querySelectorAll('.arc')).forEach(e => {
                k++
                e.setAttribute('id', k)
            })
            )
    }
    if (el.id == 8) {
        let k = 28;
        num === 2 ? (el.children[0].setAttribute('id', 29), el.children[1].setAttribute('id', 32)) :
            (Array.from(el.querySelectorAll('.arc')).forEach(e => {
                k++
                e.setAttribute('id', k)
            })
            )
    }
}

function hiddenWindows() {
    const groups = document.querySelectorAll('.groups')
    groups.forEach(it => {
        var items = it.children[1].childNodes;
        var itemsArr = [];
        for (var i in items) {
            if (items[i].nodeType == 1) { // get rid of the whitespace text nodes
                itemsArr.push(items[i]);
            }
        }
        itemsArr.sort(function (a, b) {
            return a.innerHTML == b.innerHTML
                ? 0
                : (a.innerHTML > b.innerHTML ? 1 : -1);
        });
        for (i = 0; i < itemsArr.length; ++i) {
            it.children[1].appendChild(itemsArr[i]);
        }
    })
    const plusS = document.querySelectorAll('.plusS')
    const minusS = document.querySelectorAll('.minusS')
    plusS.forEach(el => {
        el.addEventListener('click', () => {
            el.style.display = 'none'
            el.nextElementSibling.style.display = 'block'
            el.closest('.groups').children[1].style.display = 'block'
            el.closest('.groups').children[0].style.padding = '5px 80px'
            el.closest('.groups').children[0].children[0].style.display = 'block'
            el.closest('.groups').children[0].children[4].style.left = '60px'
            el.closest('.groups').children[0].children[1].style.left = '190px'
            el.closest('.groups').children[0].children[2].style.left = '190px'
            const ide = el.closest('.groups').children[0].children[0].children[0]
            const ideValue = el.closest('.groups').children[0].children[0].children[0].id
            const checkboxes = document.querySelectorAll('.checkInList');
            let enabledSettings = []
            if (ide.checked === true) {
                checkboxes.forEach(el => {
                    el.checked === false ? enabledSettings.push(el) : null
                })
            }
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function () {
                    if (this.id !== ideValue) {
                        checkbox.closest('.listItem').style.display = 'none'
                    }
                })
            });
            ide.addEventListener('change', () => {
                if (ide.checked) {
                    Array.from(ide.closest('.groups').children[1].children).forEach(it => {
                        it.style.display = 'none'
                    })
                }
                else if (!ide.checked) {
                    Array.from(ide.closest('.groups').children[1].children).forEach(it => {
                        it.style.display = 'flex'
                    })
                    checkboxes.forEach(e => {
                        e.checked = true
                    })
                }
            })
        })
    })
    minusS.forEach(el => {
        el.addEventListener('click', () => {
            el.style.display = 'none'
            el.previousElementSibling.style.display = 'block'
            el.closest('.groups').children[1].style.display = 'none'
            el.closest('.groups').children[0].style.padding = '5px 40px'
            el.closest('.groups').children[0].children[0].style.display = 'none'
            el.closest('.groups').children[0].children[4].style.left = '5px'
            el.closest('.groups').children[0].children[1].style.left = '170px'
            el.closest('.groups').children[0].children[2].style.left = '170px'
        })
    })
}