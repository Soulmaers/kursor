import { Tooltip } from '../../class/Tooltip.js'
import { createMapsUniq } from '../geo.js'

let isCanceled = false;
export class OilCharts {
    constructor(t1, t2) {
        this.t1 = t1
        this.t2 = t2
        this.data = null
        this.objOil = null
        this.graf = null
        this.svg = null
        this.width = null
        this.height = null
        this.chartGroup = null
        this.x = null
        this.y1 = null
        this.y2 = null
        this.tooltip = null
        this.new_xScale = null
        this.init()

    }
    async init() {
        if (isCanceled) {
            return Promise.reject(new Error('Запрос отменен'));
        }
        isCanceled = true; // Устанавливаем флаг в значение true, чтобы прервать предыдущее выполнение
        this.data = await this.createStructura()
        this.objOil = this.findMarkerReFill()
        console.log(this.objOil)
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
        this.createIcons()
        // this.toggleChecked()
        const loaders = document.querySelector('.loaders_charts')
        loaders.style.display = 'none';
        isCanceled = false;

    }

    createIcons() {
        const tooltipOil = this.chartGroup.append("text")
            .attr("class", "tooltipIcon")
            .style("opacity", 0);
        this.chartGroup.selectAll("image")
            .remove();

        const self = this
        this.chartGroup.selectAll("image")
            .data(this.objOil)
            .enter()
            .append("image")
            .attr('class', 'iconOil')
            .attr("x", d => this.new_xScale ? this.new_xScale(new Date(d.data)) : this.x(new Date(d.data)))
            .attr("xlink:href", "../../../image/ref.png") // путь к иконке
            .attr("width", 24) // ширина вашей иконки
            .attr("height", 24) // высота вашей иконки
            .style("opacity", 0.5)
            .attr("transform", "translate(-12,0)")
            .on("click", function (d) { self.click(d) })
            .on("mousemove", function (d) { self.mousemove(d, tooltipOil) })
            .on("mouseout", function (d) { self.mouseout(tooltipOil) })
    }

    createTooltip() {
        const self = this
        this.svg.on("mousemove", function (d) { self.toolMousemove(d) })
            .on("mouseout", function (d) { self.toolMouseout(d) })

    }
    toolMouseout(d) {
        const tooltip = d3.select('.tooltip')
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    }
    toolMousemove(d) {
        console.log(this.new_xScale)
        // Определяем координаты курсора в отношении svg
        const [xPosition, yPosition] = d3.mouse(this.svg.node());
        // Определяем ближайшую точку на графике
        const bisect = d3.bisector(d => d.time).right;
        const x0 = this.new_xScale ? this.new_xScale.invert(xPosition) : this.x.invert(xPosition)
        const i = bisect(this.data, x0, 1);
        const d0 = this.data[i - 1];
        const d1 = this.data[i];
        d = x0 - d0.time > d1.time - x0 ? d1 : d0;

        const selectedTime = this.timeConvert(d.time)
        // Отображаем подсказку с координатами и значениями по оси y
        let oilTool;
        d.oil === 0 ? oilTool = 'Нет данных' : oilTool = d.oil
        this.tooltip
            .style("left", `${xPosition + 100}px`)
            .style("top", `${yPosition + 100}px`)
            .style("display", "block")
            .html(`Время: ${(selectedTime)}<br/>Топливо: ${oilTool}<br/>Бортовое питание: ${d.pwr}`)
            .transition()
            .duration(200)
            .style("opacity", 0.9);
    }



