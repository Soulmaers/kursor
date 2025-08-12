import { Content } from './ContentGeneration.js'
import { RequestToBase } from './RequestToBase.js'
import { arrayTableStor } from '../stor/stor.js'
import { GetUpdateStruktura } from '../../../GetUpdateStruktura.js'
export class RemClassControll {
    constructor(login, data) {
        this.rem = document.querySelector('.rem')
        this.container = document.querySelector('.wrapper_set')
        this.pop = document.querySelector('.popup-background')
        this.role = document.querySelector('.role').getAttribute('rel')
        this.incriment = document.querySelector('.role').getAttribute('data-att')
        this.login = login
        this.data = data
        this.init()
    }


    init() {
        console.log(this.data)
        this.updateStruktura()
        this.eventListener()
    }

    updateStruktura() {
        this.struktura = this.data.map(e => ({ id: e.object_id, groupName: e.group_name, name: e.object_name, imei: e.imeidevice }))
        console.log(this.struktura)
    }
    eventListener() {
        this.rem.addEventListener('click', async () => {
            this.modalView()
        })
    }

    modalView() {
        this.modalActivity(this.pop, 'flex', 2)
        this.container.innerHTML = Content.modalView(this.struktura)
        this.closeAndUpdate()
    }


    closeAndUpdate() {
        const wrapRem = document.querySelector('.wrap_rem');
        this.closes = wrapRem.querySelector('.close_modal_window');
        this.historyUpdate = wrapRem.querySelector('.history_update');
        this.validMess = wrapRem.querySelector('.valid_message');

        this.closes.addEventListener('click', this.modalActivity.bind(this, this.pop, 'none', 1));
        this.historyUpdate.addEventListener('click', this.updateIdOBject.bind(this))
    }
    modalActivity(pop, flex, num) {
        this.container.style.display = `${flex}`;
        pop.style.display = `${flex}`;
        pop.style.zIndex = num;
    }


    async getOldIdObjects() {
        console.log(this.elements)
        this.res = await RequestToBase.getIdObject(this.elements)
        console.log(this.res)
        console.log(arrayTableStor)
    }


    async updateIdOBject() {
        const dom = this.container.querySelectorAll('.rem_checkbox')
        this.elements = [...dom].filter(e => e.checked).map(it => (console.log(it), { idObject: it.id, imei: it.getAttribute('rel') }))
        if (this.elements.length === 0) {
            this.viewRemark(this.validMess, 'red', 'Выберите объекты')
            return
        }
        this.viewRemark(this.validMess, 'green', 'История обновляется...', 'await')
        await this.getOldIdObjects()
        const mess = await RequestToBase.updateIdOBjectToBase(this.res, arrayTableStor)
        this.viewRemark(this.validMess, 'green', 'История обновлена')
        GetUpdateStruktura.zaprosData(this.incriment, this.role)
        console.log(mess)
    }


    viewRemark(element, color, text, aw) {
        console.log(element, color, text)
        element.textContent = text
        element.style.color = color
        if (!aw) setTimeout(() => element.textContent = '', 5000)
    }
}