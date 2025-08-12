


export class ChartMileage {
    constructor(data, container, countObjects) {
        this.count = countObjects
        this.data = data
        this.container = container

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
        // ChartUtils.createTooltip(this.rectTool, this.container.id, this.data, this.x)
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


    createBodyCharts() {
        this.svg.selectAll("*").remove()
        this.date = (this.data.filter(e => e.name === 'Начало').map(e => (e.result)))[0]
        this.mileage = (this.data.filter(e => e.name === 'Пробег').map(e => (e.result)))[0]
        //   this.date = this.date.map(el => el.slice(0, 5))


        const chartData = this.date.map((date, index) => ({
            date: date,
            mileage: this.mileage[index]
        }));
        const barWidth = 30;

        const axisMax = Math.max(...this.mileage)
        const xScale = d3.scaleBand()
            .domain(this.date.map(function (d) { return d; }))
            .range([0, this.date.length * 36 + 5])



        const self = this
        const yScale = d3.scaleLinear()
            .domain([0, axisMax * 1.05])
            .range([(this.height - 60), 0]);

        const tiksX = this.svg.append("g")
            .attr("transform", "translate(0," + (this.height - 60) + ")")
            .call(d3.axisBottom(xScale));

        tiksX.selectAll('text')
            .style("fill", function (d) {

                const newDate = new Date(d.split(".").reverse().join("-")).getDay();
                console.log(newDate)
                // Проверяем, равен ли текст "сб" или "вск"
                if (newDate === 6 || newDate === 0) {
                    return "red"; // Окрашиваем в красный цвет
                } else {
                    return "black"; // Оставляем черным по умолчанию
                }
            })
            .style('font-weight', function (d) {
                const day = parseInt(d.substring(0, 2), 10)
                if (day === 1) return '900'
            })
            .text(function (d) {
                // Преобразуем дату из строки
                const newDate = d.slice(0, 5)

                // Изменяем текст на значение newDate
                return newDate;
            })
            .attr("transform", "translate(4, 0)");

        tiksX.selectAll(".tick line")
            .attr("x1", 4) // Сдвигаем риски на 8 px вправо
            .attr("x2", 4);

        this.svg.append("text")
            .attr("y", -25)
            .attr("x", -7)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("км")
            .style('color', 'rgba(6, 28, 71, 1)')
        // Добавляем последний тик для максимального значения
        const ticks = yScale.ticks(14); // Получаем 10 тиков для оси
        ticks[ticks.length - 1] = axisMax

        this.svg.append("g")
            .attr("transform", "translate(0, " + (0) + ")")
            .call(d3.axisLeft(yScale).tickValues(ticks))

        console.log(chartData)
        this.svg.selectAll('rect')
            .data(chartData)
            .enter().append('rect')
            .attr("x", d => xScale(d.date) + 8)
            .attr("y", d => yScale(d.mileage))
            .attr("height", d => (this.height - 60) - yScale(d.mileage))
            .attr("width", barWidth)
            .attr("fill", "#336699")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)

        chartData.forEach(function (d) {
            self.svg.append("text")
                .attr("x", xScale(d.date) + xScale.bandwidth() / 2 + 4)
                .attr("y", yScale(d.mileage) - 10)
                .text(d.mileage)
                .attr("font-size", "10px")
                .attr("text-anchor", "middle")
                .attr('fill', 'rgba(6, 28, 71, 1)')
        });

    }

}