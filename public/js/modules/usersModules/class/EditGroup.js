import { ContentGeneration } from './CreateContent.js'
import { Helpers } from './Helpers.js'
import { Requests } from './RequestStaticMethods.js'
import { Validation } from './Validation.js'
import { ControllNaviEdit } from './ControllNaviEdit.js'

export class EditGroup {
    constructor(data, element, container, login, prava, creator, creators, instance, usersdata) {
        this.data = data
        this.container = container
        this.login = login
        this.prava = prava
        this.creator = creator
        this.creators = creators
        this.instance = instance
        this.usersData = usersdata
        this.incriment = Number(element.getAttribute('rel'))
        this.name = element.textContent
        this.pop = document.querySelector('.popup-background')
        this.obj = {
            table: 'groupsHistory',
            tableEntity: 'groups',
            column: 'uniqGroupID',
            incriment: this.incriment
        }
        this.init()

    }

    init() {
        this.createModalEdit()
    }

    async createModalEdit() {
        await this.getStruktura()
        this.container.innerHTML = ContentGeneration.editGroup(this.login, this.prava, this.creator, this.property, this.creators, this.property.nameGroup, this.data)
        this.recored()
        this.cacheElements()
        new ControllNaviEdit(this.container, this.obj)
        if (!this.retra) this.applyValidation();
        this.addEventListeners()
        this.vieCountCheck()
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

    cacheElements() {
        this.prava = document.querySelector('.role').getAttribute('rel')
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
        this.retra = this.property.name_retra
        this.modal = this.container.querySelector('.wrap_lk')
        this.obj_el = this.container.querySelector('.obj_el').parentElement;
    }

    applyValidation() {
        if (this.prava !== 'Администратор') {
            Validation.filterAccount(this.creator, this.uz, this.prava)
            Validation.filterCreaterObject(this.createsUser, this.uz, this.row_kritery)
            Validation.filterObject(this.creator, this.row_kritery, this.prava)
            Validation.filterSelectAccount(this.uz, this.row_kritery);

            Validation.creator(this.createsUser, this.property.creater)
            Validation.account(this.uz, this.property.incriment[1])
        }
        Validation.check(this.row_kritery)
        Validation.activated(this.obj_el, null, this.property)
    }

    addEventListeners() {
        this.check_list.addEventListener('click', this.toggleChangeClass.bind(this, 'select'))
        this.cancel.addEventListener('click', this.toggleChangeClass.bind(this, 'cancel'))
        this.ok.addEventListener('click', this.toggleChangeClass.bind(this,))
    }

    toggleChangeClass(select) {
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
    clearListActivCheck() {
        const obj = this.container.querySelectorAll('.activ_check')
        if (obj) obj.forEach(e => e.classList.remove('activ_check'))
    }
    modalActivity(pop, flex, num, cret) {
        this.modal.style.display = `${flex}`
        pop.style.zIndex = num
        pop.style.display = cret ? 'none' : 'block'
    }


    close() {
        const close = this.modal.querySelector('.close_modal_window')
        close.addEventListener('click', this.modalActivity.bind(this, this.pop, 'none', 1, 'cre'))
    }

    save() {
        const button = this.container.querySelector('.bnt_set')
        const recover = this.container.querySelector('.recover')
        this.mess = this.container.querySelector('.valid_message')
        button.addEventListener('click', this.validationAndPackObject.bind(this))
        recover.addEventListener('click', this.reco.bind(this))
    }

    reco() {
        this.del = true
        this.validationAndPackObject()
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
            incrimentGroup: this.property.incriment[0],
            del: !this.del ? this.property.delStatus : 'false'
        }
        const currentObjectsId = this.property.objects.map(obj => obj.incriment)
        const incrimentGroup = this.property.incriment[0]
        const messUser = await Requests.editGroup(this.obj);
        const action = this.property.incriment[1] === Number(this.uz.value) ? 'Обновлён' : 'Смена учётной записи'
        const obj = {
            action: action, table: 'groupsHistory', columns: 'uniqGroupID', data: String(Math.floor((new Date().getTime()) / 1000)),
            uniqUsersID: Number(this.creator), uniqEntityID: Number(incrimentGroup), nameAccount: this.property.incriment[1]
        }
        const resu = await Requests.setHistory(obj)
        Helpers.viewRemark(this.mess, messUser.flag ? 'green' : 'red', messUser.message);
        console.log(objectsId)
        console.log(currentObjectsId)
        console.log(this.property)
        if (messUser.flag && !this.retra) {
            if (!Helpers.arraysAreEqual(objectsId, currentObjectsId)) {
                await Requests.updateGroupsAndUsers(incrimentGroup, objectsId, action)
                //  await this.getStruktura()
            }
            Helpers.viewRemark(this.mess, messUser.flag ? 'green' : 'red', messUser.message);
        }
        this.updateListObjects(objectsCar)
        if (this.instance) this.instance.create();
    }

    updateListObjects(objectsCar) {
        const wrap = document.querySelector('.body_sostav')
        wrap.innerHTML = [...objectsCar].map(e => `<div class="rows_sostav" >${e.nextElementSibling.textContent}</div>`).join('')
    }
    async getStruktura() {
        this.property = (this.usersData.filter(e => e.incriment[0] === this.incriment))[0]
    }
}