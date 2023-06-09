import { text, objColor, generT, generDav } from './content.js'
import { viewMenuParams, loadParamsView } from './paramsTyresView.js'
import { findTyresInstall } from './saveBaseId.js'
import { geoloc, iconParams } from './wialon.js'
import { protekGrafTwo, protekGrafThree, protekGrafFour, protekGrafFree } from './canvas.js'
import { alarmFind } from './alarmStorage.js'

import { reqProtectorBase } from './protector.js'
import { kranParams } from './strelaKran.js'
import { iconFind, iconFindWindows } from './configIcons.js'
import { tarirView } from './staticObject.js'
import { tooltip } from './cursorTooltip.js'
import { ggg } from './menu.js'
import { Tooltip } from '../class/Tooltip.js'
import { click } from './graf.js'
import { removeElem, clearElem } from './helpersFunc.js'
import { convert } from './helpersFunc.js'


let start;
let time;
let timeIcon;
export async function visual(el) {
    const msg = document.querySelectorAll('.msg')
    console.log(msg)
    if (msg) {
        msg.forEach(e => {
            e.remove();
        })
    }
    const checkConfig = document.getElementById('check_Title')
    checkConfig.checked = false
    const containerAlt = document.querySelector('.containerAlt')
    if (containerAlt) {
        containerAlt.remove()
    }
    const containerAltOne = document.querySelector('.containerAltOne')
    if (containerAltOne) {
        containerAltOne.remove()
    }
    const disketa = document.querySelector('.disketa')
    disketa.style.display = 'none'
    const korzina = document.querySelector('.korzina')
    korzina.style.display = 'none'
    const tarir = document.querySelector('.tarir')
    if (el.children[0].textContent === 'Цистерна ДТ') {
        tarir.style.display = 'block'
    }
    const tiresLink = document.querySelectorAll('.tires_link')
    const sensors = document.querySelector('.sensors')
    sensors.style.display = 'none';
    clearInterval(time)
    clearInterval(timeIcon)
    const wrapperUp = document.querySelector('.wrapper_up')
    const speedGraf = document.querySelector('.speedGraf')
    const wrapperCont = document.querySelector('.wrapper_containt')
    const wrapperLeft = document.querySelector('.wrapper_left')
    const titleCar = document.querySelector('.title_two')
    const btnsens = document.querySelectorAll('.btnsens')
    const main = document.querySelector('.main')
    const plug = document.querySelectorAll('.plug')
    const grafics = document.querySelector('.grafics')
    const delIcon = document.querySelectorAll('.delIcon')
    delIcon.forEach(el => {
        el.classList.remove('del')
        el.style.display = 'none'
    })
    const tableTarir = document.querySelector('.tableTarir')
    tableTarir.style.display = 'none'
    tiresLink.forEach(e => {
        if (e.classList.contains('tiresActiv')) {
            grafics.style.display = 'flex'
        }
    })
    if (plug[2].classList.contains('activGraf')) {
        wrapperLeft.style.display = 'none'
        grafics.style.display = 'flex'
    }
    else {
        wrapperLeft.style.display = 'block'
    }
    alarmClear();
    wrapperUp.style.display = 'flex'
    wrapperCont.style.display = 'flex'
    speedGraf.style.display = 'block'
    el.classList.add('color')
    if (titleCar) {
        titleCar.textContent = el.children[0].textContent
    }

    loadParamsView()
    findTyresInstall()
    liCreate()
    const idw = el.id
    iconFind(idw)
    iconFindWindows(idw)
    btnsens.forEach(el => {
        el.classList.remove('actBTN')
    })
    kranParams()
    setInterval(kranParams, 300000)
    if (!start || start !== el) {
        start = el;
        geoloc()
        time = setInterval(geoloc, 300000) //отрисовываем карту osm
    }
    alarmFind()
    iconParams()
    tarirView();
    setInterval(tarirView, 300000)
    tooltip()
    const grafOld = document.querySelector('.infoGraf')
    if (grafOld) {
        removeElem(grafOld)
    }
    const btnShina = document.querySelectorAll('.modals')
    console.log(btnShina)
    if (btnShina[1].classList.contains('active')) {
        styleShinaActive(btnShina[1])
    }
    const preloaderGraf = document.querySelector('.loader') /* находим блок Preloader */
    preloaderGraf.style.opacity = 1;
    preloaderGraf.style.display = 'flex'
    setTimeout(click, 700)
    const zamer = document.querySelectorAll('.zamer')
    const createList = document.querySelector('.createList')
    clearElem(createList.value)
    if (zamer) {
        zamer.forEach(e => {
            removeElem(e)
        })
    }
    const probegElem = document.querySelector('.odom_value')
    const starterValue = document.querySelector('.akb_value1')
    const ohlValue = document.querySelector('.ohl_value')
    const oilValue = document.querySelector('.oil_value1')
    const toil_value = document.querySelector('.toil_value')
    const ign_value = document.querySelector('.ign_value')
    const oborotValue = document.querySelector('.oborot_value')
    const motoValue = document.querySelector('.moto_value')
    motoValue.textContent = ''
    toil_value.textContent = ''
    starterValue.textContent = ''
    probegElem.textContent = ''
    ohlValue.textContent = ''
    oilValue.textContent = ''
    ign_value.textContent = ''
    oborotValue.textContent = ''
}
export function visualNone(e) {
    const tarir = document.querySelector('.tarir')
    tarir.style.display = 'none'
    const statusObj = document.querySelector('.status_obj')
    clearElem(statusObj.textContent)
    statusObj.style.color = 'gray'
    const wrapperUp = document.querySelector('.wrapper_up')
    const speedGraf = document.querySelector('.speedGraf')
    const techInfo = document.querySelector('.techInfo')
    const modalCenterOs = document.querySelector('.modalCenterOs')
    const plus = document.querySelector('.plus')
    const minus = document.querySelector('.minus')
    const alarmStorage = document.querySelector('.alarmStorage')
    const clearConfirmWin = document.querySelector('.clearConfirmWin')
    clearConfirmWin.style.display = 'none'
    const contKran = document.querySelector('.contKran')
    contKran.style.display = 'none'
    const card = document.querySelectorAll('.cardClick')
    card.forEach(el => {
        el.classList.remove('acto')
    })
    const valueStatic = document.querySelectorAll('.valueStatic')
    valueStatic.forEach(el => {
        clearElem(el.textContent)
        clearElem(el.previousElementSibling.value)
        el.classList.remove('actoStatic')
    })
    const newBoad = document.querySelector('.speed')
    if (newBoad) {
        removeElem(newBoad)
    }
    plus.style.display = 'block'
    minus.style.display = 'none'
    alarmStorage.style.display = 'none'
    techInfo.style.display = 'none'
    modalCenterOs.style.display = 'none'
    wrapperUp.style.display = 'none'
    speedGraf.style.display = 'none'
    e.classList.remove('color')
    const tr = document.querySelectorAll('.tr')
    tr.forEach(it => {
        removeElem(it)
    })
}
//стираем выбранные значения графика скорости
export function clearGraf() {
    const selectSpeed = document.querySelector('.select_speed')
    const inputDate = document.querySelectorAll('.input_date')
    selectSpeed.value = 0;
    inputDate.forEach(e => {
        clearElem(e.value)
    })
}
//создаем список под параметры
export function liCreate() {
    const obo = document.querySelector('.obo')
    const count = 150;
    for (let i = 0; i < count; i++) {
        let li = document.createElement('li');
        li.className = "msg";
        obo.append(li);
    }
}
export function view(arg) {
    const msg = document.querySelectorAll('.msg')
    arg.forEach((el, index) => {
        msg[index].textContent = `${el.name}:${el.value}`
    })
}
export async function viewConfigurator(arg, params, osi) {
    const role = document.querySelectorAll('.log')[0].textContent
    const active = document.querySelectorAll('.color')
    const allobj = await ggg(active[0].id)
    if (params) {
        const parametrs = convert(params)
        const alerts = [];
        const tiresLink = document.querySelectorAll('.tires_link_test')
        let activePost;
        if (active[0] == undefined) {
            const listItem = document.querySelectorAll('.listItem')[0]
            activePost = listItem.textContent.replace(/\s+/g, '')
        }
        else {
            activePost = active[0].textContent.replace(/\s+/g, '')
        }
        const par = [];
        arg.forEach(el => {
            par.push(el.name)
        })
        parametrs.forEach(item => {
            let signal;
            let done;
            tiresLink.forEach(e => {
                if (e.id == item.tyresdiv) {
                    arg.forEach((el) => {
                        if (el.name === item.pressure) {

                            if (activePost === 'А652УА198') {
                                done = parseFloat((el.value / 10).toFixed(1))
                            }
                            else {
                                done = parseFloat(el.value)
                            }
                            alerts.push(done)
                            e.children[0].style.position = 'relative'
                            e.children[0].style.border = 'none'
                            e.children[0].style.borderRadius = '30% 30% 0 0'
                            e.children[0].innerHTML = `${done}\n<div class="ppp">Bar</div>`
                            e.children[0].setAttribute('rel', `${item.pressure}`)
                            const ppp = document.querySelectorAll('.ppp')
                            ppp.forEach(el => {
                                el.style.position = 'absolute'
                                el.style.bottom = 0
                            })
                            if (role === 'Администратор') {
                                new Tooltip(e, [allobj[item.pressure] + '(' + item.pressure + ')', allobj[item.temp] + '(' + item.temp + ')']);
                            }
                            else {
                                new Tooltip(e, [allobj[item.pressure], allobj[item.temp]]);
                            }
                            osi.forEach(element => {
                                if (element.idOs == item.osNumber) {
                                    signal = objColor[generDav(done, element)]
                                }
                            })
                            if (el.status === 'false') {
                                e.children[0].style.background = 'lightgray';
                                e.children[0].style.color = '#000'
                                return
                            }
                            e.children[0].style.color = signal;
                            if (signal === '#FF0000') {
                                e.parentElement.style.border = `1px solid ${signal}`;
                                e.parentElement.style.borderRadius = '15px'
                            }
                            else {
                                e.parentElement.style.border = '1px solid #fff';
                            }
                        }
                        if (el.name === item.temp) {

                            tiresLink.forEach(e => {
                                if (e.id == item.tyresdiv) {
                                    if (el.value === '-128' || el.value === '-50' || el.value === '-51') {
                                        el.value = 'err'
                                        e.children[1].style.color = 'red'
                                        e.children[1].textContent = el.value
                                        e.children[1].style.border = 'none'
                                        e.children[1].style.borderRadius = '0 0 30% 30%'
                                        if (el.status === 'false') {
                                            e.children[1].style.background = 'lightgray';
                                            e.children[0].style.color = '#000'
                                            e.children[1].style.border = 'none'
                                            e.children[1].style.borderRadius = '0 0 30% 30%'
                                        }
                                    }
                                    if (el.value >= -51 && el.value <= 70) {
                                        e.children[1].style.border = 'none'
                                        e.children[1].textContent = el.value + '°C'
                                        e.children[1].setAttribute('rel', `${item.temp}`)
                                        if (el.status === 'false') {
                                            e.children[1].style.background = 'lightgray';
                                            e.children[1].style.border = 'none'
                                            e.children[1].style.borderRadius = '0 0 30% 30%'
                                            e.children[1].style.color = '#000'
                                            return
                                        }
                                        e.children[1].style.color = objColor[generT(el.value)];
                                    }
                                }
                            })
                        }
                    })
                }
            })
        })
    }
}
export function alarmClear() {
    const ogon = document.querySelector('.ogon')
    ogon.style.display = 'none'
    const alarmCheck = document.querySelectorAll('.alarmCheck')
    alarmCheck.forEach(e => {
        e.style.borderTopLeftRadius = 'none'
        e.style.border = 'none'
    })
}

