import { testovfn } from './charts/bar.js'
import { fnParMessage } from './grafiks.js'
import { timefn, convertDate } from './helpersFunc.js'
import { prostoy, dannieOilTS, dannieSortJobTS } from './detalisation/statistic.js'

import { jobTSDetalisation, jobTS, oilTS, melageTS, cal2, cal3 } from './content.js'
import { eskiz, convertTime, updateHTML, yesTo, weekTo, convertToHoursAndMinutes } from './detalisation/helpers.js'
import { createChart, createJobTS, createOilTS, createMelagiTS } from './detalisation/charts.js'


export async function timeIntervalStatistiks() {

    console.log('загрузка графиков')
    const objectRazmetka = {
        'nav1': { html: jobTSDetalisation, data: [], fn: createChart, title: { to: null, yes: null, week: null } },
        'nav2': { html: jobTS, data: [], fn: createJobTS, title: { to: null, yes: null, week: null } },
        'nav3': { html: oilTS, data: [], fn: createOilTS, title: { to: null, yes: null, week: null } },
        'nav4': { html: melageTS, data: [], fn: createMelagiTS, title: { to: null, yes: null, week: null } }
    }
    const loader = document.createElement('div')
    loader.classList.add('loading')
    loader.textContent = 'Загрузка...'
    const act = document.querySelector('.activStatic').id
    console.log(objectRazmetka)
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
            async function load(act, el, num) {
                objectRazmetka[act].fn(objectRazmetka[act].data[el], num)
            }
        })
    })
    act !== 'nav4' ? eskiz(today, yestoday, week, objectRazmetka) : (document.querySelector('.intervalTitle').innerHTML = `10 дней: ${convertTime(4)}<div class="calen" rel="cal2"></div>${cal2}`)
    eventClikInterval(objectRazmetka);


    loaders(today.nextElementSibling, loader)
    await statistics(weekTo(), 'int', 4, objectRazmetka)
    await statistics(timefn(), 'today', 1, objectRazmetka)
    loader.style.display = 'none'
    loaders(yestoday.nextElementSibling, loader)
    await statistics(yesTo(), 'yestoday', 2, objectRazmetka)
    loader.style.display = 'none'
    //  loaders(week.nextElementSibling, loader)
    //  await statistics(weekTo(), 'week', 3, objectRazmetka)
    //  loader.style.display = 'none'
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
        el.addEventListener('click', (event) => {
            const times = [];
            el.nextElementSibling.style.display = 'flex'
            act !== 'nav1' ? (el.nextElementSibling.style.right = 0, el.nextElementSibling.style.top = '15px') : (el.nextElementSibling.style.top = 0,
                el.nextElementSibling.style.right = '-200px');
            el.nextElementSibling.children[1].children[0].addEventListener('click', () => {
                el.nextElementSibling.style.display = 'none'
                el.nextElementSibling.children[0].children[0].value = ''
            })
            const ide = `#${!el.nextElementSibling.children[0].children[0] ? el.nextElementSibling.children[0].id : el.nextElementSibling.children[0].children[0].id}`
            const fp = flatpickr(ide, {
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
                        return [`${year}-${month}-${day}`, `${day}.${month}.${year}`, date.getTime() / 1000];
                    });
                    times.push(formattedDates)
                    el.nextElementSibling.children[1].children[1].addEventListener('click', async () => {
                        const perem = el.getAttribute('rel') === 'cal2' ? cal2 : cal3;
                        const titles = times[times.length - 1][0][0] !== times[times.length - 1][1][0]
                            ? `${times[times.length - 1][0][1]}-${times[times.length - 1][1][1]}<div class="calen" rel="${el.getAttribute('rel')}"></div>${perem}`
                            : `${times[times.length - 1][1][1]}<div class="calen" rel="${el.getAttribute('rel')}"></div>${perem}`;
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
                            statistics(times[times.length - 1], 'free', el.getAttribute('rel'), objectRazmetka)
                        }
                        else {
                            console.log('работает отрисовка')
                            eventClikInterval(objectRazmetka)
                            const idw = document.querySelector('.color').id
                            objectRazmetka['nav4'].data.splice(0, 1, (await dannieOilTS(idw, 4, times[times.length - 1])));
                            objectRazmetka['nav4'].fn(objectRazmetka['nav4'].data[0], 1)
                        }
                    })
                }
            });

        })
    })
}
export async function statistics(interval, ele, num, objectRazmetka) {
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
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ idw }))
    }
    const mod = await fetch('/api/modelView', params)
    const model = await mod.json()
    let tsiControll = model.result.length !== 0 || model.result[0] && model.result[0].tsiControll && model.result[0].tsiControll !== '' ? Number(model.result[0].tsiControll) : null;
    tsiControll === 0 ? tsiControll = null : tsiControll = tsiControll
    const t1 = !isNaN(num) ? interval[1] : interval[0][2]
    const t2 = !isNaN(num) ? interval[0] : interval[1][2] !== interval[0][2] ? interval[1][2] : interval[0][2] + 24 * 60 * 60
    const itog = await testovfn(idw, t1, t2)
    const nameArr = itog[itog.length - 1] !== undefined ? itog[itog.length - 1].allSensParams ? JSON.parse(itog[itog.length - 1].allSensParams) : [] : []
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
    const sensArr = itog.map(e => {
        return JSON.parse(e.allSensParams)
    })
    const nameSens = [];
    nameArr.forEach(el => {
        if (el[0] === 'Зажигание' || el[0].startsWith('Бортовое')) {
            nameSens.push([el[0], el[1]])
        }

    })
    const allArrNew = [];
    nameSens.forEach((item) => {
        allArrNew.push({ sens: item[0], params: item[1], value: [] })
    })
    if (sensArr.length === 0) {
        if (isNaN(num)) {
            objectRazmetka['nav1'].data.splice(num === 'cal2' ? 1 : 2, 1, []);
            objectRazmetka['nav2'].data.splice(num === 'cal2' ? 1 : 2, 1, dannieSortJobTS([]));
            objectRazmetka['nav3'].data.splice(num === 'cal2' ? 1 : 2, 1, await dannieOilTS(idw, num, interval));
            const act = document.querySelector('.activStatic').id
            objectRazmetka[act].fn(objectRazmetka[act].data[num === 'cal2' ? 1 : 2], num === 'cal2' ? 2 : 3)
        }
        else {
            objectRazmetka['nav1'].data.push([]);
            objectRazmetka['nav2'].data.push(dannieSortJobTS([]));
            objectRazmetka['nav3'].data.push(await dannieOilTS(idw, num));
            const act = document.querySelector('.activStatic').id
            objectRazmetka[act].fn(objectRazmetka[act].data[num - 1], num)
        }
        return
    }
    sensArr.forEach(el => {
        if (el.length === 0) {
            return; // Пропускаем текущую итерацию, если sensArr пустой
        }
        else {
            el.forEach(it => {
                if (it[0] === 'Зажигание') {
                    allArrNew[0].value.push(Number(Object.values(it)[2].toFixed(0)))
                }
                if (it[0].startsWith('Бортовое')) {
                    allArrNew[1].value.push(Number(Object.values(it)[2].toFixed(0)))
                }
            })
        }

    });
    allArrNew.forEach(el => {
        el.time = time
        el.speed = speed
        el.sats = sats
        el.geo = geo
    })
    console.log(allArrNew)
    const engine = [...allArrNew].filter(it => it.sens === 'Зажигание' || it.sens.startsWith('Борт'));
    engine[0].pwr = engine[1].value
    engine[0].condition = [];
    const dannie = []
    dannie.push(engine[0])
    for (let i = 0; i < dannie[0].value.length; i++) {
        if (dannie[0].speed[i] > 5) {
            dannie[0].condition[i] = 'Движется';
        }
        else if (dannie[0].speed[i] === 0 && dannie[0].value[i] === 1) {
            dannie[0].condition[i] = 'Повернут ключ зажигания';
        }
        else {
            dannie[0].condition[i] = 'Парковка';
        }
    }
    const intStop = prostoy(dannie[0], tsiControll)
    if (intStop) {
        const startIndex = dannie[0].time.findIndex(time => time === intStop[1]);
        const endIndex = dannie[0].time.findIndex(time => time === intStop[2]);
        if (startIndex !== -1 && endIndex !== -1) {
            // Обновить значения в свойстве condition
            for (let i = startIndex; i <= endIndex; i++) {
                dannie[0].condition[i] = 'Работа на холостом ходу';
            }
        }
    }
    delete dannie[0].params
    delete dannie[0].sens
    const data = dannie.flatMap(item =>
        item.value.map((cValue, index) => ({
            value: cValue,
            condition: item.condition[index],
            pwr: item.pwr[index],
            geo: item.geo[index],
            speed: item.speed[index],
            sats: item.sats[index],
            time: item.time[index],
        }))
    );
    const datas = data.map((item, index, arr) => {
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
