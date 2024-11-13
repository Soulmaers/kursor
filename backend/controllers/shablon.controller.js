const databaseService = require('../services/database.service');
const { ReportsControllClass } = require('../modules/reportsModule/class/ReportsControllClass')
const { ReportSettingsManager } = require('../modules/reportSettingsManagerModule/class/ReportSettingsManager')

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
    const sett = req.body.sett
    const instance = new ReportsControllClass(object, sett)
    const result = await instance.init()
    res.json(result)
}
exports.setReportsAttribute = async (req, res) => {
    const { idw, object } = req.body.obj
    const instance = new ReportSettingsManager(idw, null, object)
    const result = await instance.updateSettings()
    res.json(result)


}
exports.getReportsAttribute = async (req, res) => {
    const idw = req.body.idw
    const result = await databaseService.getReportsAttribute(idw)
    res.json(result)
}

exports.setDefaultSettings = async (req, res) => {
    const idw = req.body.idw
    const typeobject = req.body.typeobject
    const instance = new ReportSettingsManager(idw, typeobject)
    const result = instance.setSettings()
    res.json(result)
}


exports.updateDefaultSettings = async (req, res) => {
    const idw = req.body.idw
    const typeobject = req.body.typeobject
    const instance = new ReportSettingsManager(idw, typeobject)
    const result = instance.updateSettingsDefault()
    res.json(result)
}

exports.getSettings = async (req, res) => {
    const idw = req.body.idw
    const instance = new ReportSettingsManager(idw)
    const result = await instance.getSettings()
    res.json(JSON.parse(result[0].jsonsetAttribute))
}


const wialonService = require('../services/wialon.service')
const wialonModule = require('../modules/wialon.module');
exports.wialonOil = async (req, res) => {
    const idw = req.body.idw
    const t1 = req.body.t1
    const t2 = req.body.t2
    this.session = await wialonModule.login(`"39e1405494b595e6890a684bdb998c65EA58006309FF667A6B6108AEBD25C2DF93CDFAA2"`);
    //  console.log(idw, t1, t2)
    const result = await wialonService.loadIntervalDataFromWialon(idw, t1, t2, 'i', this.session);
    //   console.log(result)
    const rst = result.messages.map(e => {
        // console.log(e)
        return {
            'dut': e.p.rs485fuel_level1,
            'time': e.p.last_valid_time,
            'lat': e.lat,
            'lon': e.lon,
            'pwr': e.p.pwr_ext,
            'oil': 0
        }
    })

    //  console.log(rst)
    res.json({ res: rst })
}






