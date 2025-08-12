(async function () {
    //   window.chartData.forEach((monthData, index) => {
    const chartData = window.chartData;              // массив объектов [{ date: '...', mileage: ... }]
    const containerId = window.chartContainerId;

    // const date = (monthData.data.filter(e => e.name === 'Начало').map(e => (e.result)))[0]
    // const mileage = (this.data.filter(e => e.name === 'Пробег').map(e => (e.result)))[0]


    const width = 1200;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + 60 + "," + 30 + ")");





    const barWidth = 30;

    const axisMax = d3.max(chartData, d => +d.mileage);
    const xScale = d3.scaleBand()
        .domain(chartData.map(d => d.date))
        .range([0, chartData.length * 36 + 5])



    const yScale = d3.scaleLinear()
        .domain([0, axisMax * 1.05])
        .range([(height - 60), 0]);

    const tiksX = svg.append("g")
        .attr("transform", "translate(0," + (height - 60) + ")")
        .call(d3.axisBottom(xScale));

    tiksX.selectAll('text')
        .style("fill", function (d) {

            const newDate = new Date(d.split(".").reverse().join("-")).getDay();
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

    svg.append("text")
        .attr("y", -25)
        .attr("x", -7)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("км")
        .style('color', 'rgba(6, 28, 71, 1)')
    // Добавляем последний тик для максимального значения
    const ticks = yScale.ticks(14); // Получаем 10 тиков для оси
    ticks[ticks.length - 1] = axisMax

    svg.append("g")
        .attr("transform", "translate(0, " + (0) + ")")
        .call(d3.axisLeft(yScale).tickValues(ticks))

    svg.selectAll('rect')
        .data(chartData)
        .enter().append('rect')
        .attr("x", d => xScale(d.date) + 8)
        .attr("y", d => yScale(d.mileage))
        .attr("height", d => (height - 60) - yScale(d.mileage))
        .attr("width", barWidth)
        .attr("fill", "#336699")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)

    chartData.forEach(function (d) {
        svg.append("text")
            .attr("x", xScale(d.date) + xScale.bandwidth() / 2 + 4)
            .attr("y", yScale(d.mileage) - 10)
            .text(d.mileage)
            .attr("font-size", "10px")
            .attr("text-anchor", "middle")
            .attr('fill', 'rgba(6, 28, 71, 1)')
    });


    //   })
})();
