import { objColor, generT, generDav } from './content.js'
import { loadParamsView } from './paramsTyresView.js'
import { findTyresInstall } from './saveBaseId.js'
import { iconParams } from './status.js'
import { alarmFind } from './alarmStorage.js'
import { reqProtectorBase } from './protector.js'
import { kranParams } from './strelaKran.js'
import { iconFind } from './configIcons.js'
import { tarirView } from './staticObject.js'
import { tooltip } from './cursorTooltip.js'
import { ggg } from './menu.js'
import { gg } from './spisok.js'
import { Tooltip } from '../class/Tooltip.js'
import { click } from './graf.js'
import { removeElem, clearElem } from './helpersFunc.js'
import { convert } from './helpersFunc.js'
import { timeIntervalStatistiks } from './detalisation.js'
import { Flash } from '../class/Flash.js'
import { CreateMarkersEvent } from './objectMainModules/class/CreateMarkersEvent.js'
let start;
let time;
let timeIcon;
let createEvent;
export async function visual(el) {
    const tablo = document.querySelector('.tablo')
    tablo ? tablo.classList.remove('tablo') : null
    const allsec = document.querySelectorAll('.allsec')
    allsec.forEach(el => {
        el.style.display = 'none';
    })
    const color = document.querySelector('.color')
    color ? color.classList.remove('color') : null
    console.log(el)
    const main = document.querySelector('.main')
    const choice = document.querySelector('.choice')
    choice ? choice.classList.remove('choice') : null
    const trEventLogs = document.querySelectorAll('.trEvent')
    trEventLogs.forEach(e => e.style.display = 'flex')
    const widthWind = document.querySelector('body').offsetWidth;
    const jobTSDetalisationGraf = document.querySelector('.jobTSDetalisationGraf');
    if (jobTSDetalisationGraf) jobTSDetalisationGraf.remove()
    const jobTSDetalisationChartsLegenda = document.querySelector('.jobTSDetalisationCharts_legenda');
    if (jobTSDetalisationChartsLegenda) jobTSDetalisationChartsLegenda.remove()
    const acto = document.querySelector('.acto')
    if (acto) {
        acto.classList.remove('acto');
    }
    const tsiControll = document.querySelector('.tsiControll')
    tsiControll.value = '';
    el.classList.add('color')
    /* trEventLogs.forEach(item => {
         item.getAttribute('rel') !== el.id ? item.style.display = 'none' : null
     })*/
    const msg = document.querySelectorAll('.msg')
    if (msg) {
        msg.forEach(e => {
            e.remove();
        })
    }
    const wrapMap = document.querySelector('.wrapMap')
    if (wrapMap) {
        wrapMap.remove();
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

    const selectType = document.querySelector('.select_type')
    selectType.style.display = 'none'
    const starts = document.querySelector('.start')
    starts.style.display = 'none'
    const checkConfig = document.getElementById('check_Title')
    checkConfig.checked = false
    const checkAlt = document.querySelector('.checkAlt')
    checkAlt.style.color = 'black'
    checkAlt.style.fontWeight = '400'
    const containerAlt = document.querySelector('.containerAlt')
    if (containerAlt) {
        console.log('удаляем')
        containerAlt.remove()
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
    const plug = document.querySelectorAll('.plug')
    const grafics = document.querySelector('.grafics')
    const delIcon = document.querySelectorAll('.delIcon')
    main.style.display = 'flex'
    const startss = document.querySelector('.start')
    startss.style.display = 'none';
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
        if (widthWind < 860) {
            wrapperLeft.style.display = 'none'
        }
        else {
            wrapperLeft.style.display = 'block'
        }

    }
    alarmClear();
    wrapperUp.style.display = 'flex'
    wrapperCont.style.display = 'flex'
    speedGraf.style.display = 'block'

    if (titleCar) {
        titleCar.textContent = el.children[0].textContent
    }
    const graf = document.querySelector('.activGraf')
    console.log(graf)
    if (graf) {
        console.log('клик')
        setTimeout(click, 700)
    }
    if (!graf) {
        console.log(document.querySelector('.color'))
        //  geoloc()
        //   time = setInterval(geoloc, 300000)
    }
    const idw = el.id
    if (createEvent && createEvent.updateInterval) {
        clearInterval(createEvent.updateInterval);
    }
    if (createEvent && createEvent.markerCreator) {
        createEvent.markerCreator.deleteMarkers();
    }
    createEvent = new CreateMarkersEvent(idw)
    createEvent.init()

    timeIntervalStatistiks();
    liCreate()
    await loadParamsView()
    console.log('загрузка')
    tooltip()
    await iconFind(idw)
    await iconParams()
    await alarmFind()

    findTyresInstall()
    btnsens.forEach(el => {
        el.classList.remove('actBTN')
    })
    kranParams()
    setInterval(kranParams, 300000)
    tarirView();
    setInterval(tarirView, 300000)

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

    const zamer = document.querySelectorAll('.zamer')
    const createList = document.querySelector('.createList')
    clearElem(createList.value)
    if (zamer) {
        zamer.forEach(e => {
            removeElem(e)
        })
    }

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
export async function liCreate() {
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
    const active = document.querySelector('.color')
    const allobj = await ggg(active.id)
    const res = await gg(active.id)

    let in1;
    res.forEach(i => {
        if (i[0] === 'Зажигание') {
            in1 = i[2]
        }
    })
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
                            if (active.id === '26702383') {
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
                            const nowTime = new Date()
                            const nowDate = Math.floor(nowTime.getTime() / 1000);
                            const oldDate = Math.floor(new Date(el.time).getTime() / 1000);
                            const timeStor = getHoursDiff(oldDate, nowDate)
                            if (role === 'Администратор') {
                                new Tooltip(e, [allobj[item.pressure] + '(' + item.pressure + ')', allobj[item.temp] + '(' + item.temp + ')', 'Актуальность данных:' + timeStor]);
                            }
                            else {
                                new Tooltip(e, [allobj[item.pressure], allobj[item.temp], 'Актуальность данных:' + timeStor]);
                            }
                            osi.forEach(element => {
                                if (element.idOs == item.osNumber) {
                                    signal = objColor[generDav(done, element)]
                                }
                            })
                            const ign = document.querySelector('.ign_value').textContent
                            if (el.status === 'false' && in1 === 1) {
                                e.children[0].style.background = 'lightgray';
                                e.children[0].style.color = '#000'
                                return
                            }
                            if (in1 === 0) {
                                e.children[0].style.color = 'lightgray'
                                return
                            }
                            e.children[0].style.background = 'none'
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
                                        const ign = document.querySelector('.ign_value').textContent
                                        if (el.status === 'false' && in1 === 1) {
                                            e.children[1].style.background = 'lightgray';
                                            e.children[1].style.color = '#000'
                                            e.children[1].style.border = 'none'
                                            e.children[1].style.borderRadius = '0 0 30% 30%'
                                            return
                                        }
                                        if (in1 === 0) {
                                            //  e.children[0].style.background = 'lightgray';
                                            e.children[1].style.color = 'lightgray'
                                            return
                                        }
                                    }
                                    if (el.value >= -51 && el.value <= 70 || el.value === 'err') {
                                        e.children[1].style.border = 'none'
                                        e.children[1].textContent = el.value !== 'err' ? el.value + '°C' : 'err'
                                        e.children[1].setAttribute('rel', `${item.temp}`)
                                        if (el.status === 'false' && in1 === 1) {
                                            e.children[1].style.background = 'lightgray';
                                            e.children[1].style.border = 'none'
                                            e.children[1].style.borderRadius = '0 0 30% 30%'
                                            e.children[1].style.color = '#000'
                                            return
                                        }
                                        if (in1 === 0) {
                                            //  e.children[0].style.background = 'lightgray';
                                            e.children[1].style.color = 'lightgray'
                                            return
                                        }
                                        //   e.children[1].style.background = '#000';
                                        e.children[1].style.background = 'none'
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

function getHoursDiff(startDate, nowDate) {
    var diff = nowDate - startDate;
    let dayS;
    let hourS;
    const minutes = Math.floor(diff / 60)
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const day = days % 60;
    const hour = hours % 24;
    const minut = minutes % 60;
    day === 0 ? dayS = '' : dayS = days + 'д ';
    hour === 0 ? hourS = '' : hourS = hour + 'ч ';
    const mess = `${dayS} ${hourS} ${minut} мин`
    return mess;
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

