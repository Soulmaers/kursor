
import { geoPosition } from './requests.js'
import { Tooltip } from '../class/Tooltip.js'
//запрос на wialon за данными по скорости
export function graf(t1, t2, int, id) {
    //console.log(t1, t2, int, id)
    const prms2 = {
        "itemId": id,   //25343786,

        "timeFrom": t1,//t1,//timeFrom,//1657205816,
        "timeTo": t2,//t2,//nowDate,//2757209816,
        "flags": 1,
        "flagsMask": 65281,
        "loadCount": 161000//82710
    }
    const remote2 = wialon.core.Remote.getInstance();
    remote2.remoteCall('messages/load_interval', prms2,
        function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            const arr2 = Object.values(result);
            // console.log(arr2)
            const arrIterTime = [];
            const arrIterTimeDate = [];
            arr2[1].forEach(el => {
                arrIterTime.push(el.t);
            })
            arrIterTime.forEach(item => {
                const dateObj = new Date(item * 1000);
                const utcString = dateObj.toString();
                const arrTimeDate = utcString.slice(8, 24);
                arrIterTimeDate.push(arrTimeDate);
            })
            let t = 0;
            const arrIterTimeDateT = arrIterTimeDate.filter(e => (++t) % int === 0);
            const arrSpee = [];
            arr2[1].forEach(el => {
                arrSpee.push(el.pos.s)
            })
            let s = 0;
            const arrSpeed = arrSpee.filter(e => (++s) % int === 0)
            chrt1(arrSpeed, arrIterTimeDateT);

        });
}

export function geoloc() {
    let nowDate = Math.round(new Date().getTime() / 1000)
    let nDate = new Date();
    let timeFrom = Math.round(nDate.setHours(nDate.getHours() - 12) / 1000);

    const flags = 1 + 1024
    const prms = {
        "spec": {
            "itemsType": "avl_unit",
            "propName": "sys_name",
            "propValueMask": "*",
            "sortType": "sys_name"
        },
        "force": 1,
        "flags": flags,
        "from": 0,
        "to": 0
    };

    const remote1 = wialon.core.Remote.getInstance();
    remote1.remoteCall('core/search_items', prms,
        function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            const arr1 = Object.values(result);
            const arrCar = arr1[5];
            //  console.log(arr1[5])
            const active = document.querySelector('.color')

            //   console.log(act)
            arrCar.forEach(it => {
                const active = document.querySelector('.color')
                const act = active.children[0].textContent
                //  console.log(active)
                if (it.nm === act) {
                    //  console.log(act)
                    const prmsT = {
                        "itemId": it.id,
                        "timeFrom": timeFrom,//1657205816,
                        "timeTo": nowDate,//2757209816,
                        "flags": 1,
                        "flagsMask": 65281,
                        "loadCount": 82710
                    }
                    //   console.log('запуск гео')

                    const remoteT = wialon.core.Remote.getInstance();
                    remoteT.remoteCall('messages/load_interval', prmsT,
                        function (code, result) {
                            if (code) {
                                console.log(wialon.core.Errors.getErrorText(code));
                            }
                            const arr2 = Object.values(result);
                            //  console.log(arr2[1])
                            // console.log(arr2[1][0].pos.x)
                            //  console.log(arr2[1][0].pos.y)
                            const geo = [];
                            const arrIterTimeDate = [];
                            var rows = arr2[1].length;
                            for (var i = 0; i < rows; i++) {
                                geo.push([]);
                            }
                            geo.forEach((el, index) => {
                                el.push(arr2[1][index].pos.y, arr2[1][index].pos.x);
                            })

                            geoPosition(geo);
                        })
                }
            });
        })

}

