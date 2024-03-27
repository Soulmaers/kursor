const databaseService = require('../services/database.service');

module.exports.alarmFind = async (req, res) => {
    const idw = req.body.idw
    const array = req.body.sorTyrest
    const alarms = await databaseService.alarmFindtoBase(idw, array) //запрос в БД для получения данных с алармами
    res.json(alarms)
}

/*
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
}*/

module.exports.logs = async (req, res) => {
    const newdata = req.body.newdata
    const idw = req.body.idw
    const time = new Date();
    const date = (time.getTime() / 1000).toFixed(0)
    const itog = await databaseService.logsSaveToBase(newdata, date, idw) //сохранение в БД лога события
    res.json({ itog })
}
module.exports.logsView = async (req, res) => {
    const idw = req.body.arrayId
    const tr = req.body.tr
    const count = req.body.count
    const val = await databaseService.logsFindToBase(idw) //получение логов из БД
    const valnew = val.map(el => el)
    const quant = val.length
    val.sort((a, b) => {
        if (a.time > b.time) {
            return 1;
        }
        if (a.time < b.time) {
            return -1;
        }
        return 0;
    })
    val.splice(0, val.length - count)
    valnew.splice(0, tr)
    res.json({ itog: valnew.length, quant: quant, view: val })
}


module.exports.logsViewId = async (req, res) => {
    const idw = req.body.idw
    const t1 = req.body.nowDate
    const t2 = req.body.timeFrom
    const itog = await databaseService.logsFindToBaseId(t1, t2, idw) //получение логов за интервал времени
    res.json(itog)
}

module.exports.alarmViewId = async (req, res) => {
    const idw = req.body.idw
    const t1 = req.body.nowDate
    const t2 = req.body.timeFrom
    const itog = await databaseService.alarmFindToBaseId(t1, t2, idw) //получение алармов за интервал времени
    res.json(itog)
}
module.exports.saveEvent = async (req, res) => {
    const login = req.body.login
    const obj = req.body.objEvent
    const itog = await databaseService.eventSaveToBase(login, obj) //сохранение настроек уведомлений
    res.json({ itog })
}
module.exports.viewEvent = async (req, res) => {
    const login = req.body.login
    const itog = await databaseService.eventFindToBase(login) //получение настроек уведомлений
    res.json({ itog })
}
