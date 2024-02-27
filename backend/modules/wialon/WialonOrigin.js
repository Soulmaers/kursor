
const databaseService = require('../../services/database.service');
const JobToBase = require('../navtelecom/JobToBase')
const wialonService = require('../../services/wialon.service.js')

class WialonOrigin {
    constructor(session) {
        this.session = session
        this.init()
    }
    async init() {
        const data = await wialonService.getDataFromWialon()
        await this.getObjectData(data)

    }
    async getObjectData(data) {
        //   console.time('ee')
        const dataArray = Object.entries(data)[5][1];
        if (dataArray) {
            for (const el of dataArray) {
                const allArrayData = [];
                const idw = el.id
                const phone = await wialonService.getUniqImeiAndPhoneIdDataFromWialon(el.id);
                const now = new Date();
                const nowTime = Math.floor(now.getTime() / 1000);
                const timeBase = await databaseService.getWialonOrigin(idw)
                let result;
                const oldTime = timeBase.length !== 0 ? Number(timeBase[0].time_reg) : nowTime - 1;
                result = await wialonService.loadIntervalDataFromWialon(idw, oldTime + 1, nowTime, 'i')
                if (result.count !== 0) {
                    result.messages.forEach(e => {
                        const allObject = {}
                        allObject['port'] = 'wialon';
                        allObject['imei'] = phone.item && phone.item.uid ? phone.item.uid : null;
                        allObject['idObject'] = idw;
                        allObject['nameCar'] = el.nm;
                        if (e.pos) {
                            allObject['lat'] = e.y
                            allObject['lat'] = e.x
                            allObject['course'] = e.c
                            allObject['speed'] = e.sc
                        }
                        if (e.p) {
                            for (let key in e.p) {
                                allObject[key] = el.lmsg.p[key];
                            }
                        }
                        allArrayData.push(allObject)
                    })
                    await this.setValidationImeiToBase(allArrayData)
                }
            }
        }
        //    console.timeEnd('ee')

    }

    async setValidationImeiToBase(allArrayData) {
        const nowTime = Math.floor(new Date().getTime() / 1000)

        for (let elem of allArrayData) {
            const res = await databaseService.objectsWialonImei(String(elem.imei))
            if (res.length !== 0) {
                elem['time_reg'] = nowTime
                const table = 'wialon_origin'
                const base = new JobToBase()
                await base.createTable(table)
                await base.fillingTableColumns(elem, table)
                await base.fillingTableRows(elem, table)

            }
        }

        // console.log('wialon -даные сохранены в БД')

    }
}


module.exports = WialonOrigin