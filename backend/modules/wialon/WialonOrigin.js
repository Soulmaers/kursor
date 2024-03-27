
const databaseService = require('../../services/database.service');
const JobToBase = require('../navtelecom/JobToBase')
const wialonService = require('../../services/wialon.service.js')
const helpers = require('../../helpers');
const globalstart = require('../../controllers/data.controller.js');
class WialonOrigin {
    constructor(session) {
        this.session = session
        this.init()
    }
    async init() {
        const data = await wialonService.getDataFromWialon(); //получение объектов с wialon
        if (data) {
            await Promise.all([
                this.getObjectData(data),
                globalstart.start(this.session, data)
            ]);
        } else {
            this.init();
        }
    }
    async getObjectData(data) {
        const dataArray = data?.items ?? [];
        const now = Math.floor(Date.now() / 1000);
        const phones = await Promise.all(dataArray.map(el => wialonService.getUniqImeiAndPhoneIdDataFromWialon(el.id))); //получение IMEI, контактов с wialon
        // Пакетная обработка обновлений в базе данных
        const updateTasks = [];
        for (let i = 0; i < dataArray.length; i++) {
            const el = dataArray[i];
            const phone = phones[i];
            const idw = el.id;
            if (!phone?.item?.uid) {
                continue;
            }
            const res = await databaseService.objectsWialonImei(String(phone.item.uid)); // валидация полученного объекта по IMEI и id
            if (!res?.length) {
                continue;
            }
            const timeBase = await databaseService.getLastTimeMessage(idw);
            const oldTime = timeBase?.[0]?.time_reg ? Number(timeBase[0].time_reg) : now - 1000;
            const [result] = await Promise.all([
                wialonService.loadIntervalDataFromWialon(el.id, oldTime + 1, now, 'i'), //запрос параметров по объекту за интервал времени
            ]);
            const allArrayData = [];
            result.messages.forEach(async (e) => {
                const allObject = {
                    port: 'wialon',
                    imei: phone.item.uid,
                    idObject: idw,
                    nameCar: el.nm,
                    time: e.t,
                    lat: e.pos?.y,
                    lon: e.pos?.x,
                    course: e.pos?.c,
                    speed: e.pos?.s,
                    time_reg: Math.floor(new Date().getTime() / 1000)
                };
                Object.keys(e.p || {}).forEach(key => {
                    allObject[key] = e.p[key];
                });
                if (e.i !== undefined) {
                    let binary = e.i.toString(2).padStart(16, '0'); // Assuming 16 inputs for consistency
                    binary.split("").reverse().forEach((bit, index) => {
                        allObject[`in${index + 1}`] = bit;
                    });
                }
                if (e.o !== undefined) {
                    let binaryo = e.o.toString(2).padStart(16, '0'); // Assuming 16 outputs for consistency
                    binaryo.split("").reverse().forEach((bit, index) => {
                        allObject[`out${index + 1}`] = bit;
                    });
                }
                allArrayData.push(allObject);
            });
            updateTasks.push(this.updateDatabase(allArrayData, res[0].idObject));

        }

        await Promise.all(updateTasks);

    }
    async updateDatabase(allArrayData, res) {
        if (allArrayData.length !== 0) {
            await this.setData(allArrayData[0].imei, allArrayData[0].port, allArrayData, res);
            await this.setValidationImeiToBase(allArrayData);
        }

    }

    async setData(imei, port, allArrayData, id) {
        await helpers.setDataToBase(imei, port, allArrayData, id) // передача данных для обработки и записи в БД
    }
    async setValidationImeiToBase(allArrayData) {
        for (let elem of allArrayData) {
            const table = 'wialon_origin'
            const base = new JobToBase()
            await base.createTable(table)
            await base.fillingTableColumns(elem, table)
            await base.fillingTableRows(elem, table)
        }
    }
}


module.exports = WialonOrigin