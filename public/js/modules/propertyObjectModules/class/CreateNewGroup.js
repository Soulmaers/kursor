import { app } from '../../../main.js'
import { Tooltip } from '../../../class/Tooltip.js'

export class CreateNewGroup {
    constructor(element, name, data) {
        this.nameCar = name
        this.element = element
        this.data = data
        this.modal = document.querySelector('.create_group_modal')
        this.noValidation = this.modal.querySelector('.validation_message')
        this.objectsList = document.querySelector('.objects_list')
        this.podGroup = document.querySelector('.pod_group')
        this.sostavGroup = document.querySelector('.sostav_group')
        this.items = null
        this.choiceObject = null
        //  this.prefix = null
        this.closes = this.modal.querySelector('.closes_gr')
        this.cancel = this.modal.querySelector('.cancel_gr')
        this.ok = this.modal.querySelector('.ok_modal_gr')
        this.login = document.querySelectorAll('.log')[1].textContent
        this.field_modal = this.modal.querySelectorAll('.field_modal')
        this.add = document.querySelector('.add')
        this.remove = document.querySelector('.remove')
        this.element.addEventListener('click', this.viewModal.bind(this))
        this.closes.addEventListener('click', this.hiddenModal.bind(this))
        this.pop = document.querySelector('.popup-background')
        this.cancel.addEventListener('click', this.hiddenModal.bind(this))
        this.initEvent()

    }

    initEvent() {
        this.ent = this.enter.bind(this);
        this.adds = this.movingForvard.bind(this)
        this.removes = this.movingBack.bind(this)
        this.ok.addEventListener('click', this.ent);
        this.add.addEventListener('click', this.adds)
        this.remove.addEventListener('click', this.removes)
    }

    destroy() {
        this.ok.removeEventListener('click', this.ent);
        this.add.removeEventListener('click', this.adds)
        this.remove.removeEventListener('click', this.removes)
    }
    async enter() {
        console.log('эдишон!')
        const prefix = this.field_modal[0].getAttribute('rel')
        if (this.field_modal[0].getAttribute('rel') === 'group') {
            await this.edition(prefix)
            console.log('логика записи редактирования')
            const mores = document.querySelector('.mores')
            const ones = document.querySelector('.ones')
            mores.classList.remove('toggle_list')
            ones.classList.remove('toggle_list')
            ones.classList.add('toggle_list')
            const createObject = document.querySelector('.create_object')
            const parentElement = document.querySelector('.list_item1')
            createObject.classList.remove('gr')
            new Tooltip(createObject, ['Добавить новый объект'])
            parentElement.lastElementChild.textContent = 'Список объектов';
            app.startClass(this.login)
        }
        else {
            const idg = await this.generationId()
            const time = Math.floor(new Date().getTime() / 1000)
            const object = {
                login: this.login,
                data: time,
                idg: idg,
                name_g: this.field_modal[0].value,
                face: this.field_modal[1].value,
                contact: this.field_modal[2].value,
                arrayObjects: []
            }
            Array.from(this.sostavGroup.children).forEach(el => {
                object.arrayObjects.push({ idObject: el.getAttribute('rel'), nameObject: el.textContent })
            })

            const valid = await this.validation(idg, this.field_modal)
            if (!valid) {
                return
            }
            else {
                console.log(object)
                const mess = await this.setGroup(object)
                this.pop.style.display = 'none'
                this.modal.style.display = 'none';
                this.modal.style.zIndex = 0
                this.field_modal.forEach(e => e.value = '')
                app.startClass(this.login)
                const mores = document.querySelector('.mores')
                const ones = document.querySelector('.ones')
                mores.classList.remove('toggle_list')
                ones.classList.remove('toggle_list')
                ones.classList.add('toggle_list')
                const createObject = document.querySelector('.create_object')
                const parentElement = document.querySelector('.list_item1')
                new Tooltip(createObject, ['Добавить новый объект'])
                console.log(parentElement.lastElementChild)
                parentElement.lastElementChild.textContent = 'Список объектов';
                createObject.classList.remove('gr')
            }
        }

        this.field_modal[0].setAttribute('rel', 't')
    }

    async edition() {
        const id = this.field_modal.id
        const time = Math.floor(new Date().getTime() / 1000)
        const object = {
            login: this.login,
            data: time,
            idg: this.field_modal[0].id,
            name_g: this.field_modal[0].value,
            face: this.field_modal[1].value,
            contact: this.field_modal[2].value,
            arrayObjects: []
        }
        Array.from(this.sostavGroup.children).forEach(el => {
            object.arrayObjects.push(JSON.parse(el.getAttribute('data')))

        })
        const valid = await this.validation(id, this.field_modal)
        if (!valid) {
            return
        }
        else {
            const mess = await this.updateGroup(object)
            this.pop.style.display = 'none'
            this.modal.style.display = 'none';
            this.modal.style.zIndex = 0
            this.field_modal.forEach(e => e.value = '')
            app.startClass(this.login)
        }
    }

