const response = require('../../response')
//const wialon = require('wialon');
//const session = wialon().session;
const { getMainInfo } = require('../settings/wialon.js')
//const { createTable } = require('../settings/wialon.js')

const { prms } = require('../settings/params')
const connection = require('../settings/db')
//const { gY, gX } = require('../settings/config')




module.exports.datawialon = (req, res) => {


    try {
        const selectBase = `SELECT name, value FROM ${req.body.activePost} WHERE 1`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            // console.log(results)
            response.status(200, results, req.body.activePost, res)
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.datawialonAll = (req, res) => {
    const nameCar = req.body.car.replace(/\s+/g, '')
    //console.log(req.body.activePost)
    try {
        const selectBase = `SELECT name, value FROM ${nameCar} WHERE 1`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            // console.log(results)
            res.json({ status: 200, result: results, message: req.body.car })
        })
    }
    catch (e) {
        console.log(e)
    }
}


/*
`SELECT name, value 
            FROM   (
                    SELECT name, value FROM ${req.body.massiv[0]}
                    UNION ALL SELECT name, value FROM ${req.body.massiv[1]}
                    UNION ALL SELECT name, value FROM ${req.body.massiv[2]}
                    UNION ALL SELECT name, value FROM ${req.body.massiv[3]}
                   ) AS f
            WHERE  1`*/


//  console.log(finish)




module.exports.datawialonGeo = (req, res) => {
    //  console.log(req.body.active)

    //  console.log(geoX, geoY)
    // createTable(req.body.active)
    try {
        getMainInfo(req.body.active, res)
        //   console.log(getMainInfo(req.body.active))
        //   setInterval(getMainInfo, 3000, req.body.active);
        console.log('запрос')
        console.log(geoX, geoY)
        // console.log(geoY, geoX)
        res.json({ geoX, geoY })
        console.log(res.json({ geoX, geoY }))
    }
    catch (e) {
        //  console.log(e)
    }
}

