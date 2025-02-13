import { IntarfaceBase } from './IntarfaceBase.js'
import { ContentGeneration } from './CreateContent.js'
import { Requests } from './RequestStaticMethods.js'
import { Helpers } from './Helpers.js'
import { EditContollClick } from './EditControllClick.js'
import { Validation } from './Validation.js'


export class IntAccounts extends IntarfaceBase {
    constructor(index, buttons, settingWrap, container, login, prava, creator, creators) {
        super(index, buttons, settingWrap, container, login, prava, creator, creators)
    }


    fetchContent() {
        this.container.style.display = 'flex'
        this.container.innerHTML = ContentGeneration.createLK(this.login, this.prava, this.creator, this.creators)
        this.caseElements()
    }

    caseElements() {
        this.uzname = this.container.querySelector('#uzname');
        this.tp = this.container.querySelector('.tp');
        this.createsUser = this.container.querySelector('.creates');
        this.modal = this.container.querySelector('.wrap_lk')
        this.confirmPasswordInput = this.container.querySelector('#confirm_password');
        this.passwordInput = this.container.querySelector('#password');
    }

    applyValid() {
        Validation.checkPasswords(this.passwordInput, this.confirmPasswordInput);
    }

    async createTable() {
        this.table.innerHTML = ContentGeneration.addTableAccount()
    }

    async validationAndPackObject() {
        if (this.uzname.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите имя учетной записи');
        if (this.tp.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите тарифный план');
        if (this.passwordInput.value === '' || this.confirmPasswordInput.value === '') return Helpers.viewRemark(this.mess, 'red', 'Установите пароль');
        if (this.passwordInput.value !== this.confirmPasswordInput.value) return Helpers.viewRemark(this.mess, 'red', 'Не совпадают пароли');
        this.obj = {
            idx: await Requests.findId('ida'),
            name: this.uzname.value,
            uniqCreater: this.createsUser.value,
            uniqTP: this.tp.value,
            role: 'Администратор',
            password: this.confirmPasswordInput.value,
            idu: await Requests.findId('idu')
        }
        console.log(this.obj)
        const messAccount = await Requests.saveAccount(this.obj)

        Helpers.viewRemark(this.mess, messAccount.flag ? 'green' : 'red', messAccount.message)
        this.data = await Helpers.getAccountAll()
        console.log(this.data)
        this.add = 'add'
        this.create()
    }

    addContent() {
        const tableParent = this.table.querySelector('.table_stata')
        if (this.add) this.data.uniqueAccounts.sort((a, b) => b.incriment - a.incriment)
        this.data.uniqueAccounts.forEach(el => {
            console.log(el)
            if (this.prava === 'Курсор') {
                this.addRowToTable(tableParent, el)
            }
            else if (this.prava === 'Интегратор') {
                if (el.uniqCreater === Number(this.creator) || el.global_creator === Number(this.creator)) {
                    if (el.del === 'true') return
                    this.addRowToTable(tableParent, el)
                }
            } else {
                if (el.uniqCreater === Number(this.creator)) {
                    if (el.del === 'true') return
                    this.addRowToTable(tableParent, el)
                }
            }
        });
    }

    addRowToTable(tableParent, rowData) {
        const arrayText = [{ name: rowData.name, incriment: rowData.incriment, entity: 'account' },
        { name: rowData.creator_name, incriment: rowData.uniqCreater, entity: 'user' },
        { name: rowData.tp, incriment: null, entity: 'tp' }, rowData.uniqueUsersCount, rowData.uniqueRetrasCount, rowData.uniqueGroupsCount, rowData.uniqueObjectsCount, 'x']
        const tr = document.createElement('tr');
        tr.classList.add('rows_stata', 'rows_move_kursor');
        tr.innerHTML = arrayText.map((it, index) => index < 3 ? `<th class="cell_stata cell cell_table_auth click_property" index="${index}" entity="${it.entity}"rel="${it.incriment}">${it.name}</th>` :
            `<th class="cell_stata cell cell_table_auth">${it}</th>`).join('');
        tr.setAttribute('data-id', rowData.incriment);
        tr.setAttribute('creator-id', rowData.uniqCreater);
        if (rowData.del === 'true') tr.classList.add('sleepblock')
        tableParent.appendChild(tr);
        const lastRow = tableParent.lastElementChild;
        const lastCell = lastRow.lastElementChild;
        lastCell.addEventListener('click', this.updateTable.bind(this, lastRow));
        const cells = tr.querySelectorAll('.click_property');
        cells.forEach(el => el.addEventListener('click', () => new EditContollClick(el, this.data, this.container, this.login, this.prava, this.creator, this.creators, this)))
    };

    async updateTable(lastRow) {
        this.name = lastRow.children[0].textContent
        this.container.insertAdjacentHTML('beforeend', ContentGeneration.confirm('учетную запись', this.name));
        this.idDelete = lastRow.getAttribute('data-id'); // Получаем id из data-атрибута
        this.creatorId = lastRow.getAttribute('creator-id'); // Получаем id из data-атрибута
        this.modalConfirmElement = this.container.querySelector('.modal_podtver');
        this.modalConfirm()
        this.eventListenerConfirm()

    }

    createHistoryObject() {
        const obj = {
            action: 'Удалён', table: 'accountsHistory', columns: 'uniqAccountID', data: String(Math.floor((new Date().getTime()) / 1000)),
            uniqUsersID: Number(this.creator), uniqEntityID: Number(this.idDelete), nameAccount: Number(this.idDelete)
        }
        return obj
    }


}