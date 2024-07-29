//import { app } from '../../../main.js'
import { ConfiguratorParams } from '../../configuratorModules/class/ConfiguratorParams.js'
import { CreateContent } from './CreateContent.js'

export class CreateNewObject {
    constructor(element) {
        console.log('объекты')
        this.element = element
        this.instance = null
        this.modal = document.querySelector('.create_object_modal')
        this.createContentHTML()
        this.noValidation = this.modal.querySelector('.validation_message')
        this.closes = this.modal.querySelector('.closes')
        this.cancel = this.modal.querySelector('.cancel')
        this.updateMeta = this.modal.querySelector('.update_meta')
        this.ok = this.modal.querySelector('.ok_modal')
        this.buttonModal = document.querySelector('.button_modal')
        this.navi = document.querySelector('.navi_object')
        this.configParams = document.querySelector('.config_params')
        this.listModal = document.querySelector('.list_modal')
        this.summator = document.querySelector('.container_summ')
        this.login = document.querySelectorAll('.log')[1].textContent
        this.field_modal = this.modal.querySelectorAll('.field_modal')
        this.element.addEventListener('click', this.viewModal.bind(this))
        this.closes.addEventListener('click', this.hiddenModal.bind(this))
        this.pop = document.querySelector('.popup-background')
        this.cancel.addEventListener('click', this.hiddenModal.bind(this))

        this.initEvent()
        Array.from(this.navi.children).forEach(e => { e.addEventListener('click', this.toogleModal.bind(this)) })
        this.idPref = null
        this.id = null
        this.object == null
    }

    createContentHTML() {
        this.modal.innerHTML = CreateContent.createHTML()
    }
    initEvent() {
        this.ent = this.enter.bind(this);
        this.ok.addEventListener('click', this.ent);
    }

    destroy() {
        this.ok.removeEventListener('click', this.ent);
    }


    toogleModal(e) {
        e.stopPropagation(); // Останавливаем всплытие события
        Array.from(this.navi.children).forEach(e => e.classList.remove('toogleModalNavi'));
        e.target.classList.add('toogleModalNavi');

        if (e.target.classList.contains('title_configurator')) {
            this.listModal.style.display = 'none';
            this.configParams.style.display = 'flex';
            this.id || this.idPref ? this.updateMeta.style.display = 'block' : 'none';
        } else {
            this.listModal.style.display = 'block';
            this.configParams.style.display = 'none';
            this.updateMeta.style.display = 'none';
        }
    }
    async enter() {
        console.log('ентер')
        if (this.summator.style.display === 'flex') {
            this.handleValidationResult('Закройте Сумматор', 'red', 'bold');
            return
        }
        const activeButton = document.querySelector('.toogleModalNavi')
        if (activeButton.classList.contains('title_configurator')) {
            console.log('сохраняем')
            const mess = await this.instance.setToBaseSensStorMeta()

            this.handleValidationResult(mess, 'green', 'bold');
            app.startClass(this.object.id)
        }
        else {
            console.log(this.instance)
            const idObject = await this.generationId(this.login)
            const time = Math.floor(new Date().getTime() / 1000)
            const object = {
                login: this.login,
                data: time,
                idObject: this.idPref ? this.idPref : idObject,
                idg: 'idg',
                name_g: 'Объекты',
                nameObject: null,
                typeObject: null,
                typeDevice: null,
                port: null,
                adress: null,
                imei: null,
                number: null,
                marka: null,
                model: null,
                vin: null,
                gosnomer: null,
                dut: null,
                angle: null,
                idBitrix: null
            }
            this.id = object.idObject
            Array.from(this.field_modal).forEach(e => {
                object[e.getAttribute('rel')] = e.value
            })
            console.log(this.idPref)
            const valid = await this.validation(object)
            if (!valid) {
                return
            }
            else {
                //сохраняем данные по объекту в базе
                console.log(object)
                const mess = !this.idPref ? await this.saveObject(object) : await this.updateObject(object)
                this.handleValidationResult(mess, 'green', 'bold');
                !this.idPref ? app.startClass(String(object.idObject)) : null
            }
        }

    }

