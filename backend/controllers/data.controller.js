
const wialonService = require('../services/wialon.service.js')
const databaseService = require('../services/database.service');
const kursorService = require('./kursor.js')
const wialonModule = require('../modules/wialon.module');
const statistika = require('../modules/statistika.module');
const structura = require('../modules/structura.module.js')
const events = require('../modules/events.module.js')
//const connection = require('../config/db')
const geSession = require('../../index.js')
const { createDate, convert, sortData } = require('../helpers')
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
        const datas = await databaseService.getWialonObjects()
        const ress = sortData(datas)
        const massObjectCar = login ? await databaseService.dostupObject(login) : null
        const aLLmassObject = [];
        const arrName = []
        for (const elem of ress) {

            const massObject = [];
            const nameGroup = elem.name_g;
            const idGroup = elem.idg
            let promises;
            promises = elem.objects.map(async el => {
                arrName.push([el.nameObject, el.idObject])
                return await databaseService.loadParamsViewList(el.nameObject, Number(el.idObject), el);

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
    const objects = await getWialon(login)
    console.timeEnd('getWialon')
    console.time('save')
    const mess = await databaseService.setObjectGroupWialon(objects)
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
    // console.log(`Обработано объектов: ${results.length}`);
    return results; // Возвращаем массив без null значений
};


exports.up = async (req, res) => {
    updateParams()
    res.json({ message: 'ок' })
}

exports.viewLogs = async (req, res) => {
    const login = req.body.login;
    const data = req.body.quantity ? await databaseService.quantitySaveToBase(login, req.body.quantity) : await databaseService.quantitySaveToBase(login)
    res.json(data)
}



exports.start = async (session, data) => {
    console.log('старт')
    await getWialonSetToBaseObject(session._session.au) //обновляем объекты с виалона в нашей базе
    if (data) {
        const allCar = Object.entries(data)
        const dataKursor = await databaseService.getObjects()
        const validKursorData = dataKursor.filter(e => [...e.imei].length > 10)
        // Запускаем все функции параллельно
        await Promise.all([await updateParams(data, validKursorData)])
        console.log('выполнено')
        //, saveSensorsToBase(allCar, session)
    }
}
/*
async function saveSensorsToBase(allCar, session) {
    console.log('тут')
    console.time('write')
    const now = new Date();
    const nowTime = Math.floor(now.getTime() / 1000);

    for (const el of allCar[5][1]) {
        const timeBase = await databaseService.lostChartDataToBase(el.id)
        const oldTime = timeBase.length !== 0 ? Number(timeBase[0].data) : nowTime - 1;
        // Запускаем загрузку данных сообщений и данные датчиков параллельно

        let rr = await wialonService.loadIntervalDataFromWialon(el.id, oldTime + 1, nowTime, 'i')

        if (rr === undefined) {
            rr = await wialonService.loadIntervalDataFromWialon(el.id, oldTime + 1, nowTime, 'i')
        }
        let rez = await wialonService.getAllSensorsIdDataFromWialon(el.id)
        if (rez === undefined) {
            rez = await wialonService.getAllSensorsIdDataFromWialon(el.id)
        }
        let nameSens = await wialonService.getAllNameSensorsIdDataFromWialon(el.id)
        if (nameSens === undefined) {
            nameSens = await wialonService.getAllNameSensorsIdDataFromWialon(el.id)
        }
        if (!rr || rr.messages.length === 0 || rez && rez.length === 0) {
            null
        }
        else {
            while (rez && rr.messages.length !== rez.length) {
                console.log('повторно')
                //  console.log(session)
                [rr, rez, nameSens] = await Promise.all([
                    await wialonService.loadIntervalDataFromWialon(el.id, oldTime + 1, nowTime, 'i'),
                    await wialonService.getAllSensorsIdDataFromWialon(el.id, 'i'),
                    await wialonService.getAllNameSensorsIdDataFromWialon(el.id, 'i')
                ]);
            }

            const mass = [];
            const sort = [];
            const allArray = ggg(nameSens, rez, el.id)

            rr.messages.forEach((e, index) => {
                const geo = JSON.stringify([e.pos.y, e.pos.x]);
                mass.push([String(el.id), el.nm.replace(/\s+/g, ''), String(e.t), String(new Date(e.t * 1000)), String(e.pos.s), String(e.p.sats), geo, String(e.pos.c)]);
                const oil = detaly(allArray[index], 'Топливо')
                const pwr = detaly(allArray[index], 'Бортовое питание')
                const engine = detaly(allArray[index], 'Зажигание')
                const meliage = detaly(allArray[index], 'Одометр', 'Пробег')
                sort.push([el.id, el.nm.replace(/\s+/g, ''), String(e.t), geo, e.pos.s, e.p.sats, e.pos.c, oil, pwr, engine, meliage]);
            });
            const sens = rez.map(e => JSON.stringify(e));
            const arr = allArray.map(e => JSON.stringify(e));
            mass.forEach((el, index) => {
                el.push(sens[index]);
                el.push(arr[index])
            });
            await Promise.all([databaseService.saveChartDataToBase(mass), databaseService.saveSortDataToBase(sort)])
        }
        //  }
    }
    console.timeEnd('write')
    console.log('saveSensorsToBase end')
}

function detaly(data, str, str2) {
    if (!str2) {
        const res = data.reduce((acc, e) => {
            if (e[0] === str) {
                acc = e[2]
            }
            return acc
        }, 0)
        return res
    }
    else {
        const res = data.reduce((acc, e) => {
            if (e[0] === str && e.includes(str2) || e[0] === str && !e.includes(str2)) { // Проверяем содержание str в элементе с индексом 0
                acc = e[2]; // Присваиваем значение элемента с индексом 2 в acc
            }
            else if (e[0] === str2 && !e.includes(str)) {
                acc = e[2]
            }
            return acc;
        }, 0);

        return res
    }

}
function ggg(nameSens, rez, id) {
    if (rez && nameSens) {
        const nameSenz = Object.entries(nameSens.item.sens)
        const arrNameSens = [];
        nameSenz.forEach(el => {
            arrNameSens.push([el[1].n, el[1].p])
        })
        const allArr = rez.map((el) => {
            return arrNameSens.reduce((acc, it, index) => {
                acc.push([...it, Object.values(el)[index]])
                return acc
            }, [])
        })
        return allArr
    }
    else {
        return
    }
}*/

async function updateParams(data, kursor) {
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
    zaprosSpisokb(nameCar, res)
    const kursorObjects = await kursorService.getKursorObjects()
    const dataAll = res.concat(kursorObjects)

    if (res) {
        await statistika.popupProstoy(dataAll) //ловим простои
        await events.eventFunction(res) //ловим через вилаон заправки/сливы+потеря связи
        const summary = new SummaryStatistiks(dataAll)
        const global = await summary.init();
        const arraySummary = Object.entries(global)
        const now = new Date();
        const date = new Date(now);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const datas = `${year}-${month}-${day}`;
        await Promise.all(arraySummary.map(([idw, arrayInfo]) =>
            databaseService.summaryToBase(idw, arrayInfo, datas)
        ));
        //  hunterTime(dataAll)
    }

    console.timeEnd('updatedata')
    return 'updateData end'
}

const hunterTime = async (res) => {
    const now = new Date();
    const nowUnix = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime() / 1000);
    const previousDayUnix = nowUnix;
    const previousDayEndUnix = Math.floor(new Date(now).getTime() / 1000);
    structura.datas(res, previousDayEndUnix, previousDayUnix)
};

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
        const paramsRes = await queryDB(`SELECT name, value FROM params WHERE idw='${name[i][1]}' AND port='${name[i][4]}'`);
        const osiRes = await queryDB(`SELECT * FROM ifBar WHERE idw='${name[i][1]}'`);

        paramsRes.forEach(el => {
            modelUniqValues.forEach(model => {
                if (el.name === model.pressure) {
                    const integer = nameCar === 'А652УА198' ? parseFloat((el.value / 10).toFixed(1)) : el.value;
                    const osiBar = osiRes.find(osi => osi.idOs === model.osNumber);

                    const tempParam = paramsRes.find(param => param.name === model.temp);
                    if (tempParam) {
                        massItog.push([nameCar, model.pressure, parseFloat(integer), parseFloat(tempParam.value), osiBar, name[i][1], name[i][2], name[i][3]]);
                    }
                }
            });
        });
    }
    proverka(massItog);
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


