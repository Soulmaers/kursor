
const wialon = require('wialon');
const express = require('express');
const connection = require('./db')
const { allParams, lostSens, geo, geo2, geo3 } = require('./sort')

const { prms1, prms, prms2, prms22, prms222 } = require('./params')
const app = express();
app.use(express.json());



const session = wialon().session;
function init() {
    //console.log('init')
    session.start({ token: '0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178' })
        .catch(function (err) {
            console.log(err);
        })
        .then(function (data) {
            //  console.log('обновление')
            setInterval(getMainInfo, 5000);

        })

}
init()


let gY;
let gX;

let gY2;
let gX2;

let gY3;
let gX3;

function getMainInfo() {
    console.log('запуск')
    session.request('unit/calc_last_message', prms1)
        .catch(function (err) {
            console.log(err);
        })
        .then(function (data) {
            lostSens(data)
            //  console.log(pressureSensor, temperatureSensor)
        })

    session.request('core/search_item', prms2)
        .catch(function (err) {
            console.log(err);
        })
        .then(function (data) {
            geo(data)
            // gY = geoY;
            //  gX = geoX;
            //  console.log(geoY, geoX)
            //console.log(gY, gX)

            //  геопозиция
        })

    session.request('core/search_item', prms22)
        .catch(function (err) {
            console.log(err);
        })
        .then(function (data) {
            geo2(data)
            //    gY2 = geoY;
            //  gX2 = geoX;
            //  console.log(geoY, geoX)
            //console.log(gY, gX)

            //  геопозиция
        })

    session.request('core/search_item', prms222)
        .catch(function (err) {
            console.log(err);
        })
        .then(function (data) {
            geo3(data)
            //    gY2 = geoY;
            //  gX2 = geoX;
            //  console.log(geoY, geoX)
            //console.log(gY, gX)

            //  геопозиция
        })




    session.request('core/search_items', prms)
        .catch(function (err) {
            console.log(err);
        })
        .then(function (data) {
            allParams(data)
            //console.log(sensor)
            //sens = JSON.stringify(sensors)
            //console.log(sens)
            const selectBase = `SELECT id FROM params WHERE 1`
            connection.query(selectBase, function (err, results) {
                if (err) console.log(err);
                // console.log(results);
                //  console.log(results.length);
                if (results.length <= 1) {
                    console.log('старт1')
                    // const datas = [['M', 300], ['R', 200], ['P', 500]]
                    const sql = `INSERT INTO params(name,value) VALUES?`;
                    connection.query(sql, [sensors], function (err, results) {
                        if (err) console.log(err);
                        // console.log(results);
                    });
                    connection.end();
                }
                else if (results.length > 1) {
                    console.log('старт')
                    let count = 0;
                    sensors.forEach(el => {
                        count++
                        const sql = `UPDATE params  SET name='${el[0]}', value='${el[1]}' WHERE id=${count}`;
                        // const data = [34, "Tom"];
                        connection.query(sql, function (err, results) {
                            if (err) console.log(err);
                            //console.log(results);
                        });
                        //  connection.end();
                    })
                }
            });

            const selectBase2 = `SELECT id FROM params2 WHERE 1`
            connection.query(selectBase2, function (err, results) {
                if (err) console.log(err);
                // console.log(results);
                //  console.log(results.length);
                if (results.length <= 1) {
                    console.log('старт22')
                    // const datas = [['M', 300], ['R', 200], ['P', 500]]
                    const sql = `INSERT INTO params2(name,value) VALUES?`;
                    connection.query(sql, [sensor], function (err, results) {
                        if (err) console.log(err);
                        // console.log(results);
                    });
                    connection.end();
                }
                else if (results.length > 1) {
                    console.log('старт2')
                    let count = 0;
                    sensor.forEach(el => {
                        count++
                        const sql = `UPDATE params2  SET name='${el[0]}', value='${el[1]}' WHERE id=${count}`;
                        // const data = [34, "Tom"];
                        connection.query(sql, function (err, results) {
                            if (err) console.log(err);
                            //console.log(results);
                        });
                        //  connection.end();
                    })
                }
            });



            const selectBase3 = `SELECT id FROM params3 WHERE 1`
            connection.query(selectBase3, function (err, results) {
                if (err) console.log(err);
                // console.log(results);
                //  console.log(results.length);
                if (results.length <= 1) {
                    console.log('старт222')
                    // const datas = [['M', 300], ['R', 200], ['P', 500]]
                    const sql = `INSERT INTO params3(name,value) VALUES?`;
                    connection.query(sql, [sensorr], function (err, results) {
                        if (err) console.log(err);
                        // console.log(results);
                    });
                    connection.end();
                }
                else if (results.length > 1) {
                    console.log('старт2')
                    let count = 0;
                    sensorr.forEach(el => {
                        count++
                        const sql = `UPDATE params3  SET name='${el[0]}', value='${el[1]}' WHERE id=${count}`;
                        // const data = [34, "Tom"];
                        connection.query(sql, function (err, results) {
                            if (err) console.log(err);
                            //console.log(results);
                        });
                        //  connection.end();
                    })
                }
            });




        })


}













//const y = c
module.exports = {
    getMainInfo,
    gX,
    gY

}



/*
app.get('/db', (req, res) => {
    console.log(res.json())
})*/

/*
function updatet(arr) {
    const sql = `INSERT INTO sensors(a, b, c, d, e, f, g, h, j, k, l, m) VALUES ? `;
    connection.query(sql, [arr], function (err, results) {
        if (err) console.log(err);
        console.log(results);
    });
}*/