    async updateGroup(object) {
        console.log(object)
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ object })
        }
        const res = await fetch('/api/updateGroup', params)
        const update = await res.json()
        return update
    }

    async setGroup(object) {
        console.log(object)
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ object })
        }
        const res = await fetch('/api/setGroup', params)
        const mess = res.json()

    }
    async generationId() {
        const params = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
        const res = await fetch('/api/lastIdGroup', params)
        const lastId = await res.json()
        const id = lastId.length === 0 ? 1000 : Number(lastId[0].idg) + 1
        console.log(id)
        return id

    }

    async getIdGroup(id) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ id })
        }
        const res = await fetch('/api/getIdGroup', params)
        const groups = await res.json()
        return groups
    }

    async validation(idg, name) {
        const phoneNumberField = name[2].value;
        console.log(phoneNumberField)
        const regex = /^\+[7]\d{10}$/;
        const isPhoneNumberValid = phoneNumberField === '' || regex.test(phoneNumberField);
        if (!isPhoneNumberValid) {
            this.handleValidationResult('Не валидный номер телефона', 'red', 'bold', [name[2]]);
            return false;
        }
        if (this.field_modal[0].value === '') {
            this.handleValidationResult('Укажите название группы', 'red', 'bold', [name[0]]);
            return false
        }
        else if (this.sostavGroup.children.length === 0) {
            this.handleValidationResult('Добавьте объекты или подгруппы', 'red', 'bold', [this.sostavGroup]);
            return false
        }
        else {
            const uniq = await this.validationCloneGroupName(idg, name[0].value)
            const itog = uniq.filter(el => {
                if (el.idg !== idg && el.id_sub_g !== idg) {
                    return el
                }
            })
            if (itog.length !== 0) {
                const nameGroup = name[0];
                this.handleValidationResult('Такое имя группы уже существует', 'red', 'bold', [nameGroup]);
                return false;
            }
            else {
                return true;
            }

        }
    }
    async validationCloneGroupName(id, name) {
        const login = this.login
        const params = {

            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ id, name, login })
        }
        const res = await fetch('/api/validationCloneGroupName', params)
        let bool = await res.json()
        return bool
    }
    async uniqImeiAndPhone(col, value, table) {
        const login = this.login
        const params = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ col, value, table, login })
        }
        const res = await fetch('/api/uniqImeiAndPhone', params)
        let bool = await res.json()
        return bool
    }

    async viewModal() {
        const titleModales = this.modal.querySelector('.title_modales')
        titleModales.textContent = this.field_modal[0].getAttribute('rel') !== 't' ? 'Редактирование группы' : 'Новая группа'
        const items = document.querySelectorAll('.item_middle')
        if (items) {
            items.forEach(e => e.remove())
        }
        if (!this.element.classList.contains('gr')) {
            return
        }
        else {
            this.addObjectsToList()
            this.pop.style.display = 'block'
            this.modal.style.display = 'flex';
            this.modal.style.zIndex = 2
        }
        this.items = document.querySelectorAll('.item_middle')
        this.items.forEach(el => el.addEventListener('click', this.activeObject.bind(this, el)))
    }

    hiddenModal() {
        this.pop.style.display = 'none'
        this.modal.style.display = 'none';
        this.modal.style.zIndex = 0
        this.field_modal.forEach(e => e.value = '')
        this.field_modal[0].setAttribute('rel', 't')
    }

    addObjectsToList() {
        const uniqueArray = Array.from(new Map(this.data.flat().map(item => [item[4], item])).values());
        uniqueArray.forEach(e => {
            this.objectsList.innerHTML += `<li class="item_middle object_item" data='${JSON.stringify(e[6])}' rel="${e[4]}">${e[0].message}</li>`
        })
    }
    activeObject(el) {
        this.items.forEach(e => {
            e.classList.remove('choice_object')
        })
        el.classList.add('choice_object')
        this.choiceObject = el
    }
    movingForvard() {
        this.addListNewGroup(this.choiceObject)
        this.choiceObject.classList.remove('choice_object')
        this.choiceObject = null

    }
    movingBack() {
        this.choiceObject.classList.contains('object_item') ? this.deleteListNewGroupToListObjects(this.choiceObject) : this.deleteListNewGroupToListGroups(this.choiceObject)
        this.choiceObject.classList.remove('choice_object')
        this.choiceObject = null

    }

    addListNewGroup(el) {
        console.log(el)
        this.sostavGroup.appendChild(el)
    }
    deleteListNewGroupToListObjects(el) {
        this.objectsList.appendChild(el)
    }
    deleteListNewGroupToListGroups(el) {
        this.podGroup.appendChild(el)
    }


    handleValidationResult(message, color, fontWeight, fields) {
        this.noValidation.textContent = message;
        this.noValidation.style.color = color;
        this.noValidation.style.fontWeight = fontWeight;
        console.log(fields)
        fields.forEach(e => {
            e.style.border = '1px solid red';
            setTimeout(() => {
                this.noValidation.textContent = '';
                e.style.border = 'none';
            }, 3000);
        });
    }

}