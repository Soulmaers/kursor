import { Requests } from './RequestStaticMethods.js'
import { ContentGeneration } from './CreateContent.js'
import { Helpers } from './Helpers.js'
import { Validation } from './Validation.js'
import { EditContollClick } from './EditControllClick.js'


export class InterfaceGroups {
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
        console.log('группа')
        //  await this.getAccounts()
        this.createTableGroup()
        this.buttons[0].addEventListener('click', this.controllGroup.bind(this))

    }

    /*
        async getAccounts() {
            this.accounts = await Requests.getAccounts(this.creator)
        }*/
    controllGroup() {
        console.log(this.result)
        this.container.innerHTML = ContentGeneration.createGroup(this.login, this.prava, this.creator, this.creators, this.datas)
        this.check_list = this.container.querySelector('.check_list');
        this.check_container = this.container.querySelector('.check_container');
        this.ok = this.container.querySelector('.ok_podtver');
        this.cancel = this.container.querySelector('.cancel_podtver');
        this.row_kritery = this.container.querySelectorAll('.row_kritery');
        this.nameGroup = this.container.querySelector('#nameGroup');
        this.face = this.container.querySelector('#face');
        this.facecontact = this.container.querySelector('#facecontact');
        this.uz = this.container.querySelector('.uz');
        this.createsUser = this.container.querySelector('.creates');

        this.eventListener()
        Validation.filterAccount(this.creator, this.uz, this.prava)
        Validation.filterCreaterObject(this.createsUser, this.uz, this.row_kritery)
        Validation.filterObject(this.creator, this.row_kritery, this.prava)
        Validation.filterSelectAccount(this.uz, this.row_kritery);
        Validation.check(this.row_kritery)
        this.modal = this.container.querySelector('.wrap_lk')
        this.modalActivity(this.pop, 'flex', 3)
        this.close()
        this.save()

    }

    eventListener() {
        this.check_list.addEventListener('click', this.toogleChangeClass.bind(this, 'select'))
        this.cancel.addEventListener('click', this.toogleChangeClass.bind(this, 'cancel'))
        this.ok.addEventListener('click', this.toogleChangeClass.bind(this))
    }


    toogleChangeClass(select) {
        console.log(select)
        console.log('тогле')
        if (select === 'select') {
            if (this.uz.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите учетную запись');
            const bool = Validation.filterElements(this.uz.value, this.row_kritery)
            if (!bool) return Helpers.viewRemark(this.mess, 'red', `Учетная запись не содержит объектов`);
        }
        if (select === 'cancel') {
            this.clearListActivCheck()
        }
        this.vieCountCheck()
        this.check_container.classList.toggle('displays')
    }

    vieCountCheck() {
        const obj = this.check_container.querySelectorAll('.activ_check').length
        this.check_container.previousElementSibling.children[0].textContent = `Выбрано (${obj})`
    }

    modalActivity(pop, flex, num) {
        this.modal.style.display = `${flex}`
        pop.style.zIndex = num
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
    clearListActivCheck() {
        const obj = this.container.querySelectorAll('.activ_check')
        if (obj) obj.forEach(e => e.classList.remove('activ_check'))
    }
    async validationAndPackObject() {
        if (this.nameGroup.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите название группы');
        if (this.uz.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите учетную запись');

        const objectsCar = this.container.querySelectorAll('.activ_check')
        const objectsId = [...objectsCar].map(el => el.nextElementSibling.getAttribute('uniqid'))
        this.obj = {
            nameGroup: this.nameGroup.value,
            face: this.face.value,
            facecontact: this.facecontact.value,
            uz: this.uz.value,
            creater: this.createsUser.value,
            idx: await Requests.findId('idg')
        }
        const messUser = await Requests.saveGroup(this.obj, objectsId)

        Helpers.viewRemark(this.mess, messUser.flag ? 'green' : 'red', messUser.message)
        this.add = 'add'
        this.createTableGroup()
    }



    async createTableGroup() {
        console.log(this.creator)
        this.table.innerHTML = ContentGeneration.addTableGroup()
        this.datas = await Helpers.getAccountAll()
        this.result = await Requests.getGroupCreater(this.creator)
        this.addContenGroups()
    }

    addContenGroups() {
        const tableParent = this.table.querySelector('.table_stata')
        if (this.add) this.result.sort((a, b) => b.incriment[0] - a.incriment[0])
        console.log(this.result)
        this.data = this.result.map(el => {
            return [{ id: el.incriment[0], creater: el.creater, global_creator: el.global_creator },
            [{ name: el.nameGroup, incriment: el.incriment[0], entity: 'group' },
            { name: el.name_retra ? el.name_retra : el.username, incriment: el.name_retra ? el.incriment_retra : el.creater, entity: el.name_retra ? 'retra' : 'user' },
            { name: el.name, incriment: el.incriment[1], entity: 'account' }, el.object_count, 'x']];

        });

        this.data.forEach(el => {
            if (this.prava === 'Курсор') {
                this.addRowToTable(tableParent, el)
            }
            else if (this.prava === 'Интегратор') {
                if (el[0].global_creator === Number(this.creator) || el[0].creater === Number(this.creator)) {
                    this.addRowToTable(tableParent, el)
                }
            } else {
                console.log(el[0].creater, Number(this.creator))
                if (el[0].creater === Number(this.creator)) {
                    this.addRowToTable(tableParent, el)
                }
            }
        });
    }
    // Функция для добавления строки в таблицу
    addRowToTable(tableParent, rowData) {
        const tr = document.createElement('tr');
        tr.classList.add('rows_stata', 'rows_move_kursor');
        tr.innerHTML = rowData[1].map((it, index) => index < 3 ? `<th class="cell_stata cell cell_table_auth click_property" index="${index}" entity="${it.entity}" rel="${it.incriment}">${it.name ? it.name : '-'}</th>` :
            `<th class="cell_stata cell cell_table_auth">${it ? it : '-'}</th>`).join('');
        tr.setAttribute('data-id', rowData[0].id);
        tableParent.appendChild(tr);
        const lastRow = tableParent.lastElementChild;
        const lastCell = lastRow.lastElementChild;
        lastCell.addEventListener('click', this.updateTable.bind(this, lastRow));
        const cells = tr.querySelectorAll('.click_property');
        cells.forEach(el => el.addEventListener('click', () => new EditContollClick(el, this.datas, this.container, this.login, this.prava, this.creator, this.creators, this, this.result)))

    };
    async updateTable(lastRow) {
        const name = lastRow.children[0].textContent
        this.container.insertAdjacentHTML('beforeend', ContentGeneration.confirm('группу', name));
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
        await Requests.deleteAccount(this.idDelete, this.index)
        this.closeConfirm()
        this.createTableGroup()
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