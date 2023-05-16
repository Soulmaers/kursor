


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
  // В каждом элементе создаем график
  charts.each(function (d, i) {
    const data = d; // данные для этого графика
    console.log(data)
    const chartContainer = d3.select(this); // div, в котором будет находиться график
    if (i === 0) {
      he = height + 60
      pad = 60
    }
    else if (i === count - 1) {
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
    // .tickFormat(d3.timeFormat('%H:%M')); // формат даты 

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
      //  .tickFormat(d3.timeFormat('%H:%M')); // формат даты
    }
    if (i === 0) {
      console.log(i)
      svg.append("text")
        .attr("x", 200)
        .attr("y", -40)
        .style("font-size", "22px")
        .attr("text-anchor", "middle")
        .text("Давление/Температура");


      // добавляем подпись первой кривой
      svg.append("circle")
        .attr("r", 6)
        .attr("cx", 100)
        .attr("cy", -25)
        .attr("fill", "#009933")
        .attr('stroke', 'black')

      svg.append("text")
        .attr("x", 180)
        .attr("y", -20)
        .style("text-anchor", "end")
        .text("Давление")
        .attr("fill", "black");

      // добавляем подпись второй кривой
      svg.append("circle")
        .attr("r", 6)
        .attr("cx", 220)
        .attr("cy", -25)
        .attr("fill", "blue")
        .attr('stroke', 'black')

      svg.append("text")
        .attr("x", 325)
        .attr("y", -20)
        .style("text-anchor", "end")
        .text("Температура")
        .attr("fill", "black");


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

    /*
  svg.append("text")
    .attr("x", -130)
    .attr("y", -35)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "end")
    .text("Объем, л");

  svg.append("text")
    .attr("x", -100)
    .attr("y", 730)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "end")
    .text("Напряжение, В")*/

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

    const tooltip = d3.select(".infoGraf").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    //const pat = svg.selectAll('.pat')
    // console.log(pat)
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

      // Обновить текст в тултипе
      if (d) {
        tooltip.select(".tooltip-text").text(`Дата: ${d.date}, значение: ${d.value}`);
      }

      // Позиционировать тултип относительно координат мыши
      const tooltipWidth = tooltip.node().getBoundingClientRect().width;
      console.log
      tooltip.style("left", `${xPosition + 100}px`);
      tooltip.style("top", `${yPosition + 100}px`);

      // Показать тултип, если он скрыт
      tooltip.style("display", "block");

      const selectedTime = timeConvert(d.dates)
      // Отображаем подсказку с координатами и значениями по оси y
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip.html(`Время: ${(selectedTime)}<br/>Давление: ${d.value} Бар<br/>Температура: ${d.tvalue} С°<br/>Скорость: ${d.speed} км/ч`)
      // .style("top", `${yPosition + 50}px`)
      // .style("left", `${xPosition + 50}px`);
    })
      // Добавляем обработчик события mouseout, чтобы скрыть подсказку
      .on("mouseout", function (event, d) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });


  });

  /*
  const yAxisName = d3.scaleBand()
    .range([0, height * global.series.length])
    .padding(1)
    .domain(global.series.map(({ sens }) => sens));
  const minValue = d3.min(global.series, ({ value }) => d3.min(value));
  const yAxisValue = d3.scaleLinear()
    .range([height, 0])
    .domain(minValue < 0 ? [minValue, d3.max(global.series, ({ value }) => d3.max(value))] : [0, d3.max(global.series, ({ value }) => d3.max(value))])
    .nice();


  const xScale = d3.scaleTime()
    .range([0, width])
    .domain(d3.extent(global.dates, d => new Date(d)));
  const area = d3.area().
    curve(d3.curveBasis)
    .x((d, i) => xScale(new Date(global.dates[i])))
    .y0(height)
    .y1(d => yAxisValue(d));
  const line = d3.line()
    .curve(d3.curveBasis)
    .x((d, i) => xScale(new Date(global.dates[i])))
    .y(d => yAxisValue(d));
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat('%H:%M')); // формат даты 
  const svg = d3.select('.infoGraf')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', margin.top + margin.bottom + height * global.series.length)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  const seriesGroup = svg.selectAll('.series-group')
    .data(global.series)
    .enter()
    .append('g')
    .attr('class', 'series-group')
    .attr('transform', (d, i) => `translate(0, ${yAxisName(d.sens)})`)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);
  seriesGroup.append('path')
    .attr('class', 'area')
    .attr('d', d => area(d.value))
    .attr('fill', 'steelblue')
    .attr('stroke', 'black')
    .attr('stroke-width', '1px')
  seriesGroup.append('path')
    .attr('class', 'line')
    .attr('d', d => line(d.value))
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', '1px')
  seriesGroup.append('text')
    .attr('class', 'series-name')
    .attr('x', -10)
    .attr('y', height / 2)
    .style('text-anchor', 'end')
    .style('font-size', '14px')
    .text(d => d.sens);
  const xAxisTicks = svg.append('g')
    .attr('transform', `translate(0, ${height * global.series.length})`)
    .call(xAxis);
  xAxisTicks.select('.domain').remove();
  xAxisTicks.selectAll('line')
    .attr('y2', 5)
    .attr('stroke', 'steelblue');
  xAxisTicks.selectAll('text')
    .style('text-anchor', 'middle')
    .style('font-size', '12px')
    .attr('dy', '1em')
    .attr('transform', 'rotate(0) translate(-10,20)');
  const bisect = d3.bisector(d => new Date(d)).left;
  const tooltip = svg.append('g')
    .attr('class', 'tooltipGraf')
    .style('display', 'none');
  tooltip.append('text') // добавляем текст для подсказки
    .attr('class', 'tooltipText')
    .attr('x', 15)
    .attr('dy', '3em')
    .style('font-size', '12px');


  svg.append("text")
    .attr("x", 200)
    .attr("y", 0)
    .style("font-size", "22px")
    .attr("text-anchor", "middle")
    .text("График давления");


  function mouseover() {
    tooltip.style('display', null);
  }

  function mousemove(d) {
    const [mouseX, mouseY] = d3.mouse(this);
    const xValue = xScale.invert(mouseX);
    const i = bisect(global.dates, xValue, 1);

    const selectedData = [{
      sens: d.sens,
      value: d.value[i],
      tvalue: d.tvalue[i],
      date: global.dates[i],
      speed: d.speed[i]
    }];
    console.log(selectedData)
    const selectedTime = timeConvert(selectedData[0].date)
    if (mouseX >= 0 && mouseX <= width
      && mouseY >= 0 && mouseY <= height) {
      console.log('подсказка')
      tooltip.selectAll('.tooltipText') // выбираем текст внутри tooltip
        .html(`Колесо: ${selectedData[0].sens}\nВремя: ${selectedTime}\nЗначение: ${selectedData[0].value} Бар, ${selectedData[0].tvalue} C°, Скорость:${selectedData[0].speed} км/ч `);
      tooltip.style('display', 'block') // показываем подсказку
      return
    }
    else {
      console.log('ничего')
    }
  }
  function mouseout() {
    tooltip.style('display', 'none');
  }
  */

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
  console.log(active)

  const global = await fnTime(t1, t2)
  const sensArr = await fnPar(active)
  const nameArr = await fnParMessage(active)
  // console.log(global)
  // console.log(sensArr)
  // console.log(nameArr)
  const gl = global[0].map(it => {
    return new Date(it)
  })

  //console.log(gl)
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
  // console.log(allArrNew)


  const finishArrayData = []
  //console.log(allArrNew)
  allArrNew.forEach(e => {
    if (e.sens.startsWith('Бортовое') || e.sens.startsWith('Топливо')) {
      //  console.log(e);
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
  const margin = { top: 100, right: 60, bottom: 30, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // создаем svg контейнер
  const svg = d3.select(".infoGraf").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  // задаем x-шкалу
  const x = d3.scaleTime()
    .domain(d3.extent(data, (d) => new Date(d.time)))
    .range([0, width])
  //   .tickFormat(d3.timeFormat('%H:%M')); // формат даты 

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


  // добавляем текстовый элемент
  svg.append("text")
    // позиционируем по центру в верхней части графика
    .attr("x", 350)
    .attr("y", -50)
    .style("font-size", "22px")
    // выравнивание по центру
    .attr("text-anchor", "middle")
    // добавляем текст
    .text("График Топливо/Бортовое питание");

  // добавляем ось x
  svg.append("g")
    .attr("class", "osx")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis
      .tickFormat(d3.timeFormat('%H:%M')));
  //  .tickFormat(d3.timeFormat('%H:%M')); // формат даты 
  // добавляем первую ось y
  svg.append("g")
    .attr("class", "os1y")
    .call(yAxis1);

  // добавляем вторую ось y
  svg.append("g")
    .attr("class", "os2y")
    .attr("transform", "translate(" + width + ", 0)")
    .call(yAxis2);


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


  // добавляем подпись первой кривой
  svg.append("circle")
    .attr('class', 'legendOilcircle')
    .attr("r", 6)
    .attr("cx", 200)
    .attr("cy", -30)
    .attr("fill", "blue")
    .attr('stroke', 'black')

  svg.append("text")
    .attr('class', 'legendOil')
    .attr("x", 270)
    .attr("y", -25)
    .style("text-anchor", "end")
    .text("Топливо")
    .attr("fill", "black");

  // добавляем подпись второй кривой
  svg.append("circle")
    .attr('class', 'legendVoltcircle')
    .attr("r", 6)
    .attr("cx", 300)
    .attr("cy", -30)
    .attr("fill", "#32a885")
    .attr('stroke', 'black')

  svg.append("text")
    .attr('class', 'legendOil')
    .attr("x", 445)
    .attr("y", -25)
    .style("text-anchor", "end")
    .text("Бортовое питание")
    .attr("fill", "black");




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
      //  .duration(1000)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 1.5)
      .attr("d", line1)

    svg.select('.line2')
      .datum(data)
      .transition()
      // .duration(1000)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 1.5)
      .attr("d", line2)

    svg.select(".area1")
      .datum(data)
      .transition()
      // .duration(1000)
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
      //  .duration(1000)
      .attr("class", "pat")
      .attr("class", "area2")
      .attr("fill", "#32a885")
      .attr("fill-opacity", 0.3)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("d", area2)
  });

  const tooltip = d3.select(".infoGraf").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  //const pat = svg.selectAll('.pat')
  // console.log(pat)
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

    // Обновить текст в тултипе
    if (d) {
      tooltip.select(".tooltip-text").text(`Дата: ${d.date}, значение: ${d.value}`);
    }

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
    tooltip.html(`Время: ${(selectedTime)}<br/>Топливо: ${d.oil}<br/>Бортовое питание: ${d.pwr}`)
    // .style("top", `${yPosition + 50}px`)
    // .style("left", `${xPosition + 50}px`);
  })
    // Добавляем обработчик события mouseout, чтобы скрыть подсказку
    .on("mouseout", function (event, d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });



  const legendOil = document.querySelectorAll('.legendOil')


  legendOil[0].addEventListener('click', () => {
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