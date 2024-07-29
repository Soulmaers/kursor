import { EditUser } from './EditUser.js'
import { EditAccount } from './EditAccount.js'
import { EditObject } from './EditObject.js'
import { EditGroup } from './EditGroup.js'
import { EditRetra } from './EditRetra.js'

export class EditContollClick {
    constructor(element, data, container, login, prava, creator, creators, instance, usersdata) {
        this.element = element
        this.entity = element.getAttribute('entity')
        this.data = data
        this.container = container
        this.login = login
        this.prava = prava
        this.creator = creator
        this.creators = creators
        this.instance = instance
        this.usersdata = usersdata
        this.init()
    }

    init() {
        this.controllEntity()
    }


    controllEntity() {
        switch (this.entity) {
            case 'account': new EditAccount(this.data, this.element, this.container, this.login, this.prava, this.creator, this.creators, this.instance)
                break
            case 'user': new EditUser(this.data, this.element, this.container, this.login, this.prava, this.creator, this.creators, this.instance, this.usersdata)
                break
            case 'object': new EditObject(this.data, this.element, this.container, this.creator, this.creators, this.instance, this.usersdata)
                break
            case 'group': new EditGroup(this.data, this.element, this.container, this.login, this.prava, this.creator, this.creators, this.instance, this.usersdata)
                break
            case 'retra': new EditRetra(this.data, this.element, this.container, this.login, this.prava, this.creator, this.creators, this.instance, this.usersdata)
                break
        }


    }
}