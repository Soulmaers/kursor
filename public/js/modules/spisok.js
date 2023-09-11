import { convert } from './helpersFunc.js'
import { navigator } from './navigator.js'
import { objColorFront, generDav } from './content.js'
import { sortAll } from './sort.js'
import { approximateValue } from './staticObject.js'
import { removeElem, removeArrElem } from './helpersFunc.js'
import { globalSelect } from './filtersList.js'
const login = document.querySelectorAll('.log')[1].textContent



export async function loadParamsViewList(car, el) {
    console.log('ты работаешь?')
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ car, el }))
    }
    const mod = await fetch('/api/listModel', params)
    const model = await mod.json()
    const tyr = await fetch('/api/listTyres', params)
    const models = await tyr.json()
    const dat = await fetch('/api/wialonAll', params)
    const data = await dat.json()
    const osis = await fetch('/api/barViewAll', params)
    const osi = await osis.json()

    model.result.sort((a, b) => {
        if (a.osi > b.osi) {
            return 1;
        } else if (a.osi < b.osi) {
            return -1;
        } else {
            return 0;
        }
    });
    return [model, models, data, osi, el]
}

export async function conturTest(testov) {
    const result = testov
        .map(el => Object.values(el)) // получаем массивы всех id
        .flat()
        .map(e => e[4])

    const final = await alternativa(result)

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
            const lowList = document.querySelector('.low_list')
            const group = document.createElement('div')
            group.classList.add('groups')
            const nameGroup = el[0][5].replace(/\s/g, '_');
            group.classList.add(`${nameGroup}`)
            group.style.display = 'flex',
                group.style.flexDirection = 'column'
            group.style.width = 100 + '%',
                lowList.appendChild(group)
            const titleModal = document.createElement('div')
            titleModal.classList.add('titleModal')
            if (login === 'Курсор') {
                titleModal.textContent = `${'Компания...'}` + ' ' + '(' + `${el.length}` + ')'
            }
            else {
                titleModal.textContent = `${nameGroup}` + ' ' + '(' + `${el.length}` + ')'
            }

            group.appendChild(titleModal)
            const filterV = document.createElement('div')
            filterV.classList.add('filterV')
            titleModal.appendChild(filterV)
            const filterVN = document.createElement('div')
            filterVN.classList.add('filterVN')
            login === 'Курсор' ? (filterVN.style.display = 'none', filterV.style.display = 'none') : null
            titleModal.appendChild(filterVN)
            const minusS = document.createElement('div')
            minusS.classList.add('minusS')
            const plusS = document.createElement('div')
            plusS.classList.add('plusS')
            titleModal.appendChild(plusS)
            titleModal.appendChild(minusS)
            const pAll = document.createElement('p')
            pAll.classList.add('pAll')
            pAll.innerHTML = `<input class="checkInListaLL" type="checkbox" rel="${nameGroup}" value="${nameGroup}" id="${nameGroup}"
                    >Все`
            titleModal.prepend(pAll)
            const hiddenModal = document.createElement('div')
            hiddenModal.classList.add('hiddenModal')
            group.classList.add(`${nameGroup}`)
            group.appendChild(hiddenModal)
            const listArr = document.querySelector(`.${nameGroup}`)
            const countElem = document.querySelectorAll('.newColumn')
            el.forEach(async elem => {
                const nameCar = elem[0].message.replace(/\s+/g, '')
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
                listProfil.classList.add('newCelChange')
                listProfil.setAttribute('rel', `pressure tagach`)
                listProfil.classList.add('list_profil2')
                listItemCar.appendChild(listProfil)
                const listTrail = document.createElement('div')
                listTrail.classList.add('newCelChange')
                listTrail.setAttribute('rel', `pressure pricep`)
                listTrail.classList.add('list_trail2')
                listItemCar.appendChild(listTrail)
                /* if (nameCar === 'ЦистернаДТ') {
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
                 }*/
                let in1;
                let type;
                let oil;
                let pwr;
                let statusnew;
                let sats;
                let meliage;
                let condition;
                final.forEach(i => {
                    if (i[0] === 'Зажигание' && i[2] === elem[4]) {
                        in1 = i[3] === -348201.3876 ? '-' : i[3]
                    }
                    if (i[0] === 'Скорость' && i[2] === elem[4]) {
                        const speed = i[3] === -348201.3876 ? '-' : i[3]
                        if (speed > 5) {
                            condition = `<i class="fas fa-arrow-alt-circle-right toogleIcon"></i>`;
                        }
                        else if (speed <= 5 && in1 === 1) {
                            condition = `<i class="fas fa-pause-circle toogleIcon"></i>`;
                        }
                        else if (speed <= 5 && in1 === 0 || speed === '-' && in1 === 0 || !speed && in1 === 0) {
                            condition = `<i class="fas fa-parking toogleIcon"></i>`;
                        }
                        else if (speed === '-' && in1 === '-') {
                            condition = `<i class="fas fa-power-off></i>`;
                        }
                        else if (!speed && !in1) {
                            condition = '-';
                        }
                    }
                    if (i[0] === 'Топливо' && i[2] === elem[4]) {
                        oil = i[3] === -348201.3876 ? '-' : `${i[3].toFixed(0)} л.`
                    }
                    if (i[0].startsWith('Бортовое') && i[2] === elem[4]) {
                        pwr = i[3] === -348201.3876 ? '-' : parseFloat(i[3].toFixed(1))
                    }
                    if (i[0].startsWith('Одом') && i[2] === elem[4]) {
                        meliage = i[3] === -348201.3876 ? '-' : `${i[3].toFixed(0)} км.`
                    }
                })

                if (elem[0].result) {
                    const modelUniq = convert(elem[0].result)
                    modelUniq.forEach(os => {
                        type = os.type
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
                const shina = listItem.querySelectorAll('.arc');
                let num = 0;
                shina.forEach(e => {
                    num++
                    e.setAttribute('id', num)
                })
                const r = [];
                let integer;
                if (elem[1].result) {
                    const modelUniqValues = convert(elem[1].result)
                    modelUniqValues.forEach(el => {
                        r.push(el.tyresdiv)
                    })
                    elem[2].result.forEach((el) => {
                        if (el.name === 'sats') {
                            sats = el.value
                        }
                        modelUniqValues.forEach((item) => {
                            if (el.name == item.pressure) {

                                shina.forEach(e => {
                                    if (e.id == item.tyresdiv) {
                                        // console.log(elem[4], el.status, in1)
                                        if (el.status === 'false' && in1 === 1) {
                                            e.children[0].style.fill = 'gray'
                                            return
                                        }
                                        if (in1 === 0 || in1 === '-') {
                                            e.children[0].style.fill = '#000'
                                            //  e.children[0].style.background = 'lightgray';
                                            //  e.children[1].style.color = 'lightgray'
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
                    statusnew = sats === '' ? '-' : sats > 4 && in1 === 1 ? 'ВКЛ' : 'ВЫКЛ';

                }
                const iconValues = {
                    ingine: [in1, `<i class="fas fa-key actIcon"></i>`],
                    oil: [oil, oil],
                    type: [type, type],
                    pwr: [pwr, pwr],
                    statusnew: [statusnew, `<i class="fas fa-satellite-dish actIcon"></i>`],
                    sats: [sats, sats],
                    meliage: [meliage, meliage],
                    condition: [condition, condition]
                }

                for (let i = 0; i < countElem.length; i++) {
                    const newClass = countElem[i].getAttribute('rel')
                    const newCel = document.createElement('div')
                    newCel.classList.add('newCel')
                    newCel.classList.add('newCelChange')
                    newCel.setAttribute('rel', `${newClass}`)
                    newCel.innerHTML = iconValues[newClass][1]
                    i === 0 && iconValues[newClass][0] === 'ВКЛ' ? newCel.children[0].classList.add('toogleIcon') : i === 0 && iconValues[newClass][0] === undefined ? newCel.innerHTML = '-' : null
                    i === 1 && iconValues[newClass][0] === 1 ? newCel.children[0].classList.add('toogleIcon') : i === 1 && iconValues[newClass][0] === '-' ? newCel.innerHTML = '-' : null
                    i === 3 && iconValues[newClass][0] === 'Тип ТС' || i === 3 && iconValues[newClass][0] === undefined ? newCel.innerHTML = '-' : null
                    i >= 4 && i <= 7 && iconValues[newClass][0] === undefined || i === 2 && iconValues[newClass][0] === undefined ? newCel.innerHTML = '-' : null
                    listItemCar.appendChild(newCel)
                }
            })
        }
    })

    viewList(login)
    hiddenWindows()
    navigator();
    sortAll()
    setTimeout(zaprosSpisok, 1000)

}

export const viewList = async (login) => {
    console.log('тут?')
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ login }))
    }
    const ress = await fetch('/api/viewList', param)
    const results = await ress.json()
    const objChangeList = results.res[0]
    if (results.res.length === 0) {
        return
    } else {

        const uniqBar = document.querySelectorAll('.uniqBar')
        uniqBar.forEach(el => {
            el.children[0].checked = objChangeList[el.children[0].id] === 'false' ? false : true
        })
    }
    const titleChangeList = document.querySelectorAll('.title_list_global')
    titleChangeList.forEach(el => {
        el.style.display = objChangeList[el.getAttribute('rel').split(' ')[1] ? el.getAttribute('rel').split(' ')[0] : el.getAttribute('rel')] === 'false' ? 'none' : 'flex'
    })

    const newCelChange = document.querySelectorAll('.newCelChange')
    newCelChange.forEach(el => {
        el.style.display = objChangeList[el.getAttribute('rel').split(' ')[1] ? el.getAttribute('rel').split(' ')[0] : el.getAttribute('rel')] === 'false' ? 'none' : 'flex'
    })
    globalSelect()
}
export async function alternativa(arr) {
    return new Promise(async function (resolve, reject) {
        const allobj = {};
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ arr, login }))
        }
        const ress = await fetch('/api/sensorsName', param)
        const results = await ress.json()
        if (!results) {
            ggg(id)
        }
        const arrNameSens = [];
        const nameSens = results.res.map(e => {
            return { sens: Object.entries(e.result.item.sens), id: e.idw }
        })
        nameSens.forEach(el => {
            const arrName = [];
            el.sens.forEach(it => {
                arrName.push([it[1].n, it[1].p, el.id])
            })

            arrNameSens.push(arrName)
        })
        const res = await fetch('/api/lastSensors', param)
        const result = await res.json()
        if (result) {
            const valueSens = [];
            result.res.forEach(e => {
                valueSens.push(Object.values(e.result))
            })
            const allArr = [];
            arrNameSens.forEach((e, index) => {
                for (let i = 0; i < e.length; i++) {
                    allArr.push([...e[i], valueSens[index][i]])
                }
            })

            resolve(allArr)
        }

    });
}


export async function gg(id) {
    return new Promise(async function (resolve, reject) {
        const idw = id
        const allobj = {};
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw, login }))
        }
        const ress = await fetch('/api/sensorsName', param)
        const results = await ress.json()
        if (!results) {
            ggg(id)
        }
        const nameSens = Object.entries(results.item.sens)
        const arrNameSens = [];
        nameSens.forEach(el => {
            arrNameSens.push([el[1].n, el[1].p])
        })
        const res = await fetch('/api/lastSensors', param)
        const result = await res.json()
        if (result) {
            const valueSens = [];
            Object.entries(result).forEach(e => {
                valueSens.push(e[1])
            })
            //    console.log(valueSens)
            const allArr = [];
            arrNameSens.forEach((e, index) => {
                allArr.push([...e, valueSens[index]])
            })
            resolve(allArr)
        }

    });
}

