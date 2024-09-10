
export class SetPressureOs {
    constructor(id) {
        this.id = id
        this.idOs = null
        this.element = null
        // Сохранение ссылок на методы с привязкой контекста
        this.finalBound = this.final.bind(this);
        this.methodBound = this.method.bind(this);
        this.validationBound = this.validation.bind(this);
        this.clearBarBound = this.clearBar.bind(this);
        this.hiddenOsBound = this.hiddenOs.bind(this);
        this.getDOM()
        this.setupEventListeners();
    }

    reinitialize(newId) {
        this.removeEventListeners();
        this.id = newId;
        this.getDOM()
        this.setupEventListeners();
    }
    setupEventListeners() {
        console.log('Adding event listeners');
        this.inpfinal.forEach(el => el.addEventListener('input', this.finalBound));
        this.vnut.forEach(e => e.addEventListener('click', this.methodBound));
        this.btnModal.addEventListener('click', this.validationBound);
        this.btnModalClear.addEventListener('click', this.clearBarBound);
        this.modalClear.addEventListener('click', this.hiddenOsBound);
    }
    removeEventListeners() {
        console.log('Removing event listeners');
        this.inpfinal.forEach(el => el.addEventListener('input', (event) => this.finalBound(event, el)));
        this.vnut.forEach(e => e.removeEventListener('click', this.methodBound));
        this.btnModal.removeEventListener('click', this.validationBound);
        this.btnModalClear.removeEventListener('click', this.clearBarBound);
        this.modalClear.removeEventListener('click', this.hiddenOsBound);
    }


    getDOM() {
        this.modalCenterOs = document.querySelector('.modalCenterOs')
        this.modalClear = document.querySelector('.modalClear')
        this.btnModal = document.querySelector('.btnModal')
        this.btnModalClear = document.querySelector('.btnModalClear')
        this.norma = document.querySelector('.normal')
        this.inpfinal = document.querySelectorAll('.inpfinal')
        this.divFinal = document.querySelectorAll('.divfinal')
        this.vnut = document.querySelectorAll('.vnutTest')
    }
    hiddenOs() {
        this.modalCenterOs.style.display = 'none'
    }
    async reqModalBar(arr, id) {
        const active = document.querySelector('.color')
        const activePost = active.getAttribute('name')
        const idw = this.id
        console.log(idw)
        const arrValue = [];
        arrValue.push(idw)
        arrValue.push(activePost)
        arrValue.push(id)
        arrValue.push(this.norma.value)
        this.divFinal.forEach(el => {
            arrValue.push(el.textContent)
        })
        console.log(id, arr, arrValue, idw)
        const bar = await fetch('/api/modalBar', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, arr, arrValue, idw }),
        })
        const result = await bar.json();
    }


    async modalBar() {
        this.modalCenterOs.style.display = 'none'
        const modalText = document.querySelectorAll('.modalText')
        const arrNameCol = [];
        modalText.forEach(el => {
            arrNameCol.push(el.id)
        })
        await this.reqModalBar(arrNameCol, this.idOs);
        this.viewBar(this.idOs);
        this.element.parentElement.classList.remove('centerOsActiv')
    }

    final(event) {
        let values = event.target.value;
        const valuess = values.replace(/,/g, '.'); // заменяем все запятые на точки
        event.target.value = valuess;
        if (this.norma.value) {
            event.target.previousElementSibling.textContent = ((String(this.norma.value / 100 * event.target.value)).substr(0, 5))
        }
    }

    validation() {
        this.norma.value === '' ? this.messfn() : this.modalBar()
    }

    messfn() {
        const mess = document.querySelector('.mess')
        mess.style.display = 'flex'
        setTimeout(() => mess.style.display = 'none', 3000)
    }

    clearBar() {
        this.inpfinal.forEach((e, index) => {
            e.value = e.placeholder
            this.divFinal[index].textContent = ((String(this.norma.value / 100 * e.placeholder)).substr(0, 5))
        })
    }
    method(event) {
        this.element = event.currentTarget
        this.idOs = this.element.parentElement.id
        if (this.element.parentElement.classList.contains('centerOsActiv')) {
            this.element.parentElement.classList.remove('centerOsActiv')
            this.modalCenterOs.style.display = 'none'
            return
        }
        this.vnut.forEach(e => {
            e.parentElement.classList.remove('centerOsActiv')
        });
        this.element.parentElement.classList.add('centerOsActiv')
        this.modalCenterOs.style.display = 'block'
        const modalInput = document.querySelectorAll('.modalInput')
        modalInput.forEach(i => {
            i.value = ''
        })
        const modalNumberOs = document.querySelector('.modalNumberOs')
        if (this.element.parentElement.classList.contains('pricepT')) {
            modalNumberOs.textContent = this.idOs + '-' + 'Прицеп'
        }
        else {
            modalNumberOs.textContent = this.idOs + '-' + 'Тягач'
        }
        this.divFinal.forEach(e => {
            e.textContent = ''
        })
        this.inpfinal.forEach(e => {
            e.value = ''
        })
        this.viewBar(this.idOs);
        this.norma.addEventListener('input', () => {
            this.fncalc(this.norma.value)
        })
    }

    async viewBar(id) {
        const active = document.querySelector('.color')
        const activePost = active.children[0].textContent
        const idw = this.id
        const bar = await fetch('/api/barView', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, activePost, idw })
        })
        const barValue = await bar.json();
        console.log(barValue)
        const keys = [];
        if (barValue.length) {
            for (let key in barValue) {
                keys.push(key);
            }
            const nval = (Object.entries(barValue[0]))
            nval.shift()
            nval.shift()
            nval.shift()
            nval.pop()
            this.norma.value = nval[0][1]
            nval.shift()
            this.divFinal.forEach((el, index) => {
                el.textContent = nval[index][1]
                this.inpfinal[index].value = ((parseFloat(el.textContent * 100) / this.norma.value)).toFixed(2)
            })
        }
    }
    fncalc(val) {
        let values;
        this.inpfinal.forEach((el, index) => {
            !el.value ? values = el.placeholder : values = el.value
            this.divFinal[index].textContent = ((String(val / 100 * values)).substr(0, 5))
        })
    }
}