const databaseService = require('../services/database.service');
const wialonService = require('../services/wialon.service');

async function testovfn(active, t1, t2) {
    const resultt = await databaseService.viewChartDataToBase(active, t1, t2)
    return resultt
}



exports.startAllStatic = async (objects) => {
    console.log('статик?')
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
        //   .filter(e => e[0].message.startsWith('Sitrack'))
        .filter(e => e[6] ? e[6].startsWith('Самосвал') : null)
        .map(e => e);
    const interval = timefn()
    const timeOld = interval[1]
    const timeNow = interval[0]
    const res = await loadValue(array, timeOld, timeNow)
    //  console.log(res)
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
            sensArr.forEach(el => {
                if (el.length === 0) {
                    return; // Пропускаем текущую итерацию, если sensArr пустой
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
            const oil = [];
            const hh = [];
            let probeg;
            const found = allArrNew.some(it => it.params === 'can_mileage');
            if (found) {
                console.log('раз');
                const it = allArrNew.find(it => it.params === 'can_mileage');
                const probegZero = it.value.length !== 0 ? Number((it.value[0]).toFixed(0)) : 0;
                const probegNow = it.value.length !== 0 ? Number((it.value[it.value.length - 1]).toFixed(0)) : 0;
                const probegDay = probegNow - probegZero;
                probeg = probegDay
                if (probegDay > 5) {
                    uniqObject[idw] = { ...uniqObject[idw], quantityTSjob: 1, probeg: probegDay };
                } else {
                    uniqObject[idw] = { ...uniqObject[idw], quantityTSjob: 0, probeg: probegDay };
                }
            } else {
                console.log('два');
                uniqObject[idw] = { ...uniqObject[idw], quantityTSjob: 0, probeg: 0 };
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
                    uniqObject[idw] = { ...uniqObject[idw], rashod: 0, zapravka: 0 };
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
            hh[0].oil = oil[0]
            const oneArrayOil = hh.filter(el => !el.sens.startsWith('Топливо'));
            prostoyHH = oneArrayOil[0].oil !== undefined && oneArrayOil[0].oil.every(item => item >= 0) ? oilHH(oneArrayOil[0]) : 0

        } catch (error) {
            console.log(error);
        }
        const medium = uniqObject[idw] && uniqObject[idw].probeg !== 0 && uniqObject[idw].rashod !== 0 ? Number(((uniqObject[idw].rashod / uniqObject[idw].probeg) * 100).toFixed(2)) : 0
        uniqObject[idw] = { ...uniqObject[idw], medium: medium, hhOil: prostoyHH, nameCar: e[0].message, type: e[0].result[0].type, company: e[5] }
    }
    return { uniq: uniqObject }
}
function oilHH(data) {
    const zeros = [];
    const ones = [];
    const prostoy = [];
    const korzina = [];
    let startIndex = 0;
    data.value.forEach((values, index) => {
        if (values !== data.value[startIndex]) {
            const subarray = data.time.slice(startIndex, index);
            const speedTime = { sats: data.sats.slice(startIndex, index), speed: data.speed.slice(startIndex, index), time: data.time.slice(startIndex, index), oil: data.oil.slice(startIndex, index) };
            (data.value[startIndex] === 0 ? zeros : ones).push([subarray[0], subarray[subarray.length - 1]]);
            (data.value[startIndex] === 0 ? korzina : prostoy).push(speedTime);
            startIndex = index;
        }
    });
    const subarray = data.time.slice(startIndex);
    const speedTime = { sats: data.sats.slice(startIndex), speed: data.speed.slice(startIndex), time: data.time.slice(startIndex), oil: data.oil.slice(startIndex) };
    (data.value[startIndex] === 0 ? zeros : ones).push([subarray[0], subarray[subarray.length - 1]]);
    (data.value[startIndex] === 0 ? korzina : prostoy).push(speedTime);
    const filteredData = prostoy.map(obj => {
        const newS = [];
        const timet = [];
        const oil = [];
        const sats = [];
        for (let i = 0; i < obj.speed.length; i++) {
            if (obj.speed[i] < 5) {
                newS.push(obj.speed[i]);
                timet.push(obj.time[i])
                oil.push(obj.oil[i])
                sats.push(obj.sats[i])
            } else {
                break;
            }
        }
        return { speed: newS, time: timet, oil: oil, sats: sats };
    });
    const timeProstoy = filteredData.map(el => {
        return { time: [el.time[0], el.time[el.time.length - 1]], oil: [el.oil[0], el.oil[el.oil.length - 1]], speed: [el.speed[0], el.speed[el.speed.length - 1]] }
    })
    const oilProstoy = [];
    timeProstoy.forEach(it => {
        if (it.time[0] !== undefined) {
            const diffInSeconds = (it.time[1].getTime() - it.time[0].getTime()) / 1000;
            if (diffInSeconds > 600) {
                oilProstoy.push(it.oil[0] - it.oil[1])
            }
        }
    })
    const res = oilProstoy.reduce((acc, el) => acc + el, 0)
    return res
}
function timesDate(dates) {
    let totalMs;
    if (dates.length > 1) {
        const [date1, date2] = dates.map(dateStr => dateStr);
        const diffMs = date2 + date1; // разница между датами в миллисекундах
        totalMs = diffMs;
    }
    else {
        totalMs = dates;
    }
    const totalSeconds = Math.floor(totalMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const motoHours = `${hours}:${minutes}`
    return motoHours
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
        if (currentObj < nextObj && div < 180) {
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
    console.log(increasingIntervals)
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
        return firstOil > 5 && difference >= threshold;
    });

    for (let i = 0; i < zapravka.length - 1; i++) {
        if (zapravka[i][1][1] === zapravka[i + 1][1][1]) {
            zapravka.splice(i + 1, 1);
        }
    }
    const rash = [];
    const firstData = data.value[0];
    const lastData = data.value[data.value.length - 1];
    if (zapravka.length !== 0) {
        console.log(zapravka)
        console.log(zapravka[zapravka.length - 1][1][1].getTime() / 1000)
        console.log((new Date().getTime() / 1000).toFixed(0))
        const diff = (Number(new Date().getTime() / 1000).toFixed(0)) - (zapravka[zapravka.length - 1][1][1].getTime() / 1000)
        console.log(diff)
        if (zapravka[zapravka.length - 1][1][0] >= data.value[data.value.length - 1] && diff > 120) {
            console.log(zapravka + 'условие')
            modalView(zapravka, name, group, idw);
        }

        rash.push(firstData - zapravka[0][0][0]);
        for (let i = 0; i < zapravka.length - 1; i++) {
            rash.push(zapravka[i][1][0] - zapravka[i + 1][0][0]);
        }
        rash.push(zapravka[zapravka.length - 1][1][0] - lastData);
    }
    else {
        rash.push(firstData - lastData >= 0 ? firstData - lastData : 0)
    }
    const rashod = rash.reduce((el, acc) => el + acc, 0)
    const zap = [];

    zapravka.forEach(e => {
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
}


async function modalView(zapravka, name, group, idw) {
    const litrazh = zapravka[0][1][0] - zapravka[0][0][0]
    const geo = zapravka[0][0][2]
    const time = zapravka[0][0][1]

    const day = time.getDate();
    const month = (time.getMonth() + 1).toString().padStart(2, '0');
    const year = time.getFullYear();
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    const data = [{ event: `Заправка`, group: `Компания: ${group}`, name: `Объект: ${name}`, litrazh: `Запралено: ${litrazh} л.`, time: `Время: ${formattedDate}`, res: `${geo}` }]
    const res = await databaseService.controllerSaveToBase(data, idw)
    console.log('Заправка' + ' ' + res.message)
    //  createPopup([{ event: `Заправка`, group: `Компания: ${group}`, name: `Объект: ${name}`, litrazh: `Запралено: ${litrazh} л.`, time: `Время: ${formattedDate}`, res: `Местоположение: ${geo}` }], idw)
}


exports.popupProstoy = async (array) => {
    const result = array
        .map(el => Object.values(el)) // получаем массивы всех значений свойств объектов
        .flat()
    const arrays = result.filter(e => e[6] && !e[6].startsWith('Цистерна')).map(e => e);
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

        let tsiControll = model.length !== 0 || model[0].tsiControll && model[0].tsiControll !== '' ? Number(model[0].tsiControll) : null;
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
                    console.log(res[2].getTime() / 1000)
                    console.log(((new Date()).getTime() / 1000).toFixed(0))
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
                        time: `Дата начала простоя: ${formattedDate}`, alarm: `Время простоя: ${timesProstoy}`, res: `${map}`
                    }]
                    const resu = await databaseService.controllerSaveToBase(data, idw)
                    console.log('Простой' + ' ' + resu.message)
                }
            }
        })
    }
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