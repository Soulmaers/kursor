

import { ContentGeneration } from './CreateContent.js'
import { Helpers } from './Helpers.js'
import { Requests } from './RequestStaticMethods.js'
import { Validation } from './Validation.js'


export class EditAccount {
    constructor(data, element, container, login, prava, creator, creators, instance) {
        this.data = data
        this.incriment = Number(element.getAttribute('rel'))
        this.name = element.textContent
        this.container = container
        this.login = login
        this.prava = prava
        this.creator = creator
        this.creators = creators
        this.instance = instance
        this.pop = document.querySelector('.popup-background')

        this.init()
    }


    init() {
        this.createModalEdit()
    }



    async createModalEdit() {
        await this.getStruktura()
        this.container.innerHTML = ContentGeneration.editLK(this.login, this.prava, this.creator, this.property, this.creators, this.name, this.data)
        this.cacheElements()
        Validation.creator(this.createsUser, this.property.uniqCreater)
        this.modalActivity(this.pop, 'flex', 3)
        this.close()
        this.save()
    }

    cacheElements() {
        this.uzname = this.container.querySelector('#uzname');
        this.tp = this.container.querySelector('.tp');
        this.createsUser = this.container.querySelector('.creates');
        this.modal = this.container.querySelector('.wrap_lk')
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

    async getStruktura() {
        this.property = (this.data.uniqueAccounts.filter(e => e.incriment === this.incriment))[0]
        console.log(this.property)
    }

    async validationAndPackObject() {
        if (this.uzname.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите имя учетной записи');
        if (this.tp.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите тарифный план');

        this.obj = {
            name: this.uzname.value,
            uniqCreater: this.createsUser.value,
            uniqTP: this.tp.value,
            incriment: this.incriment,
            oldUniqCreator: this.property.uniqCreater
        }
        const messAccount = await Requests.editAccount(this.obj)
        Helpers.viewRemark(this.mess, messAccount.flag ? 'green' : 'red', messAccount.message)
        //  this.instance.data = await Helpers.getAccountAll()
        this.instance.createTableAccount()
    }
}