
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
        const data = initSummary.getIntervalDate('Месяц')
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

        let dataAndValue = {};

        for (let i = 0; i < result.length; i++) {
            const currentDate = result[i].data;
            const currentProbeg = result[i].probeg;
            const currentRashod = result[i].rashod;
            const currentZapravka = result[i].zapravka;

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

        // Преобразуем объект в массив
        let outputArray = Object.values(dataAndValue);
        console.log(outputArray);
        const originalData = initSummary.controllActiveObject(Object.values(datas))
        const clickParams = document.querySelector('.clickToggle').getAttribute('rel')
        this.data = originalData
        //    this.createChart(originalData, clickParams)
        console.log(originalData)
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
        ;
    }
}