

import { loadParamsViewList, conturTest } from './spisok.js'
import { checkCreate } from './admin.js'





//0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178-токен основной

export function init(kluch) {
    wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com");
    wialon.core.Session.getInstance().loginToken(kluch, "", // try to login
        function (code) {
            if (code) {
                return;
            }

            zapros() //делаем запрос на wialon получаем объекты
            //  setInterval(zapros, 3000)
            //  console.log('после')
        });
};

const wrapContaint = document.querySelector('.wrapper_containt')
const cont = document.createElement('div')
cont.classList.add('container2')
wrapContaint.appendChild(cont);
export let dann;


export function zapros() {
    const tiresActiv = document.querySelector('.tiresActiv')
    if (tiresActiv) {
        tiresActiv.remove()
    }
    //  console.log('работаем запрос')
    const flagsT = 1 + 1024// + 1024//4096
    const prmsT = {
        "spec": {
            "itemsType": "avl_unit_group",
            "propName": "sys_name",
            "propValueMask": "*",
            "sortType": "sys_name"
        },
        "force": 1,
        "flags": flagsT,
        "from": 0,
        "to": 0xffffffff
    };
    const remoteT = wialon.core.Remote.getInstance();
    remoteT.remoteCall('core/search_items', prmsT,
        async function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            //  console.log(result)
            await result
            const aLLmassObject = [];
            let Allcountr = 0;
            result.items.forEach(elem => {
                Allcountr++
                const nameGroup = elem.nm
                const nameObject = elem.u
                //    console.log(nameGroup)
                const massObject = [];
                let countr = 0;
                nameObject.forEach(el => {
                    //   console.log(el)
                    const prms2 = {
                        "id": el,
                        "flags": 1025
                    };
                    const remote3 = wialon.core.Remote.getInstance();
                    remote3.remoteCall('core/search_item', prms2,
                        async function (code, result) {
                            if (code) {
                                console.log(wialon.core.Errors.getErrorText(code));
                            }
                            //  console.log(result)
                            const arr3 = await result
                            //   console.log(arr3)
                            if (!arr3.item.nm) {
                                return
                            }
                            const objects = arr3.item.nm
                            const prob = await loadParamsViewList(objects, el)
                            // console.log(prob)
                            const role = document.querySelectorAll('.log')[0].textContent
                            const login = document.querySelectorAll('.log')[1].textContent
                            const massObjectCar = await dostupObject(login)
                            if (massObjectCar.includes(prob[0].message.replace(/\s+/g, ''))) {
                                massObject.push(prob)
                            }
                            //   console.log(massObject)
                            countr++
                            if (countr === nameObject.length) {
                                massObject.forEach(e => {
                                    e.group = nameGroup
                                    //  e.id = el
                                })
                                aLLmassObject.push(massObject)
                            }
                            if (aLLmassObject.length === Allcountr) {
                                aLLmassObject.reverse()
                                //   console.log(aLLmassObject)
                                conturTest(aLLmassObject)
                                // const nameCarCheck = test.map(elem => elem[0].message)
                                // checkCreate(nameCarCheck)
                            }
                        })
                })
            });
        })


    const prmss = {
        "spec": [{
            "type": 'id',
            "data": 26702371,//'avl_unit', //26702383,//26702371,
            "flags": 8388608,//1048576,//1048576,                 //    1048576-шт 8388608-анималс
            "mode": 0
        }
        ]
    }
    const remote1s = wialon.core.Remote.getInstance();
    remote1s.remoteCall('core/update_data_flags', prmss,
        async function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            //  console.log(result)


        });


    const flags = 1 + 1024//4096
    const prms = {
        "spec": {
            "itemsType": "avl_unit",
            "propName": "sys_name",
            "propValueMask": "*",
            "sortType": "sys_name"
        },
        "force": 1,
        "flags": flags,
        "from": 0,
        "to": 0
    };
    const remote1 = wialon.core.Remote.getInstance();
    remote1.remoteCall('core/search_items', prms,
        async function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            // console.log(result)
            const arr1 = Object.values(result);
            const arrCar = arr1[5];
            dann = arrCar
            const test = await Promise.all(arrCar.map(el => {
                return loadParamsViewList(el.nm) //запрос в базу с массивом имен машин за готовыми моделями
            })
            )
            const nameCarCheck = test.map(elem => elem[0].message)
            checkCreate(nameCarCheck)
            return dann
        });

}

export async function ggg(id) {
    const allobj = {};
    const flagss = 4096
    const prmss = {
        'id': id,
        'flags': flagss
    }
    return new Promise(function (resolve, reject) {
        const remote11 = wialon.core.Remote.getInstance();
        remote11.remoteCall('core/search_item', prmss,
            async function (code, result) {
                if (code) {
                    console.log(wialon.core.Errors.getErrorText(code));
                }
                //   console.log(result)
                const nameSens = Object.entries(result.item.sens)
                const arrNameSens = [];

                nameSens.forEach(el => {
                    arrNameSens.push([el[1].n, el[1].p])
                    //  arrNameSens.push(el[1].p)
                })
                const prms = {
                    "unitId":
                        id,
                    "sensors": []
                }
                const remote1 = wialon.core.Remote.getInstance();
                remote1.remoteCall('unit/calc_last_message', prms,
                    async function (code, result) {
                        if (code) {
                            console.log(wialon.core.Errors.getErrorText(code));
                        }
                        if (result) {
                            //   console.log(result)
                            const valueSens = [];
                            Object.entries(result).forEach(e => {
                                valueSens.push(e[1])
                            })
                            // console.log(valueSens)
                            // console.log(arrNameSens)
                            const allArr = [];
                            arrNameSens.forEach((e, index) => {
                                allArr.push([...e, valueSens[index]])

                            })
                            //  console.log(allArr)
                            allArr.forEach(it => {
                                allobj[it[1]] = it[0]
                            })
                        }
                        // console.log(allobj)
                        resolve(allobj)
                    });
            })
    })
}


