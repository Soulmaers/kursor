import { testovfn } from './charts/bar.js'
import { fnParMessage } from './grafiks.js'
import { timefn, convertDate } from './startAllStatic.js'
import { timeConvert } from './charts/oil.js'
import { createMapsUniq } from './geo.js'
import { jobTSDetalisation, jobTS, oilTS } from './content.js'



const objectRazmetka = {
    'nav1': { html: jobTSDetalisation, data: [], fn: createChart },
    'nav2': { html: jobTS, data: [], fn: createJobTS },
    'nav3': { html: oilTS, data: [], fn: createOilTS }
}


export async function timeIntervalStatistiks() {
    const act = document.querySelector('.activStatic').id
    for (let key in objectRazmetka) {
        objectRazmetka[key].data = []
    }

    const navstat = document.querySelectorAll('.navstat')

    const windowStatistic = document.querySelector('.windowStatistic')
    windowStatistic.insertAdjacentHTML('beforeend', ` ${objectRazmetka[act].html}`);
    const today = document.querySelector('.todayTitle')
    const yestoday = document.querySelector('.yestodayTitle')
    const week = document.querySelector('.weekTitle')

    console.log(act + 'акт')
    act !== 'nav1' ? updateHTML() : null
    navstat.forEach(el => {
        el.addEventListener('click', async () => {
            console.log('клик')
            navstat.forEach(el => {
                el.classList.remove('activStatic')
            })

            el.classList.add('activStatic')
            const act = document.querySelector('.activStatic').id
            windowStatistic.children[1].remove()
            windowStatistic.children[1].remove()
            windowStatistic.insertAdjacentHTML('beforeend', ` ${objectRazmetka[act].html}`);
            act !== 'nav1' ? updateHTML() : null

            const today = document.querySelector('.todayTitle')
            const yestoday = document.querySelector('.yestodayTitle')
            const week = document.querySelector('.weekTitle')
            eskiz(today, yestoday, week)
            await load(act, 0, 1)
            await load(act, 1, 2)
            await load(act, 2, 3)
            async function load(act, el, num) {
                console.log('load')
                objectRazmetka[act].fn(objectRazmetka[act].data[el], num)
            }
            //   objectRazmetka[act].fn(objectRazmetka[act].data[1], 2)
            //   objectRazmetka[act].fn(objectRazmetka[act].data[2], 3)

        })
    })

    eskiz(today, yestoday, week)
    await statistics(timefn(), today, 1)
    await statistics(yesTo(), yestoday, 2)
    await statistics(weekTo(), week, 3)
}

function updateHTML() {
    console.log('работает апдейт')
    const jobTSDetalisationGraf = document.querySelector(".jobTSDetalisationGraf")
    jobTSDetalisationGraf.style.flexDirection = 'row'
    jobTSDetalisationGraf.style.justifyContent = 'center'
    const jobTSDetalisationLine = document.querySelector(".jobTSDetalisationLine")
    jobTSDetalisationLine.style.width = '200px'
    const chartJobTS = document.querySelectorAll('.chartJobTS')
    const jobTSDetalisationDate = document.querySelectorAll(".jobTSDetalisationDate")
    jobTSDetalisationDate.forEach(el => {
        el.style.fontSize = '13px'
    })
    chartJobTS.forEach(el => {
        el.style.alignItems = 'start'
    })
}

