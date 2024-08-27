import { Findmeta } from '../../../class/FindMeta.js'
import { TarirTable } from './TarirTable.js'
import { Summator } from './Summator.js'
export class ConfiguratorParams {
    constructor(id, port, imei, dat, idBitrix) {
        console.log(id, port, imei, dat, idBitrix)
        this.id = id
        this.port = port
        this.imei = imei
        this.dat = dat
        this.idBitrix = idBitrix
        this.activeClassTarir = null
        this.element = document.querySelector('.search_input_meta')
        this.storageMeta = [
            { 'id': 1, 'sensor': 'Скорость', 'parametr': 'speed' },
            { 'id': 2, 'sensor': 'Курс', 'parametr': 'course' },
            { 'id': 3, 'sensor': 'Спутники', 'parametr': 'sats' },
            { 'id': 4, 'sensor': 'Широта', 'parametr': 'lat' },
            { 'id': 5, 'sensor': 'Долгота', 'parametr': 'lon' },
            { 'id': 6, 'sensor': 'Время посл. сообщения', 'parametr': 'last_valid_time' },
            { 'id': 7, 'sensor': 'Зажигание', 'parametr': 'engine' },
            { 'id': 8, 'sensor': 'Бортовое питание', 'parametr': 'pwr' },
            { 'id': 9, 'sensor': 'Топливо', 'parametr': 'oil' },
            { 'id': 10, 'sensor': 't° топлива в баке', 'parametr': 'oiltemp' },
            { 'id': 11, 'sensor': 'Топливо 2', 'parametr': 'oil2' },
            { 'id': 12, 'sensor': 't° топлива в баке 2', 'parametr': 'oiltemp2' },
            { 'id': 13, 'sensor': 'Топливо 3', 'parametr': 'oil3' },
            { 'id': 14, 'sensor': 't° топлива в баке 3', 'parametr': 'oiltemp3' },
            { 'id': 15, 'sensor': 'Сумматор', 'parametr': 'summatorOil' },
            { 'id': 16, 'sensor': 'Подъём кузова', 'parametr': 'lift' },
            { 'id': 17, 'sensor': 'Обороты двигателя', 'parametr': 'engine_rpm' },
            { 'id': 18, 'sensor': 't° охлаждающей жидкости', 'parametr': 'engine_coolant_temp' },
            { 'id': 19, 'sensor': 'Пробег', 'parametr': 'mileage' },
            { 'id': 20, 'sensor': '% нагрузки двигателя', 'parametr': 'engine_load' },
            { 'id': 21, 'sensor': 'Рулевое левое', 'parametr': 'tpms_pressure_2' },
            { 'id': 22, 'sensor': 'Рулевое правое', 'parametr': 'tpms_pressure_1' },
            { 'id': 23, 'sensor': 'Тягач Ведущее Лев Внеш', 'parametr': 'tpms_pressure_6' },
            { 'id': 24, 'sensor': 'Тягач Ведущее Лев Внут', 'parametr': 'tpms_pressure_5' },
            { 'id': 25, 'sensor': 'Тягач Ведущее Прав Внут', 'parametr': 'tpms_pressure_4' },
            { 'id': 26, 'sensor': 'Тягач Ведущее Прав Внеш', 'parametr': 'tpms_pressure_3' },
            { 'id': 27, 'sensor': '3 Ось Лев Внеш', 'parametr': 'tpms_pressure_10' },
            { 'id': 28, 'sensor': '3 Ось Лев Внут', 'parametr': 'tpms_pressure_9' },
            { 'id': 29, 'sensor': '3 Ось Прав Внут', 'parametr': 'tpms_pressure_8' },
            { 'id': 30, 'sensor': '3 Ось Прав Внеш', 'parametr': 'tpms_pressure_7' },
            { 'id': 31, 'sensor': '4 Ось Лев Внеш', 'parametr': 'tpms_pressure_36' },
            { 'id': 32, 'sensor': '4 Ось Лев Внут', 'parametr': 'tpms_pressure_35' },
            { 'id': 33, 'sensor': '4 Ось Прав Внут', 'parametr': 'tpms_pressure_34' },
            { 'id': 34, 'sensor': '4 Ось Прав Внеш', 'parametr': 'tpms_pressure_33' },
            { 'id': 35, 'sensor': 'Прицеп 1 Ось Л', 'parametr': 'tpms_pressure_40' },
            { 'id': 36, 'sensor': 'Прицеп 1 Ось П', 'parametr': 'tpms_pressure_37' },
            { 'id': 37, 'sensor': 'Прицеп 2 Ось Л', 'parametr': 'tpms_pressure_44' },
            { 'id': 38, 'sensor': 'Прицеп 2 Ось П', 'parametr': 'tpms_pressure_41' },
            { 'id': 39, 'sensor': 'Прицеп 3 Ось Л', 'parametr': 'tpms_pressure_39' },
            { 'id': 40, 'sensor': 'Прицеп 3 Ось П', 'parametr': 'tpms_pressure_38' },
            { 'id': 41, 'sensor': 't° Рулевое левое', 'parametr': 'tpms_temp_2' },
            { 'id': 42, 'sensor': 't° Рулевое правое', 'parametr': 'tpms_temp_1' },
            { 'id': 43, 'sensor': 't° Тягач Ведущее Лев Внеш', 'parametr': 'tpms_temp_6' },
            { 'id': 44, 'sensor': 't° Тягач Ведущее Лев Внут', 'parametr': 'tpms_temp_5' },
            { 'id': 45, 'sensor': 't° Тягач Ведущее Прав Внут', 'parametr': 'tpms_temp_4' },
            { 'id': 46, 'sensor': 't° Тягач Ведущее Прав Внеш', 'parametr': 'tpms_temp_3' },
            { 'id': 47, 'sensor': 't° 3 Ось Лев Внеш', 'parametr': 'tpms_temp_10' },
            { 'id': 48, 'sensor': 't° 3 Ось Лев Внут', 'parametr': 'tpms_temp_9' },
            { 'id': 49, 'sensor': 't° 3 Ось Прав Внут', 'parametr': 'tpms_temp_8' },
            { 'id': 50, 'sensor': 't° 3 Ось Прав Внеш', 'parametr': 'tpms_temp_7' },
            { 'id': 51, 'sensor': 't° 4 Ось Лев Внеш', 'parametr': 'tpms_temp_36' },
            { 'id': 52, 'sensor': 't° 4 Ось Лев Внут', 'parametr': 'tpms_temp_35' },
            { 'id': 53, 'sensor': 't° 4 Ось Прав Внут', 'parametr': 'tpms_temp_34' },
            { 'id': 54, 'sensor': 't° 4 Ось Прав Внеш', 'parametr': 'tpms_temp_33' },
            { 'id': 55, 'sensor': 't° Прицеп 1 Ось Л', 'parametr': 'tpms_temp_40' },
            { 'id': 56, 'sensor': 't° Прицеп 1 Ось П', 'parametr': 'tpms_temp_37' },
            { 'id': 57, 'sensor': 't° Прицеп 2 Ось Л', 'parametr': 'tpms_temp_44' },
            { 'id': 58, 'sensor': 't° Прицеп 2 Ось П', 'parametr': 'tpms_temp_41' },
            { 'id': 59, 'sensor': 't° Прицеп 3 Ось Л', 'parametr': 'tpms_temp_39' },
            { 'id': 60, 'sensor': 't° Прицеп 3 Ось П', 'parametr': 'tpms_temp_38' },
            { 'id': 61, 'sensor': 'Моточасы', 'parametr': 'engine_hours' },
            { 'id': 62, 'sensor': 'Колесо', 'parametr': 'tpms_pressure_17' },
            { 'id': 63, 'sensor': 'Колесо', 'parametr': 'tpms_pressure_20' },
            { 'id': 64, 'sensor': 't° Колесо', 'parametr': 'tpms_temp_17' },
            { 'id': 65, 'sensor': 't° Колесо', 'parametr': 'tpms_temp_20' },
            { 'id': 66, 'sensor': 'Топливо 4', 'parametr': 'oil4' },
            { 'id': 67, 'sensor': 't° топлива в баке 4', 'parametr': 'oiltemp4' },
            { 'id': 68, 'sensor': 'Топливо 5', 'parametr': 'oil5' },
            { 'id': 69, 'sensor': 't° топлива в баке 5', 'parametr': 'oiltemp5' },
            { 'id': 70, 'sensor': 'Топливо 6', 'parametr': 'oil6' },
            { 'id': 71, 'sensor': 't° топлива в баке 6', 'parametr': 'oiltemp6' },
        ]
        this.listMeta = document.querySelector('.list_meta')
        this.listOldData = document.querySelector('.list_old_data')
        this.updateMeta = document.querySelector('.update_meta')
        this.clearParams = null
        this.itemMeta = null;
        this.itemStor = null;
        this.boundUpdate = this.createListMeta.bind(this);
        this.init()
        this.initEventListeners();
    }
    reinitialize(newId, port, imei, dat) {
        this.removeEventListeners(); // Удаление старых слушателей событий
        this.id = newId; // Обновление id
        this.port = port
        this.imei = imei
        this.dat = dat
        this.init(); // Переинициализация с новым id
        this.initEventListeners(); // Повторное добавление слушателей событий
    }

