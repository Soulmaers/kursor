

import { ContentGeneration } from './CreateContent.js'
import { Helpers } from './Helpers.js'
import { Requests } from './RequestStaticMethods.js'
import { Validation } from './Validation.js'
import { ControllNaviEdit } from './ControllNaviEdit.js'

export class EditUser {
    constructor(data, element, container, login, prava, creator, creators, instance, usersdata) {
        this.data = data
        this.incriment = Number(element.getAttribute('rel'))
        this.name = element.textContent
        this.container = container
        this.login = login
        this.prava = prava
        this.creator = creator
        this.creators = creators
        this.instance = instance
        this.usersData = usersdata
        this.pop = document.querySelector('.popup-background')
        this.obj = {
            table: 'usersHistory',
            tableEntity: 'users',
            column: 'uniqUsersIDLow',
            incriment: this.incriment
        }
        this.init()
    }


    init() {
        this.createModalEdit()
    }

    async createModalEdit() {
        await this.getStruktura()
        this.container.innerHTML = ContentGeneration.editUser(this.login, this.prava, this.creator, this.property, this.creators, this.name, this.data)
        this.recored()
        this.cacheElements()
        new ControllNaviEdit(this.container, this.obj)
        this.addEventListeners();
        this.applyValidation();
        this.check_container.forEach(e => this.vieCountCheck(e))

        this.modalActivity(this.pop, 'flex', 3)
        this.close()
        this.save()
    }
    recored() {
        this.recoredbtn = this.container.querySelector('.recover')
        if (this.property.delStatus === 'true') {
            this.recoredbtn.style.display = 'flex'
        }
    }
    applyValidation() {

        Validation.checkPasswords(this.passwordInput, this.confirmPasswordInput);
        console.log(this.prava)
        if (this.prava !== 'Администратор') {

            Validation.creator(this.createsUser, this.property.creater)
            Validation.role(this.roles, this.property.role)
            Validation.updateUZRowVisibility(this.roles, this.uzRow, this.obj_el, this.group_el, this.resourse_el);
            Validation.filterRole(this.roles, this.prava, this.createsUser, this.uz);
            Validation.filterAccount(this.creator, this.uz, this.prava);
            Validation.filterSelectAccount(this.uz, this.row_kritery)
            Validation.filterCreaterObject(this.createsUser, this.uz, this.row_kritery);
            Validation.filterObject(this.creator, this.row_kritery, this.prava);
            Validation.account(this.uz, this.property.incriment[0])
        }
        console.log('админ')
        Validation.check(this.row_kritery);
        Validation.activated(this.obj_el, this.group_el, this.property, this.resourse_el)
    }
    cacheElements() {
        this.uzname = this.container.querySelector('#uzname');
        this.tp = this.container.querySelector('.tp');
        this.createsUser = this.container.querySelector('.creates');
        this.uz = this.container.querySelector('.uz');
        this.roles = this.container.querySelector('.roles');
        this.modal = this.container.querySelector('.wrap_lk')
        this.username = this.container.querySelector('#username');
        this.passwordInput = this.container.querySelector('#password');
        this.confirmPasswordInput = this.container.querySelector('#confirm_password');
        this.uzRow = this.container.querySelector('.uz').parentElement;
        this.obj_el = this.container.querySelector('.obj_el').parentElement;
        this.group_el = this.container.querySelector('.group_el').parentElement;
        this.resourse_el = this.container.querySelector('.resourse_el').parentElement;
        this.row_kritery = this.container.querySelectorAll('.row_kritery');
        this.check_list = this.container.querySelectorAll('.check_list');
        this.check_container = this.container.querySelectorAll('.check_container');
        this.ok = this.container.querySelectorAll('.ok_podtver');
        this.cancel = this.container.querySelectorAll('.cancel_podtver');
    }

