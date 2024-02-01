

const databaseService = require('../services/database.service');
const { sortData } = require('../helpers')
exports.getKursorObjects = async (req, res) => {
    const login = req && req.body && req.body.login ? req.body.login : null
    const data = await databaseService.getKursorObjects(login)
    // console.log(data)
    const ress = sortData(data)
    const massObject = [];
    for (const elem of ress) {
        let promises;
        promises = elem.objects.map(async el => {
            return await databaseService.loadParamsViewList(el.nameObject, Number(el.idObject), 'kursor');
        });
        const dataObjectGroup = await Promise.all(promises)
        elem.objects = dataObjectGroup
        const massSub = []
        for (const sub of elem.sub) {
            promises = sub.objects.map(async el => {
                return await databaseService.loadParamsViewList(el.nameObject, Number(el.idObject), 'kursor');
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

        //   console.log(result)
        massObject.push(result)
    }
    if (login) {
        res.json({ result: massObject })
    }
    else {
        return massObject
    }

}


exports.objectId = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.objectId(idw)
    res.json(result)
}

exports.objects = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.objects(idw)
    res.json(result)
}

exports.getParamsKursor = async (req, res) => {
    const idObject = req.body.idw
    const result = await databaseService.getParamsKursor(idObject)
    res.json(result)
}
exports.getGeoKursor = async (req, res) => {
    const idObject = req.body.getGeoKursor
    const result = await databaseService.getGeoKursor(idObject)
    res.json(result)
}

exports.getParamsKursorIntervalController = async (req, res) => {
    const t1 = req.body.t1
    const t2 = req.body.t2
    const idObject = req.body.active
    const result = await databaseService.getParamsKursorInterval(idObject, t1, t2)
    const strukturaKursor = result.map(el => {
        return {
            idw: idObject, time: el.time, geo: JSON.stringify([Number(el.lat), Number(el.lon)]), speed: Number(Number(el.speed).toFixed(0)),
            sats: Number(Number(el.sats).toFixed(0)), curse: Number(Number(el.course).toFixed(0)), oil: 0, pwr: Number(Number(el.pwr_ext).toFixed(1)),
            engine: el.in1 === 'Вход IN1(датчик сработал)' ? 1 : 0, meliage: Number(Number(el.meliage).toFixed(0))
        }
    })
    res.json(strukturaKursor)
}





exports.geoLastIntervalKursor = async (req, res) => {
    const time1 = req.body.nowDate
    const time2 = req.body.timeFrom
    const idObject = req.body.idw
    const geoloc = await databaseService.geoLastIntervalKursor(time1, time2, idObject)
    const geo = [];
    if (geoloc) {
        var rows = geoloc.length;
        for (var i = 0; i < rows; i++) {
            geo.push([]);
        }
        geo.forEach((el, index) => {
            el.push(geoloc[index].lat, geoloc[index].lon, geoloc[index].course, geoloc[index].speed, geoloc[index].time, geoloc[index].sats);
        })
    }

    res.json({ resTrack: geo })
}
