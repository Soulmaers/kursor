
import { fnParMessage, fnPar } from './grafiks.js'
import { allObjects } from './menu.js'
import { viewStat } from './checkObjectStart.js'
import { testovfn } from './charts/bar.js'
import { modalView } from './popup.js'
export let uniqglobalInfo;

export async function startAllStatic(objects) {
    const login = document.querySelectorAll('.log')[1].textContent
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
    const res = await loadValue(array, timeOld, timeNow, login)
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
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw }))
        }
        try {
            const tsi = await fetch('/api/modelView', param)
            const tsiY = await tsi.json()
            const tsiControll = Number(tsiY.result[0].tsiControll)


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
            /* const res = await fetch('/api/loadInterval', param);
             const itog = await res.json();
             console.log(itog)
             itog.messages.forEach(el => {
                 const timestamp = el.t;
                 const date = new Date(timestamp * 1000);
                 const isoString = date.toISOString();
                 time.push(new Date(isoString))
                 speed.push(el.pos.s)
                 sats.push(el.p.sats)
             })*/
            // const sensArr = await fnPar(idw)

            const nameSens = await fnParMessage(idw)
            // nameSens.pop()
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
                }
                uniqObject[idw] = { ...uniqObject[idw], rashod: 0, zapravka: 0 };
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
    const motoHours = `${hours}:${minutes}`
    return motoHours
}
export function timesFormat(dates) {
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
    let i = 0;
    while (i < data.value.length - 1) {
        if (data.value[i] === data.value[i + 1]) {
            data.value.splice(i, 1);
            data.time.splice(i, 1);
            data.speed.splice(i, 1);
            data.sats.splice(i, 1);
            data.geo.splice(i, 1);
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
        if (currentObj < nextObj) {
            if (start === end) {
                start = i;
            }
            end = i + 1;
        } else if (currentObj > nextObj) {
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
        modalView(zapravka, name, group, idw);
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
export function timefn() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startOfTodayUnix = Math.floor(currentDate.getTime() / 1000);
    const unix = Math.floor(new Date().getTime() / 1000);
    const timeNow = unix
    const timeOld = startOfTodayUnix
    return [timeNow, timeOld]
}
export async function yesterdaySummary(interval, type, element) {
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
    mod.forEach(it => {
        it.rashod < 0 ? it.rashod = 0 : it.rashod
    })
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

        let obj;
        interval && interval !== 'Вчера' ? obj = newObject : obj = objectUniq;
        for (const prop in obj) {
            const subObj = obj[prop];
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
        Object.entries(globalInfo).forEach(el => {
            let jobNum = 0;
            for (const prop in newObject) {
                // Проверяем, есть ли свойство type и является ли его значение определенным
                if (newObject[prop].type === el[1].type && newObject[prop].jobTS === 1 && newObject[prop].medium > 0) {
                    jobNum++;
                }
            }
            el[1].goodJob = timesFormat(el[1].moto / 1000 - el[1].prostoy)
            el[1].moto = timesDate(el[1].moto)
            el[1].prostoy = timesFormat(el[1].prostoy)
            el[1].medium = el[1].jobTS !== 0 ? Number((el[1].medium / (interval && interval !== 'Вчера' ? jobNum : el[1].jobTS)).toFixed(2)) : 0;
            delete el[1].id
            delete el[1].idw
            delete el[1].nameCar
            delete el[1].type
            delete el[1].data
        })
        const propOrder = ["quantityTS", "jobTS", 'probeg', "rashod", "zapravka", "dumpTrack", "moto", "prostoy", "goodJob", "medium", "oilHH"];
        Object.entries(globalInfo).forEach(it => {
            const arr = propOrder.map(prop => it[1][prop]);
            const parentWrapper = document.querySelector(`[rel="${it[0]}"]`).children
            arr.forEach((e, index) => {
                let targetIndex = 1;
                if (!interval && !type) {
                    targetIndex = 1;
                } else if ((interval === 'Вчера' && !type) || (element && element.classList.contains('one') && type)) {
                    targetIndex = 2;
                } else if ((interval === 'Неделя' && !type) || (element && element.classList.contains('two') && type)) {
                    targetIndex = 3;
                } else {
                    targetIndex = 2;
                }
                parentWrapper[index].children[targetIndex].textContent = (e !== undefined && e !== null) ? e : '-';
            });
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
export const times = [];
export function element(el) {
    const type = el.closest('.title_interval').nextElementSibling.getAttribute('rel')
    const checkboxBlocks = el.closest('.table_dannie').previousElementSibling.lastElementChild.lastElementChild
    const checkboxes = Array.from(checkboxBlocks.querySelectorAll('.checkListStart')).map(element => {
        return element.children[0];
    });
    const arrayIdw = [];
    checkboxes.shift();
    checkboxes.forEach(e => {
        if (e.checked === true) {
            arrayIdw.push(e.value)
        }
    })
    const sele = Array.from(el.children)
    if (el.value.startsWith('Выбрать')) {
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
        const btn = el.nextElementSibling.children[1]
        const input = el.nextElementSibling.children[0].children[0]
        Array.from(btn.children).forEach(elem =>
            elem.addEventListener('click', () => {
                const res = times[times.length - 1];
                const formatString = res.map(e => {
                    const parts = e.split('-'); // Разделяем дату на отдельные части
                    const formattedDate = `${parts[1].replace(/^0+/, '')}/${parts[2]}`;
                    return formattedDate
                })
                el.children[3].textContent = formatString[0] + '-' + formatString[1]
                elem.textContent === 'Очистить' ? (input.value = '', elem.closest('.calendar').style.display = 'none', el.children[3].textContent = 'Выбрать дату', el.children[0].selected = true) : arrayIdw.length === 0 ? (yesterdaySummary(res, type, el), input.value = '', elem.closest('.calendar').style.display = 'none') :
                    (viewStat(arrayIdw, el), input.value = '', elem.closest('.calendar').style.display = 'none')
            })
        )
    }
    else {
        el.nextElementSibling.style.display = 'none'
        arrayIdw.length === 0 ? yesterdaySummary(el.value, type, el) : viewStat(arrayIdw, el)
    }
    el.addEventListener('click', function () {
        el.children[3].textContent = 'Выбрать дату'
        //el.children[0].selected = true;
    })
}

