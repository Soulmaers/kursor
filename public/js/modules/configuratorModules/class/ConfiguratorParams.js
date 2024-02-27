

export class ConfiguratorParams {
    constructor(id, port, imei, dat) {
        this.id = id
        this.port = port
        this.imei = imei
        this.dat = dat
        this.storageMeta = [{ 'sensor': 'Зажигание', 'parametr': 'engine' },
        { 'sensor': 'Бортовое питание', 'parametr': 'pwr' },
        { 'sensor': 'Топливо', 'parametr': 'oil' },
        { 'sensor': 'Подъём кузова', 'parametr': 'lift' },
        { 'sensor': 'Обороты двигателя', 'parametr': 'engine_rpm' },
        { 'sensor': 't° охлаждающей жидкости', 'parametr': 'engine_coolant_temp' },
        { 'sensor': 'Пробег', 'parametr': 'mileage' },
        { 'sensor': 'Скорость', 'parametr': 'speed' },
        { 'sensor': 'Курс', 'parametr': 'course' },
        { 'sensor': 'Спутники', 'parametr': 'sats' },
        { 'sensor': 'Широта', 'parametr': 'lat' },
        { 'sensor': 'Долгота', 'parametr': 'lon' },
        { 'sensor': 'Время посл. сообщения', 'parametr': 'last_valid_time' },
        { 'sensor': '% нагрузки двигателя', 'parametr': 'engine_load' },
        { 'sensor': 'Рулевое левое', 'parametr': 'tpms_pressure_2' },
        { 'sensor': 'Рулевое правое', 'parametr': 'tpms_pressure_1' },
        { 'sensor': 'Тягач Ведущее Лев Внеш', 'parametr': 'tpms_pressure_6' },
        { 'sensor': 'Тягач Ведущее Лев Внут', 'parametr': 'tpms_pressure_5' },
        { 'sensor': 'Тягач Ведущее Прав Внут', 'parametr': 'tpms_pressure_4' },
        { 'sensor': 'Тягач Ведущее Прав Внеш', 'parametr': 'tpms_pressure_3' },
        { 'sensor': '3 Ось Лев Внеш', 'parametr': 'tpms_pressure_10' },
        { 'sensor': '3 Ось Лев Внут', 'parametr': 'tpms_pressure_9' },
        { 'sensor': '3 Ось Прав Внут', 'parametr': 'tpms_pressure_8' },
        { 'sensor': '3 Ось Прав Внеш', 'parametr': 'tpms_pressure_7' },
        { 'sensor': '4 Ось Лев Внеш', 'parametr': 'tpms_pressure_36' },
        { 'sensor': '4 Ось Лев Внут', 'parametr': 'tpms_pressure_35' },
        { 'sensor': '4 Ось Прав Внут', 'parametr': 'tpms_pressure_34' },
        { 'sensor': '4 Ось Прав Внеш', 'parametr': 'tpms_pressure_33' },
        { 'sensor': 'Прицеп 1 Ось Л', 'parametr': 'tpms_pressure_40' },
        { 'sensor': 'Прицеп 1 Ось П', 'parametr': 'tpms_pressure_37' },
        { 'sensor': 'Прицеп 2 Ось Л', 'parametr': 'tpms_pressure_44' },
        { 'sensor': 'Прицеп 2 Ось П', 'parametr': 'tpms_pressure_41' },
        { 'sensor': 't° Рулевое левое', 'parametr': 'tpms_temp_2' },
        { 'sensor': 't° Рулевое правое', 'parametr': 'tpms_temp_1' },
        { 'sensor': 't° Тягач Ведущее Лев Внеш', 'parametr': 'tpms_temp_6' },
        { 'sensor': 't° Тягач Ведущее Лев Внут', 'parametr': 'tpms_temp_5' },
        { 'sensor': 't° Тягач Ведущее Прав Внут', 'parametr': 'tpms_temp_4' },
        { 'sensor': 't° Тягач Ведущее Прав Внеш', 'parametr': 'tpms_temp_3' },
        { 'sensor': 't° 3 Ось Лев Внеш', 'parametr': 'tpms_temp_10' },
        { 'sensor': 't° 3 Ось Лев Внут', 'parametr': 'tpms_temp_9' },
        { 'sensor': 't° 3 Ось Прав Внут', 'parametr': 'tpms_temp_8' },
        { 'sensor': 't° 3 Ось Прав Внеш', 'parametr': 'tpms_temp_7' },
        { 'sensor': 't° 4 Ось Лев Внеш', 'parametr': 'tpms_temp_36' },
        { 'sensor': 't° 4 Ось Лев Внут', 'parametr': 'tpms_temp_35' },
        { 'sensor': 't° 4 Ось Прав Внут', 'parametr': 'tpms_temp_34' },
        { 'sensor': 't° 4 Ось Прав Внеш', 'parametr': 'tpms_temp_33' },
        { 'sensor': 't° Прицеп 1 Ось Л', 'parametr': 'tpms_temp_40' },
        { 'sensor': 't° Прицеп 1 Ось П', 'parametr': 'tpms_temp_37' },
        { 'sensor': 't° Прицеп 2 Ось Л', 'parametr': 'tpms_temp_44' },
        { 'sensor': 't° Прицеп 2 Ось П', 'parametr': 'tpms_temp_41' },
        ]
        this.listMeta = document.querySelector('.list_meta')
        this.listOldData = document.querySelector('.list_old_data')
        this.updateMeta = document.querySelector('.update_meta')
        this.clearParams = null
        this.itemMeta = null;
        this.itemStor = null;
        this.updateMeta.addEventListener('click', this.createListMeta.bind(this))
        this.init()


    }

