
import { Tooltip } from '../../../class/Tooltip.js'
import { createMapsUniq } from '../../geo.js'

import { dataInfo, model } from '../../paramsTyresView.js'
let isCanceled = false;

export class PressureCharts {
    constructor(t1, t2) {
        this.t1 = t1
        this.t2 = t2
        this.data = null
        this.graf = null
        this.charts = null
        this.char = null
        this.x = null
        this.svgContainers = []
        this.svg = null
        this.init()
    }


    async init() {
        if (isCanceled) {
            return Promise.reject(new Error('Запрос отменен'));
        }
        isCanceled = true; // Устанавливаем флаг в значение true, чтобы прервать предыдущее выполнение
        this.data = await this.createStructura()
        console.log(this.data)
        if (this.data.length === 0) {
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
        this.createChart()
    }

    createChart() {
        this.createContainer()
        this.createLegend()
        this.createBodyCharts()
        this.createIconsCar()
        this.toggleChecked()
        const loaders = document.querySelector('.loaders_charts')
        loaders.style.display = 'none';
        isCanceled = false;

    }


    createBodyCharts() {
        const margin = { top: 100, right: 10, bottom: 30, left: 10 };
        const widthWind = document.querySelector('body').offsetWidth;
        const width = widthWind >= 860 ? 800 - margin.left - margin.right : widthWind - 80;
        const height = 50;
        const count = this.charts.size();

        const main = document.querySelector('.infoGraf')
        const tool = document.createElement('div')
        tool.classList.add('chart-tooltips')
        main.appendChild(tool)
        this.charts.each((d, i, nodes) => {
            // Используем nodes[i] для доступа к текущему элементу DOM
            const chartContainer = d3.select(nodes[i]);
            const data = d
            const isLastChart = i === count - 1;
            const he = isLastChart ? height + 30 : height;
            // Создаем контейнер для SVG
            const svgContainer = chartContainer.append('div')
                .attr('class', 'graf');
            // Создаем SVG внутри контейнера
            const svg = svgContainer.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr('height', he)
                .attr('rel', d.sens)
                .append("g")
                .attr("transform", `translate(${margin.left},0)`);

            // Добавляем статический индикатор инструментов с возможным классом 'last'
            chartContainer.append('div')
                .attr('class', `toolyStatic${isLastChart ? ' last' : ''}`)
                .text('-Бар/-С°');
            // задаем x-шкалу
            const x = d3.scaleTime()
                .domain(d3.extent(data.val, (d) => new Date(d.dates)))
                .range([0, width])
            this.x = x
            // задаем y-шкалу для первой оси y
            const y1 = d3.scaleLinear()
                .domain([0, 15])//d3.extent(data.val, (d) => d.value))
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

            // добавляем ось x
            svg.append("g")
                .attr("class", "osx")
                .attr("transform", "translate(" + 0 + "," + (height) + ")")
                .attr('height', 300)
                .transition()
                .duration(1000)
                .call(xAxis
                    .ticks(10)
                    .tickFormat(function (d) {
                        return d3.timeFormat("%H:%M")(d);
                    }))
            svg.append("g")
                .attr("transform", `translate(0, ${(height + 10)})`)
                .attr('class', 'osx2')
                .call(xAxis
                    //   .ticks(d3.timeHour.every(1))
                    .ticks(10)
                    .tickFormat(function (d) {
                        return d3.timeFormat("%d.%m")(d);
                    })
                )
                .style("stroke-width", 0)
            // добавляем первую ось y
            svg.append("g")
                .attr("class", "os1y")
            // добавляем вторую ось y
            svg.append("g")
                .attr("class", "os2y")
                .attr("transform", "translate(" + width + ", 0)")

            const legendBar = document.querySelectorAll('.legendBar')

            // добавляем области для первой кривой
            svg.append("path")
                .datum(data.val)
                .transition()
                .duration(1000)
                .attr("d", area1)
                .attr("fill", function (d) {
                    if (d3.select(".inputPress").property("checked")) {
                        return "darkgreen"
                    } else {
                        return "#009933";
                    }
                })
                .attr("class", "area1")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("fill-opacity", 1)
                .style('display', legendBar[0].classList.contains('noActive') ? 'none' : 'block')
            svg.append("path")
                .datum(data.val)
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
            svg.append("path")
                .datum(data.val)
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
                .attr("fill-opacity", d.value === -0.1 ? 0 : 0.9)
                .style('display', legendBar[0].classList.contains('noActive') ? 'none' : 'block')
            // добавляем области для второй кривой
            console.log(data.val)
            svg.append("path")
                .datum(data.val)
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
            this.svgContainers.push([svgContainer, svg, x, y1, y2, height, data])
            this.createTooltip(svgContainer, svg, data.val, x)
        });

    }
    setupZoom() {
        const isChecked = document.querySelector('.inputAllPress').checked;
        // Создаем единый экземпляр d3.zoom
        const zoom = d3.zoom()
            .scaleExtent([1, 10])
            .on("zoom", () => {
                const transform = d3.event.transform;
                // В зависимости от состояния чекбокса, применяем масштабирование
                this.svgContainers.forEach(([container, svg, x, y1, y2, height, data]) => {
                    if (isChecked) {
                        // Применяем единое масштабирование ко всем графикам
                        const newX = transform.rescaleX(x);
                        this.zoomed(svg, newX, y1, y2, height, data, container);
                    } else {
                        // Применяем индивидуальное масштабирование, если контейнер активен (с курсором)
                        if (d3.select(d3.event.sourceEvent.target).node().closest('.graf') === container.node()) {
                            const newX = transform.rescaleX(x);
                            this.zoomed(svg, newX, y1, y2, height, data, container);
                        }
                    }
                });
            });
        // Применяем настройку масштабирования к каждому графику
        this.svgContainers.forEach(([container]) => container.call(zoom));
        // Применяем настройку масштабирования к каждому графику
        d3.selectAll('.graf').call(zoom);
    }
    // Метод для инициализации слушателя на чекбокс
    toggleChecked() {
        document.querySelector('.inputAllPress').addEventListener('change', this.setupZoom.bind(this));
        this.setupZoom(); // Вызываем сразу, чтобы установить начальное состояние
        document.querySelector('.comback').addEventListener('click', () => {
            this.resetZoom();
        });
    }
    resetZoom() {
        this.svgContainers.forEach(([container, svg, x, y1, y2, height, data]) => {
            this.zoomed(svg, x, y1, y2, height, data, container);
        });
    }
    zoomed(svg, newX, y1, y2, height, data, svgContainer) {
        requestAnimationFrame(() => {
            svg.select(".osx").call(d3.axisBottom(newX).tickFormat(d3.timeFormat("%H:%M")));
            svg.select(".osx2").call(d3.axisBottom(newX).tickFormat(d3.timeFormat("%d.%m")));

            // Обновляем области и линии
            const updateArea1 = d3.area()
                .x(d => newX(new Date(d.dates)))
                .y0(height)
                .y1(d => y1(d.value))
                .curve(d3.curveStep);
            svg.selectAll(".area1").attr('d', updateArea1(data.val));

            const updateArea11 = d3.area()
                .x(d => newX(new Date(d.dates)))
                .y0(height)
                .y1(d => d.value > data.bar.knd && d.value <= data.bar.dnn || d.value > data.bar.dvn && d.value <= data.bar.kvd ? y1(d.value) : height)
                .curve(d3.curveStep);
            svg.selectAll(".area11").attr('d', updateArea11(data.val));

            const updateArea12 = d3.area()
                .x(d => newX(new Date(d.dates)))
                .y0(height)
                .y1(d => d.value <= data.bar.knd || d.value >= data.bar.kvd ? y1(d.value) : height)
                .curve(d3.curveStep);
            svg.selectAll(".area12").attr('d', updateArea12(data.val));

            const updateArea2 = d3.area()
                .x(d => newX(new Date(d.dates)))
                .y0(height)
                .y1(d => y2(d.tvalue))
                .curve(d3.curveStep);
            svg.selectAll(".area2").attr('d', updateArea2(data.val));

            this.createTooltip(svgContainer, svg, data.val, newX);
        });
    }

    createTooltip(svgContainer, svg, datasets, xScaleStart) {
        const tooltip = this.graf.querySelector(".chart-tooltips");
        svgContainer.on('mouseout', () => {
            tooltip.style.display = 'none';
            const icon = svg.node().closest('.chart').firstElementChild
            icon.style.border = '1px solid black'
        }).on('mousemove', function () {
            this.handleMouseMove(datasets, xScaleStart, tooltip, svg.node());
        }.bind(this))
            .on('click', function () { this.handleMouseClick(datasets, xScaleStart, svg.node()) }.bind(this))
    }

    handleMouseClick(datasets, xScaleStart, svgElement) {
        const [xPosition, yPosition] = d3.mouse(svgElement);
        const closestIndex = this.findClosestDataIndex(xPosition, datasets, xScaleStart);
        createMapsUniq([], closestIndex[2], 'bar')
        const graph = document.querySelector('.infoGraf')
        graph.addEventListener('click', function (event) {
            event.stopPropagation(); // Остановка всплытия события, чтобы клик на графике не вызывал обработчик события click на document
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
    }
    handleMouseMove(datasets, xScaleStart, tooltip, svgElement) {
        const event = d3.event;
        const [xPosition, yPosition] = d3.mouse(svgElement);
        const closestIndex = this.findClosestDataIndex(xPosition, datasets, xScaleStart);

        const tooltipData = datasets[closestIndex[1]]
        const formattedDate = this.timeFormats(closestIndex[0])
        tooltip.innerHTML = `<div class="title_tooltip">${formattedDate}</div>
            <div class="body_tooltips"><i class='fas fa-tachometer-alt icon_tool'><span class='spanVal'>${tooltipData.speed} км/ч</span></i>
            <i class='fas fa-life-ring icon_tool'><span class='spanVal'>${tooltipData.value === -0.1 ? 'Потеря связи с датчиком' : tooltipData.value} Бар</span></i>
            <i class='fas fa-temperature-high icon_tool'><span class='spanVal'>${tooltipData.tvalue === -0.1 ? 'Потеря связи с датчиком' : tooltipData.tvalue} t°</span></i>
            <i class='fas fa-key icon_tool'><span class='spanVal'>${tooltipData.stop}</span></i> </div>`
        const xPositionk = event.pageX; // Используйте абсолютные координаты
        const yPositionk = event.pageY; // Используйте абсолютные координаты
        tooltip.style.left = `${xPositionk - 730}px`;
        tooltip.style.top = `${yPositionk - 150}px`;
        tooltip.style.display = 'flex';
        const icon = svgElement.closest('.chart').firstElementChild
        icon.style.border = '2px solid rgba(6, 28, 71, 1)'

        this.globalTooltip(closestIndex[0])

    }

    findClosestDataIndex(xPosition, data, xScaleStart) {
        const x0 = xScaleStart.invert(xPosition); // Invert the xPosition to a date
        const times = data.map(d => new Date(d.dates).getTime()); // Convert dates to timestamps for comparison
        const bisector = d3.bisector(d => d).left;
        let index = bisector(times, x0);
        if (times[index] === x0.getTime()) {
            console.log("Exact match found");
            return [data[index].dates, index, data[index]];
        }
        const leftIndex = index - 1 < 0 ? 0 : index - 1;
        const rightIndex = index >= times.length ? times.length - 1 : index;
        const leftDiff = Math.abs(x0.getTime() - times[leftIndex]);
        const rightDiff = Math.abs(times[rightIndex] - x0.getTime());
        if (leftDiff <= rightDiff) {
            return [data[leftIndex].dates, leftIndex, data[leftIndex]];
        } else {
            return [data[rightIndex].dates, rightIndex, data[rightIndex]];
        }
    }
    globalTooltip(time) {
        const objTool = [];
        this.data.forEach(e => {
            // Находим элемент, соответствующий указанному времени
            const foundEl = e.val.find(el => el.dates.getTime() === time.getTime());
            if (foundEl) {
                objTool.push({
                    sens: e.sens,
                    value: foundEl.value,
                    tvalue: foundEl.tvalue,
                    speed: foundEl.speed,
                    time: foundEl.dates
                });
            }
        });
        const chart = document.querySelectorAll('.chart')
        chart.forEach((chartItem, i) => {
            // Защита на случай, если objTool не содержит запись для каждого элемента chart
            const tooltipData = objTool[i] || { value: -0.1, tvalue: -0.1 }; // Значение по умолчанию, если не найдено
            const dav = tooltipData.value === -0.1 ? '-' : tooltipData.value;
            const temp = tooltipData.tvalue === -0.1 ? '-' : tooltipData.tvalue;
            chartItem.children[2].textContent = `${dav} Бар/${temp} С°`;
        });
    }

    timeFormats(closestIndex) {
        const unix = Math.floor(new Date(closestIndex).getTime() / 1000)
        const date = new Date(unix * 1000);
        const day = date.getDate().toString().padStart(2, '0'); // Добавляем ведущий ноль для дня
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Добавляем ведущий ноль для месяца
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0'); // Добавляем ведущий ноль для часов
        const minutes = date.getMinutes().toString().padStart(2, '0'); // Добавляем ведущий ноль для минут
        const seconds = date.getSeconds().toString().padStart(2, '0'); // Добавляем ведущий ноль для секунд
        const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
        return formattedDate
    }
    createIconsCar() {
        this.char = this.graf.querySelectorAll('.chart')
        const im1 = [... this.char].map(e => {
            const div = document.createElement('div')
            div.classList.add('im1')
            e.prepend(div)
            return div
        })
        this.char[this.char.length - 1].children[0].classList.add('last')
        model.result.sort((a, b) => parseInt(a.osi) - parseInt(b.osi));
        im1.forEach((it, index) => {
            model.result.forEach(({ trailer, tyres }) => {
                const osElement = this.createOsElement(trailer, +tyres);
                it.appendChild(osElement);
            });
            // Находим все колеса в текущем it и красим в черный цвет колесо по индексу, равному остатку от деления индекса it на количество колес в it
            const tyres = it.querySelectorAll('.tyresChart');
            if (tyres.length > 0) {
                const tyreToColorIndex = index % tyres.length; // Используем остаток от деления для циклического выбора колеса
                tyres[tyreToColorIndex].style.background = 'black';
            }
            // Добавляем подсказку только к элементу с черным колесом
            new Tooltip(it, [it.nextElementSibling.children[0].getAttribute('rel')]);
        });
    }
    // Функция для создания элемента 'osChart' и его содержимого
    createOsElement(trailer, tires) {
        const os = document.createElement('div');
        os.classList.add('osChart');
        const centerChartOs = document.createElement('div');
        centerChartOs.classList.add('centerChartOs');
        centerChartOs.setAttribute('rel', trailer);
        // Добавляем в начало, чтобы избежать лишних операций с DOM позже
        os.appendChild(centerChartOs);
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
        return os;
    }

    createContainer() {
        this.graf = document.createElement('div')
        const grafics = document.querySelector('.grafics')
        this.graf.classList.add('infoGraf')
        grafics.appendChild(this.graf)
        const info = document.createElement('div')
        info.classList.add('infos')
        this.graf.prepend(info)
        const container = d3.select(this.graf);
        // Связываем данные с контейнером
        this.charts = container.selectAll('.charts')
            .data(this.data)
            .enter()
            .append('div')
            .attr('class', 'chart');

    }

    createLegend() {
        const tooltips = document.createElement('div')
        tooltips.classList.add('tooltips')
        const titleGraf = document.createElement('div')
        tooltips.classList.add('tooltips')
        titleGraf.classList.add('titleGraf')
        this.graf.prepend(titleGraf)
        titleGraf.textContent = 'Давление/Температура'
        const checkGraf = document.createElement('div')
        checkGraf.classList.add('checkGraf')
        titleGraf.appendChild(checkGraf)
        checkGraf.innerHTML = `<input class="inputPress" id="inputPress" type="checkbox">
<label for="inputPress" class="labelPress">Подсветка графика</label>
<input class="inputAllPress" id="inputAllPress" type="checkbox" checked>
<label for="inputAllPress"class="labelAllPress" > Общее масштабирование</label>
  <div class="comback">Масштаб по умолчанию</div></div>`;
        this.graf.appendChild(tooltips)
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

        const legendBar = this.graf.querySelectorAll('.legendBar')
        const labelPress = this.graf.querySelector('.labelPress')
        const labelAllPress = this.graf.querySelector('.labelAllPress')
        const combacks = this.graf.querySelector('.comback')
        const inf = this.graf.querySelector('.infos')
        new Tooltip(inf, ['График отражает давление и температуру по каждому колесу']);
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
            }
            else {
                legendBarCircle.attr('fill', 'darkgreen')
                line1.style("display", "block")
                area1.style("display", "block")
                area11.style("display", "block")
                area12.style("display", "block")
            }

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
            }
            else {
                legendBarCircle.attr('fill', 'blue')
                line2.style("display", "block")
                area2.style("display", "block")
            }

        })
    }

    async createStructura() {
        const [params, tyres, osibar] = dataInfo
        // Преобразование массива osss в объект для быстрого доступа
        const osssMap = {};
        osibar.forEach(e => {
            osssMap[e.idOs] = e;
        });
        const idw = Number(document.querySelector('.color').id)
        console.log(idw)
        const t1 = this.t1
        const t2 = this.t2 + 86399
        const paramss = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw, t1, t2 }))
        }
        const res = await fetch('/api/getDataParamsInterval', paramss)
        const data = await res.json();
        console.log(data)
        if (data.length === 0) {
            document.querySelector('.noGraf').style.display = 'block'
            const grafOld = document.querySelector('.infoGraf')
            if (grafOld) {
                grafOld.remove()
            }
            const loaders = document.querySelector('.loaders_charts')
            loaders.style.display = 'none';
            isCanceled = false;
            return []
        }
        document.querySelector('.noGraf').style.display = 'none'


        const paramnew = tyres.map(el => {
            if (osssMap[el.osNumber]) {
                const sens = params.find(it => Object.values(it).includes(el.pressure));
                if (!sens) return
                return {
                    sens: sens.sens,
                    position: Number(el.tyresdiv),
                    parametr: el.pressure,
                    bar: osssMap[el.osNumber],
                    val: data.map(elem => {
                        return ({
                            dates: new Date(Number(elem.last_valid_time) * 1000),
                            geo: [Number(elem.lat), Number(elem.lon)],
                            speed: Number(elem.speed),
                            stop: Number(elem.engineOn) === 1 ? 'ВКЛ' : 'ВЫКЛ',
                            value: elem[el.pressure] ? Number(elem[el.pressure]) : -0.1,
                            tvalue: elem[el.temp] ? (Number(elem[el.temp]) !== -128 && Number(elem[el.temp]) !== -50 && Number(elem[el.temp]) !== -51 ? Number(elem[el.temp]) : -0.1) : -0.1
                        })
                    })
                };
            }
        }).filter(el => el !== undefined)
        paramnew.sort((a, b) => a.position - b.position)
        paramnew.forEach(e => e.val.sort((a, b) => {
            if (a.dates > b.dates) {
                return 1;
            }
            if (a.dates < b.dates) {
                return -1;
            }
            return 0;
        }))

        return paramnew
    }

}