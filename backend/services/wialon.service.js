


const { getSession } = require('../config/db');
const axios = require('axios');
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



exports.getPropertyGroups = async (session) => {
    const eid = session.eid;
    const prms = {
        "spec": {
            "itemsType": "avl_unit_group",
            "propName": "sys_name,,sys_phone_number",
            "propValueMask": "*,*,*",
            "sortType": "sys_name",
            "propType": "sys_name,,sys_phone_number",
            "or_logic": "1"
        },
        "force": 1,
        "flags": 257,
        "from": 0,
        "to": 0
    }
    try {
        const url = `https://hst-api.watchit.ru/wialon/ajax.html?svc=core/search_items&params=${encodeURIComponent(JSON.stringify(prms))}&sid=${eid}`;
        const headers = {
            'Content-Type': 'application/json'
        };
        const response = await axios.post(url, {}, { headers: headers });
        return response.data.items
    }
    catch (e) {
        console.log('ошибка соединения')
    }
};

exports.getPropertyObjects = async (session) => {
    const eid = session.eid;
    const prms = {
        "spec": {
            "itemsType": "avl_unit",
            "propName": "sys_name,sys_unique_id,sys_phone_number",
            "propValueMask": "*,*,*",
            "sortType": "sys_name",
            "propType": "sys_name,sys_unique_id,sys_phone_number",
            "or_logic": "1"
        },
        "force": 0,
        "flags": 257,
        "from": 0,
        "to": 0
    }

    try {
        const url = `https://hst-api.watchit.ru/wialon/ajax.html?svc=core/search_items&params=${encodeURIComponent(JSON.stringify(prms))}&sid=${eid}`;
        const headers = {
            'Content-Type': 'application/json'
        };
        const response = await axios.post(url, {}, { headers: headers });
        //  console.log(response)
        return response.data.items
    }
    catch (e) {
        console.log('ошибка соединения')
    }
};

//запрос данных на виалон по объекту и получение параметров
exports.getDataFromWialon = async (session) => {
    const eid = session.eid;

    try {
        const url = `https://hst-api.watchit.ru/wialon/ajax.html?svc=core/search_items&params=${encodeURIComponent(JSON.stringify(prms))}&sid=${eid}`;
        const headers = {
            'Content-Type': 'application/json'
        };
        const response = await axios.post(url, {}, { headers: headers })
        return response.data
    }
    catch (e) {
        console.log('ошибка соединения')
    }
};

exports.getUniqImeiAndPhoneIdDataFromWialon = async (id, sess) => {
    const eid = sess.eid;
    const prmsId = {
        "id": id,
        "flags": 0x00000100
    };
    try {

        const url = `https://hst-api.watchit.ru/wialon/ajax.html?svc=core/search_item&params=${encodeURIComponent(JSON.stringify(prmsId))}&sid=${eid}`;
        const headers = {
            'Content-type': 'application/json'
        }
        const response = await axios.post(url, {}, { headers: headers, timeout: 20000 })
        return response.data
    }
    catch (e) {
        console.log('ошибка соединения')
    }
};



exports.loadIntervalDataFromWialon = async (active, timeOld, timeNow, login, sess) => {
    const eid = sess.eid;
    const prms2 = {
        "itemId": active,
        "timeFrom": timeOld,// 1729627200,//
        "timeTo": timeNow,//1729648800,//
        "flags": 1,
        "flagsMask": 1,
        "loadCount": 180000
    }
    try {
        const url = `https://hst-api.watchit.ru/wialon/ajax.html?svc=messages/load_interval&params=${encodeURIComponent(JSON.stringify(prms2))}&sid=${eid}`;
        const headers = {
            'Content-type': 'application/json'
        }
        const response = await axios.post(url, {}, { headers: headers, timeout: 20000 })
        return response.data
    }
    catch (e) {
        console.log('ошибка соединения')
    }
};


exports.getUpdateLastAllSensorsIdDataFromWialon = async (arr, sess) => {
    const eid = sess.eid;
    const array = Array.isArray(arr) ? arr : [arr];
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
    };

    try {
        // Первый запрос к 'events/update_units'
        const updateUnitsUrl = `https://hst-api.watchit.ru/wialon/ajax.html?svc=events/update_units&params=${encodeURIComponent(JSON.stringify(prms))}&sid=${eid}`;
        const headers = {
            'Content-Type': 'application/json'
        };

        // Выполнение первого запроса
        const updateResponse = await axios.post(updateUnitsUrl, {}, { headers: headers, timeout: 20000 });

        // Проверка на успешность первого запроса
        if (updateResponse.data.error) {
            console.error(`Error in update_units: ${updateResponse.data.reason}`);
            return; // Завершаем выполнение, если первый запрос вернул ошибку
        }

        // Если первый запрос прошел успешно, выполняем второй запрос
        console.log('First request successful, proceeding to the second request.');

        // Второй запрос к 'events/check_updates'
        const checkUpdatesUrl = `https://hst-api.watchit.ru/wialon/ajax.html?svc=events/check_updates&params=${encodeURIComponent(JSON.stringify(prmsUp))}&sid=${eid}`;

        // Выполнение второго запроса
        const checkUpdatesResponse = await axios.post(checkUpdatesUrl, {}, { headers: headers, timeout: 20000 });

        // Проверка на успешность второго запроса
        if (checkUpdatesResponse.data.error) {
            // throw new Error(`Error in check_updates: ${checkUpdatesResponse.data.reason}`);
        }

        // Возвращаем данные второго запроса
        return checkUpdatesResponse.data;

    } catch (error) {
        console.error('Error during requests:', error.message);
        // Обработка ошибки без пробрасывания дальше, чтобы избежать падения приложения
        return { success: false, message: error.message };
    }
};