function eskiz(today, yestoday, week) {
    today.textContent = `Сегодня: ${convertTime(1)}`
    yestoday.textContent = `Вчера: ${convertTime(2)}`
    week.textContent = `Неделя: ${convertTime(3)}`

}
function convertTime(num) {
    if (num === 1) {
        const todayData = new Date();
        var day = String(todayData.getDate()).padStart(2, '0');
        var month = String(todayData.getMonth() + 1).padStart(2, '0');
        var year = todayData.getFullYear();
        var formattedDate = day + "." + month + "." + year;
        return formattedDate
    }
    if (num === 2) {
        const todayData = new Date();
        var day = String(todayData.getDate() - 1).padStart(2, '0');
        var month = String(todayData.getMonth() + 1).padStart(2, '0');
        var year = todayData.getFullYear();
        var formattedDate = day + "." + month + "." + year;
        return formattedDate
    }
    if (num === 3) {
        const todayData = new Date();
        var day = String(todayData.getDate() - 7).padStart(2, '0');
        var month = String(todayData.getMonth() + 1).padStart(2, '0');
        var year = todayData.getFullYear();
        if (day <= 0) {
            // Если день стал отрицательным, значит нужно уменьшить месяц на 1
            todayData.setMonth(todayData.getMonth() - 1);
            // Получаем последний день предыдущего месяца
            const lastDayOfPrevMonth = new Date(todayData.getFullYear(), todayData.getMonth() + 1, 0).getDate();
            // Устанавливаем день на последний день предыдущего месяца
            day = String(lastDayOfPrevMonth + (Number(day))).padStart(2, '0');
            month = String(todayData.getMonth() + 1).padStart(2, '0');
        }
        var formattedDate = day + "." + month + "." + year;
        const todayData2 = new Date();
        todayData2.setDate(todayData2.getDate() - 1); // Вычитаем 1 день из текущей даты
        var day2 = String(todayData2.getDate()).padStart(2, '0');
        var month2 = String(todayData2.getMonth() + 1).padStart(2, '0');
        var year2 = todayData2.getFullYear();
        if (day2 <= 0) {
            // Если день стал отрицательным, значит нужно уменьшить месяц на 1
            todayData2.setMonth(todayData2.getMonth() - 1);
            // Получаем последний день предыдущего месяца
            const lastDayOfPrevMonth = new Date(todayData2.getFullYear(), todayData2.getMonth() + 1, 0).getDate();
            // Устанавливаем день на последний день предыдущего месяца
            day2 = String(lastDayOfPrevMonth + Number(day2)).padStart(2, '0');
            month = String(todayData.getMonth() + 1).padStart(2, '0');
        }
        var formattedDate2 = day2 + "." + month2 + "." + year2;
        return `${formattedDate}-${formattedDate2}`
    }
}
function yesTo() {
    // Получаем текущую дату и время в формате JavaScript Date
    const currentDate = new Date();
    // Вычисляем времена для вчерашнего дня
    const yesterdayStart = new Date(currentDate);
    yesterdayStart.setDate(currentDate.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);
    const yesterdayEnd = new Date(currentDate);
    yesterdayEnd.setDate(currentDate.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);
    // Переводим времена в формат юникс-времени (миллисекунды)
    const unixTimeYesterdayStart = Math.floor(yesterdayStart.getTime() / 1000);
    const unixTimeYesterdayEnd = Math.floor(yesterdayEnd.getTime() / 1000);
    return [unixTimeYesterdayEnd, unixTimeYesterdayStart]
}
function weekTo() {
    // Получаем текущую дату и время в формате JavaScript Date
    const currentDate = new Date();
    // Вычисляем времена для вчерашнего дня
    const yesterdayStart = new Date(currentDate);
    yesterdayStart.setDate(currentDate.getDate() - 7);
    yesterdayStart.setHours(0, 0, 0, 0);
    const yesterdayEnd = new Date(currentDate);
    yesterdayEnd.setDate(currentDate.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);
    // Переводим времена в формат юникс-времени (миллисекунды)
    const unixTimeYesterdayStart = Math.floor(yesterdayStart.getTime() / 1000);
    const unixTimeYesterdayEnd = Math.floor(yesterdayEnd.getTime() / 1000);
    console.log([unixTimeYesterdayEnd, unixTimeYesterdayStart])
    return [unixTimeYesterdayEnd, unixTimeYesterdayStart]

}
export async function statistics(interval, ele, num) {
    const idw = document.querySelector('.color').id
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ idw }))
    }
    const mod = await fetch('/api/modelView', params)
    const model = await mod.json()
    console.log(model)
    let tsiControll = model.result.length !== 0 || model.result[0].tsiControll && model.result[0].tsiControll !== '' ? Number(model.result[0].tsiControll) : null;
    tsiControll === 0 ? tsiControll = null : tsiControll = tsiControll
    console.log(tsiControll)

    // const interval = timefn()
    const t1 = interval[1]
    const t2 = interval[0]
    const itog = await testovfn(idw, t1, t2)
    console.log(itog)
    const res = await fnParMessage(idw)
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
        return JSON.parse(e.sens)
    })
    console.log(res)
    const nameSens = [];
    res.forEach(el => {
        nameSens.push([el[0], el[1]])
    })
    const allArrNew = [];

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
    const engine = allArrNew.filter(it => it.sens === 'Зажигание' || it.sens.startsWith('Борт'));
    engine[0].pwr = engine[1].value
    engine[0].condition = [];
    const dannie = []
    dannie.push(engine[0])

    console.log(dannie)
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
    console.log(dannie[0]);
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


    objectRazmetka['nav1'].data.push(data);
    objectRazmetka['nav2'].data.push(dannieSortJobTS(data));
    objectRazmetka['nav3'].data.push(await dannieOilTS(idw, num));
    console.log(objectRazmetka)
    const act = document.querySelector('.activStatic').id
    console.log(act, num)
    /// createChart(data, ele, num)
    objectRazmetka[act].fn(objectRazmetka[act].data[num - 1], num)
}

