
const wialonService = require('../services/wialon.service.js')
const databaseService = require('../services/database.service');
const statistika = require('../modules/statistika.module');
const events = require('../modules/events.module.js')
const { SummaryStatistiks } = require('../modules/statistika.module.js')
require('dotenv').config();
const { connection, sql } = require('../config/db')
const { getSession } = require('../config/db');
const { Worker } = require('worker_threads');
const path = require('path');

//готовим данные и отправляем ответ на клиент который отрисовывает список
exports.dataSpisok = async (req, res) => {

    try {
        let login;
        let role;
        if (req && req.body && req.body.login) {
            login = req.body.login
            role = req.body.role
        }
        else {
            login = null
            role = null
        }
        const datas = await databaseService.getWialonObjects() //получем данные из БД по объектам wialona
        const ress = sortDatas(datas)
        console.log(role, login)
        const massObjectCar = login && role !== 'Администратор' ? await databaseService.dostupObject(login) : null //проверяем к каким из них есть доступ у УЗ
        const aLLmassObject = [];
        const arrName = []
        for (const elem of ress) {
            const massObject = [];
            const nameGroup = elem.name_g;
            const idGroup = elem.idg
            let promises;
            promises = elem.objects.map(async el => {
                arrName.push([el.nameObject, el.idObject])
                return await databaseService.loadParamsViewList(el.nameObject, Number(el.idObject), el); //получаем основную структуру данных из БД по объекту (модели, колеса, параметры, пороговые значения)

            });
            const dataObjectGroup = await Promise.all(promises)
            dataObjectGroup.forEach(e => {
                //   console.log(e)
                if (login && role !== 'Администратор') {
                    if (massObjectCar.includes(`${e[4]}`)) {
                        e.group = nameGroup;
                        e.idGroup = idGroup;
                        massObject.push(e);
                    }
                }
                else {
                    e.group = nameGroup;
                    e.idGroup = idGroup;
                    massObject.push(e);
                }
            })
            const objectsWithGroup = massObject.map(obj => (Object.values({ ...obj, group: nameGroup, idGroup: idGroup })));
            aLLmassObject.push(objectsWithGroup);
        }
        if (req && req.body && req.body.login) {
            await res.json({ response: { aLLmassObject, arrName } });
        }
        return aLLmassObject
    }
    catch (e) {
        console.log(e)
    }
}
//готовим данные и отправляем ответ на клиент который отрисовывает список
exports.dannie = async (req, res) => {
    const role = req.body.role
    const incriment = req.body.incriment
    try {
        const datas = await databaseService.getUserGroupsAndObjects(incriment) //получем данные из БД по объектам wialona
        res.json({ datas });
    }
    catch (e) {
        console.log(e)
    }
}

const getWialonSetToBaseObject = async (login) => {
    console.log('login', login)
    console.time('getWialon')
    const objects = await getWialon(login) // получаем объекты с wialona
    //  console.log(objects)
    console.timeEnd('getWialon')
    console.time('save')
    const mess = await databaseService.setObjectGroup(objects) //обновления объекты в БД с wialona
    console.timeEnd('save')

}

const getWialon = async (login) => {
    const token = process.env.TOKEN;
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, '../services/worker2.js'));
        worker.on('message', (result) => {
            worker.terminate();
            resolve(result);
        });
        worker.on('error', (err) => {
            worker.terminate();
            reject(err);
        });
        worker.on('exit', (code) => {
            if (code !== 0) {
                console.log('выход воркера', code);
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
        worker.postMessage({ login: login, token: token });
    });
};

exports.viewLogs = async (req, res) => {
    const login = req.body.login;
    const data = req.body.quantity ? await databaseService.quantitySaveToBase(login, req.body.quantity) : await databaseService.quantitySaveToBase(login) //сохраняем в БД счетчик просмотренных логов
    res.json(data)
}

