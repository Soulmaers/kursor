

const databaseService = require('../services/database.service');

const { JobToBase } = require('../modules/reportSettingsManagerModule/class/JobToBase')
const { OilCalculator } = require('../modules/reportsModule/class/OilControllCalculater')
const { DrainCalculate } = require('../modules/reportsModule/class/DrainControllCalculate')

const { Worker } = require('worker_threads');
const path = require('path');

let activeWorkers = {};
//const ips = require('../../index');

//const { sortData } = require('../services/helpers')

exports.getKursorObjects = async (req, res) => {
    const login = req && req.body && req.body.login ? req.body.login : null
    const data = await databaseService.getKursorObjects(login) //получаем объекты не wialona в структуре с группами
    const massObjectCar = login ? await databaseService.dostupObject(login) : null //проверяем к каким из них есть доступ у УЗ
    // const ress = sortData(data)
    const massObject = [];
    const arrName = []
    for (const elem of ress) {
        let promises;
        promises = elem.objects.map(async el => {
            arrName.push([el.nameObject, el.idObject])
            if (login) {
                if (massObjectCar.includes(el.idObject)) {
                    return await databaseService.loadParamsViewList(el.nameObject, Number(el.idObject), el, 'kursor'); //получаем основную структуру данных по объекту
                }
            } else {
                return await databaseService.loadParamsViewList(el.nameObject, Number(el.idObject), el, 'kursor'); //получаем основную структуру данных по объекту
            }
        });

        const filteredDataObjectGroup = await Promise.all(promises)
        const dataObjectGroup = filteredDataObjectGroup.filter(item => item !== undefined);
        elem.objects = dataObjectGroup
        const massSub = []
        for (const sub of elem.sub) {
            promises = sub.objects.map(async el => {
                arrName.push([el.nameObject, el.idObject])
                if (login) {
                    if (massObjectCar.includes(el.idObject)) {
                        return await databaseService.loadParamsViewList(el.nameObject, Number(el.idObject), el, 'kursor'); //получаем основную структуру данных по объекту
                    }
                } else {
                    return await databaseService.loadParamsViewList(el.nameObject, Number(el.idObject), el, 'kursor'); //получаем основную структуру данных по объекту
                }
            });
            const filteredDataObjectGroupSub = await Promise.all(promises)
            const dataObjectSub = filteredDataObjectGroupSub.filter(item => item !== undefined);
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
            result = [[{}, {}, {}, {}, 0, null, elem.name_g, Number(elem.idg), { sub: massSub }, 'kursor']]

        }
        massObject.push(result)
    }
    if (login) {
        res.json({ response: { massObject, arrName } })
    }
    else {
        return massObject
    }

}


exports.getAccountResourseID = async (req, res) => {
    const incrimentUser = req.body.incriment;
    const role = req.body.role;
    const result = await databaseService.connectUserAccountsResourse(incrimentUser, role);
    res.json(result);
}
exports.getPropertyPermissions = async (req, res) => {
    const incrimentUser = req.body.incriment;
    const result = await databaseService.getPropertyPermissionsID(incrimentUser);
    res.json(result);
}





exports.getOldObjects = async (req, res) => {
    const arrayObjects = req.body.array;
    // Получаем записи из базы данных
    const result = await databaseService.getOldObjectsToBaseWialonOrigin(arrayObjects);
    // console.log('rez', result)
    // Создаем мапу для быстрого поиска idObject по imei
    const resultMap = new Map(result.map(obj => [obj.imei, obj.idObject]));
    // console.log(resultMap)
    // console.log(arrayObjects)
    // Создаем массив объектов с новыми свойствами
    const mismatchedObjects = arrayObjects
        .filter(obj => {
            const imei = obj.imei
            // Проверяем, если существует запись с таким imei и отличается idObject
            return resultMap.has(imei) && resultMap.get(imei) !== obj.idObject;
        })
        .map(obj => ({

            oldId: resultMap.get(obj.imei),   // Старый idObject из базы данных
            newId: obj.idObject,   // Новый idObject из входного массива
            imei: obj.imei // IMEI объекта
        }));
    console.log(mismatchedObjects)
    res.json(mismatchedObjects);
};