    timeConvert(d) {
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
    mouseout(tooltipOil) {
        tooltipOil.transition()
            .duration(200)
            .style("opacity", 0);
    }
    mousemove(d, tooltipOil) {
        d3.select('.tooltip')
            .style("opacity", 0)
        tooltipOil.transition()
            .duration(200)
            .style("opacity", 1);
        tooltipOil.attr("x", this.x(new Date(d.data)) - 40)
            .attr("y", 35)
            .attr("text-anchor", "middle")
            .text(`Заправка: ${d.zapravka} л.`)
    }


    click(d) {
        const clickedElement = d3.event.currentTarget;
        // Получаем ссылку на карту и обертку карты
        const mapss = document.getElementById('mapOil');
        const wrapMap = document.querySelector('.wrapMap');
        // Проверяем, был ли уже активен кликнутый элемент
        if (d3.select(clickedElement).classed('clickOil')) {
            // Если да, убираем карту и сбрасываем состояние иконки
            if (wrapMap) wrapMap.remove();
            if (mapss) mapss.remove();
            d3.select(clickedElement).style("opacity", 0.5).classed('clickOil', false);
            return; // Прекращаем выполнение функции
        }
        // Продолжаем с остальной логикой, если элемент не был активен
        const icons = d3.selectAll('.iconOil');
        icons.style("opacity", 0.5).classed('clickOil', false);
        // Удаляем предыдущие карты, если они есть
        if (wrapMap) wrapMap.remove();
        if (mapss) mapss.remove();
        // Делаем активной текущую иконку
        d3.select(clickedElement).style("opacity", 1).classed('clickOil', true);
        // Создаем карту для текущего элемента
        createMapsUniq([], d, 'oil')
        // Добавляем обработчик клика на график, чтобы предотвратить всплытие и случайное закрытие карты
        this.graf.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }

    createBodyCharts() {
        console.log(this.height)
        // задаем x-шкалу
        const x = d3.scaleTime()
            .domain(d3.extent(this.data, (d) => new Date(d.time)))
            .range([0, this.width])
        this.x = x
        // задаем y-шкалу для первой оси y
        const y1 = d3.scaleLinear()
            .domain([0, d3.max(this.data, (d) => d.oil)])
            .range([(this.height - 40), 0]);
        this.y1 = y1
        // задаем y-шкалу для второй оси y
        const y2 = d3.scaleLinear()
            .domain(d3.extent(this.data, (d) => d.pwr))
            .range([(this.height - 40), 0]);
        this.y2 = y2
        const yAxis1 = d3.axisLeft(y1)
        const yAxis2 = d3.axisLeft(y2)
        const xAxis = d3.axisBottom(x)

        const line1 = d3.line()
            .x((d) => x(new Date(d.time)))
            .y((d) => y1(d.oil))
            .curve(d3.curveStepAfter);
        const line2 = d3.line()
            .x((d) => x(new Date(d.time)))
            .y((d) => y2(d.pwr))
            .curve(d3.curveStepAfter);

        const area1 = d3.area()
            .x(d => x(new Date(d.time)))
            .y0(this.height)
            .y1(d => y1(d.oil))
            .curve(d3.curveStepAfter);

        const area2 = d3.area()
            .x(d => x(new Date(d.time)))
            .y0(this.height)
            .y1(d => y2(d.pwr))
            .curve(d3.curveStepAfter);

        this.svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("class", "clipart")
            .attr("width", this.width) // or the width of your chart area
            .attr("height", this.height)//390)// or the height of your chart area
            .attr('x', 0)
            .attr('y', 0)

        const chartGroup = this.svg.append("g")
            .attr("clip-path", "url(#clip)");
        this.chartGroup = chartGroup
        // добавляем ось x
        this.svg.append("g")
            .attr("class", "osx")
            .attr("clip-path", "url(#clip)")
            .attr("transform", "translate(0," + this.height + ")")
            .call(xAxis
                .ticks(10)
                .tickFormat(function (d) {
                    return d3.timeFormat("%H:%M")(d);
                }))


        this.svg.append("g")
            .attr("transform", `translate(0, ${(this.height + 10)})`)
            .attr('class', 'osx2')
            .attr("clip-path", "url(#clip)")
            .call(xAxis
                .ticks(10)
                .tickFormat(function (d) {
                    return d3.timeFormat("%d.%m")(d);
                })
            )
            .style("stroke-width", 0)
        // добавляем первую ось y
        this.svg.append("g")
            .attr("class", "os1y")
            .call(yAxis1)
            .attr("transform", "translate(0, " + (40) + ")")
        //  .attr("transform", "translate(" + 0 + "," + (margin.top + 40) + ")"); //Сдвигаем вниз на высоту иконки
        // добавляем вторую ось y
        this.svg.append("g")
            .attr("class", "os2y")
            .attr("transform", "translate(" + this.width + ", 40)")
            .call(yAxis2)
            .selectAll(".tick text")
            .attr("x", '15')
            .style("text-anchor", "start")


        // добавляем линии для первой оси y
        chartGroup.append("path")
            .datum(this.data)
            .attr("class", "line1")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)
            .attr("d", line1)
            .attr("transform", "translate(0, " + (40) + ")")
        // добавляем линии для второй оси y
        chartGroup.append("path")
            .datum(this.data)
            .attr("class", "line2")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("d", line2)
            .attr("transform", "translate(0, " + (40) + ")")
        // добавляем области для первой кривой

        chartGroup.append("path")
            .datum(this.data)
            .attr("class", "area1")
            .attr("d", area1)
            .attr("fill", "blue")
            .attr("fill-opacity", 0.5)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("transform", "translate(0, " + (40) + ")")

        // добавляем области для второй кривой
        chartGroup.append("path")
            .datum(this.data)
            .attr("class", "pat")
            .attr("class", "area2")
            .attr("fill", "#32a885")
            .attr("stroke", "black")
            .attr("fill-opacity", 0.2)
            .attr("stroke-width", 1)
            .attr("d", area2)
            .attr("transform", "translate(0, " + (40) + ")")

        this.svg.append("text")
            .attr("class", 'obv')
            .attr("x", -130)
            .attr("y", -35)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "end")
            .text("Объем, л");
        this.svg.append("text")
            .attr("class", 'napr')
            .attr("x", -100)
            .attr("y", this.width + 50)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "end")
            .text("Напряжение, В")

        chartGroup.call(d3.zoom().on("zoom", this.zoomed.bind(this)))
        this.createTooltip()
    }
    zoomed() {
        const transform = d3.event.transform;
        // Масштабируем оси с помощью текущего масштабного коэффициента
        const new_xScale = transform.rescaleX(this.x);
        this.new_xScale = new_xScale
        this.svg.select(".osx").call(d3.axisBottom(new_xScale).tickFormat(d3.timeFormat("%H:%M")));
        this.svg.select(".osx2").call(d3.axisBottom(new_xScale).tickFormat(d3.timeFormat("%d.%m")));

        // Обновляем оси с новыми масштабами
        this.svg.select(".osx").call(d3.axisBottom(new_xScale)
            .ticks(10)
            .tickFormat(function (d) {
                return d3.timeFormat("%H:%M")(d);
            })
            .scale(new_xScale));
        this.svg.select(".osx2").call(d3.axisBottom(new_xScale)
            .ticks(10)
            .tickFormat(function (d) {
                return d3.timeFormat("%d.%m")(d);
            })
            .scale(new_xScale));
        // Обновляем пути линий и областей
        const updateLine1 = d3.line()
            .x((d) => new_xScale(new Date(d.time)))
            .y((d) => this.y1(d.oil))
            .curve(d3.curveStepAfter);

        const updateLine2 = d3.line()
            .x((d) => new_xScale(new Date(d.time)))
            .y((d) => this.y2(d.pwr))
            .curve(d3.curveStepAfter);

        const updateArea1 = d3.area()
            .x(d => new_xScale(new Date(d.time)))
            .y0(this.height)
            .y1(d => this.y1(d.oil))
            .curve(d3.curveStepAfter);

        const updateArea2 = d3.area()
            .x(d => new_xScale(new Date(d.time)))
            .y0(this.height)
            .y1(d => this.y2(d.pwr))
            .curve(d3.curveStepAfter);

        d3.select('.line1').attr('d', updateLine1(this.data));
        d3.select('.area1').attr('d', updateArea1(this.data));
        d3.select('.line2').attr('d', updateLine2(this.data));
        d3.select('.area2').attr('d', updateArea2(this.data));
        this.createIcons()
        this.createTooltip()
    }

    createLegend() {
        const titleGraf = document.createElement('div')
        titleGraf.classList.add('titleGraf')
        this.graf.prepend(titleGraf)
        titleGraf.textContent = 'Топливо/Бортовое питание'

        const svgLegend = d3.select('.titleGraf')
        const svga = svgLegend.append('svg')
            .attr("width", 350)
            .attr('height', 40)
            .append("g")
            .attr("transform", "translate(" + -180 + "," + 40 + ")")

        // добавляем подпись первой кривой
        svga.append("circle")
            .attr('class', 'legendOilcircle')
            .attr("r", 6)
            .attr("cx", 200)
            .attr("cy", -20)
            .attr("fill", "blue")
            .attr('stroke', 'black')

        svga.append("text")
            .attr('class', 'legendOil')
            .attr("x", 290)
            .attr("y", -15)
            .style("text-anchor", "end")
            .text("Топливо")
            .attr("fill", "black");

        // добавляем подпись второй кривой
        svga.append("circle")
            .attr('class', 'legendVoltcircle')
            .attr("r", 6)
            .attr("cx", 320)
            .attr("cy", -20)
            .attr("fill", "#32a885")
            .attr('stroke', 'black')
            .attr('opacity', 0.3)

        svga.append("text")
            .attr('class', 'legendOil')
            .attr("x", 495)
            .attr("y", -15)
            .style("text-anchor", "end")
            .text("Бортовое питание")
            .attr("fill", "black");

        const legendOil = document.querySelectorAll('.legendOil')
        const inf = document.querySelector('.infos')
        new Tooltip(inf, ['График отражает топливо и бортовое питание']);
        new Tooltip(legendOil[0], ['Отключает и включает график топливо']);
        new Tooltip(legendOil[1], ['Отключает и включает график бортовое питание']);
        console.log(legendOil[0])
        legendOil[0].addEventListener('click', () => {
            console.log('нажал топливо')
            const os1y = d3.select('.os1y')
            const line1 = d3.select('.line1')
            const area1 = d3.select('.area1')
            const area11 = d3.select('.area11')
            const obv = d3.select('.obv')
            const legendOilcircle = d3.select('.legendOilcircle')

            legendOil[0].classList.toggle('noActive')
            if (legendOil[0].classList.contains('noActive')) {
                console.log('удаляем легенда топливо')
                legendOilcircle.attr('fill', 'none')
                os1y.style("display", "none")
                line1.style("display", "none")
                area1.style("display", "none")
                area11.style("display", "none")
                obv.style("display", "none")
                return
            }
            legendOilcircle.attr('fill', 'blue')
            os1y.style("display", "block")
            line1.style("display", "block")
            area1.style("display", "block")
            area11.style("display", "block")
            obv.style("display", "block")
        })
        legendOil[1].addEventListener('click', () => {
            const os2y = d3.select('.os2y')
            const line2 = d3.select('.line2')
            const area2 = d3.select('.area2')
            const napr = d3.select('.napr')
            const legendVoltcircle = d3.select('.legendVoltcircle')
            legendOil[1].classList.toggle('noActive')
            if (legendOil[1].classList.contains('noActive')) {
                console.log('удаляем легенда напряжение')
                legendVoltcircle.attr('fill', 'none')
                os2y.style("display", "none")
                line2.style("display", "none")
                area2.style("display", "none")
                napr.style("display", "none")
                return
            }
            legendVoltcircle.attr('fill', '#32a885')
            os2y.style("display", "block")
            line2.style("display", "block")
            area2.style("display", "block")
            napr.style("display", "block")
        })

    }
    createContainer() {
        this.graf = document.createElement('div')
        const grafics = document.querySelector('.grafics')
        this.graf.classList.add('infoGraf')
        grafics.appendChild(this.graf)
        const info = document.createElement('div')
        info.classList.add('infos')
        this.graf.prepend(info)

        var widthWind = document.querySelector('body').offsetWidth;
        const wrapper = grafics.offsetWidth
        // устанавливаем размеры контейнера
        const margin = { top: 10, right: 60, bottom: 50, left: 60 },
            width = widthWind >= 860 ? wrapper - 250 : widthWind - 80,
            height = 500 - margin.top - margin.bottom;
        this.width = width
        this.height = height
        // создаем svg контейнер
        this.svg = d3.select(".infoGraf").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        console.log(this.height)
        // Инициализация тултипа один раз в конструкторе или инициализирующем методе
        this.tooltip = d3.select(".infoGraf").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("display", "none"); // Скрыть тултип при инициализации

    }
    findMarkerReFill() {
        const dat = [...this.data];
        for (let i = 0; i < dat.length - 1; i++) {
            if (dat[i].oil === dat[i + 1].oil) {
                dat.splice(i, 1);
                i--; // уменьшаем индекс, чтобы не пропустить следующий объект после удаления
            }
        }
        const increasingIntervals = [];
        let start = 0;
        let end = 0;
        for (let i = 0; i < dat.length - 1; i++) {
            const currentObj = dat[i];
            const nextObj = dat[i + 1];
            if (currentObj.oil < nextObj.oil) {
                if (start === end) {
                    start = i;
                }
                end = i + 1;
            } else if (currentObj.oil > nextObj.oil) {
                if (start !== end) {
                    increasingIntervals.push([dat[start], dat[end]]);
                }
                start = end = i + 1;
            }
        }
        if (start !== end) {
            increasingIntervals.push([dat[start], dat[end]]);
        }

        const zapravkaAll = increasingIntervals.filter((interval, index) => {
            const firstOil = interval[0].oil;
            const lastOil = interval[interval.length - 1].oil;
            const difference = lastOil - firstOil;
            const threshold = firstOil * 0.15;
            if (index < increasingIntervals.length - 1) {
                const nextInterval = increasingIntervals[index + 1];
                const currentTime = interval[interval.length - 1].time;
                const nextTime = nextInterval[0].time;
                const timeDifference = nextTime - currentTime;
                if (timeDifference < 5 * 60 * 1000) {
                    interval.push(nextInterval[nextInterval.length - 1]);
                    interval.splice(1, 1)
                }
            }
            return firstOil > 5 && difference > 40 && difference >= threshold;
        });
        for (let i = 0; i < zapravkaAll.length - 1; i++) {
            if (zapravkaAll[i][1].time === zapravkaAll[i + 1][1].time) {
                zapravkaAll.splice(i + 1, 1);
            }
        }

        const zapravka = zapravkaAll.filter(e => e[0].pwr >= 11 || e[0].pwr == null);
        const filteredZapravka = zapravka.filter(e => {
            const time0 = (e[0].time).getTime() / 1000;
            const time1 = (e[1].time).getTime() / 1000;
            const initTime = time1 - time0;
            console.log(initTime)
            const diff = e[1].oil - e[0].oil
            return initTime >= 5 * 60 && diff > 40;
        });
        const rash = [];
        const firstData = this.data[0].oil;
        const lastData = this.data[this.data.length - 1].oil;
        if (filteredZapravka.length !== 0) {
            rash.push(firstData - filteredZapravka[0][0].oil);
            for (let i = 0; i < filteredZapravka.length - 1; i++) {
                rash.push(filteredZapravka[i][1].oil - filteredZapravka[i + 1][0].oil);
            }
            rash.push(filteredZapravka[filteredZapravka.length - 1][1].oil - lastData);
        }
        else {
            rash.push(firstData - lastData)
        }

        const rashod = rash.reduce((el, acc) => el + acc, 0)
        const objOil = filteredZapravka.reduce((result, it) => {
            const oilValue = it[1].oil - it[0].oil;
            if (oilValue > 10) {
                const date = new Date(it[0].time);
                const day = date.getDate();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

                result.push({
                    data: it[0].time,
                    geo: it[0].geo,
                    zapravka: oilValue,
                    time: formattedDate,
                    icon: "../../../image/refuel.png"
                });
            }
            return result;
        }, []);
        return objOil
    }

    async createStructura() {

        const idw = Number(document.querySelector('.color').id)
        const t1 = this.t1
        const t2 = this.t2
        const paramss = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw, t1, t2 }))
        }
        const res = await fetch('/api/getDataParamsInterval', paramss)
        const data = await res.json();
        const newGlobal = data.map(it => {
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
                engineOn: Number(it.engineOn),
                summatorOil: it.summatorOil ? Number(it.summatorOil) : null
            }
        })
        newGlobal.sort((a, b) => a.time - b.time)
        if (data.length === 0) {
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
        return newGlobal
    }
}