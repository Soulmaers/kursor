import { GetUpdateStruktura } from "../../../GetUpdateStruktura.js"


export class PermissionControllClass {
    constructor(id, role) {
        this.id = id
        this.role = role
        this.permissions = (GetUpdateStruktura.propertyResourse)[0].settings
        this.init()
    }

    init() {
        console.log(this.permissions)
        this.caseElements()
        this.controllProperty()
    }


    caseElements() {
        this.header = document.querySelector('.header')
    }



    controllProperty() {
        console.log(this.permissions)
        if (this.permissions === 'true') {
            this.header.style.backgroundColor = 'darkred'
        }
    }
}