

const databaseService = require('../services/database.service');
//const ips = require('../../index');

const { sortData } = require('../services/helpers')

exports.getKursorObjects = async (req, res) => {
    const login = req && req.body && req.body.login ? req.body.login : null
    const data = await databaseService.getKursorObjects(login) //получаем объекты не wialona в структуре с группами
    // console.log(data)
    const ress = sortData(data)
    const massObject = [];
    for (const elem of ress) {
        let promises;
        promises = elem.objects.map(async el => {
            return await databaseService.loadParamsViewList(el.nameObject, Number(el.idObject), el, 'kursor'); //получаем основную структуру данных по объекту
        });
        const dataObjectGroup = await Promise.all(promises)
        elem.objects = dataObjectGroup
        const massSub = []
        for (const sub of elem.sub) {
            promises = sub.objects.map(async el => {
                return await databaseService.loadParamsViewList(el.nameObject, Number(el.idObject), el, 'kursor');
            });
            const dataObjectSub = await Promise.all(promises)
            sub.objects = dataObjectSub
            const result = sub.objects.map(e => {
                return [...e, sub.name_sub_g, Number(sub.id_sub_g)]
            })
            massSub.push(result)
        }
        let result;
        if (elem.objects.length !== 0) {
            result = elem.objects.map(e => {
                return [...e, elem.name_g, Number(elem.idg), { sub: massSub }, 'kursor']
            })
        }
        else {
            result = [[{}, {}, {}, {}, null, elem.name_g, Number(elem.idg), { sub: massSub }, 'kursor']]

        }
        massObject.push(result)
    }
    if (login) {
        res.json({ result: massObject })
    }
    else {
        return massObject
    }

}

exports.getSummator = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.getSummatorToBase(idw) //получение данных по параметрам сумматора топлива из БД
    res.json(result)
}

exports.setSummator = async (req, res) => {
    const data = req.body.data
    const idw = req.body.idw
    const result = await databaseService.setSummatorToBase(data, idw) //сохранение данных по параметрам сумматора топлива в БД
    res.json(result)
}
exports.getDataParamsInterval = async (req, res) => {
    const time1 = req.body.t1
    const time2 = req.body.t2
    const idw = req.body.idw
    const result = await databaseService.geoLastInterval(time1, time2, idw) //получение парамтеров и значений датчиков за интервал времени
    res.json(result)
}

exports.saveValuePWR = async (req, res) => {
    //  console.log(ips.ips.object);
    const idw = req.body.id
    const params = req.body.params
    const value = req.body.value
    const result = await databaseService.saveValuePWRToBase(idw, params, value) //сохранение порогового значения по параметру
    res.json(result)
}
exports.getValueToBase = async (req, res) => {
    const idw = req.body.id
    const param = req.body.param
    const result = param ? await databaseService.getValuePWRToBase(idw, param) : await databaseService.getValuePWRToBase(idw) //получение порогового значения по параметру
    res.json(result)
}

exports.deleteParams = async (req, res) => {
    const idw = req.body.id
    const param = req.body.param
    console.log('туту?')
    console.log(idw, param)
    const result = await databaseService.deleteParamsToBase(idw, param) //удаление порогового значения по параметру
    res.json(result)
}

exports.getMetas = async (req, res) => {
    const idObject = req.body.idw
    const port = req.body.port
    const imei = req.body.imei
    const result = await databaseService.getMeta(idObject, port, imei) //получение входящих параметров по id,порту и imei
    res.json(result)
}

exports.setSensStorMeta = async (req, res) => {
    const data = req.body.data
    const result = await databaseService.setSensStorMeta(data) //удаление, добавление, обновление привязанных параметров по объекту
    res.json(result)
}

exports.getSensStorMeta = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.getSensStorMeta(idw)  //получение привязанных параметров по объекту
    res.json(result)
}

exports.objects = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.objects(idw) //получение объекта не wialona
    res.json(result)
}

exports.getSens = async (req, res) => {
    const idw = req.body.idw
    const params = await databaseService.paramsToBaseSens(idw) //получение параметров и значений датчиков по id
    res.json(params)
}

exports.geoLastInterval = async (req, res) => {
    const time1 = req.body.t1
    const time2 = req.body.t2
    const idw = req.body.idw
    const geoloc = await databaseService.geoLastInterval(time1, time2, idw) //получение данных геопозиции за интервал
    const geo = [];
    if (geoloc) {
        var rows = geoloc.length;
        for (var i = 0; i < rows; i++) {
            geo.push([]);
        }
        geo.forEach((el, index) => {
            el.push(geoloc[index].lat, geoloc[index].lon, geoloc[index].course, geoloc[index].speed, geoloc[index].last_valid_time, geoloc[index].sats);
        })
    }
    res.json({ resTrack: geo })
}
