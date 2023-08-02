import { testovfn } from './charts/bar.js'
import { fnParMessage } from './grafiks.js'
import { timefn } from './startAllStatic.js'

export async function createChart() {


    const noGraf = document.querySelector('.noGraf')
    const active = document.querySelector('.color').id
    const nameCar = document.querySelector('.color').children[0].textContent

    const interval = timefn()
    const t1 = interval[1]
    const t2 = interval[0]
    const itog = await testovfn(active, t1, t2)
    const res = await fnParMessage(active)
    const time = [];
    const speed = [];
    const sats = [];
    const geo = [];
    itog.forEach(el => {
        const timestamp = Number(el.data);
        const date = new Date(timestamp * 1000);
        const isoString = date.toISOString();
        time.push(new Date(isoString))
        speed.push(el.speed)
        sats.push(el.sats)
        geo.push(JSON.parse(el.geo))
    })
    const sensArr = itog.map(e => {
        return JSON.parse(e.sens)
    })
    console.log(res)
    const nameSens = [];
    res.forEach(el => {
        nameSens.push([el[0], el[1]])
    })
    const allArrNew = [];
    if (sensArr[0] && nameSens.length === sensArr[0].length) {
        nameSens.forEach((item) => {
            allArrNew.push({ sens: item[0], params: item[1], value: [] })
        })
    }
    nameSens.pop()
    nameSens.forEach((item) => {
        allArrNew.push({ sens: item[0], params: item[1], value: [] })
    })
    sensArr.forEach(el => {
        if (el.length === 0) {
            return; // Пропускаем текущую итерацию, если sensArr пустой
        }
        for (let i = 0; i < allArrNew.length; i++) {
            allArrNew[i].value.push(Number(Object.values(el)[i].toFixed(0)))
        }
    });
    allArrNew.forEach(el => {
        el.time = time
        el.speed = speed
        el.sats = sats
        el.geo = geo
    })
    console.log(allArrNew)







    const chartStatic = document.querySelector('.chartStatic')
    if (chartStatic) {
        chartStatic.remove();
    }

    const numDataPoints = 50;
    const data = [];
    const statusOptions = ['move', 'parking'];

    for (let i = 0; i < numDataPoints; i++) {
        const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        data.push({
            time: new Date(2023, 7, 2, 12, i, 0), // Фиксированный день и месяц (2023-08-02)
            status: randomStatus,
        });
    }

    // Функция для объединения смежных интервалов с одинаковым статусом
    function combineIntervals(data) {
        const combinedData = [];
        let currentInterval = { ...data[0] };

        for (let i = 1; i < data.length; i++) {
            if (data[i].status === currentInterval.status) {
                currentInterval.time = data[i].time;
            } else {
                combinedData.push({ ...currentInterval });
                currentInterval = { ...data[i] };
            }
        }

        combinedData.push({ ...currentInterval });
        return combinedData;
    }

    const combinedData = combineIntervals(data);

    const width = 800; // Ширина графика
    const svgHeight = 50; // Высота SVG элемента
    const margin = { top: 10, right: 20, bottom: 10, left: 50 };
    const height = svgHeight - margin.top - margin.bottom;





    const tooltip = d3.select(".jobTSDetalisationLine")
        .append("div")
        .style("position", "absolute")
        .style("padding", "5px")
        .style("background-color", "rgba(0, 0, 0, 0.7)")
        .style("color", "#fff")
        .style("border-radius", "5px")
        .style("font-size", "12px")
        .style("display", "none");

    const svg = d3.select(".jobTSDetalisationLine")
        .append("svg")
        .attr('class', 'chartStatic')
        .attr("width", "100%")
        .attr("height", svgHeight);

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.time))
        .range([0, width]);

    const g = svg.append("g")
        .attr("transform", `translate(${0}, ${margin.top})`);

    g.selectAll("rect")
        .data(combinedData)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.time) - (xScale(combinedData[0].time) - xScale(data[0].time)))
        .attr("y", 0)
        .attr("width", (d) => {
            const nextIndex = combinedData.indexOf(d) + 1;
            const nextTime = (nextIndex < combinedData.length) ? combinedData[nextIndex].time : xScale.range()[1];
            return xScale(nextTime) - xScale(d.time);
        })
        .attr("stroke", "gray") // Цвет контура - черный
        .attr("stroke-width", 1) // Толщина контура - 2 пикселя
        .attr("height", 30) // Высота 10px
        .attr("fill", d => (d.status === 'move' ? "lightgreen" : "lightblue"))
        .on("mouseover", (event, d) => {
            tooltip.style("display", "block");
            tooltip.html(`Status: ${d.status}<br>Time: ${d.time.toLocaleString()}`)
                .style("left", `${event.pageX}px`)
                .style("top", `${event.pageY}px`);
        })
        .on("mouseout", () => {
            tooltip.style("display", "none");
        });

    const xAxis = d3.axisBottom(xScale);
    /*  g.append("g")
          .attr("transform", `translate(0, 30)`) // Отступ для оси x
          .call(xAxis);*/

    /*
const width = 500; // ширина графика
const height = 100; // высота графика

const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const data = [
    { time: 0, color: "green" },
    { time: 1, color: "blue" },
    { time: 2, color: "purple" },
    // Добавьте остальные состояния здесь
];

svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => d.time * (width / data.length)) // установка координаты X для каждого прямоугольника
    .attr("y", 0) // установка координаты Y
    .attr("width", width / data.length) // установка ширины прямоугольника
    .attr("height", height) // установка высоты прямоугольника
    .style("fill", d => d.color); // установка цвета прямоугольника*/
}