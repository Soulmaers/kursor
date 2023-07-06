
import { fnParMessage, fnPar } from './grafiks.js'

export let uniqglobalInfo;


export async function startAllStatic(objects) {
    console.log('статика')

    const login = document.querySelectorAll('.log')[1].textContent
    const result = objects
        .map(el => Object.values(el)) // получаем массивы всех значений свойств объектов
        .flat()

    const array = result
        .filter(e => e[0].message.startsWith('Sitrack'))
        // .filter(e => e[5].startsWith('Ромакс') && e[0].message !== 'Цистерна ДТ')
        .map(e => e);
    console.log(array)
    const interval = timefn()
    const timeOld = interval[1]
    const timeNow = interval[0]
    const res = await loadValue(array, timeOld, timeNow, login)
    uniqglobalInfo = res.uniq
    console.log(uniqglobalInfo)
    const globalInfo = {};
    globalInfo.quantityTS = array.length
    for (const prop in res.uniq) {
        const subObj = res.uniq[prop];
        for (const subProp in subObj) {
            globalInfo[subProp] = (globalInfo[subProp] || 0) + subObj[subProp];
        }
    }
    globalInfo.motoHours = timesDate(globalInfo.motoHours)
    globalInfo.prostoy = timesFormat(globalInfo.prostoy)
    globalInfo.medium = globalInfo.quantityTSjob !== 0 ? Number((globalInfo.medium / globalInfo.quantityTSjob).toFixed(2)) : 0
    delete globalInfo.nameCar
    delete globalInfo.type
    console.log(globalInfo);

    const propOrder = ["quantityTS", "quantityTSjob", 'probeg', "rashod", "zapravka", "lifting", "motoHours", "prostoy", "medium", "hhOil"];
    const arr = propOrder.map(prop => globalInfo[prop]);
    const todayValue = document.querySelectorAll('.today_value')
    arr.forEach((e, index) => {
        todayValue[index].textContent = (e !== undefined && e !== null) ? e : '-'
    })
}
async function loadValue(array, timeOld, timeNow, login) {
    const uniqObject = {};
    for (const e of array) {
        let lifting = 0
        let prostoyHH;
        const time = [];
        const speed = [];
        const idw = e[4];
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw, timeOld, timeNow, login }))
        };
        try {
            const res = await fetch('/api/loadInterval', param);
            const itog = await res.json();
            console.log(itog)
            itog.messages.forEach(el => {
                const timestamp = el.t;
                const date = new Date(timestamp * 1000);
                const isoString = date.toISOString();
                time.push(new Date(isoString))
                speed.push(el.pos.s)
            })
            const probegZero = itog.messages[0].p.can_mileage ? Number((itog.messages[0].p.can_mileage).toFixed(0)) : itog.messages[0].p.mileage ? Number((itog.messages[0].p.mileage).toFixed(0)) : null;
            const probegNow = itog.messages[0].p.can_mileage ? Number((itog.messages[itog.messages.length - 1].p.can_mileage).toFixed(0)) : itog.messages[0].p.mileage ? Number((itog.messages[itog.messages.length - 1].p.mileage).toFixed(0)) : null;
            const probegDay = probegNow - probegZero;
            if (probegDay > 5) {
                uniqObject[idw] = { ...uniqObject.idw, quantityTSjob: 1, probeg: probegDay };
            }
            else {
                uniqObject[idw] = { ...uniqObject.idw, quantityTSjob: 0, probeg: probegDay };
            }
            const sensArr = await fnPar(idw)
            const nameSens = await fnParMessage(idw)
            const allArrNew = [];
            nameSens.forEach((item) => {
                allArrNew.push({ sens: item[0], params: item[1], value: [] })
            })
            sensArr.forEach(el => {
                for (let i = 0; i < allArrNew.length; i++) {
                    allArrNew[i].value.push(Number(Object.values(el)[i].toFixed(0)))
                }
            })
            allArrNew.forEach(el => {
                el.time = time
                el.speed = speed
            })
            console.log(allArrNew)
            const oil = [];
            const hh = [];
            allArrNew.forEach(it => {
                if (it.sens === 'Топливо') {
                    oil.push(it.value)
                    const res = it.value !== undefined && it.value.every(item => item >= 0) ? rashodCalc(it) : [{ rashod: 0, zapravka: 0 }]
                    console.log(res)
                    uniqObject[idw] = { ...uniqObject[idw], rashod: res[0].rashod, zapravka: res[0].zapravka };
                }
                if (it.sens.startsWith('Подъем')) {
                    it.value > 0 ? console.log(it.value) : null
                    it.value >= 33 ? lifting++ : 0
                }
                if (it.sens.startsWith('Зажигание')) {
                    hh.push(it)
                    const res = moto(it);
                    const prostoyHours = res.prostoy.reduce((acc, el) => acc + el, 0)
                    uniqObject[idw] = { ...uniqObject[idw], lifting: lifting, motoHours: res.moto, prostoy: prostoyHours };
                }
            })
            hh[0].oil = oil[0]
            const oneArrayOil = hh.filter(el => !el.sens.startsWith('Топливо'));

            prostoyHH = oneArrayOil[0].oil !== undefined && oneArrayOil[0].oil.every(item => item >= 0) ? oilHH(oneArrayOil[0]) : 0

        } catch (error) {
            console.log(error);
        }
        const medium = uniqObject[idw].probeg !== 0 ? Number(((uniqObject[idw].rashod / uniqObject[idw].probeg) * 100).toFixed(2)) : 0
        uniqObject[idw] = { ...uniqObject[idw], medium: medium, hhOil: prostoyHH, nameCar: e[0].message, type: 'samosval' }
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
            const speedTime = { speed: data.speed.slice(startIndex, index), time: data.time.slice(startIndex, index), oil: data.oil.slice(startIndex, index) };
            (data.value[startIndex] === 0 ? zeros : ones).push([subarray[0], subarray[subarray.length - 1]]);
            (data.value[startIndex] === 0 ? korzina : prostoy).push(speedTime);
            startIndex = index;
        }
    });
    const subarray = data.time.slice(startIndex);
    const speedTime = { speed: data.speed.slice(startIndex), time: data.time.slice(startIndex), oil: data.oil.slice(startIndex) };
    (data.value[startIndex] === 0 ? zeros : ones).push([subarray[0], subarray[subarray.length - 1]]);
    (data.value[startIndex] === 0 ? korzina : prostoy).push(speedTime);
    const filteredData = prostoy.map(obj => {
        const newS = [];
        const timet = [];
        const oil = [];
        for (let i = 0; i < obj.speed.length; i++) {
            if (obj.speed[i] < 5) {
                newS.push(obj.speed[i]);
                timet.push(obj.time[i])
                oil.push(obj.oil[i])
            } else {
                break;
            }
        }
        return { speed: newS, time: timet, oil: oil };
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
    const motoHours = `${hours}:${minutes}:${seconds}`
    return motoHours
}
function timesFormat(dates) {
    const totalSeconds = Math.floor(dates);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const motoHours = `${hours}:${minutes}:${seconds}`
    return motoHours
}

function moto(data) {
    const zeros = [];
    const ones = [];
    const prostoy = [];
    const korzina = [];
    let startIndex = 0;
    data.value.forEach((values, index) => {
        if (values !== data.value[startIndex]) {
            const subarray = data.time.slice(startIndex, index);
            const speedTime = { speed: data.speed.slice(startIndex, index), time: data.time.slice(startIndex, index) };
            (data.value[startIndex] === 0 ? zeros : ones).push([subarray[0], subarray[subarray.length - 1]]);
            (data.value[startIndex] === 0 ? korzina : prostoy).push(speedTime);
            startIndex = index;
        }
    });
    const subarray = data.time.slice(startIndex);
    const speedTime = { speed: data.speed.slice(startIndex), time: data.time.slice(startIndex) };
    (data.value[startIndex] === 0 ? zeros : ones).push([subarray[0], subarray[subarray.length - 1]]);
    (data.value[startIndex] === 0 ? korzina : prostoy).push(speedTime);
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
        const [date1, date2] = dates.map(dateStr => new Date(dateStr));
        const diffMs = date2.getTime() - date1.getTime(); // разница между датами в миллисекундах
        totalMs += diffMs;
    });
    const motoHours = totalMs
    return { moto: motoHours, prostoy: unixProstoy }
}

