

export class ConfiguratorParams {
    constructor(id, port) {
        this.id = id
        this.port = port
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
        this.updateMeta.addEventListener('click', this.createListMeta.bind(this))
        console.log(id, port)
        this.createListParams()
        this.createListMeta()

    }
    //868184064811311


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

    }

    async getMetaParams() {
        const idw = this.id
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw }))
        }
        const parametrs = await fetch('api/getMetas', params)
        const lastParams = await parametrs.json()
        return lastParams
    }

    createListParams() {
        console.log(this.storageMeta.length)
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
            //  oldParam.textContent = 'metaparams'
            li.appendChild(oldParam)
        })
    }
}