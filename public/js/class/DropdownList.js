
export class DropDownList {
    constructor(element, final) {
        this.element = element;
        this.final = final
        this.globalArrayData = []
        this.globalArrayDatas = []
        this.list = document.querySelectorAll('.listItem')
        this.group = document.querySelectorAll('.groups')
        this.accounts = document.querySelectorAll('.accounts')
        this.element.addEventListener(`input`, this.onElementInput.bind(this));
        this.pushData();
    }

    async pushData() {
        this.group.forEach(e => this.globalArrayDatas.push(e.getAttribute('name')))
        this.accounts.forEach(e => this.globalArrayDatas.push(e.getAttribute('name')))

        console.log(this.final)
        this.final.forEach(e => {
            this.globalArrayDatas.push(e.object_id);
            this.globalArrayDatas.push(e.object_name);
            this.globalArrayDatas.push(e.imeidevice);
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
        // Сначала скрываем все элементы
        this.removeList();

        // Обрабатываем каждый элемент в списке
        this.list.forEach(e => {
            const group = e.closest('.groups');
            const accounts = e.closest('.accounts');

            // Проверяем соответствие для текущего объекта
            const matches = data.includes(e.getAttribute('name')) || data.includes(e.getAttribute('idx'));

            // Если элемент совпадает, показываем его и поднимаемся к родительским элементам
            if (matches) {
                e.style.display = 'flex';

                // Показываем родительскую группу
                if (group) {
                    group.style.display = 'flex';

                    // Показываем родительский аккаунт
                    const account = group.closest('.accounts');
                    if (account) {
                        account.style.display = 'flex';
                    }
                }
            }
        });

        // Обрабатываем группы и аккаунты, чтобы показать их только если у них есть совпадающие элементы или если они содержат элементы
        this.group.forEach(g => {
            const groupHasVisibleItems = Array.from(g.querySelectorAll('.listItem')).some(item => item.style.display === 'flex');
            // Также проверяем, если группа сама по себе совпадает
            const groupMatches = data.includes(g.getAttribute('name'));

            if (groupHasVisibleItems || groupMatches) {
                g.style.display = 'flex';
            } else {
                g.style.display = 'none';
            }
        });

        this.accounts.forEach(a => {
            const accountHasVisibleGroups = Array.from(a.querySelectorAll('.groups')).some(group => group.style.display === 'flex');
            // Также проверяем, если аккаунт сам по себе совпадает
            const accountMatches = data.includes(a.getAttribute('name'));

            if (accountHasVisibleGroups || accountMatches) {
                a.style.display = 'flex';
            } else {
                a.style.display = 'none';
            }
        });
    }
    removeList() {
        this.list.forEach(e => e.style.display = 'none');
        this.group.forEach(e => e.style.display = 'none');
        this.accounts.forEach(e => e.style.display = 'none');
    }
    openAllList() {
        this.list.forEach(e => e.style.display = 'flex');
        this.group.forEach(e => e.style.display = 'flex');
        this.accounts.forEach(e => e.style.display = 'flex');
    }
} 