function styleShinaActive(arg) {
    console.log('бтншина')
    reqProtectorBase()
    const tyresD = document.querySelectorAll('.tiresD')
    const tyresT = document.querySelectorAll('.tiresT')
    const main = document.querySelector('.main')
    main.style.display = 'flex'
    arg.style.fontSize = '0.65rem'
    tyresD.forEach(e => {
        e.style.Border = 'none'
    })
    tyresT.forEach(e => {
        e.style.borderTop = 'none'
        e.style.fontSize = '0.8rem'
        e.style.justifyContent = 'flex-start'
    })
}


export function viewDinamic(arr, maxProtector) {
    const conts = document.querySelectorAll('.contBar2')
    conts.forEach(el => {
        el.style.display = 'none'
    })
    const arrAll = [];
    arr.forEach(el => {
        arrAll.push(el * 10)
    })
    const mm = parseFloat(maxProtector * 10)
    let y1;
    let y2;
    let y3;
    let y4;
    if (arr.length === 0) {
        conts.forEach(e => {
            e.style.display = 'block'
            e.style.width = '116px'
        })
        protekGrafFree()
    }
    if (arrAll.length == 2) {
        if (mm <= 120) {
            y1 = (mm - arrAll[0]) / 2
            y2 = (mm - arrAll[1]) / 2
        }
        if (mm > 120 && mm <= 180) {
            y1 = (mm - arrAll[0]) / 3
            y2 = (mm - arrAll[1]) / 3
        }
        if (mm > 180) {
            y1 = (mm - arrAll[0]) / 4
            y2 = (mm - arrAll[1]) / 4
        }
        conts[0].style.display = 'block'
        conts[0].style.width = '348px'
        protekGrafTwo(y1, y2, arr, mm)
    }
    if (arrAll.length == 3) {
        if (mm <= 120) {
            y1 = (mm - arrAll[0]) / 2
            y2 = (mm - arrAll[1]) / 2
            y3 = (mm - arrAll[2]) / 2
        }
        if (mm > 120 && mm <= 180) {
            y1 = (mm - arrAll[0]) / 3
            y2 = (mm - arrAll[1]) / 3
            y3 = (mm - arrAll[2]) / 3
        }
        if (mm > 180) {
            y1 = (mm - arrAll[0]) / 4
            y2 = (mm - arrAll[1]) / 4
            y3 = (mm - arrAll[2]) / 4
        }
        conts[0].style.display = 'block'
        conts[1].style.display = 'block'
        conts[0].style.width = '174px'
        conts[1].style.width = '174px'
        protekGrafThree(y1, y2, y3, arr, mm)
    }
    if (arrAll.length === 4) {
        conts.forEach(e => {
            e.style.display = 'block'
            e.style.width = '116px'
        })
        if (mm <= 120) {
            y1 = (mm - arrAll[0]) / 2
            y2 = (mm - arrAll[1]) / 2
            y3 = (mm - arrAll[2]) / 2
            y4 = (mm - arrAll[3]) / 2
        }
        if (mm > 120 && mm <= 180) {
            y1 = (mm - arrAll[0]) / 3
            y2 = (mm - arrAll[1]) / 3
            y3 = (mm - arrAll[2]) / 3
            y4 = (mm - arrAll[3]) / 3
        }
        if (mm > 180) {
            y1 = (mm - arrAll[0]) / 4
            y2 = (mm - arrAll[1]) / 4
            y3 = (mm - arrAll[2]) / 4
            y4 = (mm - arrAll[3]) / 4
        }
        protekGrafFour(y1, y2, y3, y4, arr, mm)
    }
}

