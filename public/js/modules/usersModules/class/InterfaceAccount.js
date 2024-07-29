import { ContentGeneration } from './CreateContent.js'
import { Helpers } from './Helpers.js'
import { Requests } from './RequestStaticMethods.js'
import { EditContollClick } from './EditControllClick.js'


export class InterfaceAccount {
    constructor(container, index, settingWrap, buttons, login, prava, creator, creators) {
        this.container = container
        this.index = index
        this.settingWrap = settingWrap
        this.buttons = buttons
        this.login = login
        this.prava = prava
        this.creator = creator
        this.creators = creators
        this.table = this.settingWrap.querySelector('.table_data_info')
        this.pop = document.querySelector('.popup-background')
        this.init()
    }

    init() {
        console.log('аккаунт')
        this.buttons[0].addEventListener('click', this.controllLK.bind(this))
        this.createTableAccount()
    }


    controllLK() {
        console.log(this.login)
        this.container.innerHTML = ContentGeneration.createLK(this.login, this.prava, this.creator, this.creators)
        this.uzname = this.container.querySelector('#uzname');
        this.tp = this.container.querySelector('.tp');
        this.createsUser = this.container.querySelector('.creates');
        this.modal = this.container.querySelector('.wrap_lk')
        this.modalActivity(this.pop, 'flex', 3)
        this.close()
        this.save()

    }

    close() {
        const close = this.modal.querySelector('.close_modal_window')
        close.addEventListener('click', this.modalActivity.bind(this, this.pop, 'none', 1))
    }
    save() {
        const button = this.container.querySelector('.bnt_set')
        this.mess = this.container.querySelector('.valid_message')
        button.addEventListener('click', this.validationAndPackObject.bind(this))
    }

    modalActivity(pop, flex, num) {
        this.modal.style.display = `${flex}`
        pop.style.zIndex = num
    }

    async validationAndPackObject() {
        if (this.uzname.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите имя учетной записи');
        if (this.tp.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите тарифный план');

        this.obj = {
            idx: await Requests.findId('ida'),
            name: this.uzname.value,
            uniqCreater: this.createsUser.value,
            uniqTP: this.tp.value
        }
        const messAccount = await Requests.saveAccount(this.obj)
        Helpers.viewRemark(this.mess, messAccount.flag ? 'green' : 'red', messAccount.message)
        this.data = await Helpers.getAccountAll()
        this.add = 'add'
        this.createTableAccount() //отрисовка контента таблицы
    }

    async createTableAccount() {
        this.table.innerHTML = ContentGeneration.addTableAccount()
        this.data = await Helpers.getAccountAll()
        console.log(this.data)
        //  this.usersData = await Requests.getAcc()
        this.addContentAccount()
    }

    addContentAccount() {
        const tableParent = this.table.querySelector('.table_stata')
        if (this.add) this.data.uniqueAccounts.sort((a, b) => b.incriment - a.incriment)
        this.data.uniqueAccounts.forEach(el => {
            if (this.prava === 'Курсор') {
                this.addRowToTable(tableParent, el)
            }
            else if (this.prava === 'Интегратор') {
                if (el.uniqCreater === Number(this.creator) || el.global_creator === Number(this.creator)) {
                    this.addRowToTable(tableParent, el)
                }
            } else {
                if (el.uniqCreater === Number(this.creator)) {
                    this.addRowToTable(tableParent, el)
                }
            }
        });
    }

    // Функция для добавления строки в таблицу
    addRowToTable(tableParent, rowData) {
        const arrayText = [{ name: rowData.name, incriment: rowData.incriment, entity: 'account' },
        { name: rowData.creator_name, incriment: rowData.uniqCreater, entity: 'user' },
        { name: rowData.tp, incriment: null, entity: 'tp' }, rowData.uniqueUsersCount, rowData.uniqueRetrasCount, rowData.uniqueGroupsCount, rowData.uniqueObjectsCount, 'x']
        const tr = document.createElement('tr');
        tr.classList.add('rows_stata', 'rows_move_kursor');
        tr.innerHTML = arrayText.map((it, index) => index < 3 ? `<th class="cell_stata cell cell_table_auth click_property" index="${index}" entity="${it.entity}"rel="${it.incriment}">${it.name}</th>` :
            `<th class="cell_stata cell cell_table_auth">${it}</th>`).join('');
        tr.setAttribute('data-id', rowData.incriment);
        tableParent.appendChild(tr);
        const lastRow = tableParent.lastElementChild;
        const lastCell = lastRow.lastElementChild;
        lastCell.addEventListener('click', this.updateTable.bind(this, lastRow));
        const cells = tr.querySelectorAll('.click_property');
        cells.forEach(el => el.addEventListener('click', () => new EditContollClick(el, this.data, this.container, this.login, this.prava, this.creator, this.creators, this)))
    };

    async updateTable(lastRow) {
        const name = lastRow.children[0].textContent
        this.container.insertAdjacentHTML('beforeend', ContentGeneration.confirm('учетную запись', name));
        this.idDelete = lastRow.getAttribute('data-id'); // Получаем id из data-атрибута
        this.modalConfirmElement = this.container.querySelector('.modal_podtver');
        this.modalConfirm()
        this.eventListenerConfirm()
    }

    eventListenerConfirm() {
        const okButton = this.modalConfirmElement.querySelector('.ok_podtver');
        const cancelButton = this.modalConfirmElement.querySelector('.cancel_podtver');
        cancelButton.addEventListener('click', this.closeConfirm.bind(this))
        okButton.addEventListener('click', this.delete.bind(this))
    }

    async delete() {
        console.log(this.idDelete, this.index)
        const res = await Requests.deleteAccount(this.idDelete, this.index)
        console.log(res)
        this.closeConfirm()
        this.data = await Helpers.getAccountAll()
        this.createTableAccount()
    }

    closeConfirm() {
        this.modalConfirmElement.remove()
        this.pop.style.zIndex = 2
    }
    modalConfirm() {
        this.modalConfirmElement.style.zIndex = 4
        this.pop.style.zIndex = 3
    }
}