    async validation(object) {
        const requiredFields = Array.from(this.field_modal).filter((e, i) => i === 0 || (i > 1 && i < 5));
        const emptyFields = requiredFields.filter(e => e.value === '');
        if (emptyFields.length !== 0) {
            this.handleValidationResult('Заполните обязательные поля', 'red', 'bold', emptyFields);
            return false;
        } else {   //проверяем номер телефона
            const phoneNumberField = Array.from(this.field_modal)[6];
            const regex = /^\+[7]\d{10}$/;
            const isPhoneNumberValid = phoneNumberField.value === '' || regex.test(phoneNumberField.value);
            if (!isPhoneNumberValid) {
                this.handleValidationResult('Не валидный номер телефона', 'red', 'bold', [phoneNumberField]);
                return false;
            } else {  //проверяем уникальность imei и телефона
                const columns = [{ col: 'nameObject', value: object.nameObject },
                { col: 'imei', value: object.imei },
                { col: 'phone', value: object.number }]

                const table = 'object_table'
                const promises = columns.map(el => this.uniqImeiAndPhone(el.col, el.value, table, object.idObject));
                const mergedArray = await Promise.all(promises);
                const uniq = mergedArray.flat().filter(e => e.length !== 0);
                if (uniq.length !== 0) {
                    const imei = Array.from(this.field_modal)[5];
                    const nameObject = Array.from(this.field_modal)[0];
                    console.log(uniq)
                    this.checkDuplicates(uniq, imei, nameObject, phoneNumberField);

                    return false;
                }
                else {
                    return true;
                }

            }
        }
    }

    checkDuplicates = (uniq, imei, nameObject, phoneNumberField) => {
        const columns = uniq.map((item) => item.matched_column);
        if (columns.includes('number') && columns.includes('imei') && columns.includes('nameObject')) {
            this.handleValidationResult('Такой номер, id устройства и имя объекта уже существуют', 'red', 'bold', [imei, phoneNumberField, nameObject]);
        }
        if (columns.includes('number') && columns.includes('imei')) {
            this.handleValidationResult('Такой номер и id устройства уже существуют', 'red', 'bold', [imei, phoneNumberField]);
        }
        if (columns.includes('number') && columns.includes('nameObject')) {
            this.handleValidationResult('Такой номер и имя объекта уже существуют', 'red', 'bold', [phoneNumberField, nameObject]);
        }
        if (columns.includes('imei') && columns.includes('nameObject')) {
            this.handleValidationResult('Такой id устройства и имя объекта уже существуют', 'red', 'bold', [imei, nameObject]);
        }
        if (columns.includes('number')) {
            this.handleValidationResult('Такой номер уже существует', 'red', 'bold', [phoneNumberField]);
        }
        if (columns.includes('imei')) {
            this.handleValidationResult('Такой id устройства уже существует', 'red', 'bold', [imei]);
        }
        if (columns.includes('nameObject')) {
            this.handleValidationResult('Такое имя объекта уже существует', 'red', 'bold', [nameObject]);
        }
    };



