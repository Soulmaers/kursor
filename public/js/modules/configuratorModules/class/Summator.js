

export class Summator {
    constructor(id, el, params, lists) {
        this.element = el
        this.id = id
        this.params = params
        this.lists = lists
        this.oils = null
        this.container = document.querySelector('.container_summ')
        this.close = this.container.querySelector('.closesSumm')
        this.save = this.container.querySelector('.ok_modals')
        this.bodySumm = this.container.querySelector('.body_summ')
        this.boundClose = this.clos.bind(this);
        this.boundOk = this.ok.bind(this);
        this.init()
        this.initEventListeners()
    }

    async init() {
        this.container.style.display = 'flex'
        this.filterOil()
        this.createRows()

        const param = await this.getSummatorData()
        param.length !== 0 ? this.addClassCheckBox(param) : null
    }

    addClassCheckBox(param) {
        this.colorSummator('green', 'ON')
        const rows = this.container.querySelectorAll('.rowOil')
        const value = param.map(it => it.param)
        rows.forEach(el => {
            value.includes(el.children[1].textContent) ? el.children[0].classList.remove('falseCheck') : null
        })
    }
    async getSummatorData() {
        const idw = this.id
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ idw })
        }
        const res = await fetch('/api/getSummator', params)
        const result = await res.json()
        return result
    }
    createRows() {
        const rows = document.querySelectorAll('.rowOil')
        if (rows) {
            rows.forEach(e => {
                e.remove()
            });
        }
        console.log(this.oils)
        this.oils.forEach(it => {
            const row = document.createElement('div')
            row.classList.add('rowOil')
            this.bodySumm.appendChild(row)
            const i = document.createElement('i')
            i.classList.add('fa')
            i.classList.add('fa-check')
            i.classList.add('drebizg')
            i.classList.add('falseCheck')
            row.appendChild(i)
            const param = document.createElement('div')
            param.classList.add('litrazhParams')
            param.textContent = it.param
            row.appendChild(param)
            const dut = document.createElement('div')
            dut.classList.add('dutParams')
            dut.textContent = it.dut
            row.appendChild(dut)
            row.addEventListener('click', this.toggleColor.bind(this, row))
        })
    }
    toggleColor(el) {
        el.children[0].classList.toggle('falseCheck')
    }
    filterOil() {
        const filteredElements = [...this.lists.children].filter(e =>
            e.children[1].textContent.startsWith('oil') &&
            e.children[1].textContent.length <= 4 &&
            e.children[2].textContent !== ''
        );
        this.oils = filteredElements.map(e => ({
            param: e.children[1].textContent,
            dut: e.children[2].textContent
        }));
    }


    ok() {
        const rows = this.container.querySelectorAll('.rowOil')
        const data = [...rows].filter(e => !e.children[0].classList.contains('falseCheck')).map(it => ({ idw: this.id, param: it.children[1].textContent, dut: it.children[2].textContent }))
        this.setSummator(data)
        data.length !== 0 ? this.colorSummator('green', 'ON') : this.colorSummator('rgba(6, 28, 71, 1)', 'OFF')
        this.clos()
    }
    colorSummator(color, text) {
        const meta = this.element.closest('.item_stor').children[2]
        this.element.style.color = `${color}`
        meta.style.color = `${color}`
        meta.textContent = `${text}`
    }
    clos() {
        this.container.style.display = 'none'
    }
    async setSummator(data) {
        const idw = this.id
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ data, idw })
        }
        const res = await fetch('/api/setSummator', params)
        const result = await res.json()
    }
    initEventListeners() {
        this.close.addEventListener('click', this.boundClose);
        this.save.addEventListener('click', this.boundOk);

    }
    removeEventListeners() {
        this.close.removeEventListener('click', this.boundClose);
        this.save.removeEventListener('click', this.boundOk);
    }

    reinitialize(newId, el, params, lists) {
        this.removeEventListeners(); // Удаление старых слушателей событий
        this.id = newId; // Обновление id
        this.params = params
        this.lists = lists
        this.element = el//Обновление иконки
        this.init(); // Переинициализация с новым id
        this.initEventListeners(); // Повторное добавление слушателей событий
    }
}