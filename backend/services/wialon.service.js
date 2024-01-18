
const { prms, prmsAllGoup } = require('../params')
const { getSess, getSessiont } = require('../controllers/data.controller.js')
const geSession = require('../../index.js')
const fs = require('fs');
//запрос всех  групп объектов  с виалона





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
        /* const session = await geSession.geSession();
         session.request('report/cleanup_result', params)
             .catch(function (err) {
                 console.log(err);
             })
             .then(function (data) {
                 console.log(data)
             });*/
        const session = await geSession.geSession();
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
        const session = await geSession.geSession();
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
    const session = await geSession.geSession();
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
        const session = await geSession.geSession();
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



exports.getAllGroupDataFromWialon = async () => {
    return new Promise(async function (resolve, reject) {
        const session = await geSession.geSession();
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
exports.getAllParamsIdDataFromWialon = async (id) => {
    const prmsId = {
        "id": id,
        "flags": 1025
    };
    return new Promise(async function (resolve, reject) {
        try {
            const session = await geSession.geSession();
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
        const session = await geSession.geSession();
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
exports.getAllSensorsIdDataFromWialon = async (id) => {
    const prms3 = {
        "source": "",
        "indexFrom": 0,
        "indexTo": 180000,
        "unitId": id,
        "sensorId": 0

    };
    try {
        return new Promise(async function (resolve, reject) {
            const session = await geSession.geSession();
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
        const session = await geSession.geSession();
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
        const session = await geSession.geSession();
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
        const session = await geSession.geSession();
        //  console.log(session)
        //  const session = await getSessiont('i');
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
        const session = await geSession.geSession();
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
        const session = await geSession.geSession();
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
        const session = await geSession.geSession();
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
        const session = await geSession.geSession();
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
