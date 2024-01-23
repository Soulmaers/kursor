const databaseService = require('../services/database.service');
const wialonService = require('../services/wialon.service');
const structura = require('./structura.module')


class SummaryStatistiks {
    constructor(object) {
        this.object = object
        this.strustura = {}
        this.data = '-'
        this.id = '-'
        this.nameCar = '-'
        this.probeg = '-'
        this.zapravka = '-'
        this.rashod = '-'
    }

    async testovfnNew(active, t1, t2) {
        const resultt = await databaseService.viewSortDataToBase(active, t1, t2)
        return resultt
    }
    timefn() {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const startOfTodayUnix = Math.floor(currentDate.getTime() / 1000);
        const unix = Math.floor(new Date().getTime() / 1000);
        const timeNow = unix
        const timeOld = startOfTodayUnix
        return [timeNow, timeOld]
    }

    async init() {
        const idwArray = this.object
            .map(el => Object.values(el)) // получаем массивы всех id
            .flat()
            .map(e => [e[4], e[0].message, e[5]])
        // Запускаем все асинхронные операции одновременно и ждем их завершения
        const dataPromises = idwArray.map(el => this.getSensorsAndParametrs(el[0]));
        const dataResults = await Promise.all(dataPromises);
        // Обрабатываем результаты асинхронных операций
        for (let i = 0; i < idwArray.length; i++) {
            const id = idwArray[i][0];
            const message = idwArray[i][1];
            const group = idwArray[i][2];
            this.strustura[id] = {
                ts: 1,
                nameCar: message,
                group: group,
                type: 'Тест',
                // По умолчанию ставим заполнители
                probeg: '-',
                job: '-',
                rashod: '-',
                zapravka: '-',
                medium: '-',
                moto: '-',
                prostoy: '-'
            };

            this.data = dataResults[i];
            //  console.log(this.data)
            const mileg = this.data.some(it => it.params === 'mileage');// const mileg = this.data.some(it => it.params === 'can_mileage' || it.params === 'mileage');
            if (mileg) {
                this.probeg = this.calculationMileage();
                this.strustura[id].probeg = this.probeg;
                this.strustura[id].job = this.calculationJobTs();
            }

            const oil = this.data.some(it => it.sens === 'Топливо');// const oil = this.data.some(it => it.sens === 'Топливо' || it.sens === 'Топливо ДУТ');
            if (oil) {
                const [rashod, zapravka] = this.calculationOil();
                this.strustura[id].rashod = rashod;
                this.strustura[id].zapravka = zapravka;
                this.strustura[id].medium = this.calculationMedium();
            }

            const engine = this.data.some(it => it.sens.startsWith('Зажигание'));
            if (engine) {
                const [moto, prostoy] = this.calculationMotoAndProstoy();
                this.strustura[id].moto = moto;
                this.strustura[id].prostoy = prostoy;
            }
        }

        return this.strustura;
    }

    calculationMedium() {
        let medium;
        if (this.probeg !== 0 && this.probeg !== '-') {
            medium = Number(((this.rashod / this.probeg) * 100).toFixed(0))
        }
        else {
            medium = '-'

        }
        return medium
    }
    calculationJobTs() {
        if (this.probeg > 5) {
            return 1
        } else {
            return 0
        }
    }
    calculationMileage() {
        const arrayValue = this.data.find(it => it.params === 'can_mileage' || it.params === 'mileage');
        let probegZero = 0
        let probegNow = 0;
        //  if (el == 27697145) {
        //  console.log(arrayValue.value)
        //  }
        if (arrayValue.value.length !== 0) {
            if (Number(arrayValue.value[arrayValue.value.length - 1].toFixed(0)) === 0) {
                for (let i = arrayValue.value.length - 1; i >= 0; i--) {
                    if (Number(arrayValue.value[i].toFixed(0)) !== 0) {
                        probegNow = Number(arrayValue.value[i].toFixed(0));
                        break;
                    }
                }
            } else {
                probegNow = Number(arrayValue.value[arrayValue.value.length - 1].toFixed(0));
            }
            if (Number(arrayValue.value[0].toFixed(0)) === 0) {
                for (let i = 0; i <= arrayValue.value.length - 1; i++) {
                    if (Number(arrayValue.value[i].toFixed(0)) !== 0) {
                        if (this.id == 27472317) {
                            probegZero = 373134
                        }
                        else {
                            probegZero = Number(arrayValue.value[i].toFixed(0));
                        }
                        break;
                    }
                }
            } else {
                probegZero = Number(arrayValue.value[0].toFixed(0));
            }
        }

        const probegDay = probegNow - probegZero < 0 ? 0 : probegNow - probegZero;
        return probegDay
    }


