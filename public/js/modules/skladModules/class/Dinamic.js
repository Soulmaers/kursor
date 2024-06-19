
import { RequestStaticMetods } from "./RequestStaticMetods.js"
import { Helpers } from "./Helpers.js"
export class Dinamic {
    constructor(data, container, monitoring) {
        this.data = data
        this.containerCard = container
        this.monitoring = monitoring
    }

    async init() {
        await this.getHistoryData()
        this.uniqueDataWithPrice = Helpers.addStruktura(this.data, this.historyWheel)
        this.chartLine(this.data.probeg_passport, this.data.protektor_passport)

    }

    async getHistoryData() {
        this.historyWheel = await RequestStaticMetods.getHistoryTyresidTyres(this.data.idw_tyres)
    }


    clearContainer() {
        // Удаляем все элементы внутри контейнера
        const elem = this.containerCard.querySelector('.tooltip_tochka')
        if (elem) elem.remove()
        d3.select(this.containerCard.querySelector('.child_chart')).select('.chart_wheel').remove();
    }

    chartLine(probegPassport, protektorPassport) {
        this.clearContainer();
        const lastZamer = Math.floor(parseFloat(this.uniqueDataWithPrice[this.uniqueDataWithPrice.length - 1].minN)
            / parseFloat(this.uniqueDataWithPrice[this.uniqueDataWithPrice.length - 1].protektorOneKM));
        const self = this;
        var width = 360;
        var height = 280;
        var margin = { top: 20, right: 30, bottom: 20, left: 30 };
        var graphWidth = width - margin.left - margin.right;
        var graphHeight = height - margin.top - margin.bottom;

        // Создание svg элемента
        const svg = d3.select(this.containerCard.querySelector('.child_chart')).append("svg")
            .attr("width", width)
            .attr('class', 'chart_wheel')
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        const moreMileage = this.uniqueDataWithPrice.find(el => el.probegNow > probegPassport)
        const ocX = moreMileage ? moreMileage.probegNow : null
        // Масштабирование осей
        var x = d3.scaleLinear().range([0, graphWidth - 20]).domain([0, moreMileage ? Number(ocX + 20000) : probegPassport]);
        var y = d3.scaleLinear().range([graphHeight, 0]).domain([1, protektorPassport]);

        // Ось x
        var xAxis = d3.axisBottom(x)//.ticks(5)
            .tickFormat(d => d / 1000);
        svg.append("g")
            .attr("transform", "translate(0," + graphHeight + ")")
            .call(xAxis);

        // Ось y
        var yAxis = d3.axisLeft(y).ticks(10);
        svg.append("g").call(yAxis);
        // Подпись оси X
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", graphWidth + 30) // Сдвиг вправо от конца оси X
            .attr("y", graphHeight + 15)
            .style("font-weight", "bold")
            .text("10")
            .append("tspan")
            .attr("dy", "-0.5em")
            .attr("font-size", "0.8em")
            .style("font-weight", "bold")
            .text("3")
            .append("tspan")
            .attr("dy", "0.2em")
            .attr("dx", "0.2em")
            .style("font-weight", "bold")
            .text("км");

        // Подпись оси Y
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(0)")
            .attr("y", -10) // Сдвиг вверх от конца оси Y
            .attr("x", -5) // Сдвиг влево от конца оси Y
            .style("font-weight", "bold")
            .text("мм");

        // Линия по точкам из uniqueDataWithPrice
        const line = d3.line()
            .x(d => x(d.probegNow))
            .y(d => y(d.minN));

        svg.append("path")
            .datum(this.uniqueDataWithPrice)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        // фактический тренд прогноз
        svg.append("line")
            .attr("x1", x(0))
            .attr("y1", y(protektorPassport))
            .attr("x2", x(lastZamer))
            .attr("y2", y(1))
            .style("stroke", "darkred")
            .attr("stroke-dasharray", "5,5")
            .attr("stroke-width", 1.5);

        // фактический тренд
        svg.append("line")
            .attr("x1", x(0))
            .attr("y1", y(protektorPassport))
            .attr("x2", x(probegPassport))
            .attr("y2", y(1))
            .style("stroke", "blue")
            .attr("stroke-dasharray", "5,5")
            .attr("stroke-width", 1.5);

        // Создание тултипа как HTML элемента
        const tooltip = d3.select(this.containerCard.querySelector('.analitika_wheel')).append("div")
            .attr("class", "tooltip_tochka")
            .style("position", "absolute")
            .style("opacity", 0)

        for (let i = 1; i <= 2; i++) {
            const tooltipElement = tooltip.append("div").classed(`tooltip_element tooltip_element${i}`, true);
            tooltipElement.append("div").classed(`tooltip_element_title tooltip_element${i}_title`, true);
            tooltipElement.append("div").classed(`tooltip_element_value tooltip_element${i}_value`, true);
            tooltipElement.append("div").classed(`tooltip_element_value_otklonenie tooltip_element${i}_value_otklonenie`, true);
        }
        for (let i = 0; i < this.uniqueDataWithPrice.length - 1; i++) {
            const segmentData = {
                current: this.uniqueDataWithPrice[i],
                next: this.uniqueDataWithPrice[i + 1]
            };
            svg.append("line")
                .attr("class", "segment")
                .attr("x1", x(this.uniqueDataWithPrice[i].probegNow))
                .attr("y1", y(this.uniqueDataWithPrice[i].minN))
                .attr("x2", x(this.uniqueDataWithPrice[i + 1].probegNow))
                .attr("y2", y(this.uniqueDataWithPrice[i + 1].minN))
                .attr('data-id', this.uniqueDataWithPrice[i + 1].id)
                .style("stroke", "blue")
                .style('cursor', 'pointer')
                .attr("stroke-width", 2.5)
                .on("click", function (event) {
                    if (self.monitoring) {
                        const otklonenieProtektor = ((segmentData.next.protektorOneKMLine - segmentData.current.defaultProtektor) / segmentData.current.defaultProtektor * 100).toFixed(1);
                        const otkloneniePrice = ((segmentData.next.priceOneKMLine - segmentData.current.defaultPrice) / segmentData.current.defaultPrice * 100).toFixed(1);
                        d3.selectAll(".segment").attr("stroke-width", 2.5);
                        d3.select(this).attr("stroke-width", 4);
                        tooltip.style("opacity", 1)
                        self.setTooltipText(tooltip.select(".tooltip_element1"), "Стоимость пробега за 1 км:", `${segmentData.next.priceOneKMLine} руб.`, otkloneniePrice);
                        self.setTooltipText(tooltip.select(".tooltip_element2"), "Износ протектора за 1 км:", `${segmentData.next.protektorOneKMLine} мм`, otklonenieProtektor);
                    }
                })

        }
        // Отметки точками на линии
        svg.selectAll(".dot")
            .data(this.uniqueDataWithPrice)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.probegNow))
            .attr("cy", d => y(d.minN))
            .attr('data-id', d => d.id)
            .attr("r", 4)
            .style("fill", "white")
            .style('cursor', 'pointer')
            .style("stroke", "green")
            .on("click", function (d) {
                if (self.monitoring) {
                    svg.selectAll(".dot")
                        .style("fill", "white")
                        .attr("r", 4);

                    // Окрашиваем выбранную точку в зеленый и увеличиваем размер
                    d3.select(this)
                        .style("fill", "green")
                        .attr("r", 5);
                    const otklonenieProtektor = ((d.protektorOneKM - d.defaultProtektor) / d.defaultProtektor * 100).toFixed(1);
                    const otkloneniePrice = ((d.priceOneKM - d.defaultPrice) / d.defaultPrice * 100).toFixed(1);
                    const event = d3.event; // Использование d3.event для получения события
                    tooltip.style("opacity", 1);
                    self.setTooltipText(tooltip.select(".tooltip_element1"), "Стоимость пробега за 1 км:", `${d.priceOneKM} руб.`, otkloneniePrice);
                    self.setTooltipText(tooltip.select(".tooltip_element2"), "Износ протектора за 1 км:", `${d.protektorOneKM} мм`, otklonenieProtektor);
                }
            })
        if (this.monitoring) this.lastDot(svg, tooltip)
    }


    lastDot(svg, tooltip) {
        // Покраска последней точки и добавление тултипа
        const lastIndex = this.uniqueDataWithPrice.length - 1;
        const lastPoint = this.uniqueDataWithPrice[lastIndex];
        tooltip.style("opacity", 1);
        // Окрашиваем последнюю точку
        const lastCircle = svg.select(`circle[data-id='${lastPoint.id}']`);
        lastCircle
            .style("fill", "green")
            .attr("r", 5);

        // Вычисляем отклонения для последней точки
        const lastOtklonenieProtektor = ((lastPoint.protektorOneKM - lastPoint.defaultProtektor) / lastPoint.defaultProtektor * 100).toFixed(1);
        const lastOtkloneniePrice = ((lastPoint.priceOneKM - lastPoint.defaultPrice) / lastPoint.defaultPrice * 100).toFixed(1);

        // Устанавливаем текст тултипа для последней точки
        tooltip.style("opacity", 1);
        this.setTooltipText(tooltip.select(".tooltip_element1"), "Стоимость пробега за 1 км:", `${lastPoint.priceOneKM} руб.`, lastOtkloneniePrice);
        this.setTooltipText(tooltip.select(".tooltip_element2"), "Износ протектора за 1 км:", `${lastPoint.protektorOneKM} мм`, lastOtklonenieProtektor);

    }
    setTooltipText(element, title, value, percentage) {
        element.select(".tooltip_element_title").text(title);
        element.select(".tooltip_element_value").text(`${value}`);
        const znak = Number(percentage) > 0 ? '+' : ''
        const percentageElement = element.select(".tooltip_element_value_otklonenie").text(`${znak}${percentage} %`);
        if (percentage > 0) {
            percentageElement.style("color", "red");
        } else if (percentage < 0) {
            percentageElement.style("color", "green");
        } else {
            percentageElement.style("color", "black");
        }
    }

}