function prostoy(data, tsi) {
    if (data.pwr.length === 0) {
        return undefined
    }
    else {
        const prostoy = [];
        const korzina = [];
        let startIndex = 0;
        console.log(data.pwr)
        data.pwr.forEach((values, index) => {
            if (values !== data.pwr[startIndex]) {
                const speedTime = { speed: data.speed.slice(startIndex, index), time: data.time.slice(startIndex, index), geo: data.geo.slice(startIndex, index) };
                (data.pwr[startIndex] <= tsi ? korzina : prostoy).push(speedTime);
                startIndex = index;
            }
        });
        const speedTime = { speed: data.speed.slice(startIndex), time: data.time.slice(startIndex), geo: data.geo.slice(startIndex) };
        (data.pwr[startIndex] <= tsi ? korzina : prostoy).push(speedTime);

        console.log(prostoy)
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


function createOilTS(data, num) {
    const jobTSDetalisationChartsLegenda = document.querySelector('.jobTSDetalisationCharts_legenda')
    const legendaButton = document.querySelectorAll('.legendaButton')
    jobTSDetalisationChartsLegenda.style.justifyContent = 'center'
    legendaButton.forEach(el => {
        el.style.margin = '0 10px'
    })
    const jobTSDetalisationLine = document.querySelectorAll('.jobTSDetalisationLine')
    jobTSDetalisationLine.forEach(e => {
        e.style.width = '200px'
    })
    const chartStatic = document.querySelector(`.chartStatic${num}`)
    if (chartStatic) {
        chartStatic.remove();
    }
    const objColor = {
        'Заправлено': ' #8fd14f',
        'Израсходовано': '#3fd6e0',
        'Слив топлива': '#f24726'
    }
    const obj = {
        1: 'todayChart',
        2: 'yestodayChart',
        3: 'weekChart',
    }
    const dataArray = Object.entries(data).map(([category, value]) => ({ category, value }));
    // Задание размеров графика
    var width = 220;
    var height = 200;
    // Создание контейнера для графика
    var svg = d3.select(`.${obj[num]}`)
        .append("svg")
        .attr('class', `chartStatic${num}`)
        .attr("width", width)
        .attr("height", height);

    var maxValue = d3.max(dataArray.map(item => item.value));
    // Создание масштаба для оси Y
    var yScale = d3.scaleLinear()
        .domain([0, maxValue * 1.3]) // Используем максимальное значение для определения диапазона
        .range([0, height - 20]); // Подстраиваем высоту графика
    const barWidth = 60; // Ширина каждого столбца

    svg.selectAll("rect")
        .data(dataArray)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return i * barWidth;
        })
        .attr("y", (d) => height - yScale(d.value))
        .attr("width", barWidth - 1)
        .attr("height", (d) => yScale(d.value))
        .attr('stroke', (d) => yScale(d.value) > 3 ? 'black' : objColor[d.category])
        .attr("fill", function (d, i) {
            return objColor[d.category];
        });
    svg.selectAll('.text-label')
        .data(dataArray)
        .enter()
        .append('text')
        .attr('class', 'text-label')
        .attr('x', function (d, i) {
            return i * barWidth + barWidth / 2; // Центрирование текста над каждым столбцом
        })
        .attr('y', function (d) {
            if (yScale(d.value) > 30) {
                return (height - yScale(d.value)) + yScale(d.value) / 2; // Центрирование по вертикали столбца
            } else {
                return height - yScale(d.value) - 5; // Расположение над столбцом с небольшим отступом
            }
        })
        .attr('dy', function (d) {
            if (yScale(d.value) > 30) {
                return '0.35em'; // Отступ для центрированного текста
            } else {
                return '-1em'; // Отступ для текста над столбцом
            }
        })
        .text(function (d) {
            return d.value + ' л.';
        })
        .attr("fill", "black")
        .attr("font-size", "14px")
        .attr("font-family", "Roboto")
        .attr("font-weight", "bold")
        .style('text-anchor', 'middle');
}
function createJobTS(data, num) {
    const jobTSDetalisationLine = document.querySelectorAll('.jobTSDetalisationLine')
    jobTSDetalisationLine.forEach(e => {
        e.style.width = '200px'
    })
    const chartStatic = document.querySelector(`.chartStatic${num}`)
    if (chartStatic) {
        chartStatic.remove();
    }

    const objColor = {
        'Движется': ' #8fd14f',
        'Парковка': '#3399ff',
        'Работа на холостом ходу': '#f24726'
    }
    const obj = {
        1: 'todayChart',
        2: 'yestodayChart',
        3: 'weekChart',
    }

    const dataArray = Object.entries(data).map(([category, value]) => ({ category, value }));
    // Задание размеров графика
    var width = 220;
    var height = 200;

    // Создание контейнера для графика
    var svg = d3.select(`.${obj[num]}`)
        .append("svg")
        .attr('class', `chartStatic${num}`)
        .attr("width", width)
        .attr("height", height);

    var maxValue = d3.max(dataArray.map(item => item.value));

    // Создание масштаба для оси Y
    var yScale = d3.scaleLinear()
        .domain([0, num === 3 ? maxValue * 1.3 : 86400]) // Используем максимальное значение для определения диапазона
        .range([0, height - 20]); // Подстраиваем высоту графика
    const barWidth = 60; // Ширина каждого столбца
    // Присоединяет данные к rect элементам и задает их атрибуты
    // Создание столбцов

    const bars = svg.selectAll("rect")
        .data(dataArray)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return i * barWidth;
        })
        .attr("y", (d) => height - yScale(d.value))
        .attr("width", barWidth - 1)
        .attr("height", (d) => yScale(d.value))
        .attr('stroke', (d) => yScale(d.value) > 3 ? 'black' : objColor[d.category])
        .attr("fill", function (d, i) {
            return objColor[d.category];
        });

    const datas = [dataArray]
    const viewData = datas[0].map(function (d) {
        var time = convertToHoursAndMinutes(d.value);
        return {
            category: d.category, value: d.value, hours: time.hours, minutes: time.minutes
        }
    });
    // values: (time.hours > 0 ? time.hours + " ч.\n " : "") + (time.minutes > 0 ? time.minutes + " мин." : "")
    function convertToHoursAndMinutes(value) {
        console.log(value)
        const hours = Math.floor(value / 3600)
        const lastSeconds = value % 3600
        const minutes = Math.floor(lastSeconds / 60)
        console.log(hours)
        return { hours: hours, minutes: minutes };
    }
    svg.selectAll("g.values")
        .data(viewData)
        .enter()
        .append('g')
        .attr('class', 'values')
        .attr('transform', function (d, i) {
            const x = i * barWidth + (barWidth - 1) / 2; // центрирование текста на столбце
            var barHeight = yScale(d.value);
            console.log(barHeight)
            var y = height - barHeight;
            return `translate(${x}, ${y})`;
        })
        .each(function (d, i) {
            console.log(d.hours, d.minutes)
            var barHeight = yScale(d.value);
            if (d.hours > 0) {
                d3.select(this)
                    .append('text')
                    .attr('x', 0)
                    .attr('y', barHeight > 30 ? barHeight / 3 : 0)
                    .attr('dy', barHeight > 30 ? '0.75em' : '-1.75em') // Смещение вверх над столбцем для часов
                    .text(d.hours + ' ч.')
                    .attr("fill", "black")
                    .attr("font-size", "14px")
                    .attr("font-family", "Roboto")
                    .attr("font-weight", "bold")
                    .style('text-anchor', 'middle'); // Центрирование текста
            }
            if (d.minutes > 0) {
                d3.select(this)
                    .append('text')
                    .attr('x', 0)
                    .attr('y', barHeight > 30 ? barHeight / 3 : 0)
                    .attr('dy', barHeight > 30 ? '1.75em' : '-0.35em') // Смещение вверх над часами для минут
                    .text(d.minutes + ' мин.')
                    .attr("fill", "black")
                    .attr("font-size", "14px")
                    .attr("font-family", "Roboto")
                    .attr("font-weight", "bold")
                    .style('text-anchor', 'middle'); // Центрирование текста
            }
        });
}
function createChart(data, num) {
    const chartStatic = document.querySelector(`.chartStatic${num}`)
    if (chartStatic) {
        chartStatic.remove();
    }
    // Функция для объединения смежных интервалов с одинаковым статусом
    function combineIntervals(data) {
        const combinedData = [];
        let currentInterval = { ...data[0] };

        for (let i = 1; i < data.length; i++) {
            if (data[i].time === currentInterval.time) {
                currentInterval.time = data[i].time;
            } else {
                combinedData.push({ ...currentInterval });
                currentInterval = { ...data[i] };
            }
        }
        combinedData.push({ ...currentInterval });
        return combinedData;
    }

    const combinedData = combineIntervals(data);
    console.log(combinedData, num)
    const width = 673; // Ширина графика
    const svgHeight = 80; // Высота SVG элемента
    const margin = { top: 10, right: 20, bottom: 10, left: 50 };
    const height = svgHeight - margin.top - margin.bottom;

    const objColor = {
        'Движется': ' #8fd14f',
        'Парковка': '#3399ff',
        'Повернут ключ зажигания': '#fef445',
        'Работа на холостом ходу': '#f24726'
    }
    const obj = {
        1: 'todayChart',
        2: 'yestodayChart',
        3: 'weekChart',
    }
    const tooltip = d3.select(`.${obj[num]}`)
        .append("div")
        .attr("class", `tooltipStat${num}`)
        .style("position", "absolute")
        .style('width', '130px')
        .style("padding", "5px")
        .style("background-color", "rgba(0, 0, 0, 0.7)")
        .style("color", "#fff")
        .style("border-radius", "5px")
        .style("font-size", "12px")
        .style("display", "none");
    const svg = d3.select(`.${obj[num]}`)
        .append("svg")
        .attr('class', `chartStatic${num}`)
        .attr("width", "100%")
        .attr("height", svgHeight);
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.time))
        .range([0, width]);
    const g = svg.append("g")
        .attr("transform", `translate(${0}, ${margin.top})`);
    g.selectAll("rect")
        .data(combinedData)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.time))
        .attr("y", 0)
        //  .attr("stroke", "none")
        .attr("width", (d) => {
            return xScale(d.time);
        })
        .attr("height", 30) // Высота 10px
        .attr("fill", d => (objColor[d.condition]))
        .on("mousemove", function (event, d) {
            g.selectAll("rect").attr("fill", d => (objColor[d.condition]))
            d3.select(this).attr("fill", 'black');

            // Определяем координаты курсора в отношении svg
            const [xPosition, yPosition] = d3.mouse(this);
            console.log([xPosition, yPosition])
            // Определяем ближайшую точку на графике
            const bisect = d3.bisector(d => d.time).right;
            const x0 = xScale.invert(xPosition);
            const i = bisect(combinedData, x0, 1);
            const d0 = combinedData[i - 1];
            const d1 = combinedData[i];
            d = x0 - d0.time > d1.time - x0 ? d1 : d0;

            const selectedTime = timeConvert(d.time)
            const tool = document.querySelector(`.tooltipStat${num}`)
            console.log(tool)
            tool.style.display = 'block'
            tool.textContent = `Скорость: ${d.speed} км/ч\nВремя: ${selectedTime}\nСостояние: ${d.condition}`
            tool.style.top = '330px'//'50px'
            tool.style.left = '350px'
        })
        .on("mouseout", function (event, d) {
            d3.select(this).attr("fill", d => (objColor[d.condition]))
            tooltip.style("display", "none");
        })
        .on("click", function (d) {
            const [xPosition, yPosition] = d3.mouse(this);
            // Определяем ближайшую точку на графике
            const bisect = d3.bisector(d => d.time).right;
            const x0 = xScale.invert(xPosition);
            const i = bisect(combinedData, x0, 1);
            const d0 = combinedData[i - 1];
            const d1 = combinedData[i];
            d = x0 - d0.dates > d1.dates - x0 ? d1 : d0;
            createMapsUniq([], d, 'stat')


            const graph = document.querySelector(`.${obj[num]}`)
            graph.addEventListener('click', function (event) {
                event.stopPropagation(); // Остановка всплытия события, чтобы клик на графике не вызывал обработчик события click на document
                createMapsUniq([], d, 'stat')
            });
            document.addEventListener('click', function (event) {
                const targetElement = event.target;
                const map = document.getElementById('mapOil');

                if (map && !map.contains(targetElement)) {
                    map.remove();
                }
            });
        })
    let timeFormat;
    if (num === 3) {
        timeFormat = d3.timeFormat("%d")
    }
    timeFormat = d3.timeFormat("%H:%M");
    const xAxis = d3.axisBottom(xScale).tickFormat(timeFormat);
    g.append("g")
        .attr("transform", `translate(0, 30)`) // Отступ для оси x
        .call(xAxis);

}

