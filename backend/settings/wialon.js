
const wialon = require('wialon');
const express = require('express');
const connection = require('./db')
const { allParams, geo } = require('./sort')

const { prms, prms2 } = require('./params')
const app = express();
app.use(express.json());


//0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178-токен основной

const session = wialon().session;
let kluch;
function init(user) {
    // console.log(typeof user)
    if (user !== 'TDRMX') {
        // console.log('старт1')
        kluch = '0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178'
    }
    if (user === 'TDRMX') {
        // console.log('старт2')
        kluch = '7d21706dbf99ed8dd9257b8b1fcc5ab3FDEAE2E1E11A17F978AC054411BB0A0CBD9051B3'
    }
    // console.log(user)
    // console.log('init')
    session.start({ token: kluch })
        .catch(function (err) {
            console.log(err);
        })
        .then(function (data) {
            //  console.log('обновление')
            // setInterval(getMainInfo, 5000);
            createTable();
            setInterval(createTable, 30000);
            //  saprosGeo()
        })
}
//init()

function createTable() {

    console.log('go')
    session.request('core/search_items', prms)
        .catch(function (err) {
            console.log(err);
        })
        .then(function (data) {
            const nameCar = [];
            const allCar = Object.entries(data);
            allCar[5][1].forEach(el => {
                nameCar.push(el.nm.replace(/\s+/g, ''))
                const nameTable = el.nm.replace(/\s+/g, '')
                const sensor = Object.entries(el.lmsg.p)
                console.log(sensor.length)
                createNameTable(nameTable)
                postParametrs(nameTable, sensor)


            })
            zaprosSpisokb(nameCar)
        })
}

function createNameTable(name) {
    const sql = `create table if not exists ${name}(
         id int(255) primary key auto_increment,
         name varchar(255) not null,
         value varchar(255) not null
       )`;
    connection.query(sql, function (err, results) {
        if (err) console.log(err);
        // else console.log("Таблица создана");
    })
}

function postParametrs(name, param) {
    console.log('go2')
    const selectBase = `SELECT id FROM ${name} WHERE 1`
    connection.query(selectBase, function (err, results) {
        if (err) console.log(err);
        if (results.length < 1) {
            console.log('создаем')
            const sql = `INSERT INTO ${name}(name,value) VALUES?`;
            connection.query(sql, [param], function (err, results) {
                if (err) console.log(err);
            });
            //   connection.end();
        }
        else if (results.length > 0) {
            console.log('старт')
            let count = 0;
            //  console.log(param)
            param.forEach(el => {
                count++
                const sql = `UPDATE ${name} SET name='${el[0]}', value='${el[1]}' WHERE id=${count}`;
                connection.query(sql, function (err, results) {
                    if (err) console.log(err);
                });
                //  console.log('готово')
                //  connection.end();
            })
        }
    });
}



function getMainInfo(name, res) {
    // let geoX;
    // let geoY;
    console.log('запуск')
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
            const allCar = Object.values(data);
            allCar[5].forEach(el => {
                if (el.nm === name) {
                    const geoX = el.pos.x
                    const geoY = el.pos.y
                    console.log(geoX, geoY)
                    res.json({ geoX, geoY })
                }
            })
        })
}




const convert = (ob) => {
    const uniq = new Set(ob.map(e => JSON.stringify(e)));
    return Array.from(uniq).map(e => JSON.parse(e));
}




