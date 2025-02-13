import { Findmeta } from '../../../class/FindMeta.js'
import { TarirTable } from './TarirTable.js'
import { Summator } from './Summator.js'
import { RenderHTML } from './RenderHTML.js'
import { ControllSetParam } from './ControllSetParam.js'

export class ConfiguratorParams {
    constructor(id, port, imei, dat, idBitrix) {
        console.log(id, port, imei, dat, idBitrix)
        this.id = id
        this.port = port
        this.imei = imei
        this.dat = dat
        this.idBitrix = idBitrix
        this.activeClassTarir = null
        this.pop = document.querySelector('.popup-background')
        this.element = document.querySelector('.search_input_meta')
        this.storageMeta = [
            { 'id': 1, index: 10, 'sensor': 'Скорость', 'parametr': 'speed' },
            { 'id': 2, index: 43, 'sensor': 'Курс', 'parametr': 'course' },
            { 'id': 3, index: 40, 'sensor': 'Спутники', 'parametr': 'sats' },
            { 'id': 4, index: 41, 'sensor': 'Широта', 'parametr': 'lat' },
            { 'id': 5, index: 42, 'sensor': 'Долгота', 'parametr': 'lon' },
            { 'id': 6, index: 11, 'sensor': 'Время посл. сообщения', 'parametr': 'last_valid_time' },
            { 'id': 7, index: 12, 'sensor': 'Зажигание', 'parametr': 'engine' },
            { 'id': 8, index: 13, 'sensor': 'Бортовое питание', 'parametr': 'pwr' },
            { 'id': 9, index: 20, 'sensor': 'Топливо', 'parametr': 'oil' },
            { 'id': 10, index: 21, 'sensor': 't° топлива в баке', 'parametr': 'oiltemp' },
            { 'id': 11, index: 20, 'sensor': 'Топливо 2', 'parametr': 'oil2' },
            { 'id': 12, index: 21, 'sensor': 't° топлива в баке 2', 'parametr': 'oiltemp2' },
            { 'id': 13, index: 20, 'sensor': 'Топливо 3', 'parametr': 'oil3' },
            { 'id': 14, index: 21, 'sensor': 't° топлива в баке 3', 'parametr': 'oiltemp3' },
            { 'id': 15, index: 22, 'sensor': 'Сумматор', 'parametr': 'summatorOil' },
            { 'id': 16, index: 50, 'sensor': 'Подъём кузова', 'parametr': 'lift' },
            { 'id': 17, index: 51, 'sensor': 'Работа навесного вкл/выкл', 'parametr': 'liftBoolean' },
            { 'id': 18, index: 30, 'sensor': 'Обороты двигателя', 'parametr': 'engine_rpm' },
            { 'id': 19, index: 31, 'sensor': 't° охлаждающей жидкости', 'parametr': 'engine_coolant_temp' },
            { 'id': 20, index: 14, 'sensor': 'Пробег', 'parametr': 'mileage' },
            { 'id': 21, index: 32, 'sensor': '% нагрузки двигателя', 'parametr': 'engine_load' },
            { 'id': 22, index: 110, 'sensor': 'Рулевое левое', 'parametr': 'tpms_pressure_2' },
            { 'id': 23, index: 110, 'sensor': 'Рулевое правое', 'parametr': 'tpms_pressure_1' },
            { 'id': 24, index: 110, 'sensor': 'Тягач Ведущее Лев Внеш', 'parametr': 'tpms_pressure_6' },
            { 'id': 25, index: 110, 'sensor': 'Тягач Ведущее Лев Внут', 'parametr': 'tpms_pressure_5' },
            { 'id': 26, index: 110, 'sensor': 'Тягач Ведущее Прав Внут', 'parametr': 'tpms_pressure_4' },
            { 'id': 27, index: 110, 'sensor': 'Тягач Ведущее Прав Внеш', 'parametr': 'tpms_pressure_3' },
            { 'id': 28, index: 110, 'sensor': '3 Ось Лев Внеш', 'parametr': 'tpms_pressure_10' },
            { 'id': 29, index: 110, 'sensor': '3 Ось Лев Внут', 'parametr': 'tpms_pressure_9' },
            { 'id': 30, index: 110, 'sensor': '3 Ось Прав Внут', 'parametr': 'tpms_pressure_8' },
            { 'id': 31, index: 110, 'sensor': '3 Ось Прав Внеш', 'parametr': 'tpms_pressure_7' },
            { 'id': 32, index: 110, 'sensor': '4 Ось Лев Внеш', 'parametr': 'tpms_pressure_36' },
            { 'id': 33, index: 110, 'sensor': '4 Ось Лев Внут', 'parametr': 'tpms_pressure_35' },
            { 'id': 34, index: 110, 'sensor': '4 Ось Прав Внут', 'parametr': 'tpms_pressure_34' },
            { 'id': 35, index: 110, 'sensor': '4 Ось Прав Внеш', 'parametr': 'tpms_pressure_33' },
            { 'id': 36, index: 110, 'sensor': 'Прицеп 1 Ось Л', 'parametr': 'tpms_pressure_40' },
            { 'id': 37, index: 110, 'sensor': 'Прицеп 1 Ось П', 'parametr': 'tpms_pressure_37' },
            { 'id': 38, index: 110, 'sensor': 'Прицеп 2 Ось Л', 'parametr': 'tpms_pressure_44' },
            { 'id': 39, index: 110, 'sensor': 'Прицеп 2 Ось П', 'parametr': 'tpms_pressure_41' },
            { 'id': 40, index: 110, 'sensor': 'Прицеп 3 Ось Л', 'parametr': 'tpms_pressure_39' },
            { 'id': 41, index: 110, 'sensor': 'Прицеп 3 Ось П', 'parametr': 'tpms_pressure_38' },
            { 'id': 42, index: 111, 'sensor': 't° Рулевое левое', 'parametr': 'tpms_temp_2' },
            { 'id': 43, index: 111, 'sensor': 't° Рулевое правое', 'parametr': 'tpms_temp_1' },
            { 'id': 44, index: 111, 'sensor': 't° Тягач Ведущее Лев Внеш', 'parametr': 'tpms_temp_6' },
            { 'id': 45, index: 111, 'sensor': 't° Тягач Ведущее Лев Внут', 'parametr': 'tpms_temp_5' },
            { 'id': 46, index: 111, 'sensor': 't° Тягач Ведущее Прав Внут', 'parametr': 'tpms_temp_4' },
            { 'id': 47, index: 111, 'sensor': 't° Тягач Ведущее Прав Внеш', 'parametr': 'tpms_temp_3' },
            { 'id': 48, index: 111, 'sensor': 't° 3 Ось Лев Внеш', 'parametr': 'tpms_temp_10' },
            { 'id': 49, index: 111, 'sensor': 't° 3 Ось Лев Внут', 'parametr': 'tpms_temp_9' },
            { 'id': 50, index: 111, 'sensor': 't° 3 Ось Прав Внут', 'parametr': 'tpms_temp_8' },
            { 'id': 51, index: 111, 'sensor': 't° 3 Ось Прав Внеш', 'parametr': 'tpms_temp_7' },
            { 'id': 52, index: 111, 'sensor': 't° 4 Ось Лев Внеш', 'parametr': 'tpms_temp_36' },
            { 'id': 53, index: 111, 'sensor': 't° 4 Ось Лев Внут', 'parametr': 'tpms_temp_35' },
            { 'id': 54, index: 111, 'sensor': 't° 4 Ось Прав Внут', 'parametr': 'tpms_temp_34' },
            { 'id': 55, index: 111, 'sensor': 't° 4 Ось Прав Внеш', 'parametr': 'tpms_temp_33' },
            { 'id': 56, index: 111, 'sensor': 't° Прицеп 1 Ось Л', 'parametr': 'tpms_temp_40' },
            { 'id': 57, index: 111, 'sensor': 't° Прицеп 1 Ось П', 'parametr': 'tpms_temp_37' },
            { 'id': 58, index: 111, 'sensor': 't° Прицеп 2 Ось Л', 'parametr': 'tpms_temp_44' },
            { 'id': 59, index: 111, 'sensor': 't° Прицеп 2 Ось П', 'parametr': 'tpms_temp_41' },
            { 'id': 60, index: 111, 'sensor': 't° Прицеп 3 Ось Л', 'parametr': 'tpms_temp_39' },
            { 'id': 61, index: 111, 'sensor': 't° Прицеп 3 Ось П', 'parametr': 'tpms_temp_38' },
            { 'id': 62, index: 23, 'sensor': 'Моточасы', 'parametr': 'engine_hours' },
            { 'id': 63, index: 112, 'sensor': 'Колесо', 'parametr': 'tpms_pressure_17' },
            { 'id': 64, index: 112, 'sensor': 'Колесо', 'parametr': 'tpms_pressure_20' },
            { 'id': 65, index: 113, 'sensor': 't° Колесо', 'parametr': 'tpms_temp_17' },
            { 'id': 66, index: 113, 'sensor': 't° Колесо', 'parametr': 'tpms_temp_20' },
            { 'id': 67, index: 20, 'sensor': 'Топливо 4', 'parametr': 'oil4' },
            { 'id': 68, index: 21, 'sensor': 't° топлива в баке 4', 'parametr': 'oiltemp4' },
            { 'id': 69, index: 20, 'sensor': 'Топливо 5', 'parametr': 'oil5' },
            { 'id': 70, index: 21, 'sensor': 't° топлива в баке 5', 'parametr': 'oiltemp5' },
            { 'id': 71, index: 20, 'sensor': 'Топливо 6', 'parametr': 'oil6' },
            { 'id': 72, index: 21, 'sensor': 't° топлива в баке 6', 'parametr': 'oiltemp6' },
            { 'id': 73, index: 110, 'sensor': 'Колесо 11', 'parametr': 'tpms_pressure_11' },
            { 'id': 74, index: 110, 'sensor': 'Колесо 12', 'parametr': 'tpms_pressure_12' },
            { 'id': 75, index: 110, 'sensor': 'Колесо 13', 'parametr': 'tpms_pressure_13' },
            { 'id': 76, index: 110, 'sensor': 'Колесо 14', 'parametr': 'tpms_pressure_14' },
            { 'id': 77, index: 110, 'sensor': 'Колесо 15', 'parametr': 'tpms_pressure_15' },
            { 'id': 78, index: 110, 'sensor': 'Колесо 16', 'parametr': 'tpms_pressure_16' },
            { 'id': 79, index: 110, 'sensor': 'Колесо 18', 'parametr': 'tpms_pressure_18' },
            { 'id': 80, index: 110, 'sensor': 'Колесо 19', 'parametr': 'tpms_pressure_19' },
            { 'id': 81, index: 110, 'sensor': 'Колесо 21', 'parametr': 'tpms_pressure_21' },
            { 'id': 82, index: 110, 'sensor': 'Колесо 22', 'parametr': 'tpms_pressure_22' },
            { 'id': 83, index: 110, 'sensor': 'Колесо 23', 'parametr': 'tpms_pressure_23' },
            { 'id': 84, index: 110, 'sensor': 'Колесо 24', 'parametr': 'tpms_pressure_24' },
            { 'id': 85, index: 110, 'sensor': 'Колесо 25', 'parametr': 'tpms_pressure_25' },
            { 'id': 86, index: 110, 'sensor': 'Колесо 26', 'parametr': 'tpms_pressure_26' },
            { 'id': 87, index: 110, 'sensor': 'Колесо 27', 'parametr': 'tpms_pressure_27' },
            { 'id': 88, index: 110, 'sensor': 'Колесо 28', 'parametr': 'tpms_pressure_28' },
            { 'id': 89, index: 110, 'sensor': 'Колесо 29', 'parametr': 'tpms_pressure_29' },
            { 'id': 90, index: 110, 'sensor': 'Колесо 30', 'parametr': 'tpms_pressure_30' },
            { 'id': 91, index: 110, 'sensor': 'Колесо 31', 'parametr': 'tpms_pressure_31' },
            { 'id': 92, index: 110, 'sensor': 'Колесо 32', 'parametr': 'tpms_pressure_32' },
            { 'id': 93, index: 110, 'sensor': 'Колесо 42', 'parametr': 'tpms_pressure_42' },
            { 'id': 94, index: 110, 'sensor': 'Колесо 43', 'parametr': 'tpms_pressure_43' },
            { 'id': 95, index: 111, 'sensor': 'Колесо temp 11', 'parametr': 'tpms_temp_11' },
            { 'id': 96, index: 111, 'sensor': 'Колесо temp 12', 'parametr': 'tpms_temp_12' },
            { 'id': 97, index: 111, 'sensor': 'Колесо temp 13', 'parametr': 'tpms_temp_13' },
            { 'id': 98, index: 111, 'sensor': 'Колесо temp 14', 'parametr': 'tpms_temp_14' },
            { 'id': 99, index: 111, 'sensor': 'Колесо temp 15', 'parametr': 'tpms_temp_15' },
            { 'id': 100, index: 111, 'sensor': 'Колесо temp 16', 'parametr': 'tpms_temp_16' },
            { 'id': 101, index: 111, 'sensor': 'Колесо temp 18', 'parametr': 'tpms_temp_18' },
            { 'id': 102, index: 111, 'sensor': 'Колесо temp 19', 'parametr': 'tpms_temp_19' },
            { 'id': 103, index: 111, 'sensor': 'Колесо temp 21', 'parametr': 'tpms_temp_21' },
            { 'id': 104, index: 111, 'sensor': 'Колесо temp 22', 'parametr': 'tpms_temp_22' },
            { 'id': 105, index: 111, 'sensor': 'Колесо temp 23', 'parametr': 'tpms_temp_23' },
            { 'id': 106, index: 111, 'sensor': 'Колесо temp 24', 'parametr': 'tpms_temp_24' },
            { 'id': 107, index: 111, 'sensor': 'Колесо temp 25', 'parametr': 'tpms_temp_25' },
            { 'id': 108, index: 111, 'sensor': 'Колесо temp 26', 'parametr': 'tpms_temp_26' },
            { 'id': 109, index: 111, 'sensor': 'Колесо temp 27', 'parametr': 'tpms_temp_27' },
            { 'id': 110, index: 111, 'sensor': 'Колесо temp 28', 'parametr': 'tpms_temp_28' },
            { 'id': 111, index: 111, 'sensor': 'Колесо temp 29', 'parametr': 'tpms_temp_29' },
            { 'id': 112, index: 111, 'sensor': 'Колесо temp 30', 'parametr': 'tpms_temp_30' },
            { 'id': 113, index: 111, 'sensor': 'Колесо temp 31', 'parametr': 'tpms_temp_31' },
            { 'id': 114, index: 111, 'sensor': 'Колесо temp 32', 'parametr': 'tpms_temp_32' },
            { 'id': 115, index: 111, 'sensor': 'Колесо temp 42', 'parametr': 'tpms_temp_42' },
            { 'id': 116, index: 111, 'sensor': 'Колесо temp 43', 'parametr': 'tpms_temp_43' }
        ]
        this.listMeta = document.querySelector('.list_meta')
        this.listOldData = document.querySelector('.list_old_data')
        this.updateMeta = document.querySelector('.update_meta')
        this.clearParams = null
        this.itemMeta = null;
        this.itemStor = null;
        this.boundUpdate = this.createListMeta.bind(this);
        this.init()
        //this.initEventListeners();
    }

