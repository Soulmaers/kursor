
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
        }

    }

    createRowsViewValue(values) {
        values.forEach(e => {
            this.add(e.dut, e.litrazh)
        });

    }
    reinitialize(newId, param) {
        this.removeEventListeners(); // Удаление старых слушателей событий
        this.id = newId; // Обновление id
        this.param = param
        this.resetInputs(); // Сброс состояния инпутов
        this.init(); // Переинициализация с новым id
        this.add('', '')
        this.add('', '')
        this.initEventListeners(); // Повторное добавление слушателей событий
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
        } else {
            // Здесь можно установить сообщение о некорректных данных
            this.message.textContent = "Некорректные данные";
            this.message.style.color = 'red'
            this.message.style.fontWeigth = 'bold'
        }
    }
    async getTarirData() {
        const idw = this.id
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ idw })
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