function sortDatas(datas) {
    const res = Object.values(datas.reduce((acc, elem) => {
        if (!acc[elem.idg]) {
            acc[elem.idg] = {
                idg: elem.idg,
                name_g: elem.name_g,
                number_company: elem.number_company,
                face_company: elem.face_company,
                objects: []
            };
        }
        acc[elem.idg].objects.push({
            idObject: elem.idObject,
            nameObject: elem.nameObject,
            imei: elem.imei,
            phone: elem.phone,
            typeObject: elem.typeObject,
            typeDevice: elem.typeDevice,
            port: elem.port,
            adress: elem.adress,
            marka: elem.marka,
            model: elem.model,
            vin: elem.vin,
            gosnomer: elem.gosnomer,
            dut: elem.dut,
            angle: elem.angle,
            face: elem.face_company,
            number: elem.number_company
        })

        return acc;
    }, {}));
    return res
}

exports.start = async (session, data) => {
    console.log('старт')
    await getWialonSetToBaseObject(session._session.au) //обновляем объекты с виалона в БД
    if (data) {
        const allCar = Object.entries(data)
        const dataKursor = await databaseService.getObjects() //получаем объекты из БД все кроме wialona
        const validKursorData = dataKursor.filter(e => [...e.imei].length > 10)
        // Запускаем все функции параллельно
        await Promise.all([updateParams(data, validKursorData)]) //запускаем метод обновления данных
        console.log('выполнено')
    }
}

async function updateParams(data) {
    console.time('updatedata')
    const allCar = Object.entries(data)
    const nameCar = allCar[5][1].map(el => {
        const nameTable = el.nm.replace(/\s+/g, '');
        const idw = el.id;
        const port = 'wialon';
        const speed = el.lmsg?.pos?.s || null;
        const geo = el.pos?.x ? JSON.stringify([el.pos.y, el.pos.x]) : null;
        return [nameTable, idw, speed, geo, port];
    });

    const res = await module.exports.dataSpisok();
    zaprosSpisokb(nameCar, res) //создание и подготовка структуры для проверки на аларм
    if (res) {
        statistika.popupProstoy(res) //ловим простои
        events.eventFunction(res) //ловим через вилаон заправки/сливы+потеря связи
        new SummaryStatistiks(res)
    }

    console.timeEnd('updatedata')
    return 'updateData end'
}

async function zaprosSpisokb(name, res) {
    const massItog = [];
    const tyreResPromises = name.map(item => queryDB(`SELECT tyresdiv, pressure, temp, osNumber FROM tyres WHERE idw='${item[1]}'`));
    const tyreResults = await Promise.all(tyreResPromises);
    for (let i = 0; i < name.length; i++) {
        const nameCar = name[i][0];
        const tyreRes = tyreResults[i];
        if (!tyreRes) {
            console.log('нет таблицы');
            continue;
        }
        const modelUniqValues = convert(tyreRes);
        const osiRes = await queryDB(`SELECT * FROM ifBar WHERE idw='${name[i][1]}'`);
        const paramsRes = await queryDB(`SELECT params, value FROM sens_stor_meta WHERE idw='${name[i][1]}' AND port='${name[i][4]}'`);
        for (const model of modelUniqValues) {
            const param = paramsRes.find(el => el.params === model.pressure);
            if (param) {
                const osiBar = osiRes.find(osi => osi.idOs === model.osNumber);
                const tempParam = paramsRes.find(el => el.params === model.temp);
                if (tempParam) {
                    massItog.push([nameCar, model.pressure, parseFloat(param.value), parseFloat(tempParam.value), osiBar, name[i][1], name[i][2], name[i][3]]);
                }
            }
        }
    }
    proverka(massItog); //проверка на аларм
}

const convert = (ob) => {  //фильтрация уникальных элементов
    const uniq = new Set(ob.map(e => JSON.stringify(e)));
    return Array.from(uniq).map(e => JSON.parse(e));
}


