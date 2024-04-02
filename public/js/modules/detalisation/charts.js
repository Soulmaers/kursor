import { timeConvert } from '../charts/oil.js'
import { convertToHoursAndMinutes } from './helpers.js'
import { createMapsUniq } from '../geo.js'

export function createJobTS(data, num) {
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
    console.log(data)
    const dataArray = Object.entries(data).map(([category, value]) => ({ category, value }));

    const windowStatistic = document.querySelector('.windowStatistic')
    const chartJobTS = document.querySelector('.chartJobTS')
    var widthWind = document.querySelector('body').offsetWidth;
    const jobTSDetalisationLines = document.querySelector('.jobTSDetalisationLine')

    jobTSDetalisationLines.style.width = ''
    jobTSDetalisationLines.style.width = widthWind / 3 //widthWind / 3 - 15
    chartJobTS.style.alignItems = 'center';
    const width = widthWind < 860 ? widthWind / 3 - 15 : windowStatistic.clientWidth / 3 - 40//widthInPx; // Ширина графика
    // Задание размеров графика
    //   var width = 220;
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

    svg.selectAll("g.values")
        .data(viewData)
        .enter()
        .append('g')
        .attr('class', 'values')
        .attr('transform', function (d, i) {
            const x = i * barWidth + (barWidth - 1) / 2; // центрирование текста на столбце
            var barHeight = yScale(d.value);
            var y = height - barHeight;
            return `translate(${x}, ${y})`;
        })
        .each(function (d, i) {
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
export function createChart(data, num) {
    if (data.length === 0) {
        return
    }
    const chartStatic = document.querySelector(`.chartStatic${num}`)
    if (chartStatic) {
        chartStatic.remove();
    }

    const jobTSDetalisationGraf = document.querySelector('.jobTSDetalisationGraf ')
    const widthInPx = jobTSDetalisationGraf.offsetWidth;
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
    const windowStatistic = document.querySelector('.windowStatistic')

    var widthWind = document.querySelector('body').offsetWidth;
    console.log(windowStatistic.clientWidth)
    const combinedData = combineIntervals(data);
    const win = windowStatistic.clientWidth == 0 ? 707 : windowStatistic.clientWidth
    let width = widthWind < 860 ? widthWind - 15 : win - 40//widthInPx; // Ширина графика
    //  width < 0 ? 0 : width
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
        .attr("width", width)
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
            // Определяем ближайшую точку на графике
            const bisect = d3.bisector(d => d.time).right;
            const x0 = xScale.invert(xPosition);
            const i = bisect(combinedData, x0, 1);
            const d0 = combinedData[i - 1];
            const d1 = combinedData[i];
            d = x0 - d0.time > d1.time - x0 ? d1 : d0;
            const selectedTime = timeConvert(d.time)
            const tool = document.querySelector(`.tooltipStat${num}`)
            tool.style.display = 'block'
            tool.textContent = `Скорость: ${d.speed} км/ч\nВремя: ${selectedTime}\nСостояние: ${d.condition}\nИнтервал: ${d.interval.hours} ч.${d.interval.minutes} мин.`
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
                //   createMapsUniq([], d, 'stat')
            });
            document.addEventListener('click', function (event) {
                const targetElement = event.target;
                const map = document.getElementById('mapOil');
                const wrapMap = document.querySelector('.wrapMap')
                if (wrapMap && !wrapMap.contains(targetElement)) {
                    wrapMap.remove();
                }
            });
        })
    let timeFormat;
    if (num === 3) {
        timeFormat = d3.timeFormat("%d")
    }
    timeFormat = d3.timeFormat("%H:%M");
    const xAxis = d3.axisBottom(xScale).tickFormat(timeFormat)
    const ticks = [xScale.domain()[0], ...xAxis.scale().ticks(xAxis.ticks()[0])];
    //, xScale.domain()[1]]
    ticks[0] = new Date(ticks[0].getTime() + 5 * 60 * 1000); // Смещение первого тика на 5 минут вперед
    // ticks[ticks.length - 1] = new Date(ticks[ticks.length - 1].getTime() - 5 * 60 * 1000);

    xAxis.tickValues(ticks).tickSizeOuter(0)
    g.append("g")
        .attr("transform", `translate(0, 30)`) // Отступ для оси x
        .call(xAxis);

}

