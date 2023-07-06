const databaseService = require('../services/database.service');

exports.updateModel = async (req, res) => {
    const idw = req.body.idw
    const massiv = req.body.massModel
    const nameCar = req.body.activePost
    const gosp = req.body.gosp
    const gosp1 = req.body.gosp1
    const frontGosp = req.body.frontGosp
    const frontGosp1 = req.body.frontGosp1
    const type = req.body.type
    const message = await databaseService.updateModelSaveToBase(idw, massiv, nameCar, gosp, gosp1, frontGosp, frontGosp1, type)
    res.json({ message: 'успех' })
}
exports.tyres = async (req, res) => {
    const nameCar = req.body.activePost
    const tyres = req.body.tyres
    const idw = req.body.idw
    const message = await databaseService.tyresSaveToBase(nameCar, tyres, idw)
    res.json({ message: 'успех' })
}
exports.modalBar = async (req, res) => {
    const value = [req.body.arrValue];
    const message = await databaseService.modalBarSaveToBase(value)
    console.log(message)
    res.json(message)
}

exports.deleteModel = async (req, res) => {
    const idw = req.body.idw
    const message = await databaseService.deleteModelToBase(idw)
    res.json({ message: 'Модель удалена' })
}

exports.deleteTyres = async (req, res) => {
    const idw = req.body.idw
    const message = await databaseService.deleteTyresToBase(idw)
    res.json({ message: 'Датчики с колес удалены' })
}
exports.deleteBar = async (req, res) => {
    const idw = req.body.idw
    const message = await databaseService.deleteBarToBase(idw)
    res.json({ message: 'Условия подсветки удалены' })
}

exports.modelView = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.modelViewToBase(idw)
    res.json({ result: result })
}


exports.tyresView = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.tyresViewToBase(idw)
    res.json({ result: result })
}


exports.barView = async (req, res) => {
    const idw = req.body.idw
    const count = req.body.id
    const result = await databaseService.barViewToBase(idw, count)
    res.json(result)
}


