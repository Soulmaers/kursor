
export class DropDownList {
    constructor(element) {
        this.element = element;
        this.globalArrayData = []
        this.list = document.querySelectorAll('.listItem')
        this.group = document.querySelectorAll('.groups')
        this.element.addEventListener(`input`, this.onElementInput.bind(this));
        this.pushData();

    }

    pushData() {
        this.list.forEach(e => this.globalArrayData.push(e.children[0].textContent))
        this.list.forEach(e => this.globalArrayData.push(e.getAttribute('rel')))
        this.group.forEach(e => this.globalArrayData.push(e.getAttribute('rel')))
        console.log(this.globalArrayData)
    }

    onElementInput({ target }) {
        console.log(target.value)
        this.removeList();
        if (!target.value) {
            this.openAllList()
        }
        this.createList(this.globalArrayData.filter(it => it.toLowerCase().indexOf(target.value.toLowerCase()) !== -1));
    }

    createList(data) {
        console.log(data)
        this.list.forEach(e => {
            if (data.includes(e.children[0].textContent) || data.includes(e.getAttribute('rel')) || data.includes(e.closest('.groups').getAttribute('rel'))) {
                e.style.display = 'flex'
                e.closest('.groups').style.display = 'flex'
            }
        })

    }
    removeList() {
        this.list.forEach(e => e.style.display = 'none');
        this.group.forEach(e => e.style.display = 'none');
    }
    openAllList() {
        this.list.forEach(e => e.style.display = 'flex');
        this.group.forEach(e => e.style.display = 'flex');
    }
}