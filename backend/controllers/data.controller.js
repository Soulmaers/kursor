
const wialonService = require('../services/wialon.service.js')
const databaseService = require('../services/database.service');
const kursorService = require('./kursor.js')
const statistika = require('../modules/statistika.module');
const events = require('../modules/events.module.js')
const { createDate, convert, sortData } = require('../services/helpers.js')
const constorller = require('./data.controller.js')
const { SummaryStatistiks } = require('../modules/statistika.module.js')
require('dotenv').config();
const { connection, sql } = require('../config/db')

//готовим данные и отправляем ответ на клиент который отрисовывает список
exports.dataSpisok = async (req, res) => {
    try {
        let login;
        if (req && req.body && req.body.login) {
            login = req.body.login
        }
        else {
            login = null
        }
        const datas = await databaseService.getWialonObjects() //получем данные из БД по объектам wialona
        const ress = sortData(datas)
        const massObjectCar = login ? await databaseService.dostupObject(login) : null //проверяем к каким из них есть доступ у УЗ
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
                if (login) {
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


const getWialonSetToBaseObject = async (login) => {
    console.log('login', login)
    console.time('getWialon')
    const objects = await getWialon(login) // получаем объекты с wialona
    console.timeEnd('getWialon')
    console.time('save')
    const mess = await databaseService.setObjectGroupWialon(objects) //обновления объекты в БД с wialona
    console.timeEnd('save')
    console.log(mess)
}

const getWialon = async (login) => {
    const data = await wialonService.getAllGroupDataFromWialon();
    if (!data) return [];
    const time = Math.floor(Date.now() / 1000);
    const results = [];
    // Проходим по каждой группе
    for (const elem of data.items) {
        const { nm: nameGroup, id: idGroup, u: nameObject } = elem;
        // Проходим по каждому объекту в группе
        for (const el of nameObject) {
            try {
                const [all, phone] = await Promise.all([
                    wialonService.getAllParamsIdDataFromWialon(el),
                    wialonService.getUniqImeiAndPhoneIdDataFromWialon(el)
                ]);
                // Проверяем наличие данных
                if (all.item && phone.item) {
                    results.push({
                        login,
                        data: String(time),
                        idg: String(idGroup),
                        name_g: nameGroup,
                        idObject: String(all.item.id),
                        nameObject: String(all.item.nm),
                        imei: phone.item.uid ? String(phone.item.uid) : null,
                        phone: phone.item.ph ? String(phone.item.ph) : null
                    });
                }
            } catch (error) {
                console.error(`Ошибка при получении данных для объекта ${el}: ${error}`);
                // Можно решить, добавлять ли в результат null или вообще пропустить этот шаг
            }
        }
    }
    return results; // Возвращаем массив без null значений
};

exports.viewLogs = async (req, res) => {
    const login = req.body.login;
    const data = req.body.quantity ? await databaseService.quantitySaveToBase(login, req.body.quantity) : await databaseService.quantitySaveToBase(login) //сохраняем в БД счетчик просмотренных логов
    res.json(data)
}



exports.start = async (session, data) => {
    console.log('старт')
    await getWialonSetToBaseObject(session._session.au) //обновляем объекты с виалона в БД
    if (data) {
        const allCar = Object.entries(data)
        const dataKursor = await databaseService.getObjects() //получаем объекты из БД все кроме wialona
        const validKursorData = dataKursor.filter(e => [...e.imei].length > 10)
        // Запускаем все функции параллельно
        await Promise.all([await updateParams(data, validKursorData)]) //запускаем метод обновления данных
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

    const res = await constorller.dataSpisok()
    zaprosSpisokb(nameCar, res) //создание и подготовка структуры для проверки на аларм
    const kursorObjects = await kursorService.getKursorObjects()
    const dataAll = res.concat(kursorObjects)
    if (res) {
        statistika.popupProstoy(dataAll) //ловим простои
        events.eventFunction(res) //ловим через вилаон заправки/сливы+потеря связи
        new SummaryStatistiks(dataAll)
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


