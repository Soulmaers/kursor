
import { view, viewConfigurator, pricep } from './visual.js'
import { saveTyres } from './event.js'
import { objColor, generT, generFront } from './content.js'
import { liCreate, viewOs } from './visual.js'
import { tech } from './tech.js'

export const arrayTyres = [];
export function viewMenuParams() {
    const kolesos = [];
    const speedGraf = document.querySelector('.speedGraf')
    const titleSens = document.querySelector('.title_sens')
    const btnsens = document.querySelectorAll('.btnsens')
    const sensors = document.querySelector('.sensors')
    const wrapperMap = document.querySelector('.wrapper_left')
    const obo = document.querySelector('.obo')
    const tiresLink = document.querySelectorAll('.tires_link')
    const techInfo = document.querySelector('.techInfo')
    const grafics = document.querySelector('.grafics')
    const plug = document.querySelectorAll('.plug')
    const tableTarir = document.querySelector('.tableTarir')
    const idbaseTyres = document.querySelector('.idbaseTyres')
    idbaseTyres.textContent = ''
    const arrayTyres = [];
    tiresLink.forEach(e => {
        e.addEventListener('click', () => {
            if (e.classList.contains('tiresActiv')) {
                e.classList.remove('tiresActiv')
                techInfo.style.display = 'none'
                tableTarir.style.display = 'none'
                wrapperMap.style.display = 'block'
                if (plug[1].classList.contains('activGraf')) {
                    grafics.style.display = 'flex';
                    wrapperMap.style.display = 'none'
                }
                return
            }
            kolesos.push(e)
            speedGraf.style.display = 'none';
            tiresLink.forEach(e => {
                obo.style.display = 'none'
                titleSens.style.display = 'none'
                sensors.style.display = 'none'
                tableTarir.style.display = 'none'
                const msg = document.querySelectorAll('.msg')
                msg.forEach(el => el.classList.remove('act'))
                e.classList.remove('tiresActiv')
            });
            sensors.style.display = 'flex';
            e.classList.add('tiresActiv')
            btnsens[0].style.display = 'flex'
            btnsens[1].style.display = 'flex'
            techInfo.style.display = 'block'
            speedGraf.style.display = 'block';
            wrapperMap.style.display = 'none'
            grafics.style.display = 'none';
            tableTarir.style.display = 'none'
            const idbaseTyres = document.querySelector('.idbaseTyres')
            idbaseTyres.textContent = ''
            tech()//отображаем тех.характеристики+логика формул+забираем нужные данные в базу.
        })
    })
    koleso(kolesos, btnsens)
}