export function createMelagiTS(data, num) {
    const chartJobTS = document.querySelector('.chartJobTS')
    chartJobTS.style.width = '700px'
    chartJobTS.style.alignItems = 'center'
    const intervalTitle = document.querySelector('.intervalTitle')
    intervalTitle.style.fontSize = '16px'
    const chartStatic = document.querySelector(`.chartStatic${num}`)
    if (chartStatic) {
        chartStatic.remove();
    }
    const jobTSDetalisationLine = document.querySelector('.jobTSDetalisationLine')


    const windowStatistic = document.querySelector('.windowStatistic')
    var widthWind = document.querySelector('body').offsetWidth;


    jobTSDetalisationLine.style.width = ''
    jobTSDetalisationLine.style.width = widthWind / 3 //widthWind / 3 - 15
    chartJobTS.style.alignItems = 'center';
    const width = widthWind < 860 ? widthWind - 5 : data.length * 50;

    jobTSDetalisationLine.style.display = 'flex'
    jobTSDetalisationLine.style.justifyContent = 'center'

    const obj = {
        1: 'intervalChart',

    }
    var height = 250;
    var svg = d3.select(`.${obj[num]}`)
        .append("svg")
        .attr('class', `chartStatic${num}`)
        .attr("width", width)
        .attr("height", height + 20);
    var maxValue = d3.max(data.map(item => item.melagi));
    var xScale = d3.scaleBand()
        .domain(data.map(function (d) { return d.data; }))
        .range([0, width])
    var yScale = d3.scaleLinear()
        .domain([0, maxValue * 1.3])
        .range([0, height + 20]);
    const barWidth = widthWind < 860 ? widthWind / data.length : 50 // Ширина каждого столбца с использованием .bandwidth()
    // Создание столбцов
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.data)) // Изменено на использование xScale с d.data
        .attr("y", (d) => height - yScale(d.melagi))
        .attr("width", barWidth)
        .attr("height", (d) => yScale(d.melagi))
        .attr('stroke', 'steelblue')
        .attr("fill", 'steelblue')
        .attr("opacity", 0.5);
    svg.selectAll('.text-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'text-label')
        .attr('x', function (d, i) {
            return i * barWidth + barWidth / 2; // Центрирование текста над каждым столбцом
        })
        .attr('y', function (d) {
            if (yScale(d.melagi) > 30) {
                return (height - yScale(d.melagi)) + yScale(d.melagi) / 2; // Центрирование по вертикали столбца
            } else {
                return height - yScale(d.melagi) - 5; // Расположение над столбцом с небольшим отступом
            }
        })
        .attr('dy', function (d) {
            if (yScale(d.melagi) > 30) {
                return '0.35em'; // Отступ для центрированного текста
            } else {
                return '-1em'; // Отступ для текста над столбцом
            }
        })
        .text(function (d) {
            return d.melagi;
        })
        .attr("fill", "black")
        .attr("font-size", "14px")
        .attr("font-family", "Roboto")
        .attr("font-weight", "bold")
        .style('text-anchor', 'middle')

    svg.selectAll('.text-label1')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'text-label1')
        .attr('x', function (d, i) {
            return i * barWidth + barWidth / 2; // Центрирование текста над каждым столбцом
        })
        .attr('y', function (d) {
            if (yScale(d.melagi) > 40) {
                return (height - yScale(d.melagi)) + yScale(d.melagi) / 1.5; // Центрирование по вертикали столбца
            } else if (yScale(d.melagi) > 20 && yScale(d.melagi) <= 40) {
                return (height - yScale(d.melagi)) + yScale(d.melagi) / 1.2; // Центрирование по вертикали столбца
            }
            else {
                return height - yScale(d.melagi) + 10; // Расположение над столбцом с небольшим отступом
            }
        })
        .attr('dy', function (d) {
            if (yScale(d.melagi) > 30) {
                return '0.35em'; // Отступ для центрированного текста
            } else {
                return '-1em'; // Отступ для текста над столбцом
            }
        })
        .text(function (d) {
            return ' км.';
        })
        .attr("fill", "black")
        .attr("font-size", "14px")
        .attr("font-family", "Roboto")
        .attr("font-weight", "bold")
        .style('text-anchor', 'middle')



    svg.selectAll('.data-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'data-label')
        .attr('x', function (d) {
            return xScale(d.data) + barWidth / 2; // Центрирование текста под каждым столбцом
        })
        .attr('y', height + 15) // Ниже основной части столбца с небольшим отступом
        .text(function (d) {
            return d.data;
        })
        .attr("fill", "black")
        .attr("font-size", "12px")
        .attr("font-family", "Roboto")
        .style('text-anchor', 'middle');

}
export function createOilTS(data, num) {
    const jobTSDetalisationChartsLegenda = document.querySelector('.jobTSDetalisationCharts_legenda')
    const legendaButton = document.querySelectorAll('.legendaButton')
    jobTSDetalisationChartsLegenda.style.justifyContent = 'center'
    legendaButton.forEach(el => {
        el.style.margin = '0 10px'
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

    const windowStatistic = document.querySelector('.windowStatistic')
    const chartJobTS = document.querySelector('.chartJobTS')
    var widthWind = document.querySelector('body').offsetWidth;
    const jobTSDetalisationLines = document.querySelector('.jobTSDetalisationLine')

    jobTSDetalisationLines.style.width = ''
    jobTSDetalisationLines.style.width = widthWind / 3 //widthWind / 3 - 15
    chartJobTS.style.alignItems = 'center';
    const width = widthWind < 860 ? widthWind / 3 - 15 : windowStatistic.clientWidth / 3 - 40//widthInPx; // Ширина графика
    // var width = 220;
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