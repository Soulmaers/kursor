import { fnTime, fnPar, fnParMessage } from '../grafiks.js'
import { Tooltip } from '../../class/Tooltip.js'
import { testovfn } from './bar.js'
import { timesFormat } from '../startAllStatic.js'
//import { dostupObject } from '../../../../backend/services/database.service.js'


export async function oil(t1, t2) {
    console.log('график топлива')
    const active = document.querySelector('.color').id
    const nameCar = document.querySelector('.color').children[0].textContent
    console.log(nameCar)
    const ttt = await testovfn(active, t1, t2)
    const nameArr = await fnParMessage(active)
    const itogy = ttt.map(it => {
        return {
            id: it.idw,
            nameCar: it.nameCar,
            time: (new Date(it.data * 1000)).toISOString(),
            speed: it.speed,
            geo: JSON.parse(it.geo),
            val: JSON.parse(it.sens)
        }
    })
    console.log(itogy)
    const gl = itogy.map(it => {
        return new Date(it.time)
    })
    const geo = itogy.map(it => {
        return it.geo
    })
    const allArrNew = [];
    nameArr.forEach((item) => {
        allArrNew.push({ sens: item[0], params: item[1], value: [] })
    })
    const sensTest = itogy.map(e => {
        return e.val
    })
    sensTest.forEach(el => {
        for (let i = 0; i < allArrNew.length; i++) {
            allArrNew[i].value.push(Object.values(el)[i])
        }
    })

    //  const global = await fnTime(t1, t2)
    //   const sensArr = await fnPar(active)
    //  const nameArr = await fnParMessage(active)
    //   console.log(global)
    //  const gl = global[0].map(it => {
    //     return new Date(it)
    //  })
    //  const geo = global[2].map(it => {
    //     return it
    //  })
    // const allArrNew = [];
    /*  nameArr.forEach((item) => {
          allArrNew.push({ sens: item[0], params: item[1], value: [] })
      })
      sensArr.forEach(el => {
          for (let i = 0; i < allArrNew.length; i++) {
              //    console.log(Object.values(el)[i])
              allArrNew[i].value.push(Object.values(el)[i])
  
          }
      })*/

    const finishArrayData = []
    allArrNew.forEach(e => {
        if (e.sens.startsWith('Бортовое') || e.sens === 'Топливо' || e.sens === 'Топливо ДУТ') {
            finishArrayData.push(e)
        }
    })
    const object = {}
    finishArrayData.forEach(el => {
        object.time = gl
        object.geo = geo
        if (el.sens === 'Топливо' || el.sens === 'Топливо ДУТ') {
            object.left = el.value.map(it => {
                return it === -348201.3876 ? it = 0 : it
            })
        }
        else {
            object.right = el.value
        }
    })
    const data = object.time.map((t, i) => ({
        geo: object.geo[i],
        time: t,
        oil: object.left ? Number(object.left[i].toFixed(0)) : 0,
        pwr: object.right ? Number(object.right[i] != null ? Number(object.right[i]).toFixed(0) : 0) : null
    }))
    console.log(data);

    for (let i = 0; i < data.length - 1; i++) {
        if (data[i].oil === data[i + 1].oil) {
            data.splice(i, 1);
            i--; // уменьшаем индекс, чтобы не пропустить следующий объект после удаления
        }
    }
    console.log(data);
    const increasingIntervals = [];
    let start = 0;
    let end = 0;
    for (let i = 0; i < data.length - 1; i++) {
        const currentObj = data[i];
        const nextObj = data[i + 1];
        if (currentObj.oil < nextObj.oil) {
            if (start === end) {
                start = i;
            }
            end = i + 1;
        } else if (currentObj.oil > nextObj.oil) {
            if (start !== end) {
                increasingIntervals.push([data[start], data[end]]);
            }
            start = end = i + 1;
        }
    }
    if (start !== end) {
        increasingIntervals.push([data[start], data[end]]);
    }
    console.log(increasingIntervals)
    const zapravka = increasingIntervals.filter((interval, index) => {
        const firstOil = interval[0].oil;
        const lastOil = interval[interval.length - 1].oil;
        const difference = lastOil - firstOil;
        const threshold = firstOil * 0.05;
        if (index < increasingIntervals.length - 1) {
            const nextInterval = increasingIntervals[index + 1];
            const currentTime = interval[interval.length - 1].time;
            const nextTime = nextInterval[0].time;
            const timeDifference = nextTime - currentTime;
            if (timeDifference < 5 * 60 * 1000) {
                interval.push(nextInterval[nextInterval.length - 1]);
                interval.splice(1, 1)
            }
        }
        return firstOil > 5 && difference >= threshold;
    });
    for (let i = 0; i < zapravka.length - 1; i++) {
        if (zapravka[i][1].time === zapravka[i + 1][1].time) {
            zapravka.splice(i + 1, 1);
        }
    }
    console.log(data)
    console.log(zapravka)
    const rash = [];
    const firstData = data[0].oil;
    const lastData = data[data.length - 1].oil;
    if (zapravka.length !== 0) {
        rash.push(firstData - zapravka[0][0].oil);
        for (let i = 0; i < zapravka.length - 1; i++) {
            rash.push(zapravka[i][1].oil - zapravka[i + 1][0].oil);
        }
        rash.push(zapravka[zapravka.length - 1][1].oil - lastData);
    }
    else {
        rash.push(firstData - lastData)
    }


    const rashod = rash.reduce((el, acc) => el + acc, 0)
    console.log(rashod);
    console.log(zapravka)
    const objOil = zapravka.map(it => {
        //  const times = timesFormat((it[1].time.getTime() / 1000) - (it[0].time.getTime() / 1000))
        const oilValue = it[1].oil - it[0].oil
        console.log(oilValue)
        //   const one = times.slice(2)
        //   const time = one.split(":")[0]
        const date = new Date(it[0].time);
        const day = date.getDate();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
        // console.log(formattedDate);
        return { data: it[0].time, geo: it[0].geo, zapravka: oilValue, time: formattedDate, icon: "../../../image/refuel.png" }
    })

    const grafOld = document.querySelector('.infoGraf')
    if (grafOld) {
        grafOld.remove()
    }
    const graf = document.createElement('div')
    const grafics = document.querySelector('.grafics')
    graf.classList.add('infoGraf')
    grafics.appendChild(graf)
    const info = document.createElement('div')
    info.classList.add('infos')
    graf.prepend(info)

    // устанавливаем размеры контейнера
    const margin = { top: 10, right: 60, bottom: 50, left: 60 },
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
        .range([height - 40, 0]);

    // задаем y-шкалу для второй оси y
    const y2 = d3.scaleLinear()
        .domain(d3.extent(data, (d) => d.pwr))
        .range([height - 40, 0]);


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

    const area1 = d3.area()
        .x(d => x(d.time))
        .y0(height)
        .y1(d => y1(d.oil))
        .curve(d3.curveStepAfter);

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
        .call(yAxis1)
        .attr("transform", "translate(0, " + (40) + ")")
    //  .attr("transform", "translate(" + 0 + "," + (margin.top + 40) + ")"); //Сдвигаем вниз на высоту иконки
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
        .attr("d", line1)
        .attr("transform", "translate(0, " + (40) + ")")
    // добавляем линии для второй оси y
    chartGroup.append("path")
        .datum(data)
        .attr("class", "line2")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", line2)
        .attr("transform", "translate(0, " + (40) + ")")
    // добавляем области для первой кривой

    chartGroup.append("path")
        .datum(data)
        .attr("class", "area1")
        .attr("d", area1)
        .attr("fill", "blue")
        .attr("fill-opacity", 0.5)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("transform", "translate(0, " + (40) + ")")

    // добавляем области для второй кривой
    chartGroup.append("path")
        .datum(data)
        .attr("class", "pat")
        .attr("class", "area2")
        .attr("fill", "#32a885")
        .attr("fill-opacity", 0.8)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("d", area2)
        .attr("transform", "translate(0, " + (40) + ")")

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


    const tooltipOil = svg.append("text")
        .attr("class", "tooltipIcon")
        .style("opacity", 0);
    console.log(objOil)
    svg.selectAll("image")
        .data(objOil)
        .enter()
        .append("image")
        .attr('class', 'iconOil')
        .attr("x", d => x(new Date(d.data)))
        //.attr("y", d => y1(d.num) - 30)
        .attr("xlink:href", "../../../image/ref.png") // путь к иконке
        .attr("width", 24) // ширина вашей иконки
        .attr("height", 24) // высота вашей иконки
        .style("opacity", 0.5)
        .attr("transform", "translate(-12,0)")
        .on("click", function (d) {
            // Ваша функция обработчика события
            const mapss = document.getElementById('mapOil')
            if (this.classList.contains('clickOil')) {
                if (mapss) {
                    mapss.remove();
                }
                d3.select(this).style("opacity", 0.5);
                this.classList.remove('clickOil');
                return
            }
            const icons = document.querySelectorAll('.iconOil')
            icons.forEach(e => {
                e.style.opacity = 0.5;
                e.classList.remove('clickOil');
            })
            if (mapss) {
                mapss.remove();
            }
            d3.select(this).style("opacity", 1);
            this.classList.add('clickOil');
            const main = document.querySelector('.main')
            const maps = document.createElement('div')
            maps.classList.add('mapsOilCard')
            maps.setAttribute('id', 'mapOil')
            main.style.position = 'relative'
            maps.style.width = '300px';
            maps.style.height = '300px'
            maps.style.position = 'absolute'
            maps.style.left = '25px';
            maps.style.top = '500px';
            main.appendChild(maps)
            const map = L.map('mapOil')
            console.log(maps)
            var LeafIcon = L.Icon.extend({
                options: {
                    iconSize: [30, 30],
                    iconAnchor: [10, 18],
                    popupAnchor: [10, 0]
                }
            });

            var customIcon = new LeafIcon({
                iconUrl: '../../image/ref.png',
                iconSize: [20, 20],
                iconAnchor: [20, 20],
                popupAnchor: [10, 0],
                className: 'custom-marker-oil'
            });
            map.setView(d.geo, 15)
            map.flyTo(d.geo, 15)

            const iss = L.marker(d.geo, { icon: customIcon }).bindPopup(`Объект: ${nameCar}\nЗаправлено: ${d.zapravka} л.\nДата: ${d.time}`, { className: 'my-popup-oil' }).addTo(map);
            iss.getPopup().options.className = 'my-popup-oil'
            iss.on('mouseover', function (e) {
                this.openPopup();
            });
            iss.on('mouseout', function (e) {
                this.closePopup();
            });
            map.attributionControl.setPrefix(false)
            const leaf = document.querySelector('.leaflet-control-attribution');
            leaf.style.display = 'none';
            const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            L.control.scale().addTo(map);
            map.addLayer(layer);
            const ma = document.querySelector('.mapsOilCard')
            console.log(ma)
            map.on('zoomend', function () {
                map.panTo(center);
            });
        })
    /* .on("mousemove", function (d) {
         d3.select(this).style("opacity", 1);
         //  const tooltipOil = d3.select('.tooltipOil');
         tooltipOil.transition()
             .duration(200)
             .style("opacity", 1);
         tooltipOil.attr("x", x(new Date(d.data)) - 40)
             .attr("y", 20)
             .attr("text-anchor", "middle")
             .text('Заправка');
         const toll = document.querySelector('.tooltip')
         if (toll) {
             toll.remove();
         }
     })
     .on("mouseout", function (d) {
         d3.select(this).style("opacity", 0.5);
         // const tooltipOil = d3.select('.tooltipOil');
         const toll = document.querySelector('.tooltip')
         if (toll) {
             toll.remove();
         }
     });*/

    const preloaderGraf = document.querySelector('.loader') /* находим блок Preloader */
    preloaderGraf.style.opacity = 0;
    preloaderGraf.style.display = 'none'

    // Add brushing
    var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent([[0, 50], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart)
    var brushStartX = 0;
    brush.on("start", function () {
        brushStartX = d3.event.sourceEvent.clientX;
    });            // Each time the brush selection changes, trigger the 'updateChart' function
    // Add the brushing
    svg
        .append("g")
        .attr("class", "brush")
        .call(brush);
    // A function that set idleTimeOut to null
    var idleTimeout
    function idled() { idleTimeout = null; }
    const arrayDomain = [];
    function updateChart() {

        let leftToRight;
        var brushEndX = d3.event.sourceEvent.clientX;
        var selection = d3.event.selection;
        if (!brushStartX || !selection || !selection.length) {
            console.log("no direction, no selection");
        } else {
            brushEndX > brushStartX ? leftToRight = "left to right" : leftToRight = "right to left"
        }

        // What are the selected boundaries?
        const extent = d3.event.selection
        // If no selection or selection is too small, back to initial coordinate. Otherwise, update X axis domain
        if (!extent || Math.abs(x.invert(extent[1]) - x.invert(extent[0])) < 60000) { // проверяем, что расстояние между границами больше 1 минуты
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            //  x.domain([4, 8])
        } else {
            if (leftToRight === "left to right") {
                const [x0, x1] = extent.map(x.invert)
                console.log('прибавляем последний')
                arrayDomain.push([x0, x1])
                console.log(arrayDomain)
                x.domain([x.invert(extent[0]), x.invert(extent[1])])
                svg.select(".brush").call(brush.move, null)
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
                    .attr("fill-opacity", 0.5)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .attr("d", area1)

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
                //  svg.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done

            }
            else {
                const [x0, x1] = extent.map(x.invert)
                arrayDomain.pop()
                if (arrayDomain.length === 0) {
                    console.log('пустой массив')
                    x.domain(d3.extent(data, (d) => new Date(d.time)))
                    svg.select(".brush").call(brush.move, null)
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
                        .attr("fill-opacity", 0.5)
                        .attr("stroke", "black")
                        .attr("stroke-width", 1)
                        .attr("d", area1)

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
                else {

                    console.log('удаляем последний')
                    console.log(arrayDomain)
                    x.domain([arrayDomain[arrayDomain.length - 1][0], arrayDomain[arrayDomain.length - 1][1]])

                    svg.select(".brush").call(brush.move, null)
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
                        .attr("fill-opacity", 0.5)
                        .attr("stroke", "black")
                        .attr("stroke-width", 1)
                        .attr("d", area1)

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
                    //   svg.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
                }
            }
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
                .attr("fill-opacity", 0.5)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("d", area1)
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
    }

    svg.on("mousemove", function (d) {
        svg.on("mousemove", function (d) {
            const toll = document.querySelector('.tooltip')
            if (toll) {
                toll.remove();
            }

            const tooltip = d3.select(".infoGraf").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
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
            let oilTool;
            d.oil === 0 ? oilTool = 'Нет данных' : oilTool = d.oil
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(`Время: ${(selectedTime)}<br/>Топливо: ${oilTool}<br/>Бортовое питание: ${d.pwr}`)
        })
            // Добавляем обработчик события mouseout, чтобы скрыть подсказку
            .on("mouseout", function (event, d) {
                const tooltip = d3.select('.tooltip')
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    })
    const legendOil = document.querySelectorAll('.legendOil')
    const inf = document.querySelector('.infos')
    new Tooltip(inf, ['График отражает топливо и бортовое питание', 'Чтобы увеличить график, надо выделить область мышкой слева направо', 'Чтобы вернуть график в предыдущий масштаб, надо выделить область мышкой справа налево', 'Чтобы сбросить масштабирование, два раза кликните на график ']);
    new Tooltip(legendOil[0], ['Отключает и включает график топливо']);
    new Tooltip(legendOil[1], ['Отключает и включает график бортовое питание']);
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