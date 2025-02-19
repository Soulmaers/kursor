import { IntarfaceBase } from './IntarfaceBase.js'
import { ContentGeneration } from './CreateContent.js'
import { Requests } from './RequestStaticMethods.js'
import { Helpers } from './Helpers.js'
import { EditContollClick } from './EditControllClick.js'
import { Validation } from './Validation.js'


export class IntUsers extends IntarfaceBase {
    constructor(index, buttons, settingWrap, container, login, prava, creator, creators) {
        super(index, buttons, settingWrap, container, login, prava, creator, creators)
    }


    fetchContent() {
        this.container.style.display = 'flex'
        this.container.innerHTML = ContentGeneration.createUser(this.login, this.prava, this.creator, this.creators, this.data)
        this.caseElements()
    }

    caseElements() {
        this.username = this.container.querySelector('#username');
        this.passwordInput = this.container.querySelector('#password');
        this.confirmPasswordInput = this.container.querySelector('#confirm_password');
        this.uz = this.container.querySelector('.uz');
        this.roles = this.container.querySelector('.roles');
        this.createsUser = this.container.querySelector('.creates');
        this.uzRow = this.container.querySelector('.uz').parentElement;
        this.obj_el = this.container.querySelector('.obj_el').parentElement;
        this.group_el = this.container.querySelector('.group_el').parentElement;
        this.resourse_el = this.container.querySelector('.resourse_el').parentElement;
        this.row_kritery = this.container.querySelectorAll('.row_kritery');
        this.check_list = this.container.querySelectorAll('.check_list');
        this.check_container = this.container.querySelectorAll('.check_container');
        this.ok = this.container.querySelectorAll('.ok_podtver');
        this.cancel = this.container.querySelectorAll('.cancel_podtver');
        this.modal = this.container.querySelector('.wrap_lk');
        this.mess = this.container.querySelector('.valid_message');
    }

    applyValid() {
        Validation.check(this.row_kritery);
        Validation.checkPasswords(this.passwordInput, this.confirmPasswordInput);
        if (this.prava !== 'Администратор') {
            Validation.filterAccount(this.creator, this.uz, this.prava);
            Validation.filterSelectAccount(this.uz, this.row_kritery, this.check_container);

            Validation.filterRole(this.roles, this.prava, this.createsUser, this.uz);
            Validation.filterCreaterObject(this.createsUser, this.uz, this.row_kritery);
            Validation.filterObject(this.creator, this.row_kritery, this.prava);
            Validation.updateUZRowVisibility(this.roles, this.uzRow, this.obj_el, this.group_el, this.resourse_el);
        }
        this.eventListener()
    }


    eventListener() {
        this.check_list.forEach((e, index) => e.addEventListener('click', (event) => this.toggleChangeClass(event, e, 'select', index)));
        this.cancel.forEach(e => e.addEventListener('click', (event) => this.toggleChangeClass(event, e, 'cancel')));
        this.ok.forEach(e => e.addEventListener('click', (event) => this.toggleChangeClass(event, e)));
    }

