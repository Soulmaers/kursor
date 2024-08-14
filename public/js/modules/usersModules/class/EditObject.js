import { ContentGeneration } from './CreateContent.js'
import { Helpers } from './Helpers.js'
import { Requests } from './RequestStaticMethods.js'
import { Validation } from './Validation.js'
import { ConfiguratorParams } from '../../configuratorModules/class/ConfiguratorParams.js'


export class EditObject {
    constructor(data, element, container, creator, creators, instance, usersdata) {
        this.data = data
        this.container = container
        this.creator = creator
        this.creators = creators
        this.instance = instance
        this.usersData = usersdata
        this.idx = element.getAttribute('idx')
        this.incriment = Number(element.getAttribute('rel'))
        this.name = element.textContent
        this.pop = document.querySelector('.popup-background')

        this.init()
    }


    init() {
        this.createModalEdit()
    }


    async createModalEdit() {
        this.getStruktura()
        this.container.innerHTML = ContentGeneration.editObj(this.property, this.creators, this.property.objectname, this.data)
        this.cacheElements()
        this.applyValidation();
        this.eventListeners()
        this.modalActivity(this.pop, 'flex', 3)
        await this.viewObjects(this.idx)
        this.close()
        this.save()
    }

    cacheElements() {
        this.prava = document.querySelector('.role').getAttribute('rel')
        this.objectname = this.container.querySelector('#objectname');
        this.typedevice = this.container.querySelector('#typedevice');
        this.typeobject = this.container.querySelector('#typeobject');
        this.port = this.container.querySelector('#port');
        this.imeidevice = this.container.querySelector('#imeidevice');
        this.addressserver = this.container.querySelector('#addressserver');
        this.phonenumber = this.container.querySelector('#phonenumber');
        this.markaobject = this.container.querySelector('#markaobject');
        this.modelobject = this.container.querySelector('#modelobject');
        this.vinobject = this.container.querySelector('#vinobject');
        this.gosnomerobject = this.container.querySelector('#gosnomerobject');
        this.idbitrixobject = this.container.querySelector('#idbitrixobject');
        this.buttonsMenu = this.container.querySelectorAll('.buttons_menu');
        this.bodyIndex = this.container.querySelector('.body_indexs');
        this.configParams = this.container.querySelector('.config_params');
        this.uz = this.container.querySelector('.uz');
        this.tp = this.container.querySelector('.tp');
        this.createsUser = this.container.querySelector('.creates');
        this.modal = this.container.querySelector('.wrap_lk')
        this.retra = this.property.name_retra
    }

    applyValidation() {
        Validation.filterAccount(this.creator, this.uz, this.prava)
        Validation.filterCreater(this.createsUser, this.uz)
        Validation.creator(this.createsUser, this.property.creater)
        Validation.account(this.uz, this.property.incriment[1])
    }

    eventListeners() {
        this.buttonsMenu.forEach(el => el.addEventListener('click', this.changeSelect.bind(this, el)))
    }

    changeSelect(element) {
        this.buttonsMenu.forEach(e => e.classList.remove('click_button_object'))
        element.classList.add('click_button_object')
        this.idButton = element.id
        if (this.idButton === 'configID') {
            this.bodyIndex.style.display = 'none';
            this.configParams.style.display = 'flex';
            //  this.id || this.idPref ? this.updateMeta.style.display = 'block' : 'none';
        } else {
            this.bodyIndex.style.display = 'flex';
            this.configParams.style.display = 'none';
            // this.updateMeta.style.display = 'none';
        }
    }

    async viewObjects(idw) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ idw })
        };
        const res = await fetch('/api/getSensStorMeta', params)
        const fetchSensStorMeta = await res.json()
        this.instanceConfig = new ConfiguratorParams(this.idx, 'wialon', this.property.imeidevice, fetchSensStorMeta, this.property.idbitrixobject
        );
    }



    modalActivity(pop, flex, num, cret) {
        console.log(pop, flex, num, cret)
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
        this.mess = this.container.querySelector('.valid_message')
        button.addEventListener('click', this.validationAndPackObject.bind(this))
    }


    async validationAndPackObject() {
        if (this.idButton === 'configID') {
            console.log('конфиг')
            const mess = await this.instanceConfig.setToBaseSensStorMeta()
            Helpers.viewRemark(this.mess, 'green', mess);
        }
        else {
            console.log('объект')
            if (this.objectname.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите название объекта');
            if (this.typedevice.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите тип устройства');
            if (this.port.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите порт');
            if (this.imeidevice.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите уникальный IMEI');
            if (this.addressserver.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите адрес сервера');
            if (this.uz.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите учетную запись');
            if (this.tp.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите тарифный план');
            console.log(this.tp.value)
            this.obj = {
                objectname: this.objectname.value,
                typedevice: this.typedevice.value,
                typeobject: this.typeobject.value,
                port: this.port.value,
                imeidevice: this.imeidevice.value,
                addressserver: this.addressserver.value,
                phonenumber: this.phonenumber.value,
                markaobject: this.markaobject.value,
                modelobject: this.modelobject.value,
                vinobject: this.vinobject.value,
                gosnomerobject: this.gosnomerobject.value,
                idbitrixobject: this.idbitrixobject.value,
                uz: this.uz.value,
                tp: this.tp.value ? this.tp.value : '-',
                creater: this.createsUser.value,
                incrimentObject: this.property.incriment[0]

            }
            const oldUz = this.property.incriment[1]
            const messUser = await Requests.editObject(this.obj);
            Helpers.viewRemark(this.mess, messUser.flag ? 'green' : 'red', messUser.message);

            if (messUser.flag && !this.retra && oldUz !== Number(this.uz.value)) {
                console.log('дааа')
                const messObj = await Requests.updateObjectsAndUsers(this.obj);
                Helpers.viewRemark(this.mess, messObj.flag ? 'green' : 'red', messObj.message);
            }
            if (this.instance) this.instance.createTableObject();
        }
    }


    getStruktura() {
        console.log(this.usersData)
        console.log(this.idx)
        this.property = (this.usersData.filter(e => e.idx[0] === this.idx))[0]
    }
}