const databaseService = require('../services/database.service');

module.exports.alarmFind = async (req, res) => {
    const idw = req.body.idw
    const tyresp = req.body.tyresP
    const alarms = await databaseService.alarmFindtoBase(idw, tyresp)
    res.json(alarms)
}