
const wialonService = require('../services/wialon.service.js')
const databaseService = require('../services/database.service');
const wialonModule = require('../modules/wialon.module');
const connection = require('../config/db')
const { createDate, convert } = require('../helpers')
//const { init } = require('../wialon.js')

let getSession;
let getLogin;

exports.getSess = () => {
    return getSession
}
exports.getLog = async () => {
    let login = getLogin;
    if (!login) {
        // Ждем, пока login будет определен в getData
        await new Promise(resolve => setTimeout(resolve, 100));
        login = getLogin;
    }
    console.log(login + '..' + 'лог')
    return login;
};
exports.getData = async (req, res) => {
    console.log('редирект1')
    console.log(req.params.role)
    const login = req.params.login
    const role = req.params.role
    //получаем логин и роль и рендерим страницу
    res.render('in.ejs', {
        user: login,
        role: role
    })
    //init(login)
    try {
        let kluch;
        if (login !== 'TDRMX' || !login) {
            kluch = '0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178'
        }
        if (login === 'TDRMX') {
            kluch = '7d21706dbf99ed8dd9257b8b1fcc5ab3FDEAE2E1E11A17F978AC054411BB0A0CBD9051B3'
        }
        //по токену запрашиваем сессию
        console.log('1')
        const session = await wialonModule.login(kluch);
        getSession = session
        getLogin = login
        console.log(getLogin)
        //передаем сессию в основную  функцию для запроса данных
        setInterval(updateParams, 60000, session)
        await updateParams(session)
    }
    catch (err) {
        console.log(err)
    }
}


async function updateParams(session) {
    //запрашиваем данные параметры по обектам с виалона
    const data = await wialonService.getDataFromWialon(session)
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
    });//возвращаем результат работы функции по формированию массива данных и проверки условий для записи данных по алармам в бд
    return await zaprosSpisokb(nameCar)
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
                        //  console.log(el + ' ' + 'таблица нет, аларм есть. потеря связи с датчиком' + ' ' + time)
                        const data = createDate()
                        alarm = 'Потеря связи с датчиком'
                        //записываем данные в бд
                        databaseService.alarmBase(data, el, alarm)
                        return
                    }
                    else {

                        if (el[2] <= Number(el[4].knd) && el[3] > -50) {
                            // console.log(el + ' ' + 'таблица нет, аларм есть/ Критически низкое давление' + ' ' + time)
                            const data = createDate()
                            alarm = 'Критически низкое давление'
                            console.log('КРАН!')
                            databaseService.alarmBase(data, el, alarm)
                            return
                        }
                        if (el[2] >= Number(el[4].kvd) && el[3] > -50) {
                            //  console.log(el + ' ' + 'таблица нет, аларм есть/ Критически высокое давление' + ' ' + time)
                            const data = createDate()
                            alarm = 'Критически высокое давление'
                            databaseService.alarmBase(data, el, alarm)
                            return
                        }
                        else {
                            // console.log(el + ' ' + 'таблицы нет, аларма нет' + ' ' + time)
                            return
                        }
                    }
                }
                else if (results.length !== 0) {
                    // console.log(el[0], el[1], el[2], 'таблицу видит')
                    if (el[6] > 5 && el[3] <= -50) {
                        if (results[results.length - 1].alarm == 'Потеря связи с датчиком') {
                            //    console.log('-3')
                            //    console.log(el + ' ' + 'таблица есть, аларм есть, потеря связи с датчиком, повторные данные')
                            return
                        } else {
                            //   console.log('-2')
                            //   console.log(el + ' ' + 'таблица есть, изменение аларма,потеря связи с датчиком ')
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
                                //   console.log(el + ' ' + 'таблица есть, аларм есть, повторные данные N' + ' ' + time)
                                return
                            } else {
                                //   console.log('-33')
                                //    console.log(el + ' ' + 'таблица есть, аларм есть, изменение аларма N' + ' ' + time)
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
                                //  console.log(el + ' ' + 'таблица есть, аларм есть, повторные данные V' + ' ' + time)
                                return
                            } else {
                                //   console.log('-5')
                                //   console.log(el + ' ' + 'таблица есть, аларм есть, изменение аларма V' + ' ' + time)
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
                                //  console.log(el + ' ' + 'таблица есть, аларма нет, аларм истек-норма' + ' ' + time)
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