const queryDB = async (sql) => {
    try {
        const pool = await connection;
        const results = await pool.request().query(sql);
        return results.recordset;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
function isSensorLost(el) {
    return el[6] > 5 && el[3] <= -50;
}
function isTemperatureHigh(el) {
    return el[3] > 70 && el[6] > 5;
}
function isPressureHigh(el) {
    return el[2] >= Number(el[4].kvd) && el[3] > -50 && el[6] > 5;
}
function isPressureLow(el) {
    return el[2] <= Number(el[4].knd) && el[3] > -50 && el[6] > 5;
}
function handleNewAlarmCase(data, el, alarm) {
    console.log(data, el, alarm)
    databaseService.alarmBase(data, el, alarm);
}


/*
function proverka(arr) {
    console.log('проверка');
    const time = new Date();

    arr.forEach(el => {
        if (el[4] === undefined) {
            return;
        }

        let alarm;
        const sqls1 = `SELECT * FROM alarms WHERE idw=${el[5]} AND senspressure='${el[1]}'`;

        connection.query(sqls1, function (err, results) {
            if (err) console.log(err);

            if (results.length === 0) {
                if (isSensorLost(el)) {
                    alarm = 'Потеря связи с датчиком';
                } else if (isTemperatureHigh(el)) {
                    alarm = 'Критически высокая температура';
                } else if (isPressureLow(el)) {
                    alarm = 'Критически низкое давление';
                } else if (isPressureHigh(el)) {
                    alarm = 'Критически высокое давление';
                }

                if (alarm) {
                    const data = createDate();
                    handleNewAlarmCase(data, el, alarm);
                }

                return;
            }

            const lastResult = results[results.length - 1];

            if (isSensorLost(el)) {
                if (lastResult.alarm !== 'Потеря связи с датчиком') {
                    alarm = 'Потеря связи с датчиком';
                }
            } else if (isPressureLow(el) || isPressureHigh(el)) {
                if (lastResult.bar !== String(el[2]) && lastResult.alarm !== 'Потеря связи с датчиком') {
                    alarm = isPressureLow(el) ? 'Критически низкое давление' : 'Критически высокое давление';
                }
            } else {
                if (lastResult.alarm !== 'Норма') {
                    alarm = 'Норма';
                }
            }

            if (alarm) {
                const data = createDate();
                handleNewAlarmCase(data, el, alarm);
            }
        });
    });
}*/

const createDate = () => {   //форматироваие даты
    let today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    today = day + '.' + month + '.' + year;
    let time = new Date();
    const hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    time = hour + ':' + minutes
    const todays = today + ' ' + time
    return [todays]

}
function proverka(arr) {
    const time = new Date()
    arr.forEach(async el => {
        if (el[4] === undefined) {
            return
        }

        else {
            let alarm;
            const pool = await connection;
            const sqls1 = `SELECT * FROM alarms WHERE idw=${el[5]} AND senspressure='${el[1]}'`;
            let results = await pool.request().query(sqls1);
            results.recordset.sort((a, b) => {
                if (a.unix > b.unix) {
                    return 1
                }
                if (a.unix < b.unix) {
                    return -1
                }
                return 0;
            })
            if (results.recordset.length === 0) {
                //  console.log('КРАН!')
                //  console.log(el[0], el[2], 'таблицу не видит')
                if (el[6] > 5 && el[3] <= -50) {
                    //     console.log(el + ' ' + 'таблица нет, аларм есть. потеря связи с датчиком' + ' ' + time)
                    const data = createDate()
                    alarm = 'Потеря связи с датчиком'
                    //записываем данные в бд
                    databaseService.alarmBase(data, el, alarm)
                    return
                }
                else {
                    if (el[3] > 70) {
                        //   console.log(el + ' ' + 'таблица нет, аларм есть/ Критически низкое давление' + ' ' + time)
                        const data = createDate()
                        alarm = 'Критически высокая температура'
                        databaseService.alarmBase(data, el, alarm)
                        return
                    }
                    if (el[2] <= Number(el[4].knd) && el[3] > -50) {
                        //   console.log(el + ' ' + 'таблица нет, аларм есть/ Критически низкое давление' + ' ' + time)
                        const data = createDate()
                        alarm = 'Критически низкое давление'
                        console.log('КРАН!')
                        console.log(el)
                        databaseService.alarmBase(data, el, alarm)
                        return
                    }
                    if (el[2] >= Number(el[4].kvd) && el[3] > -50) {
                        //    console.log(el + ' ' + 'таблица нет, аларм есть/ Критически высокое давление' + ' ' + time)
                        const data = createDate()
                        alarm = 'Критически высокое давление'
                        databaseService.alarmBase(data, el, alarm)
                        return
                    }
                    else {
                        //     console.log(el + ' ' + 'таблицы нет, аларма нет' + ' ' + time)
                        return
                    }
                }
            }
            else if (results.recordset.length !== 0) {
                //  console.log(el[0], el[1], el[2], 'таблицу видит')
                if (el[6] > 5 && el[3] <= -50) {
                    if (results.recordset[results.recordset.length - 1].alarm == 'Потеря связи с датчиком') {
                        //    console.log('-3')
                        //   console.log(el + ' ' + 'таблица есть, аларм есть, потеря связи с датчиком, повторные данные')
                        return
                    } else {
                        //   console.log('-2')
                        //  console.log(el + ' ' + 'таблица есть, изменение аларма,потеря связи с датчиком ')
                        const data = createDate()
                        alarm = 'Потеря связи с датчиком'
                        databaseService.alarmBase(data, el, alarm)
                    }
                    return
                }
                else {
                    //    console.log('-11')
                    if (el[2] <= Number(el[4].knd) && el[3] > -50) {
                        //     console.log('-22')
                        if (results.recordset[results.recordset.length - 1].bar === String(el[2]) && results.recordset[results.recordset.length - 1].alarm !== 'Потеря связи с датчиком') {
                            //   console.log('равно')
                            //    console.log(el + ' ' + 'таблица есть, аларм есть, повторные данные N' + ' ' + time)
                            return
                        } else {
                            //   console.log('-33')
                            //  console.log(el + ' ' + 'таблица есть, аларм есть, изменение аларма N' + ' ' + time)
                            const data = createDate()
                            alarm = 'Критически низкое давление'
                            databaseService.alarmBase(data, el, alarm)
                            //    return
                        }
                        return
                    }
                    if (el[2] >= Number(el[4].kvd) && el[3] > -50) {
                        // console.log(results[results.length - 1].bar)
                        //   console.log('-4')
                        //   console.log(typeof el[2])
                        //   console.log(typeof results[results.length - 1].bar)
                        if (results.recordset[results.recordset.length - 1].bar === String(el[2]) && results.recordset[results.recordset.length - 1].alarm !== 'Потеря связи с датчиком') {
                            //   console.log(el + ' ' + 'таблица есть, аларм есть, повторные данные V' + ' ' + time)
                            return
                        } else {
                            //   console.log('-5')
                            //  console.log(el + ' ' + 'таблица есть, аларм есть, изменение аларма V' + ' ' + time)
                            const data = createDate()
                            alarm = 'Критически высокое давление'
                            databaseService.alarmBase(data, el, alarm)
                            // return
                        }
                        return
                    }
                    else if (el[2] > Number(el[4].knd) && el[3] > -50 || el[2] < Number(el[4].kvd) && el[3] > -50) {
                        if (results.recordset[results.recordset.length - 1].alarm === 'Норма') {
                            //  console.log(el + ' ' + 'таблица есть, аларма нет, повторные данные' + ' ' + time)
                            //  console.log('норма есть уже в базе')
                            return
                        } else {
                            // console.log(el + ' ' + 'таблица есть, аларма нет, аларм истек-норма' + ' ' + time)
                            //console.log('добавляем норму')
                            const data = createDate()
                            alarm = 'Норма'
                            databaseService.alarmBase(data, el, alarm)
                            //return
                        }
                    }
                }
            }
        }
    })
}


