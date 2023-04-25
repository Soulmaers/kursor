
import { zamer } from './content.js'

const createList = document.querySelector('.createList')
createList.addEventListener('input', createListFn)


const authClearTarir = document.querySelector('.authClearTarir ')
authClearTarir.addEventListener('click', () => {
    const tableTarir = document.querySelector('.tableTarir')
    tableTarir.style.display = 'none'
    const wrapLeft = document.querySelector('.wrapper_left')
    wrapLeft.style.display = 'block'
})
function createListFn() {
    const tablePokasateli = document.querySelector('.tablePokasateli')
    const zamer = document.querySelectorAll('.zamer')
    if (zamer) {
        zamer.forEach(e => {
            e.remove()
        })
    }
    const createList = document.querySelector('.createList')
    let count = createList.value;
    let countId = 0;

    for (let i = 0; i < count; i++) {
        countId++
        // console.log('работает?')
        tablePokasateli.innerHTML += `<div class="zamer">
                        <h3 class="titleZamer" id="zamer${countId}">Замер${countId}</h3>
                        <div class="wrapTarir"><input class="dut" placeholder="ДУТ"><input class="litr" placeholder="литры"></div>
                    </div>`

    }
}


function createListFnview(e) {
    const tablePokasateli = document.querySelector('.tablePokasateli')
    const zamer = document.querySelectorAll('.zamer')
    if (zamer) {
        zamer.forEach(e => {
            e.remove()
        })
    }
    const createList = document.querySelector('.createList')
    createList.value = e.length
    let count = e.length;
    let countId = 0;
    for (let i = 0; i < count; i++) {
        countId++
        tablePokasateli.innerHTML += `<div class="zamer">
                        <h3 class="titleZamer" id="zamer${countId}">Замер${countId}</h3>
                        <div class="wrapTarir"><input class="dut" placeholder="ДУТ"><input class="litr" placeholder="литры"></div>
                    </div>`
    }
    const wrapTarir = document.querySelectorAll('.wrapTarir')
    e.forEach((el, index) => {
        wrapTarir[index].children[0].value = el.DUT
        wrapTarir[index].children[1].value = el.litrs
    })
}


const plu = document.querySelector('.plu')
plu.addEventListener('click', () => {
    const createList = document.querySelector('.createList')
    let val;
    createList.value !== '' ? val = createList.value : val = createList.placeholder
    val++
    console.log(val)
    createList.value = val
    createListFn()
})
const mi = document.querySelector('.mi')
mi.addEventListener('click', () => {
    const createList = document.querySelector('.createList')
    let val;

    if (createList.value !== '' && createList.value > 0) {
        console.log(createList.value)
        val = createList.value
        val--
    }
    else {
        val = 0
    }
    createList.value = val
    createListFn()
})


const bochka = document.querySelector('.bochka')
bochka.addEventListener('click', () => {
    const active = document.querySelector('.color')
    const nameCar = document.querySelector('.name_car')
    nameCar.textContent = active.textContent
    const tableTarir = document.querySelector('.tableTarir')
    tableTarir.style.display = 'flex'
    const wrapper_left = document.querySelector('.wrapper_left')
    wrapper_left.style.display = 'none'
    // console.log('бочка клик')
})

export function createDate() {

    let today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    today = day + '.' + month + '.' + year;

    return today

}


const buttOnTarir = document.querySelector('.buttOnTarir')
buttOnTarir.addEventListener('click', async () => {
    const AllarrayTarir = [];

    const active = document.querySelector('.color')
    const activePost = active.textContent.replace(/\s+/g, '')
    const titleZamer = document.querySelectorAll('.titleZamer')
    Array.from(titleZamer).forEach(el => {
        const arrayTarir = [];
        const datas = createDate(new Date())
        arrayTarir.push(datas)
        arrayTarir.push(activePost)
        arrayTarir.push(el.id)
        arrayTarir.push(el.nextElementSibling.children[0].value)
        arrayTarir.push(el.nextElementSibling.children[1].value)
        AllarrayTarir.push(arrayTarir)
    })
    console.log(AllarrayTarir)

    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ AllarrayTarir }))
    }
    const res = await fetch('/api/tarirSave', param)
    const response = await res.json()
    tarirView();
})



export async function tarirView() {

    const active = document.querySelector('.color')
    const activePost = active.textContent.replace(/\s+/g, '')
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ activePost }))
    }
    const res = await fetch('/api/tarirView', param)
    const response = await res.json()
    console.log(response.result.length)
    createListFnview(response.result)
    const x = [];
    const y = [];
    const points = []
    response.result.forEach(el => {
        const point = []
        x.push(Number(el.DUT))
        y.push(Number(el.litrs))
        point.push(Number(el.DUT))
        point.push(Number(el.litrs))
        points.push(point)
    })

    const flags = 1 + 1024
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
            const arr1 = Object.values(result);
            const arrCar = arr1[5];
            arrCar.forEach(it => {
                const active = document.querySelector('.color')
                const act = active.children[0].textContent
                if (it.nm === act) {
                    if (it.lmsg.p.rs485fuel_level1) {
                        const val = it.lmsg.p.rs485fuel_level1;
                        console.log(val)
                        const approximated = approximateValue(val, x, y, 6);
                        const znak = approximated[0] * 0.9987
                        console.log(approximated[0] * 0.9987)
                        grafGradient(y, znak)
                        grafikPoly(points, 6, approximated[1])
                    }
                }

            })
        })



    //  const approximated = approximateValue(1782, x, y, 6);
    // console.log()

    //  console.log(approximated[0] * 0.9987);
}

