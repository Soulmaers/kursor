const databaseService = require('../services/database.service');



exports.savePr = async (req, res) => {
    console.log('сэйв')
    const value = [Object.values(req.body.arr)]
    const message = await databaseService.saveTechToBase(value, req.body.arr.dataAdd)
    res.json(message)
}
exports.techView = async (req, res) => {
    const nameCar = req.body.activePost
    const count = req.body.id
    const idw = req.body.idw
    const result = await databaseService.techViewToBase(nameCar, count, idw)
    res.json(result)
}

exports.techViewAll = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.techViewAllToBase(idw)
    res.json(result)
}