export async function loadParamsView() {
    clearInterval(viewPokasateli)
    const titleCar = document.querySelector('.title_two')
    const btnShina = document.querySelectorAll('.modals')
    const listItem = document.querySelectorAll('.link_menu')[0]
    const container = document.querySelector('.container')
    let activePost;
    const active = document.querySelectorAll('.color')
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.listItem')[0]
        activePost = listItem.textContent.replace(/\s+/g, '')
        titleCar.textContent = listItem.textContent
    }
    else {
        activePost = active[0].textContent.replace(/\s+/g, '')
    }
    const idw = document.querySelector('.color').id
    fetch('api/modelView', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ idw }))
    })
        .then((res) => res.json())
        .then((res) => {
            const gos = document.querySelector('.gosNumber')
            const model = res
            console.log(res)
            if (model.values && model.values.length > 0) {
                viewOs(model.values.length)
                const osi = document.querySelectorAll('.osi')
                const centerOs = document.querySelectorAll('.centerOs')
                model.values.sort((a, b) => {
                    if (a.osi > b.osi) {
                        return 1;
                    } else if (a.osi < b.osi) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                console.log(model.values)
                model.values.forEach(el => {
                    el.trailer == 'Прицеп' ?
                        pricep(centerOs[el.osi - 1])
                        : noPricep(centerOs[el.osi - 1])
                    if (el.tyres == 2) {
                        btnShina[1].classList.contains('active') ? centerOs[el.osi - 1].children[0].style.width = '212px' :
                            centerOs[el.osi - 1].children[0].style.width = '212px'
                        centerOs[el.osi - 1].previousElementSibling.children[0].style.display = 'flex';
                        centerOs[el.osi - 1].nextElementSibling.children[1].style.display = 'flex';
                        centerOs[el.osi - 1].previousElementSibling.children[1].style.display = 'none';
                        centerOs[el.osi - 1].nextElementSibling.children[0].style.display = 'none';
                    }
                    else if (el.tyres == 4) {
                        centerOs[el.osi - 1].children[0].style.width = '114px'
                        centerOs[el.osi - 1].previousElementSibling.children[0].style.display = 'flex';
                        centerOs[el.osi - 1].previousElementSibling.children[1].style.display = 'flex';
                        centerOs[el.osi - 1].nextElementSibling.children[0].style.display = 'flex';
                        centerOs[el.osi - 1].nextElementSibling.children[1].style.display = 'flex';
                    }
                })
                if (model.values.find(e => e.trailer === 'Тягач')) {
                    const cont1 = document.querySelector('.cont1')
                    const nomerV = document.createElement('div')
                    nomerV.classList.add('nomerV')
                    cont1.children[0].children[1].appendChild(nomerV)
                    nomerV.style.bottom = '70px'
                    nomerV.style.left = '63.5px'
                    cont1.children[0].children[1].style.position = 'relative'
                    nomerV.style.display = 'flex'
                    const gosNumberCar = document.createElement('input')
                    gosNumberCar.classList.add('gosNumberCar')
                    gosNumberCar.setAttribute('placeholder', 'A000AA')
                    gosNumberCar.maxLength = 6;
                    nomerV.appendChild(gosNumberCar)
                    const flagss = document.createElement('div')
                    flagss.classList.add('flagss')
                    nomerV.appendChild(flagss)
                    const gosNumberCar1 = document.createElement('input')
                    gosNumberCar1.classList.add('gosNumberCar1')
                    gosNumberCar1.setAttribute('placeholder', '00')
                    gosNumberCar1.maxLength = 3;
                    flagss.appendChild(gosNumberCar1)
                    const flag = document.createElement('div')
                    flag.classList.add('flagy')
                    flagss.appendChild(flag)
                    const elemFlag1 = document.createElement('div')
                    elemFlag1.classList.add('flagWhite')
                    flag.appendChild(elemFlag1)
                    const elemFlag2 = document.createElement('div')
                    elemFlag2.classList.add('flagBlue')
                    flag.appendChild(elemFlag2)
                    const elemFlag3 = document.createElement('div')
                    elemFlag3.classList.add('flagRed')
                    flag.appendChild(elemFlag3)
                    model.values[0].frontGosp ? gosNumberCar.value = model.values[0].frontGosp : null
                    model.values[0].frontGosp1 ? gosNumberCar1.value = model.values[0].frontGosp1 : null
                }
                if (model.values.find(e => e.trailer === 'Прицеп')) {
                    const cont = document.querySelector('.cont')
                    const nomerP = document.createElement('div')
                    nomerP.classList.add('nomerP')
                    cont.lastElementChild.children[1].appendChild(nomerP)
                    nomerP.style.top = '65px'
                    nomerP.style.left = '63.5px'
                    cont.lastElementChild.children[1].style.position = 'relative'
                    nomerP.style.display = 'flex'
                    const gosNumber = document.createElement('input')
                    gosNumber.classList.add('gosNumber')
                    gosNumber.setAttribute('placeholder', 'A000AA')
                    gosNumber.maxLength = 6;
                    nomerP.appendChild(gosNumber)
                    const flagss = document.createElement('div')
                    flagss.classList.add('flagss')
                    nomerP.appendChild(flagss)
                    const gosNumber1 = document.createElement('input')
                    gosNumber1.classList.add('gosNumber1')
                    gosNumber1.setAttribute('placeholder', '00')
                    gosNumber1.maxLength = 3;
                    flagss.appendChild(gosNumber1)
                    const flag = document.createElement('div')
                    flag.classList.add('flagy')
                    flagss.appendChild(flag)
                    const elemFlag1 = document.createElement('div')
                    elemFlag1.classList.add('flagWhite')
                    flag.appendChild(elemFlag1)
                    const elemFlag2 = document.createElement('div')
                    elemFlag2.classList.add('flagBlue')
                    flag.appendChild(elemFlag2)
                    const elemFlag3 = document.createElement('div')
                    elemFlag3.classList.add('flagRed')
                    flag.appendChild(elemFlag3)
                    model.values[0].gosp ? gosNumber.value = model.values[0].gosp : null
                    model.values[0].gosp1 ? gosNumber1.value = model.values[0].gosp1 : null
                }
            }
        })

    viewPokasateli()
    setInterval(viewPokasateli, 60000)
}

function noPricep(elem) {
    const cont1 = document.querySelector('.cont1')
    cont1.appendChild(elem.parentNode)
    cont1.style.border = '2px solid darkblue',
        cont1.style.padding = '5px',
        elem.children[0].style.background = '#000'
}

export async function viewPokasateli() {
    const btnShina = document.querySelectorAll('.modals')
    if (btnShina[1].classList.contains('active') === true) {
        return
    }
    let activePost;
    const active = document.querySelectorAll('.color')
    activePost = active[0].children[0].textContent.replace(/\s+/g, '')
    const idw = document.querySelector('.color').id
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ activePost, idw }))
    }
    const paramsss = await fetch('api/tyresView', param)
    const params = await paramsss.json()
    const datas = await fetch('api/wialon', param)
    const data = await datas.json()
    const os = await fetch('api/barView', param)
    const osi = await os.json()
    data.values.sort((prev, next) => {
        if (prev.name < next.name) return -1;
        if (prev.name < next.name) return 1;
    })
    view(data.values)
    viewConfigurator(data.values, params.values, osi.values)
}