    toggleChangeClass(event, element, select, index) {
        console.log(select, element)
        const modul = element.closest('.check_container');
        if (select === 'select') {
            const nameContent = index === 0 ? 'объектов' : 'групп'
            if (this.uz.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите учетную запись');
            const rows = element.nextElementSibling.querySelectorAll('.row_kritery')
            if (index < 2) {
                const bool = Validation.filterElements(this.uz.value, rows)
                if (!bool) return Helpers.viewRemark(this.mess, 'red', `Учетная запись не содержит ${nameContent}`);
            }
            const elem = document.querySelector('.displays')
            console.log(elem, element.nextElementSibling)
            if (elem && elem !== element.nextElementSibling) elem.classList.remove('displays')
            element.nextElementSibling.classList.toggle('displays');
        }
        else if (select === 'cancel') {
            console.log(modul)
            this.clearListActivCheck(modul)
            modul.classList.toggle('displays');
        }
        else {
            console.log('тут?')
            this.vieCountCheck(modul)
            modul.classList.toggle('displays');
        }
    }

    vieCountCheck(modul) {
        const obj = modul.querySelectorAll('.activ_check').length
        modul.previousElementSibling.children[0].textContent = `Выбрано (${obj})`
    }
    clearListActivCheck(element) {
        console.log(element)
        const obj = element.querySelectorAll('.activ_check')
        console.log(obj)
        if (obj) obj.forEach(e => e.classList.remove('activ_check'))
    }

    async createTable() {
        this.table.innerHTML = ContentGeneration.addTableUser()
        this.result = await Requests.getUsersContent(this.creator)
        console.log(this.result)
    }

    async validationAndPackObject() {
        if (this.roles.value === '') return Helpers.viewRemark(this.mess, 'red', 'Установите права доступа');
        if (this.passwordInput.value !== this.confirmPasswordInput.value) return Helpers.viewRemark(this.mess, 'red', 'Не совпадают пароли');
        if (this.passwordInput.value === '' || this.confirmPasswordInput.value === '') return Helpers.viewRemark(this.mess, 'red', 'Установите пароль');
        if (this.username.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите имя пользователя');
        if (this.uz.parentElement.style.display !== 'none') {
            if (this.uz.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите учетную запись');
        }

        const resourseIDCheck = this.uz.options[this.uz.selectedIndex] ? this.uz.options[this.uz.selectedIndex].getAttribute('resourse') : null
        const objectsCar = this.check_container[0].querySelectorAll('.activ_check')
        const objectsId = [...objectsCar].map(el => el.nextElementSibling.getAttribute('uniqid'))
        const groupsCar = this.check_container[1].querySelectorAll('.activ_check')
        const groupsId = [...groupsCar].map(el => el.nextElementSibling.getAttribute('uniqid'))
        const resourse = this.check_container[2].querySelectorAll('.activ_check')
        const resourseId = [...resourse].map(el => el.nextElementSibling.getAttribute('uniqid'))
        console.log(resourseId)
        this.obj = {
            login: this.username.value,
            password: this.confirmPasswordInput.value,
            role: this.roles.value,
            uz: this.uz.value,
            creater: this.createsUser.value,
            idx: await Requests.findId('idu'),
            resourse: resourseIDCheck
        }
        console.log(this.obj)
        console.log(resourse)
        const messUser = await Requests.saveUser(this.obj, objectsId, groupsId, resourseId)
        Helpers.viewRemark(this.mess, messUser.flag ? 'green' : 'red', messUser.message)
        this.add = 'add'
        this.create()
    }

    addContent() {
        const tableParent = this.table.querySelector('.table_stata')
        if (this.add) this.result.sort((a, b) => b.incriment[1] - a.incriment[1])
        this.result.forEach(el => {
            if (this.prava === 'Курсор') {
                this.addRowToTable(tableParent, el)
            }
            else if (this.prava === 'Администратор') {
                if (el.incriment[0] === this.accountID && el.role === 'Пользователь') {  // Допустим, у вас есть this.accountId, который указывает на учетную запись администратора
                    if (el.delStatus === 'true') return;
                    this.addRowToTable(tableParent, el);
                }
            }
            else if (this.prava === 'Интегратор') {
                if (el.global_creator === Number(this.creator) || el.creater === Number(this.creator)) {
                    if (el.delStatus === 'true') return
                    this.addRowToTable(tableParent, el)
                }
            } else {
                if (el.creater === Number(this.creator)) {
                    if (el.delStatus === 'true') return
                    this.addRowToTable(tableParent, el)
                }
            }
        });
    }

    addRowToTable(tableParent, rowData) {
        const arrayText = [{ name: rowData.name[1], incriment: rowData.incriment[1], entity: 'user' },
        { name: rowData.username, incriment: rowData.global_creator, entity: 'user' },
        { name: rowData.name[0], incriment: rowData.incriment[0], entity: 'account' },
        { name: rowData.uniqTP, incriment: null, entity: 'tp' }, rowData.role, rowData.group_count, rowData.object_count, 'x']

        const tr = document.createElement('tr');
        tr.classList.add('rows_stata', 'rows_move_kursor');
        if (rowData.delStatus === 'true') tr.classList.add('sleepblock')
        tr.innerHTML = arrayText.map((it, index) => index < 4 ? `<th class="cell_stata cell cell_table_auth click_property"  index="${index}" entity="${it.entity}"rel="${it.incriment}">${it.name ? it.name : '-'}</th>` :
            `<th class="cell_stata cell cell_table_auth">${it ? it : '-'}</th>`).join('');
        tr.setAttribute('data-id', rowData.incriment[1]);
        tableParent.appendChild(tr);
        const lastRow = tableParent.lastElementChild;
        const lastCell = lastRow.lastElementChild;
        lastCell.addEventListener('click', this.updateTable.bind(this, lastRow));
        const cells = tr.querySelectorAll('.click_property');
        cells.forEach(el => el.addEventListener('click', () => new EditContollClick(el, this.data, this.container, this.login, this.prava, this.creator, this.creators, this, this.result)))
    };


    async updateTable(lastRow) {
        const name = lastRow.children[0].textContent
        this.accountIncriment = lastRow.children[2].getAttribute('rel')
        this.container.insertAdjacentHTML('beforeend', ContentGeneration.confirm('пользователя', name));
        this.idDelete = lastRow.getAttribute('data-id'); // Получаем id из data-атрибута
        this.modalConfirmElement = this.container.querySelector('.modal_podtver');
        this.modalConfirm()
        this.eventListenerConfirm()

    }

    createHistoryObject() {
        const obj = {
            action: 'Удалён', table: 'usersHistory', columns: 'uniqUsersIDLow', data: String(Math.floor((new Date().getTime()) / 1000)),
            uniqUsersID: Number(this.creator), uniqEntityID: Number(this.idDelete), nameAccount: Number(this.accountIncriment)
        }
        return obj
    }

}