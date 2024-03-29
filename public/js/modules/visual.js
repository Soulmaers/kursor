import { objColor, generT, generDav } from './content.js'
import { loadParamsView } from './paramsTyresView.js'
import { findTyresInstall } from './saveBaseId.js'
import { reqProtectorBase } from './protector.js'
import { kranParams } from './strelaKran.js'
import { Tooltip } from '../class/Tooltip.js'
import { removeElem, clearElem } from './helpersFunc.js'
import { convert } from './helpersFunc.js'
import { timeIntervalStatistiks } from './detalisation.js'
import { CreateMarkersEvent } from './objectMainModules/class/CreateMarkersEvent.js'
//import { grafClick } from './ClickObject.js'
import { alarmFind } from './alarmStorage.js'
let time;
let timeIcon;
let createEvent;
let controller;


export async function visual(el) {
    console.log('визуал')
    const calendarTrack = document.querySelector('.calendar_track')
    const calendarGraf = document.querySelector('.calendar_graf')
    calendarTrack.style.display = 'none'
    calendarGraf.style.display = 'none'
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
    const alarm = document.querySelector('.wrap_alarm')
    new Tooltip(alarm, ['События по давлению'])
    wrapperUp.style.display = 'flex'
    wrapperCont.style.display = 'flex'
    if (titleCar) {
        titleCar.textContent = el.children[0].textContent
    }

    const idw = el.id
    if (createEvent && createEvent.updateInterval) {
        clearInterval(createEvent.updateInterval);
        createEvent.hiddenTrackAndMarkersEnent()
    }
    if (!createEvent) {
        createEvent = new CreateMarkersEvent(idw);
    } else {
        createEvent.reinitialize(idw);
    }
    if (controller && !controller.signal.aborted) {
        controller.abort()
    }
    controller = new AbortController();
    const signal = controller.signal;
    liCreate()
    await loadParamsView(signal)
    const graf = document.querySelector('.activGraf')
    if (graf) {
        console.log('график')
        grafClick.controllerMethodCharts();
    }
    timeIntervalStatistiks(signal);
    // findTyresInstall()
    btnsens.forEach(el => {
        el.classList.remove('actBTN')
    })
    kranParams()
    setInterval(kranParams, 300000)
    alarmFind()
    const btnShina = document.querySelectorAll('.modals')
    console.log(btnShina)
    if (btnShina[1].classList.contains('active')) {
        styleShinaActive(btnShina[1])
    }
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
    console.log('кликер!!!!')
    const tarir = document.querySelector('.tarir')
    tarir.style.display = 'none'
    const statusObj = document.querySelector('.status_obj')
    clearElem(statusObj.textContent)
    statusObj.style.color = 'gray'
    const wrapperUp = document.querySelector('.wrapper_up')
    const techInfo = document.querySelector('.techInfo')
    const modalCenterOs = document.querySelector('.modalCenterOs')
    const alarmStorage = document.querySelector('.alarmStorage')
    const contKran = document.querySelector('.contKran')
    contKran.style.display = 'none'
    const card = document.querySelectorAll('.cardClick')
    card.forEach(el => {
        el.classList.remove('acto')
    })
    const newBoad = document.querySelector('.speed')
    if (newBoad) {
        removeElem(newBoad)
    }
    alarmStorage.style.display = 'none'
    techInfo.style.display = 'none'
    modalCenterOs.style.display = 'none'
    wrapperUp.style.display = 'none'
    e.classList.remove('color')
    const tr = document.querySelectorAll('.tr')
    tr.forEach(it => {
        removeElem(it)
    })
}


