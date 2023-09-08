
const wialonService = require('../services/wialon.service.js')
const databaseService = require('../services/database.service');
const wialonModule = require('../modules/wialon.module');
const statistika = require('../modules/statistika.module');
const structura = require('../modules/structura.module.js')
const connection = require('../config/db')
const { createDate, convert } = require('../helpers')
const constorller = require('./data.controller.js')


const sessions = {}; // объект для хранения всех сессий*module.exports = {

exports.getSessiont = async (login) => {
    if (!sessions[login]) { // если нет сохраненной сессии для данного логина
        const token = await getTokenFromDB(login);
        const session = await wialonModule.login(token);
        console.log('Новая сессия для логина', login);
        sessions[login] = session; // сохраняем новую сессию
    }
    // console.log('Отдаем существующую сессию для логина', login);
    return sessions[login]; // возвращаем сохраненную сессию
};


exports.getData = async (req, res) => {
    const login = req.body.login
    try {
        const token = await getTokenFromDB(login)
        console.log(token)
        const session = await wialonModule.login(token);
        console.log('сессия' + ' ' + session)
        sessions[login] = session;
        res.json('сессия открыта')
        //  await updateParams(login);
        // setInterval(updateParams, 180000, login);
        //  console.log('повторка?')
        // setTimeout(test, 15000)

    } catch (err) {
        console.log(err);
        res.json('ошибка')
    }
}
//получаем логин, запрашиваем данные  по всем группам,
//далее запрашиваем параметры по id объекта,
//после достаем из базы нужные таблицы с моделями,
//колесами и параметрами,
//готовим данные и отправляем ответ на клиент который отрисовывает список
exports.dataSpisok = async (req, res) => {
    //  await databaseService.createIndexDataToDatabase()
    try {
        let login;
        if (req && req.body && req.body.login) {
            login = req.body.login
        }
        else {
            login = 'i'
        }
        const data = await wialonService.getAllGroupDataFromWialon(login);
        const aLLmassObject = [];
        const arrName = [];
        for (const elem of data.items) {
            const nameGroup = elem.nm;
            const nameObject = elem.u;
            const massObject = [];
            await Promise.all(nameObject.map(async (el, index) => {
                // console.log(el)
                try {
                    const all = await wialonService.getAllParamsIdDataFromWialon(el, login);
                    if (!all.item) {
                        return;
                    }
                    const objects = all.item.nm;
                    arrName.push(objects)
                    const prob = await databaseService.loadParamsViewList(objects, el);
                    const massObjectCar = await databaseService.dostupObject(login);
                    if (massObjectCar.includes(prob[0].message.replace(/\s+/g, ''))) {
                        prob.group = nameGroup;
                        massObject.push(prob);
                    }
                }
                catch (e) {
                    console.log(e)
                }
            }));
            const objectsWithGroup = massObject.map(obj => (Object.values({ ...obj, group: nameGroup })));
            aLLmassObject.push(objectsWithGroup);
            aLLmassObject.reverse();
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
async function getTokenFromDB(login) {
    return new Promise((resolve, reject) => {
        try {
            const selectBase = `SELECT tokenW FROM wialonSessions WHERE login = '${login}'`
            connection.query(selectBase, function (err, results) {
                if (err) {
                    console.log(err);
                    reject(err); // использование reject для ошибки
                } else if (results.length > 0) {
                    resolve(results[0].tokenW); // использование resolve для успешной операции
                } else {
                    resolve('Пользователь не найден'); // возвращает строку
                }
            })
        }
        catch (err) {
            console.log(err);
            reject(err); // использование reject для ошибки
        }
    })

}

exports.up = async (req, res) => {
    updateParams()
    res.json({ message: 'ок' })
}


exports.viewLogs = async (req, res) => {
    const login = req.body.login;
    console.log(login)
    const data = req.body.quantity ? await databaseService.quantitySaveToBase(login, req.body.quantity) : await databaseService.quantitySaveToBase(login)
    res.json(data)
}


let dataGlobal;
const test = async () => {
    // console.log('rr' + login)
    const data = await wialonService.getDataFromWialon('i')
    dataGlobal = data;
    updateParams(data)
    //  const data = dataSensToBase;
    const timeBase = await databaseService.lostChartDataToBase()
    const oldTime = Number(timeBase[0].data)
    const allCar = Object.entries(data)
    const now = new Date();
    const nowTime = Math.floor(now.getTime() / 1000);
    // let oldTime = !time ? 1689335912 : time
    // console.log(oldTime)
    // console.log(nowTime)
    for (const el of allCar[5][1]) {
        let rr = await wialonService.loadIntervalDataFromWialon(el.id, oldTime + 1, nowTime, 'i');
        let rez = await wialonService.getAllSensorsIdDataFromWialon(el.id, 'i');
        let nameSens = await wialonService.getAllNameSensorsIdDataFromWialon(el.id, 'i')
        if (rr.messages.length === 0 || rez && rez.length === 0) {
            // console.log('нет новый данных')
        }
        else {
            //   console.log(rr, rez)
            while (rez && rr.messages.length !== rez.length) {
                rr = await wialonService.loadIntervalDataFromWialon(el.id, oldTime + 1, nowTime, 'i');
                rez = await wialonService.getAllSensorsIdDataFromWialon(el.id, 'i');
                nameSens = await wialonService.getAllNameSensorsIdDataFromWialon(el.id, 'i')

            }
            // console.log(rr.messages.length);
            //   console.log(rez.length);
            const mass = [];
            allArray = ggg(nameSens, rez)
            console.log(el.id)
            console.log(allArray)
            rr.messages.forEach(e => {
                const geo = JSON.stringify([e.pos.y, e.pos.x]);
                mass.push([el.id, el.nm.replace(/\s+/g, ''), e.t, new Date(e.t * 1000), e.pos.s, e.p.sats, geo]);
            });
            const sens = rez.map(e => JSON.stringify(e));
            const arr = JSON.stringify(allArray)
            mass.forEach((el, index) => {
                el.push(sens[index]);
                el.push(arr)
            });
            await databaseService.saveChartDataToBase(mass);
            console.log('запись сделана по id' + ' ' + el.nm);
        }
    }
    console.log('запись окончена')
}
//setTimeout(test, 1000)
//setInterval(test, 300000)

const hunterTime = async () => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) { // если время 0 часов и 0 минут
        const nowUnix = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime() / 1000);
        const previousDayUnix = nowUnix - 3600 * 24;
        const previousDayEndUnix = nowUnix - 1;
        //   console.log(previousDayUnix, previousDayEndUnix);
        const res = await constorller.dataSpisok()
        structura.datas(res, previousDayEndUnix, previousDayUnix)
    }
};
//hunterTime();
setInterval(hunterTime, 50000)

