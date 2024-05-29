const databaseService = require('../services/database.service');


exports.savePr = async (req, res) => {
    console.log('сэйв')
    const value = [Object.values(req.body.arr)]
    const message = await databaseService.saveTechToBase(value, req.body.arr.dataAdd) //сохранение параметров замера протектора колеса
    res.json(message)
}
exports.getHistoryTyres = async (req, res) => {
    const identificator = req.body.id
    const id = req.body.idw
    const result = await databaseService.getHistoryTyres(identificator, id) //получение параметров замера протектора колеса
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
exports.summaryIdwToBase = async (req, res) => { //получение статистики по объекту за интервал
    const data = req.body.data
    const idw = req.body.idw
    const result = await databaseService.sumIdwToBase(data, idw)
    res.json(result)
}

