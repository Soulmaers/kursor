
const databaseService = require('../services/database.service');

exports.iconFind = async (req, res) => {
    const idw = req.body.idw
    const login = req.body.login
    const icons = await databaseService.iconFindtoBase(idw)
    res.json({ result: icons, name: idw, login })
}

exports.icon = async (req, res) => {
    const id = req.body.id
    const param = req.body.param
    const activePost = req.body.activepost
    const idw = req.body.idw
    const coef = req.body.coef
    const icons = await databaseService.iconSaveToBase(activePost, param, coef, id, idw)
    res.json({ icons })
}

exports.saveStatus = async (req, res) => {
    const idw = req.body.idw
    const login = req.body.login
    const icons = await databaseService.saveStatusToBase(idw)
    res.json({ result: icons, name: idw, login })
}



