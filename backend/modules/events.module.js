const wialonService = require('../services/wialon.service');
const databaseService = require('../services/database.service')
exports.eventFunction = async (arr) => {
    const result = arr
        .map(el => el.map(it => it[4])) // получаем массивы всех значений свойств объектов
        .flat()
    const all = arr
        .map(el => Object.values(el)) // получаем массивы всех значений свойств объектов
        .flat()
    const rt = await wialonService.getUpdateLastAllSensorsIdDataFromWialon(result)
    oilFunc(rt, all)
    lastMsgFunc(rt, all)

}

const objCondition = {
    0: 'Стоянка',
    1: 'Поездка',
    2: 'Остановка'
}
function lastMsgFunc(rt, all) {
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
    const condition = []
    const nowDate = parseFloat(((new Date().getTime()) / 1000).toFixed(0))

    all.forEach(e => {
        itogEvents.forEach(it => {
            if (parseFloat(it.id) === e[4]) {
                const lastTime = nowDate - it.time
                mass.push({ id: it.id, group: e[6], name: e[0].message, lastTime: lastTime, time: it.time, geo: it.geo });
                condition.push({ id: it.id, group: e[6], name: e[0].message, condition: it.condition, time: it.time, geo: it.geo })
            }
        });
    });
    mass.forEach(e => {
        e.lastTime > 3600 ? checkSortLastTime(e.id, e.group, e.name, e.time, e.geo) : null
    })
    condition.forEach(e => {
        //    checkSortCondition(e.id, e.group, e.name, e.condition,e.time, e.geo)
    })
}


async function checkSortLastTime(idw, group, name, time, geo) {
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
    const res = await databaseService.controllerSaveToBase(data, idw, geo, group, name)
}

function oilFunc(rt, all) {
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
        itogEvents.forEach(it => {
            if (parseFloat(it.id) === e[4]) {
                mass.push({ id: it.id, filled: it.filled, oil: it.oil, time: it.time, geo: it.geo, group: e[6], name: e[0].message });
            }
        });
    });
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
    const res = await databaseService.controllerSaveToBase(data, idw, geo, group, name, filled)
}