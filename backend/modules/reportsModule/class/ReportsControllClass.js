const databaseService = require('../../../services/database.service')
const { CalculateReports } = require('./Calculate')
const { ProstoyControll } = require('./ProstoyControllCalculater')
const { SCDSHClass } = require('./SKDSHClass')
const { JobToBase } = require('../../reportSettingsManagerModule/class/JobToBase')
const { OilCalculator } = require('./OilControllCalculater')
const { DrainCalculate } = require('./DrainControllCalculate')

const XLSX = require('xlsx');
class ReportsControllClass {
    constructor(object, setAttributes) {
        this.object = object
        this.idTemplates = this.object[0].idTemplates
        this.interval = this.object[0].data
        this.setAttributes = setAttributes
    }



    async init() {
        this.date = CalculateReports.convertFormatTime(this.interval)
        console.log(this.date)
        this.attributes = await this.getAttributesTemplates()
        const globalStruktura = Promise.all(this.object.map(async el => {
            const localCopyAttributes = JSON.parse(JSON.stringify(this.attributes))
            const setAttributes = this.setAttributes ? JSON.parse(this.setAttributes.object) : await this.getSetAttributesTemplates(el.idObject)
            const data = await this.getDataGlobalStor(el.idObject)
            return this.startCalculate(el, localCopyAttributes, data, setAttributes)
        }))
        return await globalStruktura
    }
    async startCalculate(object, localCopyAttributes, data, setAttributes) {
        const { idObject, objectName, groupName, typeIndex } = object

        if (!data || data.length === 0) {
            localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Группа объектов') { e.result = groupName, e.local = '' } })
            localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Объект') { e.result = objectName, e.local = '' } })
            localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Начало интервала') { e.result = CalculateReports.converterTimes(this.interval[0]), e.local = '' } })
            localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Конец интервала') { e.result = CalculateReports.converterTimes(this.interval[1]), e.local = '' } })
            localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Пробег') { e.result = 0, e.local = 'км' } })
            return localCopyAttributes
        }
        const motoChartsData = await databaseService.sumIdwToBase(this.date, idObject)
        let volume = await databaseService.getTarirData(idObject, 'oil')
        volume = volume.length !== 0 ? Number(volume[volume.length - 1].litrazh) : 'Н/Д'
        const instanceRefill = new OilCalculator(data, setAttributes, idObject)
        const refill = await instanceRefill.init()
        const instanceDrain = new DrainCalculate(data, setAttributes, idObject)
        const drain = await instanceDrain.init()
        const startOil = data[0].dut ? (CalculateReports.startAndFinishOil(data))[0] : 'Н/Д'
        const zapravleno = refill ? refill[0] : 'Н/Д'
        const countZapravka = refill ? refill[1] : []
        const slito = drain ? drain[0] : 'Н/Д'
        const countSliv = drain ? drain[1] : []
        const finishOil = data[0].dut ? (CalculateReports.startAndFinishOil(data))[1] : 'Н/Д'
        const mileage = data[0].mileage ? parseFloat(CalculateReports.calculationMileage(data).toFixed(2)) : 'Н/Д'
        const traveling = CalculateReports.traveling(data, setAttributes)
        const parkings = CalculateReports.parkings(data, setAttributes)
        const stops = CalculateReports.stops(data, setAttributes)
        const moto = await CalculateReports.moto(data, setAttributes, idObject)
        this.instance = new ProstoyControll(data, typeIndex, setAttributes, idObject)
        const prostoy = this.instance.init()

        this.instanceSKDSH = new SCDSHClass(object)
        const skdsh = await this.instanceSKDSH.init()
        const rashodDUT = data[0].dut ? parseFloat((startOil + zapravleno - finishOil).toFixed(2)) : 'Н/Д'
        const rashodDUTKM = data[0].dut && data[0].mileage ? parseFloat(((rashodDUT / mileage) * 100).toFixed(2)) : 'Н/Д'
        const rashodDUTMCH = data[0].dut && moto.motoAll !== 0 ? parseFloat(((rashodDUT / moto.motoAll) * 3600).toFixed(2)) : 'Н/Д'
        const allOil = countZapravka.concat(countSliv)

        localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Группа объектов') { e.result = groupName, e.local = '' } })
        localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Объект') { e.result = objectName, e.local = '' } })
        localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Начало интервала') { e.result = CalculateReports.converterTimes(this.interval[0]), e.local = '' } })
        localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Конец интервала') { e.result = CalculateReports.converterTimes(this.interval[1]), e.local = '' } })
        localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Пробег') { e.result = mileage, e.local = 'км' } })
        localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Потрачено по ДУТ') { e.result = rashodDUT, e.local = 'л' } })
        localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Средний расход по ДУТ на 100км') { e.result = rashodDUTKM, e.local = 'л' } })
        localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Средний расход по ДУТ в моточасах') { e.result = rashodDUTMCH, e.local = 'л' } })
        localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Начальный уровень топлива') { e.result = startOil, e.local = 'л' } })
        localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Конечный уровень топлива') { e.result = finishOil, e.local = 'л' } })
        localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Объем топливного бака') { e.result = volume, e.local = 'л' } })
        localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Моточасы') { e.result = CalculateReports.formatTime(moto.motoAll), e.local = 'ч' } })
        localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Всего заправлено') { e.result = zapravleno, e.local = 'л' } })
        localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Всего слито') { e.result = slito, e.local = 'л' } })
        localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Количество заправок') { e.result = countZapravka.length, e.local = 'шт' } })
        localCopyAttributes.statistic['Статистика'].forEach(e => { if (e.name === 'Количество сливов') { e.result = countSliv.length, e.local = 'шт' } })

        localCopyAttributes.component['Моточасы'].forEach(e => { if (e.name === 'Начало') { e.result = moto.moto.map(e => CalculateReports.converterTimes(e[0].time)), e.local = '' } })
        localCopyAttributes.component['Моточасы'].forEach(e => { if (e.name === 'Начальное положение') { e.result = moto.moto.map(e => e[0].geo), e.local = '' } })
        localCopyAttributes.component['Моточасы'].forEach(e => { if (e.name === 'Конец') { e.result = moto.moto.map(e => CalculateReports.converterTimes(e[1].time)), e.local = '' } })
        localCopyAttributes.component['Моточасы'].forEach(e => { if (e.name === 'Конечное положение') { e.result = moto.moto.map(e => e[1].geo), e.local = '' } })
        localCopyAttributes.component['Моточасы'].forEach(e => { if (e.name === 'Моточасы') { e.result = moto.moto.map(e => CalculateReports.formatTime(e[2].moto)), e.local = 'ч' } })
        localCopyAttributes.component['Моточасы'].forEach(e => { if (e.name === 'Пробег') { e.result = moto.moto.map(e => e[2].distance), e.local = 'км' } })
        localCopyAttributes.component['Моточасы'].forEach(e => { if (e.name === 'Средние обороты двигателя') { e.result = moto.moto.map(e => e[2].mediumEngineRPM), e.local = 'об/мин' } })
        localCopyAttributes.component['Моточасы'].forEach(e => { if (e.name === 'Максимальные обороты двигателя') { e.result = moto.moto.map(e => e[2].maxEngineRPM), e.local = 'об/мин' } })
        localCopyAttributes.component['Моточасы'].forEach(e => { if (e.name === 'Потрачено по ДУТ') { e.result = moto.moto.map(e => e[2].rashodDUT), e.local = 'л' } })
        localCopyAttributes.component['Моточасы'].forEach(e => { if (e.name === 'Средний расход по ДУТ на 100км') { e.result = moto.moto.map(e => e[2].rashodDUTKM), e.local = 'л' } })
        localCopyAttributes.component['Моточасы'].forEach(e => { if (e.name === 'Начальный уровень топлива') { e.result = moto.moto.map(e => e[0].oil), e.local = 'л' } })
        localCopyAttributes.component['Моточасы'].forEach(e => { if (e.name === 'Конечный уровень топлива') { e.result = moto.moto.map(e => e[1].oil), e.local = 'л' } })

        localCopyAttributes.component['Простои на холостом ходу'].forEach(e => { if (e.name === 'Начало') { e.result = prostoy.map(e => CalculateReports.converterTimes(e[0].time)), e.local = '' } })
        localCopyAttributes.component['Простои на холостом ходу'].forEach(e => { if (e.name === 'Начальное положение') { e.result = prostoy.map(e => e[0].geo), e.local = '' } })
        localCopyAttributes.component['Простои на холостом ходу'].forEach(e => { if (e.name === 'Конец') { e.result = prostoy.map(e => CalculateReports.converterTimes(e[1].time)), e.local = '' } })
        localCopyAttributes.component['Простои на холостом ходу'].forEach(e => { if (e.name === 'Конечное положение') { e.result = prostoy.map(e => e[1].geo), e.local = '' } })
        localCopyAttributes.component['Простои на холостом ходу'].forEach(e => { if (e.name === 'Моточасы') { e.result = prostoy.map(e => CalculateReports.formatTime(e[2].moto)), e.local = 'ч' } })
        // this.attributes.component['Простои на холостом ходу'].forEach(e => { if (e.name === 'Потрачено по ДУТ') { e.result = prostoy.map(e => e[2].rashodDUT), e.local = 'л' } })
        // this.attributes.component['Простои на холостом ходу'].forEach(e => { if (e.name === 'Средний расход по ДУТ в моточасах') { e.result = prostoy.map(e => e[2].rashodDUTMCH), e.local = 'л' } })
        // this.attributes.component['Простои на холостом ходу'].forEach(e => { if (e.name === 'Начальный уровень топлива') { e.result = prostoy.map(e => e[0].oil), e.local = 'л' } })
        //  this.attributes.component['Простои на холостом ходу'].forEach(e => { if (e.name === 'Конечный уровень топлива') { e.result = prostoy.map(e => e[1].oil), e.local = 'л' } })


        localCopyAttributes.component['Топливо'].forEach(e => { if (e.name === 'Дата и время') { e.result = allOil.map(e => CalculateReports.converterTimes(e.time)), e.local = '' } })
        localCopyAttributes.component['Топливо'].forEach(e => { if (e.name === 'Местоположение') { e.result = allOil.map(e => e.geo), e.local = '' } })
        localCopyAttributes.component['Топливо'].forEach(e => { if (e.name === 'Начальный уровень топлива') { e.result = allOil.map(e => e.startOil), e.local = 'л' } })
        localCopyAttributes.component['Топливо'].forEach(e => { if (e.name === 'Конечный уровень топлива') { e.result = allOil.map(e => e.finishOil), e.local = 'л' } })
        localCopyAttributes.component['Топливо'].forEach(e => { if (e.name === 'Всего заправлено') { e.result = allOil.map(e => e.value), e.local = 'л' } })
        localCopyAttributes.component['Топливо'].forEach(e => { if (e.name === 'Всего слито') { e.result = allOil.map(e => e.value2), e.local = 'л' } })
        localCopyAttributes.component['Топливо'].forEach(e => { if (e.name === 'Объём бака') { e.result = allOil.map(e => volume), e.local = 'л' } })
        localCopyAttributes.component['Топливо'].forEach(e => { if (e.name === 'До MAX уровня') { e.result = allOil.map(e => volume - e.finishOil), e.local = 'л', e.color = allOil.map(it => (volume - it.finishOil) < 0 ? '#F9966B' : null) } })

        localCopyAttributes.component['Поездки'].forEach(e => { if (e.name === 'Начало') { e.result = traveling.map(e => CalculateReports.converterTimes(e[0].time)), e.local = '' } })
        localCopyAttributes.component['Поездки'].forEach(e => { if (e.name === 'Начальное положение') { e.result = traveling.map(e => e[0].geo), e.local = '' } })
        localCopyAttributes.component['Поездки'].forEach(e => { if (e.name === 'Конец') { e.result = traveling.map(e => CalculateReports.converterTimes(e[1].time)), e.local = '' } })
        localCopyAttributes.component['Поездки'].forEach(e => { if (e.name === 'Конечное положение') { e.result = traveling.map(e => e[1].geo), e.local = '' } })
        localCopyAttributes.component['Поездки'].forEach(e => { if (e.name === 'Длительность') { e.result = traveling.map(e => CalculateReports.formatTime(e[2].time)), e.local = 'чч:мм:сс' } })
        localCopyAttributes.component['Поездки'].forEach(e => { if (e.name === 'Пробег') { e.result = traveling.map(e => e[2].distance), e.local = 'км' } })
        localCopyAttributes.component['Поездки'].forEach(e => { if (e.name === 'Средняя скорость') { e.result = traveling.map(e => e[2].averageSpeed), e.local = 'км/ч' } })
        localCopyAttributes.component['Поездки'].forEach(e => { if (e.name === 'Максимальная скорость') { e.result = traveling.map(e => e[2].maxSpeed), e.local = 'км/ч' } })

        localCopyAttributes.component['Стоянки'].forEach(e => { if (e.name === 'Начало') { e.result = parkings.map(e => CalculateReports.converterTimes(e.time)), e.local = '' } })
        localCopyAttributes.component['Стоянки'].forEach(e => { if (e.name === 'Длительность') { e.result = parkings.map(e => CalculateReports.formatTime(e.diff)), e.local = 'чч:мм:сс' } })
        localCopyAttributes.component['Стоянки'].forEach(e => { if (e.name === 'Положение') { e.result = parkings.map(e => e.geo), e.local = '' } })

        localCopyAttributes.component['Остановки'].forEach(e => { if (e.name === 'Начало') { e.result = stops.map(e => CalculateReports.converterTimes(e.time)), e.local = '' } })
        localCopyAttributes.component['Остановки'].forEach(e => { if (e.name === 'Длительность') { e.result = stops.map(e => CalculateReports.formatTime(e.diff)), e.local = 'чч:мм:сс' } })
        localCopyAttributes.component['Остановки'].forEach(e => { if (e.name === 'Положение') { e.result = stops.map(e => e.geo), e.local = '' } })


        localCopyAttributes.component['СКДШ'].forEach(e => { if (e.name === 'Колесо') { e.result = skdsh.components.map(e => e.sensor), e.local = '' } })
        localCopyAttributes.component['СКДШ'].forEach(e => { if (e.name === 'Ожидание') { e.result = skdsh.components.map(e => CalculateReports.convertTime(e.intervals.intervals.potery.totalTime)), e.local = '' } })
        localCopyAttributes.component['СКДШ'].forEach(e => { if (e.name === 'Низкое') { e.result = skdsh.components.map(e => CalculateReports.convertTime(e.intervals.intervals.belowKnd.totalTime)), e.local = '' } })
        localCopyAttributes.component['СКДШ'].forEach(e => { if (e.name === 'Ниже нормы') { e.result = skdsh.components.map(e => CalculateReports.convertTime(e.intervals.intervals.betweenKndDnn.totalTime)), e.local = '' } })
        localCopyAttributes.component['СКДШ'].forEach(e => { if (e.name === 'Нормальное') { e.result = skdsh.components.map(e => CalculateReports.convertTime(e.intervals.intervals.betweenDnnDvn.totalTime)), e.local = '' } })
        localCopyAttributes.component['СКДШ'].forEach(e => { if (e.name === 'Выше нормы') { e.result = skdsh.components.map(e => CalculateReports.convertTime(e.intervals.intervals.betweenDvnKvd.totalTime)), e.local = '' } })
        localCopyAttributes.component['СКДШ'].forEach(e => { if (e.name === 'Высокое') { e.result = skdsh.components.map(e => CalculateReports.convertTime(e.intervals.intervals.aboveKvd.totalTime)), e.local = '' } })
        localCopyAttributes.component['СКДШ'].forEach(e => { if (e.name === 'Всего') { e.result = skdsh.components.map(e => CalculateReports.convertTime(e.intervals.all.totalTime)), e.local = '' } })
        localCopyAttributes.component['СКДШ'].forEach(e => { if (e.name === 'Минимальное давление в БАР') { e.result = skdsh.components.map(e => e.intervals.porogy[0]), e.local = 'Бар' } })
        localCopyAttributes.component['СКДШ'].forEach(e => { if (e.name === 'Максимальное давление в БАР') { e.result = skdsh.components.map(e => e.intervals.porogy[1]), e.local = 'Бар' } })
        localCopyAttributes.component['СКДШ'].forEach(e => { if (e.name === 'Среднее давление в БАР') { e.result = skdsh.components.map(e => e.intervals.porogy[2]), e.local = 'Бар' } })


        localCopyAttributes.graphic['Топливо'].forEach(e => { if (e.name === 'Дата и время') { e.result = instanceRefill.dataOrigin.map(e => e.last_valid_time) } e.chartType = 'osX' })
        localCopyAttributes.graphic['Топливо'].forEach(e => { if (e.name === 'Обработанные значения') { e.result = instanceRefill.data ? instanceRefill.data.map(e => e.oil) : [], e.color = 'blue', e.chartType = 'line' } })
        localCopyAttributes.graphic['Топливо'].forEach(e => { if (e.name === 'Исходные значения') { e.result = instanceRefill.dataOrigin ? instanceRefill.dataOrigin.map(e => e.oil) : [], e.color = 'red', e.chartType = 'line' } })
        localCopyAttributes.graphic['Топливо'].forEach(e => { if (e.name === 'Движение') { e.result = traveling, e.color = "rgb(183,170,14)", e.chartType = 'rect' } })
        localCopyAttributes.graphic['Топливо'].forEach(e => { if (e.name === 'Работа двигателя') { e.result = moto.moto, e.color = "rgb(255,209,215)", e.chartType = 'rect' } })
        localCopyAttributes.graphic['Топливо'].push({ name: 'Заправки', checked: true, result: countZapravka, icon: "../../../../image/ref.png", chartType: 'icon' })
        localCopyAttributes.graphic['Топливо'].push({ name: 'Сливы', checked: true, result: countSliv, icon: "../../../../image/drain.png", chartType: 'icon' })

        localCopyAttributes.graphic['СКДШ'].forEach(e => { if (e.name === 'Колесо') { e.result = skdsh.components.map(e => e.sensor), e.y = ([this.interval[1] - this.interval[0]]), e.chartType = 'osX', e.local = '' } })
        localCopyAttributes.graphic['СКДШ'].forEach(e => { if (e.name === 'Ожидание') { e.result = skdsh.components.map(e => e.intervals.intervals.potery.totalTime), e.color = 'lightgray', e.chartType = 'rect', e.local = '' } })
        localCopyAttributes.graphic['СКДШ'].forEach(e => { if (e.name === 'Низкое') { e.result = skdsh.components.map(e => e.intervals.intervals.belowKnd.totalTime), e.color = '#e34040', e.chartType = 'rect', e.local = '' } })
        localCopyAttributes.graphic['СКДШ'].forEach(e => { if (e.name === 'Ниже нормы') { e.result = skdsh.components.map(e => e.intervals.intervals.betweenKndDnn.totalTime), e.color = '#e8eb65', e.chartType = 'rect', e.local = '' } })
        localCopyAttributes.graphic['СКДШ'].forEach(e => { if (e.name === 'Нормальное') { e.result = skdsh.components.map(e => e.intervals.intervals.betweenDnnDvn.totalTime), e.color = 'darkgreen', e.chartType = 'rect', e.local = '' } })
        localCopyAttributes.graphic['СКДШ'].forEach(e => { if (e.name === 'Выше нормы') { e.result = skdsh.components.map(e => e.intervals.intervals.betweenDvnKvd.totalTime), e.color = '#9e9913', e.chartType = 'rect', e.local = '' } })
        localCopyAttributes.graphic['СКДШ'].forEach(e => { if (e.name === 'Высокое') { e.result = skdsh.components.map(e => e.intervals.intervals.aboveKvd.totalTime), e.color = 'darkred', e.chartType = 'rect', e.local = '' } })
        localCopyAttributes.graphic['СКДШ'].forEach(e => { if (e.name === 'Всего') { e.result = skdsh.components.map(e => e.intervals.all.totalTime), e.local = '' } })
        localCopyAttributes.graphic['СКДШ'].forEach(e => { if (e.name === 'Минимум') { e.result = skdsh.components.map(e => e.intervals.porogy[0]), e.local = 'Бар' } })
        localCopyAttributes.graphic['СКДШ'].forEach(e => { if (e.name === 'Максимум') { e.result = skdsh.components.map(e => e.intervals.porogy[1]), e.local = 'Бар' } })
        localCopyAttributes.graphic['СКДШ'].forEach(e => { if (e.name === 'Среднее') { e.result = skdsh.components.map(e => e.intervals.porogy[2]), e.local = 'Бар' } })


        localCopyAttributes.graphic['Моточасы'].forEach(e => { if (e.name === 'Моточасы') { e.chartType = 'rect', e.color = "#3333FF", e.local = '', e.result = motoChartsData.map(e => Number(e.moto)) } })
        localCopyAttributes.graphic['Моточасы'].forEach(e => { if (e.name === 'В работе') { e.chartType = 'rect', e.color = "#FF6633", e.local = '', e.result = motoChartsData.map(e => Number(e.moto) - Number(e.prostoy)) } })
        localCopyAttributes.graphic['Моточасы'].unshift({ name: 'Подпись оси', checked: true, chartType: 'osX', result: motoChartsData.map(e => (e.data)), y: motoChartsData.map(e => Number(e.moto)) })
        return localCopyAttributes

    }
    async getAttributesTemplates() {
        const result = await databaseService.getAttributeTemplaceToBase(this.idTemplates)
        const res = JSON.parse(result[0].jsonAttributes)
        return res
    }

    async getSetAttributesTemplates(idObject) {
        const result = await JobToBase.getSettingsToBase(idObject)
        const res = JSON.parse(result[0].jsonsetAttribute)
        return res
    }
    async getDataGlobalStor(idObject) {
        const arrayColumns = ['dut', 'last_valid_time', 'lift', 'liftBoolean', 'speed', 'lat', 'lon', 'engineOn', 'pwr', 'oil', 'summatorOil', 'mileage', 'sats', 'engine']
        const result = await databaseService.getParamsToPressureAndOilToBase(String(this.interval[0]), String(this.interval[1]), idObject, arrayColumns, 0)
        result.sort((a, b) => {
            return new Date(a.last_valid_time) - new Date(b.last_valid_time);
        });
        return result
    }
}


module.exports = {
    ReportsControllClass
}