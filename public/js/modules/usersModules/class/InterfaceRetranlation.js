
import { ContentGeneration } from './CreateContent.js'
import { Helpers } from './Helpers.js'
import { Requests } from './RequestStaticMethods.js'
import { Validation } from './Validation.js'
import { EditContollClick } from './EditControllClick.js'

export class InterfaceRetranslation {
    constructor(index, buttons, settingWrap, container, login, prava, creator, creators) {
        this.container = container
        this.index = index
        this.buttons = buttons
        this.settingWrap = settingWrap
        this.login = login
        this.prava = prava
        this.creator = creator
        this.creators = creators
        this.obj = null
        this.pop = document.querySelector('.popup-background')
        this.table = this.settingWrap.querySelector('.table_data_info')
        this.init()
    }


    init() {
        console.log('аккаунт')
        this.buttons[0].addEventListener('click', this.controllRetra.bind(this))
        this.createTableRetra()
    }

    close() {
        const close = this.modal.querySelector('.close_modal_window')
        close.addEventListener('click', this.modalActivity.bind(this, this.pop, 'none', 1))
    }
    modalActivity(pop, flex, num) {
        this.modal.style.display = `${flex}`
        pop.style.zIndex = num
    }

    controllRetra() {
        this.container.innerHTML = ContentGeneration.createRetra(this.login, this.prava, this.creator, this.creators, this.data)
        this.cacheElements();
        this.addEventListeners();
        this.applyValidation();
        this.uzname = this.container.querySelector('#uzname');
        this.tp = this.container.querySelector('.tp');
        this.createsUser = this.container.querySelector('.creates');
        this.modal = this.container.querySelector('.wrap_lk')
    }

    cacheElements() {
        this.nameRetra = this.container.querySelector('#nameRetra');
        this.tokenRetra = this.container.querySelector('#tokenRetra');
        this.port_protokol = this.container.querySelector('#port_protokol');
        this.get_token = this.container.querySelector('.get_token');
        this.uz = this.container.querySelector('.uz');
        this.retra = this.container.querySelector('.retra');
        this.roles = this.container.querySelector('.roles');
        this.createsUser = this.container.querySelector('.creates');
        this.uzRow = this.container.querySelector('.uz').parentElement;
        this.row_kritery = this.container.querySelectorAll('.row_kritery');
        this.check_list = this.container.querySelectorAll('.check_list');
        this.check_container = this.container.querySelectorAll('.check_container');
        this.modal = this.container.querySelector('.wrap_lk');
        this.mess = this.container.querySelector('.valid_message');
    }

    addEventListeners() {
        this.container.querySelector('.bnt_set').addEventListener('click', this.validationAndPackObject.bind(this));
        this.modal.querySelector('.close_modal_window').addEventListener('click', this.modalActivity.bind(this, this.pop, 'none', 1));
        this.get_token.addEventListener('click', this.openPageTokenAuth.bind(this))
    }


    openPageTokenAuth() {
        const url = 'https://hosting.wialon.com/login.html';
        // Открываем новое окно с указанным URL
        window.open(url, '_blank');
    }

    applyValidation() {
        Validation.filterAccount(this.creator, this.uz, this.prava);
        Validation.filterCreater(this.createsUser, this.uz)
        Validation.protokol(this.retra, this.tokenRetra)
    }

    async validationAndPackObject() {
        if (this.nameRetra.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите имя ретранслятора');
        if (this.port_protokol.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите порт');
        if (this.tokenRetra.value === '' && this.retra.value === 'Wialon API') return Helpers.viewRemark(this.mess, 'red', 'Укажите токен');
        if (this.retra.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите протокол ретрансляции');
        if (this.uz.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите учетную запись');

        this.obj = {
            nameRetra: this.nameRetra.value,
            port_protokol: this.port_protokol.value,
            tokenRetra: this.tokenRetra.value,
            uz: this.uz.value,
            protokol: this.retra.value,
            creater: this.createsUser.value,
            idx: await Requests.findId('idr')
        }
        console.log(this.obj)
        const messUser = await Requests.saveRetra(this.obj)
        Helpers.viewRemark(this.mess, messUser.flag ? 'green' : 'red', messUser.message)
        this.add = 'add'
        this.createTableRetra()
    }

    async createTableRetra() {
        console.log('ТУТ?')
        this.table.innerHTML = ContentGeneration.addTableRetra()
        this.data = await Helpers.getAccountAll()
        this.usersData = await Requests.getRetraCreater(this.creator)
        console.log(this.usersData)
        this.addContentRetra()

    }
    addContentRetra() {
        const tableParent = this.table.querySelector('.table_stata')
        console.log(this.usersData)
        if (this.add) this.usersData.sort((a, b) => b.incriment[0] - a.incriment[0])
        const data = this.usersData.map(el => {
            return [{ id: el.incriment[0], creater: el.creater, global_creator: el.global_creator, del: el.delStatus },
            [{ name: el.nameRetra, incriment: el.incriment[0], entity: 'retra' },
            { name: el.username, incriment: el.creater, entity: 'user' },
            { name: el.name, incriment: el.incriment[1], entity: 'account' }, { name: el.protokol, incriment: null, entity: null }, el.object_count, el.group_count, 'x']];

        })
        data.forEach(el => {
            console.log(el)
            if (this.prava === 'Курсор') {
                this.addRowToTable(tableParent, el)
            }
            else if (this.prava === 'Интегратор') {
                if (el[0].global_creator === Number(this.creator) || el[0].creater === Number(this.creator)) {
                    if (el[0].del === 'true') return
                    this.addRowToTable(tableParent, el)
                }
            } else {
                if (el[0].creater === Number(this.creator)) {
                    if (el[0].del === 'true') return
                    this.addRowToTable(tableParent, el)
                }
            }
        });
    }
    // Функция для добавления строки в таблицу
    addRowToTable(tableParent, rowData) {
        const tr = document.createElement('tr');
        tr.classList.add('rows_stata', 'rows_move_kursor');
        tr.innerHTML = rowData[1].map((it, index) => index < 4 ? `<th class="cell_stata cell cell_table_auth click_property" index="${index}" entity="${it.entity}" rel="${it.incriment}">${it.name ? it.name : '-'}</th>` :
            `<th class="cell_stata cell cell_table_auth">${it ? it : '-'}</th>`).join('');
        tr.setAttribute('data-id', rowData[0].id);
        if (rowData[0].del === 'true') tr.classList.add('sleepblock')
        tableParent.appendChild(tr);
        const lastRow = tableParent.lastElementChild;
        const lastCell = lastRow.lastElementChild;
        lastCell.addEventListener('click', this.updateTable.bind(this, lastRow));
        const cells = tr.querySelectorAll('.click_property');
        cells.forEach(el => el.addEventListener('click', () => new EditContollClick(el, this.data, this.container, this.login, this.prava, this.creator, this.creators, this, this.usersData)))

    };


    async updateTable(lastRow) {
        const name = lastRow.children[0].textContent
        this.accountIncriment = lastRow.children[2].getAttribute('rel')
        this.container.insertAdjacentHTML('beforeend', ContentGeneration.confirm('ретранслятор', name));
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
        await Requests.deleteAccount(this.idDelete, this.index, this.prava)
        const obj = {
            action: 'Удалён', table: 'retrasHistory', columns: 'uniqRetraID', data: String(Math.floor((new Date().getTime()) / 1000)),
            uniqUsersID: Number(this.creator), uniqEntityID: Number(this.idDelete), nameAccount: Number(this.accountIncriment)
        }
        const resu = await Requests.setHistory(obj)
        this.closeConfirm()
        this.createTableRetra()
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