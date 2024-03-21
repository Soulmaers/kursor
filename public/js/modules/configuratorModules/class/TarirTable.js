
export class TarirTable {
    constructor(id, el, param) {
        this.element = el
        this.id = id
        this.param = param
        this.container = document.querySelector('.container_tarir')
        this.close = this.container.querySelector('.closes')
        this.save = this.container.querySelector('.ok_modal')
        this.addRow = this.container.querySelector('.add_modal')
        this.wrapper_data = this.container.querySelector('.list_table_tarir')
        this.values = this.container.querySelectorAll('.value_data')
        this.message = this.container.querySelector('.validation_message')
        this.boundClose = this.clos.bind(this);
        this.boundOk = this.ok.bind(this);
        this.boundAdd = this.add.bind(this, '', '');
        this.init()
        this.initEventListeners()
    }


    async init() {
        this.container.style.display = 'flex'
        const values = await this.getTarirData()
        console.log(values)
        if (values.length !== 0) {
            const rows = this.wrapper_data.querySelectorAll('.row_tarir_data');
            rows.forEach(row => { row.remove() });
            this.createRowsViewValue(values)
            const valueArray = values.map(e => {
                return [1, 2, 3, Number(e.dut), Number(e.litrazh)]
            });
            this.approcsimationsViewParabola(valueArray)
        }
    }

