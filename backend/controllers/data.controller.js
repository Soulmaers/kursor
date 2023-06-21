
const wialonService = require('../services/wialon.service.js')
const databaseService = require('../services/database.service');
const wialonModule = require('../modules/wialon.module');
const connection = require('../config/db')
const { createDate, convert } = require('../helpers')



const sessions = {}; // объект для хранения всех сессий*module.exports = {

exports.getSessiont = (login) => {
    return sessions[login];
}

exports.getData = async (req, res) => {
    const login = req.body.login
    try {
        const token = await getTokenFromDB(login)
        const session = await wialonModule.login(token);
        sessions[login] = session;
        res.json('сессия открыта')
        await updateParams(login);
        setInterval(updateParams, 60000, login);

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
    try {
        const login = req.body.login
        const data = await wialonService.getAllGroupDataFromWialon(login);
        const aLLmassObject = [];
        const arrName = [];
        for (const elem of data.items) {
            const nameGroup = elem.nm;
            const nameObject = elem.u;
            const massObject = [];
            await Promise.all(nameObject.map(async (el, index) => {
                const all = await wialonService.getAllParamsIdDataFromWialon(el, login);
                if (!all.item.nm) {
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
            }));
            const objectsWithGroup = massObject.map(obj => (Object.values({ ...obj, group: nameGroup })));
            aLLmassObject.push(objectsWithGroup);
            aLLmassObject.reverse();
        }
        await res.json({ response: { aLLmassObject, arrName } });
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


async function updateParams(login) {
    //запрашиваем данные параметры по обектам с виалона
    const data = await wialonService.getDataFromWialon(login)
    const nameCar = [];
    const allCar = Object.entries(data)
    allCar[5][1].forEach(async el => {
        const nameTable = el.nm.replace(/\s+/g, '');
        const idw = el.id;
        const speed = el.lmsg.pos ? el.lmsg.pos.s : null; // проверка на наличие свойства lmsg и свойства pos.s
        nameCar.push([el.nm.replace(/\s+/g, ''), idw, speed]);
        if (el.lmsg) {
            const sensor = Object.entries(el.lmsg.p);
            //сохраняем параметры в бд
            const resSave = await databaseService.saveDataToDatabase(nameTable, el.id, sensor);
        }
    });
    ///передаем работы функции по формированию массива данных и проверки условий для записи данных по алармам в бд
    await zaprosSpisokb(nameCar)
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
                            massItog.push([name[i][0], modelUniqValues[k].pressure, parseFloat(integer), parseFloat(paramsRes[y].value), osiBar, name[i][1], name[i][2]]);
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
                            console.log(el + ' ' + 'таблицы нет, аларма нет' + ' ' + time)
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