

import { ChartUtils } from './ChartUtils.js'
import { Helpers } from '../Helpers.js'
export class ChartsClassSecond {

    constructor(data, container, types, interval, index) {
        this.timeInterval = interval
        this.types = types
        this.data = data
        this.container = container
        this.index = index
        this.cumulativeHeight = {};
        this.chartType = {
            'osX': null,
            'line': (data) => this.chartLine(data),
            'rect': (data) => this.chartRect(data),
            'icon': (data) => this.chartIcon(data)
        };
        this.originalWidth = document.querySelector('.wrapper_reports').offsetWidth - 10;
        this.originalHeight = 400;
        /*  window.addEventListener('resize', () => this.handleResize());
          document.addEventListener('fullscreenchange', () => {
              if (!document.fullscreenElement) {
                  setTimeout(() => {
                      this.restoreSize(); // Восстанавливаем размеры при выходе из полноэкранного режима
                  }, 100); // Задержка в 100 мс
              }
          });*/
        this.init()
    }
    restoreSize() {
        this.updateSize(this.originalWidth, this.originalHeight);
    }
    handleResize() {
        const newWidth = window.innerWidth// document.querySelector('.wrapper_reports').offsetWidth - 10; // Обновляем ширину
        const newHeight = window.innerHeight; // Укажите высоту, которую хотите использовать
        this.updateSize(newWidth, newHeight); // Обновляем размеры графиков
    }
    init() {
        if (this.types === 'Моточасы') this.uniqFunc()
        this.createChart(this.originalWidth, this.originalHeight);
    }


    uniqFunc() {
        this.originData = [...Helpers.convertFormatTime(this.timeInterval)]

    }

    createChart(width, height) {
        this.width = width
        this.height = height
        this.createContainer()
        this.updateSize(width, height); // Устанавливаем начальные размеры

    }

    updateSize(newWidth, newHeight) {
        this.cumulativeHeight = {};
        this.width = newWidth;
        this.height = newHeight;
        // Обновляем размеры SVG
        d3.select('[data-chart-id="' + this.container.id + '"] svg')
            .attr("width", this.width)
            .attr("height", this.height);

        // Обновляем оси и другие элементы графика
        this.createBodyCharts(); // Вызовите createBodyCharts для обновления графика
    }


    createContainer() {
        this.graf = document.createElement('div');
        this.graf.classList.add('chart_class')
        this.graf.setAttribute('data-chart-id', this.container.id); // Уникальный data-атрибут
        this.container.appendChild(this.graf);

        // Создаем svg контейнер, выбирая элемент по data-атрибуту
        this.svg = d3.select('[data-chart-id="' + this.container.id + '"]').append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr('class', 'svg_reports')
            .style("border", "1px solid black")
            .style('position', 'relative')
            .append("g")
            .attr("transform", "translate(" + 60 + "," + 30 + ")");
        this.tooltip = d3.select('[data-chart-id="' + this.container.id + '"]').append('div')
            .attr("class", `tooltip_reports`)
            .style("opacity", 0) // Изначально скрываем tooltip
            .style("display", "none") // Задаем display: none
            .style('min-width', '200px')
    }

    chartIcon(data) {
        data.result.forEach(e => {
            this.svg.append("image")
                .attr("x", this.x(new Date(Number(e.time) * 1000)))
                .attr("href", data.icon)
                .attr('class', 'icon_image_reports')
                .attr('rel', e.value === 0 ? e.value2 : e.value)
                .attr('type', e.value === 0 ? 'Слив' : 'Заправка')
                .attr('id', Helpers.formatUnixTime(e.time).timeString)
                .attr("width", 18)
                .attr("height", 18)
                .attr("transform", "translate(-12,-20)")
        });
    }

    chartLine(data) {
        const lineData = ChartUtils.createLine(data.result, this.time, this.x, this.y1, data.color, 2);
        // добавляем линии для медиана оси y
        this.svg.append("path")
            .datum(data.result)
            .attr("class", "line1")
            .attr("fill", "none")
            .attr("stroke", lineData.color)
            .attr("stroke-width", lineData.strokeWidth)
            .attr("d", lineData.path)
            .attr("transform", "translate(0, " + (40) + ")")

    }

    chartRect(data) {
        data.result.forEach((e, index) => {
            if (e !== 0) {
                const rect = ChartUtils.createRectSecond(this.axisData[index], this.x, data.color, 2);
                const rectHeight = this.y1(this.originData.includes(this.axisData[index]) ? e : 0);
                const xPosition = rect.xStart
                const currentCumulativeHeight = this.cumulativeHeight[index] || this.height - 60;
                console.log(rect.xStart)
                const height = this.height - rectHeight - 60
                const yPosition = currentCumulativeHeight - height;

                const yInvert = rectHeight - 1
                this.svg.append("rect")
                    .attr("class", `rect${index + 1}`) // Уникальный класс для каждого прямоугольника
                    .attr("class", 'rectReports')
                    .attr("x", xPosition) // Позиция по оси X
                    .attr("y", yInvert)
                    .attr("width", 51) // Ширина прямоугольника
                    .attr("height", height) // Высота прямоугольника
                    .attr("fill", rect.color) // Цвет прямоугольника
                    .attr("stroke", "#fff")
                    .attr("stroke-width", rect.strokeWidth) // Ширина обводки

                this.cumulativeHeight[index] = yPosition

            }
        });
    }

