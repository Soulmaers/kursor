
import { Tooltip } from '../class/Tooltip.js'
const login = document.querySelectorAll('.log')[1].textContent


let intervalId
export async function iconParams() {
    clearInterval(intervalId)
    const active = document.querySelectorAll('.color')
    const idw = document.querySelector('.color').id
    console.log(login)
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ idw, login }))
    }
    const resParams = await fetch('/api/parametrs', param)
    const resultParams = await resParams.json()
    const speed = (resultParams.item.pos.s).toFixed(0);
    const strateValue = document.querySelector('.speed_value')
    strateValue.textContent = speed
    const resSensor = await fetch('/api/sensorsName', param)
    const resultSensor = await resSensor.json()
    const nameSens = Object.entries(resultSensor.item.sens)
    const arrNameSens = [];
    nameSens.forEach(el => {
        arrNameSens.push([el[1].n, el[1].p])
    })
    const res = await fetch('/api/lastSensors', param)
    const results = await res.json()
    if (results) {
        const valueSens = [];
        Object.entries(results).forEach(e => {
            valueSens.push(e[1])
        })
        const allArr = [];
        arrNameSens.forEach((e, index) => {
            allArr.push([...e, valueSens[index]])
        })
        let power;
        let sats;

        if (resultParams.item.lmsg) {
            power = resultParams.item.lmsg.p.pwr_ext.toFixed(1)
            sats = resultParams.item.lmsg.p.sats
        }
        let count = 0;
        let oborot = 0;
        const tsi_card = document.querySelector('.tsi_card')
        const ign_card = document.querySelector('.ign_card')
        allArr.forEach(async it => {
            if (it.includes('Зажигание')) {
                count++
                let status;
                let statusTSI;
                const ignValue = document.querySelector('.ign_value')
                const tsiValue = document.querySelector('.tsi_value')
                it[2] === 1 ? status = 'ВКЛ' : status = 'ВЫКЛ'
                if (it[2] === 1 && power >= 26.5) {
                    statusTSI = 'ВКЛ'
                }
                else {
                    statusTSI = 'ВЫКЛ'
                }
                const statusObj = document.querySelector('.status_obj')
                let mess;
                if (document.querySelector('.color').children[0] && document.querySelector('.color').children[0].textContent.startsWith('Цист')) {
                    if (sats > 4 && it[2] === 1) {
                        statusObj.textContent = 'Online'
                        statusObj.style.color = '#15a32d'
                        mess = `Установлена связь с ${sats} спутниками`
                        new Tooltip(statusObj, [mess]);
                    }
                    else if (sats <= 4 || it[2] !== 1) {
                        if (sats <= 4 && it[2] === 1) {
                            mess = 'Не установлена связь со спутниками'
                        }
                        else if (sats > 4 && it[2] !== 1) {
                            mess = 'Зажигание выключено'
                        }
                        else if (sats <= 4 && it[2] !== 1) {
                            mess = 'Зажигание выключено, Не установлена связь со спутниками'
                        }
                        statusObj.textContent = 'Offline'
                        new Tooltip(statusObj, [mess]);
                    }
                }
                else {
                    if (sats <= 4 || statusTSI === 'ВЫКЛ') {
                        if (sats <= 4 && statusTSI === 'ВКЛ') {
                            mess = 'Не установлена связь со спутниками'
                        }
                        else if (sats > 4 && statusTSI === 'ВЫКЛ') {
                            mess = 'Двигатель выключен'
                        }
                        else if (sats <= 4 && statusTSI === 'ВЫКЛ') {
                            mess = 'Двигатель выключен, Не установлена связь со спутниками'
                        }
                        statusObj.textContent = 'Offline'
                        new Tooltip(statusObj, [mess]);
                    }
                    else if (sats > 3 || statusTSI === 'ВКЛ') {
                        statusObj.textContent = 'Online'
                        statusObj.style.color = '#15a32d'
                        mess = `Установлена связь с ${sats} спутниками`
                        new Tooltip(statusObj, [mess]);
                    }
                }
                const idw = active[0].id
                const activePost = active[0].children[0].textContent.replace(/\s+/g, '')
                const currentDate = new Date();
                const todays = Math.floor(currentDate.getTime() / 1000);
                const param = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: (JSON.stringify({ activePost, idw, todays, statusTSI, todays, status }))
                }
                const res = await fetch('/api/saveStatus', param)
                const response = await res.json()
                const parama = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: (JSON.stringify({ idw }))
                }
                const vals = await fetch('/api/viewStatus', parama)
                const val = await vals.json()
                console.log(val)
                const startDate = val.result[0].time
                const startDateIng = val.result[0].timeIng
                const techdate = new Date();
                const nowDate = Math.floor(techdate.getTime() / 1000);
                const timeStor = getHoursDiff(startDate, nowDate)
                const timeStorIng = getHoursDiff(startDateIng, nowDate)
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
                    console.log(mess)
                    return mess;
                }
                let statName;
                let statNameIng;
                val.result[0].status === 'ВКЛ' ? statName = 'Включен' : statName = 'Выключен'
                val.result[0].statusIng === 'ВКЛ' ? statNameIng = 'Включено' : statNameIng = 'Выключено'
                tsiValue.textContent = val.result[0].status
                ignValue.textContent = val.result[0].statusIng
                const message = `${statName} ${timeStor}`
                const messageIng = `${statNameIng} ${timeStorIng}`
                console.log([tsi_card.getAttribute('rel'), message])

                new Tooltip(tsi_card, [tsi_card.getAttribute('rel'), message]);
                new Tooltip(ign_card, [ign_card.getAttribute('rel'), messageIng]);
                return
            }
            if (it.includes('Обороты двигателя')) {
                oborot++
                if (it[2] === -348201.3876) {
                    const oborotValue = document.querySelector('.oborot_value')
                    oborotValue.textContent = '------'
                }
                else {
                    const oborotValue = document.querySelector('.oborot_value')
                    oborotValue.textContent = it[2].toFixed(0)
                }
                return
            }
            if (count === 0) {
                const ignValue = document.querySelector('.ign_value')
                const tsiValue = document.querySelector('.tsi_value')
                ignValue.textContent = '------'
                tsiValue.textContent = '------'
            }
            if (oborot === 0) {
                const oborotValue = document.querySelector('.oborot_value')
                oborotValue.textContent = '------'
            }
        })
    }

}
intervalId = setInterval(iconParams, 60000)
async function fnWialon(id) {
    const params = {
        "id": id,
        "flags": 1025
    }
    return new Promise(function (resolve, reject) {
        const remote1 = wialon.core.Remote.getInstance();
        remote1.remoteCall('core/search_item', params,
            async function (code, result) {
                if (code) {
                    console.log(wialon.core.Errors.getErrorText(code));
                }
                if (result) {
                    const res = result.item.lmsg.p.pwr_ext.toFixed(1)
                    resolve(res)
                }
            })
    })
}

function addZero(digits_length, source) {
    let text = source + '';
    while (text.length < digits_length)
        text = '0' + text;
    return text;
}



export async function toView(toChange, probeg) {
    const active = document.querySelector('.color')
    const activePost = active.textContent.replace(/\s+/g, '')
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ activePost }))
    }
    const resV = await fetch('/api/toView', params)
    const responseV = await resV.json()
    if (responseV.result.length !== 0) {
        toChange = parseFloat(responseV.result[0].value)
        const toElem = document.querySelector('.to_value')
        const toChangeTO = document.querySelector('.toValChange')
        const to = parseFloat((toChange + probeg) - probeg)
        toElem.textContent = to + 'км'
        toChangeTO.value = toChange
    }
}