    async init() {
        this.createListParams() //создаем элементы из stora
        await this.createListMeta() //создаем элементы из meta
    }


    reinitialize(newId, port, imei, dat) {
        this.removeEventListeners(); // Удаление старых слушателей событий
        this.id = newId; // Обновление id
        this.port = port
        this.imei = imei
        this.dat = dat
        this.init(); // Переинициализация с новым id
    }



    clearMetaParams(el, event) {
        event.stopPropagation();
        this.clickMeta = [...this.listOldData.querySelectorAll('.clickMeta')];
        const element = this.clickMeta.find(e => e.textContent === el.previousElementSibling.textContent)
        if (element) {
            element.parentElement.style.borderLeft = 'none'
            element.classList.remove('clickMeta')
            el.previousElementSibling.textContent = ''
            el.parentElement.nextElementSibling.children[1].querySelector('.span_sens').textContent = ''
            el.parentElement.nextElementSibling.querySelector('.val_koef').value = ''
            if (el.parentElement.nextElementSibling.querySelector('.val_koef_ts')) el.parentElement.nextElementSibling.querySelector('.val_koef_ts').value = ''
            if (el.parentElement.nextElementSibling.querySelector('.odometr_terminal')) el.parentElement.nextElementSibling.querySelector('.odometr_terminal').textContent = ''


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

    async createListMeta() {
        const data = await this.getMetaParams()
        if (data.length === 0) { return }
        const meta = Object.entries(data[0]).filter((element) => element[0] !== 'nameCar' && element[0] !== 'imei' && element[0] !== 'id' && element[0] !== 'port' && element[0] !== 'idObject');
        const list = document.querySelectorAll('.item_meta')
        if (list) {
            list.forEach(e => e.remove())
        }
        meta.sort((a, b) => a[0].localeCompare(b[0]));

        this.listOldData.innerHTML = RenderHTML.renderMeta(meta)
        new Findmeta(this.element)
        this.itemMeta = [...document.querySelectorAll('.item_meta')];
        this.itemMeta.forEach(el => { el.addEventListener('click', this.metaToggle.bind(this, el)) })
        this.controllFlashBorder()
    }

    controllFlashBorder() {
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

        this.itemStor.filter(e => e.children[2].textContent).forEach(t => console.log(t.nextElementSibling))
        const data = this.itemStor.filter(e => e.children[2].textContent).map(el => (
            {
                id: this.id, port: this.port,
                sens: el.children[0].value ? el.children[0].value : el.children[0].placeholder,
                params: el.children[1].textContent,
                meta: el.children[2].textContent,
                value: el.nextElementSibling.querySelector('.metaname').getAttribute('rel'),
                status: null,
                time: Math.floor(new Date().getTime() / 1000),
                login: login,
                data: null,
                imei: this.imei,
                idBitrix: this.idBitrix,
                index: Number(el.children[1].getAttribute('index'))
            }))
        console.log(data)
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
        console.log(port)
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw, port, imei }))
        }
        const parametrs = await fetch('api/getMetas', params)
        const lastParams = await parametrs.json()
        console.log(lastParams)
        return lastParams
    }

    createListParams() {
        new ControllSetParam(this.storageMeta, this.listMeta, this.dat, this.id)
        this.itemStor = [...this.listMeta.querySelectorAll('.item_stor')];
        this.clearParams = [...this.listMeta.querySelectorAll('.clear_params')];
        this.clearParams.forEach(el => el.addEventListener('click', this.clearMetaParams.bind(this, el)))
    }


    createSummatorOil(el) {
        if (!this.activeClassSummator) {
            this.activeClassSummator = new Summator(this.id, el, this.dat, this.listMeta)
        } else {
            this.activeClassSummator.reinitialize(this.id, el, this.dat, this.listMeta);
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


    metaToggle(el) {
        const clickStor = document.querySelector('.clickStor')
        if (clickStor) {
            !el.classList.contains('clickMeta') ? el.children[0].classList.add('clickMeta') : null
            clickStor.children[2].textContent = el.children[0].textContent
            clickStor.nextElementSibling.children[1].querySelector('.metaname').textContent = `${el.children[0].textContent} ${el.children[1].textContent}`
            clickStor.nextElementSibling.children[1].querySelector('.metaname').setAttribute('rel', el.children[1].textContent)
            const odometrTS = clickStor.nextElementSibling.querySelector('.val_koef_ts')
            const odometrTerminal = clickStor.nextElementSibling.querySelector('.odometr_terminal')
            if (odometrTerminal) odometrTerminal.textContent = el.children[1].textContent
            if (odometrTS) odometrTS.value = el.children[1].textContent

            this.itemMeta.forEach(el => { el.children[0].classList.remove('clickMeta') })
            this.dat = null
            this.controllFlashBorder()
        }
    }
}

