import { ContentGeneration } from './CreateContent.js'
import { Helpers } from './Helpers.js'
import { Requests } from './RequestStaticMethods.js'
import { Validation } from './Validation.js'
import { ConfiguratorParams } from '../../configuratorModules/class/ConfiguratorParams.js'
import { ControllNaviEdit } from './ControllNaviEdit.js'
import { ValidationStatus } from '../../settingsEventAttributesModules/class/ValidationStatus.js'
export class EditObject {
    constructor(data, element, container, login, role, creator, creators, instance, usersdata) {
        this.data = data
        this.container = container
        this.login = login
        this.prava = role
        this.creator = creator
        this.creators = creators
        this.instance = instance
        this.usersData = usersdata
        this.idx = element.getAttribute('idx')
        this.incriment = Number(element.getAttribute('rel'))
        this.name = element.textContent
        this.pop = document.querySelector('.popup-background')
        this.obj = {
            table: 'objectsHistory',
            tableEntity: 'objects',
            column: 'uniqObjectID',
            incriment: this.incriment
        }
        this.init()
    }


    init() {
        this.createModalEdit()
    }

    async createModalEdit() {
        this.getStruktura()
        this.container.innerHTML = ContentGeneration.editObj(this.login, this.prava, this.property, this.creator, this.creators, this.property.objectname, this.data)
        this.recored()
        this.cacheElements()
        new ControllNaviEdit(this.container, this.obj, this.idx)
        this.applyValidation();
        this.modalActivity(this.pop, 'flex', 3)
        await this.viewObjects(this.idx)
        this.close()
        this.save()
    }
    recored() {
        this.container.style.display = 'flex'
        this.recoredbtn = this.container.querySelector('.recover')
        if (this.property.delStatus === 'true') {
            this.recoredbtn.style.display = 'flex'
        }
    }
    cacheElements() {
        this.prava = document.querySelector('.role').getAttribute('rel')
        this.objectname = this.container.querySelector('#objectname');
        this.typedevice = this.container.querySelector('#typedevice');
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
        this.setParamsStor = this.container.querySelector('.set_params_stor');
        this.uz = this.container.querySelector('.uz');
        this.tp = this.container.querySelector('.tp');
        this.type = this.container.querySelector('.type_objects_index');
        this.createsUser = this.container.querySelector('.creates');
        this.modal = this.container.querySelector('.wrap_lk')
        this.retra = this.property.name_retra

    }

    applyValidation() {
        Validation.filterAccount(this.creator, this.uz, this.prava)
        Validation.filterCreater(this.createsUser, this.uz)
        Validation.creator(this.createsUser, this.property.creater)
        Validation.account(this.uz, this.property.incriment[1])
        Validation.type(this.type, this.property.typeobject)
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
        console.log(this.property)
        const port = this.property.port ? this.property.port : 'wialon'
        this.instanceConfig = new ConfiguratorParams(this.idx, port, this.property.imeidevice, fetchSensStorMeta, this.property.idbitrixobject)
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
        console.log(button)
        const recover = this.container.querySelector('.recover')
        this.mess = this.container.querySelector('.mess_edit_object')
        button.addEventListener('click', this.validationAndPackObject.bind(this))
        recover.addEventListener('click', this.reco.bind(this))
    }

