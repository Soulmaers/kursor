const databaseService = require('../services/database.service');


exports.getGuide = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.getGuideToBase(idw)
    res.json(result)
}


exports.setShablon = async (req, res) => {
    const data = req.body.struktura
    const result = await databaseService.setShablonToBase(data)
    res.json(result)
}

exports.getshablon = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.getShablonToBase(idw)
    res.json(result)
}

exports.getToToBase = async (req, res) => {
    const data = req.body.array
    const result = await databaseService.getMotoTo(data)
    res.json(result)
}
