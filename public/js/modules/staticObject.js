
import { zamer } from './content.js'

const createList = document.querySelector('.createList')

createList.addEventListener('input', createListFn)

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



const y = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 395, 400]
const x = [90, 222, 444, 666, 777, 901, 1060, 1190, 1322, 1500, 2006, 3100, 4010, 4094]
const approximated = approximateValue(3047, x, y, 6);

console.log(approximated * 0.9987);

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
    return approximated;
}






export function grafikPoly() {
    console.log('рисуем')
    const tarir = document.querySelector('.tarir')
    tarir.style.display = 'block'
    const polyEval = (x, coeffs) => coeffs.reduce((acc, coeff, i) => acc + coeff * x ** i, 0);
    const points = [[90, 10], [222, 20], [444, 30], [666, 40], [777, 50], [901, 60], [1060, 70], [1190, 80], [1322, 90], [1500, 100], [2006, 200], [3100, 300], [4010, 395], [4094, 400]]
    const degree = 6;
    const coeffs = polynomialApproximation(x, y, degree);

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
        .domain(d3.extent(points, d => d[0]));

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
    const polyData = d3.range(xScale.domain()[0], xScale.domain()[1], step)
        .map(x => [x, polyEval(x, coeffs)]);

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