async function dostupObject(name) {
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ name }))
    }
    const res = await fetch('/api/viewCheckObject', param)
    const response = await res.json()
    const nameCarCheck = response.result.map(elem => elem.Object)
    return nameCarCheck
}




/*

// Создаем функцию зума
function zoomed() {
    // Получаем текущее выделение
    const extent = d3.event.selection;
    // Если нет выделения или выбор меньше 1 минуты, возвращаемся к исходным координатам. Иначе, обновляем домены осей x и y
    if (!extent || Math.abs(x.invert(extent[1]) - x.invert(extent[0])) < 60000) {
        // При отсутствии выделения возвращаемся к исходному диапазону
        x.domain(d3.extent(data, (d) => new Date(d.time)))
        y1.domain(d3.extent(data, (d) => d.oil))
        y2.domain(d3.extent(data, (d) => d.pwr))
        // Сбрасываем выделение
        brush.move(d3.select('.brush'), null);
    } else {
        // Обновляем масштабы осей x и y при изменении зума
        x.domain([x.invert(extent[0]), x.invert(extent[1])]);
        y1.domain([d3.min(data, d => d.oil, x.invert(extent[0])), d3.max(data, d => d.oil, x.invert(extent[1]))]);
        y2.domain([d3.min(data, d => d.pwr, x.invert(extent[0])), d3.max(data, d => d.pwr, x.invert(extent[1]))]);
    }

    // Обновляем оси x и y
    svg.select("g.x.axis").call(xAxis);
    svg.select("g.y1.axis").call(yAxis1);
    svg.select("g.y2.axis").call(yAxis2);
    // Обновляем линии
    svg.select('.line1').attr("d", line1);
    svg.select('.line2').attr("d", line2);
}

// Создаем функцию для обработки двойного щелчка на графике
function reset() {
    // Возвращаем исходный диапазон
    x.domain(d3.extent(data, (d) => new Date(d.time)))
    y1.domain(d3.extent(data, (d) => d.oil))
    y2.domain(d3.extent(data, (d) => d.pwr))
    // Сбрасываем выделение
    brush.move(d3.select('.brush'), null);
    // Обновляем оси x и y
    svg.select("g.x.axis").call(xAxis);
    svg.select("g.y1.axis").call(yAxis1);
    svg.select("g.y2.axis").call(yAxis2);
    // Обновляем линии
    svg.select('.line1').attr("d", line1);
    svg.select('.line2').attr("d", line2);
}

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


// задаем y-шкалу для первой оси y
const y1 = d3.scaleLinear()
    .domain(d3.extent(data, (d) => d.oil))
    .range([height, 0]);

// задаем y-шкалу для второй оси y
const y2 = d3.scaleLinear()
    .domain(d3.extent(data, (d) => d.pwr))
    .range([height, 0]);



// Создаем линии
const line1 = d3.line()
    .x(d => x(d.time))
    .y(d => y1(d.oil));
const line2 = d3.line()
    .x(d => x(d.time))
    .y(d => y2(d.pwr));

// Добавляем линии на холст
svg.append("path")
    .data([data])
    .attr("class", "line1")
    .attr("class", "line1")
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 1.5)
    .attr("d", line1);
svg.append("path")
    .data([data])
    .attr("class", "line2")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr("d", line2);

// Добавляем оси на холст
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
        .tickFormat(d3.timeFormat('%H:%M')));

svg.append("g")
    .attr("class", "y1 axis")
    .call(d3.axisLeft(y1));
svg.append("g")
    .attr("class", "y2 axis")
    .attr("transform", "translate(" + width + " ,0)")
    .call(d3.axisRight(y2));


// добавляем области для первой кривой
svg.append("path")
    .datum(data)
    .attr("fill", "blue")
    .attr("class", "pat")
    .attr("class", "area1")
    .attr("fill-opacity", 0.3)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("d", d3.area()
        .x(d => x(d.time))
        .y0(height)
        .y1(d => y1(d.oil))
    );

// добавляем области для второй кривой
svg.append("path")
    .datum(data)
    .attr("class", "pat")
    .attr("class", "area2")
    .attr("fill", "#32a885")
    .attr("fill-opacity", 0.3)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("d", d3.area()
        .x(d => x(d.time))
        .y0(height)
        .y1(d => y2(d.pwr))
    );


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
    .text("Напряжение, В")


// добавляем подпись первой кривой
svg.append("circle")
    .attr("r", 6)
    .attr("cx", 200)
    .attr("cy", -30)
    .attr("fill", "blue")
    .attr('stroke', 'black')

svg.append("text")
    .attr("x", 270)
    .attr("y", -25)
    .style("text-anchor", "end")
    .text("Топливо")
    .attr("fill", "black");

// добавляем подпись второй кривой
svg.append("circle")
    .attr("r", 6)
    .attr("cx", 300)
    .attr("cy", -30)
    .attr("fill", "#32a885")
    .attr('stroke', 'black')

svg.append("text")
    .attr("x", 445)
    .attr("y", -25)
    .style("text-anchor", "end")
    .text("Бортовое питание")
    .attr("fill", "black");



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



// Добавляем элемент zoom
const zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

// Добавляем элемент brush
const brush = d3.brushX()
    .extent([[0, 0], [width, height]])
    .on("end", zoomed);

// Добавляем элементы brush и zoom на холст
svg.append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.move, x.range()); // устанавливаем начальное выделение, чтобы можно было сбросить зум
svg.call(zoom);

// Добавляем обработчик двойного щелчка для возврата стандартного размера
svg.on('dblclick', reset);*/