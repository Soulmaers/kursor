
const wialon = require('wialon');
const express = require('express');
const connection = require('./db')
const { allParams, geo } = require('./sort')

const { prms, prms2 } = require('./params')
const app = express();
app.use(express.json());



const session = wialon().session;
function init() {
    console.log('init')
    session.start({ token: '0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178' })
        .catch(function (err) {
            console.log(err);
        })
        .then(function (data) {
            //  console.log('обновление')
            // setInterval(getMainInfo, 5000);
            createTable();
            setInterval(createTable, 5000);
            //  saprosGeo()
        })

}
init()

function createTable(name) {
    session.request('core/search_items', prms)
        .catch(function (err) {
            console.log(err);
        })
        .then(function (data) {
            const allCar = Object.entries(data);
            allCar[5][1].forEach(el => {
                const nameTable = el.nm.replace(/\s+/g, '')
                const sensor = Object.entries(el.lmsg.p)
                createNameTable(nameTable)
                postParametrs(nameTable, sensor)

            })
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
    //   console.log(param)
    const selectBase = `SELECT id FROM ${name} WHERE 1`
    connection.query(selectBase, function (err, results) {
        if (err) console.log(err);
        if (results.length <= 1) {
            const sql = `INSERT INTO ${name}(name,value) VALUES?`;
            connection.query(sql, [param], function (err, results) {
                if (err) console.log(err);
            });
            //   connection.end();
        }
        else if (results.length > 1) {
            //   console.log('старт')
            let count = 0;
            param.forEach(el => {
                count++
                const sql = `UPDATE ${name} SET name='${el[0]}', value='${el[1]}' WHERE id=${count}`;
                connection.query(sql, function (err, results) {
                    if (err) console.log(err);
                });
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













//const y = c
module.exports = {
    getMainInfo,
    createTable,



}


