const response = require('../../response')
//const wialon = require('wialon');
//const session = wialon().session;
const { getMainInfo } = require('../settings/wialon.js')
const { createTable } = require('../settings/wialon.js')

const { prms } = require('../settings/params')
const connection = require('../settings/db')
//const { gY, gX } = require('../settings/config')




exports.datawialon = (req, res) => {

    //console.log(req.body.activePost)
    try {
        const selectBase = `SELECT name, value FROM ${req.body.activePost} WHERE 1`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            // console.log(results)
            response.status(200, results, res)
        })
    }
    catch (e) {
        console.log(e)
    }
}






exports.datawialonGeo = (req, res) => {
    console.log(req.body.active)

    //  console.log(geoX, geoY)
    // createTable(req.body.active)
    try {
        getMainInfo(req.body.active, res)
        //   console.log(getMainInfo(req.body.active))
        //   setInterval(getMainInfo, 3000, req.body.active);
        console.log('запрос')
        //console.log(geoX, geoY)
        // console.log(geoY, geoX)
        res.json({ geoX, geoY })
    }
    catch (e) {
        console.log(e)
    }
}

