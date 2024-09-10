

import { ContentGeneration } from './CreateContent.js'
import { Helpers } from './Helpers.js'
import { Requests } from './RequestStaticMethods.js'
import { Validation } from './Validation.js'
import { ControllNaviEdit } from './ControllNaviEdit.js'

export class EditAccount {
    constructor(data, element, container, creator, creators, instance) {
        this.data = data
        this.incriment = Number(element.getAttribute('rel'))
        this.name = element.textContent
        this.container = container
        this.prava = document.querySelector('.role').getAttribute('rel')
        this.login = document.querySelectorAll('.log')[1].textContent
        this.creator = creator
        this.creators = creators
        this.instance = instance
        this.pop = document.querySelector('.popup-background')
        this.obj = {
            table: 'accountsHistory',
            tableEntity: 'accounts',
            column: 'uniqAccountID',
            incriment: this.incriment
        }
        this.init()
    }


    init() {
        this.createModalEdit()
    }



    async createModalEdit() {
        await this.getStruktura()
        this.container.innerHTML = ContentGeneration.editLK(this.login, this.prava, this.creator, this.property, this.creators, this.property.name, this.data)
        this.recored()
        this.cacheElements()
        new ControllNaviEdit(this.container, this.obj)
        Validation.creator(this.createsUser, this.property.uniqCreater)
        this.modalActivity(this.pop, 'flex', 3)
        this.close()
        this.save()
    }
    recored() {
        this.recoredbtn = this.container.querySelector('.recover')
        if (this.property.del === 'true') {
            this.recoredbtn.style.display = 'flex'
        }
    }

    cacheElements() {
        this.uzname = this.container.querySelector('#uzname');
        this.tp = this.container.querySelector('.tp');
        this.createsUser = this.container.querySelector('.creates');
        this.modal = this.container.querySelector('.wrap_lk')
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

    async getStruktura() {
        this.property = (this.data.uniqueAccounts.filter(e => e.incriment === this.incriment))[0]
        console.log(this.property)
    }

    reco() {
        this.del = true
        this.validationAndPackObject()
    }

    async validationAndPackObject() {
        if (this.uzname.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите имя учетной записи');
        if (this.tp.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите тарифный план');

        this.obj = {
            name: this.uzname.value,
            uniqCreater: this.createsUser.value,
            uniqTP: this.tp.value,
            incriment: this.incriment,
            oldUniqCreator: this.property.uniqCreater,
            del: !this.del ? this.property.del : 'false'

        }
        console.log(this.obj)
        const messAccount = await Requests.editAccount(this.obj)
        const obj = {
            action: 'Обновлён', table: 'accountsHistory', columns: 'uniqAccountID', data: String(Math.floor((new Date().getTime()) / 1000)),
            uniqUsersID: Number(this.creator), uniqEntityID: Number(this.incriment), nameAccount: Number(this.incriment)
        }
        const resu = await Requests.setHistory(obj)
        Helpers.viewRemark(this.mess, messAccount.flag ? 'green' : 'red', messAccount.message)
        this.instance.create()
    }
}