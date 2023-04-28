
const wialon = require('wialon');
const express = require('express');
const connection = require('./db')
const { allParams, geo } = require('./sort')
const nodemailer = require('nodemailer');


const { prms, prms2 } = require('./params');
//const { update } = require('../controllers/auth');
const app = express();
app.use(express.json());


//0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178-токен основной

const session = wialon().session;
let kluch;
function init(user) {
    if (user !== 'TDRMX') {
        kluch = '0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178'
    }
    if (user === 'TDRMX') {
        kluch = '7d21706dbf99ed8dd9257b8b1fcc5ab3FDEAE2E1E11A17F978AC054411BB0A0CBD9051B3'
    }
    session.start({ token: kluch })
        .catch(function (err) {
            console.log(err);
        })
        .then(function (data) {
            createTable();
            setInterval(createTable, 180000);

        })
}
//init()



function speed(t1, t2, int, id, res) {
    const prms2 = {
        "itemId": id,   //25343786,

        "timeFrom": t1,//t1,//timeFrom,//1657205816,
        "timeTo": t2,//t2,//nowDate,//2757209816,
        "flags": 1,
        "flagsMask": 65281,
        "loadCount": 161000//82710
    }

    session.request('messages/load_interval', prms2)
        .then(function (data) {
            const arr2 = Object.values(data);
            const arrIterTime = [];
            const arrIterTimeDate = [];
            const arrIterTimeDateU = [];
            arr2[1].forEach(el => {
                arrIterTime.push(el.t);
            })
            arrIterTime.forEach(item => {
                const dateObj = new Date(item * 1000);
                arrIterTimeDateU.push(dateObj);
                const utcString = dateObj.toUTCString();

                const arrTimeDate = utcString.slice(8, 24);
                arrIterTimeDate.push(arrTimeDate);
            })

            let t = 0;
            const arrIterTimeDateT = arrIterTimeDate.filter(e => (++t) % int === 0);
            const arrSpee = [];
            arr2[1].forEach(el => {
                arrSpee.push(el.pos.s)
            })
            let s = 0;
            const arrSpeed = arrSpee.filter(e => (++s) % int === 0)
            res.json({ arrSpeed, arrIterTimeDateT, arrIterTimeDateU })
        })
}





function createTable() {
    session.request('core/search_items', prms)
        .catch(function (err) {
            console.log(err);
        })
        .then(function (data) {
            const nameCar = [];
            const allCar = Object.entries(data);
            allCar[5][1].forEach(el => {
                nameCar.push([el.nm.replace(/\s+/g, ''), el.id])
                const nameTable = el.nm.replace(/\s+/g, '')
                const sensor = Object.entries(el.lmsg.p)
                //  console.log(el.id)
                postParametrs(nameTable, sensor)

            })

            zaprosSpisokb(nameCar)
        })
}