function zaprosSpisokb(name) {
    const massItog = [];
    name.forEach(itey => {
        const nameCar = 'tyres' + itey
        try {
            const selectBase = `SELECT tyresdiv, pressure,temp FROM ${nameCar} WHERE 1`
            connection.query(selectBase, function (err, results) {
                if (err) console.log(err);
                const params = results
                const modelUniqValues = convert(params)
                try {
                    const selectBase = `SELECT name, value FROM ${itey} WHERE 1`
                    connection.query(selectBase, function (err, results) {
                        if (err) console.log(err);
                        const data = results
                        let integer;
                        data.forEach((el) => {
                            modelUniqValues.forEach((item) => {
                                //   console.log(item.pressure)
                                if (el.name == item.pressure) {

                                    if (itey == 'PressurePro933') {
                                        integer = parseFloat((el.value * 0.069).toFixed(1))
                                    }
                                    else {
                                        integer = el.value
                                    }
                                    data.forEach((it) => {
                                        if (it.name === item.temp) {
                                            massItog.push([itey, item.pressure, parseFloat(integer), parseFloat(it.value)])
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
    })
    setTimeout(proverka, 1000, massItog)
}


function createDate() {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    today = dd + '.' + mm + '.' + yyyy;
    let time = new Date();
    const hh = String(time.getHours()).padStart(2, '0');
    const min = String(time.getMinutes() + 1).padStart(2, '0'); //January is 0!
    time = hh + '.' + min
    return [today, time]
    // console.log(today)
}


//let count = 0;
function proverka(arr) {
    console.log(arr)
    arr.forEach(el => {
        console.log(el[4])
        let alarm;
        const name = 'alarm' + el[0] + el[1]
        console.log(name)
        // const tableModel = 'alarm' + name
        const sqls1 = `SELECT data, time, senspressure, bar, temp, alarm  FROM ${name} WHERE 1`
        connection.query(sqls1, function (err, results) {
            if (err) console.log(err);
            if (results == undefined) {

                /*
                if (el[3] == -50 || el[3] == -51 || el[3] == -128) {
                    console.log('таблица нет, аларм есть')
                    const data = createDate()
                    alarm = 'Потеря связи с датчиком'
                    alarmBase(data, el, alarm)
                }*/
                //  else {
                if (el[2] < 6) {
                    console.log('таблица нет, аларм есть')
                    const data = createDate()
                    alarm = 'Критически низкое давление'
                    alarmBase(data, el, alarm)
                }
                if (el[2] > 10) {
                    console.log('таблица нет, аларм есть')
                    const data = createDate()
                    alarm = 'Критически высокое давление'
                    alarmBase(data, el, alarm)
                }
                else {
                    console.log('таблицы нет, аларма нет')
                    return
                }

                //     }

            }
            else {
                /*
                if (el[3] == -50 || el[3] == -51 || el[3] == -128) {
                    console.log('таблица есть, аларм есть')
                    console.log(results[results.length - 1].temp)
                    console.log(el)
                    if (results[results.length - 1].temp == el[3]) {
                        console.log('повторные данные')
                        return
                    } else {
                        console.log('таблица есть, изменение аларма')
                        const data = createDate()
                        alarm = 'Потеря связи с датчиком'
                        alarmBase(data, el, alarm)
                    }
                }
                else {*/
                if (el[2] < 6) {
                    console.log('таблица есть, аларм есть')
                    console.log(results[results.length - 1].bar)
                    console.log(el)
                    if (results[results.length - 1].bar == el[2] && results[results.length - 1].alarm !== 'Потеря связи с датчиком') {
                        console.log('повторные данные')
                        return
                    } else {
                        console.log('таблица есть, изменение аларма')
                        const data = createDate()
                        alarm = 'Критически низкое давление'
                        alarmBase(data, el, alarm)
                    }
                }
                if (el[2] > 10) {
                    console.log('таблица есть, аларм есть')
                    console.log(results[results.length - 1].bar)
                    console.log(el)
                    if (results[results.length - 1].bar == el[2] && results[results.length - 1].alarm !== 'Потеря связи с датчиком') {
                        console.log('повторные данные')
                        return
                    } else {
                        console.log('таблица есть, изменение аларма')
                        const data = createDate()
                        alarm = 'Критически высокое давление'
                        alarmBase(data, el, alarm)
                    }
                }
                else if (el[2] >= 6 || el[2] <= 10) {
                    console.log('таблица есть, аларма нет')
                    //   console.log()
                    if (results[results.length - 1].alarm === 'Норма') {
                        console.log('повторные данные')
                        return
                    } else {
                        console.log('таблица есть, изменение аларма')
                        const data = createDate()
                        alarm = 'Норма'
                        alarmBase(data, el, alarm)
                    }
                }

                // }

            }
            //  res.json(results);
        });



    })

}



function alarmBase(data, tyres, alarm) {
    console.log(tyres)
    const dannie = data.concat(tyres)
    const name = dannie[2]
    dannie.push(alarm)
    console.log(dannie)
    const value = [dannie];
    const tableModel = 'alarm' + dannie[2] + dannie[3]
    try {
        const sql = `create table if not exists ${tableModel}(
            id int(255) primary key auto_increment,
            data varchar(255),
            time varchar(255),
            name varchar(255),
            senspressure varchar(255),
            bar varchar(255),
            temp varchar(255),
            alarm varchar(255) not null        
            )`
        connection.query(sql, function (err, results) {
            if (err) console.log('ошибка');

            else {
                // console.log(results)
                //  count++
                //  console.log(count)
                console.log("Таблица alarm создана")
            };
        })
        const sqls = `INSERT INTO  ${tableModel} (data, time, name, senspressure, bar,
                            temp, alarm) VALUES?`;
        connection.query(sqls, [value], function (err, results) {
            if (err) console.log(err);
            console.log("Данные добавлены");

        });
    }
    catch (e) {
        console.log(e)
    }

}


//const y = c
module.exports = {
    getMainInfo,
    createTable,
    init,

}


