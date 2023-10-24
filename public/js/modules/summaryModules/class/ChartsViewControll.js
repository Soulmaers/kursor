
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
        this.data.length !== 0 ? this.createChart(this.data, nameChart) : null
    }
    //забираем даные за неделю и сортируем в массивы для графиков
    async getDataSummary() {
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
            const currentdumpTrack = originalData[i].dumpTrack;
            const currentmoto = originalData[i].moto;
            const currentmedium = originalData[i].medium;
            const currentprostoy = originalData[i].prostoy;
            if (!dataAndValue[currentDate]) {
                dataAndValue[currentDate] = {
                    date: currentDate.substring(5),
                    probeg: 0,
                    rashod: 0,
                    zapravka: 0,
                    dumpTrack: 0,
                    moto: 0,
                    mediumAll: 0,
                    mediumlength: 0,
                    madium: 0,
                    prostoy: 0,
                    timeJob: 0
                };
            }

            dataAndValue[currentDate].probeg += currentProbeg; // суммируем текущий probeg с предыдущими значениями
            dataAndValue[currentDate].rashod += currentRashod;
            dataAndValue[currentDate].zapravka += currentZapravka
            dataAndValue[currentDate].dumpTrack += currentdumpTrack
            dataAndValue[currentDate].moto += currentmoto / 1000
            dataAndValue[currentDate].prostoy += currentprostoy
            dataAndValue[currentDate].timeJob += currentmoto / 1000 - currentprostoy
            dataAndValue[currentDate].mediumlength += currentmedium !== 0 ? 1 : 0
            dataAndValue[currentDate].mediumAll += currentmedium
            dataAndValue[currentDate].medium = parseFloat((dataAndValue[currentDate].mediumAll / dataAndValue[currentDate].mediumlength).toFixed(0))
        }
        let outputArray = Object.values(dataAndValue);
        console.log(outputArray)
        const clickParams = document.querySelector('.clickToggle').parentElement.getAttribute('rel')
        this.data = outputArray
        console.log(this.data)
        const char = document.querySelector('.chart_global')
        outputArray.length !== 0 ? this.createChart(outputArray, clickParams) : char.remove()

    }

    //форматируем секунды в часыи минуты
    timesFormat(dates) {
        const totalSeconds = Math.floor(dates);
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        const motoHours = `${hours}:${minutes}`;
        return motoHours;
    }

    createChart(data, nameChart) {
        console.log(data)
        console.log(nameChart)

        const char = document.querySelector('.chart_global')
        if (char) {
            char.remove()
        }

        const content_lower_charts = document.querySelector('.content_lower_charts')
        const graf = document.createElement('div')
        graf.classList.add('chart_global')
        content_lower_charts.appendChild(graf)

        const svg = d3.select(".chart_global")
            .append("svg")
            .attr("width", 1400)
            .attr("height", 400);

        const xScale = d3.scaleBand()
            .domain(data.map(function (d) { return d.date; }))
            .range([70, 1300])
            .padding(0.03)
        //   .paddingInner(10)
        //  .paddingOuter(0)
        const self = this
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return d[nameChart]; })])
            .range([350, 20]);

        svg.append("g")
            .attr("transform", `translate(0, ${yScale(0)})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .attr("transform", `translate(70, 0)`)
            .call(nameChart !== 'moto' ? d3.axisLeft(yScale) : d3.axisLeft(yScale).tickFormat(function (d) {
                return self.timesFormat(d)
            }))



        // Create bar chart by adding a rectangle for each data point
        svg.selectAll('rect')
            .data(data)
            .enter().append('rect')
            .attr("x", d => xScale(d.date))
            .attr("y", d => yScale(d[nameChart]))
            .attr("height", d => 350 - yScale(d[nameChart])) //substract yScale from chart height to flip chart
            .attr("width", xScale.bandwidth()) //1300 / data.length)
            .attr("fill", "none")
            .attr("stroke", "rgba(6, 28, 71, 1)")
            .attr("stroke-width", 1)
        data.forEach(function (d) {
            svg.append("text")
                .attr("x", xScale(d.date) + xScale.bandwidth() / 2)
                .attr("y", yScale(d[nameChart]) - 10)
                .text(nameChart == 'moto' ? self.timesFormat(d[nameChart]) : d[nameChart])
                .attr("font-size", "10px")
                .attr("text-anchor", "middle")
                .attr('fill', 'rgba(6, 28, 71, 1)')
        });
    }
}