function koleso(kol, btnsens) {
    const active = document.querySelectorAll('.color')
    liCreate()
    const msg = document.querySelectorAll('.msg')
    const paramPress = [];
    const paramTemp = [];
    let prmsD = [];
    let prmsT = [];
    msg.forEach(el => {
        el.addEventListener('click', () => {
            const arrSpreed = [...el.textContent]
            let value;
            arrSpreed.forEach(el => {
                if (el === ':') {
                    value = arrSpreed.splice(arrSpreed.indexOf(el) + 1, arrSpreed.length - 1).join('')
                }
            })
            if (btnsens[0].classList.contains('actBTN')) {
                arrSpreed.forEach(el => {
                    if (el === ':') {
                        prmsD.push(arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join(''))
                    }
                })
                if (active[0].textContent == 'А 652 УА 198') {
                    value = (value / 10).toFixed(1)
                }
                else {
                    value
                }
                const valJob = value
                valJob.length > 10 ?
                    kol[kol.length - 1].children[0].textContent = '-' :
                    kol[kol.length - 1].children[0].textContent = valJob + '\nБар'
                kol[kol.length - 1].children[0].style.color = objColor[generFront(valJob)];
                paramPress.push(el)
            }
            if (btnsens[1].classList.contains('actBTN')) {
                arrSpreed.forEach(el => {
                    if (el === ':') {
                        prmsT.push(arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join(''))
                    }
                })
                if (value === '-128' || value === '-51' || value.length > 10) {
                    value = 'err'
                    kol[kol.length - 1].children[1].textContent = value
                }
                else {
                    kol[kol.length - 1].children[1].textContent = value + '°'
                    kol[kol.length - 1].children[1].style.color = objColor[generT(value)];
                }
                paramTemp.push(el)
                valid(paramPress, paramTemp, kol)
            }
        })
    })
}

const massivion = [];
export const massivionbd = [];
function valid(paramPress, paramTemp, kolesos) {
    const kol = kolesos[kolesos.length - 1];
    const kolId = kolesos[kolesos.length - 1].id;
    const dav = paramPress[paramPress.length - 1]
    const temp = paramTemp[paramTemp.length - 1]
    const osId = kolesos[kolesos.length - 1].closest('.osi').children[1].id
    const arrSpreed1 = [...dav.textContent]
    let value;
    arrSpreed1.forEach(el => {
        if (el === ':') {
            value = arrSpreed1.splice(arrSpreed1[0] + 1, arrSpreed1.indexOf(el)).join('')
        }
    })
    const arrSpreed2 = [...temp.textContent]
    let value2;
    arrSpreed2.forEach(el => {
        if (el === ':') {
            value2 = arrSpreed2.splice(arrSpreed2[0] + 1, arrSpreed2.indexOf(el)).join('')
        }
    })
    const mass = [];
    mass.push(kol, dav, temp)
    const massbd = [];
    massbd.push(kolId, value, value2, osId)
    massivion.push(mass)
    massivionbd.push(massbd)
    saveTyres(massivionbd)
}