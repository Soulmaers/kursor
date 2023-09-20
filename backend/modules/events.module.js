const wialonService = require('../services/wialon.service');
const databaseService = require('../services/database.service')
exports.eventFunction = async (arr) => {
    const result = arr
        .map(el => el.map(it => it[4])) // получаем массивы всех значений свойств объектов
        .flat()
    const all = arr
        .map(el => Object.values(el)) // получаем массивы всех значений свойств объектов
        .flat()
    //   console.log(all)
    const rt = await wialonService.getUpdateLastAllSensorsIdDataFromWialon(result)
    const itogEvents = Object.entries(rt).map(el => {
        const eventObject = Object.values(Object.values(el[1])[0].lls)[0];
        const fill = eventObject ? Object.values(Object.values(el[1])[0].lls)[0].filled !== 0 ? Object.values(Object.values(el[1])[0].lls)[0].filled : null : null
        if (eventObject && fill) {
            return {
                id: el[0],
                filled: parseFloat((eventObject.filled).toFixed(0)),
                oil: parseFloat((eventObject.value).toFixed(0)),
                time: eventObject.m,
                geo: [eventObject.to.y, eventObject.to.x]

            };
        }
        return { event: null };
    }).filter(eventObj => eventObj.event !== null);
    // console.log(itogEvents)
    const mass = [];
    all.forEach(e => {
        itogEvents.forEach(it => {
            if (parseFloat(it.id) === e[4]) {
                mass.push({ id: it.id, filled: it.filled, oil: it.oil, time: it.time, geo: it.geo, group: e[5], name: e[0].message });
            }
        });
    });
    console.log(mass);
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
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    const data = [{
        event: filled > 0 ? `Заправка` : 'Слив', group: `Компания: ${group}`, name: `Объект: ${name}`, litrazh: filled > 0 ? `Запралено: ${filled} л.` : `Слив: ${filled - (filled * 2)}`,
        time: `Время: ${formattedDate}`
    }]
    const res = await databaseService.controllerSaveToBase(data, idw, geo, filled)
    console.log('Заправка' + ' ' + res.message)

}