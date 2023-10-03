const databaseService = require('../services/database.service');

module.exports.alarmFind = async (req, res) => {
    const idw = req.body.idw
    // const tyresp = req.body.tyresP
    const array = req.body.sorTyrest
    const alarms = await databaseService.alarmFindtoBase(idw, array)
    res.json(alarms)
}

let old = 0
module.exports.alert = async (req, res) => {
    const alert = databaseService.myVariable
    if (alert) {
        if (alert[3] !== old) {
            console.log('1')
            res.json(alert)
            old = alert[3]
        }
        else {
            res.json(null)
        }
    }
    else {
        res.json(null)
    }
}

module.exports.logs = async (req, res) => {
    const newdata = req.body.newdata
    const idw = req.body.idw
    const time = new Date();
    const date = (time.getTime() / 1000).toFixed(0)
    const itog = await databaseService.logsSaveToBase(newdata, date, idw)
    res.json({ itog })
}
module.exports.logsView = async (req, res) => {
    const idw = req.body.arrayId
    const itog = await databaseService.logsFindToBase(idw)
    res.json(itog)
}
module.exports.saveEvent = async (req, res) => {
    const login = req.body.login
    const obj = req.body.objEvent
    const itog = await databaseService.eventSaveToBase(login, obj)
    res.json({ itog })
}
module.exports.viewEvent = async (req, res) => {
    const login = req.body.login
    const itog = await databaseService.eventFindToBase(login)
    res.json({ itog })
}
