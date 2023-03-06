
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
            setInterval(createTable, 15000);
            //  saprosGeo()
        })
}
//init()

function createTable() {
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
    // console.log(name)
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
                                            massItog.push([itey, item.pressure, integer, parseFloat(it.value)])
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
//let mass;
function proverka(arr) {
    console.log(arr)
    let alarm;
    arr.forEach(el => {
        if (el[0] === 'КранГаличанинР858ОР178') {

            if (el[2] < 6) {
                alarm = 'Критически низкое давление'
                const data = createDate()
                alarmBase(data, el, alarm)
            }
            else {
                alarm = 'Норма'
                const data = createDate()
                alarmBase(data, el, alarm)
            }
        }
    })
}



function alarmBase(data, tyres, alarm) {
    console.log('job')
    // tyres.shift()
    const dannie = data.concat(tyres)
    // dannie.unshift(name)
    dannie.push(alarm)
    // console.log(dannie)


    const name = dannie[2]
    const value = [dannie];
    const tableModel = 'alarm' + name
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
            else console.log("Таблица alarm создана");
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
    init



}