async function fnStaticObjectOil(idw) {
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
    const argy = await fetch('/api/wialon', param)
    const arg = await argy.json()
    const parFind = await fetch('/api/iconFind', param)
    const paramssyFind = await parFind.json()
    arg.forEach(el => {
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
        .attr("width", 18)
        .attr("height", 18)
        .style('margin', '0 1px')
        .append("g")
        .attr('class', 'gOs')
        .attr('id', arr.osi)
        .attr("transform",
            "translate(" + (9) + "," + (9) + ")");
    // задаем радиус
    const radius = 4;
    const rr = (Math.PI / 180);
    // создаем элемент арки с радиусом
    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(8)
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
        .attr("width", 18)
        .attr("height", 18)
        .style('margin', '0 0.5px')
        .append("g")
        .attr('class', 'gOs')
        .attr('id', arr.osi)
        .attr("transform",
            "translate(" + (9) + "," + (9) + ")");
    // задаем радиус
    const radius = 4;
    // создаем элемент арки с радиусом
    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(8)
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
export async function zaprosSpisok() {
    const list = document.querySelectorAll('.listItem')
    const arrId = Array.from(list).map(el => parseFloat(el.id))
    const res = await alternativa(arrId)
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ arrId }))
    }

    const listsr = await fetch('/api/spisokList', param)
    const spisoks = await listsr.json()
    console.log(spisoks)
    list.forEach(async el => {
        const idw = el.id
        const inn = res.filter(e => {
            if (e[2] === parseFloat(idw)) {
                return e;
            }
        });
        const spisok1 = spisoks.res.filter(e => {
            if (e.idw === parseFloat(idw)) {
                return e.result
            }
        });
        const spisok = spisok1[0].result
        //  console.log(spisok)
        viewListKoleso(spisok[1], spisok[2], spisok[3], el, inn)
    })
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
setInterval(zaprosSpisok, 120000)
async function viewListKoleso(params, arg, osi, nameCar, inn) {
    const massItog = [];
    const shina = nameCar.querySelectorAll('.arc');
    if (params.result) {
        const modelUniqValues = convert(params.result)
        const activePost = nameCar.children[0].textContent.replace(/\s+/g, '')
        let integer;
        //  const res = await gg(nameCar.id)
        let in1;
        inn.forEach(i => {
            if (i[0] === 'Зажигание') {
                in1 = i[3]
            }
        })
        arg.result.forEach((el) => {
            modelUniqValues.forEach((item) => {
                if (el.name == item.pressure) {
                    shina.forEach(e => {
                        if (e.id == item.tyresdiv) {
                            if (el.status === 'false' && in1 === 1) {
                                e.children[0].style.fill = 'gray'
                                return
                            }
                            if (in1 === 0) {
                                e.children[0].style.fill = '#000'
                                //  e.children[0].style.background = 'lightgray';
                                //  e.children[1].style.color = 'lightgray'
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
            // el.closest('.groups').children[0].children[1].style.left = '190px'
            //  el.closest('.groups').children[0].children[2].style.left = '190px'

        })
    })
    const group = document.querySelectorAll('.groups')
    group.forEach(it => {
        const ide = it.children[0].children[0].children[0]
        const ideValue = it.children[0].children[0].children[0].id
        const checkboxes = document.querySelectorAll('.checkInList');
        let enabledSettings = []
        if (ide.checked === true) {
            checkboxes.forEach(el => {
                el.checked === false ? enabledSettings.push(el) : null
            })
        }
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function (event) {
                if (this.id !== ideValue) {
                    checkbox.closest('.listItem').style.display = 'none'
                }
            })
        });
        ide.addEventListener('change', (event) => {
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

    minusS.forEach(el => {
        el.addEventListener('click', () => {
            el.style.display = 'none'
            el.previousElementSibling.style.display = 'block'
            el.closest('.groups').children[1].style.display = 'none'
            el.closest('.groups').children[0].style.padding = '5px 40px'
            el.closest('.groups').children[0].children[0].style.display = 'none'
            el.closest('.groups').children[0].children[4].style.left = '5px'
            // el.closest('.groups').children[0].children[1].style.left = '170px'
            // el.closest('.groups').children[0].children[2].style.left = '170px'
        })
    })
}