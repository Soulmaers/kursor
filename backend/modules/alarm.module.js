const { connection, sql } = require('../config/db')
const databaseService = require('../services/database.service');
const helpers = require('../services/helpers.js')

class AlarmControll {
    constructor(info) {
        this.info = info
        this.massItog = [];
        this.init()
    }

    async init() {
        await this.getparams()
        await this.process()
        this.proverka(this.massItog)
    }


    async getparams() {
        const struktura = helpers.formatFinal(this.info)
        this.uniq(struktura)
    }

    uniq(struktura) {
        const uniqObj = new Map()
        struktura.forEach(e => uniqObj.set(e.object_id, e))
        this.info = Array.from(uniqObj.values())
    }
    async process() {
        const processPromises = this.info.map((nameEntry) => this.processEntry(nameEntry));
        await Promise.all(processPromises);
    }

    async processEntry(nameEntry) {
        const nameCar = nameEntry.object_name;
        const id = nameEntry.object_id;
        const tyreRes = nameEntry[1].result;
        const paramsRes = nameEntry[2].result
        const osiRes = nameEntry[3].result

        if (tyreRes.length === 0) {
            return; // Прекращаем выполнение этой итерации
        }
        const speed = Number((paramsRes.find(e => e.params === 'speed')).value)
        const lat = (paramsRes.find(e => e.params === 'lat')).value
        const lon = (paramsRes.find(e => e.params === 'lon')).value
        const geo = JSON.stringify([lat, lon])
        const modelUniqValues = this.convert(tyreRes);

        modelUniqValues.forEach(model => {
            this.processModel(model, paramsRes, osiRes, nameCar, speed, geo, id);
        });
    }

    processModel(model, paramsRes, osiRes, nameCar, speed, geo, id) {
        const param = paramsRes.find(el => el.params === model.pressure);
        if (param) {
            const osiBar = osiRes.find(osi => osi.idOs === model.osNumber);
            const tempParam = paramsRes.find(el => el.params === model.temp);
            if (tempParam) {
                this.massItog.push([
                    nameCar,
                    model.pressure,
                    parseFloat(param.value),
                    parseFloat(tempParam.value),
                    osiBar,
                    id,
                    speed,
                    geo
                ]);
            }
        }
    }



    createDate = () => {   //форматироваие даты
        let today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
        today = day + '.' + month + '.' + year;
        let time = new Date();
        const hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
        const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        time = hour + ':' + minutes
        const todays = today + ' ' + time
        return [todays]

    }