export function iconParams() {
    // console.log('икон')
    const active = document.querySelectorAll('.color')
    const flags = 1 + 1024
    const prms = {
        "spec": {
            "itemsType": "avl_unit",
            "propName": "sys_name",
            "propValueMask": "*",
            "sortType": "sys_name"
        },
        "force": 1,
        "flags": flags,
        "from": 0,
        "to": 0
    };

    const remote1 = wialon.core.Remote.getInstance();
    remote1.remoteCall('core/search_items', prms,
        function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            const arr1 = Object.values(result);
            const arrCar = arr1[5];
            loadAkb(arrCar);
            const flagss = 4096
            const prmss = {
                'id': active[0].id,
                'flags': flagss
            }
            const remote11 = wialon.core.Remote.getInstance();
            remote11.remoteCall('core/search_item', prmss,
                async function (code, result) {
                    if (code) {
                        console.log(wialon.core.Errors.getErrorText(code));
                    }
                    //  console.log(result)
                    const nameSens = Object.entries(result.item.sens)
                    const arrNameSens = [];

                    nameSens.forEach(el => {
                        arrNameSens.push([el[1].n, el[1].p])
                        //  arrNameSens.push(el[1].p)
                    })
                    // console.log(arrNameSens)
                    const prms = {
                        "unitId":
                            active[0].id,
                        "sensors": []
                    }
                    const remote1 = wialon.core.Remote.getInstance();
                    remote1.remoteCall('unit/calc_last_message', prms,
                        async function (code, result) {
                            if (code) {
                                console.log(wialon.core.Errors.getErrorText(code));
                            }
                            if (result) {
                                //console.log(result)
                                const valueSens = [];
                                Object.entries(result).forEach(e => {
                                    valueSens.push(e[1])
                                })
                                const allArr = [];
                                arrNameSens.forEach((e, index) => {
                                    allArr.push([...e, valueSens[index]])

                                })
                                //  console.log(allArr)
                                // console.log(arrCar)
                                let power;
                                let sats;
                                arrCar.forEach(item => {
                                    //  console.log(item)
                                    if (item.id === Number(active[0].id)) {
                                        //  console.log(item.lmsg.p.pwr_ext)
                                        if (item.lmsg) {
                                            power = item.lmsg.p.pwr_ext.toFixed(1)
                                            sats = item.lmsg.p.sats
                                        }

                                    }
                                })
                                //  const tsi = await fnWialon(active[0].id)
                                //  console.log(power)

                                let count = 0;
                                let oborot = 0;
                                const tsi_card = document.querySelector('.tsi_card')
                                const ign_card = document.querySelector('.ign_card')
                                allArr.forEach(async it => {
                                    // console.log(it)
                                    if (it.includes('Зажигание')) {
                                        count++
                                        let status;
                                        let statusTSI;
                                        const ignValue = document.querySelector('.ign_value')
                                        const tsiValue = document.querySelector('.tsi_value')
                                        it[2] === 1 ? status = 'ВКЛ' : status = 'ВЫКЛ'
                                        //   ignValue.textContent = status
                                        //  console.log(sats)
                                        if (it[2] === 1 && power >= 26.5) {
                                            statusTSI = 'ВКЛ'
                                        }
                                        else {
                                            statusTSI = 'ВЫКЛ'
                                        }
                                        const statusObj = document.querySelector('.status_obj')
                                        let mess;
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
                                            //   console.log('офф')
                                            statusObj.textContent = 'Offline'
                                            new Tooltip(statusObj, [mess]);

                                        }
                                        else if (sats > 3 || statusTSI === 'ВКЛ') {
                                            //  console.log('он')
                                            statusObj.textContent = 'Online'
                                            statusObj.style.color = '#15a32d'
                                            mess = `Установлена связь с ${sats} спутниками`
                                            new Tooltip(statusObj, [mess]);
                                        }


                                        const idw = active[0].id
                                        const activePost = active[0].children[0].textContent.replace(/\s+/g, '')
                                        //    console.log(activePost)
                                        const currentDate = new Date();
                                        const todays = Math.floor(currentDate.getTime() / 1000);
                                        //   console.log(unixTimestamp);
                                        //   console.log(status)
                                        const param = {
                                            method: "POST",
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: (JSON.stringify({ activePost, idw, todays, statusTSI, todays, status }))
                                        }
                                        const res = await fetch('/api/saveStatus', param)
                                        const response = await res.json()
                                        //  console.log(response)
                                        const parama = {
                                            method: "POST",
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: (JSON.stringify({ idw }))
                                        }
                                        const vals = await fetch('/api/viewStatus', parama)
                                        const val = await vals.json()
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
                                        //  const ignValue = document.querySelector('.ign_value')
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
                                        //  new Tooltip(tsi_card, [tsi_card.getAttribute('rel')]);
                                    }
                                    if (oborot === 0) {
                                        const oborotValue = document.querySelector('.oborot_value')
                                        oborotValue.textContent = '------'
                                    }

                                })
                            }

                        });
                })
        });
}
setInterval(iconParams, 60000)





























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
                    //    console.log(result.item.lmsg.p.pwr_ext.toFixed(1))
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

export function loadAkb(arrCar) {
    const active = document.querySelector('.color')
    const act = active.children[0].textContent


    // let akb;
    let probeg;
    let oil;
    let speed;

    arrCar.forEach(it => {
        let toChange = 10000;
        if (it.nm === act) {
            //    akb = (it.lmsg.p.pwr_ext).toFixed(1);
            if (it.lmsg) {
                if (it.lmsg.p.mileage) {
                    probeg = parseFloat((it.lmsg.p.mileage).toFixed(0));
                    const odometr = addZero(8, probeg)
                    //  toView(toChange, probeg)
                }
                console.log(it.pos.s)
                if (it.pos.s || it.pos.s === 0) {
                    console.log(it.pos.s)
                    speed = (it.pos.s).toFixed(0);
                }
                const strateValue = document.querySelector('.speed_value')
                strateValue.textContent = speed
                // iconSpeed(speed)
            }
        }
    })
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

        //  const to = addZero(5, ((toChange + probeg)) - probeg)
        const to = parseFloat((toChange + probeg) - probeg)

        toElem.textContent = to + 'км'
        //  console.log(toChange.value)
        toChangeTO.value = toChange

    }

}

