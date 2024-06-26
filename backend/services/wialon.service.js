


const { getSession } = require('../config/db');

const fs = require('fs');
//запрос всех  групп объектов  с виалона


//все параметры
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

//параметры запроса всех групп с виалона
const flagsAllGroup = 1 + 1024// + 1024//4096
const prmsAllGoup = {
    "spec": {
        "itemsType": "avl_unit_group",
        "propName": "sys_name",
        "propValueMask": "*",
        "sortType": "sys_name"
    },
    "force": 1,
    "flags": flagsAllGroup,
    "from": 0,
    "to": 0xffffffff,
    "rand": Math.random() // Добавляем рандомный параметр rand
};


exports.getTitleShablonToWialon = async (idResourse, idShablon, idObject, interval) => {
    const params = {
        "reportResourceId": idResourse,
        "reportTemplateId": idShablon,
        "reportObjectId": idObject,
        'reportObjectSecId': 0,
        'reportObjectIdList': [],
        "interval": {
            "from": interval[0],
            "to": interval[1],
            "flags": 0
        }
    }

    return new Promise(async function (resolve, reject) {
        const session = await getSession();
        session.request('report/exec_report', params)
            .then(async function (data) {
                //  console.log(data)
                const promises = data.reportResult.tables.map((el, index) => {
                    const p = {
                        "tableIndex": index,
                        "indexFrom": 0,
                        "indexTo": el.rows
                    };
                    return session.request('report/get_result_rows', p);
                });

                const rows = await Promise.all(promises);
                //  console.log({ data: data, rows: rows })
                resolve({ data: data, rows: rows });

            })
            .catch(function (err) {
                console.log(err);
                reject(err);
            })
    });

};

exports.getChartDatatToWialon = async (interval, idChart) => {
    return new Promise(async function (resolve, reject) {
        const session = await getSession();
        const params = {
            "attachmentIndex": idChart,
            "width": 1000000,// 100000,
            "useCrop": 1,
            'cropBegin': interval[0],
            'cropEnd': interval[1]
        }
        session.request('report/render_json', params)
            .then(async function (dataJson) {
                resolve(dataJson)

            })
            .catch(function (err) {
                console.log(err);
                reject(err);
            })
    })

}



exports.getFileReportsToWialon = async (format, formatToWialon) => {
    const session = await getSession();
    const eid = session._session.eid;
    const headers = {
        'Accept': 'application/pdf',
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    const axios = require('axios');
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, `rep.${format}`);
    console.log(filePath)
    const writeStream = fs.createWriteStream(filePath);

    const response = await axios.post(
        `https://hst-api.wialon.com/wialon/ajax.html?svc=report/export_result&params={"format":${formatToWialon},"attachMap":1,"compress":0}&sid=${eid}`,
        {},
        { responseType: 'stream', headers: headers }
    );
    response.data.pipe(writeStream);
    return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
            console.log('Файл успешно сохранен:', filePath);
            resolve(filePath);
        });

        writeStream.on('error', (error) => {
            console.error('Произошла ошибка:', error);
            reject(error);
        });
    });
};

exports.getAllShablonsToWialon = async () => {
    const params = {
        "spec": {
            "itemsType": "avl_resource",
            "propName": "reporttemplates",
            "propValueMask": "*",
            "sortType": ""
        },
        "force": 1,
        "flags": 0x00002001,
        "from": 0,
        "to": 0,

    };

    return new Promise(async function (resolve, reject) {
        const session = await getSession();
        session.request('core/search_items', params)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                resolve(data)
            });
        //}
    })
};



exports.getAllGroupDataFromWialon = async (sess) => {
    try {
        const session = sess ? sess : await getSession();
        const data = await session.request('core/search_items', prmsAllGoup);
        return data;
    } catch (error) {
        console.error('Error in getAllGroupDataFromWialon:', error);
        throw error;
    }
};

exports.getClearLoadIntervalWialon = async () => {
    const prmsId = {
        //     "id": id,
    };
    return new Promise(async function (resolve, reject) {
        try {
            const session = await getSession();
            const data = await session.request('messages/unload', prmsId);
            // Обработка успешного ответа
            //  console.log(data)
            resolve(data);
        } catch (err) {
            if (err.code === 7) {
                // Запрашиваемый ресурс не найден или не доступен
                resolve('ошибка');
                return;
            }
            resolve('ошибка');
            reject(err);
        }
    });
};

