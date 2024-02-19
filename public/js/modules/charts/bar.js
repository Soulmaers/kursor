
import { Tooltip } from '../../class/Tooltip.js'
import { createMapsUniq } from '../geo.js'

let isCanceled = false;

export function convertTineAll(t) {
    const date = new Date(t * 1000);
    // Используйте методы объекта Date для получения года, месяца и дня
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1, так как месяцы начинаются с 0
    const day = String(date.getDate()).padStart(2, '0');
    // Соберите дату в формате "год-месяц-день"
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
}
export async function testovfn(active, t1, t2) {
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

export async function testovfnNew(active, t1, t2) {
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ active, t1, t2 }))
    }
    const rest = await fetch('/api/viewSortChart', param)
    const resultt = await rest.json()
    return resultt
}

export async function datas(t1, t2) {
    if (isCanceled) {
        return Promise.reject(new Error('Запрос отменен'));
    }
    isCanceled = true; // Устанавливаем флаг в значение true, чтобы прервать предыдущее выполнение
    try {
        const active = Number(document.querySelector('.color').id)
        const tt1 = convertTineAll(t1)
        const tt2 = convertTineAll(t2)
        console.log(tt1, tt2)
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ active, tt1, tt2 }))
        }
        const rest = await fetch('/api/viewStructura', param)
        const resultt = await rest.json()
        console.log(resultt)
        if (resultt.length === 0) {
            document.querySelector('.noGraf').style.display = 'block'
            const grafOld = document.querySelector('.infoGraf')
            if (grafOld) {
                grafOld.remove()
            }
            const loaders = document.querySelector('.loaders_charts')
            loaders.style.display = 'none';
            isCanceled = false;
            return
        }
        document.querySelector('.noGraf').style.display = 'none'
        //  const dat = resultt.map(e => JSON.parse(e.info))

        function parseInfo(data) {
            return data.map(item => {
                return {
                    ...JSON.parse(item.info)
                };
            });
        }
        console.time()
        const dat = parseInfo(resultt);
        console.timeEnd()
        const merged = {};
        dat.forEach((obj) => {
            for (const key in obj) {
                if (!merged.hasOwnProperty(key)) {
                    merged[key] = { ...obj[key], val: [] };
                }
                merged[key].val.push(...obj[key].val);
            }
        });
        const dat1 = [merged];
        let dat2 = Object.values(dat1[0]).map(e => {
            return {
                ...e, // Keep other properties
                val: e.val.map(item => {
                    return {
                        ...item, // Keep other properties
                        dates: new Date(item.dates) // Convert "dates" property to Date object
                    };
                })
            };
        });
        await grafikStartPress(dat2)
        const loaders = document.querySelector('.loaders_charts')
        loaders.style.display = 'none';
        isCanceled = false;
    }
    catch (e) {
        isCanceled = false;
    }
}