    clearMetaParams(el) {
        if (el.classList.contains('clear_params')) {
            console.log('клик?')
            this.itemMeta.forEach(elem => {
                if (el.previousElementSibling.textContent === elem.textContent) {
                    elem.style.borderLeft = 'none'
                    elem.classList.remove('clickMeta')
                }
            })
            el.previousElementSibling.textContent = ''
        }
    }

    //868184064811311
    async init() {
        console.log(this.dat)
        this.createListParams() //создаем элементы из stora
        await this.createListMeta() //создаем элементы из meta
    }

    async createListMeta() {
        const data = await this.getMetaParams()
        console.log(data)
        const meta = data.filter((element) => element !== 'id' && element !== 'port' && element !== 'idObject');
        const list = document.querySelectorAll('.item_meta')
        if (list) {
            list.forEach(e => e.remove())
        }
        meta.forEach(e => {
            const li = document.createElement('li')
            li.classList.add('item_meta')
            li.textContent = e
            this.listOldData.appendChild(li)
        })
        this.itemMeta = [...document.querySelectorAll('.item_meta')];
        this.itemMeta.forEach(el => { el.addEventListener('click', this.metaToggle.bind(this, el)) })
        this.controllFlashBorder()
        // this.id = null
    }

    controllFlashBorder() {
        console.log(this.dat)
        if (this.dat) {
            this.itemStor.map(e =>
                this.dat.forEach(it => {
                    if (it.params === e.children[1].textContent) {
                        e.children[2].textContent = it.meta
                    }
                })
            )
        }
        console.log('дальше')
        const arrayStor = this.itemStor.filter(it => it.children[2].textContent).map(e => e.children[2].textContent)
        const clickElement = document.querySelector('.clickStor')
        this.itemMeta.forEach(el => {
            el.style.borderLeft = 'none'
            arrayStor.includes(el.textContent) ? el.classList.add('clickMeta') : null
            if (clickElement && clickElement.children[2].textContent === el.textContent) {
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
            imei: this.imei
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
        //   console.log(message)
    }
    async getMetaParams() {
        const idw = this.id
        const port = this.port
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw, port }))
        }
        const parametrs = await fetch('api/getMetas', params)
        const lastParams = await parametrs.json()
        return lastParams
    }

    createListParams() {
        const list = document.querySelectorAll('.item_stor')
        if (list) {
            list.forEach(e => e.remove())
        }
        this.storageMeta.forEach(e => {
            const li = document.createElement('li')
            li.classList.add('item_stor')
            this.listMeta.appendChild(li)
            const sens = document.createElement('input')
            sens.classList.add('sensor_stor')
            sens.placeholder = e.sensor
            li.appendChild(sens)
            const param = document.createElement('div')
            param.classList.add('param_stor')
            param.textContent = e.parametr
            li.appendChild(param)
            const oldParam = document.createElement('div')
            oldParam.classList.add('param_meta')
            li.appendChild(oldParam)
            const i = document.createElement('i')
            i.classList.add('fas')
            i.classList.add('fa-times')
            i.classList.add('clear_params')
            li.appendChild(i)
        })
        this.itemStor = [...document.querySelectorAll('.item_stor')];
        this.clearParams = [...document.querySelectorAll('.clear_params')];
        this.itemStor.forEach(el => { el.addEventListener('click', this.storToggle.bind(this, el)) })
        this.clearParams.forEach(el => el.addEventListener('click', this.clearMetaParams.bind(this, el)))
    }

    storToggle(el) {
        const clickElement = document.querySelector('.clickStor')
        clickElement ? clickElement.classList.remove('clickStor') : null
        el.classList.add('clickStor')
        this.controllFlashBorder()
    }
    metaToggle(el) {
        const clickStor = document.querySelector('.clickStor')
        if (clickStor) {
            !el.classList.contains('clickMeta') ? el.classList.add('clickMeta') : null
            clickStor.children[2].textContent = el.textContent
            this.itemMeta.forEach(el => { el.classList.remove('clickMeta') })
            this.dat = null
            this.controllFlashBorder()
        }
    }
}