//создаем список под параметры
export function liCreate() {
    const obo = document.querySelector('.obo')
    const count = 250;
    for (let i = 0; i < count; i++) {
        let li = document.createElement('li');
        li.className = "msg";
        obo.append(li);
    }
}
export function view(arg) {
    const msg = document.querySelectorAll('.msg')
    console.log(msg)
    arg.forEach((el, index) => {
        msg[index].textContent = `${el.params}:${el.value !== null ? el.value : '-'}`
    })
}
export function viewConfigurator(arg, params, osi) {
    const role = document.querySelector('.role').getAttribute('rel')
    const active = document.querySelector('.color')
    console.log(params)
    console.log(arg)
    if (params) {
        const parametrs = convert(params)
        const tiresLink = document.querySelectorAll('.tires_link_test')
        let engine = arg.find(element => element.params === 'engine');
        engine = engine ? engine.value : 0
        parametrs.forEach(item => {
            const pressure = arg.find(element => element.params === item.pressure);
            const temp = arg.find(element => element.params === item.temp);
            const element = osi.find(element => element.idOs === item.osNumber);
            const tireLink = Array.from(tiresLink).find(e => e.id == item.tyresdiv);
            if (pressure && tireLink) {
                //   const done = active.id === '26702383' ? parseFloat((pressure.value / 10).toFixed(1)) : pressure.value !== null ? parseFloat(pressure.value) : '-';
                const done = pressure.value !== null ? parseFloat(pressure.value) : '-';
                const signal = element ? objColor[generDav(done, element)] : null;
                tireLink.children[0].style.position = 'relative';
                tireLink.children[0].style.border = 'none';
                tireLink.children[0].style.borderRadius = '30% 30% 0 0';
                tireLink.children[0].innerHTML = `${done}\n<div class="span_bar">Bar</div>`;
                tireLink.children[0].setAttribute('rel', `${item.pressure}`);
                const spanBar = tireLink.querySelector('.span_bar');
                spanBar.style.position = 'absolute';
                spanBar.style.bottom = 0;

                const backgroundStyle = engine === '0' ? 'none' : pressure.status === 'false' ? 'lightgray' : 'none'
                const colorStyle = engine === '0' ? 'lightgray' : pressure.status === 'false' ? '#000' : signal
                const borderStyle = signal === '#FF0000' ? `1px solid ${signal}` : '1px solid #fff';

                tireLink.children[0].style.background = backgroundStyle;
                tireLink.children[0].style.color = colorStyle;
                tireLink.parentElement.style.border = borderStyle;

                if (signal === '#FF0000') {
                    tireLink.parentElement.style.borderRadius = '15px';
                }
                if (temp) {
                    const backgroundStyleTemp = engine === '0' ? 'none' : temp.status === 'false' ? 'lightgray' : 'none'
                    const colorStyleTemp = engine === '0' ? 'lightgray' : temp.status === 'false' ? '#000' : objColor[generT(parseFloat(temp.value))];
                    tireLink.children[1].style.background = backgroundStyleTemp;
                    tireLink.children[1].style.color = colorStyleTemp;
                    tireLink.children[1].style.borderRadius = ' 0 0 30% 30%';
                    switch (temp.value) {
                        case '-128':
                        case '-50':
                        case '-51':
                            tireLink.children[1].style.color = 'red';
                            tireLink.children[1].textContent = 'err';
                            break;
                        case null:
                            tireLink.children[1].textContent = '-' + '°C';
                            tireLink.children[1].setAttribute('rel', `${item.temp}`);
                            break;
                        default:
                            tireLink.children[1].textContent = temp.value + '°C';
                            tireLink.children[1].setAttribute('rel', `${item.temp}`);
                    }
                    const nowTime = new Date();
                    const nowDate = Math.floor(nowTime.getTime() / 1000);
                    const timeStor = pressure.data ? getHoursDiff(parseInt(pressure.data), nowDate) : '-'
                    if (role === 'Администратор') {
                        new Tooltip(tireLink, [pressure.sens + '(' + pressure.params + ')', temp.sens + '(' + temp.params + ')', 'Актуальность данных:' + timeStor]);
                    }
                    else {
                        new Tooltip(tireLink, [pressure.sens, pressure.temp, 'Актуальность данных:' + timeStor]);
                    }
                }
            }

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
    // const ogon = document.querySelector('.ogon')
    //  ogon.style.display = 'none'
    const alarmCheck = document.querySelectorAll('.alarmCheck')
    console.log(alarmCheck)
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
    //arg.style.fontSize = '0.65rem'
    tyresD.forEach(e => {
        e.style.Border = 'none'
    })
    tyresT.forEach(e => {
        e.style.borderTop = 'none'
        e.style.fontSize = '0.8rem'
        e.style.justifyContent = 'flex-start'
    })
}

