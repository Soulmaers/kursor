const databaseService = require('../services/database.service');
const { ReportsControllClass } = require('../modules/reportsModule/class/ReportsControllClass')

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


exports.saveTemplates = async (req, res) => {
    const data = req.body.obj
    const result = await databaseService.setTemplates(data)
    res.json(result)
}

exports.getTemplates = async (req, res) => {
    const arrayID = req.body.id
    const prop = req.body.prop
    const result = await databaseService.getTemplatesProperty(arrayID, prop)
    res.json(result)
}
exports.getAttributeTemplace = async (req, res) => {
    const id = req.body.id
    const result = await databaseService.getAttributeTemplaceToBase(id)
    res.json(JSON.parse(result[0].jsonAttributes))
}
exports.deleteTemplace = async (req, res) => {
    const id = req.body.id
    const result = await databaseService.deleteTemplaceToBase(id)
    res.json({ mess: 'Отчет удален' })
}

exports.updateTemplates = async (req, res) => {
    const obj = req.body.obj
    const id = req.body.id
    const result = await databaseService.updateTemplatesToBase(obj, id)
    res.json({ mess: 'Отчет обновлен' })
}
exports.getReport = async (req, res) => {
    const object = req.body.object
    const instance = new ReportsControllClass(object)
    const result = await instance.init()
    res.json(result)
}
exports.setReportsAttribute = async (req, res) => {
    const object = req.body.obj
    const result = await databaseService.setReportsAttributeToBase(object)
    res.json(result)
}
exports.getReportsAttribute = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.getReportsAttribute(idw)
    res.json(result)
}




