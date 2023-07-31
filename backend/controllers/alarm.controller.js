const databaseService = require('../services/database.service');

module.exports.alarmFind = async (req, res) => {
    const idw = req.body.idw
    const tyresp = req.body.tyresP
    const alarms = await databaseService.alarmFindtoBase(idw, tyresp)
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
    const time = new Date();
    const date = (time.getTime() / 1000).toFixed(0)
    const itog = await databaseService.logsSaveToBase(newdata, date)
    console.log(itog)
    res.json({ itog })
}