    quickly(data) {
        data.sort((a, b) => {
            if (a.time > b.time) {
                return 1;
            }
            if (a.time < b.time) {
                return -1;
            }
            return 0;
        })

        const time = [];
        const speed = [];
        const sats = [];
        const geo = [];
        const oil = [];
        const meliage = [];
        const engine = [];
        const pwr = [];
        data.forEach(el => {
            const timestamp = Number(el.time);
            const date = new Date(timestamp * 1000);
            const isoString = date.toISOString();
            time.push(new Date(isoString))
            speed.push(el.speed)
            sats.push(el.sats)
            geo.push(JSON.parse(el.geo))
            oil.push(el.oil)
            meliage.push(el.meliage)
            engine.push(el.engine)
            pwr.push(el.pwr)
        })

        const allsens = [{
            time: time,
            speed: speed,
            sats: sats,
            geo: geo,
            sens: 'Топливо',
            params: 'oil',
            value: oil
        }, {
            time: time,
            speed: speed,
            sats: sats,
            geo: geo,
            sens: 'Пробег',
            params: 'mileage',
            value: meliage
        }, {
            time: time,
            speed: speed,
            sats: sats,
            geo: geo,
            sens: 'Зажигание',
            params: 'engine',
            value: engine
        }, {
            time: time,
            speed: speed,
            sats: sats,
            geo: geo,
            sens: 'Бортовое питание',
            params: 'pwr',
            value: pwr
        }]

        return allsens
    }
    async getSensorsAndParametrs(el) {
        const interval = this.timefn()
        const timeOld = interval[1]
        const timeNow = interval[0]

        const itognew = await this.testovfnNew(el, timeOld, timeNow)
        const alt = this.quickly(itognew)

        return alt
    }

    calculationOil() {
        const arrayValue = this.data.find(it => (it.sens === 'Топливо' || it.sens === 'Топливо ДУТ'))
        if (arrayValue && Array.isArray(arrayValue.value)) {
            arrayValue.value = arrayValue.value.map(element => {
                return element === -348201 ? 0 : element;
            });
        }

        let i = 0;
        while (i < arrayValue.value.length - 1) {
            if (arrayValue.value[i] === arrayValue.value[i + 1]) {
                arrayValue.value.splice(i, 1);
                arrayValue.time.splice(i, 1);
                arrayValue.speed.splice(i, 1);
                arrayValue.sats.splice(i, 1);
                arrayValue.geo.splice(i, 1)
            } else {
                i++;
            }
        }
        const increasingIntervals = [];
        let start = 0;
        let end = 0;
        for (let i = 0; i < arrayValue.value.length - 1; i++) {
            const currentObj = arrayValue.value[i];
            const nextObj = arrayValue.value[i + 1];
            const div = (arrayValue.time[i + 1].getTime() / 1000) - (arrayValue.time[i].getTime() / 1000)
            if (currentObj < nextObj) {
                if (start === end) {
                    start = i;
                }
                end = i + 1;
            } else if (currentObj > nextObj) {
                if (start !== end) {
                    increasingIntervals.push([[arrayValue.value[start], arrayValue.time[start], arrayValue.geo[start]], [arrayValue.value[end], arrayValue.time[end], arrayValue.geo[end]]]);
                }
                start = end = i + 1;
            }
        }
        if (start !== end) {
            increasingIntervals.push([[arrayValue.value[start], arrayValue.time[start], arrayValue.geo[start]], [arrayValue.value[end], arrayValue.time[end], arrayValue.geo[end]]]);
        }
        const zapravka = increasingIntervals.filter((interval, index) => {
            const firstOil = interval[0][0];
            const lastOil = interval[interval.length - 1][0];
            const difference = lastOil - firstOil;
            const threshold = firstOil * 0.15;
            if (index < increasingIntervals.length - 1) {
                const nextInterval = increasingIntervals[index + 1];
                const currentTime = interval[interval.length - 1][1];
                const nextTime = nextInterval[0][1];
                const timeDifference = nextTime - currentTime;
                if (timeDifference < 5 * 60 * 1000) {
                    interval.push(nextInterval[nextInterval.length - 1]);
                    interval.splice(1, 1)
                }
            }
            return firstOil > 5 && difference > 60 && difference >= threshold;
        });
        for (let i = 0; i < zapravka.length - 1; i++) {
            const time0 = zapravka[i][0][1]
            const time1 = zapravka[i][1][1]
            const initTime = time1 - time0
            if (zapravka[i][1][1] === zapravka[i + 1][1][1]) {
                zapravka.splice(i + 1, 1);
            }
        }
        const filteredZapravka = zapravka.filter(e => {
            const time0 = e[0][1];
            const time1 = e[1][1];
            const initTime = time1 - time0;
            return initTime >= 5 * 60 * 1000;
        });
        const rash = [];
        const firstData = arrayValue.value[0];
        const lastData = arrayValue.value[arrayValue.value.length - 1];
        if (filteredZapravka.length !== 0) {

            rash.push(firstData - filteredZapravka[0][0][0]);
            for (let i = 0; i < filteredZapravka.length - 1; i++) {
                rash.push(filteredZapravka[i][1][0] - filteredZapravka[i + 1][0][0]);
            }
            rash.push(filteredZapravka[filteredZapravka.length - 1][1][0] - lastData);
        }
        else {
            rash.push(firstData - lastData >= 0 ? firstData - lastData : 0)
        }
        const rashod = rash.reduce((el, acc) => el + acc, 0) < 0 ? '-' : rash.reduce((el, acc) => el + acc, 0)
        const zap = [];
        filteredZapravka.forEach(e => {
            zap.push(e[1][0] - e[0][0])
        })
        const zapravleno = zap.reduce((acc, el) => acc + el, 0) < 0 ? '-' : zap.reduce((acc, el) => acc + el, 0)
        return [rashod, zapravleno]
    }


