const getDataObjectsToList = require('../services/GetDataObjectsToList')
const statistika = require('../modules/statistika.module');
const events = require('../modules/events.module.js')
const { SummaryStatistiks } = require('../modules/statistika.module.js')
const { AlarmControll } = require('../modules/alarm.module.js')

class HelpersUpdateParams {



    static async update(session) {
        console.time('updatedata')
        const datas = await getDataObjectsToList.getAccountsAddListKursor() //получем данные из БД по объектам wialona
        const result = await getDataObjectsToList.getAccountGroupsAndObjects(datas) //получем данные из БД по объектам wialona
        new AlarmControll(result)
        statistika.popupProstoy(result) //ловим простои
        events.eventFunction(result, session) //ловим через вилаон заправки/сливы+потеря связи
        new SummaryStatistiks(result)

        console.timeEnd('updatedata')
    }
}

module.exports = { HelpersUpdateParams }