//запрос всех параметров по id объекта
exports.getAllParamsIdDataFromWialon = async (id, sess) => {
    const prmsId = {
        "id": id,
        "flags": 1025
    };
    return new Promise(async function (resolve, reject) {
        try {
            const session = sess ? sess : await getSession();
            const data = await session.request('core/search_item', prmsId);
            // Обработка успешного ответа
            //   console.log(data)
            resolve(data);
        } catch (err) {
            if (err.code === 7) {
                // Запрашиваемый ресурс не найден или не доступен
                resolve({});
                return;
            }
            resolve({});
            reject(err);
        }
    });
};
exports.getUniqImeiAndPhoneIdDataFromWialon = async (id, sess) => {
    // console.log(id, session)
    const prmsId = {
        "id": id,
        "flags": 0x00000100
    };
    return new Promise(async function (resolve, reject) {
        try {

            const session = sess ? sess : await getSession();
            const data = await session.request('core/search_item', prmsId);
            // Обработка успешного ответа
            resolve(data);
        } catch (err) {
            if (err.code === 7) {
                // Запрашиваемый ресурс не найден или не доступен
                resolve({});
                return;
            }
            resolve({});
            reject(err);
        }
    });
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
        const session = await getSession();
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
exports.getAllSensorsIdDataFromWialon = async (id, sens) => {
    const prms3 = {
        "source": "",
        "indexFrom": 0,
        "indexTo": 180000,
        "unitId": id,
        "sensorId": sens ? sens : 0

    };
    try {
        return new Promise(async function (resolve, reject) {
            const session = await getSession();
            const data = await session.request('unit/calc_sensors', prms3)
            resolve(data)
        })
    }
    catch (e) {
        console.log(e)
    }
};



exports.getLastAllSensorsIdDataFromWialon = async (id, login) => {
    const prms = {
        "unitId":
            id,
        "sensors": []
    }
    return new Promise(async function (resolve, reject) {
        const session = await getSession();
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
        const session = await getSession();
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
exports.getDataFromWialon = async () => {
    return new Promise(async function (resolve, reject) {
        const session = await getSession();
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
        "loadCount": 180000
    }
    return new Promise(async function (resolve, reject) {
        const session = await getSession();
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
        "loadCount": 180000
    }
    return new Promise(async function (resolve, reject) {
        const session = await getSession();
        session.request('messages/load_interval', prms2)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                resolve(data)
            });
    })
};



exports.getUpdateLastAllSensorsIdDataFromWialon = async (arr) => {
    const array = Array.isArray(arr) ? arr : [arr]
    const prms = {
        "mode": "add",
        "units": array.map(id => ({
            "id": id,
            "detect": {
                'trips': 0,
                'lls': 0

            }
        }))
    };
    const prmsUp = {
        "detalization": 3
    }
    return new Promise(async function (resolve, reject) {
        const session = await getSession();
        session.request('events/update_units', prms)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                session.request('events/check_updates&params', prmsUp)
                    .catch(function (err) {
                        console.log(err);
                    })
                    .then(function (data) {
                        resolve(data)
                    })
            });
    })
}





exports.getEventFromToDayWialon = async (id, t1, t2) => {
    const params = {
        "itemId": id,
        "ivalType": 1,
        "timeFrom": t2,
        "timeTo":
            t1,
        "detectors": [
            {
                "type": 'lls',
                "filter1": 0
            }
        ],
    }
    const paramsEvent = {
        "selector": {
            "type": '*',
            //   "expr": 'trips{m<90}',
            "timeFrom": t2,
            "timeTo":
                t1,
            "detalization": 23
        }
    }
    return new Promise(async function (resolve, reject) {
        const session = await getSession();
        session.request('events/load', params)
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                session.request('events/get', paramsEvent)
                    .catch(function (err) {
                        console.log(err);
                    })
                    .then(function (data) {
                        resolve(data)
                    });
            });
    })

}
