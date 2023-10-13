
const wialonService = require('../services/wialon.service.js')



exports.geoLastInterval = async (req, res) => {
    const time1 = req.body.nowDate
    const time2 = req.body.timeFrom
    const idw = req.body.idw
    const geoloc = await wialonService.geoDataFromWialon(time1, time2, idw)
    const arr2 = Object.values(geoloc);
    const geo = [];
    var rows = arr2[1].length;
    for (var i = 0; i < rows; i++) {
        geo.push([]);
    }
    geo.forEach((el, index) => {
        el.push(arr2[1][index].pos.y, arr2[1][index].pos.x, arr2[1][index].pos.c, arr2[1][index].pos.s, arr2[1][index].t, arr2[1][index].p.sats);
    })
    res.json({ resTrack: geo })
}
//получаем запрос с интервалом времени и id
//делаем запрос на wialon и получаем параметры где берем координаты геопозиции
exports.geoloc = async (req, res) => {
    const time1 = req.body.nowDate
    const time2 = req.body.timeFrom
    const idw = req.body.idw
    const geoloc = await wialonService.geoDataFromWialon(time1, time2, idw)
    const arr2 = Object.values(geoloc);
    const geo = [];
    var rows = arr2[1].length;
    for (var i = 0; i < rows; i++) {
        geo.push([]);
    }
    geo.forEach((el, index) => {
        el.push(arr2[1][index].pos.y, arr2[1][index].pos.x, arr2[1][index].pos.c, arr2[1][index].pos.s, arr2[1][index].t);
    })
    let geoX,
        geoY,
        course;
    // console.log(geo)
    //получаем id объекта,
    //забираем сессию, делаем запрос на виалон за параметрами,
    //получаем данные и выбираем координаты,
    //пересылаем в ответ для отображения на карте маркера
    const geolocMarker = await wialonService.getDataFromWialon()
    if (geolocMarker) {
        const allCar = Object.values(geolocMarker);
        allCar[5].forEach(el => {
            if (el.id === Number(idw)) {
                if (el.pos) {
                    geoX = el.pos.x
                    geoY = el.pos.y
                    course = el.pos.c

                }
            }
        })
    }
    res.json({ resTrack: geo, resMarker: { geoX, geoY, course } })
}

exports.getGeo = async (req, res) => {
    const objCondition = {
        0: 'Стоянка',
        1: 'Поездка',
        2: 'Остановка'
    }
    const arr = req.body.arrayId
    const result = await wialonService.getUpdateLastAllSensorsIdDataFromWialon(arr)
    const structura = []
    for (let key in result) {
        if (result[key][1] !== undefined) {
            const eventObject = Object.values(result[key][1])[0]
            const nowTime = parseFloat(((new Date().getTime()) / 1000).toFixed(0))
            const currentTime = nowTime - eventObject.m
            structura.push([key, [eventObject.to.y, eventObject.to.x], eventObject.course, eventObject.curr_speed, objCondition[eventObject.state], currentTime])
        }
    }
    res.json(structura)
}

exports.getEventMarkers = async (req, res) => {
    const id = req.body.id
    const t1 = req.body.nowDate
    const t2 = req.body.timeFrom
    const result = await wialonService.getEventFromToDayWialon(id, t1, t2)
    res.json(result)
}



exports.getTreks = async (req, res) => {

    const arr = req.body.arrayId
    //     const result = await wialonService.getUpdateLastAllSensorsIdDataFromWialon(arr)
    const structura = []
    for (let key in result) {
        if (result[key][1] !== undefined) {
            const eventObject = Object.values(result[key][1])[0]
            const nowTime = parseFloat(((new Date().getTime()) / 1000).toFixed(0))
            const currentTime = nowTime - eventObject.m
            structura.push([key, [eventObject.to.y, eventObject.to.x], eventObject.course, eventObject.curr_speed, objCondition[eventObject.state], currentTime])
        }
    }
    res.json(structura)
}

