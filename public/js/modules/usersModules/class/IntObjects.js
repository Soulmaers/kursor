import { IntarfaceBase } from './IntarfaceBase.js'
import { ContentGeneration } from './CreateContent.js'
import { Requests } from './RequestStaticMethods.js'
import { Helpers } from './Helpers.js'
import { EditContollClick } from './EditControllClick.js'
import { Validation } from './Validation.js'

export class IntObjects extends IntarfaceBase {
    constructor(index, buttons, settingWrap, container, login, prava, creator, creators) {
        super(index, buttons, settingWrap, container, login, prava, creator, creators);

    }

    fetchContent() {
        this.container.innerHTML = ContentGeneration.createObj(this.login, this.prava, this.creator, this.creators, this.data)
        this.caseElements()
    }

    caseElements() {
        this.objectname = this.container.querySelector('#objectname');
        this.typedevice = this.container.querySelector('#typedevice');
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
        this.type = this.container.querySelector('.type_objects_index');
        this.tp = this.container.querySelector('.tp');
        this.createsUser = this.container.querySelector('.creates');
        this.modal = this.container.querySelector('.wrap_lk')
    }

    async createTable() {
        this.table.innerHTML = ContentGeneration.addTableObject()
        this.result = await Requests.getObjectCreater(this.creator)
        console.log(this.result)
    }
    applyValid() {
        Validation.filterAccount(this.creator, this.uz, this.prava)
        Validation.filterCreater(this.createsUser, this.uz)
    }
    async validationAndPackObject() {
        if (this.objectname.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите название объекта');
        if (this.type.value === '') return Helpers.viewRemark(this.mess, 'red', 'Выберите тип объекта');
        if (this.typedevice.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите тип устройства');
        if (this.port.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите порт');
        if (this.imeidevice.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите уникальный IMEI');
        if (this.addressserver.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите адрес сервера');
        if (this.uz.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите учетную запись');
        if (this.tp.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите тарифный план');



        this.obj = {
            objectname: this.objectname.value,
            typedevice: this.typedevice.value,
            typeobject: this.type.value,
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
        if (messUser.flag) await Requests.setDefaultSettings(this.obj.idx, this.obj.typeobject)
        this.add = 'add'
        this.create()
    }
    addContent() {
        const tableParent = this.table.querySelector('.table_stata')
        if (this.add) this.result.sort((a, b) => b.incriment[0] - a.incriment[0])

        const data = this.result.map(el => {
            return [{ id: el.incriment[0], creater: el.creater, global_creator: el.global_creator, del: el.delStatus },
            [{ name: el.objectname, incriment: el.incriment[0], id: el.idx[0], entity: 'object' },
            { name: el.name_retra ? el.name_retra : el.username, incriment: el.name_retra ? el.incriment_retra : el.creater, entity: el.name_retra ? 'retra' : 'user' },
            { name: el.tp, incriment: null, entity: 'tp' }, { name: el.name, incriment: el.incriment[1], entity: 'account' }, el.group_count, { name: el.imeidevice, incriment: null, entity: null }, 'x']];

        });
        console.log(data)
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

    createHistoryObject() {
        const obj = {
            action: 'Удалён', table: 'objectsHistory', columns: 'uniqObjectID', data: String(Math.floor((new Date().getTime()) / 1000)),
            uniqUsersID: Number(this.creator), uniqEntityID: Number(this.idDelete), nameAccount: Number(this.accountIncriment)
        }
        return obj
    }


}