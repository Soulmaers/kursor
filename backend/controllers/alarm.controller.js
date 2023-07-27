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
            console.log('2')
            res.json(null)
        }
    }
    else {
        console.log('2')
        res.json(null)
    }
}