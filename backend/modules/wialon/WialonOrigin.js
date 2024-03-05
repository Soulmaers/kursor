
const databaseService = require('../../services/database.service');
const JobToBase = require('../navtelecom/JobToBase')
const wialonService = require('../../services/wialon.service.js')
const helpers = require('../../helpers');
class WialonOrigin {
    constructor(session) {
        this.session = session
        this.init()
    }
    async init() {
        const data = await wialonService.getDataFromWialon()
        data ? await this.getObjectData(data) : this.init()
    }
    async getObjectData(data) {
        const dataArray = Object.entries(data)[5][1];
        if (dataArray) {
            for (const el of dataArray) {
                const allArrayData = [];
                const idw = el.id
                const phone = await wialonService.getUniqImeiAndPhoneIdDataFromWialon(el.id);
                const now = new Date();
                const nowTime = Math.floor(now.getTime() / 1000);
                const timeBase = await databaseService.getLastTimeMessage(idw)
                const oldTime = timeBase.length !== 0 ? Number(timeBase[0].time_reg) : nowTime - 1;
                const result = await wialonService.loadIntervalDataFromWialon(idw, oldTime + 1, nowTime, 'i')
                const nameSens = await wialonService.getAllNameSensorsIdDataFromWialon(el.id, 'i')

                if (result.count !== 0) {
                    const oil = Object.entries(nameSens.item.sens).filter(el => {
                        if (el[1].n.indexOf('Топли') !== -1) {
                            return result.messages[0].p.hasOwnProperty(el[1].p) ? el : null;
                        }
                        else {
                            null
                        }
                    });

                    let valueOil = null
                    if (oil.length !== 0) {
                        valueOil = await wialonService.getAllSensorsIdDataFromWialon(el.id, oil[0][1].id)
                    }
                    result.messages.forEach((e, index) => {
                        const allObject = {}
                        allObject['port'] = 'wialon';
                        allObject['imei'] = phone.item && phone.item.uid ? phone.item.uid : null;
                        allObject['idObject'] = idw;
                        allObject['nameCar'] = el.nm;
                        allObject['time'] = e.t
                        if (e.pos) {
                            allObject['lat'] = e.pos.y
                            allObject['lon'] = e.pos.x
                            allObject['course'] = e.pos.c
                            allObject['speed'] = e.pos.sc
                        }
                        if (e.p) {
                            for (let key in e.p) {
                                allObject[key] = el.lmsg.p[key];
                            }
                            try {
                                valueOil && valueOil.length !== 0 ? allObject[`${oil[0][1].p}`] = parseFloat(valueOil[index][`${oil[0][1].id}`].toFixed(1)) : null
                            }
                            catch (e) {
                                console.log(e)
                                console.log(el.id)
                            }
                        }
                        if (e.i !== undefined) {
                            let binary = e.i.toString(2)
                            binary = binary.split("").reverse();
                            for (let i = 0; i < binary.length; i++) {
                                allObject[`in${i + 1}`] = binary[i]
                            }
                        }
                        if (e.o !== undefined) {
                            let binaryo = e.o.toString(2)
                            binaryo = binaryo.split("").reverse();
                            for (let i = 0; i < binaryo.length; i++) {
                                allObject[`out${i + 1}`] = binaryo[i]
                            }
                        }
                        const nowTime = Math.floor(new Date().getTime() / 1000)
                        allObject['time_reg'] = nowTime
                        allArrayData.push(allObject)
                    })
                    this.setData(allArrayData[0].imei, allArrayData[0].port, allArrayData)
                    await this.setValidationImeiToBase(allArrayData)
                }
            }
        }

    }
    async setData(imei, port, allArrayData) {
        await helpers.setDataToBase(imei, port, allArrayData)
    }
    async setValidationImeiToBase(allArrayData) {
        for (let elem of allArrayData) {
            const res = await databaseService.objectsWialonImei(String(elem.imei))
            if (res.length !== 0) {
                //   elem['time_reg'] = nowTime
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