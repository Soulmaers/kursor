
const { prms, prmsAllGoup } = require('../params')
const { getSess } = require('../controllers/data.controller.js')


//запрос всех  групп объектов  с виалона
exports.getAllGroupDataFromWialon = async () => {
    return new Promise(function (resolve, reject) {
        getSess().request('core/search_items', prmsAllGoup)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                resolve(data)
            });
    })
};

//запрос всех параметров по id объекта
exports.getAllParamsIdDataFromWialon = async (id) => {
    const prmsId = {
        "id": id,
        "flags": 1025
    };
    return new Promise(function (resolve, reject) {
        getSess().request('core/search_item', prmsId)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                resolve(data)
            });
    })
};


//запрос всех сенсоров по id объекта
exports.getAllSensorsIdDataFromWialon = async (id) => {
    console.log(id)
    const prmss = {
        'id': id,
        'flags': 4096
    }
    return new Promise(function (resolve, reject) {
        console.log(getSess())
        getSess().request('core/search_item', prmss)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                resolve(data)
            });
    })
};

//запрос данных на виалон по объекту и получение параметров
exports.getDataFromWialon = async (session) => {
    return new Promise(function (resolve, reject) {
        session.request('core/search_items', prms)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                resolve(data)
            });
    })
};


exports.geoDataFromWialon = async (time1, time2, idw) => {
    const prmsIdTime = {
        "itemId": idw,
        "timeFrom": time2,//1657205816,
        "timeTo": time1,//2757209816,
        "flags": 1,
        "flagsMask": 65281,
        "loadCount": 82710
    }

    return new Promise(function (resolve, reject) {
        getSess().request('messages/load_interval', prmsIdTime)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                resolve(data)
            });
    })
};

/*
exports.getMainInfo=(name)=> {
    console.log(name)
    const flags = 1 + 1026
    const prms = {
        "spec": {
            "itemsType": "avl_unit",
            "propName": "sys_name",
            "propValueMask": "*",
            "sortType": "sys_name"
        },
        "force": 1,
        "flags": flags,
        "from": 0,
        "to": 0
    };
    if (session) {
        console.log(true)
    }
    else {
        console.log(false)
    }
    session.request('core/search_items', prms)
        .catch(function (err) {
            console.log(err);
        })
        .then(function (data) {
            if (data) {
                console.log('дата')
                const allCar = Object.values(data);
                allCar[5].forEach(el => {
                    if (el.id == name) {
                        if (el.pos) {
                            const geoX = el.pos.x
                            const geoY = el.pos.y
                            res.json({ geoX, geoY })
                        }
                    }
                })
            }
        })
}*/