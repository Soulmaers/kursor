
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
    const time = Math.floor(new Date().getTime() / 1000);
    if (data) {
        const promises = data.items.flatMap((elem) => {
            const nameGroup = elem.nm;
            const idGroup = elem.id;
            const nameObject = elem.u;
            return nameObject.map(async (el) => {
                try {
                    const all = await wialonService.getAllParamsIdDataFromWialon(el);
                    const phone = await wialonService.getUniqImeiAndPhoneIdDataFromWialon(el);
                    if (!all.item || !phone.item) {
                        return;
                    }
                    return {
                        login: login,
                        data: String(time),
                        idg: String(idGroup),
                        name_g: nameGroup,
                        idObject: String(all.item.id),
                        nameObject: String(all.item.nm),
                        imei: phone.item.uid ? String(phone.item.uid) : null,
                        phone: phone.item.ph ? String(phone.item.ph) : null
                    };
                } catch (error) {
                    console.error(error);
                    return;
                }
            });

        });
        const results = await Promise.all(promises);
        return results.filter(Boolean);
    }
    return [];
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



exports.start = async (session) => {
    console.log('старт')
    await getWialonSetToBaseObject(session._session.au) //обновляем объекты с виалона в нашей базе
    console.time('data')
    const data = await wialonService.getDataFromWialon()
    console.timeEnd('data')
    if (data) {
        const allCar = Object.entries(data)
        const arr = allCar[5][1].map(it => it.id)
        const resa = await wialonService.getUpdateLastAllSensorsIdDataFromWialon(arr)
        const event = Object.entries(resa).map(([key, value]) => {
            return {
                [key]: [
                    ['speed', 'speed', value[1] && value[1].trips && value[1].trips.length !== 0 ? value[1].trips.curr_speed : null],
                    ['state', 'state', value[1] && value[1].trips && value[1].trips.length !== 0 ? value[1].trips.state : null],
                    ['lasttime', 'listtime', value[1] && value[1].trips && value[1].trips.length !== 0 ? value[1].trips.m : null]
                ]
            };
        });
        const promises = allCar[5][1].map(async (el) => {
            const sats = el.lmsg && el.lmsg.p && el.lmsg.p.sats ? el.lmsg.p.sats : '-'
            const res = await engines(el.id);
            if (res && resa) {
                await saveStatus(res, el)
                const foundObject = event.find(obj => obj.hasOwnProperty(el.id));
                const all = res.concat(...Object.values(foundObject))
                all.push(['Спутники', 'sats', sats])

                await databaseService.setSensorsWialonToBase(session._session.au, el.id, all);
            }
        })

        const dataKursor = await databaseService.getObjects()
        const validKursorData = dataKursor.filter(e => [...e.imei].length > 10)
        // Запускаем все функции параллельно
        await Promise.all([promises, await updateParams(data, validKursorData), saveSensorsToBase(allCar, session)])
        console.log('выполнено')
    }

}

