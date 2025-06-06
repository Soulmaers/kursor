
import { SimpleEventEmitter } from '../../../Emitter.js'
import { Helpers } from './Helpers.js'
export class ChartsViewControll {
    constructor(arrayid) {
        this.objects = arrayid
        this.data = null
        this.originalData = null
        this.nameChart = 'probeg'
        this.elementList = document.querySelectorAll('.checkInList')
        this.params = document.querySelectorAll('.pointer_chart')
        this.params.forEach(el => el.addEventListener('click', this.getTitleChart.bind(this, el)))
        SimpleEventEmitter.on('check', this.render.bind(this));
        this.getDataSummary()
    }

    render() {
        this.getDataSummary()
    }
    getTitleChart(el) {
        const titleCharts = document.querySelector('.title_lower_charts')
        titleCharts.textContent = el.getAttribute('data-attribute')
        const nameChart = el.getAttribute('rel')
        this.nameChart = nameChart
        this.data.length !== 0 ? this.createChart() : null
    }
    //забираем даные за неделю и сортируем в массивы для графиков
    async getDataSummary() {
        const data = Helpers.getIntervalDate('Месяц')

        this.data = await Helpers.getRequestSummaryToBase(data, this.objects)
        const originalData = Helpers.controllActiveObject(Object.values(this.data))
        this.originalData = originalData
        let dataAndValue = {};
        for (let i = 0; i < originalData.length; i++) {
            const currentDate = originalData[i].data;
            const currentProbeg = originalData[i].probeg !== '-' && !isNaN(originalData[i].probeg) ? Number(originalData[i].probeg) : 0;
            const currentRashod = originalData[i].rashod !== '-' ? Number(originalData[i].rashod) : 0;
            const currentZapravka = originalData[i].zapravka !== '-' ? Number(originalData[i].zapravka) : 0;
            const currentdumpTrack = originalData[i].dumpTrack !== '-' ? Number(originalData[i].dumpTrack) : 0;
            const currentmoto = originalData[i].moto !== '-' ? Number(originalData[i].moto) : 0;
            const currentmedium = originalData[i].medium !== '-' && !isNaN(originalData[i].medium) ? Number(originalData[i].medium) : 0;
            const currentprostoy = originalData[i].prostoy !== '-' ? Number(originalData[i].prostoy) : 0;
            const currentjobTS = originalData[i].jobTS !== '-' ? Number(originalData[i].jobTS) : 0;
            if (!dataAndValue[currentDate]) {
                dataAndValue[currentDate] = {
                    date: currentDate.substring(5),
                    alldate: currentDate,
                    probeg: 0,
                    rashod: 0,
                    zapravka: 0,
                    dumpTrack: 0,
                    moto: 0,
                    mediumAll: 0,
                    mediumlength: 0,
                    madium: 0,
                    prostoy: 0,
                    timeJob: 0,
                    jobTS: 0
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
            dataAndValue[currentDate].jobTS += currentjobTS
        }
        let outputArray = Object.values(dataAndValue);
        const clickParams = document.querySelector('.clickToggle').parentElement.getAttribute('rel')
        this.data = outputArray
        const char = document.querySelector('.chart_global')
        outputArray.length !== 0 ? this.createChart(outputArray, clickParams) : char ? char.remove() : null

    }

    findTop(date, nameChart) {
        const login = document.querySelectorAll('.log')[1].textContent
        const objects = this.originalData.reduce((acc, e) => {
            if (e.data === date && e[nameChart] !== '-') {
                const clone = Object.assign({}, e); // Создаем поверхностную копию объекта e
                if (nameChart !== 'timeJob') {
                    clone[nameChart] = nameChart !== 'moto' ? Number(clone[nameChart]) : Number(clone[nameChart]) / 1000;
                    acc.push(clone);
                } else {
                    clone[nameChart] = clone.moto !== '-' && clone.prostoy !== '-' ? (clone.moto / 1000) - clone.prostoy : 0;
                    acc.push(clone);
                }
            }
            return acc;
        }, []);

        const sortedObjects = objects.sort((a, b) => b[nameChart] - a[nameChart]); // Sort objects in descending order based on e[nameChart]
        const topThree = sortedObjects.slice(0, 3).map(el => {
            return {
                company: login !== 'Курсор' ? el.company : 'Комания',
                nameCar: el.nameCar,
                [nameChart]: el[nameChart]
            }
        });

        return topThree
    }

    createChart(datas, nameCharts) {
        let nameChart;
        let data;
        if (datas && nameCharts) {
            nameChart = nameCharts
            data = datas
        }
        else {
            nameChart = this.nameChart
            data = this.data
        }
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
            .attr("width", content_lower_charts.clientWidth)
            .attr("height", (content_lower_charts.clientHeight + 10));

        const xScale = d3.scaleBand()
            .domain(data.map(function (d) { return d.date; }))
            .range([70, content_lower_charts.clientWidth - 110])
            .padding(0.03)
        //   .paddingInner(10)
        //  .paddingOuter(0)
        const self = this
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return d[nameChart]; })])
            .range([(content_lower_charts.clientHeight - 10), 20]);

        svg.append("g")
            .attr("transform", `translate(0, ${yScale(0)})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .attr("transform", `translate(70, 0)`)
            .call(nameChart !== 'moto' && nameChart !== 'prostoy' && nameChart !== 'timeJob' ? d3.axisLeft(yScale) : d3.axisLeft(yScale).tickFormat(function (d) {
                return Helpers.timesFormat(d)
            }))
        svg.selectAll('rect')
            .data(data)
            .enter().append('rect')
            .attr("x", d => xScale(d.date))
            .attr("y", d => yScale(d[nameChart]) + 10)
            .attr("height", d => (content_lower_charts.clientHeight - 20) - yScale(d[nameChart]))
            .attr("width", xScale.bandwidth())
            .attr("fill", "#336699")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .on('mouseenter', function (d) {
                if (nameChart !== 'jobTS') {
                    var maxCar = data.reduce((max, current) => current[nameChart] > max[nameChart] ? current : max);
                    const titleTop = self.findTop(d.alldate, nameChart)
                    var tooltip = svg.append('g')
                        .attr('id', 'tooltip')
                        .style('position', 'absolute')
                        .style('top', (d3.event.pageY - svg.node().getBoundingClientRect().top) + 'px')
                        .style('pointer-events', 'none')
                        .style('font-size', '10px')
                        .style('font-weight', '400')
                        .style('text-anchor', 'middle')
                        .attr('max-width', 230)
                        .attr('height', 60)

                    tooltip.append('rect')
                        .attr('fill', '#fff')
                        .attr('x', xScale(d.date) + xScale.bandwidth() / 2 - 115)
                        .attr('y', yScale(maxCar[nameChart]) + 80)
                        .attr('text-anchor', 'middle')
                        .attr('width', 230)
                        .attr('height', 60)
                        .attr('stroke', 'rgba(6, 28, 71, 1)')


                    tooltip.append('text')
                        .attr('fill', 'rgba(6, 28, 71, 1)')
                        .attr('x', xScale(d.date) + xScale.bandwidth() / 2)
                        .attr('y', yScale(maxCar[nameChart]) + 90)
                        .attr('text-anchor', 'middle')
                        .text('TOP 3');

                    for (let i = 0; i < 3; i++) {
                        tooltip.append('text')
                            .attr('fill', 'rgba(6, 28, 71, 1)')
                            .attr('x', xScale(d.date) + xScale.bandwidth() / 2)
                            .attr('y', yScale(maxCar[nameChart]) + 105 + i * 12)
                            .attr('text-anchor', 'middle')
                            .style('font-size', '0.6rem')
                            .text(`${titleTop[i].company}, ${titleTop[i].nameCar}, ${nameChart === 'moto' || nameChart === 'prostoy' || nameChart === 'timeJob' ?
                                Helpers.timesFormat(titleTop[i][nameChart]) : titleTop[i][nameChart]}`);
                    }
                }
            })
            .on('mouseleave', function () {
                svg.select('#tooltip').remove();
            });

        data.forEach(function (d) {
            svg.append("text")
                .attr("x", xScale(d.date) + xScale.bandwidth() / 2)
                .attr("y", yScale(d[nameChart]))
                .text(nameChart === 'moto' || nameChart === 'prostoy' || nameChart === 'timeJob' ? Helpers.timesFormat(d[nameChart]) : d[nameChart] !== 0 ? d[nameChart] : null)
                .attr("font-size", "10px")
                .attr("text-anchor", "middle")
                .attr('fill', 'rgba(6, 28, 71, 1)')
        });
    }


}