    addEventListeners() {
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
        const obj = element.querySelectorAll('.activ_check')
        console.log(obj)
        if (obj) obj.forEach(e => e.classList.remove('activ_check'))
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
        const recover = this.container.querySelector('.recover')
        this.mess = this.container.querySelector('.valid_message')
        button.addEventListener('click', this.validationAndPackObject.bind(this))
        recover.addEventListener('click', this.reco.bind(this))
    }

    async getStruktura() {
        //  this.usersData = await Requests.getUsersContent(this.creator)
        console.log(this.usersData)
        this.property = (this.usersData.filter(e => e.incriment[1] === this.incriment))[0]
        console.log(this.property)
    }

    reco() {
        this.del = true
        this.validationAndPackObject()
    }

    async validationAndPackObject() {
        if (this.passwordInput.value !== this.confirmPasswordInput.value) return Helpers.viewRemark(this.mess, 'red', 'Не совпадают пароли');
        if (this.passwordInput.value === '' || this.confirmPasswordInput.value === '') return Helpers.viewRemark(this.mess, 'red', 'Установите пароль');
        if (this.username.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите имя пользователя');

        const resourseIDCheck = this.uz.options[this.uz.selectedIndex].getAttribute('resourse')
        this.obj = {
            login: this.username.value,
            password: this.confirmPasswordInput.value,
            role: this.roles.value,
            creator: this.createsUser.value,
            uz: this.uz.value,
            oldUniqCreator: this.property.incriment[0],
            incrimentUser: this.property.incriment[1],
            del: !this.del ? this.property.delStatus : 'false',
            resourse: resourseIDCheck
        }

        const objectsCar = this.check_container[0].querySelectorAll('.activ_check')
        const objectsId = [...objectsCar].map(el => el.nextElementSibling.getAttribute('uniqid'))
        const groupsCar = this.check_container[1].querySelectorAll('.activ_check')
        const groupsId = [...groupsCar].map(el => el.nextElementSibling.getAttribute('uniqid'))
        const resourse = this.check_container[2].querySelectorAll('.activ_check')
        const resourseId = [...resourse].map(el => el.nextElementSibling.getAttribute('uniqid'))
        const currentObjectsId = this.property.objects.map(obj => obj.incriment)
        const currentGroupsId = this.property.groups.map(group => group.incriment)
        const messUser = await Requests.editUser(this.obj)
        const action = this.property.incriment[0] === Number(this.uz.value) ? 'Обновлён' : 'Смена учётной записи'
        const obj = {
            action: action, table: 'usersHistory', columns: 'uniqUsersIDLow', data: String(Math.floor((new Date().getTime()) / 1000)),
            uniqUsersID: Number(this.creator), uniqEntityID: Number(this.property.incriment[1]), nameAccount: Number(this.property.incriment[0])
        }
        const resu = await Requests.setHistory(obj)

        if (!messUser.flag) {
            Helpers.viewRemark(this.mess, messUser.flag ? 'green' : 'red', messUser.message)
            return
        }
        if (!Helpers.arraysAreEqual(objectsId, currentObjectsId)) await Requests.updateObjectUser(this.obj.incrimentUser, objectsId)
        if (!Helpers.arraysAreEqual(groupsId, currentGroupsId)) await Requests.updateGroupUser(this.obj.incrimentUser, groupsId)
        await Requests.updatePermission(this.obj.incrimentUser, resourseId)

        Helpers.viewRemark(this.mess, messUser.flag ? 'green' : 'red', messUser.message)
        this.updateListObjects(objectsCar, groupsCar)
        this.instance.create()
    }


    updateListObjects(objectsCar, groupsCar) {
        const wrap = document.querySelectorAll('.body_sostav')
        wrap[1].innerHTML = [...objectsCar].map(e => `<div class="rows_sostav" >${e.nextElementSibling.textContent}</div>`).join('')
        wrap[0].innerHTML = [...groupsCar].map(e => `<div class="rows_sostav" >${e.nextElementSibling.textContent}</div>`).join('')
    }


}