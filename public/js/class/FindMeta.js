export class Findmeta {
    constructor(element) {
        this.element = element;
        this.globalArrayDatas = []
        this.meta = document.querySelectorAll('.item_meta')
        this.element.addEventListener(`input`, this.onElementInput.bind(this));
        this.pushData();

    }

    async pushData() {
        this.meta.forEach(e => this.globalArrayDatas.push(e.textContent))

    }

    onElementInput({ target }) {
        this.removeList();
        if (!target.value) {
            this.openAllList()
        }
        this.createList(this.globalArrayDatas.filter(it => it.toLowerCase().indexOf(target.value.toLowerCase()) !== -1));
    }

    createList(data) {
        this.meta.forEach(e => {
            if (data.includes(e.textContent)) {
                e.style.display = 'flex'
            }
        })

    }
    removeList() {
        this.meta.forEach(e => e.style.display = 'none');
    }
    openAllList() {
        this.meta.forEach(e => e.style.display = 'flex');
    }
}