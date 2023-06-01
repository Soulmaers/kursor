const response = require('../../response')
const { getMainInfo } = require('../settings/wialon.js')
const { prms } = require('../settings/params')
const connection = require('../settings/db')

module.exports.datawialon = (req, res) => {
    const idw = req.body.idw
    try {
        const selectBase = `SELECT nameCar, name, value, status FROM params WHERE idw='${idw}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            response.status(200, results, '', res)
        })
    }
    catch (e) {
        console.log(e)
    }

}
module.exports.datawialonAll = (req, res) => {
    const idw = req.body.el
    try {
        const selectBase = `SELECT name, value, status FROM params WHERE idw='${idw}'`
        connection.query(selectBase, function (err, results) {
            if (err) console.log(err);
            res.json({ status: 200, result: results, message: req.body.car })
        })
    }
    catch (e) {
        console.log(e)
    }
}
module.exports.datawialonGeo = (req, res) => {
    try {
        setTimeout(getMainInfo, 500, req.body.active, res)
    }
    catch (e) {
        console.log(e)
    }
}