exports.updateIdOBjectToBase = async (req, res) => {
    const arrayObjects = req.body.arrayId;
    const storTable = req.body.storTable;
    // Получаем записи из базы данных
    const result = await databaseService.updateIdOBjectToBaseNew(arrayObjects, storTable);
    res.json(result);
};

exports.deleteAllTableObjects = async (req, res) => {
    const idw = req.body.idw;
    const storTable = req.body.arrayTableStor;
    // Получаем записи из базы данных
    const result = await databaseService.deleteAllTableObjects(idw, storTable);
    res.json(result);
};



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

exports.getParamsToPressureAndOil = async (req, res) => {
    const time1 = req.body.t1
    const time2 = req.body.t2
    const idw = req.body.idw
    const arrayColumns = req.body.arrayColumns
    const num = req.body.num
    const workerKey = req.body.workerKey
    const window = req.body.window
    //   console.log(window)
    // Завершаем предыдущего воркера, если он существует
    if (activeWorkers[workerKey]) {
        activeWorkers[workerKey].terminate();
    }
    const workerPress = new Worker(path.resolve(__dirname, '../workers/workerDetalisation.js'));

    activeWorkers[workerKey] = worker;
    workerPress.on('message', (result) => {
        workerPress.terminate();
        res.json(result)
    });
    workerPress.on('error', (err) => {
        workerPress.terminate();
        console.log('ошибка воркера', err);
    });
    workerPress.on('exit', (code) => {
        if (code !== 0) {
            console.log('выход воркера', code);
        }
    });
    workerPress.postMessage({ time1: time1, time2: time2, idw: idw, arrayColumns: arrayColumns, num: num, window: window });

}

exports.saveSetParams = async (req, res) => {
    const { idw, param, formula, dopValue } = req.body.obj
    const result = await databaseService.saveValueToBase(idw, param, formula, dopValue) //сохранение порогового значения по параметру
    res.json(result)
}

exports.getRefills = async (req, res) => {
    const idw = req.body.idw
    const data = req.body.data
    const metka = req.body.metka
    const result = await JobToBase.getSettingsToBase(String(idw))
    const settings = JSON.parse(result[0].jsonsetAttribute)

    let instance;
    if (metka === 'refill') {
        instance = new OilCalculator(data, settings, idw)
    }
    else {
        instance = new DrainCalculate(data, settings, idw)
    }
    res.json(await instance.init())
}

exports.getConfigParam = async (req, res) => {
    const idw = req.body.idw
    const param = req.body.param
    const result = await databaseService.getConfigParam(idw, param) //получение порогового значения по параметру
    res.json(result)
}
exports.deleteConfigParam = async (req, res) => {
    const idw = req.body.idw
    const param = req.body.param
    const result = await databaseService.deleteConfigParam(idw, param) //получение порогового значения по параметру
    res.json(result)
}

exports.deleteParams = async (req, res) => {
    const idw = req.body.id
    const param = req.body.param
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

let worker = null;
exports.getSensStorMeta = async (req, res) => {
    const idw = req.body.idw

    const result = await databaseService.getSensStorMeta(idw)  //получение привязанных параметров по объекту
    res.json(result)
    // Завершаем предыдущего воркера, если он существует
    /*   if (worker) {
           worker.terminate();
       }
       worker = new Worker(path.resolve(__dirname, '../services/workerParams.js'));
       worker.on('message', (result) => {
           worker.terminate();
           res.json(result)
       });
       worker.on('error', (err) => {
           worker.terminate();
           console.log(err);
       });
       worker.on('exit', (code) => {
           if (code !== 0) {
               console.log(code);
           }
       });
       worker.postMessage(idw);*/
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

exports.getValueToBase = async (req, res) => {
    const idw = req.body.id
    const param = req.body.param
    const result = param ? await databaseService.getValuePWRToBase(idw, param) : await databaseService.getValuePWRToBase(idw) //получение порогового значения по параметру
    res.json(result)
}
