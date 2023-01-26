const response = require('../response')
//const wialon = require('wialon');
const getMainInfo = require('../settings/config')
const connection = require('../settings/db')
//const { gY, gX } = require('../settings/config')


exports.datawialon = (req, res) => {

    // console.log('запрос')
    try {
        const selectBase = `SELECT name, value FROM params WHERE 1`
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

exports.datawialon2 = (req, res) => {

    // console.log('запрос')
    try {
        const selectBase = `SELECT name, value FROM params2 WHERE 1`
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
    try {
        console.log('запрос')
        console.log(geoY, geoX)
        res.json({ geoY, geoX })
    }
    catch (e) {
        console.log(e)
    }
}

exports.datawialonGeo2 = (req, res) => {
    try {
        console.log('запрос')
        console.log(geoY, geoX)
        res.json({ geoY2, geoX2 })
    }
    catch (e) {
        console.log(e)
    }
}