    async uniqImeiAndPhone(col, value, table, id) {
        const login = this.login
        console.log(col, value, table, login)
        const params = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ col, value, table, login, id })
        }
        const res = await fetch('/api/uniqImeiAndPhone', params)
        let bool = await res.json()
        console.log(bool)
        return bool
    }
    handleValidationResult(message, color, fontWeight, fields) {
        this.noValidation.textContent = message;
        this.noValidation.style.color = color;
        this.noValidation.style.fontWeight = fontWeight;
        if (fields) {
            fields.forEach(e => {
                e.style.border = '1px solid red';
                setTimeout(() => {
                    this.noValidation.textContent = '';
                    e.style.border = 'none';
                }, 4000);
            });
        }
        else {
            setTimeout(() => {
                this.noValidation.textContent = '';
            }, 4000);
        }

    }
    async saveObject(object) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ object })
        }
        const res = await fetch('/api/saveObject', params)
        const mess = res.json()
        return mess
    }

    async updateObject(object) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ object })
        }
        const res = await fetch('/api/updateObject', params)
        const mess = res.json()
        return mess

    }
    async generationId() {
        const params = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
        const res = await fetch('/api/lastIdObject', params)
        const lastId = await res.json()
        console.log(lastId)
        const id = lastId.length === 0 ? 1000 : Number(lastId[0].idObject) + 1
        return id

    }
    viewModal() {
        console.log(this.element)
        this.idPref = null
        if (this.element.classList.contains('gr')) {
            return
        }
        else {
            const list = document.querySelectorAll('.item_meta')
            if (list) {
                list.forEach(e => e.remove())
            }
            const stor = document.querySelectorAll('.item_stor')
            if (stor) {
                stor.forEach(e => e.remove())
            }
            this.pop.style.display = 'block'
            this.modal.style.display = 'flex';
            this.modal.style.zIndex = 2
            Array.from(this.navi.children).forEach(e => e.classList.remove('toogleModalNavi'))
            Array.from(this.navi.children)[0].classList.add('toogleModalNavi')
        }
    }

    async viewObjects(el) {
        this.object = el.parentElement.parentElement
        const idw = el.parentElement.parentElement.id
        const element = el.parentElement.parentElement
        const titleModales = this.modal.querySelector('.title_modales')
        titleModales.textContent = 'Объект'
        if (this.element.classList.contains('gr')) {
            return
        }
        else {
            console.time('11');
            const params = {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ idw })
            };

            const fetchObjectsId = fetch('/api/objectsId', params).then(res => res.json());
            const fetchSensStorMeta = fetch('/api/getSensStorMeta', params).then(res => res.json());

            const [result, dat] = await Promise.all([fetchObjectsId, fetchSensStorMeta]);

            console.log(result);
            console.log(dat);

            const data = [
                element.children[0].textContent, result[0].typeObject, result[0].typeDevice, result[0].port,
                result[0].adress, result[0].imei, result[0].phone,
                result[0].marka, result[0].model, result[0].vin, result[0].gosnomer, result[0].dut, result[0].angle, result[0].id_bitrix
            ];

            this.idPref = idw;
            console.timeEnd('11');
            if (!this.instance) {
                this.instance = new ConfiguratorParams(this.idPref, 'wialon', result[0].imei, dat, result[0].id_bitrix);
            } else {
                this.instance.reinitialize(this.idPref, 'wialon', result[0].imei, dat, result[0].id_bitrix);
            }
            data.forEach((e, index) => {
                this.field_modal[index].value = e ? e : '-'
            })
            const metaObject = document.querySelector('.metaObject')
            metaObject.textContent = `${data[0]} (${data[1] ? data[1] : '-'} : ${data[3] ? data[3] : '-'})`
            this.pop.style.display = 'block'
            this.modal.style.display = 'flex';
            this.modal.style.zIndex = 2
            Array.from(this.navi.children).forEach(e => e.classList.remove('toogleModalNavi'))
            Array.from(this.navi.children)[0].classList.add('toogleModalNavi')
        }
    }

    hiddenModal() {
        if (this.summator.style.display === 'flex') {
            this.handleValidationResult('Закройте Сумматор', 'red', 'bold');
            return
        }
        if (this.object) {
            this.instance.itemMeta ? this.instance.itemMeta.forEach(e => e.remove()) : null
            this.instance.itemStor ? this.instance.itemStor.forEach(e => e.remove()) : null
        }
        this.object = null

        const titleModales = this.modal.querySelector('.title_modales')
        titleModales.textContent = 'Объект'
        this.pop.style.display = 'none'
        this.modal.style.display = 'none';
        this.modal.style.zIndex = 0
        this.field_modal.forEach(e => {
            e.value = ''
        })
        const metaObject = document.querySelector('.metaObject')
        metaObject.textContent = ''
        this.listModal.style.display = 'block';
        this.configParams.style.display = 'none';
        this.updateMeta.style.display = 'none'
        this.id = null

    }
}