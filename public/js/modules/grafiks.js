


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

}




async function fnTime(t1, t2) {
  const active = Number(document.querySelector('.color').id)
  console.log(t1, t2)
  let timeOld;
  let timeNow;
  if (t1 === undefined && t2 === undefined) {
    const currentDate = new Date();
    timeNow = Math.floor(currentDate.getTime() / 1000);
    const yesterdayDate = new Date();
    yesterdayDate.setHours(yesterdayDate.getHours() - 24);
    timeOld = Math.floor(yesterdayDate.getTime() / 1000);
  }
  else {
    timeOld = t1
    timeNow = t2
  }
  return new Promise(function (resolve, reject) {
    const prms2 = {
      "itemId": active,
      "timeFrom": timeOld,
      "timeTo": timeNow,
      "flags": 1,
      "flagsMask": 1,
      "loadCount": 60000
    }
    const remote2 = wialon.core.Remote.getInstance();
    remote2.remoteCall('messages/load_interval', prms2,
      async function (code, result) {
        if (code) {
          console.log(wialon.core.Errors.getErrorText(code));
        }
        console.log(result)
        const global = [];
        const speed = []
        result.messages.forEach(el => {
          const timestamp = el.t;
          const date = new Date(timestamp * 1000);
          const isoString = date.toISOString();
          global.push(isoString)
          speed.push(el.pos.s)
          resolve([global, speed])
        })
      })
  })
}

async function fnPar(active) {
  console.log('fnpar')
  return new Promise(function (resolve, reject) {
    const prms3 = {
      "source": "",
      "indexFrom": 0,
      "indexTo": 60000,
      "unitId": active,
      "sensorId": 0
    };
    const remote3 = wialon.core.Remote.getInstance();
    remote3.remoteCall('unit/calc_sensors', prms3,
      function (code, result) {
        if (code) {
          console.log(wialon.core.Errors.getErrorText(code));
        }
        const sensArr = result;
        resolve(sensArr)
      })
  })
}

async function fnParMessage(active) {
  return new Promise(function (resolve, reject) {
    const prmss = {
      'id': active,
      'flags': 4096
    }
    const remote11 = wialon.core.Remote.getInstance();
    remote11.remoteCall('core/search_item', prmss,
      async function (code, result) {
        if (code) {
          console.log(wialon.core.Errors.getErrorText(code));
        }
        const nameArr = [];
        Object.entries(result.item.sens).forEach(el => {
          nameArr.push([el[1].n, el[1].p])
        })
        resolve(nameArr)
      })
  })
}

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
    width = 800 - margin.left - margin.right,
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
    .domain(d3.extent(data, (d) => d.oil))
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
  const line2 = d3.line()
    .x((d) => x(d.time))
    .y((d) => y2(d.pwr))
  const area1 = d3.area()
    .x(d => x(d.time))
    .y0(height)
    .y1(d => y1(d.oil))
  const area2 = d3.area()
    .x(d => x(d.time))
    .y0(height)
    .y1(d => y2(d.pwr))
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
    .attr("stroke", "blue")
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
    .attr("fill", "blue")
    .attr("class", "pat")
    .attr("class", "area1")
    .attr("fill-opacity", 0.3)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("d", area1);
  // добавляем области для второй кривой
  chartGroup.append("path")
    .datum(data)
    .attr("class", "pat")
    .attr("class", "area2")
    .attr("fill", "#32a885")
    .attr("fill-opacity", 0.3)
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
      .attr("fill-opacity", 0.3)
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
      .attr("fill-opacity", 0.3)
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
    const obv = d3.select('.obv')
    const legendOilcircle = d3.select('.legendOilcircle')

    legendOil[0].classList.toggle('noActive')
    if (legendOil[0].classList.contains('noActive')) {
      console.log('удаляем легенда топливо')
      legendOilcircle.attr('fill', 'none')
      os1y.style("display", "none")
      line1.style("display", "none")
      area1.style("display", "none")
      obv.style("display", "none")
      return
    }
    legendOilcircle.attr('fill', 'blue')
    os1y.style("display", "block")
    line1.style("display", "block")
    area1.style("display", "block")
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