
import { Tooltip } from '../../../../class/Tooltip.js'
import { ChartUtils } from './ChartUtils.js'

export class PressureCharts {
    constructor(data, container) {
        console.log(data)
        this.data = data//data[1].result
        this.model = data[1].model
        this.container = container
        this.display = this.data[2].checked
        this.originalWidth = document.querySelector('.wrapper_reports').offsetWidth - 10;
        this.originalHeight = 50;
        window.addEventListener('resize', () => this.handleResize());
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                setTimeout(() => this.restoreSize(), 100)

            }
        });
        this.chartType = {
            'line': (data, svg, color, x, y1, y2) => this.chartLine(data, svg, color, x, y1, y2),
            'area': (data, svg, color, x, y1, y2) => this.chartArea(data, svg, color, x, y1, y2)

        };
        this.init()
    }
    restoreSize() {
        this.container.classList.remove('center_element')
        this.updateSize(this.originalWidth, this.originalHeight);
    }
    handleResize() {
        console.log(this.container)
        this.container.classList.add('center_element')
        const newWidth = document.querySelector('.wrapper_reports').offsetWidth - 100; // Обновляем ширину
        const newHeight = 50; // Укажите высоту, которую хотите использовать
        this.updateSize(newWidth, newHeight); // Обновляем размеры графиков
    }
    init() {
        this.createChart(this.originalWidth, this.originalHeight);
    }


    createChart(width, height) {
        this.createContainer();
        this.updateSize(width, height); // Устанавливаем начальные размеры
        //   /  this.createBodyCharts(); // Убедитесь, что графики создаются
        this.createIconsCar();
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
    }
    createContainer() {

        this.graf = document.createElement('div');
        this.graf.classList.add('chart_class')
        this.graf.setAttribute('data-chart-id', this.container.id); // Уникальный data-атрибут
        this.container.appendChild(this.graf);

        const container = d3.select(this.graf);
        // Связываем данные с контейнером
        this.charts = container.selectAll('.charts')
            .data(this.data[1].result)
            .enter()
            .append('div')
            .attr('class', 'chart');

    }
    controller(index, svg, x, y1, y2) {
        for (let i = 0; i < this.data.length; i++) { // Цикл с обратным порядком перебора
            const e = this.data[i];
            if (e.checked && this.chartType[e.chartType]) {
                this.chartType[e.chartType](e.result[index], svg, e.color, x, y1, y2);
            }
        }
    }
    chartLine(data, svg, color, x, y1, y2) {
        const lineData = ChartUtils.createLine(data.val, [], x, y2, color, 1, 'pref');
        // добавляем линии для медиана оси y
        svg.append("path")
            .datum(data.val)
            .attr("fill", "none")
            .attr("class", "line1")
            .attr("stroke", lineData.color)
            .attr("stroke-width", lineData.strokeWidth)
            .attr("d", lineData.path)
    }

    chartArea(data, svg, color, x, y1, y2) {

        const knd = data.bar !== undefined ? Number(data.bar.knd).toFixed(1) : null;
        const dvn = data.bar !== undefined ? Number(data.bar.dvn).toFixed(1) : null;
        const dnn = data.bar !== undefined ? Number(data.bar.dnn).toFixed(1) : null;
        const kvd = data.bar !== undefined ? Number(data.bar.kvd).toFixed(1) : null;

        const area1 = d3.area()
            .x(d => x(new Date(d.dates)))
            .y0(this.height)
            .y1(d => y1(d.value))
            .curve(d3.curveStep);

        const area11 = d3.area()
            .x(d => x(new Date(d.dates)))
            .y0(this.height)
            .y1(d => d.value > knd && d.value <= dnn || d.value > dvn && d.value <= kvd ? y1(d.value) : this.height)
            .curve(d3.curveStep);

        const area12 = d3.area()
            .x(d => x(new Date(d.dates)))
            .y0(this.height)
            .y1(d => d.value <= knd || d.value >= kvd ? y1(d.value) : this.height)
            .curve(d3.curveStep);


        svg.append("path")
            .datum(data.val)
            .attr("fill", !this.display ? color : 'darkgreen') // Можете задать разные цвета для разных областей
            .attr("class", "area_green")
            .attr("d", area1(data.val))
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("fill-opacity", 1)

        svg.append("path")
            .datum(data.val)
            .attr("fill", !this.display ? color : '#e8eb65')
            .attr("class", "area_yellow")
            .attr("d", area11(data.val))
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("fill-opacity", 1)

        svg.append("path")
            .datum(data.val)
            .attr("fill", !this.display ? color : 'darkred')
            .attr("class", "area_red")
            .attr("d", area12(data.val))
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("fill-opacity", 1)

    }
    createBodyCharts() {
        console.log(this.width)
        const count = this.charts.size();
        this.charts.selectAll("svg").remove();
        this.charts.each((d, i, nodes) => {
            // Используем nodes[i] для доступа к текущему элементу DOM
            const chartContainer = d3.select(nodes[i]);
            const data = d

            const isLastChart = i === count - 1;
            const he = isLastChart ? this.height + 30 : this.height;

            // Создаем SVG внутри контейнера
            const svg = chartContainer.append("svg")
                .attr("width", this.width)
                .attr('class', 'svg_reports')
                .attr('height', he)
                .attr('rel', d.sens)
                .append("g")
                .attr("transform", `translate(0,0)`);

            // задаем x-шкалу
            const x = d3.scaleTime()
                .domain(d3.extent(data.val, (d) => new Date(d.dates)))
                .range([0, this.width])
            // задаем y-шкалу для первой оси y
            const y1 = d3.scaleLinear()
                .domain([0, 15])//d3.extent(data.val, (d) => d.value))
                .range([this.height, 0]);

            // задаем y-шкалу для второй оси y
            const y2 = d3.scaleLinear()
                .domain(d3.extent(data.val, (d) => d.tvalue))
                .range([this.height, 0]);

            const xAxis = d3.axisBottom(x)

            this.controller(i, svg, x, y1, y2)//проверяем какой компонент активирован и отрисовываем нужные элементы
            this.createOsis(d, svg, xAxis)  //добавляем оси


        });

    }

    createOsis(d, svg, xAxis) {
        // добавляем ось x
        svg.append("g")
            .attr("class", "osx")
            .attr("transform", "translate(" + 0 + "," + (this.height) + ")")
            .attr('height', 300)
            .transition()
            .duration(1000)
            .call(xAxis
                .ticks(10)
                .tickFormat(function (d) {
                    return d3.timeFormat("%H:%M")(d);
                }))
        svg.append("g")
            .attr("transform", `translate(0, ${(this.height + 10)})`)
            .attr('class', 'osx2')
            .call(xAxis
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
            .attr("transform", "translate(" + this.width + ", 0)")
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
            div.classList.add('icon_model')
            e.prepend(div)
            return div
        })
        this.char[this.char.length - 1].children[0].classList.add('last_icon_model')
        this.model.sort((a, b) => parseInt(a.osi) - parseInt(b.osi));
        im1.forEach((it, index) => {
            this.model.forEach(({ trailer, tyres }) => {
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
            new Tooltip(it, [it.nextElementSibling.getAttribute('rel')]);
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

}