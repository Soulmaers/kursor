import { RenderHTML } from "./RenderHTML.js"
import { RequestToBse } from './RequestToBase.js'

export class TarirTable {
    constructor(id, el, param) {
        this.element = el
        this.id = id
        this.param = param
        this.container = document.querySelector('.container_tarir')
        this.pop = document.querySelector('.popup-background')
        this.init()
    }


    async init() {
        this.container.style.display = 'flex'
        this.indexUpLow(this.pop, this.container, 5, 6)
        await this.getData()
        this.addContent()
        this.caseElements()
        this.initEventListeners()
        if (this.values.length !== 0) {
            this.jobProps()
            this.approcsimationsViewParabola(this.valueArray)
        }
    }

    jobProps() {
        this.valueArray = this.values.map(e => {
            return [1, 2, 3, Number(e.dut), Number(e.litrazh)]
        });

    }
    async getData() {
        this.values = await this.getTarirData()
    }
    addContent() {
        this.container.innerHTML = RenderHTML.addTarirHTML(this.values)
    }
    caseElements() {
        this.close = this.container.querySelector('.closes')
        this.save = this.container.querySelector('.ok_modal')
        this.addRow = this.container.querySelector('.add_modal')
        this.wrapper_data = this.container.querySelector('.list_table_tarir')
        this.message = this.container.querySelector('.validation_message')
        this.downButton = this.container.querySelector('#downButton')
        this.fileInput = this.container.querySelector('#fileInput')
        this.koefOil = this.container.querySelector('.koef_oil')

    }
    indexUpLow(pop, container, num1, num2) {
        pop.style.zIndex = num1
        container.style.zIndex = num2
    }

    initEventListeners() {
        this.close.addEventListener('click', () => this.clos());
        this.save.addEventListener('click', () => this.ok());
        this.addRow.addEventListener('click', () => this.add('', ''));
        this.downButton.addEventListener('click', () => { this.fileInput.click() });
        this.fileInput.addEventListener('change', (event) => this.fileReader(event))
        // Добавление слушателя на весь контейнер для валидации инпутов
        this.container.addEventListener('input', event => {
            if (event.target.matches('.value_data')) {
                this.validateInput(event);
            }
        });

        this.koefOil.addEventListener('keydown', (event) => this.validationInput(event))
    }

    validationInput(event) {
        const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '.', 'Backspace', 'ArrowLeft', 'ArrowRight'];
        if (!allowedKeys.includes(event.key)) {
            event.preventDefault(); // Запрещаем ввод любых символов, кроме цифр и навигационных клавиш
        }
        this.koefOil.value = this.koefOil.value.replace(',', '.');
    }


    fileReader(event) {
        const file = event.target.files[0];
        if (!file) {
            console.log('нет файла');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => { // Используем стрелочную функцию
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            // Получаем первый лист
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            this.jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            this.wrapper_data.innerHTML = RenderHTML.updateRows(this.jsonData.slice(1));
            const values = this.saveToBaseAndCreateChart();
            this.approcsimationsViewParabola(values)
        };
        reader.readAsArrayBuffer(file); // Не забудьте вызвать метод чтения
    }
    clos() {
        this.container.style.display = 'none'
        this.indexUpLow(this.pop, this.container, 3, 6)
    }

    add(dut, litrazh) {
        // Создаем элемент списка
        const li = document.createElement('li');
        li.classList.add('row_tarir_data');
        const inputDut = document.createElement('input');
        inputDut.classList.add('value_data', 'value_dut');
        inputDut.value = dut;
        inputDut.addEventListener('input', this.validateInput); // Добавляем обработчик
        li.appendChild(inputDut);
        const inputOil = document.createElement('input');
        inputOil.classList.add('value_data', 'value_oil');
        inputOil.value = litrazh;
        inputOil.addEventListener('input', this.validateInput); // Добавляем обработчик
        li.appendChild(inputOil);
        this.wrapper_data.appendChild(li);
    }

    async ok() {
        if (this.validateRows()) {
            const values = this.saveToBaseAndCreateChart();
            await this.updateTarirTable(values)

            this.approcsimationsViewParabola(values)
            this.setFormula(values)
            if (values[0].length <= 2) {
                this.formula = null
                await this.deleteConfig()
            }
            else {
                this.setSaveConfig()
            }
        } else {
            // Здесь можно установить сообщение о некорректных данных
            this.message.textContent = "Некорректные данные";
            this.message.style.color = 'red'
            this.message.style.fontWeigth = 'bold'
        }
    }
    async deleteConfig() {
        const res = await RequestToBse.deleteConfigParam(this.id, this.param)
    }
    setFormula(values) {
        this.formula = `(${this.formula})*${this.koefOil.value}`
        this.element.closest('.name_params').nextElementSibling.querySelector('.val_koef').value = values[0].length > 2 ? this.formula : ''
    }

    async setSaveConfig() {
        const dopValue = this.element.closest('.name_params').nextElementSibling.nextElementSibling.querySelector('.val_koef_ts_oil').value
        const obj = {
            idw: this.id,
            param: this.param,
            formula: this.formula,
            dopValue: dopValue
        }
        const res = await RequestToBse.setConfigParam(obj)
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
        const degree = x.length < 3 ? 1 : 6
        const approximated = this.polynomialApproximation(x, y, degree);
        this.grafikPoly(points, approximated)
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
        this.formulaFunc(a)
        return a;
    }

    formulaFunc(coefficients) {
        coefficients.reverse()
        const res = coefficients.reduce((acc, coeff, index) => {
            const exponent = coefficients.length - 1 - index;
            let term;
            if (exponent === 0) {
                term = `${coeff}`;
            } else if (exponent === 1) {
                term = `${coeff}x`;
            } else {
                term = `${coeff}x^${exponent}`;
            }
            return acc + (coeff < 0 ? ` - ${term.replace('-', '')}` : ` + ${term}`);
        }, '');
        this.formula = res.replace(/^ \+ /, '');
    }

    grafikPoly(points, coeffs) {
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
        /*  svg.append("path")
              .datum(polyData)
              .attr("class", "line")
              .attr("d", line)
              .attr("fill", "none")
              .attr("stroke", "steelblue")
              .attr("stroke-width", 2)*/
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

    saveToBaseAndCreateChart() {
        const values = [...this.wrapper_data.querySelectorAll('.row_tarir_data')]
            .filter(e => e.children[0].value !== '' && e.children[1].value !== '')
            .map((it, index) => [this.id, this.param, index + 1, it.children[0].value, it.children[1].value])
        return values.length !== 0 ? values : [[this.id, this.param]]
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

    validateInput(event) {
        const input = event.target;
        // Удаляем все символы, кроме цифр и точки
        const sanitizedValue = input.value.replace(/[^0-9.]/g, '');
        // Если значение содержит больше одной точки, удаляем лишние
        const dotCount = (sanitizedValue.match(/\./g) || []).length;
        if (dotCount > 1) {
            const firstDotIndex = sanitizedValue.indexOf('.');
            input.value = sanitizedValue.slice(0, firstDotIndex + 1) + sanitizedValue.slice(firstDotIndex + 1).replace(/\./g, '');
        } else {
            input.value = sanitizedValue;
        }
    }

}