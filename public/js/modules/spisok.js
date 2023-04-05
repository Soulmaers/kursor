import { convert, visual } from './visual.js'
import { dashView } from './dash.js'
import { navigator } from './navigator.js'
import { twoTyres, forTyres } from './content.js'
import { objColor, generFront, generDav } from './content.js'
//import { proverka, restFn } from './alarmStorage.js'
/*
let isLoaded = false

if(isLoaded === true){
    navigator();
}*/
const testov = [];
export async function loadParamsViewList(car) {
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ car }))
    }

    const mod = await fetch('api/listModel', params)
    const model = await mod.json()
    const tyr = await fetch('api/listTyres', params)
    const models = await tyr.json()
    const dat = await fetch('api/wialonAll', params)
    const data = await dat.json()
    testov.push([model, models, data])
    return [model, models, data]
}




export function conturTest(testov) {
    const preloader = document.querySelector('.preloader') /* находим блок Preloader */
    preloader.classList.add('preloader_hidden') /* добавляем ему класс для скрытия */
    const tt = new Date()
    const listItem = document.querySelectorAll('.listItem')
    if (listItem) {
        listItem.forEach(e => {
            e.remove();
        })
    }
    testov.forEach(elem => {
        dashView(elem[0].message)
        const nameCar = elem[0].message.replace(/\s+/g, '')
        const listArr = document.querySelector('.list_arr2')
        const listItemCar = document.createElement('div')
        listItemCar.classList.add('listItem')
        listItemCar.classList.add(`${nameCar}`)
        listArr.appendChild(listItemCar)
        const listName = document.createElement('div')
        listName.classList.add('list_name2')
        listItemCar.appendChild(listName)
        listName.textContent = elem[0].message
        const listProfil = document.createElement('div')
        listProfil.classList.add('list_profil2')
        listItemCar.appendChild(listProfil)
        const listTrail = document.createElement('div')
        listTrail.classList.add('list_trail2')
        listItemCar.appendChild(listTrail)
        if (elem[0].result) {
            const modelUniq = convert(elem[0].result)
            console.log(modelUniq)
            modelUniq.forEach(os => {
                const osi = document.createElement('div')
                osi.classList.add('osi_list')
                if (os.trailer !== 'Прицеп' && os.tyres === 2 || os.trailer !== 'Прицеп' && os.tyres === 4) {
                    fnTagach(os, nameCar)
                }
                if (os.trailer === 'Прицеп' && os.tyres === 2 || os.trailer == 'Прицеп' && os.tyres === 4) {
                    fnPricep(os, nameCar)
                }
            })
        }

        const listItem = document.querySelector(`.${nameCar}`)
        const shina = listItem.querySelectorAll('.arc');
        const r = [];
        let integer;
        if (elem[1].result) {
            const modelUniqValues = convert(elem[1].result)
            modelUniqValues.forEach(el => {
                r.push(el.tyresdiv)
            })
            const uniq = convert(r)
            uniq.forEach((el, index) => {
                shina[index].setAttribute('id', el);
            })


            elem[2].result.forEach((el) => {
                modelUniqValues.forEach((item) => {
                    if (el.name == item.pressure) {
                        shina.forEach(e => {
                            if (e.id == item.tyresdiv) {
                                if (nameCar == 'PressurePro933') {
                                    integer = parseFloat((el.value * 0.069).toFixed(1))
                                    e.children[0].style.fill = objColor[generFront(parseFloat((el.value * 0.069).toFixed(1)))]
                                }
                                else {
                                    integer = el.value
                                    if ((nameCar == 'КранГаличанинР858ОР178')) {
                                        e.children[0].style.fill = objColor[generDav(integer)]
                                    }
                                    else {
                                        e.children[0].style.fill = objColor[generFront(integer)]
                                    }
                                }
                            }
                        })
                    }
                })
            })
        }

    })
    navigator();
    zaprosSpisok()

}

function fnTagach(arr, nameCar) {
    const listItem = document.querySelector(`.${nameCar}`)
    // задаем радиус
    const obj = [];
    let count = 0
    for (let i = 0; i < arr.tyres; i++) {
        count++
        const ob = {}
        ob.tyres = count
        ob.rate = 100 / arr.tyres
        obj.push(ob)
    }
    const svg = d3.select(listItem).select(".list_profil2").append("svg")
        .attr("class", "axis2")
        .attr("width", 25)
        .attr("height", 25)
        .style('margin', '0 0.5px')
        // .style('border', '1px solid black')
        .append("g")
        .attr("transform",
            "translate(" + (12.5) + "," + (12.5) + ")");
    // задаем радиус
    const radius = 5;
    const rr = (Math.PI / 180);
    // создаем элемент арки с радиусом
    const arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(12)
        .startAngle(function (d) { return d.startAngle + Math.PI })
        .endAngle(function (d) { return d.endAngle + Math.PI });
    const pie = d3.layout.pie()
        .sort(null)
        .value(function (d) { return d.rate; });
    const g = svg.selectAll(".arc")
        .data(pie(obj))
        .enter().append("g")
        .attr("class", "arc");

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
    // .style('stroke', 'gray')
}

