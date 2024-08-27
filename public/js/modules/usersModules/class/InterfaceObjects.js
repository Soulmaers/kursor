
import { Requests } from './RequestStaticMethods.js'
import { ContentGeneration } from './CreateContent.js'
import { Helpers } from './Helpers.js'
import { Validation } from './Validation.js'
import { EditContollClick } from './EditControllClick.js'


export class InterfaceObjects {
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



    async init() {
        console.log('объекты')
        this.createTableObject()
        this.buttons[0].addEventListener('click', this.controllObject.bind(this))


    }
    controllObject() {
        this.container.innerHTML = ContentGeneration.createObj(this.login, this.prava, this.creator, this.creators, this.data)
        this.objectname = this.container.querySelector('#objectname');
        this.typedevice = this.container.querySelector('#typedevice');
        this.typeobject = this.container.querySelector('#typeobject');
        this.port = this.container.querySelector('#port');
        this.imeidevice = this.container.querySelector('#imeidevice');
        this.addressserver = this.container.querySelector('#addressserver');
        this.phonenumber = this.container.querySelector('#phonenumber');
        this.markaobject = this.container.querySelector('#markaobject');
        this.modelobject = this.container.querySelector('#modelobject');
        this.vinobject = this.container.querySelector('#vinobject');
        this.gosnomerobject = this.container.querySelector('#gosnomerobject');
        this.idbitrixobject = this.container.querySelector('#idbitrixobject');
        this.uz = this.container.querySelector('.uz');
        this.tp = this.container.querySelector('.tp');
        this.createsUser = this.container.querySelector('.creates');
        Validation.filterAccount(this.creator, this.uz, this.prava)
        Validation.filterCreater(this.createsUser, this.uz)

        this.modal = this.container.querySelector('.wrap_lk')
        this.modalActivity(this.pop, 'flex', 3)
        this.close()
        this.save()

    }

    save() {
        const button = this.container.querySelector('.bnt_set')
        this.mess = this.container.querySelector('.valid_message')
        button.addEventListener('click', this.validationAndPackObject.bind(this))
    }

    async validationAndPackObject() {
        if (this.objectname.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите название объекта');
        if (this.typedevice.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите тип устройства');
        if (this.port.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите порт');
        if (this.imeidevice.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите уникальный IMEI');
        if (this.addressserver.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите адрес сервера');
        if (this.uz.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите учетную запись');
        if (this.tp.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите тарифный план');

        this.obj = {
            objectname: this.objectname.value,
            typedevice: this.typedevice.value,
            typeobject: this.typeobject.value,
            port: this.port.value,
            imeidevice: this.imeidevice.value,
            addressserver: this.addressserver.value,
            phonenumber: this.phonenumber.value,
            markaobject: this.markaobject.value,
            modelobject: this.modelobject.value,
            vinobject: this.vinobject.value,
            gosnomerobject: this.gosnomerobject.value,
            idbitrixobject: this.idbitrixobject.value,
            uz: this.uz.value,
            tp: this.tp.value,
            creater: this.createsUser.value,
            idx: await Requests.findId('ido')
        }
        console.log(this.obj)
        const messUser = await Requests.saveObject(this.obj, this.prava)
        Helpers.viewRemark(this.mess, messUser.flag ? 'green' : 'red', messUser.message)
        this.add = 'add'
        this.createTableObject()
    }


    modalActivity(pop, flex, num) {
        this.modal.style.display = `${flex}`
        pop.style.zIndex = num
    }

    close() {
        const close = this.modal.querySelector('.close_modal_window')
        close.addEventListener('click', this.modalActivity.bind(this, this.pop, 'none', 1))
    }

    async createTableObject() {
        this.table.innerHTML = ContentGeneration.addTableObject()
        this.data = await Helpers.getAccountAll()
        this.accountID = (this.data.uniqueUsers.find(e => e.incriment === Number(this.creator))).incriment_account
        this.result = await Requests.getObjectCreater(this.creator)
        this.addContentObjects()
    }

    addContentObjects() {
        const tableParent = this.table.querySelector('.table_stata')
        if (this.add) this.result.sort((a, b) => b.incriment[0] - a.incriment[0])

        const data = this.result.map(el => {
            return [{ id: el.incriment[0], creater: el.creater, global_creator: el.global_creator, del: el.delStatus },
            [{ name: el.objectname, incriment: el.incriment[0], id: el.idx[0], entity: 'object' },
            { name: el.name_retra ? el.name_retra : el.username, incriment: el.name_retra ? el.incriment_retra : el.creater, entity: el.name_retra ? 'retra' : 'user' },
            { name: el.tp, incriment: null, entity: 'tp' }, { name: el.name, incriment: el.incriment[1], entity: 'account' }, el.group_count, { name: el.imeidevice, incriment: null, entity: null }, 'x']];

        });
        data.forEach(el => {
            if (this.prava === 'Курсор') {
                this.addRowToTable(tableParent, el)
            }
            else if (this.prava === 'Администратор') {
                if (el[1][3].incriment === this.accountID) {  // Допустим, у вас есть this.accountId, который указывает на учетную запись администратора
                    if (el.delStatus === 'true') return;
                    this.addRowToTable(tableParent, el);
                }
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
        tr.innerHTML = rowData[1].map((it, index) => index < 4 || index === 5 ? `<th class="cell_stata cell cell_table_auth click_property" idx="${it.id}" index="${index}" entity="${it.entity}" rel="${it.incriment}">${it.name ? it.name : '-'}</th>` :
            `<th class="cell_stata cell cell_table_auth">${it ? it : '-'}</th>`).join('');
        tr.setAttribute('data-id', rowData[0].id);
        if (rowData[0].del === 'true') tr.classList.add('sleepblock')
        tableParent.appendChild(tr);
        const lastRow = tableParent.lastElementChild;
        const lastCell = lastRow.lastElementChild;
        lastCell.addEventListener('click', this.updateTable.bind(this, lastRow));
        const cells = tr.querySelectorAll('.click_property');
        cells.forEach(el => el.addEventListener('click', () => new EditContollClick(el, this.data, this.container, this.login, this.prava, this.creator, this.creators, this, this.result)))

    };
    async updateTable(lastRow) {
        const name = lastRow.children[0].textContent
        this.accountIncriment = lastRow.children[3].getAttribute('rel')
        this.container.insertAdjacentHTML('beforeend', ContentGeneration.confirm('объект', name));
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
            action: 'Удалён', table: 'objectsHistory', columns: 'uniqObjectID', data: String(Math.floor((new Date().getTime()) / 1000)),
            uniqUsersID: Number(this.creator), uniqEntityID: Number(this.idDelete), nameAccount: Number(this.accountIncriment)
        }
        const resu = await Requests.setHistory(obj)
        this.closeConfirm()
        this.createTableObject()
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