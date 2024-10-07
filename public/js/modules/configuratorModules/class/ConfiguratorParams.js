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
        /*if (el.classList.contains('clear_params')) {
            this.itemMeta.forEach(elem => {
                //  console.log(el.previousElementSibling)
                //  console.log(el.previousElementSibling.textContent, elem.textContent)
                if (el.previousElementSibling.textContent === elem.textContent) {
                    console.log(elem)
                    elem.style.borderLeft = 'none'
                    elem.classList.remove('clickMeta')
                }
            })
            el.previousElementSibling.textContent = ''
 
            /*  const param = el.parentNode.children[1].textContent
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
   } */
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
        const id = this.id
        const data = this.itemStor.filter(e => e.children[2].textContent).map(el => ({
            id: this.id, port: this.port,
            sens: el.children[0].value ? el.children[0].value : el.children[0].placeholder,
            params: el.children[1].textContent,
            meta: el.children[2].textContent,
            value: null,
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
        new ControllSetParam(this.storageMeta, this.listMeta, this.dat, this.id)
        this.itemStor = [...this.listMeta.querySelectorAll('.item_stor')];
        this.clearParams = [...this.listMeta.querySelectorAll('.clear_params')];
        this.clearParams.forEach(el => el.addEventListener('click', this.clearMetaParams.bind(this, el)))
    }




    test() {
        const formula = this.modalka.querySelector('.val_koef')

        console.log(formula.value)
        const res = formula.value
        //  const res = `${5000 + formula.value}`
        console.log(res)
        const rr = eval(res);
        console.log(rr)
        console.log()
        const array = [{ dut: 100, l: 10 }, { dut: 1500, l: 50 }, { dut: 4040, l: 120 }]
        console.log(Math.exp(100))
        console.log(4E-7 * Math.pow(4022, 2) + 0.1702 * 4022 - 0.0655)
        //= 0,0279x + 7,5945
        function transformExpressionWithExponent(expression, x) {
            // Убираем пробелы вокруг x и степеней
            expression = expression.replace(/\s+/g, '');
            // Добавляем знак умножения перед 'x', если его нет
            expression = expression.replace(/(\d)(x)/g, '$1*$2');
            // Заменяем выражения вида x2 на Math.pow(x, 2)
            expression = expression.replace(/x(\d+)/g, 'Math.pow(x, $1)');
            // Заменяем все оставшиеся 'x' на значение переменной x
            expression = expression.replace(/x/g, x);

            return expression;
        }

        const x = 4022;
        const inputExpression = "4E-07x2 + 0,1702x - 0,0655";
        // Преобразуем запятые в точки, чтобы JavaScript мог их правильно обработать
        const formattedExpression = inputExpression.replace(/,/g, '.');

        const transformedExpression = transformExpressionWithExponent(formattedExpression, x);
        console.log("Преобразованное выражение:", transformedExpression);

        // Вычисляем результат
        try {
            const result = eval(transformedExpression);
            console.log("Результат вычисления:", result);
        } catch (error) {
            console.error("Ошибка при вычислении:", error);
        }

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


    metaToggle(el) {
        const clickStor = document.querySelector('.clickStor')
        if (clickStor) {
            !el.classList.contains('clickMeta') ? el.children[0].classList.add('clickMeta') : null
            clickStor.children[2].textContent = el.children[0].textContent
            clickStor.nextElementSibling.children[1].querySelector('.span_sens').textContent = el.children[0].textContent
            clickStor.nextElementSibling.children[2].querySelector('.val_koef').value = ''
            this.itemMeta.forEach(el => { el.children[0].classList.remove('clickMeta') })
            this.dat = null
            this.controllFlashBorder()
        }
    }
}