function fnPricep(arr, nameCar) {
    const listItem = document.querySelector(`.${nameCar}`)
    // задаем радиус
    const obj = [];
    let count = 0
    for (let i = 0; i < arr.tyres; i++) {
        count++
        const ob = {}
        ob.tyres = count
        ob.rate = 100 / arr.tyres
        obj.push(ob)
    }
    const svg = d3.select(listItem).select(".list_trail2").append("svg")
        .attr("class", "axis2")
        .attr("width", 25)
        .attr("height", 25)
        .style('margin', '0 0.5px')
        .append("g")
        .attr("transform",
            "translate(" + (12.5) + "," + (12.5) + ")");
    // задаем радиус
    const radius = 5;
    // создаем элемент арки с радиусом
    const arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(12)
        .startAngle(function (d) { return d.startAngle + Math.PI })
        .endAngle(function (d) { return d.endAngle + Math.PI });

    const pie = d3.layout.pie()
        .sort(null)
        .value(function (d) { return d.rate; });
    const g = svg.selectAll(".arc")
        .data(pie(obj))
        .enter().append("g")
        .attr("class", "arc");

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
    // .style('stroke', 'gray')
}

let count = 0;
export function zaprosSpisok() {
    const list = document.querySelectorAll('.listItem')
    list.forEach(async el => {
        const car = el.children[0].textContent
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ car }))
        }


        const par = await fetch('api/listTyres', param)
        const params = await par.json()

        const dat = await fetch('api/wialonAll', param)
        const data = await dat.json()
        console.log()
        viewListKoleso(data, params, el)
    })
    count++
    if (count === 1) {
        setTimeout(load, 500)
        function load() {
            const preloader = document.querySelector('.preloader') /* находим блок Preloader */
            preloader.classList.add('preloader_hidden') /* добавляем ему класс для скрытия */
        }
    }
}

setInterval(zaprosSpisok, 60000)

function viewListKoleso(arg, params, nameCar) {
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
        const uniq = convert(r)
        uniq.forEach((el, index) => {
            shina[index].setAttribute('id', el);
        })
        arg.result.forEach((el) => {
            modelUniqValues.forEach((item) => {
                if (el.name == item.pressure) {
                    shina.forEach(e => {
                        if (e.id == item.tyresdiv) {
                            if (activePost == 'PressurePro933') {
                                integer = parseFloat((el.value * 0.069).toFixed(1))
                                e.children[0].style.fill = objColor[generFront(parseFloat((el.value * 0.069).toFixed(1)))]
                            }
                            else {
                                integer = el.value
                                if ((activePost == 'КранГаличанинР858ОР178')) {
                                    e.children[0].style.fill = objColor[generDav(integer)]
                                }
                                else {
                                    e.children[0].style.fill = objColor[generFront(integer)]
                                }
                            }
                            arg.result.forEach((it) => {
                                if (it.name === item.temp) {
                                    massItog.push([activePost, e, item.pressure, integer, parseFloat(it.value)])
                                }
                            })
                        }
                    })
                }
            })
        })
    }
}


















/*
export function conturTest(testov) {
     const tt = new Date()
       testov.forEach(elem => {
        dashView(elem[0].message)
            const nameCar = elem[0].message.replace(/\s+/g, '')
        const listArr = document.querySelector('.list_arr2')
        const listItemCar = document.createElement('div')
        listItemCar.classList.add('listItem')
        listItemCar.classList.add(`${nameCar}`)
        listArr.appendChild(listItemCar)
        const listName = document.createElement('div')
        listName.classList.add('list_name2')
        listItemCar.appendChild(listName)
        listName.textContent = elem[0].message
        const listProfil = document.createElement('div')
        listProfil.classList.add('list_profil2')
        listItemCar.appendChild(listProfil)
        const listTrail = document.createElement('div')
        listTrail.classList.add('list_trail2')
        listItemCar.appendChild(listTrail)
        const modelUniq = convert(elem[0].result)
        // console.log(modelUniq)
        modelUniq.forEach(os => {
            const osi = document.createElement('div')
            osi.classList.add('osi_list')
            os.trailer === 'Прицеп' ? listTrail.appendChild(osi) : listProfil.appendChild(osi)
            os.tyres === 2 ? osi.innerHTML = twoTyres : osi.innerHTML = forTyres
        })
        const listItem = document.querySelector(`.${nameCar}`)
        const shina = listItem.querySelectorAll('.tiresProfil');
        const modelUniqValues = convert(elem[1].result)
        const r = [];
        let integer;
        modelUniqValues.forEach(el => {
            r.push(el.tyresdiv)
        })
        const uniq = convert(r)
        uniq.forEach((el, index) => {
            shina[index].setAttribute('id', el);
        })
        elem[1].result.forEach((el) => {
            modelUniqValues.forEach((item) => {
                if (el.name == item.pressure) {
                    shina.forEach(e => {
                        if (e.id == item.tyresdiv) {
                            if (nameCar == 'PressurePro933') {
                                integer = parseFloat((el.value * 0.069).toFixed(1))
                                e.style.background = objColor[generFront(parseFloat((el.value * 0.069).toFixed(1)))]
                            }
                            else {
                                integer = el.value
                                if ((nameCar == 'КранГаличанинР858ОР178')) {
                                    e.style.background = objColor[generDav(integer)]
                                }
                                else {
                                    e.style.background = objColor[generFront(integer)]
                                }
                            }
                        }
                    })
                }
            })
        })


    })
    navigator();
    zaprosSpisok()
}*/