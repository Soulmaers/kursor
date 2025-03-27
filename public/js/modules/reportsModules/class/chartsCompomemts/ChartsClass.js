import { ChartUtils } from './ChartUtils.js'
import { Helpers } from '../Helpers.js'
export class ChartsClass {

    constructor(data, container, countObjects) {
        this.count = countObjects
        this.data = data
        this.container = container
        this.chartType = {
            'osX': null,
            'line': (data) => this.chartLine(data),
            'rect': (data) => this.chartRect(data),
            'icon': (data) => this.chartIcon(data)
        };
        this.originalWidth = document.querySelector('.wrapper_reports').offsetWidth - 10;
        this.originalHeight = 400;
        window.addEventListener('resize', () => this.handleResize());
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                setTimeout(() => {
                    this.restoreSize(); // Восстанавливаем размеры при выходе из полноэкранного режима
                }, 100); // Задержка в 100 мс
            }
        });

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
        this.createChart(this.originalWidth, this.originalHeight);
    }

    createChart(width, height) {
        this.width = width
        this.height = height
        this.createContainer()
        this.updateSize(width, height); // Устанавливаем начальные размеры

    }

    updateSize(newWidth, newHeight) {
        this.width = newWidth;
        this.height = newHeight;

        // Обновляем размеры SVG
        d3.select('[data-chart-id="' + this.container.id + '"] svg')
            .attr("width", this.width)
            .attr("height", this.height);

        // Обновляем оси и другие элементы графика
        this.createBodyCharts(); // Вызовите createBodyCharts для обновления графика
        ChartUtils.createTooltip(this.rectTool, this.container.id, this.data, this.x)
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
    }

    chartIcon(data) {
        data.result.forEach((e, index) => {
            const iconClass = `icon_image_reports${index}`
            this.rectToolIcon = this.chartGroup.append("image")
                .attr("x", this.x(new Date(Number(e.time) * 1000)))
                .attr("href", data.icon)
                .attr('class', iconClass)
                .attr('rel', e.value === 0 ? e.value2 : e.value)
                .attr('type', e.value === 0 ? 'Слив' : 'Заправка')
                .attr('id', Helpers.formatUnixTime(e.time).timeString)
                .attr("width", 18)
                .attr("height", 18)
                .attr("transform", "translate(-12,-20)")

            // ChartUtils.createTooltip(this.rectToolIcon, this.container.id, this.data, this.x)
        });
    }

    chartLine(data) {
        const lineData = ChartUtils.createLine(data.result, this.time, this.x, this.y1, data.color, 2);
        const lineClass = `line1${data.color}`

        // добавляем линии для медиана оси y
        this.chartGroup.append("path")
            .datum(data.result)
            .attr("class", lineClass)
            .attr("fill", "none")
            .attr('type', 'lineOil')
            .attr("stroke", lineData.color)
            .attr("stroke-width", lineData.strokeWidth)
            .attr("d", lineData.path)
            .attr("transform", "translate(0, " + (0) + ")")

    }

    chartRect(data) {
        data.result.forEach((e, index) => {
            const rect = ChartUtils.createRect(e, this.x, this.height - 60, data.color, 2);
            const rectClass = `rect${data.name.replace(/\s/g, '') + index}`;
            this.chartGroup.append("rect")
                .attr("class", rectClass) // Уникальный класс для каждого прямоугольника
                .attr("x", rect.xStart) // Позиция по оси X
                .attr("width", rect.width) // Ширина прямоугольника
                .attr("height", rect.height) // Высота прямоугольника
                .attr("fill", rect.color) // Цвет прямоугольника
                .attr("fill-opacity", 0.5) // Прозрачность
                .attr("stroke-width", rect.strokeWidth) // Ширина обводки
                .attr('type', `${data.name}`)
        });
    }

    controller() {
        for (let i = this.data.length - 1; i >= 0; i--) { // Цикл с обратным порядком перебора
            const e = this.data[i];
            if (e.checked && this.chartType[e.chartType]) {
                this.chartType[e.chartType](e);
            }
        }
    }

    createBodyCharts() {
        this.svg.selectAll("*").remove()
        this.time = this.data[0].result
        const filterOil = this.data[1].result
        const originOil = this.data[2].result

        // задаем x-шкалу
        const x = d3.scaleTime()
            .domain(d3.extent(this.time, (d) => new Date(Number(d) * 1000)))
            .range([0, this.width - 60])
        this.x = x
        // задаем y-шкалу для первой оси y
        const y1 = d3.scaleLinear()
            .domain([0, d3.max(filterOil, (d) => +d + 30 || 0)])
            .range([(this.height - 60), 0]);
        this.y1 = y1
        const y2 = d3.scaleLinear()
            .domain([0, d3.max(originOil, (d) => +d + 30 || 0)])
            .range([(this.height - 60), 0]);
        this.y2 = y2

        const additionalClipHeight = 20;
        const clipOffsetY = -20;

        this.svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("class", "clipart")
            .attr("width", this.width - 60)
            .attr("height", this.height - 60 + additionalClipHeight)
            .attr('x', 0)
            .attr('y', clipOffsetY)

        this.chartGroup = this.svg.append("g")
            .attr("clip-path", "url(#clip)")

        // добавляем ось x
        this.svg.append("g")
            .attr("class", "osx")
            .attr("clip-path", "url(#clip)")
            .attr("transform", "translate(0," + (this.height - 60) + ")")
            .call(ChartUtils.createAxis(x, 'bottom', this.svg, 'oil')
                .ticks(10)
                .tickFormat(function (d) {
                    return d3.timeFormat("%H:%M")(d);
                }))
        // добавляем ось x 2
        this.svg.append("g")
            .attr("transform", `translate(0, ${(this.height - 50)})`)
            .attr('class', 'osx2')
            .attr("clip-path", "url(#clip)")
            .call(ChartUtils.createAxis(x, 'bottom', this.svg, 'oil')
                .ticks(10)
                .tickFormat(function (d) {
                    return d3.timeFormat("%d.%m")(d);
                })
            )
            .style("stroke-width", 0)


        // добавляем  ось y
        this.svg.append("g")
            .attr("class", "os1y")
            .call(ChartUtils.createAxis(y1, 'left', this.svg))
            .attr("transform", "translate(0, " + (0) + ")")

        const ticks = y1.ticks(10);
        ticks[ticks.length - 1] = Math.max(...originOil.map(e => Number(e)))
        this.svg.select('.os1y')
            .call(ChartUtils.createAxis(y1, 'left', this.svg).tickValues(ticks))


        this.controller()

        this.rectTool = this.svg.append('rect')
            .attr("width", this.width - 60) // Ширина, соответствующая размеру вашего графика
            .attr("height", this.height - 60) // Высота, соответствующая размеру вашего графика
            .attr("fill", "transparent")

        this.svg.append("text")
            .attr("class", 'obv')
            .attr("x", -130)
            .attr("y", -35)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "end")
            .text("Объем, л");



        this.zoom = d3.zoom()
            //  .scaleExtent([0.5, 5])
            //  .translateExtent([[0, 0], [this.width - 60, this.height - 60]])
            .on("zoom", this.zoomed.bind(this));
        if (this.count < 2) {
            this.svg.call(this.zoom);
        }
    }
    zoomed() {
        const transform = d3.event.transform;
        const new_xScale = transform.rescaleX(this.x);

        // Обновляем шкалу x для каждого датасета
        this.data.forEach(dataset => {
            dataset.xScale = new_xScale;
            dataset.line = ChartUtils.createLine(dataset.result, this.time, new_xScale, this.y1, dataset.color, 2).path;
        });

        // Обновляем оси с новыми масштабами
        this.svg.select(".osx").call(d3.axisBottom(new_xScale)
            .ticks(10)
            .tickFormat(function (d) {
                return d3.timeFormat("%H:%M")(d);
            }));
        this.svg.select(".osx2").call(d3.axisBottom(new_xScale)
            .ticks(10)
            .tickFormat(function (d) {
                return d3.timeFormat("%d.%m")(d);
            }));

        // Обновляем линии
        this.data.forEach(dataset => {
            if (dataset.chartType === 'line') {
                const lineClass = `line1${dataset.color}`
                this.chartGroup.select(`.${lineClass}`).attr("d", dataset.line);
            } else if (dataset.chartType === 'rect') {
                dataset.result.forEach((e, index) => {
                    const rectClass = `rect${dataset.name.replace(/\s/g, '') + index}`;
                    const rect = ChartUtils.createRect(e, new_xScale, this.height - 60, dataset.color, 2);

                    this.chartGroup.select(`.${rectClass}`)
                        .attr("x", rect.xStart)
                        .attr("width", rect.width);
                });
            }
            else if (dataset.chartType === 'icon') {
                dataset.result.forEach((e, index) => {
                    const iconClass = `icon_image_reports${index}`
                    this.rectToolIcon = this.chartGroup.select(`.${iconClass}`)
                        .attr("x", new_xScale(new Date(Number(e.time) * 1000)));
                    //   ChartUtils.createTooltip(this.rectToolIcon, this.container.id, this.data, new_xScale)
                })
            }


        })

        ChartUtils.createTooltip(this.rectTool, this.container.id, this.data, new_xScale)
    }



}