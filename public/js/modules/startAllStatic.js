

import { allObjects } from './menu.js'
import { viewStat } from './checkObjectStart.js'
import { fnParMessage } from './grafiks.js'



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
    let bool = false
    allObjects.forEach(el => {
        el.length !== 0 ? bool = true : null
    })
    if (!bool) {
        return
    }
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
    //console.log(models)
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
            const parentWrapper = document.querySelector(`[rel="Самосвал"]`).children
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

