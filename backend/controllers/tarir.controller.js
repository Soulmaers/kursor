
const databaseService = require('../services/database.service');



exports.tarirSave = async (req, res) => {
    const arr = req.body.AllarrayTarir
    const message = await databaseService.tarirSaveToBase(arr)
    res.json(message)
}

exports.tarirView = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.tarirViewToBase(idw)
    res.json(result)
}
