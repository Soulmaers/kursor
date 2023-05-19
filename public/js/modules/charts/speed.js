
import { fnTime } from '../grafiks.js'


export async function speed(t1, t2) {
    console.log('график скорости')

    const global = await fnTime(t1, t2)
    const gl = global[0].map(it => {
        return new Date(it)
    })
    const obj = gl.map((it, index) => ({
        time: it,
        val: global[1][index]
    }))

    const grafOld = document.querySelector('.infoGraf')
    if (grafOld) {
        grafOld.remove()
    }
    const graf = document.createElement('div')
    const grafics = document.querySelector('.grafics')
    graf.classList.add('infoGraf')
    grafics.appendChild(graf)
    const margin = { top: 100, right: 60, bottom: 30, left: 60 },
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;


    var svg = d3.select(".infoGraf")
        .append("svg")
        .attr('class', 'speed')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    // добавляем текстовый элемент
    svg.append("text")
        // позиционируем по центру в верхней части графика
        .attr("x", 350)
        .attr("y", -50)
        .style("font-size", "22px")
        // выравнивание по центру
        .attr("text-anchor", "middle")
        // добавляем текст
        .text("График скорости");

    svg.append("text")
        .attr("x", -130)
        .attr("y", -35)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "end")
        .text("Скорость, км/ч");


    var x = d3.scaleTime()
        .domain(d3.extent(obj, (d) => new Date(d.time)))
        .range([0, width])

    const xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .tickFormat(d3.timeFormat('%H:%M')));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(obj, function (d) { return +d.val; })])
        .range([height, 0]);
    const yAxis = svg.append("g")
        .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);


    // Create the line variable: where both the line and the brush take place
    var line = svg.append('g')
        .attr("clip-path", "url(#clip)")

    // Add the line
    line.append("path")
        .datum(obj)
        .attr("class", "line")  // I add the class line to be able to modify this line later on.
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return x(d.time) })
            .y(function (d) { return y(d.val) })
        )

    const preloaderGraf = document.querySelector('.loader') /* находим блок Preloader */
    preloaderGraf.style.opacity = 0;
    preloaderGraf.style.display = 'none'



    var brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("end", updateChart)
    line
        .append("g")
        .attr("class", "brush")
        .call(brush);
    var idleTimeout
    function idled() { idleTimeout = null; }
    function updateChart() {
        const extent = d3.event.selection
        if (!extent || Math.abs(x.invert(extent[1]) - x.invert(extent[0])) < 60000) {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350);
            x.domain([4, 8])
        } else {
            x.domain([x.invert(extent[0]), x.invert(extent[1])])
            line.select(".brush").call(brush.move, null)
        }
        xAxis.transition().duration(1000).call(d3.axisBottom(x))
        line
            .select('.line')
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(function (d) { return x(d.time) })
                .y(function (d) { return y(d.val) })
            )
    }

    // If user double click, reinitialize the chart
    svg.on("dblclick", function () {
        x.domain(d3.extent(obj, (d) => new Date(d.time)))
        xAxis.transition().call(d3.axisBottom(x))
        line
            .select('.line')
            .transition()
            .attr("d", d3.line()
                .x(function (d) { return x(d.time) })
                .y(function (d) { return y(d.val) })
            )

    });



    const tooltip = d3.select(".infoGraf").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const pat = svg.select('.line')
    console.log(pat)
    svg.on("mousemove", function (d) {
        // Определяем координаты курсора в отношении svg
        const [xPosition, yPosition] = d3.mouse(this);
        // Определяем ближайшую точку на графике
        const bisect = d3.bisector(d => d.time).right;
        const x0 = x.invert(xPosition);
        const i = bisect(obj, x0, 1);
        const d0 = obj[i - 1];
        const d1 = obj[i];
        d = x0 - d0.time > d1.time - x0 ? d1 : d0;
        /*
            // Обновить текст в тултипе
            if (d) {
              tooltip.select(".tooltip-text").text(`Дата: ${d.date}, значение: ${d.value}`);
            }*/

        // Позиционировать тултип относительно координат мыши
        const tooltipWidth = tooltip.node().getBoundingClientRect().width;
        console.log
        tooltip.style("left", `${xPosition + 100}px`);
        tooltip.style("top", `${yPosition + 100}px`);

        // Показать тултип, если он скрыт
        tooltip.style("display", "block");

        const selectedTime = timeConvert(d.time)
        // Отображаем подсказку с координатами и значениями по оси y
        tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
        tooltip.html(`Время: ${(selectedTime)}<br/>Скорость: ${d.val} км/ч`)
        // .style("top", `${yPosition + 50}px`)
        // .style("left", `${xPosition + 50}px`);
    })
        // Добавляем обработчик события mouseout, чтобы скрыть подсказку
        .on("mouseout", function (event, d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });




}
function timeConvert(d) {
    const date = new Date(d);
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeString = `${month} ${day}, ${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
    return timeString;
}