    calculationMotoAndProstoy() {
        const arrayValue = this.data.find(it => it.sens === 'Зажигание');
        const zeros = [];
        const ones = [];
        const prostoy = [];
        const korzina = [];
        let startIndex = 0;
        arrayValue.value.forEach((values, index) => {
            //  console.log(index)
            if (values !== arrayValue.value[startIndex]) {
                const subarray = arrayValue.time.slice(startIndex, index);
                const speedTime = { speed: arrayValue.speed.slice(startIndex, index), time: arrayValue.time.slice(startIndex, index) };
                (arrayValue.value[startIndex] === 0 ? zeros : ones).push([subarray[0], subarray[subarray.length - 1]]);
                (arrayValue.value[startIndex] === 0 ? korzina : prostoy).push(speedTime);
                //   console.log([subarray[0], subarray[subarray.length - 1]])
                startIndex = index;
            }
        });
        const subarray = arrayValue.time.slice(startIndex);
        const speedTime = { speed: arrayValue.speed.slice(startIndex), time: arrayValue.time.slice(startIndex) };
        (arrayValue.value[startIndex] === 0 ? zeros : ones).push([subarray[0], subarray[subarray.length - 1]]);
        (arrayValue.value[startIndex] === 0 ? korzina : prostoy).push(speedTime);

        let totalMs = 0;
        //   console.log(prostoy)
        const filteredData = prostoy.map(obj => {
            const thresholdIndex = obj.speed.findIndex(s => s >= 5);
            const index = thresholdIndex === -1 ? undefined : thresholdIndex;
            return {
                speed: obj.speed.slice(0, index),
                time: obj.time.slice(0, index)
            }
        });
        const timeProstoy = filteredData.reduce((acc, el) => {
            if (el.time.length !== 0) {
                acc.push([el.time[0], el.time[el.time.length - 1]])
            }
            return acc
        }, [])

        const unixProstoy = timeProstoy.reduce((acc, it) => {
            if (it[0] !== undefined) {
                const diffInSeconds = (it[1].getTime() - it[0].getTime()) / 1000;
                if (diffInSeconds > 600) {
                    acc = acc + diffInSeconds
                }
            }
            return acc
        }, 0)
        ones.forEach(dates => {
            const validDates = dates.filter(dateStr => dateStr !== undefined);
            if (validDates.length === 2) {
                const [date1, date2] = validDates.map(dateStr => new Date(dateStr));
                const diffMs = date2.getTime() - date1.getTime(); // разница между датами в миллисекундах
                totalMs += diffMs;
            }
        });
        // console.log(totalMs)
        const motoHours = isNaN(totalMs) ? '-' : totalMs
        return [motoHours, unixProstoy]
    }
}



