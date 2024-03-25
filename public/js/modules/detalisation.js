import { testovfnNew } from './charts/bar.js'
import { timefn } from './helpersFunc.js'
import { prostoyNew, dannieOilTS, dannieSortJobTS } from './detalisation/statistic.js'
import { GetDataTime } from '../class/GetDataTime.js'
import { jobTSDetalisation, jobTS, oilTS, melageTS, cal2, cal3 } from './content.js'
import { eskiz, convertTime, updateHTML, yesTo, weekTo, convertToHoursAndMinutes } from './detalisation/helpers.js'
import { createChart, createJobTS, createOilTS, createMelagiTS } from './detalisation/charts.js'

export let objectRazmetka
export async function timeIntervalStatistiks(signal) {
    objectRazmetka = {
        'nav1': { html: jobTSDetalisation, data: [], fn: createChart, title: { to: null, yes: null, week: null } },
        'nav2': { html: jobTS, data: [], fn: createJobTS, title: { to: null, yes: null, week: null } },
        'nav3': { html: oilTS, data: [], fn: createOilTS, title: { to: null, yes: null, week: null } },
        'nav4': { html: melageTS, data: [], fn: createMelagiTS, title: { to: null, yes: null, week: null } }
    }
    const loader = document.createElement('div')
    loader.classList.add('loading')
    loader.textContent = 'Загрузка...'
    const act = document.querySelector('.activStatic').id
    const navstat = document.querySelectorAll('.navstat')
    const windowStatistic = document.querySelector('.windowStatistic')
    windowStatistic.insertAdjacentHTML('beforeend', ` ${objectRazmetka[act].html}`);
    const today = document.querySelector('.todayTitle')
    const yestoday = document.querySelector('.yestodayTitle')
    const week = document.querySelector('.weekTitle')
    act !== 'nav1' ? updateHTML() : null
    navstat.forEach(el => {
        el.addEventListener('click', async () => {
            navstat.forEach(el => {
                el.classList.remove('activStatic')
            })
            el.classList.add('activStatic')
            const act = document.querySelector('.activStatic').id
            windowStatistic.children[1].remove()
            windowStatistic.children[1].remove()
            windowStatistic.insertAdjacentHTML('beforeend', ` ${objectRazmetka[act].html}`);
            act !== 'nav1' && act !== 'nav4' ? updateHTML() : null
            if (act === 'nav4') {
                const interval = document.querySelector('.intervalTitle')
                interval.innerHTML = `10 дней: ${convertTime(4)} <div class="calen" rel="cal2"></div>${cal2}`
                eventClikInterval(objectRazmetka)
                await statistics(weekTo(), 'int', 4, objectRazmetka)
                await load(act, 0, 1)
            }
            else {
                const today = document.querySelector('.todayTitle')
                const yestoday = document.querySelector('.yestodayTitle')
                const week = document.querySelector('.weekTitle')
                today.innerHTML = objectRazmetka[act].title.to
                yestoday.innerHTML = objectRazmetka[act].title.yes
                week.innerHTML = objectRazmetka[act].title.week
                eventClikInterval(objectRazmetka)
                await load(act, 0, 1)
                await load(act, 1, 2)
                await load(act, 2, 3)
            }

        })
    })
    act !== 'nav4' ? eskiz(today, yestoday, week, objectRazmetka) : (document.querySelector('.intervalTitle').innerHTML = `10 дней: ${convertTime(4)}<div class="calen" rel="cal2"></div>${cal2}`)
    eventClikInterval(objectRazmetka);



    loaders(today.nextElementSibling, loader)
    await statistics(weekTo(), 'int', 4, objectRazmetka, signal)
    await statistics(timefn(), 'today', 1, objectRazmetka, signal)
    loader.style.display = 'none'
    loaders(yestoday.nextElementSibling, loader)
    await statistics(yesTo(), 'yestoday', 2, objectRazmetka, signal)
    loader.style.display = 'none'
    loaders(week.nextElementSibling, loader)
    await statistics(weekTo(), 'week', 3, objectRazmetka, signal)
    loader.style.display = 'none'
}
export async function load(act, el, num) {
    objectRazmetka[act].fn(objectRazmetka[act].data[el], num)
}
function loaders(elem, loader) {
    loader.style.display = 'flex'
    elem.appendChild(loader)
    elem.style.display = 'flex'
    elem.style.justifyContent = 'center'
    elem.style.alignItems = 'center'
    elem.style.flexDirection = 'column'
}


