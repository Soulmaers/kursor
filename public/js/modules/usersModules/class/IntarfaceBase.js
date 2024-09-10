
import { Validation } from './Validation.js'
import { Requests } from './RequestStaticMethods.js'
import { Helpers } from './Helpers.js'


export class IntarfaceBase {
    constructor(index, buttons, settingWrap, container, login, prava, creator, creators) {
        this.container = container
        this.index = index
        this.buttons = buttons
        this.settingWrap = settingWrap
        this.login = login
        this.prava = prava
        this.creator = creator
        this.creators = creators
        this.obj = null
        this.pop = document.querySelector('.popup-background')
        this.table = this.settingWrap.querySelector('.table_data_info')
        this.idDelete = null
        this.creatorId = null
        //  this.init()
    }
    async init() {
        await this.create();
        console.log(this.buttons[0])
        this.buttons[0].addEventListener('click', this.handleButtonClick.bind(this));
    }


    handleButtonClick() {
        this.fetchContent()
        this.valid()
        this.modalActivity(this.pop, 'flex', 3)
        this.close()
        this.save()
        // полиформизм
    }
    valid() {
        this.applyValid()
    }
    modalActivity(pop, flex, num) {
        this.modal.style.display = `${flex}`;
        pop.style.zIndex = num;
    }


    closeModal() {
        const close = this.modal.querySelector('.close_modal_window');
        close.addEventListener('click', this.modalActivity.bind(this, this.pop, 'none', 1));
    }



    async create() {
        this.data = await Helpers.getAccountAll()
        this.res = this.data.uniqueUsers.find(e => e.incriment === Number(this.creator))
        this.accountID = this.res ? this.res.incriment_account : null
        await this.createTable()
        this.addContent()

    }

    save() {
        const button = this.container.querySelector('.bnt_set')
        this.mess = this.container.querySelector('.valid_message')
        console.log(button)
        button.addEventListener('click', this.validationAndPackObject.bind(this))
    }
    close() {
        const close = this.modal.querySelector('.close_modal_window')
        close.addEventListener('click', this.modalActivity.bind(this, this.pop, 'none', 1))
    }

    eventListenerConfirm() {
        const okButton = this.modalConfirmElement.querySelector('.ok_podtver');
        const cancelButton = this.modalConfirmElement.querySelector('.cancel_podtver');
        cancelButton.addEventListener('click', this.closeConfirm.bind(this))
        okButton.addEventListener('click', this.delete.bind(this))
    }


    async delete() {
        await Requests.deleteAccount(this.idDelete, this.index, this.prava, this.creatorId)
        const obj = this.createHistoryObject(this.idDelete);
        const resu = await Requests.setHistory(obj)
        this.closeConfirm()
        this.create()
    }

    closeConfirm() {
        this.modalConfirmElement.remove()
        this.pop.style.zIndex = 2
    }
    modalConfirm() {
        this.modalConfirmElement.style.zIndex = 4
        this.pop.style.zIndex = 3
    }

    async validationAndPackObject() {
        // полиформизм
    }

    createHistoryObject() {
        //полиморфизм
    }
    fetchContent() {
        //полиморфизм
    }
    async createTable() {
        //// полиформизм
    }

    addContent() {
        //// полиформизм
    }

    applyValid() {
        //// полиформизм
    }
}