
import { initSummary } from '../../spisok.js'

export class ChartsViewControll {
    constructor() {
        this.elementList = document.querySelectorAll('.checkInList')
        this.params = document.querySelectorAll('.pointer_chart')

    }

    //забираем даные за неделю и сортируем в массивы для графиков
    async getDataSummary() {
        const data = initSummary.getIntervalDate('Неделя')
        const result = await initSummary.getRequestSummaryToBase(data)
        console.log(result)
        let datas = {};
        result.forEach(item => {
            // если в нашем итоговом объекте нет ключа, совпадающего с id, создаём его
            if (!datas[item.idw]) {
                datas[item.idw] = {
                    idw: item.idw,
                    probeg: [],
                    rashod: [],
                    zapravka: [],
                    data: []
                    // добавьте все необходимые свойства 
                };
            }
            // добавляем значение в соответствующий массив
            datas[item.idw].probeg.push(item.probeg);
            datas[item.idw].rashod.push(item.rashod);
            datas[item.idw].zapravka.push(item.zapravka);
            datas[item.idw].data.push(item.data);
            // добавьте все необходимые свойства 
        });

        const originalData = initSummary.controllActiveObject(Object.values(datas))
        const clickParams = document.querySelector('.clickToggle').getAttribute('rel')
        console.log(clickParams)
        //   this.createChart(originalData, clickParams)
        console.log(originalData)
    }


    createChart(data, nameChart) {
        const char = document.querySelector('.chart_global')
        if (char) {
            char.remove()
        }
        const content_lower_charts = document.querySelector('.content_lower_charts')
        const graf = document.createElement('div')
        graf.classList.add('chart_global')
        content_lower_charts.appendChild(graf)
        // Размеры графика
        var width = 1000;
        var height = 400;

        // Создание контейнера SVG
        var svg = d3.select(".chart_global")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Шкала x (даты)
        var xScale = d3.scaleTime()
            .domain([
                d3.min(data, function (d) { return new Date(d.data); }),
                d3.max(data, function (d) { return new Date(d.data); })
            ])
            .range([50, width - 50]);

        // Шкала y (probeg)
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return d.probeg; })])
            .range([height - 50, 50]);

        // Цвета линий
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        // Создание линий
        var line = d3.line()
            .x(function (d) { return xScale(new Date(d.data)); })
            .y(function (d) { return yScale(d.probeg); });

        // Добавление линий
        svg.selectAll(".line")
            .data(data)
            .enter()
            .append("path")
            .attr("class", "line")
            .attr("d", function (d) { return line([d]); })
            .style("stroke", function (d) { return color(d.id); });

        // Добавление осей
        svg.append("g")
            .attr("transform", "translate(0," + (height - 50) + ")")
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .attr("transform", "translate(50,0)")
            .call(d3.axisLeft(yScale));
    }
}