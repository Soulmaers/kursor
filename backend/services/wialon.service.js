
const { prms, prmsAllGoup } = require('../params')
const { getSess, getSessiont } = require('../controllers/data.controller.js')


//запрос всех  групп объектов  с виалона
exports.getAllGroupDataFromWialon = async (login) => {
    return new Promise(async function (resolve, reject) {
        const session = await getSessiont(login);
        session.request('core/search_items', prmsAllGoup)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                resolve(data)
            });
        //}
    })
};
//запрос всех параметров по id объекта
exports.getAllParamsIdDataFromWialon = async (id, login) => {
    const prmsId = {
        "id": id,
        "flags": 1025
    };
    return new Promise(async function (resolve, reject) {
        const session = await getSessiont(login);
        session.request('core/search_item', prmsId)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                resolve(data)
            });
        //   }

    })
};


exports.getAnimalsWialon = async (login) => {

    const prms = {
        "spec": [{
            "type": 'id',
            "data": 26702371,//'avl_unit', //26702383,//26702371,
            "flags": 1048576,//8388608,//1048576,//1048576,                 //    1048576-шт 8388608-анималс
            "mode": 0
        }
        ]
    }
    return new Promise(async function (resolve, reject) {
        const session = await getSessiont(login);
        session.request('core/update_data_flags', prms)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                resolve(data)
            });

    })


};

//запрос всех сенсоров по id объекта
exports.getAllSensorsIdDataFromWialon = async (id, timeOld, timeNow, login) => {
    const prms3 = {
        "source": "",
        "indexFrom": 0,
        "indexTo": 90000,
        "unitId": id,
        "sensorId": 0,


    };
    return new Promise(async function (resolve, reject) {
        const session = await getSessiont(login);
        session.request('unit/calc_sensors', prms3)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                resolve(data)
            });
        // }
    })
};


exports.getLastAllSensorsIdDataFromWialon = async (id, login) => {
    const prms = {
        "unitId":
            id,
        "sensors": []
    }
    return new Promise(async function (resolve, reject) {
        const session = await getSessiont(login);
        session.request('unit/calc_last_message', prms)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                resolve(data)
            });
        //   }
    })
};
exports.getAllNameSensorsIdDataFromWialon = async (id, login) => {
    const active = id
    const prmss = {
        'id': active,
        'flags': 4096
    }
    return new Promise(async function (resolve, reject) {
        const session = await getSessiont(login);
        session.request('core/search_item', prmss)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                resolve(data)
            });
        //}
    })
};
//запрос данных на виалон по объекту и получение параметров
exports.getDataFromWialon = async (login) => {
    return new Promise(async function (resolve, reject) {
        const session = await getSessiont(login);
        session.request('core/search_items', prms)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                resolve(data)
            });
    })
};
exports.geoDataFromWialon = async (time1, time2, idw, login) => {
    const prmsIdTime = {
        "itemId": idw,
        "timeFrom": time2,//1657205816,
        "timeTo": time1,//2757209816,
        "flags": 1,
        "flagsMask": 65281,
        "loadCount": 82710
    }
    return new Promise(async function (resolve, reject) {
        const session = await getSessiont(login);
        session.request('messages/load_interval', prmsIdTime)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                resolve(data)
            });
    })
};
exports.loadIntervalDataFromWialon = async (active, timeOld, timeNow, login) => {
    const prms2 = {
        "itemId": active,
        "timeFrom": timeOld,
        "timeTo": timeNow,
        "flags": 1,
        "flagsMask": 1,
        "loadCount": 90000
    }
    return new Promise(async function (resolve, reject) {
        const session = await getSessiont(login);
        session.request('messages/load_interval', prms2)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                //   console.log(data)
                resolve(data)
            });
    })
};

