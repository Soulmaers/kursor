import { zapros } from '../../menu.js'
import { Tooltip } from '../../../class/Tooltip.js'

export class CreateNewGroup {
    constructor(element) {
        this.element = element
        this.modal = document.querySelector('.create_group_modal')
        this.noValidation = this.modal.querySelector('.validation_message')
        this.objectsList = document.querySelector('.objects_list')
        this.podGroup = document.querySelector('.pod_group')
        this.sostavGroup = document.querySelector('.sostav_group')
        this.items = null
        this.choiceObject = null
        //  this.prefix = null
        this.closes = this.modal.querySelector('.closes')
        this.cancel = this.modal.querySelector('.cancel')
        this.ok = this.modal.querySelector('.ok_modal')
        this.login = document.querySelectorAll('.log')[1].textContent
        this.field_modal = this.modal.querySelector('.field_modal')
        this.element.addEventListener('click', this.viewModal.bind(this))
        this.closes.addEventListener('click', this.hiddenModal.bind(this))
        this.pop = document.querySelector('.popup-background')
        this.cancel.addEventListener('click', this.hiddenModal.bind(this))
        this.ok.addEventListener('click', this.enter.bind(this))

    }


    async enter() {
        const prefix = this.field_modal.getAttribute('rel')
        if (this.field_modal.getAttribute('rel') === 'group' || this.field_modal.getAttribute('rel') === 'sub') {
            await this.edition(prefix)
            console.log('логика записи редактирования')
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
            // await zapros(this.login)
        }
        else {
            const idg = await this.generationId()
            console.log(idg)
            const time = Math.floor(new Date().getTime() / 1000)
            const object = {
                login: this.login,
                data: time,
                idg: idg,
                name_g: this.field_modal.value,
                arraySubg: [],
                arrayObjects: []
            }
            Array.from(this.sostavGroup.children).forEach(el => {
                el.classList.contains('object_item') ? object.arrayObjects.push({ idObject: el.getAttribute('rel'), nameObject: el.textContent }) :
                    object.arraySubg.push({ id_sub_g: el.getAttribute('rel'), name_sub_g: el.textContent })
            })

            const valid = await this.validation(idg, this.field_modal.value)
            console.log(valid)
            if (!valid) {
                return
            }
            else {
                console.log(object)
                if (object.arraySubg.length !== 0) {
                    console.log('проверка группы в базе')
                    const subGroup = await this.setSubGroups(object, object.arraySubg)
                    console.log(subGroup)
                }
                const mess = await this.setGroup(object)
                //console.log(mess)

                this.pop.style.display = 'none'
                this.modal.style.display = 'none';
                this.modal.style.zIndex = 0
                this.field_modal.value = ''
                await zapros(this.login)
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
            }
        }
        this.field_modal.setAttribute('rel', 't')
    }

    async edition(prefix) {
        const name = this.field_modal.value
        const id = this.field_modal.id
        const time = Math.floor(new Date().getTime() / 1000)
        const object = {
            login: this.login,
            data: time,
            id: this.field_modal.id,
            name: this.field_modal.value,
            arraySubg: [],
            arrayObjects: []
        }
        Array.from(this.sostavGroup.children).forEach(el => {
            el.classList.contains('object_item') ? object.arrayObjects.push({ idObject: el.getAttribute('rel'), nameObject: el.textContent }) :
                object.arraySubg.push({ id_sub_g: el.getAttribute('rel'), name_sub_g: el.textContent })
        })
        const valid = await this.validation(id, name)

        if (!valid) {
            return
        }
        else {
            const mess = await this.updateGroup(prefix, object)
            console.log(object)
            this.pop.style.display = 'none'
            this.modal.style.display = 'none';
            this.modal.style.zIndex = 0
            this.field_modal.value = ''
            await zapros(this.login)
        }


    }

    async updateGroup(prefix, object) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ prefix, object })
        }
        const res = await fetch('/api/updateGroup', params)
        const update = await res.json()
        return update
    }
    async setSubGroups(object, subgroups) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ subgroups, object })
        }
        const res = await fetch('/api/setSubGroups', params)
        const subGroups = await res.json()
        return subGroups
    }
    async setGroup(object) {
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
        console.log(lastId)
        const id = lastId.length === 0 ? 1000 : lastId + 1
        console.log(id)
        return id

    }

    async validation(idg, name) {
        if (this.field_modal.value === '') {
            this.handleValidationResult('Укажите название группы', 'red', 'bold', [this.field_modal]);
            return false
        }
        else if (this.sostavGroup.children.length === 0) {
            this.handleValidationResult('Добавьте объекты или подгруппы', 'red', 'bold', [this.sostavGroup]);
            return false
        }
        else {
            const uniq = await this.validationCloneGroupName(idg, name)
            const itog = uniq.filter(el => {
                if (el.idg !== idg && el.id_sub_g !== idg) {
                    return el
                }
            })
            if (itog.length !== 0) {
                const nameGroup = this.field_modal;
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
        console.log(titleModales)
        console.log(this.field_modal.getAttribute('rel'))
        titleModales.textContent = this.field_modal.getAttribute('rel') !== 't' ? 'Редактирование группы' : 'Новая группа'
        console.log(titleModales)
        const items = document.querySelectorAll('.item_middle')
        if (items) {
            items.forEach(e => e.remove())
        }
        if (!this.element.classList.contains('gr')) {
            return
        }
        else {
            const objects = await this.getObjects()
            this.addObjectsToList(objects)
            const groups = await this.getGroups()
            console.log(groups)
            this.addGroupsToList(groups)

            this.pop.style.display = 'block'
            this.modal.style.display = 'flex';
            this.modal.style.zIndex = 2
        }
        this.items = document.querySelectorAll('.item_middle')
        this.items.forEach(el => el.addEventListener('click', this.activeObject.bind(this, el)))
        const add = document.querySelector('.add')
        const remove = document.querySelector('.remove')
        add.addEventListener('click', this.movingForvard.bind(this))
        remove.addEventListener('click', this.movingBack.bind(this))

    }

    hiddenModal() {
        this.pop.style.display = 'none'
        this.modal.style.display = 'none';
        this.modal.style.zIndex = 0
        this.field_modal.value = ''
        console.log('очистил')
        this.field_modal.setAttribute('rel', 't')
    }

    async getObjects() {
        const login = this.login
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ login })
        }
        const res = await fetch('/api/getObjects', params)
        const objects = await res.json()
        return objects
    }
    async getGroups() {
        const login = this.login
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ login })
        }
        const res = await fetch('/api/getGroups', params)
        const groups = await res.json()
        return groups
    }
    async getIdGroup(id) {
        const login = this.login
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ login, id })
        }
        const res = await fetch('/api/getIdGroup', params)
        const groups = await res.json()
        return groups
    }
    addObjectsToList(objects) {
        objects.forEach(e => {
            this.objectsList.innerHTML += `<li class="item_middle object_item" rel="${e.idObject}">${e.nameObject}</li>`
        })
    }
    addGroupsToList(objects) {
        objects.forEach(e => {
            const data = Object.values(e)
            this.podGroup.innerHTML += `<li class="item_middle group_item" rel="${data[0]}">${data[1]}</li>`
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