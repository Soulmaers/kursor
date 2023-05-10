


export async function datas() {
  const menuGraf = document.querySelectorAll('.menu_graf')
  menuGraf[0].classList.add('activMenuGraf')


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
    .attr('transform', (d, i) => `translate(0, ${yAxisName(d.sens)})`);
  seriesGroup.append('path')
    .attr('class', 'area')
    .attr('d', d => area(d.value))
    .attr('fill', 'steelblue').attr('stroke', 'black')
    .attr('stroke-width', '1px')
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);

  // добавляем контур для каждой области графика
  seriesGroup.append('path')
    .attr('class', 'line')
    .attr('d', d => line(d.value))
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', '1px')

  seriesGroup.append('text').attr('class', 'series-name')
    .attr('x', -10).attr('y', height / 2).style('text-anchor', 'end').style('font-size', '14px').text(d => d.sens);
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
    const x = xScale.invert(d3.mouse(this)[0]);
    const i = bisect(global.dates, x, 1);
    console.log(x)
    console.log(i)
    const selectedData = [{
      sens: d.sens,
      value: d.value[i],
      date: global.dates[i]
    }];
    console.log(selectedData)
    const selectedTime = timeConvert(selectedData[0].date)
    tooltip.selectAll('.tooltipText') // выбираем текст внутри tooltip
      .html(`"Колесо": ${selectedData[0].sens}\n"Время": ${selectedTime}\n"Значение": ${selectedData[0].value}'Бар'`);

    tooltip.style('display', 'block') // показываем подсказку
    // .style('left', (d3.event.pageX + 10) + "px")
    // .style('top', (d3.event.pageY - 28) + "px");
  }
  function mouseout() {
    tooltip.style('display', 'none');
  }
}


function timeConvert(d) {
  const date = new Date(d);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const timeString = hours + ":" + (minutes < 10 ? "0" : "") + minutes;
  return timeString
}