function ggg(nameSens, rez) {
    if (rez) {
        const nameSenz = Object.entries(nameSens.item.sens)
        const arrNameSens = [];
        nameSenz.forEach(el => {
            arrNameSens.push([el[1].n, el[1].p])
        })
        //  console.log(rez)
        const valueSens = Object.values(rez[rez.length - 1])
        const allArr = [];
        arrNameSens.forEach((e, index) => {
            allArr.push([...e, valueSens[index]])
        })
        return allArr
    }
    else {
        return
    }

}
async function updateParams(data) {
    console.log('работаем?')
    data ? data : data = dataGlobal
    const nameCar = [];
    const allCar = Object.entries(data)
    allCar[5][1].forEach(async el => {
        const nameTable = el.nm.replace(/\s+/g, '');
        const idw = el.id;
        const speed = el.lmsg && el.lmsg.pos && el.lmsg.pos.s ? el.lmsg.pos.s : null;// проверка на наличие свойства lmsg и свойства pos.s
        const geo = el && el.pos && el.pos.x ? [el.pos.y, el.pos.x] : null;
        nameCar.push([el.nm.replace(/\s+/g, ''), idw, speed, geo]);
        const model = await databaseService.modelViewToBase(idw)
        let statusTSI;
        if (model[0] && model[0].tsiControll) {
            statusTSI = el.lmsg.p.pwr_ext > Number(model[0].tsiControll) ? 'ВКЛ' : 'ВЫКЛ';
        } else {
            statusTSI = '-';
        }
        const res = await engine(idw)
        let status;
        res.forEach(e => {
            if (e.includes('Зажигание'))
                status = e[2] === 1 ? 'ВКЛ' : 'ВЫКЛ'
        })
        const currentDate = new Date();
        const todays = Math.floor(currentDate.getTime() / 1000);
        const activePost = el.nm.replace(/\s+/g, '');
        const resSaveStatus = await databaseService.saveStatusToBase(activePost, idw, todays, statusTSI, todays, status);

        if (el.lmsg) {
            const sensor = Object.entries(el.lmsg.p);
            const time = new Date()
            //сохраняем параметры в бд
            const resSave = await databaseService.saveDataToDatabase(nameTable, el.id, sensor, time);
        }

    });
    ///передаем работы функции по формированию массива данных и проверки условий для записи данных по алармам в бд
    await zaprosSpisokb(nameCar)
    const res = await constorller.dataSpisok()
    const global = await statistika.startAllStatic(res)
    const prostoy = await statistika.popupProstoy(res)

    const arraySummary = Object.entries(global)
    const now = new Date();
    const date = new Date(now);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const datas = `${year}-${month}-${day}`;
    arraySummary.forEach(async el => {
        const idw = el[0]
        const arrayInfo = el[1]
        const res = await databaseService.summaryToBase(idw, arrayInfo, datas)
        console.log(res)
    })

}

async function engine(idw) {
    const resSensor = await wialonService.getAllNameSensorsIdDataFromWialon(idw, 'i');
    const nameSens = Object.entries(resSensor.item.sens)
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
        const selectBase2 = `SELECT name, value FROM params WHERE idw='${name[i][1]}'`;
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
                            massItog.push([name[i][0], modelUniqValues[k].pressure, parseFloat(integer), parseFloat(paramsRes[y].value), osiBar, name[i][1], name[i][2], name[i][3]]);
                        }
                    }
                }
            }
        }
    }
    proverka(massItog);
}

function queryDB(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (err, results) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}

function proverka(arr) {
    console.log('проверка')

    const time = new Date()
    arr.forEach(el => {
        if (el[4] === undefined) {
            return
        }
        else {
            let alarm;
            const sqls1 = `SELECT * FROM alarms WHERE idw=${el[5]} AND senspressure='${el[1]}'`
            connection.query(sqls1, function (err, results) {
                if (err) console.log(err);

                if (results.length === 0) {
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
                else if (results.length !== 0) {
                    //  console.log(el[0], el[1], el[2], 'таблицу видит')
                    if (el[6] > 5 && el[3] <= -50) {
                        if (results[results.length - 1].alarm == 'Потеря связи с датчиком') {
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
                            if (results[results.length - 1].bar === String(el[2]) && results[results.length - 1].alarm !== 'Потеря связи с датчиком') {
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
                            if (results[results.length - 1].bar === String(el[2]) && results[results.length - 1].alarm !== 'Потеря связи с датчиком') {
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
                            // console.log(el)
                            if (results[results.length - 1].alarm === 'Норма') {
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
            });
        }
    })
}