function eventClikInterval(objectRazmetka) {
    const act = document.querySelector('.activStatic').id
    const calen = Array.from(document.querySelectorAll('.calen'))
    calen.forEach(el => {
        el.addEventListener('click', async (event) => {
            el.nextElementSibling.style.display = 'flex'
            act !== 'nav1' ? (el.nextElementSibling.style.right = 0, el.nextElementSibling.style.top = '15px') : (el.nextElementSibling.style.top = 0,
                el.nextElementSibling.style.right = '-200px');
            el.nextElementSibling.children[1].children[0].addEventListener('click', () => {
                el.nextElementSibling.style.display = 'none'
                el.nextElementSibling.children[0].children[0].value = ''
            })
            const getTime = new GetDataTime()
            const time = await getTime.getTimeInterval(el.nextElementSibling)
            const times = time.map(elem => {
                const date = new Date(elem * 1000);
                const year = date.getFullYear();
                const month = ("0" + (date.getMonth() + 1)).slice(-2); // добавляем ведущий ноль, если месяц < 10
                const day = ("0" + date.getDate()).slice(-2); // добавляем ведущий ноль, если день < 10
                return [`${year}-${month}-${day}`, `${day}.${month}.${year}`, date.getTime() / 1000];
            });
            console.log(times)
            el.nextElementSibling.children[1].children[1].addEventListener('click', async () => {
                const perem = el.getAttribute('rel') === 'cal2' ? cal2 : cal3;
                const titles = times[1][2] !== times[0][1]
                    ? `${times[0][1]}-${times[1][1]}<div class="calen" rel="${el.getAttribute('rel')}"></div>${perem}`
                    : `${times[0][1]}<div class="calen" rel="${el.getAttribute('rel')}"></div>${perem}`;
                el.parentElement.innerHTML = titles
                if (act !== 'nav4') {
                    if (el.getAttribute('rel') === 'cal2') {
                        for (let key in objectRazmetka) {
                            objectRazmetka[key].title.yes = titles
                        }
                    }
                    else {
                        for (let key in objectRazmetka) {
                            objectRazmetka[key].title.week = titles
                        }
                    }
                    eventClikInterval(objectRazmetka)
                    //   const interval = times.map(e => e[2])
                    //    console.log(interval)
                    statistics(times, 'free', el.getAttribute('rel'), objectRazmetka, signal)
                }
                else {
                    console.log('работает отрисовка')
                    eventClikInterval(objectRazmetka)
                    const idw = document.querySelector('.color').id
                    objectRazmetka['nav4'].data.splice(0, 1, (await dannieOilTS(idw, 4, times)));
                    objectRazmetka['nav4'].fn(objectRazmetka['nav4'].data[0], 1)
                }
            })



        })
    })
}
export async function statistics(interval, ele, num, objectRazmetka, signal) {
    const idw = document.querySelector('.color').id
    if (ele === 'int') {
        if (objectRazmetka['nav4'].data.length === 0) {
            objectRazmetka['nav4'].data.push(await dannieOilTS(idw, num));
            return
        }
        else {
            objectRazmetka['nav4'].data.splice(0, 1, await dannieOilTS(idw, num));
            return
        }
    }
    const t1 = !isNaN(num) ? interval[1] : interval[0][2]
    const t2 = !isNaN(num) ? interval[0] : interval[1][2] !== interval[0][2] ? interval[1][2] : interval[0][2] + 24 * 60 * 60
    const active = document.querySelector('.color').id
    const res = await getDataStor(active, t1, t2)
    const newGlobal = res.map(it => {
        return {
            id: it.idw,
            time: new Date(Number(it.last_valid_time) * 1000),
            speed: Number(it.speed),
            geo: [Number(it.lat), Number(it.lon)],
            oil: Number(it.oil),
            pwr: Number(it.pwr),
            engine: Number(it.engine),
            mileage: Number(it.mileage),
            curse: Number(it.course),
            sats: Number(it.sats),
            engineOn: Number(it.engineOn)
        }
    })
    newGlobal.sort((a, b) => a.time - b.time)

    for (let i = 0; i < newGlobal.length; i++) {
        if (newGlobal[i].speed > 5) {
            newGlobal[i].condition = 'Движется';
        }
        else if (newGlobal[i].speed === 0 && newGlobal[i].engine === 1) {
            newGlobal[i].condition = 'Повернут ключ зажигания';
        }
        else {
            newGlobal[i].condition = 'Парковка';
        }
    }
    const intStopNew = prostoyNew(newGlobal)
    if (intStopNew) {
        intStopNew.forEach(el => {
            const startIndex = newGlobal.findIndex(x => x.time === el[0][0]);
            const endIndex = newGlobal.findIndex(x => x.time === el[1][0]);
            if (startIndex !== -1 && endIndex !== -1) {
                // Обновить значения в свойстве condition
                for (let i = startIndex; i <= endIndex; i++) {
                    newGlobal[i].condition = 'Работа на холостом ходу';
                }
            }
        })
    }

    const datas = newGlobal.map((item, index, arr) => {
        if (index === 0 || item.condition !== arr[index - 1].condition) {
            const conditionGroup = arr.slice(index).findIndex(el => el.condition !== item.condition);
            const endIndex = conditionGroup === -1 ? arr.length : index + conditionGroup;
            const conditionItems = arr.slice(index, endIndex);
            const interval = conditionItems.length > 1 ? conditionItems[conditionItems.length - 1].time - conditionItems[0].time : 0;
            conditionItems.forEach(condItem => condItem.interval = convertToHoursAndMinutes(interval / 1000));
        }
        return item;
    });
    if (isNaN(num)) {
        objectRazmetka['nav1'].data.splice(num === 'cal2' ? 1 : 2, 1, datas);
        objectRazmetka['nav2'].data.splice(num === 'cal2' ? 1 : 2, 1, dannieSortJobTS(datas));
        objectRazmetka['nav3'].data.splice(num === 'cal2' ? 1 : 2, 1, await dannieOilTS(idw, num, interval));
        const act = document.querySelector('.activStatic').id
        objectRazmetka[act].fn(objectRazmetka[act].data[num === 'cal2' ? 1 : 2], num === 'cal2' ? 2 : 3)
    }
    else {
        objectRazmetka['nav1'].data.push(datas);
        objectRazmetka['nav2'].data.push(dannieSortJobTS(datas));
        objectRazmetka['nav3'].data.push(await dannieOilTS(idw, num));
        const act = document.querySelector('.activStatic').id
        objectRazmetka[act].fn(objectRazmetka[act].data[num - 1], num)
    }
    objectRazmetka = null;
}


async function getDataStor(active, t1, t2) {
    const idw = active
    console.log(active, t1, t2)
    const paramss = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ idw, t1, t2 }))
    }
    const res = await fetch('/api/getDataParamsInterval', paramss)
    const data = await res.json();
    return data
}
