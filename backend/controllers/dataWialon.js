
const connection = require('../config/db')
const wialonService = require('../services/wialon.service.js')
const databaseService = require('../services/database.service');

exports.spisok = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.loadParamsViewList(idw, idw);
    res.json(result)
}
exports.datawialon = async (req, res) => {
    const idw = req.body.idw
    const params = await databaseService.paramsToBase(idw)
    res.json(params)
}
//запрос на wialon и получение параметров по id
exports.parametrs = async (req, res) => {
    const idw = req.body.idw
    const login = req.body.login
    const params = await wialonService.getAllParamsIdDataFromWialon(idw, login)
    res.json(params)
}
//запрос на wialon и получение сенсоров по id
exports.sensors = async (req, res) => {
    const idw = req.body.idw
    const login = req.body.login
    const timeOld = req.body.timeOld
    const timeNow = req.body.timeNow
    const params = await wialonService.getAllSensorsIdDataFromWialon(idw, timeOld, timeNow, login)
    res.json(params)
}
//запрос на wialon и получение сенсоров по id
exports.loadInterval = async (req, res) => {
    const idw = req.body.idw
    const timeOld = req.body.timeOld
    const timeNow = req.body.timeNow
    const login = req.body.login
    const params = await wialonService.loadIntervalDataFromWialon(idw, timeOld, timeNow, login)
    res.json(params)
}
//запрос на wialon и получение сенсоров по id
exports.sensorsName = async (req, res) => {
    const idw = req.body.idw
    const login = req.body.login
    const params = await wialonService.getAllNameSensorsIdDataFromWialon(idw, login)
    res.json(params)
}
exports.lastSensors = async (req, res) => {
    const idw = req.body.idw
    const login = req.body.login
    const params = await wialonService.getLastAllSensorsIdDataFromWialon(idw, login)
    res.json(params)
}

module.exports.datawialonAll = (req, res) => {
    const idw = req.body.idw
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