    reco() {
        this.del = true
        this.validationAndPackObject()
    }
    async validationAndPackObject() {
        console.log('тут')
        this.idButton = this.container.querySelector('.click_button_object').id
        if (this.idButton === 'configID') {
            console.log('конфиг')
            const mess = await this.instanceConfig.setToBaseSensStorMeta()
            Helpers.viewRemark(this.mess, 'green', mess);
        }
        else if (this.idButton === 'settingsObject') {
            this.webpackObjectsSettings()
        }
        else {
            if (this.objectname.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите название объекта');
            if (this.type.value === '') return Helpers.viewRemark(this.mess, 'red', 'Выберите тип объекта');
            if (this.typedevice.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите тип устройства');
            if (this.port.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите порт');
            if (this.imeidevice.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите уникальный IMEI');
            if (this.addressserver.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите адрес сервера');
            if (this.uz.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите учетную запись');
            if (this.tp.value === '') return Helpers.viewRemark(this.mess, 'red', 'Укажите тарифный план');

            const typeListReports = document.querySelectorAll('.row_list_element')
            if (typeListReports.length !== 0) {
                const element = [...typeListReports].find(e => e.value == this.property.idx[0])
                element.setAttribute('type', this.type.value)
            }

            this.obj = {
                objectname: this.objectname.value,
                typedevice: this.typedevice.value,
                typeobject: this.type.value,
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
                incrimentObject: this.property.incriment[0],
                del: !this.del ? this.property.delStatus : 'false'
            }
            const oldUz = this.property.incriment[1]
            const oldType = this.property.typeobject
            const idx = this.property.idx[0]
            const messUser = await Requests.editObject(this.obj);
            if (messUser.flag && oldType !== this.obj.typeobject) await Requests.updateDefaultSettings(idx, this.obj.typeobject);
            console.log(messUser.flag, oldType, this.obj.typeobject)
            if (messUser.flag && oldType !== this.obj.typeobject) await Requests.updateDefaultSettings(idx, this.obj.typeobject);

            const action = oldUz === Number(this.uz.value) ? 'Обновлён' : 'Смена учётной записи'
            const obj = {
                action: action, table: 'objectsHistory', columns: 'uniqObjectID', data: String(Math.floor((new Date().getTime()) / 1000)),
                uniqUsersID: Number(this.creator), uniqEntityID: Number(this.property.incriment[0]), nameAccount: Number(oldUz)
            }
            const resu = await Requests.setHistory(obj)

            Helpers.viewRemark(this.mess, messUser.flag ? 'green' : 'red', messUser.message);

            if (messUser.flag && !this.retra && oldUz !== Number(this.uz.value)) {
                const messObj = await Requests.updateObjectsAndUsers(this.obj);
                Helpers.viewRemark(this.mess, messObj.flag ? 'green' : 'red', messObj.message);
            }
            if (this.instance) this.instance.create();

            const typeIndex = ContentGeneration.storTypeObject().find(e => e.type === this.type.value)
            document.querySelector('.stor_type_index').setAttribute('rel', typeIndex.typeIndex)
        }
    }


    getStruktura() {
        this.property = (this.usersData.filter(e => e.idx[0] === this.idx))[0]
    }

    async webpackObjectsSettings() {
        const distanceMin = document.querySelector('#min_distance').nextElementSibling.nextElementSibling.value
        const distanceMax = document.querySelector('#max_distance').nextElementSibling.nextElementSibling.value
        const mileageMin = document.querySelector('#min_mileage').nextElementSibling.nextElementSibling.value
        const mileageMax = document.querySelector('#max_mileage').nextElementSibling.nextElementSibling.value
        const minDistanceProstoy = document.querySelector('#min_distance_prostoy').nextElementSibling.nextElementSibling.value
        const minDurationParking = document.querySelector('#min_duration_parking').nextElementSibling.nextElementSibling.value
        const minDurationStop = document.querySelector('#min_duration_stop').nextElementSibling.nextElementSibling.value
        const minDurationMoto = document.querySelector('#min_duration_moto').nextElementSibling.nextElementSibling.value
        const timeRefillValue = document.querySelector('#min_diration_refill').nextElementSibling.nextElementSibling.value
        const timeDrainValue = document.querySelector('#min_diration_drain').nextElementSibling.nextElementSibling.value
        const volumeRefillValue = document.querySelector('#min_value_refill').nextElementSibling.nextElementSibling.value
        const volumeDrainValue = document.querySelector('#min_value_drain').nextElementSibling.nextElementSibling.value

        const dat = document.querySelector('#datchik_ugla')
        const angleSensorElement = document.querySelector('#angleSensor')
        const attachmentsSensorElement = document.querySelector('#attachmentsSensor')

        console.log(dat)
        this.set = {
            idw: this.idx,
            object: JSON.stringify({
                'Топливо': {
                    duration: {
                        timeRefill: timeRefillValue,
                        timeDrain: timeDrainValue
                    },
                    volume: {
                        volumeRefill: volumeRefillValue,
                        volumeDrain: volumeDrainValue
                    }
                },
                'Поездки': {
                    duration:
                    {
                        minDuration: distanceMin,
                        maxDuration: distanceMax
                    },
                    mileage: {
                        minMileage: mileageMin,
                        maxMileage: mileageMax
                    }
                },
                'Стоянки': { minDuration: minDurationParking },
                'Остановки': { minDuration: minDurationStop },
                'Моточасы': { minDuration: minDurationMoto },
                'Простои на холостом ходу': {
                    minDuration: minDistanceProstoy,
                    ...(dat ? {
                        angleSensorSettings: {
                            minValue: dat.parentElement.querySelectorAll('.porog_value')[0]?.value || null,
                            maxValue: dat.parentElement.querySelectorAll('.porog_value')[1]?.value || null
                        }
                    } : {

                        angleSensor: angleSensorElement?.checked || false,
                        attachmentsSensor: attachmentsSensorElement?.checked || false
                    })
                },
                'Техническое обслуживание': null
            })
        }
        console.log(this.set)
        if (Object.values(ValidationStatus.status).some(value => value === false)) {
            Helpers.viewRemark(this.mess, 'red', 'Введите корректно параметры настроек')
            return
        }
        const res = await Requests.setReportsAttribute(this.set)
        Helpers.viewRemark(this.mess, 'green', res);
    }
}