    initEventListeners() {
        //   this.updateMeta.addEventListener('click', this.boundUpdate);
    }
    removeEventListeners() {
        // this.updateMeta.removeEventListener('click', this.boundUpdate);
    }

    clearMetaParams(el, event) {
        event.stopPropagation();
        if (el.classList.contains('clear_params')) {
            this.itemMeta.forEach(elem => {
                if (el.previousElementSibling.textContent === elem.textContent) {
                    elem.style.borderLeft = 'none'
                    elem.classList.remove('clickMeta')
                }
            })
            el.previousElementSibling.textContent = ''
            const wrap = document.querySelectorAll('.wrapper_add_value_fixed')
            wrap ? wrap.forEach(e => e.style.display = 'none') : null
            const param = el.parentNode.children[1].textContent
            if (param === 'pwr') {
                el.parentNode.children[4].style.color = 'rgba(6, 28, 71, 1)'
                this.deleteParams(this.id, param)
            }
            if (param === 'engine') {
                el.parentNode.children[4].style.display = 'none'
                this.deleteParams(this.id, param)
            }
            if (param === 'summatorOil') {
                el.parentNode.children[4].style.color = 'rgba(6, 28, 71, 1)'
                el.parentNode.children[2].style.color = 'rgba(6, 28, 71, 1)'
                el.parentNode.children[2].textContent = 'OFF'
                this.setSummator([])
            }
        }
    }
    async setSummator(data) {
        const idw = this.id
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ data, idw })
        }
        const res = await fetch('/api/setSummator', params)
        const result = await res.json()
    }
    async deleteParams(id, param) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ id, param })
        }
        const res = await fetch('/api/deleteParams', params)
        const result = await res.json()
    }

    //868184064811311
    async init() {
        this.createListParams() //создаем элементы из stora
        await this.createListMeta() //создаем элементы из meta
    }

    async createListMeta() {
        const arrayNameParams = ['engine_hours', 'can_engine_hours', 'mileage', 'can_mileage', 'inter_mileage', 'pwr_int', 'rs485fuel_level',
            'rs485fuel_temp', 'rs485fuel_level1', 'rs485fuel_temp1', 'rs485fuel_level2', 'rs485fuel_temp2']
        const data = await this.getMetaParams()
        if (data.length === 0) { return }
        const meta = Object.entries(data[0]).filter((element) => element[0] !== 'nameCar' && element[0] !== 'imei' && element[0] !== 'id' && element[0] !== 'port' && element[0] !== 'idObject');
        const list = document.querySelectorAll('.item_meta')
        if (list) {
            list.forEach(e => e.remove())
        }
        meta.sort((a, b) => a[0].localeCompare(b[0]));
        meta.forEach(e => {
            const li = document.createElement('li')
            li.classList.add('item_meta')
            this.listOldData.appendChild(li)
            const name = document.createElement('div')
            name.classList.add('item_meta_name')
            name.textContent = e[0]
            li.appendChild(name)
            const value = document.createElement('div')
            value.classList.add('item_meta_value')
            value.textContent = e[1] === undefined || e[1] === '-348201.4' ? '-Н/Д' : arrayNameParams.includes(e[0]) ? ` :${parseFloat(Number(e[1]).toFixed(2))}` : ` :${e[1]}`
            li.appendChild(value)
        })
        new Findmeta(this.element)
        this.itemMeta = [...document.querySelectorAll('.item_meta')];
        this.itemMeta.forEach(el => { el.addEventListener('click', this.metaToggle.bind(this, el)) })
        this.controllFlashBorder()
    }

    controllFlashBorder() {
        if (this.dat) {
            console.log(this.dat)
            this.itemStor.forEach(e => {
                const matchingItem = this.dat.find(it => it.params === e.children[1].textContent);
                if (matchingItem) {
                    e.children[2].textContent = matchingItem.meta;
                    e.children[0].value = matchingItem.sens;
                    e.children[0].style.color = 'gray';
                    if (matchingItem.params == 'pwr' || matchingItem.params == 'engine' || matchingItem.params == 'mileage') {
                        matchingItem.meta == 'pwr_ext' ||
                            matchingItem.meta == 'mileage' ||
                            matchingItem.meta == 'adc3' ? e.children[4].style.display = 'block' :
                            e.children[4].style.display = 'none'

                    }

                }
            });
        }
        const arrayStor = this.itemStor.filter(it => it.children[2].textContent).map(e => e.children[2].textContent)
        const clickElement = document.querySelector('.clickStor')
        this.itemMeta.forEach(el => {
            el.style.borderLeft = 'none'
            arrayStor.includes(el.children[0].textContent) ? el.children[0].classList.add('clickMeta') : null
            if (clickElement && clickElement.children[2].textContent === el.children[0].textContent) {
                el.style.borderLeft = '5px solid green'
            }
        })

    }

    async setToBaseSensStorMeta() {
        const login = document.querySelectorAll('.log')[1].textContent
        const id = this.id
        const data = this.itemStor.filter(e => e.children[2].textContent).map(el => ({
            id: this.id, port: this.port,
            sens: el.children[0].value ? el.children[0].value : el.children[0].placeholder,
            params: el.children[1].textContent, meta: el.children[2].textContent,
            value: null,
            status: null,
            time: Math.floor(new Date().getTime() / 1000),
            login: login,
            data: null,
            imei: this.imei,
            idBitrix: this.idBitrix
        }))
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ data }))
        }
        const res = await fetch('api/setSensStorMeta', params)
        const message = await res.json()
        return message
    }

    async getMetaParams() {
        const idw = this.id
        const port = this.port
        const imei = this.imei
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw, port, imei }))
        }
        const parametrs = await fetch('api/getMetas', params)
        const lastParams = await parametrs.json()
        return lastParams
    }

    createListParams() {
        console.log('здесь?')
        const list = document.querySelectorAll('.item_stor')
        if (list) {
            list.forEach(e => e.remove())
        }
        console.log(this.storageMeta)
        this.storageMeta.forEach(async e => {
            const li = document.createElement('li')
            li.classList.add('item_stor')
            this.listMeta.appendChild(li)
            const sens = document.createElement('input')
            sens.classList.add('sensor_stor')
            sens.style.color = 'gray'
            sens.value = e.sensor
            sens.setAttribute('contenteditable', 'true');
            li.appendChild(sens)
            const param = document.createElement('div')
            param.classList.add('param_stor')
            param.textContent = e.parametr
            li.appendChild(param)
            const oldParam = document.createElement('div')
            oldParam.classList.add('param_meta')
            li.appendChild(oldParam)
            if (e.id < 7) {
                oldParam.textContent = e.parametr
            }
            else {
                const i = document.createElement('i')
                i.classList.add('fas')
                i.classList.add('fa-times')
                i.classList.add('clear_params')
                li.appendChild(i)
                if (['pwr', 'engine', 'mileage'].includes(e.parametr)) {
                    let val = await this.getValueToBase(li)
                    val = val ? val[0].value : ''
                    const i = this.createIcon(li, e.parametr)
                    i.style.display = 'none'
                    if (val !== '') {
                        i.style.color = 'green'
                    }
                    i.addEventListener('click', this.addValueFixed.bind(this, i, val))
                }
                if (e.parametr.startsWith('oil') && e.parametr.length <= 4) {
                    const i = this.createIcon(li, e.parametr)
                    const bool = await this.validColorIcon(e.parametr)
                    i.style.color = bool ? 'green' : null
                    i.addEventListener('click', this.createTarir.bind(this, i, e.parametr))
                }
                if (e.parametr === 'summatorOil') {
                    const i = this.createIcon(li, e.parametr)
                    oldParam.textContent = 'OFF'
                    const bool = await this.validColorIconSummator()
                    if (bool) {
                        i.style.color = 'green'
                        this.colorSummator('green', 'ON', i)
                    }
                    else {
                        this.colorSummator('rgba(6, 28, 71, 1)', 'OFF', i)
                    }
                    i.addEventListener('click', this.createSummatorOil.bind(this, i, e.parametr))
                }
            }
        })
        this.itemStor = [...document.querySelectorAll('.item_stor')];
        this.clearParams = [...document.querySelectorAll('.clear_params')];
        this.itemStor.forEach(el => { el.addEventListener('click', this.storToggle.bind(this, el)) })
        this.clearParams.forEach(el => el.addEventListener('click', this.clearMetaParams.bind(this, el)))
    }
    colorSummator(color, text, i) {
        const meta = i.closest('.item_stor').children[2]
        this.element.style.color = `${color}`
        meta.style.color = `${color}`
        meta.textContent = `${text}`
    }
    createIcon(li, param) {
        const i = document.createElement('i')
        i.classList.add('fas')
        i.classList.add('fa-info-circle')
        i.classList.add(`add_${param}`)
        li.appendChild(i)
        return i
    }
    async validColorIcon(param) {
        const idw = this.id
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ idw, param })
        }
        const res = await fetch('api/getTarirTable', params)
        const result = await res.json()
        return result.length !== 0 ? true : false
    }
    async validColorIconSummator() {
        const idw = this.id
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ idw })
        }
        const res = await fetch('/api/getSummator', params)
        const result = await res.json()
        return result.length !== 0 ? true : false
    }



    createSummatorOil(el) {
        if (!this.activeClassSummator) {
            this.activeClassSummator = new Summator(this.id, el, this.dat, this.listMeta)
        } else {
            this.activeClassSummator.reinitialize(this.id, el, this.dat, this.listMeta);
        }
    }
    createTarir(el, param) {
        if (!this.activeClassTarir) {
            this.activeClassTarir = new TarirTable(this.id, el, param)
        } else {
            this.activeClassTarir.reinitialize(this.id, el, param);
        }
    }
    async getValueToBase(parent) {
        const param = parent.children[1].textContent
        const id = this.id
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ id, param })
        }
        const res = await fetch('api/getValuePWR', params)
        const result = await res.json()
        return result
    }
    async addValueFixed(i, val, event) {
        event.stopPropagation();
        const wrap = document.querySelectorAll('.wrapper_add_value_fixed')
        wrap ? wrap.forEach(e => e.style.display = 'none') : null
        const wrapModal = i.parentNode.querySelector('.wrapper_add_value_fixed')
        if (!wrapModal) {
            const parent = i.parentNode
            const div = document.createElement('div')
            div.classList.add('wrapper_add_value_fixed')
            parent.appendChild(div)
            const input = document.createElement('input')
            input.classList.add('input_add_value_fixed')
            input.value = val
            div.appendChild(input)
            const ok = document.createElement('i')
            ok.classList.add('fa')
            ok.classList.add('fa-check')
            ok.classList.add('save_ok')
            div.appendChild(ok)
            const cancel = document.createElement('i')
            cancel.classList.add('fas')
            cancel.classList.add('fa-times')
            cancel.classList.add('save_cancel')
            div.appendChild(cancel)
            this.validationInput(input)
            ok.addEventListener('click', this.ok.bind(this, ok))
            cancel.addEventListener('click', this.cancel.bind(this, cancel))
        }
        else {
            wrapModal.style.display = 'flex'
        }
    }


    validationInput(input) {
        input.addEventListener('input', () => {
            let value = input.value;
            // Заменяем запятую на точку
            value = value.replace(',', '.');
            // Удаляем все символы, кроме цифр и точек
            value = value.replace(/[^0-9.]/g, '');
            // Проверяем количество символов после точки
            const dotIndex = value.indexOf('.');
            if (dotIndex !== -1) {
                const decimalPart = value.substr(dotIndex + 1);
                if (decimalPart.length > 2) {
                    // Обрезаем количество символов после точки до 2
                    value = value.substr(0, dotIndex + 3);
                }
            }
            // Проверяем минимальное значение
            if (parseFloat(value) < minValue) {
                value = String(minValue);
            }
            // Обновляем значение инпута
            input.value = value;
        });
    }
    ok(el, event) {
        event.stopPropagation();
        const id = this.id
        const params = el.parentNode.parentNode.children[1].textContent
        const value = el.parentNode.children[0].value
        el.parentNode.parentNode.children[4].style.color = value !== '' ? 'green' : 'rgba(6, 28, 71, 1)'
        this.saveValueToBase(id, params, value)
        el.parentNode.style.display = 'none'
    }
    cancel(el, event) {
        event.stopPropagation();
        el.parentNode.style.display = 'none'
    }
    async saveValueToBase(id, params, value) {
        const param = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ id, params, value })
        }
        const res = await fetch('api/saveValuePWR', param)
        const result = await res.json()
    }


    storToggle(el) {
        const wrap = document.querySelectorAll('.wrapper_add_value_fixed')
        wrap ? wrap.forEach(e => e.style.display = 'none') : null
        el.children[2].textContent === 'pwr_ext' && el.querySelector('.wrapper_add_value_fixed') ? el.querySelector('.wrapper_add_value_fixed').style.display = 'flex' : null
        el.children[2].textContent === 'adc3' && el.querySelector('.wrapper_add_value_fixed') ? el.querySelector('.wrapper_add_value_fixed').style.display = 'flex' : null
        el.children[2].textContent === 'mileage' && el.querySelector('.wrapper_add_value_fixed') ? el.querySelector('.wrapper_add_value_fixed').style.display = 'flex' : null
        const clickElement = document.querySelector('.clickStor')
        clickElement ? clickElement.classList.remove('clickStor') : null
        el.classList.add('clickStor')
        // this.controllFlashBorder()
    }
    metaToggle(el) {
        const wrap = document.querySelectorAll('.wrapper_add_value_fixed')
        wrap ? wrap.forEach(e => e.style.display = 'none') : null
        const clickStor = document.querySelector('.clickStor')
        if (clickStor) {
            !el.classList.contains('clickMeta') ? el.children[0].classList.add('clickMeta') : null
            clickStor.children[2].textContent = el.children[0].textContent

            if (clickStor.children[1].textContent === 'engine' && clickStor.children[2].textContent === 'pwr_ext' ||
                clickStor.children[1].textContent === 'pwr' && clickStor.children[2].textContent === 'pwr_ext' ||
                clickStor.children[1].textContent === 'engine' && clickStor.children[2].textContent === 'adc3' ||
                clickStor.children[1].textContent === 'pwr' && clickStor.children[2].textContent === 'adc3' ||
                clickStor.children[1].textContent === 'mileage' && clickStor.children[2].textContent === 'mileage' ||
                clickStor.children[1].textContent.startsWith('oil') && clickStor.children[1].textContent.length <= 4) {
                clickStor.children[4].style.display = 'block'
            }
            else {
                clickStor.children[4] ? clickStor.children[4].style.display = 'none' : null
            }

            this.itemMeta.forEach(el => { el.children[0].classList.remove('clickMeta') })
            this.dat = null
            this.controllFlashBorder()
        }
    }
}
