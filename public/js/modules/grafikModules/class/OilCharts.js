import { Tooltip } from '../../../class/Tooltip.js'
import { GeoCreateMapsMini } from '../../geoModules/class/GeoCreateMapsMini.js'
import { Request } from './Request.js'

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
        this.parametr = null
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
        this.struktura = await this.createStructura() //получение и подготовка структуры данных
        this.filtration = await this.getFilter()


        this.data = this.runFormula(this.medianFilters())

        this.derivative = this.addDerivative(this.data)
        this.chartDerivative()
        console.log(this.derivative)
        this.average = this.runFormula(this.filtersOil())
        //   console.log(this.struktura)

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
        this.objOil = await this.findMarkerReFill() //поиск заправок
        //  console.log(this.objOil)
        this.createChart()


    }
    async getFilter() {
        const idw = Number(document.querySelector('.color').id)
        const param = 'oil'
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ idw, param })
        }
        const res = await fetch('api/getConfigParam', params)
        const result = await res.json()
        console.log(result)
        return result
    }
    filtersOil() {
        const koef = Number(this.filtration[0].dopValue)
        const average = this.struktura
            .filter(e => Number(e.dut) < 4097)
            .map(it => ({
                ...it,
                dut: Number(it.dut)
            }));
        for (let i = koef; i < average.length; i++) {
            const previousElements = average.slice(i - koef, i + 1);
            const validPreviousElements = previousElements.filter(val =>
                val.dut !== undefined &&
                !isNaN(val.dut)
            );
            if (validPreviousElements.length > 0) {
                const sum = validPreviousElements.reduce((acc, val) => acc + Number(val.dut), 0);
                const averages = sum / validPreviousElements.length;
                average[i].dut = Math.round(averages); // Округляем
            } else {
                average[i].dut = 0;
            }
        }
        return average
    }

    addDerivative(data) {
        // Проверяем, что массив не пуст и содержит хотя бы два элемента
        if (data.length < 2) {
            return data;
        }
        // Добавляем поле "derivative" в каждый элемент массива, начиная со второго
        for (let i = 1; i < data.length; i++) {
            const deltaDut = Number(data[i].oil) - Number(data[i - 1].oil); // Разница в объеме топлива
            const deltaTime = (Number(data[i].time) - Number((data[i - 1].time))) / 1000; // Разница во времени
            // Если разница во времени не нулевая, вычисляем производную
            //  console.log(deltaDut, deltaTime, data[i].time)
            data[i].derivative = deltaTime !== 0 ? Number((deltaDut / deltaTime).toFixed(2)) : 0;
            console.log(data[i].derivative, deltaDut, deltaTime, data[i].time)
        }

        // Добавляем поле "derivative" со значением null или 0 для первого элемента
        data[0].derivative = 0; // Или 0, в зависимости от ваших требований

        return data;
    }

    chartDerivative() {
        const oldChart = document.querySelector('.infoGrafs')
        if (oldChart) oldChart.remove()
        const deriva = document.createElement('div')
        const grafics = document.querySelector('.grafics')
        deriva.classList.add('infoGrafs')
        grafics.appendChild(deriva)

        var widthWind = document.querySelector('body').offsetWidth;
        const wrapper = grafics.offsetWidth
        // устанавливаем размеры контейнера
        const margin = { top: 10, right: 60, bottom: 50, left: 60 },
            width = widthWind >= 860 ? wrapper - 250 : widthWind - 80,
            height = 500 - margin.top - margin.bottom;
        this.width = width
        this.height = height
        // создаем svg контейнер
        const svg = d3.select(".infoGrafs").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        const minVal = d3.min(this.derivative, (d) => +d.derivative || 0) - 10;
        const maxVal = d3.max(this.derivative, (d) => +d.derivative || 0) + 10;


        const x = d3.scaleTime()
            .domain(d3.extent(this.derivative, (d) => new Date(d.time)))
            .range([0, this.width])
        // задаем y-шкалу для первой оси y
        const y1 = d3.scaleLinear()
            .domain([Math.min(minVal, 0), Math.max(maxVal, 0)])
            .range([this.height, 0]);

        const yAxis1 = d3.axisLeft(y1)
        const xAxis = d3.axisBottom(x)

        const line1 = d3.line()
            .x((d) => x(new Date(d.time)))
            .y((d) => y1(+d.derivative || 0))
            .curve(d3.curveLinear);

        svg.append("g")
            .attr("class", "osx")
            .attr("clip-path", "url(#clip)")
            .attr("transform", "translate(0," + this.height + ")")
            .call(xAxis
                .ticks(10)
                .tickFormat(function (d) {
                    return d3.timeFormat("%H:%M")(d);
                }))

        svg.append("g")
            .attr("class", "os1y")
            .call(yAxis1)
            .attr("transform", "translate(0, 0)")
        // добавляем линии для сигнальные оси y
        svg.append("path")
            .datum(this.derivative)
            .attr("class", "lineDerivative")
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1.5)
            .attr("d", line1)
            .attr("transform", "translate(0, 0)")
    }
    medianFilters() {
        const koef = Number(this.filtration[0].dopValue)
        let celevoy = this.struktura
            .filter(e => Number(e.dut) < 4097)
            .map(it => ({
                ...it,
                dut: Number(it.dut)
            }));

        const medianArray = []
        if (celevoy.length < 3) {
            return [...celevoy]
        }
        if (koef === 0) {
            medianArray.push(...celevoy.slice(0, 3));
            for (let i = 3; i < celevoy.length; i++) {
                const previuosElements = celevoy.slice(i - 3, i)
                previuosElements.sort((a, b) => Number(a.dut) - Number(b.dut))
                const median = previuosElements[1].dut
                const newElement = { ...celevoy[i], dut: median };
                medianArray.push(newElement);
            }
        }
        else {
            const window = koef * 5
            medianArray.push(...celevoy.slice(0, window));
            for (let i = window; i < celevoy.length; i++) {
                const windowElements = celevoy.slice(i - window, i)
                windowElements.sort((a, b) => Number(a.dut) - Number(b.dut))
                let median;
                if (windowElements.length % 2 === 0) {
                    const indexNumber = windowElements.length / 2
                    median = (parseInt(Number(windowElements[indexNumber - 1].dut) + Number(windowElements[indexNumber].dut))) / 2
                }
                else {
                    const indexNumber = Math.floor(windowElements.length / 2)
                    median = Number(windowElements[indexNumber].dut)

                }
                const newElement = { ...celevoy[i], dut: median };
                medianArray.push(newElement);
            }
        }
        return medianArray
    }
    runFormula(data) {
        return data.map(e => {
            //   console.log(e)
            const calculatedOil = this.calcut(e.dut); // убедитесь, что это не просто e.dut
            return {
                ...e,
                oil: calculatedOil
            }
        })
    }
    calcut(x) {
        const formula = this.filtration[0].formula
        function transformExpressionWithExponent(str, x) {
            // Убираем пробелы вокруг x и степеней
            str = str.replace(/\s+/g, '');
            // Добавляем знак умножения перед 'x', если его нет
            str = str.replace(/(\d)(x)/g, '$1*$2');
            // Заменяем выражения вида x2 на Math.pow(x, 2)
            str = str.replace(/x\^(\d+)/g, 'Math.pow(x, $1)');  //str.replace(/x(\d+)/g, 'Math.pow(x, $1)');
            // Заменяем все оставшиеся 'x' на значение переменной x
            str = str.replace(/x/g, x);

            return str;
        }

        const formattedExpression = formula.replace(/,/g, '.');
        const transformedExpression = transformExpressionWithExponent(formattedExpression, x);

        // Вычисляем результат
        try {
            return Number(eval(transformedExpression).toFixed(2))

        } catch (error) {
            console.error("Ошибка при вычислении:", error);
        }
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
        +d[this.parametr] === 0 ? oilTool = 'Нет данных' : oilTool = +d[this.parametr]
        this.tooltip
            .style("left", `${xPosition + 100}px`)
            .style("top", `${yPosition + 100}px`)
            .style("display", "block")
            .html(`Время: ${(selectedTime)}<br/>Топливо: ${oilTool}<br/>ДУТ: ${d.dut}<br/>Бортовое питание: ${d.pwr}<br/>Двигатель:${d.engineOn}
            <br/>Зажигание:${d.engine} <br/>Пробег:${d.mileage}, <br/>Скорость:${d.speed} <br/>Спутники:${d.sats}`)
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
        const seconds = date.getSeconds();
        const timeString = `${month} ${day}, ${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds}`;
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
        new GeoCreateMapsMini([], d, 'oil')
        // Добавляем обработчик клика на график, чтобы предотвратить всплытие и случайное закрытие карты
        this.graf.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }

    createBodyCharts() {
        console.log(this.data.length, this.struktura.length)
        const parametr = this.struktura[this.struktura.length - 1].summatorOil ? 'summatorOil' : 'oil'
        this.parametr = parametr
        // задаем x-шкалу
        const x = d3.scaleTime()
            .domain(d3.extent(this.data, (d) => new Date(d.time)))
            .range([0, this.width])
        this.x = x
        // задаем y-шкалу для первой оси y
        const y1 = d3.scaleLinear()
            .domain([0, d3.max(this.struktura, (d) => +d[parametr] || 0)])
            .range([(this.height - 40), 0]);
        this.y1 = y1
        // задаем y-шкалу для второй оси y
        const y2 = d3.scaleLinear()
            .domain(d3.extent(this.struktura, (d) => d.pwr))
            .range([(this.height - 40), 0]);
        this.y2 = y2
        const yAxis1 = d3.axisLeft(y1)
        const yAxis2 = d3.axisLeft(y2)
        const xAxis = d3.axisBottom(x)

        const line1 = d3.line()
            .x((d) => x(new Date(d.time)))
            .y((d) => y1(+d[parametr] || 0))
            .curve(d3.curveLinear);
        const line2 = d3.line()
            .x((d) => x(new Date(d.time)))
            .y((d) => y2(d.pwr))
            .curve(d3.curveLinear);

        const area1 = d3.area()
            .x(d => x(new Date(d.time)))
            .y0(this.height)
            .y1(d => y1(+d[parametr] || 0))
            .curve(d3.curveLinear);

        const area2 = d3.area()
            .x(d => x(new Date(d.time)))
            .y0(this.height)
            .y1(d => y2(d.pwr))
            .curve(d3.curveLinear);

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


        // добавляем линии для медиана оси y
        chartGroup.append("path")
            .datum(this.data)
            .attr("class", "line1")
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1.5)
            .attr("d", line1)
            .attr("transform", "translate(0, " + (40) + ")")

        // добавляем линии для сигнальные оси y
        chartGroup.append("path")
            .datum(this.struktura)
            .attr("class", "line3")
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("d", line1)
            .attr("transform", "translate(0, " + (40) + ")")


        // добавляем линии для скользящая оси y
        chartGroup.append("path")
            .datum(this.average)
            .attr("class", "line4")
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 1.5)
            .attr("d", line1)
            .attr("transform", "translate(0, " + (40) + ")")
        // добавляем линии для второй оси y
        chartGroup.append("path")
            .datum(this.struktura)
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
            .attr("fill", "transparent")
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
        console.log(this)
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
            .y((d) => this.y1(+d[this.parametr] || 0))
            .curve(d3.curveLinear);

        const updateLine2 = d3.line()
            .x((d) => new_xScale(new Date(d.time)))
            .y((d) => this.y2(d.pwr))
            .curve(d3.curveLinear);

        const updateArea1 = d3.area()
            .x(d => new_xScale(new Date(d.time)))
            .y0(this.height)
            .y1(d => this.y1(+d[this.parametr] || 0))
            .curve(d3.curveLinear);

        const updateArea2 = d3.area()
            .x(d => new_xScale(new Date(d.time)))
            .y0(this.height)
            .y1(d => this.y2(d.pwr))
            .curve(d3.curveLinear);

        d3.select('.line1').attr('d', updateLine1(this.data));
        d3.select('.area1').attr('d', updateArea1(this.data));
        d3.select('.line2').attr('d', updateLine2(this.struktura));
        d3.select('.area2').attr('d', updateArea2(this.struktura));
        d3.select('.line3').attr('d', updateLine1(this.struktura));
        d3.select('.line4').attr('d', updateLine1(this.average));
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
        legendOil[0].addEventListener('click', () => {
            const os1y = d3.select('.os1y')
            const line1 = d3.select('.line1')
            const area1 = d3.select('.area1')
            const area11 = d3.select('.area11')
            const obv = d3.select('.obv')
            const legendOilcircle = d3.select('.legendOilcircle')

            legendOil[0].classList.toggle('noActive')
            if (legendOil[0].classList.contains('noActive')) {
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
        // Инициализация тултипа один раз в конструкторе или инициализирующем методе
        this.tooltip = d3.select(".infoGraf").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("display", "none"); // Скрыть тултип при инициализации

    }
    async findMarkerReFill() {
        const idw = Number(document.querySelector('.color').id)

        const refill = await Request.refill(idw, this.info)


        const objOil = refill[1].map(it => {
            const date = new Date(Number(it.time) * 1000);
            const day = date.getDate();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
            return {
                data: date,
                geo: it.geo,
                zapravka: it.value,
                time: formattedDate,
                icon: "../../../image/refuel.png"
            }

        })
        return objOil
    }

    async createStructura() {
        const idw = Number(document.querySelector('.color').id)
        const arrayColumns = ['last_valid_time', 'lat', 'lon', 'pwr', 'oil', 'dut', 'engineOn', 'engine', 'mileage', 'speed', 'sats']
        const t1 = this.t1
        const t2 = this.t2 + 86399
        const num = 0
        const workerKey = 'oil'
        const paramss = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw, t1, t2, arrayColumns, num, workerKey }))
        }
        const res = await fetch('/api/getPressureOil', paramss)
        const data = await res.json();
        console.log(data)
        this.info = data
        const newGlobal = data.map(it => {
            return {
                id: it.idw,
                time: new Date(Number(it.last_valid_time) * 1000),
                geo: [Number(it.lat), Number(it.lon)],
                oil: Number(it.oil),
                pwr: Number(it.pwr),
                dut: Number(it.dut),
                engine: Number(it.engine),
                mileage: Number(it.mileage),
                speed: Number(it.speed),
                sats: Number(it.sats),
                engineOn: it.engineOn
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
            return []
        }
        document.querySelector('.noGraf').style.display = 'none'

        return newGlobal
    }
}