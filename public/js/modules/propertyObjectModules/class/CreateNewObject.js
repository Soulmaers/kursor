import { zapros } from '../../menu.js'

export class CreateNewObject {
    constructor(element) {
        this.element = element
        this.modal = document.querySelector('.create_object_modal')
        this.noValidation = this.modal.querySelector('.validation_message')
        this.closes = this.modal.querySelector('.closes')
        this.cancel = this.modal.querySelector('.cancel')
        this.ok = this.modal.querySelector('.ok_modal')
        this.login = document.querySelectorAll('.log')[1].textContent
        this.field_modal = this.modal.querySelectorAll('.field_modal')
        this.element.addEventListener('click', this.viewModal.bind(this))
        this.closes.addEventListener('click', this.hiddenModal.bind(this))
        this.pop = document.querySelector('.popup-background')
        this.cancel.addEventListener('click', this.hiddenModal.bind(this))
        this.ok.addEventListener('click', this.enter.bind(this))
        this.idPref = null
    }

    async enter() {
        console.log(this.idPref)
        const idObject = await this.generationId(this.login)
        const time = Math.floor(new Date().getTime() / 1000)
        const object = {
            login: this.login,
            data: time,
            idObject: this.idPref ? this.idPref : idObject,
            nameObject: null,
            typeObject: null,
            typeDevice: null,
            port: null,
            adress: null,
            imei: null,
            number: null
        }
        Array.from(this.field_modal).forEach(e => {
            object[e.getAttribute('rel')] = e.value
        })
        const valid = await this.validation(object)
        console.log(valid)
        if (!valid) {
            return
        }
        else {
            //сохраняем данные по объекту в базе
            console.log(object)
            const mess = !this.idPref ? await this.saveObject(object) : await this.updateObject(object)
            console.log(mess)
            this.pop.style.display = 'none'
            this.modal.style.display = 'none';
            this.modal.style.zIndex = 0
            this.field_modal.forEach(e => {
                e.value = ''
            })
            await zapros(this.login)
        }

    }

    async validation(object) {
        console.log(object)
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
                { col: 'number', value: object.number }]

                const table = 'objects'
                const promises = columns.map(el => this.uniqImeiAndPhone(el.col, el.value, table, object.id));
                const mergedArray = await Promise.all(promises);
                const uniq = mergedArray.flat().filter(e => e.length !== 0);
                console.log(uniq)
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



    async uniqImeiAndPhone(col, value, table) {
        const login = this.login
        const params = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ col, value, table, login })
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
        fields.forEach(e => {
            e.style.border = '1px solid red';
            setTimeout(() => {
                this.noValidation.textContent = '';
                e.style.border = 'none';
            }, 3000);
        });
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
        const id = lastId.length === 0 ? 1000 : lastId[0].idObject + 1
        return id

    }
    viewModal() {
        if (this.element.classList.contains('gr')) {
            return
        }
        else {
            this.pop.style.display = 'block'
            this.modal.style.display = 'flex';
            this.modal.style.zIndex = 2
        }
    }

    async viewObjects(el) {
        const idw = el.parentElement.parentElement.id
        const element = el.parentElement.parentElement
        const prefix = element.classList.contains('wialon') ? 'wialon' : 'kursor'
        const titleModales = this.modal.querySelector('.title_modales')
        titleModales.textContent = 'Редактирование объекта'
        if (this.element.classList.contains('gr')) {
            return
        }
        else {
            let data;
            if (prefix === 'kursor') {
                const params = {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ idw })
                }
                const res = await fetch('/api/objectId', params)
                const result = await res.json()
                data = result.reduce((acc, el) => {
                    acc.push(el.nameObject, el.typeObject, el.typeDevice, el.port, el.adress, el.imei, el.number)
                    return acc
                }, [])
                this.idPref = result[0].idObject
            }
            else {
                const param = {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ idw })
                }
                const res = await fetch('/api/wialonObjectsId', param)
                const result = await res.json()
                data = [element.children[0].textContent, '-', '-', '-', result[0].imei, result[0].phone]
                this.idPref = idw
            }
            data.forEach((e, index) => {
                this.field_modal[index].value = e
            })

            this.pop.style.display = 'block'
            this.modal.style.display = 'flex';
            this.modal.style.zIndex = 2
        }
    }

    hiddenModal() {
        const titleModales = this.modal.querySelector('.title_modales')
        titleModales.textContent = 'Новый объект'
        this.pop.style.display = 'none'
        this.modal.style.display = 'none';
        this.modal.style.zIndex = 0
        this.field_modal.forEach(e => {
            e.value = ''
        })
    }
}