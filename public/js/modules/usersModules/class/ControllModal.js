
import { InterfaceAccount } from "./InterfaceAccount.js"
import { InterfaceUsers } from "./InterfaceUsers.js"
import { InterfaceObjects } from "./InterfaceObjects.js"
import { InterfaceGroups } from "./InterfaceGroups.js"
import { InterfaceRetranslation } from './InterfaceRetranlation.js'

import { Helpers } from './Helpers.js'
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
        switch (this.index) {
            case '0': new InterfaceAccount(this.container, this.index, this.settingWrap, this.buttons, this.login, this.prava, this.creater, this.creators)
                break
            case '1': new InterfaceUsers(this.container, this.index, this.settingWrap, this.buttons, this.login, this.prava, this.creater, this.creators)
                break
            case '2': new InterfaceObjects(this.index, this.buttons, this.settingWrap, this.container, this.login, this.prava, this.creater, this.creators)
                break
            case '3': new InterfaceGroups(this.index, this.buttons, this.settingWrap, this.container, this.login, this.prava, this.creater, this.creators)
                break
            case '4': null
                break
            case '5': new InterfaceRetranslation(this.index, this.buttons, this.settingWrap, this.container, this.login, this.prava, this.creater, this.creators)
                break
        }
    }
}