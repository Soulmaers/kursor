
export class DropDownList {
    constructor(element) {
        this.element = element;
        this.globalArrayData = []
        this.globalArrayDatas = []
        this.list = document.querySelectorAll('.listItem')
        this.group = document.querySelectorAll('.groups')
        this.element.addEventListener(`input`, this.onElementInput.bind(this));
        this.pushData();

    }

    async pushData() {
        this.group.forEach(e => this.globalArrayDatas.push(e.getAttribute('rel')))
        const kursorArrayId = [];
        this.list.forEach(e => {
            e.classList.contains('wialon') ? null : kursorArrayId.push(e.getAttribute('rel'))
        })
        const idw = [...new Set(kursorArrayId)]
        console.log(idw)

        if (idw.length !== 0) {
            const params = {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ idw })
            }
            const res = await fetch('/api/objects', params)
            const result = await res.json()
            result.forEach(e => {
                e.idObject !== '' && this.globalArrayDatas.push(String(e.idObject));
                e.nameObject !== '' && this.globalArrayDatas.push(e.nameObject);
                e.imei !== '' && this.globalArrayDatas.push(e.imei);
                e.number !== '' && this.globalArrayDatas.push(e.number);
            });
        }

        const param = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }
        const resW = await fetch('/api/wialonObjects', param)
        const resultW = await resW.json()
        resultW.forEach(e => {
            e.idObject !== '' && this.globalArrayDatas.push(String(e.idObject));
            e.nameObject !== '' && this.globalArrayDatas.push(e.nameObject);
            e.imei !== '' && this.globalArrayDatas.push(e.imei);
            e.phone !== '' || e.phone !== null && this.globalArrayDatas.push(e.phone);
        });
    }

    onElementInput({ target }) {
        this.removeList();
        if (!target.value) {
            this.openAllList()
        }
        this.createList(this.globalArrayDatas.filter(it => it.toLowerCase().indexOf(target.value.toLowerCase()) !== -1));
    }

    createList(data) {
        this.list.forEach(e => {
            if (data.includes(e.children[0].textContent) || data.includes(e.getAttribute('rel')) || data.includes(e.closest('.groups').getAttribute('rel'))
                || data.includes(e.getAttribute('data-att')) || data.includes(e.getAttribute('data-phone'))) {
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