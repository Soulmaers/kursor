
import { fnParMessage, fnPar } from './grafiks.js'
import { allObjects } from './menu.js'
export let uniqglobalInfo;

export async function startAllStatic(objects) {
    const login = document.querySelectorAll('.log')[1].textContent
    const result = objects
        .map(el => Object.values(el)) // получаем массивы всех значений свойств объектов
        .flat()
    result.forEach(el => {
        el[0].message === 'Цистерна ДТ' ? el.push('Цистерна') : el.push(el[0].result[0].type)
    })
    const array = result
        //   .filter(e => e[0].message.startsWith('Sitrack'))
        .filter(e => e[6].startsWith('Самосвал'))
        .map(e => e);
    const interval = timefn()
    const timeOld = interval[1]
    const timeNow = interval[0]
    const res = await loadValue(array, timeOld, timeNow, login)
    return res.uniq
}
async function loadValue(array, timeOld, timeNow, login) {
    const uniqObject = {};
    for (const e of array) {
        let lifting = 0
        let prostoyHH;
        const time = [];
        const speed = [];
        const sats = [];
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
            itog.messages.forEach(el => {
                const timestamp = el.t;
                const date = new Date(timestamp * 1000);
                const isoString = date.toISOString();
                time.push(new Date(isoString))
                speed.push(el.pos.s)
                sats.push(el.p.sats)

            })
            const probegZero = itog.messages.length !== 0 ? itog.messages[0].p.can_mileage ? Number((itog.messages[0].p.can_mileage).toFixed(0)) : itog.messages[0].p.mileage ? Number((itog.messages[0].p.mileage).toFixed(0)) : 0 : 0;
            const probegNow = itog.messages.length !== 0 ? itog.messages[0].p.can_mileage ? Number((itog.messages[itog.messages.length - 1].p.can_mileage).toFixed(0)) : itog.messages[0].p.mileage ? Number((itog.messages[itog.messages.length - 1].p.mileage).toFixed(0)) : 0 : 0
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
                el.sats = sats
            })
            const oil = [];
            const hh = [];
            allArrNew.forEach(it => {
                if (it.sens === 'Топливо' || it.sens === 'Топливо ДУТ') {
                    it.value.forEach((e, i) => {
                        if (e === -348201) {
                            it.value[i] = it.value[i - 1];
                        }
                    });
                    oil.push(it.value)
                    const res = it.value !== undefined && it.value.every(item => item >= 0) ? rashodCalc(it) : [{ rashod: 0, zapravka: 0 }]
                    uniqObject[idw] = { ...uniqObject[idw], rashod: res[0].rashod, zapravka: res[0].zapravka };
                }
                if (it.sens.startsWith('Подъем')) {
                    lifting = moto(it)
                }
                uniqObject[idw] = { ...uniqObject[idw], lifting: lifting };
                if (it.sens.startsWith('Зажигание')) {
                    hh.push(it)
                    const res = moto(it);
                    const prostoyHours = res.prostoy.reduce((acc, el) => acc + el, 0)
                    uniqObject[idw] = { ...uniqObject[idw], motoHours: res.moto, prostoy: prostoyHours };
                }
            })
            hh[0].oil = oil[0]
            const oneArrayOil = hh.filter(el => !el.sens.startsWith('Топливо'));
            prostoyHH = oneArrayOil[0].oil !== undefined && oneArrayOil[0].oil.every(item => item >= 0) ? oilHH(oneArrayOil[0]) : 0
        } catch (error) {
            console.log(error);
        }
        const medium = uniqObject[idw].probeg !== 0 ? Number(((uniqObject[idw].rashod / uniqObject[idw].probeg) * 100).toFixed(2)) : 0
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
export function timesDate(dates) {
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
export function timesFormat(dates) {
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
        const [date1, date2] = dates.map(dateStr => new Date(dateStr));
        const diffMs = date2.getTime() - date1.getTime(); // разница между датами в миллисекундах
        totalMs += diffMs;
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
                if (diffInSeconds > 1200) {
                    mass.push([timeGran[start][1], timeGran[i + 1][0]])
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

function rashodCalc(data) {
    const resArray = [];
    const zapravka = [];
    const ras = [];
    let noZapravka;
    for (let i = 0; i < data.value.length - 10; i++) {
        data.value[i] === 0 ? data.value[i] = data.value[i - 1] : data.value[i] = data.value[i]
        data.value[i + 1] === 0 ? data.value[i + 1] = data.value[i - 1] : data.value[i + 1] = data.value[i + 1]
        if (data.value[i] <= data.value[i + 1] || data.value[i] <= data.value[i + 2]) {
            let oneNum = data.value[i]
            let fiveNum = data.value[i + 10]
            const res = fiveNum - oneNum
            res > Number((3 / 100.3 * oneNum).toFixed(0)) ? resArray.push([oneNum, data.time[i]]) : null
        }
        else {
            if (resArray.length !== 0) {
                zapravka.push({ start: resArray[0], end: [data.value[i], data.time[i]] })
                if (zapravka.length === 0) {
                    ras.push([{ start: [data.value[0], data.time[0]], end: [data.value[data.value.length - 1], data.time[data.time.length - 1]] }])
                }
                if (zapravka.length === 1) {
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
    if (zapravka.length === 0 && resArray.length === 0) {
        noZapravka = [{ start: [data.value[0], data.time[0]], end: [data.value[data.value.length - 1], data.time[data.time.length - 1]] }]
    }

    const sum = zapravka.reduce((acc, el) => acc + el.end[0], 0) + data.value[0];
    const rashod = ras.reduce((acc, el) => acc + el[0].end[0], 0) < 0 ? 0 : ras.reduce((acc, el) => acc + el[0].end[0], 0)
    const potracheno = sum - rashod >= 0 && ras.length !== 0 ? sum - rashod : noZapravka[0].start[0] - noZapravka[0].end[0] >= 0 ? noZapravka[0].start[0] - noZapravka[0].end[0] : 0;
    const zapravleno = (zapravka.reduce((acc, el) => acc + el.end[0], 0) - zapravka.reduce((acc, el) => acc + el.start[0], 0))
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
export async function yesterdaySummary(interval, type) {

    let int;
    if (interval === 'Неделя') {
        int = 7
    }
    if (interval === 'Месяц') {
        int = 30
    }
    if (interval === 'Вчера') {
        int = 1
    }
    const data = [];
    const company = allObjects.filter(el => el.length !== 0)
        .map(el => el[0][5]);
    !interval && !type ? data.push(convertDate(0)) : typeof interval === 'string' ? data.push(convertDate(int), convertDate(1)) : data.push(interval[0], interval[1])
    const objectUniq = {};
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ data, company }))
    }
    const mods = await fetch('/api/summaryYestoday', params)
    const models = await mods.json()
    const mod = type ? models.filter(el => el.type === type) : models
    if (mod.length === 0) {
        console.log('нет данных по объектам в базе')
    }
    else {
        for (let i = 0; i < mod.length; i++) {
            objectUniq[mod[i].id] = mod[i];
        }
        const globalInfo = {};
        const newObject = Object.entries(objectUniq).reduce((acc, [key, value]) => {
            if (value.jobTS === 1) {
                acc[key] = value; // Add only "e" value to the new object
            }
            return acc;
        }, {});
        for (const prop in newObject) {
            const subObj = newObject[prop];
            if (subObj.type) {
                if (globalInfo[subObj.type]) {
                    for (const subProp in subObj) {
                        if (subProp !== 'type') {
                            globalInfo[subObj.type][subProp] = (globalInfo[subObj.type][subProp] || 0) + subObj[subProp];
                        }
                    }
                    globalInfo[subObj.type].quantityTS = (globalInfo[subObj.type].quantityTS || 0) + 1;
                }
                else {
                    globalInfo[subObj.type] = Object.assign({}, subObj);
                    globalInfo[subObj.type].quantityTS = 1;
                }
            }
        }
        const resultTS = Object.values(
            Object.values(objectUniq).reduce((acc, val) => {
                acc[val.idw] = Object.assign(acc[val.idw] ?? {}, val);

                return acc;
            }, {})
        );
        const resultJobTS = Object.values(
            Object.values(newObject).reduce((acc, val) => {
                if (val.jobTS === 1) {
                    acc[val.idw] = Object.assign(acc[val.idw] ?? {}, val);
                }
                return acc;
            }, {})
        );
        for (const prop in globalInfo) {
            if (globalInfo[prop].type) {
                globalInfo[prop].quantityTS = resultTS.filter(subObj => subObj.type === globalInfo[prop].type).length;
                globalInfo[prop].jobTS = resultJobTS.filter(subObj => subObj.type === globalInfo[prop].type).length;
            }
        }

        let jobNum = 0;
        Object.values(newObject).forEach(it => {
            it.jobTS === 1 ? jobNum++ : null
        })
        Object.entries(globalInfo).forEach(el => {
            el[1].moto = timesDate(el[1].moto)
            el[1].prostoy = timesFormat(el[1].prostoy)
            el[1].medium = el[1].jobTS !== 0 ? Number((el[1].medium / (interval ? jobNum : el[1].jobTS)).toFixed(2)) : 0;
            delete el[1].id
            delete el[1].idw
            delete el[1].nameCar
            delete el[1].type
            delete el[1].data
        })
        const propOrder = ["quantityTS", "jobTS", 'probeg', "rashod", "zapravka", "dumpTrack", "moto", "prostoy", "medium", "oilHH"];
        console.log(globalInfo)
        Object.entries(globalInfo).forEach(it => {
            const arr = propOrder.map(prop => it[1][prop]);
            const parentWrapper = document.querySelector(`[rel="${it[0]}"]`).children
            arr.forEach((e, index) => {
                if (!interval && !type) {
                    parentWrapper[index].children[1].textContent = (e !== undefined && e !== null) ? e : '-'
                }
                else {
                    parentWrapper[index].children[2].textContent = (e !== undefined && e !== null) ? e : '-'
                }

            })
        })
    }
}
export function convertDate(num) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - num)
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');
    const data = `${year}-${month}-${day}`;
    return data
}
export function element(el) {
    const type = el.closest('.title_interval').nextElementSibling.getAttribute('rel')
    if (el.value.startsWith('Выбрать')) {
        const times = [];
        const id = `#${!el.nextElementSibling.children[0].children[0] ? el.nextElementSibling.children[0].id : el.nextElementSibling.children[0].children[0].id}`
        el.nextElementSibling.style.display = 'flex'
        const fp = flatpickr(`${id}`, {
            mode: "range",
            dateFormat: "d-m-Y",
            locale: "ru",
            static: true,
            "locale": {
                "firstDayOfWeek": 1 // устанавливаем первым днем недели понедельник
            },
            onChange: function (selectedDates, dateStr, instance) {
                const formattedDates = selectedDates.map(date => {
                    const year = date.getFullYear();
                    const month = ("0" + (date.getMonth() + 1)).slice(-2); // добавляем ведущий ноль, если месяц < 10
                    const day = ("0" + date.getDate()).slice(-2); // добавляем ведущий ноль, если день < 10
                    return `${year}-${month}-${day}`;
                });
                times.push(formattedDates)
            }
        });
        const btn = el.closest('.select_summary').nextElementSibling.children[1]
        const input = el.closest('.select_summary').nextElementSibling.children[0].children[0]
        Array.from(btn.children).forEach(elem =>
            elem.addEventListener('click', () => {
                const res = times[times.length - 1];
                const formatString = res.map(e => {
                    const parts = e.split('-'); // Разделяем дату на отдельные части
                    const formattedDate = `${parts[1].replace(/^0+/, '')}/${parts[2]}`;
                    return formattedDate
                })
                el.children[3].textContent = formatString[0] + '-' + formatString[1]
                elem.textContent === 'Очистить' ? input.value = '' : (yesterdaySummary(res, type), input.value = '', elem.closest('.calendar').style.display = 'none')
            })
        )
    }
    else {
        el.closest('.select_summary').nextElementSibling.style.display = 'none'
        yesterdaySummary(el.value, type)
    }

    el.addEventListener('click', function () {
        el.children[3].textContent = 'Выбрать дату'
        //el.children[0].selected = true;
    })
}