    controller() {
        for (let i = 0; i < this.data.length; i++) {
            const e = this.data[i];
            if (e.checked && this.chartType[e.chartType]) {
                this.chartType[e.chartType](e);
            }
        }
    }


    createBodyCharts() {

        this.svg.selectAll("*").remove()
        this.axisData = this.data[0].result
        //  console.log(this.axisData)
        this.axisYData = Math.max(...Helpers.timeDay())
        // задаем x-шкалу
        const x = d3.scaleBand()
            .domain(this.originData.map(function (d) { return d; }))
            .range([0, this.originData.length * (51 + 5)])
            .padding(0.03)
        this.x = x
        // задаем y-шкалу для первой оси y
        const y1 = d3.scaleLinear()
            .domain([0, this.axisYData])
            .range([(this.height - 60), 0])

        this.y1 = y1
        // добавляем ось x
        this.svg.append("g")
            .attr("class", "osx")
            .attr("transform", "translate(0," + (this.height - 60) + ")") //
            .call(ChartUtils.createAxis(x, 'bottom', this.svg))

        this.svg.append("g")
            .attr("class", "os1y")
            .call(ChartUtils.createAxis(y1, 'left', this.svg)
                .tickFormat((d) => {
                    return Helpers.timesFormat(this.axisYData);
                }))
            .attr("transform", "translate(0, " + (0) + ")")

        // Добавляем последний тик для максимального значения
        const ticks = y1.ticks(14); // Получаем 10 тиков для оси
        ticks[ticks.length - 1] = this.axisYData

        // Обновляем ось Y с новыми значениями тиков
        this.svg.select(".os1y")
            .call(d3.axisLeft(y1).tickValues(Helpers.timeDay())
                .tickFormat((d) => Helpers.timesFormat(d)));

        this.controller()

        this.axisData.forEach((e, index) => {
            const textContent = this.data.slice(1).map(e => ({ name: e.name, color: e.color, value: e.result[index], local: e.local }))
            console.log(textContent)
            const rect = ChartUtils.createRectSecond(e, this.x, 'green', 2);
            const rectHeight = this.y1(this.axisYData);
            const xPosition = rect.xStart

            this.svg.append("rect")
                .attr("class", 'rectReports')
                .attr("x", xPosition) // Позиция по оси X
                .attr("y", rectHeight)
                .attr("width", 50) // Ширина прямоугольника
                .attr("height", this.height - rectHeight - 60) // Высота прямоугольника
                .attr("fill", 'transparent') // Цвет прямоугольника
                .on("mousemove", (event, d) => {
                    const [xPosition, yPosition] = d3.mouse(this.svg.node());
                    const yPos = yPosition + 15

                    // Код для отображения тултипа
                    this.tooltip
                        .style("display", 'flex')
                        .style('opacity', 1)
                        .html(ChartUtils.createTooltipRect(textContent))
                        .style("left", (xPosition + 80) + "px")
                        .style("top", yPos + "px");
                })
                .on("mouseout", () => {
                    // Код для скрытия тултипа
                    this.tooltip.style("display", 'none')
                    this.tooltip.style('opacity', 0)
                });

            // Добавляем чекбокс
            const checkboxGroup = this.svg.append("g")
                .attr("transform", `translate(${xPosition + 51 / 2 - 15}, 
                   ${this.height - 37 - 60})`)

            checkboxGroup.append("foreignObject")
                .attr("width", '30px')
                .attr("height", '30px')
                .attr('opacity', 0.5)
                .html(`<input type="checkbox" class="checkbox_motos" id="${this.formatDate(e) + this.index}"/>`);


        })

        // После создания чекбокса добавляем слушатель события
        d3.selectAll(".checkbox_motos").on("change", function () {
            // Здесь можно получить состояние чекбокса
            const isChecked = this.checked;  // Это будет true или false
            const id = this.id;              // Это ID чекбокса
            const conditionChart = this.closest('.chart_container').nextElementSibling.querySelectorAll('.chart_class_condition')
            console.log(conditionChart)
            conditionChart.forEach(e => {
                console.log(e.getAttribute('data-chart-id'), id)
                if (e.getAttribute('data-chart-id') === id) {
                    e.classList.toggle('block')
                }
            })
            //  console.log(conditionChart)

        });
    }

    formatDate(date) {
        // Разделяем строку по дефису
        const parts = date.split('-');

        // Берем год, месяц и день из разделенных частей
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];

        // Формируем новый формат даты в виде DD.MM.YYYY
        return `${day}.${month}.${year}`;
    }

}