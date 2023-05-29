import { fnTime, fnPar, fnParMessage } from '../grafiks.js'



export async function oil(t1, t2) {
    console.log('график топлива')
    const active = document.querySelector('.color').id
    const global = await fnTime(t1, t2)
    const sensArr = await fnPar(active)
    const nameArr = await fnParMessage(active)
    const gl = global[0].map(it => {
        return new Date(it)
    })
    const allArrNew = [];
    nameArr.forEach((item) => {
        allArrNew.push({ sens: item[0], params: item[1], value: [] })
    })
    sensArr.forEach(el => {
        for (let i = 0; i < allArrNew.length; i++) {
            //    console.log(Object.values(el)[i])
            allArrNew[i].value.push(Object.values(el)[i])

        }
    })
    const finishArrayData = []
    allArrNew.forEach(e => {
        if (e.sens.startsWith('Бортовое') || e.sens.startsWith('Топливо')) {
            finishArrayData.push(e)
        }
    })
    const object = {}
    finishArrayData.forEach(el => {
        object.time = gl
        if (el.sens.startsWith('Топливо')) {
            object.left = el.value.map(it => {
                return it === -348201.3876 ? it = 0 : it
            })
        }
        else {
            object.right = el.value
        }
    })
    console.log(object)
    const data = object.time.map((t, i) => ({
        time: t,
        oil: Number(Number(object.left[i]).toFixed(0)),
        pwr: Number(Number(object.right[i]).toFixed(0))
    }))
    console.log(data)
    const grafOld = document.querySelector('.infoGraf')
    if (grafOld) {
        grafOld.remove()
    }
    const graf = document.createElement('div')
    const grafics = document.querySelector('.grafics')
    graf.classList.add('infoGraf')
    grafics.appendChild(graf)

    // устанавливаем размеры контейнера
    const margin = { top: 10, right: 60, bottom: 30, left: 60 },
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    // создаем svg контейнер
    const svg = d3.select(".infoGraf").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const titleGraf = document.createElement('div')
    titleGraf.classList.add('titleGraf')
    const infoGraf = document.querySelector('.infoGraf')
    infoGraf.prepend(titleGraf)
    titleGraf.textContent = 'Топливо/Бортовое питание'

    const svgLegend = d3.select('.titleGraf')
    const svga = svgLegend.append('svg')
        .attr("width", 350)
        .attr('height', 40)
        .append("g")
        .attr("transform", "translate(" + -180 + "," + 40 + ")")

    // добавляем подпись первой кривой
    svga.append("circle")
        .attr('class', 'legendOilcircle')
        .attr("r", 6)
        .attr("cx", 200)
        .attr("cy", -20)
        .attr("fill", "blue")
        .attr('stroke', 'black')

    svga.append("text")
        .attr('class', 'legendOil')
        .attr("x", 290)
        .attr("y", -15)
        .style("text-anchor", "end")
        .text("Топливо")
        .attr("fill", "black");

    // добавляем подпись второй кривой
    svga.append("circle")
        .attr('class', 'legendVoltcircle')
        .attr("r", 6)
        .attr("cx", 320)
        .attr("cy", -20)
        .attr("fill", "#32a885")
        .attr('stroke', 'black')

    svga.append("text")
        .attr('class', 'legendOil')
        .attr("x", 495)
        .attr("y", -15)
        .style("text-anchor", "end")
        .text("Бортовое питание")
        .attr("fill", "black");


    // задаем x-шкалу
    const x = d3.scaleTime()
        .domain(d3.extent(data, (d) => new Date(d.time)))
        .range([0, width])
    // задаем y-шкалу для первой оси y
    const y1 = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.oil)])
        .range([height, 0]);

    // задаем y-шкалу для второй оси y
    const y2 = d3.scaleLinear()
        .domain(d3.extent(data, (d) => d.pwr))
        .range([height, 0]);


    const yAxis1 = d3.axisLeft(y1)
    const yAxis2 = d3.axisLeft(y2)
    const xAxis = d3.axisBottom(x)

    const line1 = d3.line()
        .x((d) => x(d.time))
        .y((d) => y1(d.oil))
        .curve(d3.curveStepAfter);
    const line2 = d3.line()
        .x((d) => x(d.time))
        .y((d) => y2(d.pwr))
        .curve(d3.curveStepAfter);
    /*  const area1 = d3.area()
          .x(d => x(d.time))
          .y0(height)
          .y1(d => y1(d.oil))*/


    //const oilThreshold = 400;

    const area1 = d3.area()
        .x(d => x(d.time))
        .y0(height)
        .y1(d => y1(d.oil))
        .curve(d3.curveStepAfter);
    /*
        const area11 = d3.area()
            .x(d => x(d.time))
            .y0(height)
            .y1(d => d.oil < oilThreshold ? y1(d.oil) : height)
            .curve(d3.curveStepAfter);
    */




    const area2 = d3.area()
        .x(d => x(d.time))
        .y0(height)
        .y1(d => y2(d.pwr))
        .curve(d3.curveStepAfter);
    // добавляем ось x
    svg.append("g")
        .attr("class", "osx")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis
            .tickFormat(d3.timeFormat('%H:%M')));
    // добавляем первую ось y
    svg.append("g")
        .attr("class", "os1y")
        .call(yAxis1);
    // добавляем вторую ось y
    svg.append("g")
        .attr("class", "os2y")
        .attr("transform", "translate(" + width + ", 0)")
        .call(yAxis2)
        .selectAll(".tick text")
        .attr("x", '15')
        .style("text-anchor", "start")
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);


    var chartGroup = svg.append("g")
        .attr("class", "chart-group")
        .attr("clip-path", "url(#clip)");
    // добавляем линии для первой оси y
    chartGroup.append("path")
        .datum(data)
        .attr("class", "line1")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", line1);
    // добавляем линии для второй оси y
    chartGroup.append("path")
        .datum(data)
        .attr("class", "line2")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", line2);
    // добавляем области для первой кривой

    chartGroup.append("path")
        .datum(data)
        .attr("class", "area1")
        .attr("d", area1)
        .attr("fill", "blue")
        .attr("fill-opacity", 0.5)
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    /*
        chartGroup.append("path")
            .datum(data)
            .attr("class", "area11")
            .attr("d", area11)
            .attr("fill", "red")
            .attr("fill-opacity", 0.5)*/
    // добавляем области для второй кривой
    chartGroup.append("path")
        .datum(data)
        .attr("class", "pat")
        .attr("class", "area2")
        .attr("fill", "#32a885")
        .attr("fill-opacity", 0.8)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("d", area2);
    svg.append("text")
        .attr("class", 'obv')
        .attr("x", -130)
        .attr("y", -35)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "end")
        .text("Объем, л");
    svg.append("text")
        .attr("class", 'napr')
        .attr("x", -100)
        .attr("y", 730)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "end")
        .text("Напряжение, В")


    const preloaderGraf = document.querySelector('.loader') /* находим блок Preloader */
    preloaderGraf.style.opacity = 0;
    preloaderGraf.style.display = 'none'

    // Add brushing
    var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function
    // Add the brushing
    svg
        .append("g")
        .attr("class", "brush")
        .call(brush);
    // A function that set idleTimeOut to null
    var idleTimeout
    function idled() { idleTimeout = null; }
    function updateChart() {
        // What are the selected boundaries?
        const extent = d3.event.selection
        // If no selection or selection is too small, back to initial coordinate. Otherwise, update X axis domain
        if (!extent || Math.abs(x.invert(extent[1]) - x.invert(extent[0])) < 60000) { // проверяем, что расстояние между границами больше 1 минуты
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            //  x.domain([4, 8])
        } else {
            x.domain([x.invert(extent[0]), x.invert(extent[1])])
            svg.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        }
        // Update axis and line position
        svg.select("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat('%H:%M')))
            .transition().duration(1000).call(d3.axisBottom(x))
        svg.select('.line1')
            .datum(data)
            .transition()
            .duration(1000)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1.5)
            .attr("d", line1);

        svg.select('.line2')
            .datum(data)
            .transition()
            .duration(1000)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1.5)
            .attr("d", line2)

        svg.select(".area1")
            .datum(data)
            .transition()
            .duration(1000)
            .attr("fill", "blue")
            .attr("class", "pat")
            .attr("class", "area1")
            .attr("fill-opacity", d => d.oil < oilThreshold ? 0 : 0.5)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("d", area1)
        /*
                svg.select(".area11")
                    .datum(data)
                    .transition()
                    .duration(1000)
                    .attr("d", area11)
                    .attr("fill", "red")
                    .attr("fill-opacity", 0.5)
        */
        svg.select(".area2")
            .datum(data)
            .transition()
            .duration(1000)
            .attr("class", "pat")
            .attr("class", "area2")
            .attr("fill", "#32a885")
            .attr("fill-opacity", 0.3)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("d", area2)
    }


    // If user double click, reinitialize the chart
    svg.on("dblclick", function () {
        x.domain(d3.extent(data, (d) => new Date(d.time)))
        svg.select("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat('%H:%M')))
            .transition().call(d3.axisBottom(x))
        svg.select('.line1')
            .datum(data)
            .transition()
            .duration(1000)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1.5)
            .attr("d", line1)

        svg.select('.line2')
            .datum(data)
            .transition()
            .duration(1000)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1.5)
            .attr("d", line2)

        svg.select(".area1")
            .datum(data)
            .transition()
            .duration(1000)
            .attr("fill", "blue")
            .attr("class", "pat")
            .attr("class", "area1")
            .attr("fill-opacity", d => d.oil < oilThreshold ? 0 : 0.5)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("d", area1)
        /*
                svg.select(".area11")
                    .datum(data)
                    .transition()
                    .duration(1000)
                    .attr("d", area11)
                    .attr("fill", "red")
                    .attr("fill-opacity", 0.5)
        */
        svg.select(".area2")
            .datum(data)
            .transition()
            .duration(1000)
            .attr("class", "pat")
            .attr("class", "area2")
            .attr("fill", "#32a885")
            .attr("fill-opacity", 0.3)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("d", area2)
    });

    svg.on("mousemove", function (d) {
        // Определяем координаты курсора в отношении svg
        const [xPosition, yPosition] = d3.mouse(this);
        // Определяем ближайшую точку на графике
        const bisect = d3.bisector(d => d.time).right;
        const x0 = x.invert(xPosition);
        const i = bisect(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        d = x0 - d0.time > d1.time - x0 ? d1 : d0;

        const tooltip = d3.select(".infoGraf").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        svg.on("mousemove", function (d) {
            // Определяем координаты курсора в отношении svg
            const [xPosition, yPosition] = d3.mouse(this);
            // Определяем ближайшую точку на графике
            const bisect = d3.bisector(d => d.time).right;
            const x0 = x.invert(xPosition);
            const i = bisect(data, x0, 1);
            const d0 = data[i - 1];
            const d1 = data[i];
            d = x0 - d0.time > d1.time - x0 ? d1 : d0;

            tooltip.style("left", `${xPosition + 100}px`);
            tooltip.style("top", `${yPosition + 100}px`);
            // Показать тултип, если он скрыт
            tooltip.style("display", "block");
            const selectedTime = timeConvert(d.time)
            // Отображаем подсказку с координатами и значениями по оси y
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(`Время: ${(selectedTime)}<br/>Топливо: ${d.oil}<br/>Бортовое питание: ${d.pwr}`)
        })
            // Добавляем обработчик события mouseout, чтобы скрыть подсказку
            .on("mouseout", function (event, d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

    })

    const legendOil = document.querySelectorAll('.legendOil')
    console.log(legendOil[0])
    legendOil[0].addEventListener('click', () => {
        console.log('нажал топливо')
        const os1y = d3.select('.os1y')
        const line1 = d3.select('.line1')
        const area1 = d3.select('.area1')
        const area11 = d3.select('.area11')
        const obv = d3.select('.obv')
        const legendOilcircle = d3.select('.legendOilcircle')

        legendOil[0].classList.toggle('noActive')
        if (legendOil[0].classList.contains('noActive')) {
            console.log('удаляем легенда топливо')
            legendOilcircle.attr('fill', 'none')
            os1y.style("display", "none")
            line1.style("display", "none")
            area1.style("display", "none")
            area11.style("display", "none")
            obv.style("display", "none")
            return
        }
        legendOilcircle.attr('fill', 'blue')
        os1y.style("display", "block")
        line1.style("display", "block")
        area1.style("display", "block")
        area11.style("display", "block")
        obv.style("display", "block")
    })
    legendOil[1].addEventListener('click', () => {
        const os2y = d3.select('.os2y')
        const line2 = d3.select('.line2')
        const area2 = d3.select('.area2')
        const napr = d3.select('.napr')
        const legendVoltcircle = d3.select('.legendVoltcircle')
        legendOil[1].classList.toggle('noActive')
        if (legendOil[1].classList.contains('noActive')) {
            console.log('удаляем легенда напряжение')
            legendVoltcircle.attr('fill', 'none')
            os2y.style("display", "none")
            line2.style("display", "none")
            area2.style("display", "none")
            napr.style("display", "none")
            return
        }
        legendVoltcircle.attr('fill', '#32a885')
        os2y.style("display", "block")
        line2.style("display", "block")
        area2.style("display", "block")
        napr.style("display", "block")
    })
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