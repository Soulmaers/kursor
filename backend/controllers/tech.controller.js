const databaseService = require('../services/database.service');


exports.savePr = async (req, res) => {
    console.log('сэйв')
    const value = [Object.values(req.body.arr)]
    const message = await databaseService.saveTechToBase(value, req.body.arr.dataAdd) //сохранение параметров замера протектора колеса
    res.json(message)
}
exports.techView = async (req, res) => {
    const nameCar = req.body.activePost
    const count = req.body.id
    const idw = req.body.idw
    const result = await databaseService.techViewToBase(nameCar, count, idw) //получение параметров замера протектора колеса
    res.json(result)
}

exports.techViewAll = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.techViewAllToBase(idw) //получение параметров замера протектора по всем колесам объекта
    res.json(result)
}

exports.summaryYestoday = async (req, res) => {
    const data = req.body.data
    const arrayId = req.body.arrayId
    const result = await databaseService.summaryYestodayToBase(data, arrayId) //получение статистики по объектам за интервал
    res.json(result)
}

