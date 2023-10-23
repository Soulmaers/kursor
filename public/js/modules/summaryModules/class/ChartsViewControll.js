
import { initSummary } from '../../spisok.js'

export class ChartsViewControll {
    constructor() {
        this.data = null
        this.elementList = document.querySelectorAll('.checkInList')
        this.params = document.querySelectorAll('.pointer_chart')
        this.params.forEach(el => el.addEventListener('click', this.getTitleChart.bind(this, el)))
    }

    getTitleChart(el) {
        const titleCharts = document.querySelector('.title_lower_charts')
        console.log(titleCharts)
        titleCharts.textContent = el.getAttribute('data-attribute')
        const nameChart = el.getAttribute('rel')
        this.createChart(this.data, nameChart)
    }
    //забираем даные за неделю и сортируем в массивы для графиков
    async getDataSummary() {
        console.log('тут уже?')
        const data = initSummary.getIntervalDate('Месяц')
        this.data = await initSummary.getRequestSummaryToBase(data)
        console.log(this.data)
        const originalData = initSummary.controllActiveObject(Object.values(this.data))
        console.log(originalData)
        let dataAndValue = {};
        for (let i = 0; i < originalData.length; i++) {
            const currentDate = originalData[i].data;
            const currentProbeg = originalData[i].probeg;
            const currentRashod = originalData[i].rashod;
            const currentZapravka = originalData[i].zapravka;

            if (!dataAndValue[currentDate]) {
                dataAndValue[currentDate] = {
                    date: currentDate.substring(5),
                    probeg: 0,
                    rashod: 0,
                    zapravka: 0
                };
            }
            dataAndValue[currentDate].probeg += currentProbeg; // суммируем текущий probeg с предыдущими значениями
            dataAndValue[currentDate].rashod += currentRashod;
            dataAndValue[currentDate].zapravka += currentZapravka
        }
        let outputArray = Object.values(dataAndValue);
        console.log(outputArray)
        const clickParams = document.querySelector('.clickToggle').parentElement.getAttribute('rel')
        this.data = outputArray
        this.createChart(outputArray, clickParams)

    }

    createChart(data, nameChart) {
        console.log(data)
        // const xDate = data.find(el => el.data.length === 7)
        console.log(nameChart)
        const char = document.querySelector('.chart_global')
        if (char) {
            char.remove()
        }
        const content_lower_charts = document.querySelector('.content_lower_charts')
        const graf = document.createElement('div')
        graf.classList.add('chart_global')
        content_lower_charts.appendChild(graf)
        // Создание SVG-элемента для отображения графика
        const svg = d3.select(".chart_global")
            .append("svg")
            .attr("width", 1400)
            .attr("height", 400);

        // Формирование оси x с использованием дат
        const xScale = d3.scaleBand()
            .domain(data.map(function (d) { return d.date; }))
            .range([70, 1300])
            .padding(0.1)
            .paddingInner(1)
            .paddingOuter(0)
        //    .align(0)
        // Формирование оси y для отображения значений probeg
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data.map(function (d) { return d[nameChart]; }))])
            .range([350, 20]);

        // Отображение оси x
        svg.append("g")
            .attr("transform", `translate(0, ${yScale(0)})`)
            .call(d3.axisBottom(xScale));

        // Отображение оси y
        svg.append("g")
            .attr("transform", `translate(70, 0)`)
            .call(d3.axisLeft(yScale));
        // Создание линии для текущего объекта
        const line = d3.line()
            .x(d => xScale(d.date) + xScale.bandwidth() / 2)
            .y(d => yScale(d[nameChart]));

        // Отображение линии
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", 'blue')// colorScale(obj.idw))
            .attr("stroke-width", 1)
            .attr("d", line);

        // Отображение линии
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", 'blue')// colorScale(obj.idw))
            .attr("stroke-width", 1)
            .attr("d", line);

        // Добавление подписей значений
        data.forEach(function (d) {
            svg.append("text")
                .attr("x", xScale(d.date) + xScale.bandwidth() / 2)
                .attr("y", yScale(d[nameChart]) - 10) // сдвиг на 10 пикселей вверх, чтобы текст не пересекался с точкой данных
                .text(d[nameChart])
                .attr("font-size", "10px")
                .attr("text-anchor", "middle");
        });
    }
}