function polynomialApproximation(x, y, degree) {
    const n = x.length;
    const m = degree + 1;
    let A = Array.from({ length: m }, () => new Array(m).fill(0));
    let B = new Array(m).fill(0);
    let a = new Array(m).fill(0);

    for (let i = 0; i < n; i++) {
        let xi = x[i];
        let yi = y[i];
        for (let j = 0; j < m; j++) {
            for (let k = 0; k < m; k++) {
                let val = Math.pow(xi, j + k);
                if (Number.isFinite(val)) {
                    A[j][k] += val;
                }
            }
            let val = Math.pow(xi, j) * yi;
            if (Number.isFinite(val)) {
                B[j] += val;
            }
        }
    }

    for (let j = 0; j < m; j++) {
        for (let k = j + 1; k < m; k++) {
            let coef = A[k][j] / A[j][j];
            B[k] -= coef * B[j];
            for (let l = j; l < m; l++) {
                let val = A[j][l] * coef;
                if (Number.isFinite(val)) {
                    A[k][l] -= val;
                }
            }
        }
    }

    for (let j = m - 1; j >= 0; j--) {
        let tmp = B[j];
        for (let k = j + 1; k < m; k++) {
            tmp -= a[k] * A[j][k];
        }
        let val = A[j][j];
        if (!Number.isFinite(val)) {
            val = Number.MAX_VALUE;
        }
        a[j] = tmp / val;
    }

    return a;
}
function evaluatePolynomial(x, a) {
    const n = a.length;
    const y = new Array(x.length).fill(0);

    for (let i = 0; i < x.length; i++) {
        let xi = x[i];
        for (let j = n - 1; j >= 0; j--) {
            y[i] = y[i] * xi + a[j];
        }
    }
    return y;
}
function approximateValue(value, x, y, degree) {
    const coeffs = polynomialApproximation(x, y, degree);
    const approximated = evaluatePolynomial([value], coeffs)[0];
    return [approximated, coeffs]
}






export function grafikPoly(points, degree, coeffs) {
    console.log(points)
    // console.log(degree)
    // console.log(coeffs)
    // console.log('рисуем')
    const tarir = document.querySelector('.tarir')
    tarir.style.display = 'block'
    const polyEval = (x, coeffs) => coeffs.reduce((acc, coeff, i) => acc + coeff * x ** i, 0);
    // const points = [[90, 10], [222, 20], [444, 30], [666, 40], [777, 50], [901, 60], [1060, 70], [1190, 80], [1322, 90], [1500, 100], [2006, 200], [3100, 300], [4010, 395], [4094, 400]]
    //   const degree = 6;
    // const coeffs = polynomialApproximation(x, y, degree);

    const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const chartTarirer = document.querySelector('.chartTarir')
    if (chartTarirer) {
        chartTarirer.remove()
    }
    const chartTarir = document.createElement('div')
    chartTarir.classList.add('chartTarir')
    tarir.appendChild(chartTarir)

    const svg = d3.select(".chartTarir")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + `${margin.left}` + ", " + `${margin.top}` + ")");

    const xScale = d3.scaleLinear()
        .range([0, width])
        .domain(d3.extent(points, d => d[0]))


    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(points, d => d[1])]);

    svg.append("g")
        .attr("transform", "translate(0, " + `${height}` + ")")
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale));



    const resolution = 100;
    const step = (xScale.domain()[1] - xScale.domain()[0]) / resolution;
    console.log(step)
    const polyData = d3.range(xScale.domain()[0], xScale.domain()[1], step)
        .map(x => [x, polyEval(x, coeffs)]);
    console.log(polyData)
    const line = d3.line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]));

    svg.append("path")
        .datum(polyData)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)


    svg.append("path")
        .datum(points)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", line);


    svg.selectAll("circle")
        .data(points)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => yScale(d[1]))
        .attr("r", 2)
        .attr("fill", "black")

}



function grafGradient(arr, znak) {

    console.log(arr)
    console.log(znak)
    const foto = document.querySelector('.foto')
    const shkalas = document.querySelector('.shkala')
    console.log(shkalas)
    if (shkalas) {
        shkalas.remove()
    }
    const shkala = document.createElement('div')
    shkala.classList.add('shkala')
    // shkala.textContent = znak.toFixed(2) + 'л.'
    const value = [znak.toFixed(0)]
    foto.appendChild(shkala)


    // Установка размера холста
    var width = 150;
    var height = 200;

    // Создание холста
    var svg = d3.select(".shkala")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Данные для диаграммы
    // var data = [4526];

    // Создание шкалы для оси y
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(arr)])
        .range([height - 10, 10]);


    // Создание столбиков
    svg.selectAll("rect")
        .data(value)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return 52 + i * 60;
        })
        .attr("y", function (d) {
            return yScale(d);
        })
        .attr("width", 50)
        .attr("height", function (d) {
            return height - yScale(d) - 10;
        })
        .attr("fill", "steelblue")
        .attr('stroke', 'black')

    // Создание групп для подписей значений данных
    var valueLabels = svg.selectAll("g")
        .data(value)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return "translate(" + (75 + i * 60) + "," + (yScale(d) - 10) + ")";
        });

    // Добавление подписей значений данных
    valueLabels.append("text")
        .text(function (d) {
            return d + 'л.';
        })
        .attr("font-size", "12px")
        .attr("font-family", "sans-serif")
        .attr("fill", "black")
        .attr("text-anchor", "middle")


    // Создание оси y
    var yAxis = d3.axisLeft(yScale);
    svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(yAxis);
}

