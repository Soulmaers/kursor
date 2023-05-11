


export async function datas() {
  //const menuGraf = document.querySelectorAll('.menu_graf')
  // menuGraf[0].classList.add('activMenuGraf')


  const active = document.querySelector('.color').id
  console.log(active)

  const global = await fnTime(active)
  const sensArr = await fnPar(active)
  const nameArr = await fnParMessage(active)
  console.log(global)
  console.log(sensArr)
  console.log(nameArr)

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
  allArrNew.forEach(e => {
    if (e.params.startsWith('tpms_p')) {
      //    console.log(e);
      finishArrayData.push(e)
    }
  })
  console.log(global, finishArrayData)
  grafikStartPress(global, finishArrayData)
}





async function fnTime(active) {
  // текущая дата
  const currentDate = new Date();
  // Unix-время текущей даты
  const currentUnixTime = Math.floor(currentDate.getTime() / 1000);

  // текущая дата минус 24 часа
  const yesterdayDate = new Date();
  yesterdayDate.setHours(yesterdayDate.getHours() - 24);
  // Unix-время даты "вчера"
  const yesterdayUnixTime = Math.floor(yesterdayDate.getTime() / 1000);

  console.log(currentUnixTime);
  console.log(yesterdayUnixTime);
  return new Promise(function (resolve, reject) {
    const prms2 = {
      "itemId": active,
      "timeFrom": yesterdayUnixTime,
      "timeTo": currentUnixTime,
      "flags": 1,
      "flagsMask": 65281,
      "loadCount": 8271
    }

    const remote2 = wialon.core.Remote.getInstance();
    remote2.remoteCall('messages/load_interval', prms2,
      async function (code, result) {
        if (code) {
          console.log(wialon.core.Errors.getErrorText(code));
        }
        console.log(result)

        const global = [];
        const press = []
        result.messages.forEach(el => {
          const timestamp = el.t;
          const date = new Date(timestamp * 1000);
          const isoString = date.toISOString();
          // console.log(isoString); // "2023-05-03T08:41:57.000Z"
          global.push(isoString)
          press.push(el.p.tpms_pressure_1)
          //  console.log(global)
          resolve(global)
        })


      })
  })
}

