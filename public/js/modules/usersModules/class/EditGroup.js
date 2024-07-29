import { ContentGeneration } from './CreateContent.js'
import { Helpers } from './Helpers.js'
import { Requests } from './RequestStaticMethods.js'
import { Validation } from './Validation.js'


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
        this.init()

    }

    init() {
        this.createModalEdit()
    }

    async createModalEdit() {
        await this.getStruktura()
        this.container.innerHTML = ContentGeneration.editGroup(this.creator, this.property, this.creators, this.name, this.data)
        this.cacheElements()
        if (!this.retra) this.applyValidation();
        this.addEventListeners()
        this.vieCountCheck()
        this.modalActivity(this.pop, 'flex', 3)
        this.close()
        this.save()
    }

    cacheElements() {
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
        Validation.filterAccount(this.creator, this.uz, this.prava)
        Validation.filterCreaterObject(this.createsUser, this.uz, this.row_kritery)
        Validation.filterObject(this.creator, this.row_kritery, this.prava)
        Validation.filterSelectAccount(this.uz, this.row_kritery);
        Validation.check(this.row_kritery)
        Validation.creator(this.createsUser, this.property.creater)
        Validation.account(this.uz, this.property.incriment[1])
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
            incrimentGroup: this.property.incriment[0]
        }
        const currentObjectsId = this.property.objects.map(obj => obj.incriment)
        const incrimentGroup = this.property.incriment[0]
        const messUser = await Requests.editGroup(this.obj);
        Helpers.viewRemark(this.mess, messUser.flag ? 'green' : 'red', messUser.message);

        if (messUser.flag && !this.retra) {
            if (!Helpers.arraysAreEqual(objectsId, currentObjectsId)) await Requests.updateGroupsAndUsers(incrimentGroup, objectsId)
            Helpers.viewRemark(this.mess, messUser.flag ? 'green' : 'red', messUser.message);
        }
        this.updateListObjects(objectsCar)
        this.instance.createTableGroup();
    }

    updateListObjects(objectsCar) {
        const wrap = document.querySelector('.body_sostav')
        wrap.innerHTML = [...objectsCar].map(e => `<div class="rows_sostav" >${e.nextElementSibling.textContent}</div>`).join('')
    }
    async getStruktura() {
        // this.usersData = await Requests.getGroupCreater(this.creator)
        this.property = (this.usersData.filter(e => e.incriment[0] === this.incriment))[0]
    }
}