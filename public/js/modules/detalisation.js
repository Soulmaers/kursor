import { testovfn } from './charts/bar.js'
import { fnParMessage } from './grafiks.js'
import { timefn } from './startAllStatic.js'
import { timeConvert } from './charts/oil.js'
export async function createChart() {

    const today = document.querySelector('.jobTSDetalisationDate')
    const todayData = new Date();
    var day = String(todayData.getDate()).padStart(2, '0');
    var month = String(todayData.getMonth() + 1).padStart(2, '0');
    var year = todayData.getFullYear();
    var formattedDate = day + "." + month + "." + year;
    today.textContent = `Сегодня: ${formattedDate}`


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
    /*
        if (sensArr[0] && nameSens.length === Object.values(sensArr[0]).length) {
            nameSens.forEach((item) => {
                allArrNew.push({ sens: item[0], params: item[1], value: [] })
            })
        }*/

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
    const engine = allArrNew.filter(it => it.sens === 'Зажигание' || it.sens.startsWith('Борт'));
    console.log(engine)
    engine[0].pwr = engine[1].value
    engine[0].condition = [];
    const dannie = []
    dannie.push(engine[0])
    console.log(dannie)

    for (let i = 0; i < dannie[0].value.length; i++) {
        if (dannie[0].speed[i] > 5) {
            dannie[0].condition[i] = 'Движется'
        }
        else if (dannie[0].speed[i] === 0 && dannie[0].value[i] === 1) {
            dannie[0].condition[i] = 'Повернут ключ зажигания'
        }
        else dannie[0].condition[i] = 'Парковка'
    }
    delete dannie[0].params
    delete dannie[0].sens
    console.log(dannie[0])
    const data = dannie.flatMap(item =>
        item.value.map((cValue, index) => ({
            value: cValue,
            condition: item.condition[index],
            pwr: item.pwr[index],
            geo: item.geo[index],
            speed: item.speed[index],
            sats: item.sats[index],
            time: item.time[index],
        }))
    );

    console.log(data);

    const chartStatic = document.querySelector('.chartStatic')
    if (chartStatic) {
        chartStatic.remove();
    }
    /*
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
        console.log(data)*/
    // Функция для объединения смежных интервалов с одинаковым статусом
    function combineIntervals(data) {
        const combinedData = [];
        let currentInterval = { ...data[0] };

        for (let i = 1; i < data.length; i++) {
            if (data[i].time === currentInterval.time) {
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
    console.log(combinedData)
    const width = 673; // Ширина графика
    const svgHeight = 80; // Высота SVG элемента
    const margin = { top: 10, right: 20, bottom: 10, left: 50 };
    const height = svgHeight - margin.top - margin.bottom;


    const objColor = {
        'Движется': ' #8fd14f',
        'Парковка': '#3399ff',
        'Повернут ключ зажигания': '#fef445'
    }
    const tooltip = d3.select(".jobTSDetalisationLine")
        .append("div")
        .attr("class", "tooltipStat")
        .style("position", "absolute")
        .style('width', '130px')
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
        .attr("x", d => xScale(d.time))
        .attr("y", 0)
        //  .attr("stroke", "none")
        .attr("width", (d) => {
            return xScale(d.time);
        })
        .attr("height", 30) // Высота 10px
        .attr("fill", d => (objColor[d.condition]))
        .on("mousemove", function (event, d) {
            g.selectAll("rect").attr("fill", d => (objColor[d.condition]))
            d3.select(this).attr("fill", 'black');


            // Определяем координаты курсора в отношении svg
            const [xPosition, yPosition] = d3.mouse(this);
            console.log([xPosition, yPosition])
            // Определяем ближайшую точку на графике
            const bisect = d3.bisector(d => d.time).right;
            const x0 = xScale.invert(xPosition);
            const i = bisect(combinedData, x0, 1);
            const d0 = combinedData[i - 1];
            const d1 = combinedData[i];
            d = x0 - d0.time > d1.time - x0 ? d1 : d0;

            const selectedTime = timeConvert(d.time)
            const tool = document.querySelector('.tooltipStat')
            console.log(tool)
            tool.style.display = 'block'
            tool.textContent = `Скорость: ${d.speed} км/ч\nВремя: ${selectedTime}\nСостояние: ${d.condition}`
            tool.style.top = '330px'//'50px'
            tool.style.left = '350px'
        })
        .on("mouseout", () => {

            d3.select(this).attr("fill", d => (objColor[d.condition]))
            tooltip.style("display", "none");
        });
    const timeFormat = d3.timeFormat("%H:%M");
    const xAxis = d3.axisBottom(xScale).tickFormat(timeFormat);
    g.append("g")
        .attr("transform", `translate(0, 30)`) // Отступ для оси x
        .call(xAxis);



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