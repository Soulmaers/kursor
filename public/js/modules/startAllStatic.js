

import { allObjects } from './menu.js'
import { viewStat } from './checkObjectStart.js'
import { fnParMessage } from './grafiks.js'

async function testovfn(active, t1, t2) {
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ active, t1, t2 }))
    }
    const rest = await fetch('/api/viewChart', param)
    const resultt = await rest.json()
    return resultt
}
export const startAllStati = async (objects) => {
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
    return //res.uniq
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
        const res = await fnParMessage(idw)
        const nameSens = [];
        const allArrNew = [];
        res.forEach((item) => {
            allArrNew.push({ sens: item[0], params: item[1], value: [] })
        })

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
        console.log(allArrNew)
        const hh = [];
        const oil = [];
        allArrNew.forEach(it => {
            if (it.sens === 'Топливо' || it.sens === 'Топливо ДУТ') {
                it.value.forEach((e, i) => {
                    if (e === -348201) {
                        it.value[i] = it.value[i - 1];
                    }
                });
                oil.push(it.value)
            }
            if (it.sens.startsWith('Зажигание')) {
                hh.push(it)
            }
        })

        hh[0].oil = oil[0]
        const oneArrayOil = hh.filter(el => !el.sens.startsWith('Топливо'));
        // prostoyHH = oneArrayOil[0].oil !== undefined && oneArrayOil[0].oil.every(item => item >= 0) ? oilHH(oneArrayOil[0]) : 0
        console.log(prostoyHH)
    }
}

function oilHH(data) {
    console.log(data)
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


    console.log(arr)
    const newArr = [];

    arr.forEach(subArr => {
        const newSubArr = { value: [], speed: [], oil: [], time: [], sats: [] };

        subArr.forEach((currentValue, index) => {
            if (subArr[0].speed[index] < 5) {
                console.log(subArr[0].speed[index])
                newSubArr.value.push(currentValue);
                newSubArr.speed.push(subArr[0].speed[index]);
                newSubArr.oil.push(subArr[0].oil[index]);
                newSubArr.time.push(subArr[0].time[index]);
                newSubArr.sats.push(subArr[0].sats[index]);
            }
        });

        newArr.push(newSubArr);
    });

    console.log(newArr);

    /*
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
        });*/

    const timeProstoy = newArr.map(el => {
        return { time: [el[0].time[0], el[0].time[el[0].time.length - 1]], oil: [el[0].oil[0], el[0].oil[el[0].oil.length - 1]], speed: [el[0].speed[0], el[0].speed[el[0].speed.length - 1]] }
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
    return res > 0 ? res : 0
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