async function grafikStartPress(dat2) {
    console.log(dat2)
    const model = await iconChart()
    const graf = document.createElement('div')
    const grafics = document.querySelector('.grafics')
    graf.classList.add('infoGraf')
    grafics.appendChild(graf)
    const info = document.createElement('div')
    info.classList.add('infos')
    graf.prepend(info)
    const container = d3.select('.infoGraf');
    // Связываем данные с контейнером
    const charts = container.selectAll('.charts')
        .data(dat2)
        .enter()
        .append('div')
        .attr('class', 'chart');
    const margin = { top: 100, right: 10, bottom: 30, left: 10 }
    var widthWind = document.querySelector('body').offsetWidth;
    const width = widthWind >= 860 ? 800 - margin.left - margin.right : widthWind - 80
    const height = 50;
    const count = charts.size()
    let he;
    let pad;
    const tooltips = document.createElement('div')
    tooltips.classList.add('tooltips')
    const titleGraf = document.createElement('div')
    tooltips.classList.add('tooltips')
    titleGraf.classList.add('titleGraf')
    const infoGraf = document.querySelector('.infoGraf')
    infoGraf.prepend(titleGraf)
    titleGraf.textContent = 'Давление/Температура'
    const checkGraf = document.createElement('div')
    checkGraf.classList.add('checkGraf')
    titleGraf.appendChild(checkGraf)
    checkGraf.innerHTML = `<input class="inputPress" id="inputPress" type="checkbox">
<label for="inputPress" class="labelPress">Подсветка графика</label>
<input class="inputAllPress" id="inputAllPress" type="checkbox" checked>
<label for="inputAllPress"class="labelAllPress" > Общее масштабирование</label>
  <div class="comback">Масштаб по умолчанию</div></div>`;
    infoGraf.appendChild(tooltips)
    const tt1 = document.createElement('div')
    const tt2 = document.createElement('div')
    const tt3 = document.createElement('div')
    const tt4 = document.createElement('div')
    tooltips.appendChild(tt1)
    tooltips.appendChild(tt2)
    tooltips.appendChild(tt3)
    tooltips.appendChild(tt4)
    const svgLegend = d3.select('.titleGraf')
    const svga = svgLegend.append('svg')
        .attr("width", 300)
        .attr('height', 40)
        .append("g")
        .attr("transform", "translate(" + -70 + "," + 40 + ")")
    svga.append("circle")
        .attr('class', 'barGraf')
        .attr("r", 6)
        .attr("cx", 100)
        .attr("cy", -25)
        .attr("fill", "#009933")
        .attr('stroke', 'black')
    svga.append("text")
        .attr('class', 'legendBar')
        .attr("x", 200)
        .attr("y", -20)
        .style("text-anchor", "end")
        .text("Давление")
        .attr("fill", "black");
    // добавляем подпись второй кривой
    svga.append("circle")
        .attr('class', 'tempGraf')
        .attr("r", 6)
        .attr("cx", 220)
        .attr("cy", -25)
        .attr("fill", "blue")
        .attr('stroke', 'black')
    svga.append("text")
        .attr('class', 'legendBar')
        .attr("x", 345)
        .attr("y", -20)
        .style("text-anchor", "end")
        .text("Температура")
        .attr("fill", "black");
    tooltips.style.display = 'none'
    d3.select(".inputPress")
        .on("click", function () {
            const checked = d3.select(this).property("checked");
            d3.selectAll(".area1")
                .attr("fill", function (d) {
                    if (checked) {
                        return 'darkgreen'
                    } else {
                        return "#009933";
                    }
                });
            d3.selectAll(".area11")
                .attr("fill", function (d) {
                    if (checked) {
                        return '#e8eb65'
                    } else {
                        return "#009933";
                    }
                });
            d3.selectAll(".area12")
                .attr("fill", function (d) {
                    if (checked) {
                        return 'darkred'
                    } else {
                        return "#009933";
                    }
                });
        });
    const char = document.querySelectorAll('.chart')
    char.forEach(e => {
        const div1 = document.createElement('div')
        div1.classList.add('im1')
        e.prepend(div1)
    })
    const im1 = document.querySelectorAll('.im1')
    char[char.length - 1].children[0].classList.add('last')
    // В каждом элементе создаем график
    const end = await vieModelChart(model, im1)
    clearCreate()
    const comback = document.querySelector('.comback')
    comback.addEventListener('click', () => {
        clearCreate()
    })
    let arrayDomain = [];
    let arrayDomainTwo = []
    function clearCreate(filterData) {
        d3.selectAll('.chart').select('svg').remove()
        d3.selectAll('.chart').select('.tooly').remove()
        d3.selectAll('.chart').select('.toolyStatic').remove()
        charts.each(function (d, i) {
            const data = d; // данные для этого графика
            let stor;
            if (filterData) {
                stor = filterData[i]
            }
            else {
                stor = data
            }
            const chartContainer = d3.select(this); // div, в котором будет находиться график
            if (i === count - 1) {
                he = height + 30
                pad = 0
            }
            else {
                he = height
                pad = 0
            }
            // создаем svg контейнер
            const svg = chartContainer.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr('height', he)
                .attr('rel', d.sens)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + pad + ")")
            chartContainer.append('div')
                .attr('class', 'tooly')
            if (i === count - 1) {
                he = height + 30
                pad = 0
                chartContainer.append('div')
                    .attr('class', 'toolyStatic last')
                    .text('-Бар/-С°');
            }
            else {
                chartContainer.append('div')
                    .attr('class', 'toolyStatic')
                    .text('-Бар/-С°');
            }
            const idw = Number(document.querySelector('.color').id)
            // задаем x-шкалу
            const x = d3.scaleTime()
                .domain(d3.extent(stor.val, (d) => new Date(d.dates)))
                .range([0, width])
            // задаем y-шкалу для первой оси y
            const y1 = d3.scaleLinear()
                .domain(idw !== 26821431 ? [0, 15] : [0, 4])//d3.extent(data.val, (d) => d.value))
                .range([height, 0]);
            // задаем y-шкалу для второй оси y
            const y2 = d3.scaleLinear()
                .domain(d3.extent(data.val, (d) => d.tvalue))
                .range([height, 0]);
            const xAxis = d3.axisBottom(x)
            const area1 = d3.area()
                .x(d => x(d.dates))
                .y0(height)
                .y1(d => y1(d.value))
                .curve(d3.curveStep);
            const knd = d.bar !== undefined ? Number(d.bar.knd).toFixed(1) : null
            const dvn = d.bar !== undefined ? Number(d.bar.dvn).toFixed(1) : null
            const dnn = d.bar !== undefined ? Number(d.bar.dnn).toFixed(1) : null
            const kvd = d.bar !== undefined ? Number(d.bar.kvd).toFixed(1) : null
            const area11 = d3.area()
                .x(d => x(d.dates))
                .y0(height)
                .y1(d => d.value > knd && d.value <= dnn || d.value > dvn && d.value <= kvd ? y1(d.value) : height)
                .curve(d3.curveStep);
            const area12 = d3.area()
                .x(d => x(d.dates))
                .y0(height)
                .y1(d => d.value <= knd || d.value >= kvd ? y1(d.value) : height)
                .curve(d3.curveStep);
            const area2 = d3.area()
                .x(d => x(d.dates))
                .y0(height)
                .y1(d => y2(d.tvalue))
                .curve(d3.curveStep);
            const area3 = d3.line()
                .x(d => x(d.dates))
                .y(d => d.value === -0.5 && d.speed > 5 || d.tvalue === -0.5 && d.speed > 5 ? y1(0) : height + 10)
                .curve(d3.curveStep);
            const u = 0;
            filterData ? x.domain(d3.extent(filterData[i].val, (d) => new Date(d.dates))) : x.domain(d3.extent(data.val, (d) => new Date(d.dates)))
            // добавляем ось x
            svg.append("g")
                .attr("class", "osx")
                .attr("transform", "translate(" + u + "," + (height) + ")")
                .attr('height', 300)
                .transition()
                .duration(1000)
                .call(xAxis
                    .tickFormat(d3.timeFormat('%H:%M')));
            // добавляем первую ось y
            svg.append("g")
                .attr("class", "os1y")
            // добавляем вторую ось y
            svg.append("g")
                .attr("class", "os2y")
                .attr("transform", "translate(" + width + ", 0)")

            const legendBar = document.querySelectorAll('.legendBar')
            const clip = svg.append("defs").append("svg:clipPath")
                .attr("id", "clip")
                .append("svg:rect")
                .attr("width", width)
                .attr("height", height)
                .attr("x", 0)
                .attr("y", 0);
            const chartGroup = svg.append("g")
                .attr("class", "chart-group")
                .attr("clip-path", "url(#clip)");
            chartGroup.append("path")
                .datum(stor.val)
                .attr("class", "area3")
                .transition()
                .duration(1000)
                .attr("d", area3)
                .attr("stroke-width", 1)
                .attr("stroke", "red")
                .attr("fill-opacity", 1)
            // добавляем области для первой кривой
            chartGroup.append("path")
                .datum(stor.val)
                .transition()
                .duration(1000)
                .attr("d", area1)
                .attr("fill", function (d) {
                    if (d3.select(".inputPress").property("checked")) {
                        return "darkgreen";
                    } else {
                        return "#009933";
                    }
                })
                .attr("class", "area1")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("fill-opacity", 1)
                .style('display', legendBar[0].classList.contains('noActive') ? 'none' : 'block')
            chartGroup.append("path")
                .datum(stor.val)
                .attr("class", "area11")
                .transition()
                .duration(1000)
                .attr("d", area11)
                .attr("fill", function (d) {
                    if (d3.select(".inputPress").property("checked")) {
                        return "#e8eb65";
                    } else {
                        return "#009933";
                    }
                })
                .attr("stroke-width", 1)
                .attr("fill-opacity", 0.9)
                .style('display', legendBar[0].classList.contains('noActive') ? 'none' : 'block')
            chartGroup.append("path")
                .datum(stor.val)
                .attr("class", "area12")
                .transition()
                .duration(1000)
                .attr("d", area12)
                .attr("fill", function (d) {
                    if (d3.select(".inputPress").property("checked")) {
                        return "darkred";
                    } else {
                        return "#009933";
                    }
                })
                .attr("fill-opacity", 0.9)
                .style('display', legendBar[0].classList.contains('noActive') ? 'none' : 'block')
            // добавляем области для второй кривой
            chartGroup.append("path")
                .datum(stor.val)
                .attr("fill", "none")
                .attr("class", "pat")
                .attr("class", "area2")
                .attr("fill-opacity", 0.3)
                .attr("stroke", "blue")
                .attr("stroke-width", 1)
                .transition()
                .duration(1000)
                .attr("d", area2)
                .style('display', legendBar[1].classList.contains('noActive') ? 'none' : 'block')

            var brush = d3.brushX()
                .extent([[0, 0], [width, height]])
                .on("end", function () {
                    brushed(x, i);
                });
            var brushStartX = 0;
            brush.on("start", function () {
                brushStartX = d3.event.sourceEvent.clientX;
            });
            svg
                .append("g")
                .attr("class", "brush")
                .call(brush);
            const preloaderGraf = document.querySelector('.loader') /* находим блок Preloader */
            preloaderGraf.style.opacity = 0;
            preloaderGraf.style.display = 'none'
            let idleTimeout;
            function idled() { idleTimeout = null; }
            function brushed(x, i) {

                let leftToRight;
                var brushEndX = d3.event.sourceEvent.clientX;
                var selection = d3.event.selection;
                if (!brushStartX || !selection || !selection.length) {
                } else {
                    brushEndX > brushStartX ? leftToRight = "left to right" : leftToRight = "right to left"
                }
                const extent = d3.event.selection
                const inputAllPress_checked = d3.select(".inputAllPress").property("checked");
                if (inputAllPress_checked && extent) {
                    const [x0, x1] = extent.map(x.invert)
                    if (leftToRight === "left to right") {
                        if (!extent || Math.abs(x.invert(extent[1]) - x.invert(extent[0])) < 300000) {
                            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350);
                        } else {
                            arrayDomain.push([x0, x1])
                            const filterData = dat2.map(el => {
                                return {
                                    sens: el.sens,
                                    position: el.position,
                                    bar: el.bar,
                                    val: el.val.filter((d) => {
                                        return d.dates >= x0 && d.dates <= x1;
                                    })
                                };
                            });
                            clearCreate(filterData)
                            return
                        }
                    }
                    else {
                        arrayDomain.pop()
                        if (arrayDomain.length === 0) {
                            const filterData = dat2
                            clearCreate(filterData)
                            return
                        }
                        const filterData = dat2.map(el => {
                            return {
                                sens: el.sens,
                                position: el.position,
                                bar: el.bar,
                                val: el.val.filter((d) => {
                                    return d.dates >= arrayDomain[arrayDomain.length - 1][0] && d.dates <= arrayDomain[arrayDomain.length - 1][1];
                                })
                            };
                        });
                        clearCreate(filterData)
                        return
                    }
                }
                else {
                    if (!extent || Math.abs(x.invert(extent[1]) - x.invert(extent[0])) < 300000) {
                        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350);
                    } else {
                        // Если чекбокс не нажат, то масштабируем только текущий график
                        x.domain([x.invert(extent[0]), x.invert(extent[1])]);
                        svg.select(".brush").call(brush.move, null)
                        svg.select(".area1")
                            .datum(stor.val)
                            .transition()
                            .duration(1000)
                            .attr("d", area1);
                        svg.select(".area11")
                            .datum(stor.val)
                            .transition()
                            .duration(1000)
                            .attr("d", area11);
                        svg.select(".area3")
                            .datum(stor.val)
                            .transition()
                            .duration(1000)
                            .attr("d", area3);
                        svg.select(".area2")
                            .datum(stor.val)
                            .transition()
                            .duration(1000)
                            .attr("d", area2);
                        svg.select(".area12")
                            .datum(stor.val)
                            .transition()
                            .duration(1000)
                            .attr("d", area12);
                        // Масштабируем ось X
                        svg.select(".osx")
                            .call(d3.axisBottom(x)
                                .tickFormat(d3.timeFormat('%H:%M')))
                            .transition()
                            .duration(1000)
                            .call(d3.axisBottom(x));
                    }
                }

            }
            svg.on("dblclick", function () {
                x.domain(d3.extent(stor.val, (d) => new Date(d.dates)))
                d3.select('.osx')
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x)
                        .tickFormat(d3.timeFormat('%H:%M')))
                    .transition().call(d3.axisBottom(x))
                svg.select(".area3")
                    .datum(stor.val)
                    .attr("class", "area3")
                    .attr("d", area3)
                    .attr("stroke-width", 1)
                    .attr("stroke", "red")
                    .attr("fill-opacity", 1)
                svg.select(".area1")
                    .datum(stor.val)
                    .transition()
                    .duration(1000)
                    .attr("fill", function (d) {
                        if (d3.select(".inputPress").property("checked")) {
                            return "darkgreen";
                        } else {
                            return "#009933";
                        }
                    })
                    .attr("class", "pat")
                    .attr("class", "area1")
                    .attr("d", area1)
                    .attr("fill-opacity", 1)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                svg.select(".area11")
                    .datum(stor.val)
                    .transition()
                    .duration(1000)
                    .attr("fill", function (d) {
                        if (d3.select(".inputPress").property("checked")) {
                            return "#e8eb65";
                        } else {
                            return "#009933";
                        }
                    })
                    .attr("d", area11)
                    .attr("fill-opacity", 0.9)
                svg.select(".area12")
                    .datum(stor.val)
                    .transition()
                    .duration(1000)
                    .attr("class", "area12")
                    .attr("d", 2)
                    .attr("fill", function (d) {
                        if (d3.select(".inputPress").property("checked")) {
                            return "darkred";
                        } else {
                            return "#009933";
                        }
                    })
                    .attr("d", area12)
                    .attr("fill-opacity", 0.9)
                svg.select(".area2")
                    .datum(stor.val)
                    .transition()
                    //  .duration(1000)
                    .attr("class", "pat")
                    .attr("class", "area2")
                    .attr("fill", "none")
                    .attr("fill-opacity", 0.3)
                    .attr("stroke", "blue")
                    .attr("stroke-width", 1)
                    .attr("d", area2)
            })
            svg.on("mousemove", function (d) {
                // Определяем координаты курсора в отношении svg
                const [xPosition, yPosition] = d3.mouse(this);
                // Определяем ближайшую точку на графике
                const bisect = d3.bisector(d => d.dates).right;
                const x0 = x.invert(xPosition);
                const i = bisect(data.val, x0, 1);
                const d0 = data.val[i - 1];
                const d1 = data.val[i];
                d = x0 - d0.dates > d1.dates - x0 ? d1 : d0;
                tooltips.style.display = 'block'
                const selectedTime = timeConvert(d.dates)
                const trigger = d.dates
                const tooly = document.querySelectorAll('.tooly')
                tooly.forEach(e => {
                    e.style.display = 'flex'
                })
                const toolyStatic = document.querySelectorAll('.toolyStatic')
                toolyStatic.forEach(e => {
                    e.style.display = 'none'
                })
                globalTooltip(trigger)
                // Обновить текст в тултипе
                if (d) {
                    let dav;
                    let temp;
                    tt1.textContent = d.stop === 'ВКЛ' ? `Время: ${(selectedTime)}` : null
                    if (d.value === -0.5 && d.speed > 5) {
                        const date = new Date(d.dates);
                        date.setMinutes(date.getMinutes() - 7);
                        // const selectedData = dat2.filter(d => d.val.find(val => val.dates === date));
                        //  console.log(selectedData)
                        tt2.textContent = `Давление: Потеря связи с датчиком`
                        dav = '--'
                    }
                    else if (d.stop == 'ВЫКЛ') {
                        tt2.textContent = `Двигатель выключен`;
                        dav = '-';
                    }
                    else if (d.value === -0.5 && d.speed <= 5 && d.stop == 'ВКЛ') {
                        for (let i = 0; i < data.val.length; i++) {
                            if (d.dates === data.val[i].dates) {

                                if (data.val[i - 1].stop === 'ВЫКЛ') {
                                    tt2.textContent = `Двигатель выключен`;
                                    tt1.textContent = ''
                                    dav = '-';
                                }
                                else {
                                    tt2.textContent = `Давление: Датчик не на связи`
                                    tt1.textContent = ''
                                    dav = '-'
                                }
                            }
                        }
                    }
                    else {
                        tt2.textContent = `Давление: ${d.value} Бар`
                        dav = d.value
                    }
                    if (d.tvalue === -0.5 && d.speed > 5) {
                        tt3.textContent = `Температура: Потеря связи с датчиком`
                        temp = '--'
                    }
                    else if (d.tvalue === -0.5 && d.speed <= 5 && d.stop == 'ВКЛ') {
                        for (let i = 0; i < data.val.length; i++) {
                            if (d.dates === data.val[i].dates) {
                                if (data.val[i - 1].stop === 'ВЫКЛ') {
                                    tt3.textContent = ``
                                    temp = '-'
                                }
                                else {
                                    tt3.textContent = `Давление: Датчик не на связи`
                                    tt1.textContent = ''
                                    dav = '-'
                                }
                            }
                        }
                    }
                    else if (d.stop == 'ВЫКЛ') {
                        tt3.textContent = ``
                        temp = '-'
                    }
                    else {
                        tt3.textContent = `Температура: ${d.tvalue} С°`
                        temp = d.tvalue
                    }
                    tt4.textContent = `Скорость: ${d.speed} км/ч`
                }
                tooltips.style.left = `${xPosition + 100}px`
                tooltips.style.top = `${yPosition + 100}px`
            })
            // Добавляем обработчик события mouseout, чтобы скрыть подсказку
            svg.on("mouseout", function (event, d) {
                const tooly = document.querySelectorAll('.tooly')
                tooltips.style.display = 'none'
                tooly.forEach(e => {
                    e.style.display = 'none'
                })
                const toolyStatic = document.querySelectorAll('.toolyStatic')
                toolyStatic.forEach(e => {
                    e.style.display = 'flex'
                })
            });
            svg.on("click", function (d) {
                const [xPosition, yPosition] = d3.mouse(this);
                // Определяем ближайшую точку на графике
                const bisect = d3.bisector(d => d.dates).right;
                const x0 = x.invert(xPosition);
                const i = bisect(data.val, x0, 1);
                const d0 = data.val[i - 1];
                const d1 = data.val[i];
                d = x0 - d0.dates > d1.dates - x0 ? d1 : d0;
                createMapsUniq([], d, 'bar')
                const act = document.querySelector('.activMenuGraf').textContent
                console.log(act)

                const graph = document.querySelector('.infoGraf')
                graph.addEventListener('click', function (event) {
                    event.stopPropagation(); // Остановка всплытия события, чтобы клик на графике не вызывал обработчик события click на document
                    //  createMapsUniq([], d, 'bar')
                });
                document.addEventListener('click', function (event) {
                    const targetElement = event.target;
                    const map = document.getElementById('mapOil');
                    const act = document.querySelector('.activMenuGraf').textContent;
                    const wrapMap = document.querySelector('.wrapMap')
                    if (wrapMap && !wrapMap.contains(targetElement) && act === 'Давление') {
                        wrapMap.remove();
                    }
                });
            })
        })
    }
    const legendBar = document.querySelectorAll('.legendBar')
    const labelPress = document.querySelector('.labelPress')
    const labelAllPress = document.querySelector('.labelAllPress')
    const combacks = document.querySelector('.comback')
    const inf = document.querySelector('.infos')
    new Tooltip(inf, ['График отражает давление и температуру по каждому колесу', 'Чтобы увеличить график, надо выделить область мышкой слева направо', 'Чтобы вернуть график в предыдущий масштаб, надо выделить область мышкой справа налево']);
    new Tooltip(labelPress, ['Включает подсветку графика относительно выставленных значений на ось']);
    new Tooltip(labelAllPress, ['Включает масштабирование всех графиков']);
    new Tooltip(combacks, ['Cбрасывает масштабирование']);
    new Tooltip(legendBar[0], ['Отключает и включает график давления']);
    new Tooltip(legendBar[1], ['Отключает и включает график температуры']);

    legendBar[0].addEventListener('click', () => {
        const line1 = d3.selectAll('.line1')
        const area1 = d3.selectAll('.area1')
        const area11 = d3.selectAll('.area11')
        const area12 = d3.selectAll('.area12')
        const legendBarCircle = d3.select('.barGraf')
        legendBar[0].classList.toggle('noActive')
        if (legendBar[0].classList.contains('noActive')) {
            legendBarCircle.attr('fill', 'none')
            line1.style("display", "none")
            area1.style("display", "none")
            area11.style("display", "none")
            area12.style("display", "none")
            return
        }
        legendBarCircle.attr('fill', 'darkgreen')
        line1.style("display", "block")
        area1.style("display", "block")
        area11.style("display", "block")
        area12.style("display", "block")
    })
    legendBar[1].addEventListener('click', () => {
        const line2 = d3.selectAll('.line2')
        const area2 = d3.selectAll('.area2')
        const legendBarCircle = d3.select('.tempGraf')
        legendBar[1].classList.toggle('noActive')
        if (legendBar[1].classList.contains('noActive')) {
            legendBarCircle.attr('fill', 'none')
            line2.style("display", "none")
            area2.style("display", "none")
            return
        }
        legendBarCircle.attr('fill', 'blue')
        line2.style("display", "block")
        area2.style("display", "block")
    })
    let num = 0;
    im1.forEach(e => {
        const tires = e.querySelectorAll('.tyresChart')
        tires[num].style.background = 'black'
        num++
        new Tooltip(e, [e.nextElementSibling.getAttribute('rel')]);
    })
    function globalTooltip(time) {
        const objTool = []
        dat2.forEach(e => {
            e.val.forEach(el => {
                if (el.dates.getTime() === time.getTime()) {
                    objTool.push({ sens: e.sens, value: el.value, tvalue: el.tvalue, speed: el.speed, time: el.dates })
                }
            })
        })
        const chart = document.querySelectorAll('.chart')
        char[char.length - 1].children[2].classList.add('last')
        char[char.length - 1].children[3].classList.add('last')
        const newObjTool = [];
        if (objTool.length > chart.length) {
            for (let i = 0; i <= objTool.length; i++) {
                if (i % 2 !== 0) {
                    newObjTool.push(objTool[i])
                }

            }
            let dav;
            let temp;
            for (let i = 0; i < chart.length; i++) {
                newObjTool[i].value === -0.5 ? dav = '-' : dav = newObjTool[i].value
                newObjTool[i].tvalue === -0.5 ? temp = '-' : temp = newObjTool[i].tvalue
                chart[i].children[2].textContent = `${dav} Бар/${temp} С°`
            }

        }
        else {
            let dav;
            let temp;
            for (let i = 0; i < chart.length; i++) {
                objTool[i].value === -0.5 ? dav = '-' : dav = objTool[i].value
                objTool[i].tvalue === -0.5 ? temp = '-' : temp = objTool[i].tvalue
                chart[i].children[2].textContent = `${dav} Бар/${temp} С°`
            }
        }

    }

}

