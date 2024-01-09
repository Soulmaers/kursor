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

    async testovfn(active, t1, t2) {
        const resultt = await databaseService.viewChartDataToBase(active, t1, t2)
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

            const mileg = this.data.some(it => it.params === 'can_mileage' || it.params === 'mileage');
            if (mileg) {
                this.probeg = this.calculationMileage();
                this.strustura[id].probeg = this.probeg;
                this.strustura[id].job = this.calculationJobTs();
            }

            const oil = this.data.some(it => it.sens === 'Топливо' || it.sens === 'Топливо ДУТ');
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
        const probegDay = probegNow - probegZero < 0 ? 0 : probegNow - probegZero;
        return probegDay
    }

    async getSensorsAndParametrs(el) {
        const interval = this.timefn()
        const timeOld = interval[1]
        const timeNow = interval[0]
        const itog = await this.testovfn(el, timeOld, timeNow)
        itog.sort((a, b) => {
            if (a.time > b.time) {
                return 1;
            }
            if (a.time < b.time) {
                return -1;
            }
            return 0;
        })
        //   console.log(itog)
        const time = [];
        const speed = [];
        const sats = [];
        const geo = [];
        itog.forEach(el => {
            const timestamp = Number(el.data);
            const date = new Date(timestamp * 1000);
            const isoString = date.toISOString();
            time.push(new Date(isoString))
            speed.push(el.speed)
            sats.push(el.sats)
            geo.push(JSON.parse(el.geo))
        })

        const allsens = itog.map(it => {
            const parse = JSON.parse(it.allSensParams)

            return { sens: parse.map(e => e[0]), params: parse.map(e => e[1]), val: parse.map(e => e[2]) }
        })
        if (allsens.length === 0) {
            return []
        }
        //  console.log(allsens)
        const allArrNew = allsens.reduce((accumulator, current) => {
            current.sens.forEach((sens, idx) => {
                const params = current.params[idx];
                const value = current.val[idx] !== null ? parseFloat(current.val[idx].toFixed(0)) : 0;
                const found = accumulator.find(
                    (item) => item.sens === sens && item.params === params
                );
                if (found) {
                    found.value.push(value);
                } else {
                    accumulator.push({ sens, params, value: [value] });
                }
            });
            return accumulator;
        }, []);

        allArrNew.forEach(el => {
            el.time = time
            el.speed = speed
            el.sats = sats
            el.geo = geo
        })
        return allArrNew
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













/*
async function testovfn(active, t1, t2) {
    const resultt = await databaseService.viewChartDataToBase(active, t1, t2)
    return resultt
}
const startAllStatic = async (objects) => {
    const interval = timefn()
    const timeOld = interval[1]
    const timeNow = interval[0]
    structura.datas(objects, timeNow, timeOld)
    const result = objects
        .map(el => Object.values(el)) // получаем массивы всех значений свойств объектов
        .flat()

    result.forEach(el => {
        if (el[0].message === 'Цистерна ДТ') {
            el.push('Цистерна');
        } else if (el[0].result && el[0].result[0] && el[0].result[0].type) {
            el.push(el[0].result[0].type);
        }
    });
    const array = result
    
        .filter(e => e[6] ? e[6].startsWith('Самосвал') : null)
        .map(e => e);

    const res = await loadValue(result, timeOld, timeNow)
 
    return res.uniq
}
async function loadValue(array, timeOld, timeNow) {
    const uniqObject = {};
    for (const e of array) {
        const name = e[0].message
        const group = e[5]
        let lifting = 0
        let prostoyHH;
        const time = [];
        const speed = [];
        const sats = [];
        const geo = [];
        const idw = e[4];
        try {
            const itog = await testovfn(idw, timeOld, timeNow)
            itog.forEach(el => {
                const timestamp = Number(el.data);
                const date = new Date(timestamp * 1000);
                const isoString = date.toISOString();
                time.push(new Date(isoString))
                speed.push(el.speed)
                sats.push(el.sats)
                geo.push(JSON.parse(el.geo))
            })
            const sensArr = itog.map(e => {
                return JSON.parse(e.sens)
            })
            const allsens = itog.map(it => {
                return { sens: JSON.parse(it.allSensParams).map(e => e[0]), params: JSON.parse(it.allSensParams).map(e => e[1]), val: JSON.parse(it.allSensParams).map(e => e[2]) }
            })



            if (allsens.length === 0) {
                continue
            }
            const allArrNew = allsens.reduce((accumulator, current) => {
                current.sens.forEach((sens, idx) => {
                    const params = current.params[idx];
                    const value = parseFloat(current.val[idx].toFixed(0));
                    const found = accumulator.find(
                        (item) => item.sens === sens && item.params === params
                    );
                    if (found) {
                        found.value.push(value);
                    } else {
                        accumulator.push({ sens, params, value: [value] });
                    }
                });
                return accumulator;
            }, []);

            allArrNew.forEach(el => {
                el.time = time
                el.speed = speed
                el.sats = sats
                el.geo = geo
            })

            const oil = [];
            const hh = [];
            let probeg;
            const found = allArrNew.some(it => it.params === 'can_mileage' || it.params === 'mileage');
            if (found) {

                console.log('раз');
                const it = allArrNew.find(it => it.params === 'can_mileage' || it.params === 'mileage');
                console.log(name)
                //  console.log(it.value)
                let probegZero = 0
                let probegNow = 0;
                if (it.value.length !== 0) {
                    if (Number(it.value[it.value.length - 1].toFixed(0)) === 0) {
                        for (let i = it.value.length - 1; i >= 0; i--) {
                            if (Number(it.value[i].toFixed(0)) !== 0) {
                                probegNow = Number(it.value[i].toFixed(0));
                                break;
                            }
                        }
                    } else {
                        probegNow = Number(it.value[it.value.length - 1].toFixed(0));
                    }
                    if (Number(it.value[0].toFixed(0)) === 0) {
                        for (let i = 0; i <= it.value.length - 1; i++) {
                            if (Number(it.value[i].toFixed(0)) !== 0) {
                                probegZero = Number(it.value[i].toFixed(0));
                                break;
                            }
                        }
                    } else {
                        probegZero = Number(it.value[0].toFixed(0));
                    }
                }
                const probegDay = probegNow - probegZero;
                probeg = probegDay
                if (probegDay > 5) {
                    uniqObject[idw] = { ...uniqObject[idw], quantityTSjob: 1, probeg: probegDay };
                } else {
                    uniqObject[idw] = { ...uniqObject[idw], quantityTSjob: 0, probeg: probegDay };
                }
            } else {
                continue
                console.log('два');
                //  uniqObject[idw] = { ...uniqObject[idw], quantityTSjob: 0, probeg: 0 };
            }
            let hasFuelSensor = false;
            allArrNew.forEach(it => {
                if (it.sens === 'Топливо' || it.sens === 'Топливо ДУТ') {
                    it.value.forEach((e, i) => {
                        if (e === -348201) {
                            it.value[i] = it.value[i - 1];
                        }
                    });
                    oil.push(it.value)
                    const res = it.value !== undefined && it.value.every(item => item >= 0) && probeg > 5 ? rashodCalc(it, name, group, idw) : [{ rashod: 0, zapravka: 0 }]
                    uniqObject[idw] = { ...uniqObject[idw], rashod: res[0].rashod, zapravka: res[0].zapravka };
                    hasFuelSensor = true;
                }
                 if (!hasFuelSensor) {
                     return
                     //   uniqObject[idw] = { ...uniqObject[idw], rashod: 0, zapravka: 0 };
                 }
                if (it.sens.startsWith('Подъем')) {
                    lifting = moto(it)
                }
                uniqObject[idw] = { ...uniqObject[idw], lifting: lifting };
                if (it.sens.startsWith('Зажигание')) {
                    hh.push(it)
                    const res = moto(it);
                    const prostoyHours = res.prostoy !== 0 ? res.prostoy.reduce((acc, el) => acc + el, 0) : 0
                    uniqObject[idw] = { ...uniqObject[idw], motoHours: res.moto, prostoy: prostoyHours };
                }
            })
            hh[0].oil = oil[0] ? oil[0] : 0
            const oneArrayOil = hh.filter(el => !el.sens.startsWith('Топливо'));
        
            if (oneArrayOil.oil !== 0) {
                prostoyHH = oneArrayOil[0].oil !== 0 && oneArrayOil[0].oil !== undefined && oneArrayOil[0].oil.every(item => item >= 0) ? oilHH(oneArrayOil[0]) : 0
            }
         
        } catch (error) {
            console.log(error);
        }
        let medium;
        if (uniqObject[idw].rashod) {
            medium = uniqObject[idw] && uniqObject[idw].probeg !== 0 && uniqObject[idw].rashod !== 0 ? Number(((uniqObject[idw].rashod / uniqObject[idw].probeg) * 100).toFixed(2)) : 0
        }
        else {
            medium = 0
        }
             uniqObject[idw] = { ...uniqObject[idw], medium: medium, hhOil: prostoyHH, nameCar: e[0].message, type: e[0].result[0] ? e[0].result[0].type : 'Тест', company: e[5] }
    }
    return { uniq: uniqObject }
}
function oilHH(data) {
    const arr = [];
    let currentObj = null;
    let currentArr = [];

    for (let i = 0; i < data.value.length; i++) {
        const currentValue = data.value[i];
        const currentSpeed = data.speed[i];
        const currentTime = data.time[i];
        const currentSats = data.sats[i];
        const currentOil = data.oil[i];
        if (currentValue === 1) {
            if (!currentObj) {
                currentObj = { value: [], speed: [], oil: [], time: [], sats: [] };
                currentArr.push(currentObj);
            }

            currentObj.value.push(currentValue);
            currentObj.speed.push(currentSpeed);
            currentObj.sats.push(currentSats);
            currentObj.oil.push(currentOil);
            currentObj.time.push(currentTime);
        } else {
            if (currentObj) {
                arr.push(currentArr);
            }
            currentObj = null;
            currentArr = [];
        }
    }

    if (currentObj) {
        arr.push(currentArr);
    }

    const filteredArr = arr.map(subArr => {
        const filteredSubArr = { value: [], speed: [], oil: [], time: [], sats: [] };

        for (let i = 0; i < subArr[0].speed.length; i++) {
            if (subArr[0].speed[i] < 5) {
                filteredSubArr.value.push(subArr[0].value[i]);
                filteredSubArr.speed.push(subArr[0].speed[i]);
                filteredSubArr.oil.push(subArr[0].oil[i]);
                filteredSubArr.time.push(subArr[0].time[i]);
                filteredSubArr.sats.push(subArr[0].sats[i]);
            }
        }

        return filteredSubArr;
    });
    const timeProstoy = filteredArr.map(el => {
        return { time: [el.time[0], el.time[el.time.length - 1]], oil: [el.oil[0], el.oil[el.oil.length - 1]], speed: [el.speed[0], el.speed[el.speed.length - 1]] }
    })
    const oilProstoy = [];
    timeProstoy.forEach(it => {
        if (it.time[0] !== undefined) {
            const diffInSeconds = (it.time[1].getTime() - it.time[0].getTime()) / 1000;
            if (diffInSeconds > 1200) {
                oilProstoy.push(it.oil[0] - it.oil[1] > 0 ? it.oil[0] - it.oil[1] : 0)
            }
        }
    })

    const res = oilProstoy.reduce((acc, el) => acc + el, 0)
    return 0
}

function timesFormat(dates) {
    const totalSeconds = Math.floor(dates);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    const motoHours = `${hours}:${minutes}`;
    return motoHours;
}

function moto(data) {
    if (data.value.length === 0) {
        return { moto: 0, prostoy: 0 }
    }
    else {
        const zeros = [];
        const ones = [];
        const prostoy = [];
        const korzina = [];
        const razgruzka = [];
        let startIndex = 0;
        data.value.forEach((values, index) => {
            if (values !== data.value[startIndex]) {
                const subarray = data.time.slice(startIndex, index);
                const speedTime = { speed: data.speed.slice(startIndex, index), time: data.time.slice(startIndex, index) };
                (data.value[startIndex] === 0 ? zeros : ones).push([subarray[0], subarray[subarray.length - 1]]);
                (data.value[startIndex] === 0 ? korzina : prostoy).push(speedTime);
                if (data.sens.startsWith('Под')) {
                    const raz = { value: data.value.slice(startIndex, index), time: data.time.slice(startIndex, index) };
                    (data.value[startIndex] === 0 ? korzina : razgruzka).push(raz);
                }
                startIndex = index;
            }
        });
        const subarray = data.time.slice(startIndex);
        const speedTime = { speed: data.speed.slice(startIndex), time: data.time.slice(startIndex) };
        (data.value[startIndex] === 0 ? zeros : ones).push([subarray[0], subarray[subarray.length - 1]]);
        (data.value[startIndex] === 0 ? korzina : prostoy).push(speedTime);
        if (data.sens.startsWith('Под')) {
            const raz = { value: data.value.slice(startIndex), time: data.time.slice(startIndex) };
            (data.value[startIndex] === 0 ? korzina : razgruzka).push(raz);
        }
        let totalMs = 0;
        const filteredData = prostoy.map(obj => {
            const newS = [];
            const timet = [];
            for (let i = 0; i < obj.speed.length; i++) {
                if (obj.speed[i] < 5) {
                    newS.push(obj.speed[i]);
                    timet.push(obj.time[i])
                } else {
                    break;
                }
            }
            return { speed: newS, time: timet };
        });
        const timeProstoy = filteredData.map(el => {
            return [el.time[0], el.time[el.time.length - 1]]
        })
        const unixProstoy = [];
        timeProstoy.forEach(it => {
            if (it[0] !== undefined) {
                const diffInSeconds = (it[1].getTime() - it[0].getTime()) / 1000;
                if (diffInSeconds > 600) {
                    unixProstoy.push(diffInSeconds)
                }
            }
        })
        ones.forEach(dates => {
            const validDates = dates.filter(dateStr => dateStr !== undefined);
            if (validDates.length === 2) {
                const [date1, date2] = validDates.map(dateStr => new Date(dateStr));
                const diffMs = date2.getTime() - date1.getTime(); // разница между датами в миллисекундах
                totalMs += diffMs;
            }
        });
        const motoHours = isNaN(totalMs) ? 0 : totalMs
        if (data.sens.startsWith('Под')) {
            const timeGran = razgruzka.map(el => {
                return [el.time[0], el.time[el.time.length - 1]]
            })
            const mass = [];
            if (timeGran.length > 1) {
                let start = 0; // начальный индекс для сравнения
                for (let i = 0; i < timeGran.length - 1; i++) {
                    const diffInSeconds = (timeGran[i + 1][0].getTime() - timeGran[start][1].getTime()) / 1000;
                    if (diffInSeconds > 900) {
                        mass.push([timeGran[start][0], timeGran[start][1]])
                        start = i + 1; // обновляем начальный индекс
                    }
                }
            }
            if (timeGran.length === 1) {
                mass.push([timeGran])
            }
            return mass.length
        }
        return { moto: motoHours, prostoy: unixProstoy }
    }
}

function rashodCalc(data, name, group, idw) {
    console.log('заправки')
    let i = 0;
    while (i < data.value.length - 1) {
        if (data.value[i] === data.value[i + 1]) {
            data.value.splice(i, 1);
            data.time.splice(i, 1);
            data.speed.splice(i, 1);
            data.sats.splice(i, 1);
            data.geo.splice(i, 1)
        } else {
            i++;

        }
    }
    const increasingIntervals = [];
    let start = 0;
    let end = 0;
    for (let i = 0; i < data.value.length - 1; i++) {
        const currentObj = data.value[i];
        const nextObj = data.value[i + 1];
        const div = (data.time[i + 1].getTime() / 1000) - (data.time[i].getTime() / 1000)
        //  console.log(div)
        if (currentObj < nextObj) {
            if (start === end) {
                start = i;
            }
            end = i + 1;
        } else if (currentObj > nextObj) {
            //  console.log(data.time[end])
            //  console.log(data.time[data.time.length - 1])
            if (start !== end) {
                increasingIntervals.push([[data.value[start], data.time[start], data.geo[start]], [data.value[end], data.time[end], data.geo[end]]]);
            }
            start = end = i + 1;
        }
    }
    if (start !== end) {
        increasingIntervals.push([[data.value[start], data.time[start], data.geo[start]], [data.value[end], data.time[end], data.geo[end]]]);
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
        console.log(time0)
        const time1 = zapravka[i][1][1]
        const initTime = time1 - time0
        console.log('время' + initTime)
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
    const firstData = data.value[0];
    const lastData = data.value[data.value.length - 1];
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
     const rashod = rash.reduce((el, acc) => el + acc, 0)
    const zap = [];
    filteredZapravka.forEach(e => {
        zap.push(e[1][0] - e[0][0])
    })
    const zapravleno = (zap.reduce((acc, el) => acc + el, 0))
    return [{ rashod: rashod < 0 ? 0 : rashod, zapravka: zapravleno < 0 ? 0 : zapravleno }]
}
function timefn() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startOfTodayUnix = Math.floor(currentDate.getTime() / 1000);
    const unix = Math.floor(new Date().getTime() / 1000);
    const timeNow = unix
    const timeOld = startOfTodayUnix
    return [timeNow, timeOld]
}*/

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
        const time = [];
        const speed = [];
        const sats = [];
        const geo = [];
        const idw = e[4];
        const model = await databaseService.modelViewToBase(idw)
        let tsiControll = model.length !== 0 && model[0].tsiControll && model[0].tsiControll !== '' ? Number(model[0].tsiControll) : null;
        tsiControll === 0 ? tsiControll = null : tsiControll = tsiControll

        if (tsiControll === null || tsiControll === undefined) {
            continue
        }

        const itog = await testovfn(idw, timeOld, timeNow)


        itog.forEach(el => {
            const timestamp = Number(el.data);
            const date = new Date(timestamp * 1000);
            const isoString = date.toISOString();
            time.push(new Date(isoString))
            speed.push(el.speed)
            sats.push(el.sats)
            geo.push(JSON.parse(el.geo))
        })
        const sensArr = itog.map(e => {
            return JSON.parse(e.sens)
        })
        const res = await wialonService.getAllNameSensorsIdDataFromWialon(idw)
        const nameSens = [];
        Object.entries(res.item.sens).forEach(el => {
            nameSens.push([el[1].n, el[1].p])
        })
        const allArrNew = [];
        if (sensArr[0] && nameSens.length === sensArr[0].length) {
            nameSens.forEach((item) => {
                allArrNew.push({ sens: item[0], params: item[1], value: [] })
            })
        }
        nameSens.pop()
        nameSens.forEach((item) => {
            allArrNew.push({ sens: item[0], params: item[1], value: [] })
        })
        if (sensArr.length === 0) {
            return
        }
        sensArr.forEach(el => {
            if (el.length === 0) {
                return // Пропускаем текущую итерацию, если sensArr пустой
            }
            for (let i = 0; i < allArrNew.length; i++) {
                allArrNew[i].value.push(Number(Object.values(el)[i].toFixed(0)))
            }
        });
        allArrNew.forEach(el => {
            el.time = time
            el.speed = speed
            el.sats = sats
            el.geo = geo
        })
        allArrNew.forEach(async it => {
            if (it.sens.startsWith('Бортовое')) {
                const res = prostoy(it, tsiControll);
                if (res !== undefined) {
                    const map = res[3]
                    const timesProstoy = timesFormat(res[0])
                    const group = e[5]
                    const name = e[0].message
                    const time = res[1]
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
                    const resu = await databaseService.controllerSaveToBase(data, idw, map, group, name)
                    console.log('Простой' + ' ' + resu.message)
                }
            }
        })
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

async function testovfn(active, t1, t2) {
    const resultt = await databaseService.viewChartDataToBase(active, t1, t2)
    return resultt
}

function prostoy(data, tsi) {
    if (data.value.length === 0) {
        return undefined
    }
    else {
        const prostoy = [];
        const korzina = [];
        let startIndex = 0;
        data.value.forEach((values, index) => {
            if (values !== data.value[startIndex]) {
                const speedTime = { speed: data.speed.slice(startIndex, index), time: data.time.slice(startIndex, index), geo: data.geo.slice(startIndex, index) };
                (data.value[startIndex] <= tsi ? korzina : prostoy).push(speedTime);
                startIndex = index;
            }
        });
        const speedTime = { speed: data.speed.slice(startIndex), time: data.time.slice(startIndex), geo: data.geo.slice(startIndex) };
        (data.value[startIndex] <= tsi ? korzina : prostoy).push(speedTime);
        const filteredData = prostoy.map(obj => {
            const newS = [];
            const timet = [];
            const geo = []
            for (let i = 0; i < obj.speed.length; i++) {
                if (obj.speed[i] < 5) {
                    newS.push(obj.speed[i]);
                    timet.push(obj.time[i])
                    geo.push(obj.geo[i])
                } else {
                    break;
                }
            }

            return { speed: newS, time: timet, geo: geo };
        });

        const timeProstoy = filteredData.map(el => {
            return [el.time[0], el.time[el.time.length - 1], el.geo[0]]
        })
        const unixProstoy = [];
        timeProstoy.forEach(it => {
            if (it[0] !== undefined) {
                const diffInSeconds = (it[1].getTime() - it[0].getTime()) / 1000;
                if (diffInSeconds > 1200 && data.value[data.value.length - 1] <= tsi || diffInSeconds > 1200 && data.speed[data.speed.length - 1] >= 5) {
                    unixProstoy.push([diffInSeconds, it[0], it[1], it[2]])
                }
            }
        })
        const timeBukl = unixProstoy[unixProstoy.length - 1]
        return timeBukl
    }
}


module.exports = {
    SummaryStatistiks,
    //  startAllStatic,
    popupProstoy
}