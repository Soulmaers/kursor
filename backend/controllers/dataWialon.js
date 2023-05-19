const response = require('../../response')
//const wialon = require('wialon');
//const session = wialon().session;
const { getMainInfo } = require('../settings/wialon.js')
//const { createTable } = require('../settings/wialon.js')

const { prms } = require('../settings/params')
const connection = require('../settings/db')
//const { gY, gX } = require('../settings/config')




module.exports.datawialon = (req, res) => {
    // console.log('h1')
    const nameCar = req.body.activePost
    try {
        const selectBase = `SELECT name, value, status FROM params WHERE nameCar='${nameCar}'`
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
    //  console.log('h')
    const nameCar = req.body.car.replace(/\s+/g, '')
    //console.log(req.body.activePost)
    try {
        const selectBase = `SELECT name, value, status FROM params WHERE nameCar='${nameCar}'`
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
        setTimeout(getMainInfo, 500, req.body.active, res)
        // getMainInfo(req.body.active, res)
        //   console.log(getMainInfo(req.body.active))
        //   setInterval(getMainInfo, 3000, req.body.active);

    }
    catch (e) {
        //  console.log(e)
    }
}

