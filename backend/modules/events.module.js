const wialonService = require('../services/wialon.service');
const databaseService = require('../services/database.service')

const { HelpersDefault } = require('../services/HelpersDefault.js')



class Events {
    constructor(data, sess) {
        this.data = data
        this.sess = sess

        this.objCondition = {
            0: 'Стоянка',
            1: 'Поездка',
            2: 'Остановка'
        }
        this.init()
    }


    init() {
        this.eventFunction()
    }
    eventFunction = async () => {
        const formatData = HelpersDefault.formatFinal(this.data)
        const idwArray = formatData.filter(e => !isNaN(Number(e.object_id))).map(it => Number(it.object_id))
        const rt = await wialonService.getUpdateLastAllSensorsIdDataFromWialon(idwArray, this.sess) //получаем события с wialon
        this.oilFunc(rt, formatData)
        this.lastMsgFunc(rt, formatData)

    }


    lastMsgFunc(rt, all) {
        const itogEvents = Object.entries(rt).map(el => {
            const eventObject = el[1][1] ? Object.values(Object.values(el[1])[1])[0] : null
            if (eventObject) {
                return {
                    id: el[0],
                    time: eventObject.m,
                    geo: [eventObject.to.y, eventObject.to.x],
                    condition: this.objCondition[eventObject.state]
                };
            }
            return { event: null };
        }).filter(eventObj => eventObj.event !== null);
        const mass = [];
        const nowDate = parseFloat(((new Date().getTime()) / 1000).toFixed(0))
        all.forEach(e => {
            const foundEvent = itogEvents.find(it => it.id === e.object_id);
            if (foundEvent) {
                const lastTime = nowDate - foundEvent.time;
                mass.push({ id: foundEvent.id, group: e.group_name, name: e.object_name, lastTime: lastTime, time: foundEvent.time, geo: foundEvent.geo });

            }
        })


        mass.forEach(e => {
            e.lastTime > 3600 ? this.checkSortLastTime(e.id, e.group, e.name, e.time, e.geo) : null
        })
    }


    oilFunc(rt, all) {  //проверка на событие заправка/слив
        const itogEvents = Object.entries(rt).map(el => {

            const eventObject = el[1][0].lls ? Object.values(Object.values(el[1])[0].lls)[0] : null
            const fill = eventObject ? Object.values(Object.values(el[1])[0].lls)[0].filled !== 0 ? Object.values(Object.values(el[1])[0].lls)[0].filled : null : null
            if (eventObject && fill) {
                return {
                    id: el[0],
                    filled: parseFloat((eventObject.filled).toFixed(0)),
                    oil: parseFloat((eventObject.value).toFixed(0)),
                    time: eventObject.from.t,
                    geo: [eventObject.to.y, eventObject.to.x]

                };
            }
            return { event: null };
        }).filter(eventObj => eventObj.event !== null);
        const mass = [];
        all.forEach(e => {
            const foundEvent = itogEvents.find(it => it.id === e.object_id);
            if (foundEvent) {
                mass.push({ id: foundEvent.id, filled: foundEvent.filled, oil: foundEvent.oil, time: foundEvent.time, geo: foundEvent.geo, group: e.group_name, name: e.object_name });

            }
        })
        mass.forEach(e => {
            this.modalView(e.filled, e.name, e.group, e.id, e.geo, e.time)
        })

    }

    async modalView(filled, name, group, idw, geo, time) {
        const times = new Date(time * 1000)
        const day = times.getDate();
        const month = (times.getMonth() + 1).toString().padStart(2, '0');
        const year = times.getFullYear();
        const hours = times.getHours().toString().padStart(2, '0');
        const minutes = times.getMinutes().toString().padStart(2, '0');
        const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
        const data = [{
            event: filled > 0 ? `Заправка` : 'Слив', litrazh: filled > 0 ? `Запралено: ${filled} л.` : `Слив: ${filled - (filled * 2)} л.`,
            time: `Время: ${formattedDate}`
        }]
        const res = await databaseService.controllerSaveToBase(data, idw, geo, group, name, filled) //запись лога
    }

    async checkSortLastTime(idw, group, name, time, geo) { //проверка на событие потеря связи
        const times = new Date(time * 1000)
        const day = times.getDate();
        const month = (times.getMonth() + 1).toString().padStart(2, '0');
        const year = times.getFullYear();
        const hours = times.getHours().toString().padStart(2, '0');
        const minutes = times.getMinutes().toString().padStart(2, '0');
        const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
        const data = [{
            event: 'Потеря связи',
            lasttime: `Время последнего сообщения: ${formattedDate}`
        }]
        const res = await databaseService.controllerSaveToBase(data, idw, geo, group, name) //запись лога
    }



    popupProstoy = async () => {
        const arrays = HelpersDefault.formats(this.data)
        const [timeNow, timeOld] = HelpersDefault.timefn()

        for (const e of arrays) {
            const [active, group, name] = e;
            const newGlobal = await HelpersDefault.getDataToInterval(active, timeOld, timeNow);
            newGlobal.sort((a, b) => a.time - b.time);
            const resnew = await this.prostoyNew(newGlobal);  ////проверка на событие простой
            if (resnew) {
                for (const el of resnew) {
                    const map = JSON.parse(el[1][1]);
                    const timesProstoy = this.timesFormat(Number(el[1][0]) - Number(el[0][0]));
                    const formattedDate = new Date(Number(el[0][0]) * 1000).toLocaleString(); // Упрощенное форматирование даты
                    const data = [{
                        event: `Простой`, group: `Компания: ${group}`,
                        name: `Объект: ${name}`,
                        time: `Дата начала простоя: ${formattedDate}`, alarm: `Время простоя: ${timesProstoy}`
                    }];
                    const newTime = Math.floor(new Date().getTime() / 1000);
                    const delta = newTime - Number(el[1][0]);
                    if (delta > 900) {
                        await databaseService.controllerSaveToBase(data, active, map, group, name); //запись лога
                    }
                }
            }
        }
    }
    timesFormat(dates) {
        const totalSeconds = Math.floor(dates);
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        const motoHours = `${hours}:${minutes}`;
        return motoHours;
    }





    async prostoyNew(newdata) {
        if (newdata.length === 0) {
            return undefined
        }
        else {
            const res = newdata.reduce((acc, e) => {
                if (Number(e.engineOn) === 1 && e.speed === 0 && e.sats > 4) {
                    if (Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length > 0
                        && acc[acc.length - 1][0].engineOn === 1 && acc[acc.length - 1][0].speed === 0 && acc[acc.length - 1][0].sats > 4) {
                        acc[acc.length - 1].push(e);
                    } else {
                        acc.push([e]);
                    }
                } else if (Number(e.engineOn) === 0 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0
                    || e.speed > 0 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0
                    || e.sats <= 4 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0) {
                    acc.push([]);
                }

                return acc;
            }, []).filter(el => el.length > 0).reduce((acc, el) => {
                if (Number(el[el.length - 1].data) - Number(el[0].data) > 1200) {
                    acc.push([[el[0].data, [el[0].lat, el[0].lon], el[0].oil], [el[el.length - 1].data, [el[el.length - 1].lat, el[el.length - 1].lon], el[el.length - 1].oil]])
                }
                return acc
            }, [])
            return res
        }

    }

}


module.exports = { Events }