    createRowsViewValue(values) {
        values.forEach(e => {
            this.add(e.dut, e.litrazh)
        });

    }
    reinitialize(newId, el, param) {
        this.removeEventListeners(); // Удаление старых слушателей событий
        this.id = newId; // Обновление id
        this.param = param
        this.element = el//Обновление иконки
        this.resetInputs(); // Сброс состояния инпутов
        this.init(); // Переинициализация с новым id
        this.add('', '')
        this.add('', '')
        this.initEventListeners(); // Повторное добавление слушателей событий
        const chartTarirer = document.querySelector('.chartTarir')
        if (chartTarirer) {
            chartTarirer.remove()
        }
    }
    resetInputs() {
        // Удалить все лишние строки, оставив только две начальные
        const rows = this.wrapper_data.querySelectorAll('.row_tarir_data');
        console.log(rows)
        rows.forEach((row, index) => {
            if (index >= 2) { // Если индекс строки больше 1, удаляем её
                row.remove();
            }
        });

        // Сбросить значения и стили для первых двух строк
        const inputs = this.wrapper_data.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = ''; // Сброс значения
            input.style.border = ''; // Удаление красной обводки
        });
    }
    initEventListeners() {
        this.close.addEventListener('click', this.boundClose);
        this.save.addEventListener('click', this.boundOk);
        this.addRow.addEventListener('click', this.boundAdd);
        // Добавление слушателя на весь контейнер для валидации инпутов
        this.container.addEventListener('input', event => {
            if (event.target.matches('.value_data')) {
                this.validateInput(event);
            }
        });
    }
    removeEventListeners() {
        this.close.removeEventListener('click', this.boundClose);
        this.save.removeEventListener('click', this.boundOk);
        this.addRow.removeEventListener('click', this.boundAdd);
        this.container.removeEventListener('input', this.validateInput);
    }


    clos() {
        console.log(this.id)
        console.log(this.container)
        this.container.style.display = 'none'
    }


    async ok() {
        if (this.validateRows()) {
            const values = this.saveToBaseAndCreateChart();
            await this.updateTarirTable(values)
            console.log(values[0].length)
            values[0].length > 1 ? this.element.style.color = 'green' : this.element.style.color = 'rgba(6, 28, 71, 1)'
            //  this.container.style.display = 'none';
            this.approcsimationsViewParabola(values)
        } else {
            // Здесь можно установить сообщение о некорректных данных
            this.message.textContent = "Некорректные данные";
            this.message.style.color = 'red'
            this.message.style.fontWeigth = 'bold'
        }
    }




    approcsimationsViewParabola(values) {
        const x = [];
        const y = [];
        const points = []
        values.forEach(el => {
            const point = []
            x.push(Number(el[3]))
            y.push(Number(el[4]))
            point.push(Number(el[3]))
            point.push(Number(el[4]))
            points.push(point)
        })
        console.log(points)
        let degree;
        if (x.length < 3) {
            degree = 1
        }
        if (x.length >= 3) {
            degree = 6
        }
        const approximated = this.approximateValue(x, y, degree);
        //   const znak = Number((approximated[0] * 0.9987).toFixed(0))
        console.log(approximated)
        this.grafikPoly(points, 6, approximated)
    }



    approximateValue(x, y, degree) {
        const coeffs = this.polynomialApproximation(x, y, degree);
        //  const approximated = this.evaluatePolynomial([value], coeffs)[0];
        return coeffs
    }
    polynomialApproximation(x, y, degree) {
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


    grafikPoly(points, degree, coeffs) {
        const tarir = document.querySelector('.chart_tarir')
        const polyEval = (x, coeffs) => coeffs.reduce((acc, coeff, i) => acc + coeff * x ** i, 0);
        const margin = { top: 20, right: 20, bottom: 50, left: 40 };
        const width = 450 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;
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


    async getTarirData() {
        const idw = this.id
        const param = this.param
        console.log(idw, param)
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ idw, param })
        }
        const res = await fetch('api/getTarirTable', params)
        const result = await res.json()
        return result
    }
    async updateTarirTable(values) {
        console.log(values)
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ values })
        }
        const res = await fetch('api/updateTarirTable', params)
        const result = await res.json()
        this.message.textContent = result;
        this.message.style.color = 'green'
        this.message.style.fontWeigth = 'bold'
    }
    // this.message
    saveToBaseAndCreateChart() {
        const values = [...this.wrapper_data.querySelectorAll('.row_tarir_data')]
            .filter(e => e.children[0].value !== '' && e.children[1].value !== '')
            .map((it, index) => [this.id, this.param, index + 1, it.children[0].value, it.children[1].value])
        return values.length !== 0 ? values : [[this.id]]
    }

    validateRows() {
        let isValid = true;
        const rows = [...this.wrapper_data.querySelectorAll('.row_tarir_data')]; // Преобразуем NodeList в массив
        rows.forEach(row => {
            const inputs = [...row.querySelectorAll('.value_data')]; // Получаем все input в строке
            // Проверяем, что хотя бы одно поле не пустое, иначе считаем данные валидными без обводки
            const hasEmptyInput = inputs.some(input => input.value === '');
            const hasFilledInput = inputs.some(input => input.value !== '');
            inputs.forEach(input => {
                input.style.border = hasEmptyInput && hasFilledInput ? '1px solid red' : '';
            });

            if (hasEmptyInput && hasFilledInput) isValid = false; // Если есть хоть одно пустое и одно заполненное поле, данные некорректны
        });

        return isValid;
    }

    add(dut, litrazh) {
        const li = document.createElement('li')
        li.classList.add('row_tarir_data')
        this.wrapper_data.appendChild(li)
        const inputDut = document.createElement('input')
        inputDut.classList.add('value_data')
        inputDut.classList.add('value_dut')
        inputDut.value = dut
        li.appendChild(inputDut)
        inputDut.addEventListener('input', this.validateInput);
        const inputOil = document.createElement('input')
        inputOil.classList.add('value_data')
        inputOil.classList.add('value_oil')
        inputOil.value = litrazh
        li.appendChild(inputOil)
        inputOil.addEventListener('input', this.validateInput);
    }

    validateInput(event) {
        // Если ввод не соответствует паттерну только цифр
        if (!/^\d*$/.test(event.target.value)) {
            event.target.style.border = '1px solid red';
        } else {
            // Если ввод корректен или поле пустое, сбрасываем стиль границы
            event.target.style.border = '';
        }
    }

}