function rashodCalc(data) {
    const resArray = [];
    const zapravka = [];
    const ras = [];
    for (let i = 0; i < data.value.length - 5; i++) {
        data.value[i] === 0 ? data.value[i] = data.value[i - 1] : data.value[i] = data.value[i]
        data.value[i + 1] === 0 ? data.value[i + 1] = data.value[i - 1] : data.value[i + 1] = data.value[i + 1]
        if (data.value[i] <= data.value[i + 1]) {
            let oneNum = data.value[i]
            let fiveNum = data.value[i + 5]
            const res = fiveNum - oneNum
            res > Number((5 / 100.05 * oneNum).toFixed(0)) ? resArray.push([oneNum, data.time[i]]) : null
        }
        else {
            if (resArray.length !== 0) {
                zapravka.push({ start: resArray[0], end: [data.value[i], data.time[i]] })
                if (zapravka.length === 1) {
                    console.log([data.value[i], data.time[i]])
                    ras.push([{ start: [data.value[0], data.time[0]], end: [resArray[0][0], resArray[0][1]] }])
                    ras.push([{ start: [data.value[i], data.time[i]], end: [data.value[data.value.length - 1], data.time[data.time.length - 1]] }])
                }
                else {
                    ras.pop();
                    ras.push([{ start: [zapravka[0].end[0], [zapravka[0].end[1]]], end: [resArray[0][0], resArray[0][1]] }])
                    ras.push([{ start: [data.value[i], data.time[i]], end: [data.value[data.value.length - 1], data.time[data.time.length - 1]] }])
                }
                resArray.length = 0
            }
        }
    }
    if (zapravka.length === 0) {
        ras.push([{ start: [data.value[0], data.time[0]], end: [data.value[data.value.length - 1], data.time[data.time.length - 1]] }])
    }

    const sum = zapravka.reduce((acc, el) => acc + el.end[0], 0) + data.value[0];
    const rashod = ras.reduce((acc, el) => acc + el[0].end[0], 0) < 0 ? 0 : ras.reduce((acc, el) => acc + el[0].end[0], 0)
    console.log(zapravka)
    console.log(ras)

    const potracheno = sum - rashod >= 0 ? sum - rashod : 0;
    const zapravleno = (zapravka.reduce((acc, el) => acc + el.end[0], 0) - zapravka.reduce((acc, el) => acc + el.start[0], 0))
    console.log(potracheno)
    return [{ rashod: potracheno, zapravka: zapravleno }]
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

export async function yesterdaySummary(objects) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');
    const data = `${year}-${month}-${day}`;

    const result = objects
        .map(el => Object.values(el)) // получаем массивы всех значений свойств объектов
        .flat()
    const array = result
        .filter(e => e[0].message.startsWith('Sitrack'))
        .map(e => e);
    const objectUniq = {};
    for (const e of array) {
        const idw = e[4]
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw, data }))
        }
        const mods = await fetch('/api/summaryYestoday', params)
        const models = await mods.json()
        console.log(models)
        if (models.length === 0) {
            return
        }
        objectUniq[models[0].idw] = models[0]

    }
    const globalInfo = {};
    globalInfo.quantityTS = array.length
    for (const prop in objectUniq) {
        const subObj = objectUniq[prop];
        for (const subProp in subObj) {
            globalInfo[subProp] = (globalInfo[subProp] || 0) + subObj[subProp];
        }
    }
    delete globalInfo.id
    delete globalInfo.idw
    delete globalInfo.nameCar
    delete globalInfo.type
    delete globalInfo.data
    globalInfo.medium = globalInfo.jobTS !== 0 ? Number((globalInfo.medium / globalInfo.jobTS).toFixed(2)) : 0
    globalInfo.moto = timesDate(globalInfo.moto)
    globalInfo.prostoy = timesFormat(globalInfo.prostoy)
    const propOrder = ["quantityTS", "jobTS", 'probeg', "rashod", "zapravka", "dumpTrack", "moto", "prostoy", "medium", "oilHH"];
    const arr = propOrder.map(prop => globalInfo[prop]);
    const intervalValue = document.querySelectorAll('.interval_value')
    arr.forEach((e, index) => {
        intervalValue[index].textContent = (e !== undefined && e !== null) ? e : '-'
    })
}