async function dannieOilTS(idw, num) {
    let number;
    let data
    if (num === 1) {
        number = 0
        data = [convertDate(number)]
    }
    if (num === 2) {
        number = 1
        data = [convertDate(number)]
    }
    if (num === 3) {
        number = 7
        data = [convertDate(number), convertDate(1)]
    }

    console.log(data)
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, idw }),
    };
    const mods = await fetch('/api/summaryIdwToBase', params);
    const models = await mods.json();
    let zap = models.reduce((acc, el) => el.zapravka + acc, 0)
    let ras = models.reduce((acc, el) => el.rashod + acc, 0)
    console.log(zap, ras)
    const obj = {}
    zap !== 0 ? obj['Заправлено'] = zap : null
    ras !== 0 ? obj['Израсходовано'] = ras : null
    console.log(obj)
    return obj

}


function dannieSortJobTS(datas, ele, num) {


    const data = datas.map(el => ({
        geo: el.geo,
        sats: el.sats,
        pwr: el.pwr,
        value: el.value,
        time: el.time,
        speed: el.speed,
        condition: el.condition === 'Повернут ключ зажигания' ? 'Парковка' : el.condition
    }));
    console.log(data)
    const obj = {};
    let start;
    let end;
    let currentCondition;
    for (let i = 0; i < data.length; i++) {
        const current = data[i];

        if (current.condition !== currentCondition) {
            if (start && end) {
                const duration = subtractTimes(end, start);
                obj[currentCondition] = obj[currentCondition] || 0;
                obj[currentCondition] += duration;
            }
            start = current.time;
        }
        end = current.time;
        currentCondition = current.condition;
    }
    // Добавляем последний отрезок времени
    if (start && end && currentCondition) {
        const duration = subtractTimes(end, start);
        obj[currentCondition] = obj[currentCondition] || 0;
        obj[currentCondition] += duration;
    }
    function subtractTimes(end, start) {
        const diff = (end.getTime() / 1000) - (start.getTime() / 1000)
        return diff
    }
    return obj

}