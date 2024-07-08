
import { ContentGeneration } from "./CreateContent.js"
import { Helpers } from "./Helpers.js"
import { Validation } from './Validation.js'
import { Requests } from './RequestStaticMethods.js'
import { CreateTableControllRows } from "./CreateTableControllRows.js"


export class ControllModal {
    constructor(element, pop, login, container) {
        this.element = element
        this.index = element.getAttribute('rel')
        this.creater = document.querySelector('.role').getAttribute('data-att')
        this.prava = document.querySelector('.role').getAttribute('rel')
        this.container = document.querySelector('.wrapper_set')
        this.settingWrap = container
        this.pop = pop
        this.login = login
        this.init()
    }


    async init() {
        if (this.prava === 'Курсор' || this.prava === 'Интегратор') await this.getUsers()
        await this.controll()
        this.modal = this.container.querySelector('.wrap_lk')
        this.modalActivity(this.pop, 'flex', 3)

        this.close()
    }
    close() {
        const close = this.modal.querySelector('.close_modal_window')
        console.log(close)
        close.addEventListener('click', this.modalActivity.bind(this, this.pop, 'none', 1))
    }

    async controll() {
        switch (this.index) {
            case '0': this.controllLK()
                break
            case '1': await this.getAccounts(), this.controllUser()
                break
            case '2': this.container.innerHTML = ContentGeneration.createObj()
                break
            case '3': this.container.innerHTML = ContentGeneration.createGroup()
                break
            case '4': this.container.innerHTML = ContentGeneration.createPrice()
                break
            case '5': this.container.innerHTML = ContentGeneration.createRetro()
                break
        }

    }

    controllLK() {
        this.container.innerHTML = ContentGeneration.createLK(this.login, this.prava, this.creater, this.creators)
        this.uzname = this.container.querySelector('#uzname');
        this.tp = this.container.querySelector('.tp');
        this.createsUser = this.container.querySelector('.creates');
        this.save('ida')

    }
    async controllUser() {
        this.container.innerHTML = ContentGeneration.createUser(this.login, this.prava, this.creater, this.creators, this.accounts)
        this.username = this.container.querySelector('#username');
        this.passwordInput = this.container.querySelector('#password');
        this.confirmPasswordInput = this.container.querySelector('#confirm_password');
        this.uz = this.container.querySelector('.uz');
        this.roles = this.container.querySelector('.roles');
        this.createsUser = this.container.querySelector('.creates');
        const uzRow = this.container.querySelector('.uz').parentElement;
        Validation.filterAccount(this.creater, this.uz, this.prava)
        Validation.filterRole(this.roles, this.prava, this.createsUser, this.uz)
        Validation.checkPasswords(this.passwordInput, this.confirmPasswordInput)
        Validation.updateUZRowVisibility(this.roles, uzRow)
        this.save('idu')
    }


    save(prefix) {
        const button = this.container.querySelector('.bnt_set')
        this.mess = this.container.querySelector('.valid_message')
        button.addEventListener('click', this.validation.bind(this, prefix))
    }
    async validation(prefix) {
        switch (prefix) {
            case 'idu': if (this.roles.value === '') return Helpers.viewRemark(this.mess, 'red', 'Установите права доступа');
                if (this.passwordInput.value !== this.confirmPasswordInput.value) return Helpers.viewRemark(this.mess, 'red', 'Не совпадают пароли');
                if (this.passwordInput.value === '' || this.confirmPasswordInput.value === '') return Helpers.viewRemark(this.mess, 'red', 'Установите пароль');
                if (this.username.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите имя пользователя');
                if (this.uz.parentElement.style.display !== 'none') {
                    if (this.uz.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите учетную запись');
                }

                this.obj = {
                    login: this.username.value,
                    password: this.confirmPasswordInput.value,
                    role: this.roles.value,
                    uz: this.uz.value,
                    creater: this.createsUser.value,
                    idx: await Requests.findId(prefix)
                }
                const messUser = await Requests.saveUser(this.obj)
                Helpers.viewRemark(this.mess, messUser.flag ? 'green' : 'red', messUser.message)
                break
            case 'ida': if (this.uzname.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите имя учетной записи');
                if (this.tp.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите тарифный план');

                this.obj = {
                    idx: await Requests.findId(prefix),
                    name: this.uzname.value,
                    uniqCreater: this.createsUser.value,
                    uniqTP: this.tp.value
                }
                const messAccount = await Requests.saveAccount(this.obj)
                console.log(messAccount)
                Helpers.viewRemark(this.mess, messAccount.flag ? 'green' : 'red', messAccount.message)

                break
            case '2': this.container.innerHTML = ContentGeneration.createObj()
                break
            case '3': this.container.innerHTML = ContentGeneration.createGroup()
                break
            case '4': this.container.innerHTML = ContentGeneration.createPrice()
                break
            case '5': this.container.innerHTML = ContentGeneration.createRetro()
                break
        }
        new CreateTableControllRows(this.index, this.settingWrap)
    }


    modalActivity(pop, flex, num) {
        this.modal.style.display = `${flex}`
        pop.style.zIndex = num
    }


    async getAccounts() {
        this.accounts = await Requests.getAccounts(this.creater)
    }
    async getUsers() {
        this.creators = await Requests.getUsers(this.prava, this.creater)
    }
}