    queryDB = async (sql) => {
        try {
            const pool = await connection;
            const results = await pool.request().query(sql);
            return results.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    convert = (ob) => {  //фильтрация уникальных элементов
        const uniq = new Set(ob.map(e => JSON.stringify(e)));
        return Array.from(uniq).map(e => JSON.parse(e));
    }

    proverka(arr) {
        const time = new Date()
        arr.forEach(async el => {
            if (el[4] === undefined) {
                return
            }
            else {
                let alarm;
                const pool = await connection;
                const sqls1 = `SELECT * FROM alarms WHERE idw=${el[5]} AND senspressure='${el[1]}'`;
                let results = await pool.request().query(sqls1);
                results.recordset.sort((a, b) => {
                    if (a.unix > b.unix) {
                        return 1
                    }
                    if (a.unix < b.unix) {
                        return -1
                    }
                    return 0;
                })
                if (results.recordset.length === 0) {
                    //  console.log('КРАН!')
                    //  console.log(el[0], el[2], 'таблицу не видит')
                    if (el[6] > 5 && el[3] <= -50) {
                        //     console.log(el + ' ' + 'таблица нет, аларм есть. потеря связи с датчиком' + ' ' + time)
                        const data = this.createDate()
                        alarm = 'Потеря связи с датчиком'
                        //записываем данные в бд
                        databaseService.alarmBase(data, el, alarm)
                        return
                    }
                    else {
                        if (el[3] > 70) {
                            //   console.log(el + ' ' + 'таблица нет, аларм есть/ Критически низкое давление' + ' ' + time)
                            const data = this.createDate()
                            alarm = 'Критически высокая температура'
                            databaseService.alarmBase(data, el, alarm)
                            return
                        }
                        if (el[2] <= Number(el[4].knd) && el[3] > -50) {
                            //   console.log(el + ' ' + 'таблица нет, аларм есть/ Критически низкое давление' + ' ' + time)
                            const data = this.createDate()
                            alarm = 'Критически низкое давление'
                            console.log('КРАН!')
                            console.log(el)
                            databaseService.alarmBase(data, el, alarm)
                            return
                        }
                        if (el[2] >= Number(el[4].kvd) && el[3] > -50) {
                            //    console.log(el + ' ' + 'таблица нет, аларм есть/ Критически высокое давление' + ' ' + time)
                            const data = this.createDate()
                            alarm = 'Критически высокое давление'
                            databaseService.alarmBase(data, el, alarm)
                            return
                        }
                        else {
                            //     console.log(el + ' ' + 'таблицы нет, аларма нет' + ' ' + time)
                            return
                        }
                    }
                }
                else if (results.recordset.length !== 0) {
                    //  console.log(el[0], el[1], el[2], 'таблицу видит')
                    if (el[6] > 5 && el[3] <= -50) {
                        if (results.recordset[results.recordset.length - 1].alarm == 'Потеря связи с датчиком') {
                            //    console.log('-3')
                            //   console.log(el + ' ' + 'таблица есть, аларм есть, потеря связи с датчиком, повторные данные')
                            return
                        } else {
                            //   console.log('-2')
                            //  console.log(el + ' ' + 'таблица есть, изменение аларма,потеря связи с датчиком ')
                            const data = this.createDate()
                            alarm = 'Потеря связи с датчиком'
                            databaseService.alarmBase(data, el, alarm)
                        }
                        return
                    }
                    else {
                        //    console.log('-11')
                        if (el[2] <= Number(el[4].knd) && el[3] > -50) {
                            //     console.log('-22')
                            if (results.recordset[results.recordset.length - 1].bar === String(el[2]) && results.recordset[results.recordset.length - 1].alarm !== 'Потеря связи с датчиком') {
                                //   console.log('равно')
                                //    console.log(el + ' ' + 'таблица есть, аларм есть, повторные данные N' + ' ' + time)
                                return
                            } else {
                                //   console.log('-33')
                                //  console.log(el + ' ' + 'таблица есть, аларм есть, изменение аларма N' + ' ' + time)
                                const data = this.createDate()
                                alarm = 'Критически низкое давление'
                                databaseService.alarmBase(data, el, alarm)
                                //    return
                            }
                            return
                        }
                        if (el[2] >= Number(el[4].kvd) && el[3] > -50) {
                            // console.log(results[results.length - 1].bar)
                            //   console.log('-4')
                            //   console.log(typeof el[2])
                            //   console.log(typeof results[results.length - 1].bar)
                            if (results.recordset[results.recordset.length - 1].bar === String(el[2]) && results.recordset[results.recordset.length - 1].alarm !== 'Потеря связи с датчиком') {
                                //   console.log(el + ' ' + 'таблица есть, аларм есть, повторные данные V' + ' ' + time)
                                return
                            } else {
                                //   console.log('-5')
                                //  console.log(el + ' ' + 'таблица есть, аларм есть, изменение аларма V' + ' ' + time)
                                const data = this.createDate()
                                alarm = 'Критически высокое давление'
                                databaseService.alarmBase(data, el, alarm)
                                // return
                            }
                            return
                        }
                        else if (el[2] > Number(el[4].knd) && el[3] > -50 || el[2] < Number(el[4].kvd) && el[3] > -50) {
                            if (results.recordset[results.recordset.length - 1].alarm === 'Норма') {
                                //  console.log(el + ' ' + 'таблица есть, аларма нет, повторные данные' + ' ' + time)
                                //  console.log('норма есть уже в базе')
                                return
                            } else {
                                // console.log(el + ' ' + 'таблица есть, аларма нет, аларм истек-норма' + ' ' + time)
                                //console.log('добавляем норму')
                                const data = this.createDate()
                                alarm = 'Норма'
                                databaseService.alarmBase(data, el, alarm)
                                //return
                            }
                        }
                    }
                }
            }
        })
    }



}




module.exports = { AlarmControll }