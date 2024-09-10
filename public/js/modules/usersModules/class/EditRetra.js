import { ContentGeneration } from './CreateContent.js'
import { Helpers } from './Helpers.js'
import { Requests } from './RequestStaticMethods.js'
import { Validation } from './Validation.js'
import { ControllNaviEdit } from './ControllNaviEdit.js'


export class EditRetra {
    constructor(data, element, container, login, prava, creator, creators, instance, usersdata) {
        this.data = data
        this.container = container
        this.login = login
        this.prava = prava
        this.creator = creator
        this.creators = creators
        this.instance = instance
        this.usersData = usersdata
        this.incriment = Number(element.getAttribute('rel'))
        this.name = element.textContent
        this.pop = document.querySelector('.popup-background')
        this.obj = {
            table: 'retrasHistory',
            tableEntity: 'retranslations',
            column: 'uniqRetraID',
            incriment: this.incriment
        }
        this.init()
    }


    init() {
        this.createModalEdit()
    }

    async createModalEdit() {
        await this.getStruktura()
        this.container.innerHTML = ContentGeneration.editRetra(this.creator, this.creators, this.property, this.name, this.data)
        this.recored()
        this.cacheElements()
        new ControllNaviEdit(this.container, this.obj)
        this.applyValidation();
        this.addEventListeners();
        this.modalActivity(this.pop, 'flex', 3)
        this.close()
        this.save()
    }
    recored() {
        this.recoredbtn = this.container.querySelector('.recover')
        if (this.property.delStatus === 'true') {
            this.recoredbtn.style.display = 'flex'
        }
    }
    cacheElements() {
        this.nameRetra = this.container.querySelector('#nameRetra');
        this.tokenRetra = this.container.querySelector('#tokenRetra');
        this.port_protokol = this.container.querySelector('#port_protokol');
        this.get_token = this.container.querySelector('.get_token');
        this.uz = this.container.querySelector('.uz');
        this.retra = this.container.querySelector('.retra');
        this.roles = this.container.querySelector('.roles');
        this.createsUser = this.container.querySelector('.creates');
        this.uzRow = this.container.querySelector('.uz').parentElement;
        this.row_kritery = this.container.querySelectorAll('.row_kritery');
        this.check_list = this.container.querySelectorAll('.check_list');
        this.check_container = this.container.querySelectorAll('.check_container');
        this.modal = this.container.querySelector('.wrap_lk');
        this.mess = this.container.querySelector('.valid_message');
    }

    applyValidation() {
        Validation.filterAccount(this.creator, this.uz, this.prava)
        Validation.filterCreater(this.createsUser, this.uz)
        Validation.creator(this.createsUser, this.property.creater)
        Validation.account(this.uz, this.property.incriment[1])
        Validation.protokols(this.retra, this.property.protokol, this.tokenRetra)
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
        const recover = this.container.querySelector('.recover')
        this.mess = this.container.querySelector('.valid_message')
        button.addEventListener('click', this.validationAndPackObject.bind(this))
        recover.addEventListener('click', this.reco.bind(this))
    }
    addEventListeners() {
        this.modal.querySelector('.close_modal_window').addEventListener('click', this.modalActivity.bind(this, this.pop, 'none', 1));
        this.get_token.addEventListener('click', this.openPageTokenAuth.bind(this))
    }

    reco() {
        this.del = true
        this.validationAndPackObject()
    }

    async validationAndPackObject() {
        if (this.nameRetra.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите имя ретранслятора');
        if (this.port_protokol.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите порт');
        if (this.tokenRetra.value === '' && this.retra.value === 'Wialon API') return Helpers.viewRemark(this.mess, 'red', 'Укажите токен');
        if (this.retra.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите протокол ретрансляции');
        if (this.uz.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите учетную запись');

        this.obj = {
            nameRetra: this.nameRetra.value,
            port_protokol: this.port_protokol.value,
            tokenRetra: this.tokenRetra.value,
            uz: this.uz.value,
            protokol: this.retra.value,
            creator: this.createsUser.value,
            incrimentRetra: this.property.incriment[0],
            del: !this.del ? this.property.delStatus : 'false'
        }

        const oldAccount = this.property.incriment[1]
        const messUser = await Requests.editRetra(this.obj)
        const action = oldAccount === Number(this.uz.value) ? 'Обновлён' : 'Смена учётной записи'
        const obj = {
            action: action, table: 'retrasHistory', columns: 'uniqRetraID', data: String(Math.floor((new Date().getTime()) / 1000)),
            uniqUsersID: Number(this.creator), uniqEntityID: Number(this.property.incriment[0]), nameAccount: Number(oldAccount)
        }
        const resu = await Requests.setHistory(obj)
        Helpers.viewRemark(this.mess, messUser.flag ? 'green' : 'red', messUser.message)
        if (messUser.flag && oldAccount !== Number(this.uz.value)) {
            this.obj.usersObjectGroupsRetra = this.data.uniqueUsers.filter(e => e.incriment_account === oldAccount).map(it => it.incriment)
            this.obj.objectsRetra = this.property.objects.map(e => e.incriment)
            this.obj.groupsRetra = this.property.groups.map(e => e.incriment)
            console.log(this.obj)
            const messObj = await Requests.deleteUsersObjectGroupRetra(this.obj);
            console.log(messObj)
            Helpers.viewRemark(this.mess, messObj.flag ? 'green' : 'red', messObj.message);
        }
        this.instance.create()
    }
    openPageTokenAuth() {
        const url = 'https://hosting.wialon.com/login.html';
        // Открываем новое окно с указанным URL
        window.open(url, '_blank');
    }


    async getStruktura() {
        //   this.usersData = await Requests.getRetraCreater(this.creator)
        this.property = (this.usersData.filter(e => e.incriment[0] === this.incriment))[0]
        console.log(this.property)
    }



}

