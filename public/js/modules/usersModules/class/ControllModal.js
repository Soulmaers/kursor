

import { IntObjects } from './IntObjects.js'
import { IntGroups } from './intGroups.js'
import { IntUsers } from './IntUsers.js'
import { IntRetra } from './IntRetra.js'
import { IntAccounts } from './IntAccounts.js'


//***класс  запускает нужный класс по работе с интерфейсом */
export class ControllModal {
    constructor(element, pop, login, container, buttons, creators) {
        this.element = element
        this.index = element.getAttribute('data-att')
        this.creater = document.querySelector('.role').getAttribute('data-att')
        this.prava = document.querySelector('.role').getAttribute('rel')
        this.container = document.querySelector('.wrapper_set')
        this.settingWrap = container
        this.creators = creators
        this.pop = pop
        this.login = login
        this.buttons = buttons

        this.init()
    }

    async init() {
        await this.controll()
    }

    async controll() {
        console.log('тутааа')
        console.log(this.index)
        let inst;
        switch (this.index) {
            case '0': inst = new IntAccounts(this.index, this.buttons, this.settingWrap, this.container, this.login, this.prava, this.creater, this.creators)
                break
            case '1': inst = new IntUsers(this.index, this.buttons, this.settingWrap, this.container, this.login, this.prava, this.creater, this.creators)
                break
            case '2': inst = new IntObjects(this.index, this.buttons, this.settingWrap, this.container, this.login, this.prava, this.creater, this.creators)
                break
            case '3': inst = new IntGroups(this.index, this.buttons, this.settingWrap, this.container, this.login, this.prava, this.creater, this.creators)
                break
            case '4': null
                break
            case '5': inst = new IntRetra(this.index, this.buttons, this.settingWrap, this.container, this.login, this.prava, this.creater, this.creators)
                break
        }
        inst.init()
    }
}