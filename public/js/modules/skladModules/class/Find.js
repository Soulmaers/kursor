


export class Find {

    constructor(element, cell, wrapper) {
        this.element = element
        this.cell = cell
        this.wrapper = wrapper
        this.globalArrayDatas = []
        this.init()
        this.element.addEventListener(`input`, this.onElementInput.bind(this));
        this.pushData();
    }

    init() {
        if (this.wrapper) {
            this.cell = this.wrapper.querySelectorAll('.cel_params_tyres')
        }
    }
    async pushData() {
        this.cell.forEach(e => this.globalArrayDatas.push(e.textContent))

    }

    onElementInput({ target }) {
        this.removeList();
        if (!target.value) {
            this.openAllList()
        }
        this.createList(this.globalArrayDatas.filter(it => it.toLowerCase().indexOf(target.value.toLowerCase()) !== -1));
    }

    createList(data) {
        this.cell.forEach(e => {
            if (data.includes(e.textContent)) {
                e.style.display = 'flex'
            }
        })

    }
    removeList() {
        this.cell.forEach(e => e.style.display = 'none');
    }
    openAllList() {
        this.cell.forEach(e => e.style.display = 'flex');
    }
}