async function saveSensorsToBase(allCar, session) {
    console.log('тут')
    console.time('write')
    const now = new Date();
    const nowTime = Math.floor(now.getTime() / 1000);

    for (const el of allCar[5][1]) {
        //   if (el.id === 25766831) {
        const timeBase = await databaseService.lostChartDataToBase(el.id)
        //  console.log(el.nm, timeBase)
        const oldTime = timeBase.length !== 0 ? Number(timeBase[0].data) : nowTime - 1;
        // Запускаем загрузку данных сообщений и данные датчиков параллельно
        //let [rr, rez, nameSens] = await Promise.all([

        let rr = await wialonService.loadIntervalDataFromWialon(el.id, oldTime + 1, nowTime, 'i')
        if (rr === undefined) {
            rr = await wialonService.loadIntervalDataFromWialon(el.id, oldTime + 1, nowTime, 'i')
        }
        //    console.log(new Date(), el.nm, rr.messages.length)
        let rez = await wialonService.getAllSensorsIdDataFromWialon(el.id, 'i')
        if (rez === undefined) {
            rez = await wialonService.getAllSensorsIdDataFromWialon(el.id, 'i')
        }
        //  console.log(new Date(), el.nm, rez.length)
        let nameSens = await wialonService.getAllNameSensorsIdDataFromWialon(el.id, 'i')
        if (nameSens === undefined) {
            nameSens = await wialonService.getAllNameSensorsIdDataFromWialon(el.id, 'i')
        }
        // console.log(new Date(), el.nm, nameSens.item.flags)
        //  ]);

        if (!rr || rr.messages.length === 0 || rez && rez.length === 0) {
            null
        }
        else {
            while (rez && rr.messages.length !== rez.length) {
                console.log('повторно')
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
async function saveStatus(res, el) {
    const idw = el.id
    const model = await databaseService.modelViewToBase(idw)
    let statusTSI;
    if (model[0] && model[0].tsiControll) {
        statusTSI = el.lmsg.p.pwr_ext > Number(model[0].tsiControll) ? 'ВКЛ' : 'ВЫКЛ';
    } else {
        statusTSI = '-';
    }
    let status;
    res.forEach(e => {
        if (e.includes('Зажигание'))
            status = e[2] === 1 ? 'ВКЛ' : 'ВЫКЛ'
    })
    const currentDate = new Date();
    const todays = Math.floor(currentDate.getTime() / 1000);
    const activePost = el.nm.replace(/\s+/g, '');
    await databaseService.saveStatusToBase(activePost, idw, todays, statusTSI, todays, status);
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
}

async function updateParams(data, kursor) {
    console.time('updatedata')

    const currentTime = new Date(); // Assume the current time is the same for all elements in this context.
    const dataKursor = await Promise.allSettled(kursor.map(async (e) => {
        const res = await databaseService.getParamsKursor(e.idObject);
        if (res.length !== 0) {
            return { id: e.idObject, port: res[0].port, name: e.nameObject, params: res.map(obj => Object.entries(obj)).flat() };
        } else {
            return null;
        }
    })).then(results => results.filter(result => result !== null));

    const fulfilledPromises = dataKursor
        .filter(promise => promise.status === 'fulfilled')
        .map(promise => promise.value);
    const kursorParams = fulfilledPromises;
    const dataKursorPromises = [];

    for (const el of kursorParams) {
        dataKursorPromises.push(databaseService.saveDataToDatabase(el.name, el.id, el.port, el.params, currentTime));
    };

    const allCar = Object.entries(data)
    const nameCar = allCar[5][1].map(el => {
        const nameTable = el.nm.replace(/\s+/g, '');
        const idw = el.id;
        const port = 'wialon';
        const speed = el.lmsg?.pos?.s || null;
        const geo = el.pos?.x ? JSON.stringify([el.pos.y, el.pos.x]) : null;
        return [nameTable, idw, speed, geo, port];
    });

    const databasePromises = [];
    for (const el of allCar[5][1]) {
        if (el.lmsg) {
            const nameTable = el.nm.replace(/\s+/g, '');
            const sensor = Object.entries(el.lmsg.p);
            databasePromises.push(databaseService.saveDataToDatabase(nameTable, el.id, 'wialon', sensor, currentTime));
        }
    };
    await Promise.all([databasePromises, dataKursorPromises]);
    // передаем работы функции по формированию массива данных и проверки условий для записи данных по алармам в бд
    await zaprosSpisokb(nameCar)
    const res = await constorller.dataSpisok()
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
        hunterTime()
    }

    console.timeEnd('updatedata')
    return 'updateData end'
}


const hunterTime = async () => {
    const now = new Date();
    //   if (now.getHours() === 0 && now.getMinutes() === 0) { // если время 0 часов и 0 минут
    const nowUnix = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime() / 1000);
    const previousDayUnix = nowUnix;
    const previousDayEndUnix = Math.floor(new Date(now).getTime() / 1000);
    const res = await constorller.dataSpisok()
    structura.datas(res, previousDayEndUnix, previousDayUnix)
    //   }
};


async function engines(idw) {
    const resSensor = await wialonService.getAllNameSensorsIdDataFromWialon(idw, 'i');


    if (resSensor !== undefined) {
        const nameSens = Object.entries(resSensor.item.sens)
        //  console.log(nameSens)
        const arrNameSens = [];
        nameSens.forEach(el => {
            arrNameSens.push([el[1].n, el[1].p])
        })
        const res = await wialonService.getLastAllSensorsIdDataFromWialon(idw, 'i');
        if (res) {
            const valueSens = [];
            Object.entries(res).forEach(e => {
                valueSens.push(e[1])
            })
            const allArr = [];
            arrNameSens.forEach((e, index) => {
                allArr.push([...e, valueSens[index]])
            })

            return allArr
        }
    }
}

async function zaprosSpisokb(name) {
    const massItog = [];
    for (let i = 0; i < name.length; i++) {
        const nameCar = name[i][0];
        const selectBase = `SELECT tyresdiv, pressure, temp, osNumber FROM tyres WHERE idw='${name[i][1]}'`;
        let tyreRes = await queryDB(selectBase);
        if (tyreRes === undefined) {
            console.log('нет таблицы');
            continue;
        }
        const params = tyreRes;
        const modelUniqValues = convert(params);

        const selectBase2 = `SELECT name, value FROM params WHERE idw='${name[i][1]}' AND port='${name[i][4]}' `;
        let paramsRes = await queryDB(selectBase2);
        let integer;
        let osiBar;
        for (let j = 0; j < paramsRes.length; j++) {
            const selectBase3 = `SELECT * FROM ifBar WHERE idw='${name[i][1]}'`;
            let osiRes = await queryDB(selectBase3);
            const osi = osiRes;
            let el = paramsRes[j];
            for (let k = 0; k < modelUniqValues.length; k++) {
                if (el.name == modelUniqValues[k].pressure) {
                    if (nameCar === 'А652УА198') {
                        integer = parseFloat((el.value / 10).toFixed(1));
                    } else {
                        integer = el.value;
                    }
                    for (let z = 0; z < osi.length; z++) {
                        if (osi[z].idOs === modelUniqValues[k].osNumber) {
                            osiBar = osi[z];
                        }
                    }
                    for (let y = 0; y < paramsRes.length; y++) {
                        if (paramsRes[y].name === modelUniqValues[k].temp) {
                            //   console.log(name)
                            massItog.push([name[i][0], modelUniqValues[k].pressure, parseFloat(integer), parseFloat(paramsRes[y].value), osiBar, name[i][1], name[i][2], name[i][3]]);
                        }
                    }
                }
            }
        }
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




// console.log(massObject)

//   console.log(aLLmassObject2)
//new

/*
const data = await wialonService.getAllGroupDataFromWialon();
const aLLmassObject = [];
const arrName = [];
for (const elem of data.items) {
    const nameGroup = elem.nm;
    const idGroup = elem.id
    const nameObject = elem.u;
    const massObject = [];
    await Promise.all(nameObject.map(async el => {
        try {
            const all = await wialonService.getAllParamsIdDataFromWialon(el, login);
            //  console.log(all)
            if (!all.item) {
                return;
            }
            const objects = all.item.nm;
            const idw = all.item.id
            arrName.push([objects, idw])
            const prob = await databaseService.loadParamsViewList(objects, el);
            const massObjectCar = await databaseService.dostupObject(login);
            if (massObjectCar.includes(`${prob[4]}`)) {
                prob.group = nameGroup;

                massObject.push(prob);
            }

        }
        catch (e) {
            console.log(e)
        }
    }));
    const objectsWithGroup = massObject.map(obj => (Object.values({ ...obj, group: nameGroup, idGroup: idGroup })));
    aLLmassObject.push(objectsWithGroup);
    aLLmassObject.reverse();
}*/