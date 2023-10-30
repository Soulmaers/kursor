

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
    console.log(createList.value)
    console.log(e)
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

    const role = document.querySelectorAll('.log')[0].textContent
    const dut = document.querySelectorAll('.dut')
    const litr = document.querySelectorAll('.litr')
    const btnLow = document.querySelector('.btnLow')
    if (role !== 'Администратор') {
        btnLow.style.display = 'none'
        dut.forEach(e => {
            e.disabled = true
        })
        litr.forEach(e => {
            e.disabled = true
        })
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
    createList.value = val
    createListFn()
})
const mi = document.querySelector('.mi')
mi.addEventListener('click', () => {
    const createList = document.querySelector('.createList')
    let val;
    if (createList.value !== '' && createList.value > 0) {
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
})

const oilCard = document.querySelector('.oil_card')
oilCard.addEventListener('click', () => {
    const active = document.querySelector('.color')
    const nameCar = document.querySelector('.name_car')
    const techInfo = document.querySelector('.techInfo')
    techInfo.style.display = 'none'
    nameCar.textContent = active.textContent
    const tableTarir = document.querySelector('.tableTarir')
    tableTarir.style.display = 'flex'
    const wrapper_left = document.querySelector('.wrapper_left')
    wrapper_left.style.display = 'none'
    tarirView();
})

export function createDate() {
    let today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    today = day + '.' + month + '.' + year;
    return today
}
const buttOnTarirDisk = document.querySelector('.buttOnTarirDisk')
buttOnTarirDisk.addEventListener('click', async () => {
    const buttOnTarir = document.querySelector('.buttOnTarir')
    buttOnTarir.style.display = 'flex'
    const otm = document.querySelector('.otm')
    const gal = document.querySelector('.gal')
    otm.addEventListener('click', () => {
        buttOnTarir.style.display = 'none'
    })
    gal.addEventListener('click', async () => {
        const AllarrayTarir = [];
        const active = document.querySelector('.color').children[0]
        const idx = document.querySelector('.color').id
        console.log(active)
        const activePost = active.textContent.replace(/\s+/g, '')
        const titleZamer = document.querySelectorAll('.titleZamer')
        Array.from(titleZamer).forEach(el => {
            const arrayTarir = [];
            const datas = createDate(new Date())
            arrayTarir.push(datas)
            arrayTarir.push(idx)
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
        console.log(response)
        tarirView();
        buttOnTarir.style.display = 'none'
    })
})

export async function tarirView() {
    const active = document.querySelector('.color')
    //   const activePost = active.children[0].textContent.replace(/\s+/g, '')
    const idw = document.querySelector('.color').id
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ idw }))
    }
    const res = await fetch('/api/tarirView', param)
    const response = await res.json()
    createListFnview(response)
    const x = [];
    const y = [];
    const points = []
    response.forEach(el => {
        const point = []
        x.push(Number(el.DUT))
        y.push(Number(el.litrs))
        point.push(Number(el.DUT))
        point.push(Number(el.litrs))
        points.push(point)
    })

    const argy = await fetch('/api/wialon', param)
    const arg = await argy.json()
    const parFind = await fetch('/api/iconFind', param)
    const paramssyFind = await parFind.json()
    arg.forEach(el => {
        paramssyFind.result.forEach(it => {
            if (el.name === it.params) {
                if (it.icons === 'oil-card') {
                    const val = el.value
                    console.log(val)
                    let degree;
                    if (x.length < 3) {
                        degree = 1
                    }
                    if (x.length >= 3) {
                        degree = 6
                    }
                    const approximated = approximateValue(val, x, y, degree);
                    console.log(approximated)
                    const znak = Number((approximated[0] * 0.9987).toFixed(0))

                    const value = znak * 100 / y[y.length - 1]
                    const oilValue = document.querySelector('.oil_value1')
                    console.log(znak)
                    console.log(value)
                    if (!isNaN(znak)) {
                        if (znak < 0) {
                            oilValue.textContent = '----'
                            return
                        }
                        //  oilValue.textContent = znak
                        let color = 'steelblue';
                        if (value > 30 && value < 70) {
                            color = 'yellow'
                        }
                        if (value < 20) {
                            color = 'red'
                        }
                        grafGradient(y, znak, color)
                        grafikPoly(points, 6, approximated[1])
                    }

                }


            }
        })
    })
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
export function approximateValue(value, x, y, degree) {
    const coeffs = polynomialApproximation(x, y, degree);
    const approximated = evaluatePolynomial([value], coeffs)[0];
    return [approximated, coeffs]
}

export function grafikPoly(points, degree, coeffs) {
    const tarir = document.querySelector('.tarir')
    const polyEval = (x, coeffs) => coeffs.reduce((acc, coeff, i) => acc + coeff * x ** i, 0);
    const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    const width = 350 - margin.left - margin.right;
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

function grafGradient(arr, znak, color) {
    const foto = document.querySelector('.foto')
    const shkalas = document.querySelector('.shkala')
    if (shkalas) {
        shkalas.remove()
    }
    const shkala = document.createElement('div')
    shkala.classList.add('shkala')
    const value = [znak]
    foto.appendChild(shkala)

    var width = 150;
    var height = 200;
    // Создание холста
    var svg = d3.select(".shkala")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

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
        .attr("fill", color)
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
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(0, 100)")
    // Создание оси y
    var yAxis = d3.axisLeft(yScale);
    svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(yAxis);
}