async function fnPar(active) {
  return new Promise(function (resolve, reject) {
    const prms3 = {
      "source": "",
      "indexFrom": 0,
      "indexTo": 8271,
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
        console.log(sensArr)
        resolve(sensArr)
        //  console.log(sensArr)
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

  const newData = datar.map(el => {
    return {
      ...el,
      value: el.value.map(it => {
        if (it === -348201.3876) {
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
  console.log(global)
  /*
    const newOnjData = datar.reduce((result, item) => {
      for (let i = 0; i < item.value.length; i++) {
        result[i] = result[i] || {};
        result[i][item.sens] = item.value[i];
      }
      return result;
    }, []);
  
    newOnjData.forEach((el, index) => {
      el.time = times[index].time
  
    })
    console.log(newOnjData)
  */



  const margin = { top: 50, right: 50, bottom: 50, left: 240 };
  const width = 800 - margin.left - margin.right;
  const height = 150 - margin.top - margin.bottom;

  const yAxisName = d3.scaleBand()
    .range([0, height * global.series.length])
    .padding(1)
    .domain(global.series.map(({ sens }) => sens));

  const yAxisValue = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(global.series, ({ value }) => d3.max(value))])
    .nice();
  const svg = d3.select('.infoGraf')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', margin.top + margin.bottom + height * global.series.length)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


  // добавляем текстовый элемент
  svg.append("text")
    // позиционируем по центру в верхней части графика
    .attr("x", 200)
    .attr("y", 0)
    .style("font-size", "22px")
    // выравнивание по центру
    .attr("text-anchor", "middle")
    // добавляем текст
    .text("График давления");



  const xScale = d3.scaleTime()
    .range([0, width])
    .domain(d3.extent(global.dates, d => new Date(d)));


  const area = d3.area().curve(d3.curveBasis).x((d, i) => xScale(new Date(global.dates[i]))).y0(height).y1(d => yAxisValue(d));
  const line = d3.line().curve(d3.curveBasis).x((d, i) => xScale(new Date(global.dates[i]))).y(d => yAxisValue(d));
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat('%H:%M')); // формат даты 



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
    .attr('fill', 'steelblue').attr('stroke', 'black')
    .attr('stroke-width', '1px')


  // добавляем контур для каждой области графика
  seriesGroup.append('path')
    .attr('class', 'line')
    .attr('d', d => line(d.value))
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', '1px')

  seriesGroup.append('text').attr('class', 'series-name')
    .attr('x', -10)
    .attr('y', height / 2)
    .style('text-anchor', 'end')
    .style('font-size', '14px')
    .text(d => d.sens);

  const xAxisTicks = svg.append('g')
    .attr('transform', `translate(0, ${height * global.series.length})`)
    .call(xAxis);
  xAxisTicks.select('.domain').remove();
  xAxisTicks.selectAll('line').attr('y2', 5).attr('stroke', 'steelblue');
  xAxisTicks.selectAll('text').style('text-anchor', 'middle').style('font-size', '12px').attr('dy', '1em').attr('transform', 'rotate(0) translate(-10,20)');



  const bisect = d3.bisector(d => new Date(d)).left;
  const tooltip = svg.append('g')
    .attr('class', 'tooltipGraf')
    .style('display', 'none');

  tooltip.append('text') // добавляем текст для подсказки
    .attr('class', 'tooltipText')
    .attr('x', 15)
    .attr('dy', '3em')
    .style('font-size', '12px');

  function mouseover() {
    tooltip.style('display', null);
  }

  function mousemove(d) {
    // const x = xScale.invert(d3.mouse(this)[0]);
    const [mouseX, mouseY] = d3.mouse(this);
    const xValue = xScale.invert(mouseX);
    const i = bisect(global.dates, xValue, 1);

    const selectedData = [{
      sens: d.sens,
      value: d.value[i],
      date: global.dates[i]
    }];
    console.log(selectedData)
    const selectedTime = timeConvert(selectedData[0].date)
    console.log(0)
    console.log(width)
    console.log(0)
    console.log(height)
    console.log(mouseX)
    console.log(mouseY)
    if (mouseX >= 0 && mouseX <= width
      && mouseY >= 0 && mouseY <= height) {
      console.log('подсказка')
      tooltip.selectAll('.tooltipText') // выбираем текст внутри tooltip
        .html(`"Колесо": ${selectedData[0].sens}\n"Время": ${selectedTime}\n"Значение": ${selectedData[0].value}'Бар'`);
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



















export async function oil() {
  console.log('график топлива')


  const grafOld = document.querySelector('.infoGraf')
  if (grafOld) {
    grafOld.remove()
  }
  const graf = document.createElement('div')
  const grafics = document.querySelector('.grafics')
  graf.classList.add('infoGraf')
  grafics.appendChild(graf)


  const data = [
    { time: new Date('2021-09-01T00:00:00'), left: 18, right: 20 },
    { time: new Date('2021-09-02T14:00:00'), left: 15, right: 25 },
    { time: new Date('2021-09-03T06:18:00'), left: 20, right: 40 },
    { time: new Date('2021-09-04T00:00:00'), left: 25, right: 38 },
    { time: new Date('2021-09-05T00:00:00'), left: 30, right: 42 },
    { time: new Date('2021-09-06T00:00:00'), left: 25, right: 31 },
    { time: new Date('2021-09-07T20:10:00'), left: 20, right: 30 },
    { time: new Date('2021-09-08T00:00:00'), left: 15, right: 25 },
    { time: new Date('2021-09-09T00:00:00'), left: 10, right: 20 }
  ];
  // устанавливаем размеры контейнера
  const margin = { top: 20, right: 30, bottom: 30, left: 40 },
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // создаем svg контейнер
  const svg = d3.select(".infoGraf").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // задаем x-шкалу
  const x = d3.scaleTime()
    .domain(d3.extent(data, (d) => d.time))
    .range([0, width]);

  // задаем y-шкалу для первой оси y
  const y1 = d3.scaleLinear()
    .domain(d3.extent(data, (d) => d.left))
    .range([height, 0]);

  // задаем y-шкалу для второй оси y
  const y2 = d3.scaleLinear()
    .domain(d3.extent(data, (d) => d.right))
    .range([height, 0]);

  // добавляем ось x
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // добавляем первую ось y
  svg.append("g")
    .call(d3.axisLeft(y1));

  // добавляем вторую ось y
  svg.append("g")
    .attr("transform", "translate(" + width + ", 0)")
    .call(d3.axisRight(y2));

  // добавляем линии для первой оси y
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x((d) => x(d.time))
      .y((d) => y1(d.left))
    );

  // добавляем линии для второй оси y
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x((d) => x(d.time))
      .y((d) => y2(d.right))
    );


  // добавляем области для первой кривой
  svg.append("path")
    .datum(data)
    .attr("fill", "blue")
    .attr("fill-opacity", 0.3)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("d", d3.area()
      .x(d => x(d.time))
      .y0(height)
      .y1(d => y1(d.left))
    );

  // добавляем области для второй кривой
  svg.append("path")
    .datum(data)
    .attr("fill", "#32a885")
    .attr("fill-opacity", 0.3)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("d", d3.area()
      .x(d => x(d.time))
      .y0(height)
      .y1(d => y2(d.right))
    );
  // добавляем подпись первой кривой
  svg.append("circle")
    .attr("r", 6)
    .attr("cx", width - 200)
    .attr("cy", y1(data[data.length - 1].left) - 340)
    .attr("fill", "blue")
    .attr('stroke', 'black')

  svg.append("text")
    .attr("x", width - 114)
    .attr("y", y1(data[data.length - 1].left) - 334)
    .style("text-anchor", "end")
    .text("Топливо")
    .attr("fill", "black");

  // добавляем подпись второй кривой
  svg.append("circle")
    .attr("r", 6)
    .attr("cx", width - 200)
    .attr("cy", y2(data[data.length - 1].right) - 320)
    .attr("fill", "#32a885")
    .attr('stroke', 'black')

  svg.append("text")
    .attr("x", width - 40)
    .attr("y", y2(data[data.length - 1].right) - 314)
    .style("text-anchor", "end")
    .text("Бортовое питание")
    .attr("fill", "black");

  const tooltip = d3.select(".infoGraf").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


  svg.on("mousemove", function (d) {
    // Определяем координаты курсора в отношении svg
    const [xPosition, yPosition] = d3.mouse(this);
    // const xPosition = event.clientX - left;
    //const yPosition = event.clientY - top;

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
    tooltip.style("left", `${xPosition - tooltipWidth / 2}px`);
    tooltip.style("top", `${yPosition - 50}px`);

    // Показать тултип, если он скрыт
    tooltip.style("display", "block");

    const selectedTime = timeConvert(d.time)
    // Отображаем подсказку с координатами и значениями по оси y
    tooltip.transition()
      .duration(200)
      .style("opacity", 0.9);
    tooltip.html(`Время: ${(selectedTime)}<br/>Топливо: ${d.left}<br/>Бортовое питание: ${d.right}`)
      .style("top", `${yPosition}px`)
      .style("left", `${xPosition}px`);
  })

    // Добавляем обработчик события mouseout, чтобы скрыть подсказку
    .on("mouseout", function (event, d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });


}

