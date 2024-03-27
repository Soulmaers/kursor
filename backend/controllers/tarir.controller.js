
const databaseService = require('../services/database.service');



exports.updateTarirTableToBase = async (req, res) => {
    const data = req.body.values
    const result = await databaseService.updateTarirTable(data) //обновление тарировочной таблицы по параметру объектв в БД
    res.json(result)
}
exports.getTarirDataToBase = async (req, res) => {
    const idw = req.body.idw
    const param = req.body.param
    const result = await databaseService.getTarirData(idw, param) //получение тарировочной таблицы по параметру  объекта из БД
    res.json(result)
}

exports.tarirView = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.tarirViewToBase(idw)
    res.json(result)
}