function postParametrs(name, param) {
    param.forEach(el => {
        el.unshift(name)
        el.push('new')
    })
    try {
        const selectBase = `SELECT name FROM params WHERE nameCar='${name}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            if (results.length === 0) {

                const sql = `INSERT INTO params(nameCar, name, value, status) VALUES?`;
                connection.query(sql, [param], function (err, results) {
                    if (err) console.log(err);
                });
            }
            else if (results.length > 0) {
                //   console.log('больше 0')
                const mas = []
                results.forEach(el => {
                    mas.push(el.name)
                });
                const paramName = [];
                param.forEach(el => {
                    paramName.push(el[1])
                })

                param.forEach(el => {
                    if (mas.includes(el[1])) {
                        const sql = `UPDATE params SET nameCar='${name}',name='${el[1]}', value='${el[2]}', status='true' WHERE nameCar='${name}' AND name='${el[1]}'`;
                        connection.query(sql, function (err, results) {
                            if (err) console.log(err);
                        });
                        return
                    }
                    if (!mas.includes(el[0])) {
                        const sql = `INSERT INTO params SET nameCar='${name}',name='${el[1]}', value='${el[2]}', status='new'`;
                        connection.query(sql, function (err, results) {
                            if (err) console.log(err);
                        });
                        return
                    }
                })
                mas.forEach(el => {
                    if (!paramName.includes(el)) {
                        const sql = `UPDATE params SET  status='false' WHERE nameCar='${name}' AND name='${el}'`;
                        connection.query(sql, function (err, results) {
                            if (err) console.log(err);
                        });
                    }
                })
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}



function getMainInfo(name, res) {
    console.log('частота запросов' + new Date())
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
    session.request('core/search_items', prms)
        .catch(function (err) {
            console.log(err);
        })
        .then(function (data) {
            if (data) {
                const allCar = Object.values(data);
                allCar[5].forEach(el => {
                    if (el.nm === name) {
                        const geoX = el.pos.x
                        const geoY = el.pos.y
                        res.json({ geoX, geoY })
                    }
                })

            }

        })
}
const convert = (ob) => {
    const uniq = new Set(ob.map(e => JSON.stringify(e)));
    return Array.from(uniq).map(e => JSON.parse(e));
}

function zaprosSpisokb(name) {
    const massItog = [];
    // console.log(name)
    name.forEach(itey => {
        const nameCar = itey[0]
        try {
            const selectBase = `SELECT tyresdiv, pressure,temp, osNumber FROM tyres WHERE nameCar='${nameCar}'`
            connection.query(selectBase, function (err, results) {
                if (err) console.log(err);
                if (results === undefined) {
                    console.log('нет таблицы')
                }
                else {
                    const params = results
                    const modelUniqValues = convert(params)
                    //   console.log(modelUniqValues)
                    try {
                        const selectBase = `SELECT name, value FROM params WHERE nameCar='${nameCar}'`
                        connection.query(selectBase, function (err, results) {
                            if (err) console.log(err);
                            const data = results
                            let integer;
                            let osiBar;
                            try {
                                const selectBase = `SELECT * FROM ifBar WHERE nameCar='${nameCar}'`
                                connection.query(selectBase, function (err, results) {
                                    if (err) console.log(err)
                                    //  console.log(results)
                                    const osi = results
                                    //   console.log(osi)
                                    data.forEach((el) => {
                                        modelUniqValues.forEach((item) => {
                                            if (el.name == item.pressure) {
                                                if (nameCar === 'А652УА198') {
                                                    integer = parseFloat((el.value / 10).toFixed(1))
                                                }
                                                else {
                                                    integer = el.value
                                                }
                                                osi.forEach(el => {
                                                    if (el.idOs === item.osNumber) {
                                                        osiBar = el
                                                    }
                                                })
                                                data.forEach((it) => {
                                                    if (it.name === item.temp) {
                                                        massItog.push([itey[0], item.pressure, parseFloat(integer), parseFloat(it.value), osiBar, itey[1]])
                                                    }
                                                })
                                            }
                                        })
                                    })
                                })
                            }
                            catch (e) {
                                console.log(e)
                            }
                        })
                    }

                    catch (e) {
                        console.log(e)
                    }
                }
            })
        }
        catch (e) {
            console.log(e)
        }
    })
    setTimeout(proverka, 1000, massItog)
}


function createDate() {
    let today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
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
    // console.log(arr)
    let time = new Date()
    arr.forEach(el => {
        if (el[4] === undefined) {
            return
        }
        else {

            let alarm;
            const name = 'alarm' + el[0] + el[1]
            const sqls1 = `SELECT * FROM alarms WHERE name='${el[0]}' AND senspressure='${el[1]}'`
            connection.query(sqls1, function (err, results) {
                //  console.log(results)
                if (err) console.log(err);
                if (results.length === 0) {
                    if (el[3] == -50 || el[3] == -51 || el[3] == -128) {
                        console.log(el + ' ' + 'таблица нет, аларм есть. потеря связи с датчиком' + ' ' + time)
                        const data = createDate()
                        alarm = 'Потеря связи с датчиком'
                        alarmBase(data, el, alarm)
                        return
                    }
                    else {
                        if (el[2] <= Number(el[4].knd)) {
                            console.log(el[2])
                            console.log(Number(el[4].knd))
                            console.log(el + ' ' + 'таблица нет, аларм есть' + ' ' + time)
                            const data = createDate()
                            alarm = 'Критически низкое давление'
                            alarmBase(data, el, alarm)
                            return
                        }
                        if (el[2] >= Number(el[4].kvd)) {
                            //   console.log(el + ' ' + 'таблица нет, аларм есть' + ' ' + time)
                            const data = createDate()
                            alarm = 'Критически высокое давление'
                            alarmBase(data, el, alarm)
                            return
                        }
                        else {
                            //   console.log(el + ' ' + 'таблицы нет, аларма нет' + ' ' + time)
                            return
                        }

                    }
                }
                else if (results.length !== 0) {
                    if (el[3] == -50 || el[3] == -51 || el[3] == -128) {

                        //   console.log(results[results.length - 1].alarm)
                        //  console.log(el)
                        if (results[results.length - 1].alarm == 'Потеря связи с датчиком') {
                            //   console.log('таблица есть, аларм есть, потеря связи с датчиком, повторные данные')
                            return
                        } else {
                            //   console.log('таблица есть, изменение аларма,потеря связи с датчиком ')
                            const data = createDate()
                            alarm = 'Потеря связи с датчиком'
                            alarmBase(data, el, alarm)
                        }
                        return
                    }
                    else {
                        if (el[2] <= Number(el[4].knd)) {
                            //  console.log(el[2])

                            //  console.log(Number(results[results.length - 1].bar))
                            //  console.log(el)
                            if (Number(results[results.length - 1].bar == el[2]) && results[results.length - 1].alarm !== 'Потеря связи с датчиком') {
                                //   console.log(el + ' ' + 'таблица есть, аларм есть, повторные данные' + ' ' + time)
                                //  return
                            } else {
                                //    console.log(el + ' ' + 'таблица есть, аларм есть, изменение аларма N' + ' ' + time)
                                const data = createDate()
                                alarm = 'Критически низкое давление'
                                alarmBase(data, el, alarm)
                                //    return
                            }
                            return
                        }
                        if (el[2] >= Number(el[4].kvd)) {

                            // console.log(results[results.length - 1].bar)

                            if (Number(results[results.length - 1].bar == el[2]) && results[results.length - 1].alarm !== 'Потеря связи с датчиком') {
                                //   console.log(el + ' ' + 'таблица есть, аларм есть, повторные данные' + ' ' + time)
                                //   return
                            } else {
                                //  console.log(el + ' ' + 'таблица есть, аларм есть, изменение аларма V' + ' ' + time)
                                const data = createDate()
                                alarm = 'Критически высокое давление'
                                alarmBase(data, el, alarm)
                                // return
                            }
                            return
                        }
                        else if (el[2] >= 6 || el[2] <= 10) {
                            // console.log(el)
                            if (results[results.length - 1].alarm === 'Норма') {
                                //   console.log(el + ' ' + 'таблица есть, аларма нет, повторные данные' + ' ' + time)
                                // return
                            } else {
                                //  console.log(el + ' ' + 'таблица есть, аларма нет, аларм истек-норма' + ' ' + time)
                                const data = createDate()
                                alarm = 'Норма'
                                alarmBase(data, el, alarm)
                                //return
                            }
                        }
                    }
                }
                //  res.json(results);
            });
        }
    })


}

function alarmBase(data, tyres, alarm) {
    console.log('данные по алармам')
    const dannie = data.concat(tyres)
    const name = dannie[2]
    dannie.push(alarm)
    console.log(dannie)
    dannie.splice(5, 1)
    // console.log(dannie)
    const value = [dannie];

    const tableModel = 'alarm' + dannie[1] + dannie[2]
    try {

        const sqls = `INSERT INTO alarms (data, name, senspressure, bar,
                            temp, alarm) VALUES?`;
        connection.query(sqls, [value], function (err, results) {
            if (err) console.log(err);
        });
    }
    catch (e) {
        console.log(e)
    }

}



function mail(value) {
    let smtpTransport;
    try {
        smtpTransport = nodemailer.createTransport({
            host: 'smtp.yandex.ru',
            port: 465,
            secure: true, // true for 465, false for other ports 587
            auth: {
                user: "certiss@yandex.ru",
                pass: "Alexsi33"
            }
        });
    } catch (e) {
        return console.log('Error: ' + e.name + ":" + e.message);
    }

    let mailOptions = {
        from: 'certiss@yandex.ru', // sender address
        to: 'soulmaers@gmail.com', // list of receivers
        subject: 'Аларм', // Subject line
        text: 'колесо 1', // plain text body

    };

    smtpTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            // return console.log(error);
            return console.log(error);
        } else {
            console.log('ура');

        }
        // res.render('feed-ok', { msg: 'В ближайшее время мы с Вами свяжемся и ответим на все вопросы' });
        ///   res.redirect('http://baedeker.club')




        /*
            // создаем объект transporter с параметрами SMTP сервера
            let transporter = nodemailer.createTransport({
                host: 'smtp.yandex.ru',
                port: 465,
                secure: true, // используем SSL
                auth: {
                    user: 'certiss@ya.ru', // адрес электронной почты отправителя
                    pass: 'Alexsi33' // пароль электронной почты отправителя
                }
            });
        
            // объект с параметрами отправки письма
            let mailOptions = {
                from: 'certiss@ya.ru', // адрес электронной почты отправителя
                to: 'soulaers@gmail.com', // адрес электронной почты получателя
                subject: 'Аларм', // тема письма
                text: 'Test email body' // текст письма
            };
        
            // отправляем письмо
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });*/

    })
}
//mail()
//const y = c
module.exports = {
    getMainInfo,
    createTable,
    init,
    speed


}

createDateTest()
function createDateTest() {

    let today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    today = day + '.' + month + '.' + year;
    let time = new Date();
    const hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    time = hour + ':' + minutes

    const todays = today + ' ' + time
    console.log(todays)
    return [todays]
    // console.log(today)
}