function timeConvert(d) {
    const date = new Date(d);
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeString = `${month} ${day}, ${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
    return timeString;
}
async function iconChart() {
    const idw = document.querySelector('.color').id
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ idw }))
    }
    const res = await fetch('/api/modelView', param)
    const response = await res.json()
    return response.result
}

async function vieModelChart(model, im1) {
    model.sort((a, b) => parseInt(a.osi) - parseInt(b.osi));
    im1.forEach(it => {
        for (let i = 0; i < model.length; i++) {
            const os = document.createElement('div')
            os.classList.add('osChart')
            it.appendChild(os)
            const centerChartOs = document.createElement('div')
            centerChartOs.classList.add('centerChartOs')
            centerChartOs.setAttribute('rel', `${model[i].trailer}`)
            os.appendChild(centerChartOs)
            const tires = +model[i].tyres
            if (tires === 2) {
                for (let y = 0; y < tires; y++) {
                    const tyresOutside = document.createElement('div')
                    tyresOutside.classList.add('tyresChart')
                    os.appendChild(tyresOutside)
                }
                os.insertBefore(os.children[1], os.children[0])
            }
            else {
                for (let y = 0; y < tires; y++) {
                    const tyresOutside = document.createElement('div')
                    tyresOutside.classList.add('tyresChart')
                    os.appendChild(tyresOutside)
                }
                os.insertBefore(os.children[1], os.children[0])
                os.insertBefore(os.children[2], os.children[1])
                os.children[2].style.width = '4px'
            }
        }
    })
}



