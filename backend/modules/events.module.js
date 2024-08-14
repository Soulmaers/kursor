const wialonService = require('../services/wialon.service');
const databaseService = require('../services/database.service')
const helpers = require('../services/helpers.js')

exports.eventFunction = async (data, sess) => {
    const formatData = helpers.formatFinal(data)
    const idwArray = formatData.filter(e => !isNaN(Number(e.object_id))).map(it => Number(it.object_id))
    const rt = await wialonService.getUpdateLastAllSensorsIdDataFromWialon(idwArray, sess) //получаем события с wialon
    oilFunc(rt, formatData)
    lastMsgFunc(rt, formatData)

}

const objCondition = {
    0: 'Стоянка',
    1: 'Поездка',
    2: 'Остановка'
}
function lastMsgFunc(rt, all) { //
    const itogEvents = Object.entries(rt).map(el => {
        const eventObject = el[1][1] ? Object.values(Object.values(el[1])[1])[0] : null
        if (eventObject) {
            return {
                id: el[0],
                time: eventObject.m,
                geo: [eventObject.to.y, eventObject.to.x],
                condition: objCondition[eventObject.state]
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
        e.lastTime > 3600 ? checkSortLastTime(e.id, e.group, e.name, e.time, e.geo) : null
    })
}


async function checkSortLastTime(idw, group, name, time, geo) { //проверка на событие потеря связи
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

function oilFunc(rt, all) {  //проверка на событие заправка/слив
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
        modalView(e.filled, e.name, e.group, e.id, e.geo, e.time)
    })

}
async function modalView(filled, name, group, idw, geo, time) {
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