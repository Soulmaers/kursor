
const databaseService = require('../../services/database.service');
const JobToBase = require('../navtelecom/JobToBase')
const wialonService = require('../../services/wialon.service.js')
const { HelpersUpdateParams } = require('../../services/HelpersUpdateParams.js')
const { UpdateSetStor } = require('../dataProcessorModule/class/UpdateSetStor.js')
const CompilingStruktura = require('../simulater/CompilingStruktura.js')
class WialonOrigin {
    constructor(session) {
        this.session = session
        this.inits()
    }
    async inits() {
        const data = await wialonService.getDataFromWialon(this.session); //получение объектов с wialon
        if (data) {
            Promise.all([this.getObjectData(data), HelpersUpdateParams.update(this.session)])
        } else {
            this.inits();
        }
    }


    getObjectData = (() => {
        const timeCache = new Map(); // Кэш для хранения времени по каждому idw
        return async function (data) {
            //  console.log(data)
            const dataArray = data?.items ?? [];
            const now = Math.floor(Date.now() / 1000);
            const phones = [];
            // Получаем телефоны и IMEI, но без Promise.all
            for (const el of dataArray) {
                const phone = await wialonService.getUniqImeiAndPhoneIdDataFromWialon(el.id, this.session);
                //  console.log(phone.item.psw)
                phones.push(phone);
            }

            // Обработка данных из Wialon
            for (let i = 0; i < dataArray.length; i++) {
                const el = dataArray[i];
                const phone = phones[i];
                const idw = el.id;
                const psw = phones[i]?.item?.psw
                // console.log(sim)
                // console.log(phone)
                if (!phone?.item?.uid) continue;
                const res = await databaseService.objectsWialonImei(String(phone.item.uid));
                if (!res?.length) continue;

                let oldTime = timeCache.get(idw);
                if (!oldTime) {
                    // Если времени в кэше нет, делаем запрос в базу данных
                    const timeBase = await databaseService.getLastTimeMessage(idw);
                    oldTime = timeBase?.[0]?.time_reg ? Number(timeBase[0].time_reg) : now - 1000;
                    timeCache.set(idw, oldTime); // Сохраняем время в кэш
                }

                const result = await wialonService.loadIntervalDataFromWialon(el.id, oldTime + 1, now, 'i', this.session);
                //  console.log('здесь!')
                if (!result || !result.messages) continue;
                const allArrayData = [];
                for (const e of result.messages) {
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
                        let binary = e.i.toString(2).padStart(16, '0');
                        binary.split("").reverse().forEach((bit, index) => {
                            allObject[`in${index + 1}`] = bit;
                        });
                    }

                    if (e.o !== undefined) {
                        let binaryo = e.o.toString(2).padStart(16, '0');
                        binaryo.split("").reverse().forEach((bit, index) => {
                            allObject[`out${index + 1}`] = bit;
                        });
                    }
                    allArrayData.push(allObject);
                }
                // Запись в базу данных
                await this.updateDatabase(allArrayData, idw, psw);

                // Обновляем кэш с новым временем
                timeCache.set(idw, now);
            }

            console.log('Все итерации завершены');
        }
    })();
    async updateDatabase(allArrayData, res, psw) {

        if (allArrayData.length !== 0) {
            new UpdateSetStor(allArrayData[0].imei, allArrayData[0].port, allArrayData, res)
            await this.setValidationImeiToBase(allArrayData);
            if (psw === '7777') {
                //console.log(psw)
                // console.log(allArrayData[0].imei)
                const instance = new CompilingStruktura(allArrayData, res)
                const result = await instance.init()

                if (!result) return
                for (let item of result) {
                    if (!item) return
                    if (item.data[0].idObject == '28526629ido') {
                        console.log(result)
                    }
                    new UpdateSetStor(item.data[0].imei, 'simulator', item.data, item.data[0].idObject)

                }

            }
        }
    }
    async setValidationImeiToBase(allArrayData) {
        const table = 'wialon_origin2';
        const base = new JobToBase();

        // Создание таблицы
        await base.createTable(table);

        // Последовательная обработка колонок
        for (const elem of allArrayData) {
            await base.fillingTableColumns(elem, table);
        }

        // Последовательная обработка строк
        for (const elem of allArrayData) {
            await base.fillingTableRows(elem, table);
        }

        //   console.log('Все данные успешно обработаны и записаны в базу');
    }
}


module.exports = WialonOrigin