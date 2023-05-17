import { fnTime, fnPar, fnParMessage } from '../grafiks.js'


export async function datas(t1, t2) {
    console.log('datas')
    const active = Number(document.querySelector('.color').id)
    const global = await fnTime(t1, t2)
    console.log(global)
    const sensArr = await fnPar(active)
    const nameArr = await fnParMessage(active)
    const allArrNew = [];
    nameArr.forEach((item) => {
        allArrNew.push({ sens: item[0], params: item[1], value: [] })
    })
    console.log(sensArr)
    sensArr.forEach(el => {
        for (let i = 0; i < allArrNew.length; i++) {
            allArrNew[i].value.push(Object.values(el)[i])

        }
    })
    const finishArrayData = []
    const finishArrayDataT = []
    allArrNew.forEach(e => {
        if (e.params.startsWith('tpms_p')) {
            finishArrayData.push(e)
        }
        if (e.params.startsWith('tpms_t')) {
            finishArrayDataT.push(e)
        }
    })
    finishArrayData.forEach((el, index) => {
        el.tvalue = finishArrayDataT[index].value
        el.speed = global[1]
    })
    grafikStartPress(global[0], finishArrayData)
    function grafikStartPress(times, datar) {
        const grafOld = document.querySelector('.infoGraf')
        if (grafOld) {
            grafOld.remove()
        }
        const graf = document.createElement('div')
        const grafics = document.querySelector('.grafics')
        graf.classList.add('infoGraf')
        grafics.appendChild(graf)
        console.log(datar)
        const newData = datar.map(el => {
            return {
                ...el,
                value: el.value.map(it => {
                    if (it === -348201.3876) {
                        return 0
                    } else {
                        return it
                    }
                }),
                tvalue: el.tvalue.map(it => {
                    if (it === -348201.3876 || it === -128) {
                        return 0
                    } else {
                        return it
                    }
                })
            };
        });

        const global = {
            dates: times,
            series: newData
        }
        const gl = times.map(it => {
            return new Date(it)
        })
        const dat2 = global.series.map(({ sens, value, tvalue, speed }) => ({
            sens,
            val: value.map((val, i) => ({
                dates: gl[i],
                value: Number(val),
                tvalue: Number(tvalue[i]),
                speed: Number(speed[i])
            }))
        }));

        // Выбираем div, в который мы хотим поместить графики
        const container = d3.select('.infoGraf');

        // Связываем данные с контейнером
        const charts = container.selectAll('.charts')
            .data(dat2)
            .enter()
            .append('div')
            .attr('class', 'chart');

        const margin = { top: 100, right: 60, bottom: 30, left: 260 },
            width = 700 - margin.left - margin.right,
            height = 45;

        const count = charts.size()
        console.log(count)
        let he;
        let pad;

        const tooltips = document.createElement('div')
        tooltips.classList.add('tooltips')
        const titleGraf = document.createElement('div')
        tooltips.classList.add('tooltips')
        titleGraf.classList.add('titleGraf')
        const infoGraf = document.querySelector('.infoGraf')
        infoGraf.prepend(titleGraf)

        titleGraf.textContent = 'Давление/Температура'
        infoGraf.appendChild(tooltips)
        const tt1 = document.createElement('div')
        const tt2 = document.createElement('div')
        const tt3 = document.createElement('div')
        const tt4 = document.createElement('div')
        tooltips.appendChild(tt1)
        tooltips.appendChild(tt2)
        tooltips.appendChild(tt3)
        tooltips.appendChild(tt4)

        const svgLegend = d3.select('.titleGraf')
        const svga = svgLegend.append('svg')
            .attr("width", 300)
            .attr('height', 40)
            .append("g")
            .attr("transform", "translate(" + -70 + "," + 40 + ")")
        svga.append("circle")
            .attr('class', 'barGraf')
            .attr("r", 6)
            .attr("cx", 100)
            .attr("cy", -25)
            .attr("fill", "#009933")
            .attr('stroke', 'black')
        svga.append("text")
            .attr('class', 'legendBar')
            .attr("x", 200)
            .attr("y", -20)
            .style("text-anchor", "end")
            .text("Давление")
            .attr("fill", "black");
        // добавляем подпись второй кривой
        svga.append("circle")
            .attr('class', 'tempGraf')
            .attr("r", 6)
            .attr("cx", 220)
            .attr("cy", -25)
            .attr("fill", "blue")
            .attr('stroke', 'black')
        svga.append("text")
            .attr('class', 'legendBar')
            .attr("x", 345)
            .attr("y", -20)
            .style("text-anchor", "end")
            .text("Температура")
            .attr("fill", "black");
        tooltips.style.display = 'none'
        // В каждом элементе создаем график
        charts.each(function (d, i) {
            const data = d; // данные для этого графика
            console.log(data)
            const chartContainer = d3.select(this); // div, в котором будет находиться график

            if (i === count - 1) {
                he = height + 30
                pad = 0
            }
            else {
                he = height
                pad = 0
            }
            // создаем svg контейнер
            const svg = chartContainer.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr('height', he)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + pad + ")")
            // задаем x-шкалу
            const x = d3.scaleTime()
                .domain(d3.extent(data.val, (d) => new Date(d.dates)))
                .range([0, width])
            // задаем y-шкалу для первой оси y
            const y1 = d3.scaleLinear()
                .domain(d3.extent(data.val, (d) => d.value))
                .range([height, 0]);
            // задаем y-шкалу для второй оси y
            const y2 = d3.scaleLinear()
                .domain(d3.extent(data.val, (d) => d.tvalue))
                .range([height, 0]);
            const yAxis1 = d3.axisLeft(y1)
            const yAxis2 = d3.axisLeft(y2)
            const xAxis = d3.axisBottom(x)
            const line1 = d3.line()
                .x((d) => x(d.dates))
                .y((d) => y1(d.value))
            const line2 = d3.line()
                .x((d) => x(d.dates))
                .y((d) => y2(d.tvalue))
            const area1 = d3.area()
                .x(d => x(d.dates))
                .y0(height)
                .y1(d => y1(d.value))
            const area2 = d3.area()
                .x(d => x(d.dates))
                .y0(height)
                .y1(d => y2(d.tvalue))
            // добавляем текстовый элемент
            const u = 0;
            if (i === count - 1) {
                console.log(i)
                // добавляем ось x
                svg.append("g")
                    .attr("class", "osx")
                    .attr("transform", "translate(" + u + "," + (height) + ")")
                    .attr('height', 300)
                    .call(xAxis
                        .tickFormat(d3.timeFormat('%H:%M')));
            }
            // добавляем первую ось y
            svg.append("g")
                .attr("class", "os1y")
            // .call(yAxis1);
            // добавляем вторую ось y
            svg.append("g")
                .attr("class", "os2y")
                .attr("transform", "translate(" + width + ", 0)")
            // .call(yAxis2);
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
                .datum(data.val)
                .attr("class", "line1")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 1.5)
                .attr("d", line1);
            // добавляем линии для второй оси y
            chartGroup.append("path")
                .datum(data.val)
                .attr("class", "line2")
                .attr("fill", "none")
                .attr("stroke", "blue")
                .attr("stroke-width", 2)
                .attr("d", line2);
            // добавляем области для первой кривой
            chartGroup.append("path")
                .datum(data.val)
                .attr("fill", "#009933")
                .attr("class", "pat")
                .attr("class", "area1")
                .attr("fill-opacity", 1)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("d", area1);
            // добавляем области для второй кривой
            chartGroup.append("path")
                .datum(data.val)
                .attr("fill", "none")
                .attr("class", "pat")
                .attr("class", "area2")
                .attr("fill-opacity", 0.3)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("d", area2);
            svg.append("text")
                .attr("x", -130)
                .attr("y", 30)
                .attr("transform", "rotate(0)")
                .attr("text-anchor", "middle")
                .text(`${d.sens}`);
            // Add brushing
            var brush = d3.brushX()
                .extent([[0, 0], [width, height]])
                .on("end", updateChart)
            svg
                .append("g")
                .attr("class", "brush")
                .call(brush);
            var idleTimeout
            function idled() { idleTimeout = null; }
            function updateChart() {
                const extent = d3.event.selection
                if (!extent || Math.abs(x.invert(extent[1]) - x.invert(extent[0])) < 60000) {
                    if (!idleTimeout) return idleTimeout = setTimeout(idled, 350);
                    //  x.domain([4, 8])
                } else {
                    x.domain([x.invert(extent[0]), x.invert(extent[1])])
                    svg.select(".brush").call(brush.move, null)
                }
                d3.select('.osx')
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x)
                        .tickFormat(d3.timeFormat('%H:%M')))
                    .transition().duration(1000).call(d3.axisBottom(x))
                svg.select('.line1')
                    .datum(data.val)
                    .transition()
                    .duration(1000)
                    .attr("fill", "none")
                    .attr("stroke", "black")
                    .attr("stroke-width", 1.5)
                    .attr("d", line1);

                svg.select('.line2')
                    .datum(data.val)
                    .transition()
                    .duration(1000)
                    .attr("fill", "none")
                    .attr("stroke", "blue")
                    .attr("stroke-width", 2)
                    .attr("d", line2)

                svg.select(".area1")
                    .datum(data.val)
                    .transition()
                    .duration(1000)
                    .attr("fill", "#009933")
                    .attr("class", "pat")
                    .attr("class", "area1")
                    .attr("fill-opacity", 1)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .attr("d", area1)

                svg.select(".area2")
                    .datum(data.val)
                    .transition()
                    .duration(1000)
                    .attr("class", "pat")
                    .attr("class", "area2")
                    .attr("fill", "none")
                    .attr("fill-opacity", 0.3)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .attr("d", area2)
            }


            // If user double click, reinitialize the chart
            svg.on("dblclick", function () {
                x.domain(d3.extent(data.val, (d) => new Date(d.dates)))
                d3.select('.osx')
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x)
                        .tickFormat(d3.timeFormat('%H:%M')))
                    .transition().call(d3.axisBottom(x))
                svg.select('.line1')
                    .datum(data.val)
                    .transition()
                    //  .duration(1000)
                    .attr("fill", "none")
                    .attr("stroke", "black")
                    .attr("stroke-width", 1.5)
                    .attr("d", line1)

                svg.select('.line2')
                    .datum(data.val)
                    .transition()
                    // .duration(1000)
                    .attr("fill", "none")
                    .attr("stroke", "blue")
                    .attr("stroke-width", 2)
                    .attr("d", line2)

                svg.select(".area1")
                    .datum(data.val)
                    .transition()
                    // .duration(1000)
                    .attr("fill", "#009933")
                    .attr("class", "pat")
                    .attr("class", "area1")
                    .attr("fill-opacity", 1)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .attr("d", area1)
                svg.select(".area2")
                    .datum(data.val)
                    .transition()
                    //  .duration(1000)
                    .attr("class", "pat")
                    .attr("class", "area2")
                    .attr("fill", "none")
                    .attr("fill-opacity", 0.3)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .attr("d", area2)
            });
            svg.on("mousemove", function (d) {
                // Определяем координаты курсора в отношении svg
                const [xPosition, yPosition] = d3.mouse(this);
                // Определяем ближайшую точку на графике
                const bisect = d3.bisector(d => d.dates).right;
                const x0 = x.invert(xPosition);
                const i = bisect(data.val, x0, 1);
                const d0 = data.val[i - 1];
                const d1 = data.val[i];
                d = x0 - d0.dates > d1.dates - x0 ? d1 : d0;
                // Показать тултип, если он скрыт
                tooltips.style.display = 'block'
                const selectedTime = timeConvert(d.dates)
                // Обновить текст в тултипе
                if (d) {
                    tt1.textContent = `Время: ${(selectedTime)}`
                    tt2.textContent = `Давление: ${d.value} Бар`
                    tt3.textContent = `Температура: ${d.tvalue} С°`
                    tt4.textContent = `Скорость: ${d.speed} км/ч`
                }
                tooltips.style.left = `${xPosition + 300}px`
                tooltips.style.top = `${yPosition + 300}px`
            })
                // Добавляем обработчик события mouseout, чтобы скрыть подсказку
                .on("mouseout", function (event, d) {
                    tooltips.style.display = 'none'
                });


        });
        const legendBar = document.querySelectorAll('.legendBar')
        legendBar[0].addEventListener('click', () => {
            console.log('нажал давление')
            const line1 = d3.selectAll('.line1')
            const area1 = d3.selectAll('.area1')
            const legendBarCircle = d3.select('.barGraf')
            legendBar[0].classList.toggle('noActive')
            if (legendBar[0].classList.contains('noActive')) {
                legendBarCircle.attr('fill', 'none')
                line1.style("display", "none")
                area1.style("display", "none")
                return
            }
            legendBarCircle.attr('fill', '#009933')
            line1.style("display", "block")
            area1.style("display", "block")
        })
        legendBar[1].addEventListener('click', () => {
            const line2 = d3.selectAll('.line2')
            const area2 = d3.selectAll('.area2')
            const legendBarCircle = d3.select('.tempGraf')
            legendBar[1].classList.toggle('noActive')
            if (legendBar[1].classList.contains('noActive')) {
                legendBarCircle.attr('fill', 'none')
                line2.style("display", "none")
                area2.style("display", "none")
                return
            }
            legendBarCircle.attr('fill', 'blue')
            line2.style("display", "block")
            area2.style("display", "block")
        })
    }
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