function timefn() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startOfTodayUnix = Math.floor(currentDate.getTime() / 1000);
    const unix = Math.floor(new Date().getTime() / 1000);
    const timeNow = unix
    const timeOld = startOfTodayUnix
    return [timeNow, timeOld]
}

const popupProstoy = async (array) => {
    const result = array
        .map(el => Object.values(el)) // получаем массивы всех значений свойств объектов
        .flat()
    const arrays = result.filter(e => e[0].message && !e[0].message.startsWith('Цистерна')).map(e => e);
    const interval = timefn()
    const timeOld = interval[1]
    const timeNow = interval[0]
    for (const e of arrays) {
        const idw = e[4];
        const model = await databaseService.modelViewToBase(idw)
        let tsiControll = model.length !== 0 && model[0].tsiControll && model[0].tsiControll !== '' ? Number(model[0].tsiControll) : null;
        tsiControll === 0 ? tsiControll = null : tsiControll = tsiControll

        if (tsiControll === null || tsiControll === undefined) {
            continue
        }
        const active = idw
        const newGlobal = await testovfnNew(active, timeOld, timeNow)
        newGlobal.sort((a, b) => {
            if (a.time > b.time) {
                return 1;
            }
            if (a.time < b.time) {
                return -1;
            }
            return 0;
        })
        const resnew = await prostoyNew(tsiControll, newGlobal)
        if (resnew) {
            resnew.forEach(async el => {
                const map = JSON.parse(el[1][1])
                const timesProstoy = timesFormat(Number(el[1][0]) - Number(el[0][0]))
                const group = e[5]
                const name = e[0].message
                const time = new Date(Number(el[0][0]) * 1000)
                const day = time.getDate();
                const month = (time.getMonth() + 1).toString().padStart(2, '0');
                const year = time.getFullYear();
                const hours = time.getHours().toString().padStart(2, '0');
                const minutes = time.getMinutes().toString().padStart(2, '0');
                const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
                const data = [{
                    event: `Простой`, group: `Компания: ${group}`,
                    name: `Объект: ${name}`,
                    time: `Дата начала простоя: ${formattedDate}`, alarm: `Время простоя: ${timesProstoy}`
                }]
                const newTime = Math.floor(new Date().getTime() / 1000)
                const delta = newTime - Number(el[1][0])
                if (delta > 900) {
                    const resu = await databaseService.controllerSaveToBase(data, idw, map, group, name)
                    console.log('Простой' + ' ' + resu.message)
                }

            })
        }

    }
}

function timesFormat(dates) {
    const totalSeconds = Math.floor(dates);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    const motoHours = `${hours}:${minutes}`;
    return motoHours;
}


async function testovfnNew(active, t1, t2) {
    const resultt = await databaseService.viewSortDataToBase(active, t1, t2)
    return resultt
}

async function prostoyNew(tsi, newdata) {
    // console.log(newdata)
    if (newdata.length === 0) {
        return undefined
    }
    else {
        const res = newdata.reduce((acc, e) => {
            if (e.pwr >= tsi && e.speed === 0 && e.sats > 4) {
                if (Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length > 0
                    && acc[acc.length - 1][0].pwr >= tsi && acc[acc.length - 1][0].speed === 0 && acc[acc.length - 1][0].sats > 4) {
                    acc[acc.length - 1].push(e);
                } else {
                    acc.push([e]);
                }
            } else if (e.pwr < tsi && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0
                || e.speed > 0 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0
                || e.sats <= 4 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0) {
                acc.push([]);
            }

            return acc;
        }, []).filter(el => el.length > 0).reduce((acc, el) => {
            if (Number(el[el.length - 1].time) - Number(el[0].time) > 1200) {
                acc.push([[el[0].time, el[0].geo, el[0].oil], [el[el.length - 1].time, el[el.length - 1].geo, el[el.length - 1].oil]])
            }
            return acc
        }, [])
        //  console.log(res)
        return res
    }

}

module.exports = {
    SummaryStatistiks,
    //  startAllStatic,
    popupProstoy
}