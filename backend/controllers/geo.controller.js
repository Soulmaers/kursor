
const wialonService = require('../services/wialon.service.js')

//получаем запрос с интервалом времени и id
//делаем запрос на wialon и получаем параметры где берем координаты геопозиции
exports.geoloc = async (req, res) => {
    const time1 = req.body.nowDate
    const time2 = req.body.timeFrom
    const idw = req.body.idw
    const login = req.body.login
    const geoloc = await wialonService.geoDataFromWialon(time1, time2, idw, login)
    const arr2 = Object.values(geoloc);
    const geo = [];
    var rows = arr2[1].length;
    for (var i = 0; i < rows; i++) {
        geo.push([]);
    }
    geo.forEach((el, index) => {
        el.push(arr2[1][index].pos.y, arr2[1][index].pos.x);
    })
    let geoX,
        geoY;
    //получаем id объекта,
    //забираем сессию, делаем запрос на виалон за параметрами,
    //получаем данные и выбираем координаты,
    //пересылаем в ответ для отображения на карте маркера
    const geolocMarker = await wialonService.getDataFromWialon(login)
    if (geolocMarker) {
        const allCar = Object.values(geolocMarker);
        allCar[5].forEach(el => {
            if (el.id === Number(idw)) {
                if (el.pos) {
                    geoX = el.pos.x
                    geoY = el.pos.y
                }
            }
        })
    }
    res.json({ resTrack: geo, resMarker: { geoX, geoY } })
}

