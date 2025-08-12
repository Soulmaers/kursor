

(async function () {

    function getChartDataByName(name, mapFn = null) {
        const item = window.chartData.find(e => e?.name === name);
        if (!Array.isArray(item?.result)) return [];
        return typeof mapFn === 'function' ? item.result.map(mapFn) : item.result;
    }

    const time = getChartDataByName('Дата и время', d => +d * 1000);
    const origin = getChartDataByName('Обработанные значения', d => +d);
    const filtered = getChartDataByName('Исходные значения', d => +d);
    const traveling = getChartDataByName('Движение');
    const moto = getChartDataByName('Работа двигателя');
    const iconOil = getChartDataByName('Заправки');
    const iconRefill = getChartDataByName('Сливы');

    const width = 1100;
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    const svg = d3.select(".chart_oil")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const x = d3.scaleTime()
        .domain(d3.extent(time, d => new Date(d)))
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, d3.max([...origin]) || 1])
        .nice()
        .range([height - margin.bottom, margin.top]);




    // добавляем прямоугольники на фоне
    if (moto.length > 0) {
        console.log(moto)
        svg.selectAll(".moto_rect")
            .data(moto)
            .enter()
            .append("rect")
            .attr("class", "moto_rect")
            .attr("x", d => x(new Date(d[0].time * 1000))) // преобразуем Unix-время
            .attr("width", d => {
                const start = new Date(d[0].time * 1000);
                const end = new Date(d[1].time * 1000);
                return x(end) - x(start);
            })
            .attr("y", margin.top)
            .attr("height", height - margin.top - margin.bottom)
            .attr("fill", "rgb(255,209,215)");

    }

    if (traveling.length > 0) {
        svg.selectAll(".travel_rect")
            .data(traveling)
            .enter()
            .append("rect")
            .attr("class", "travel_rect")
            .attr("x", d => x(new Date(d[0].time * 1000))) // преобразуем Unix-время
            .attr("width", d => {
                const start = new Date(d[0].time * 1000);
                const end = new Date(d[1].time * 1000);
                return x(end) - x(start);
            })
            .attr("y", margin.top)
            .attr("height", height - margin.top - margin.bottom)
            .attr("fill", "rgb(183, 170, 14)");
    }


    const line = d3.line()
        .x((d, i) => x(new Date(time[i])))
        .y(d => y(d));

    // Линия filtered
    if (filtered.length > 1) {
        svg.append("path")
            .datum(filtered)
            .attr("class", "line")
            .attr("stroke", "red")
            .attr("d", line)
            .attr("fill", "none")
    }

    // Линия origin
    if (origin.length > 1) {
        svg.append("path")
            .datum(origin)
            .attr("class", "line")
            .attr("stroke", "blue")
            .attr("d", line)
            .attr("fill", "none")
    }



    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .attr("class", "axis")
        .call(d3.axisBottom(x).ticks(10).tickFormat(d3.timeFormat("%H:%M")));

    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom + 20) + ")")
        .attr('class', 'axis2')
        .call(d3.axisBottom(x)
            .ticks(10)
            .tickFormat(function (d) {
                return d3.timeFormat("%d.%m")(d);
            })
        )
        .style("stroke-width", 0)

    svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(5));

    svg.append("text")
        .attr("class", 'obv')
        .attr("x", -height / 2 + 40)
        .attr("y", 15)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "end")
        .text("Объем, л");

    addIconImages(iconRefill, window.iconDrainBase64, -20);   // Сливы
    addIconImages(iconOil, window.iconRefillBase64, -20); // Заправки

    function addIconImages(iconData, base64, yOffset = 0) {
        const container = document.querySelector('.chart_oil');
        iconData.forEach(d => {
            const xPos = x(new Date(+d.time * 1000)) - 8; // Центрирование
            const yPos = margin.top + yOffset;

            const img = document.createElement('img');
            img.src = 'data:image/png;base64,' + base64;
            img.style.position = 'absolute';
            img.style.left = `${xPos}px`;
            img.style.top = `${yPos}px`;
            img.style.width = '16px';
            img.style.height = '16px';

            container.appendChild(img);
        });
    }
})();