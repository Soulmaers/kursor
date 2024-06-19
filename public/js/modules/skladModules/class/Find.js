export class Find {
    constructor(element, rows) {
        this.element = element;
        this.globalArrayDatas = [];
        this.rows = rows;
        this.element.addEventListener('input', this.onElementInput.bind(this));
        this.pushData();
    }

    updateRows(newRows) {
        this.rows = newRows;
        this.pushData();
    }

    pushData() {
        this.element.value = ''
        console.log(this.rows)
        this.globalArrayDatas = [...this.rows].map(e => {
            const rel = e.getAttribute('rel');
            const marka = e.getAttribute('marka') ? e.getAttribute('marka').toLowerCase() : '';
            const model = e.getAttribute('model') ? e.getAttribute('model').toLowerCase() : '';
            const type = e.getAttribute('type') ? e.getAttribute('type').toLowerCase() : '';
            const radius = e.getAttribute('radius') ? e.getAttribute('radius').toLowerCase() : '';
            const width = e.getAttribute('width') ? e.getAttribute('width').toLowerCase() : '';
            const profil = e.getAttribute('profil') ? e.getAttribute('profil').toLowerCase() : '';
            const massa = e.getAttribute('massa') ? e.getAttribute('massa').toLowerCase() : '';
            const speed = e.getAttribute('speed') ? e.getAttribute('speed').toLowerCase() : '';
            const idObject = e.getAttribute('data-att') ? e.getAttribute('data-att').toLowerCase() : '';
            const idBitrix = e.getAttribute('relid') ? e.getAttribute('relid').toLowerCase() : '';
            const sezon = e.getAttribute('sezon') ? e.getAttribute('sezon').toLowerCase() : '';
            const nameCar = e.getAttribute('nameCar') ? e.getAttribute('nameCar').toLowerCase() : '';
            const tire = e.getAttribute('tire') ? e.getAttribute('tire').toLowerCase() : '';
            const statusElement = e.querySelector('.status_tyres');
            const status = statusElement ? statusElement.getAttribute('status')?.toLowerCase() : '';

            return {
                rel,
                marka,
                model,
                type,
                radius,
                width,
                profil,
                massa,
                speed,
                idObject,
                idBitrix,
                sezon,
                nameCar,
                tire,
                status,
                element: e // Добавляем сам элемент DOM
            };
        });
    }

    onElementInput({ target }) {
        console.log(this.globalArrayDatas)
        const searchTerm = target.value.trim().toLowerCase();
        if (!searchTerm) {
            this.openAllList();
            return;
        }
        const filteredData = this.globalArrayDatas.filter(({ element, ...rest }) =>
            Object.values({ ...rest }).some(value => {
                if (typeof value === 'string') {
                    // Ищем как по символьному вхождению, так и по полному совпадению слова
                    return value.includes(searchTerm) || value === searchTerm;
                }
                return false;
            })
        );
        this.createList(filteredData);
    }

    createList(filteredData) {
        this.removeList();
        filteredData.forEach(item => {
            item.element.style.display = 'flex';
        });
    }

    removeList() {
        this.rows.forEach(e => e.style.display = 'none');
    }

    openAllList() {
        this.rows.forEach(e => e.style.display = 'flex');
    }
}