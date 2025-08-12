import { ChartUtils } from './ChartUtils.js'
import { Helpers } from '../Helpers.js'

export class ChartCondition {

    constructor(data, container, types, interval, index) {
        this.timeInterval = interval
        this.types = types
        this.data = data
        this.container = container
        this.index = index
        this.infoWindow = document.querySelectorAll('.info_window')
        this.objColor = {
            'Движение': ' #8fd14f',
            'Парковка': '#3399ff',
            'Повёрнут ключ зажигания': '#fef445',
            'Работа на холостом ходу': '#f24726'
        }

        this.cumulativeHeight = {};
        this.chartType = {
            'osX': null,
            'line': (data) => this.chartLine(data),
            'rect': (data) => this.chartRect(data),
            'icon': (data) => this.chartIcon(data)
        };
        this.originalWidth = document.querySelector('.wrapper_reports').offsetWidth - 10;
        this.originalHeight = 46;
        /* window.addEventListener('resize', () => this.handleResize());
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
        const newHeight = 46; // Укажите высоту, которую хотите использовать
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
        this.cumulativeHeight = {};
        this.width = newWidth;
        this.height = newHeight;
        // Обновляем размеры SVG
        d3.select('[data-chart-id="' + this.data.date + this.index + '"] svg')
            .attr("width", this.width)
            .attr("height", this.height);

        // Обновляем оси и другие элементы графика
        this.createBodyCharts(); // Вызовите createBodyCharts для обновления графика
    }

    createContainer() {
        this.graf = document.createElement('div');
        this.graf.classList.add('chart_class_condition')
        this.graf.setAttribute('data-chart-id', this.data.date + this.index); // Уникальный data-атрибут
        this.container.appendChild(this.graf);

        // Создаем svg контейнер, выбирая элемент по data-атрибуту
        this.svg = d3.select('[data-chart-id="' + this.data.date + this.index + '"]').append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr('class', 'svg_reports_condition')
            .style('position', 'relative')
            .append("g")
            .attr("transform", "translate(" + 0 + "," + 0 + ")");

    }



    createBodyCharts() {
        const startUnix = this.data.startUnix
        const endUnix = this.data.endUnix
        this.svg.selectAll("*").remove()

        // Генерируем массив с датами Unix с шагом в 1 секунду
        const unixArray = [];
        for (let unixTime = startUnix; unixTime <= endUnix; unixTime++) {
            unixArray.push(unixTime);
        }

        // задаем x-шкалу
        const x = d3.scaleTime()
            .domain(d3.extent(unixArray, d => new Date(d * 1000)))
            .range([60, this.width]);
        this.x = x

        const numTicks = 25;


        const ticks = [];
        for (let i = 0; i < numTicks; i++) { // Изменим условие цикла, чтобы получить numTicks элементов
            const unixTime = startUnix + i * 3600; // Добавляем кратные 3600
            ticks.push(unixTime);
        }
        // добавляем ось x
        this.svg.append("g")
            .attr("class", "osx")
            .attr("transform", "translate(0," + (this.height - 16) + ")") //
            .call(d3.axisBottom(x)
                .tickValues(ticks.map(d => new Date(d * 1000)))
                .tickFormat(d3.timeFormat("%H:%M")))
            .selectAll(".tick text") // выбираем все текстовые элементы внутри tick
            .each(function (d, i, nodes) { // перебираем все элементы
                if (i === nodes.length - 1) { // если это последний элемент
                    d3.select(this).text("24:00") // меняем текст
                        .style("transform", "translateX(-15px)");
                }
            })


        this.data.detalisation.forEach((e, index) => {
            const time = new Date(e.time).getTime(); // Получаем миллисекунды
            let finishtime;
            if (index < this.data.detalisation.length - 1) {
                finishtime = new Date(this.data.detalisation[index + 1].time).getTime(); // Получаем миллисекунды
            } else {
                finishtime = this.endUnix * 1000;  // endUnix в секундах, умножаем на 1000
            }

            this.svg.append("rect")
                .attr("class", 'rectReports')
                .attr("x", this.x(time))
                .attr("y", 0)
                .attr("width", this.x(finishtime) - this.x(time)) // Вычисляем ширину
                .attr("height", 30) // Высота 10px
                .attr("fill", this.objColor[e.condition])
        })

        this.svg.append("text")
            .attr("class", 'text_date')
            .attr("x", 5)
            .attr("y", 18)
            .text(`${this.formatDate(this.data.date)}`)

        const globalRect = this.svg.append("rect")
            .attr("class", 'rectReports_all')
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.width) // Вычисляем ширину
            .attr("height", 30) // Высота 10px
            .attr("fill", 'transparent')

        globalRect
            .on("mousemove", (event, d) => {
                [...this.infoWindow].forEach(e => {
                    if (this.data.allConditionTime[e.getAttribute('rel')]) {
                        e.textContent = Helpers.timesFormat(this.data.allConditionTime[e.getAttribute('rel')])
                    }
                })
            })
            .on("mouseout", () => {
                [...this.infoWindow].forEach(e => {
                    e.textContent = ''
                })
            });
    }


    formatDate(date) {
        // Разделяем дату по точке
        const parts = date.split('.');

        // Берем день и месяц, а также последние две цифры года
        const day = parts[0];
        const month = parts[1];
        const year = parts[2].slice(-2); // Берем последние две цифры года

        return `${day}.${month}.${year}`; // Формируем новый формат даты
    }

}