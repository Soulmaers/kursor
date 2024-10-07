const databaseService = require('../../../services/database.service')
const { CalculateReports } = require('./Calculate')
const { ProstoyControll } = require('./ProstoyControllCalculater')
const { SCDSHClass } = require('./SKDSHClass')

class ReportsControllClass {
    constructor(object) {
        // console.log(object)
        this.object = object
        this.idTemplates = this.object.idTemplates
        this.idObject = this.object.idObject
        this.interval = this.object.data
        this.objectName = this.object.objectName
        this.groupName = this.object.groupName
        this.typeIndex = this.object.typeIndex
    }


    async init() {
        this.attributes = await this.getAttributesTemplates()
        //  this.setAttributes = await this.getSetAttributesTemplates()
        //  console.log(this.setAttributes)
        this.data = await this.getDataGlobalStor()
        this.struktura = this.startCalculate()
        return this.struktura
    }
    async startCalculate() {
        if (!this.data || this.data.length === 0) return this.attributes
        const startOil = this.data[0].oil ? (CalculateReports.startAndFinishOil(this.data))[0] : 'Н/Д'
        const zapravleno = this.data[0].oil ? (CalculateReports.calculateOilUp(this.data))[0] : 'Н/Д'
        const countZapravka = this.data[0].oil ? (CalculateReports.calculateOilUp(this.data))[1] : []
        const slito = this.data[0].oil ? (CalculateReports.calculateOilSliv(this.data))[0] : 'Н/Д'
        const countSliv = this.data[0].oil ? (CalculateReports.calculateOilSliv(this.data))[1] : []
        const finishOil = this.data[0].oil ? (CalculateReports.startAndFinishOil(this.data))[1] : 'Н/Д'
        const mileage = this.data[0].mileage ? parseFloat(CalculateReports.calculationMileage(this.data).toFixed(2)) : 'Н/Д'
        const traveling = CalculateReports.traveling(this.data)
        const parkings = CalculateReports.parkings(this.data)
        const stops = CalculateReports.stops(this.data)
        const moto = CalculateReports.moto(this.data)
        this.instance = new ProstoyControll(this.data, this.typeIndex)
        const prostoy = this.instance.init()

        this.instanceSKDSH = new SCDSHClass(this.object)
        const skdsh = await this.instanceSKDSH.init()

        const rashodDUT = this.data[0].oil ? parseFloat((startOil + zapravleno - finishOil).toFixed(2)) : 'Н/Д'
        const rashodDUTKM = this.data[0].oil && this.data[0].mileage ? parseFloat(((rashodDUT / mileage) * 100).toFixed(2)) : 'Н/Д'
        const rashodDUTMCH = this.data[0].oil && moto.motoAll !== 0 ? parseFloat(((rashodDUT / moto.motoAll) * 3600).toFixed(2)) : 'Н/Д'
        const allOil = this.data[0].oil ? countZapravka.concat(countSliv) : []
        this.attributes.statistic['Статистика'].forEach(e => { if (e.name === 'Группа объектов') { e.result = this.groupName, e.local = '' } })
        this.attributes.statistic['Статистика'].forEach(e => { if (e.name === 'Объект') { e.result = this.objectName, e.local = '' } })
        this.attributes.statistic['Статистика'].forEach(e => { if (e.name === 'Начало интервала') { e.result = CalculateReports.converterTimes(this.interval[0]), e.local = '' } })
        this.attributes.statistic['Статистика'].forEach(e => { if (e.name === 'Конец интервала') { e.result = CalculateReports.converterTimes(this.interval[1]), e.local = '' } })
        this.attributes.statistic['Статистика'].forEach(e => { if (e.name === 'Пробег') { e.result = mileage, e.local = 'км' } })
        this.attributes.statistic['Статистика'].forEach(e => { if (e.name === 'Потрачено по ДУТ') { e.result = rashodDUT, e.local = 'л' } })
        this.attributes.statistic['Статистика'].forEach(e => { if (e.name === 'Средний расход по ДУТ на 100км') { e.result = rashodDUTKM, e.local = 'л' } })
        this.attributes.statistic['Статистика'].forEach(e => { if (e.name === 'Средний расход по ДУТ в моточасах') { e.result = rashodDUTMCH, e.local = 'л' } })
        this.attributes.statistic['Статистика'].forEach(e => { if (e.name === 'Начальный уровень топлива') { e.result = startOil, e.local = 'л' } })
        this.attributes.statistic['Статистика'].forEach(e => { if (e.name === 'Конечный уровень топлива') { e.result = finishOil, e.local = 'л' } })
        // this.attributes.statistic.statistic.forEach(e => { if (e.name === 'Объем топливного бака') { e.result = (CalculateReports.startAndFinishGeo(this.data))[0],e.local='л' } })
        this.attributes.statistic['Статистика'].forEach(e => { if (e.name === 'Моточасы') { e.result = CalculateReports.formatTime(moto.motoAll), e.local = 'ч' } })
        this.attributes.statistic['Статистика'].forEach(e => { if (e.name === 'Всего заправлено') { e.result = zapravleno, e.local = 'л' } })
        this.attributes.statistic['Статистика'].forEach(e => { if (e.name === 'Всего слито') { e.result = slito, e.local = 'л' } })
        this.attributes.statistic['Статистика'].forEach(e => { if (e.name === 'Количество заправок') { e.result = countZapravka.length, e.local = 'шт' } })
        this.attributes.statistic['Статистика'].forEach(e => { if (e.name === 'Количество сливов') { e.result = countSliv.length, e.local = 'шт' } })

        this.attributes.component['Моточасы'].forEach(e => { if (e.name === 'Начало') { e.result = moto.moto.map(e => CalculateReports.converterTimes(e[0].time)), e.local = '' } })
        this.attributes.component['Моточасы'].forEach(e => { if (e.name === 'Начальное положение') { e.result = moto.moto.map(e => e[0].geo), e.local = '' } })
        this.attributes.component['Моточасы'].forEach(e => { if (e.name === 'Конец') { e.result = moto.moto.map(e => CalculateReports.converterTimes(e[1].time)), e.local = '' } })
        this.attributes.component['Моточасы'].forEach(e => { if (e.name === 'Конечное положение') { e.result = moto.moto.map(e => e[1].geo), e.local = '' } })
        this.attributes.component['Моточасы'].forEach(e => { if (e.name === 'Моточасы') { e.result = moto.moto.map(e => CalculateReports.formatTime(e[2].moto)), e.local = 'ч' } })
        this.attributes.component['Моточасы'].forEach(e => { if (e.name === 'Пробег') { e.result = moto.moto.map(e => e[2].distance), e.local = 'км' } })
        this.attributes.component['Моточасы'].forEach(e => { if (e.name === 'Средние обороты двигателя') { e.result = moto.moto.map(e => e[2].mediumEngineRPM), e.local = 'об/мин' } })
        this.attributes.component['Моточасы'].forEach(e => { if (e.name === 'Максимальные обороты двигателя') { e.result = moto.moto.map(e => e[2].maxEngineRPM), e.local = 'об/мин' } })
        this.attributes.component['Моточасы'].forEach(e => { if (e.name === 'Потрачено по ДУТ') { e.result = moto.moto.map(e => e[2].rashodDUT), e.local = 'л' } })
        this.attributes.component['Моточасы'].forEach(e => { if (e.name === 'Средний расход по ДУТ на 100км') { e.result = moto.moto.map(e => e[2].rashodDUTKM), e.local = 'л' } })
        this.attributes.component['Моточасы'].forEach(e => { if (e.name === 'Начальный уровень топлива') { e.result = moto.moto.map(e => e[0].oil), e.local = 'л' } })
        this.attributes.component['Моточасы'].forEach(e => { if (e.name === 'Конечный уровень топлива') { e.result = moto.moto.map(e => e[1].oil), e.local = 'л' } })

        this.attributes.component['Простои на холостом ходу'].forEach(e => { if (e.name === 'Начало') { e.result = prostoy.map(e => CalculateReports.converterTimes(e[0].time)), e.local = '' } })
        this.attributes.component['Простои на холостом ходу'].forEach(e => { if (e.name === 'Начальное положение') { e.result = prostoy.map(e => e[0].geo), e.local = '' } })
        this.attributes.component['Простои на холостом ходу'].forEach(e => { if (e.name === 'Конец') { e.result = prostoy.map(e => CalculateReports.converterTimes(e[1].time)), e.local = '' } })
        this.attributes.component['Простои на холостом ходу'].forEach(e => { if (e.name === 'Конечное положение') { e.result = prostoy.map(e => e[1].geo), e.local = '' } })
        this.attributes.component['Простои на холостом ходу'].forEach(e => { if (e.name === 'Моточасы') { e.result = prostoy.map(e => CalculateReports.formatTime(e[2].moto)), e.local = 'ч' } })
        this.attributes.component['Простои на холостом ходу'].forEach(e => { if (e.name === 'Потрачено по ДУТ') { e.result = prostoy.map(e => e[2].rashodDUT), e.local = 'л' } })
        this.attributes.component['Простои на холостом ходу'].forEach(e => { if (e.name === 'Средний расход по ДУТ в моточасах') { e.result = prostoy.map(e => e[2].rashodDUTMCH), e.local = 'л' } })
        this.attributes.component['Простои на холостом ходу'].forEach(e => { if (e.name === 'Начальный уровень топлива') { e.result = prostoy.map(e => e[0].oil), e.local = 'л' } })
        this.attributes.component['Простои на холостом ходу'].forEach(e => { if (e.name === 'Конечный уровень топлива') { e.result = prostoy.map(e => e[1].oil), e.local = 'л' } })


        this.attributes.component['Топливо'].forEach(e => { if (e.name === 'Дата и время') { e.result = allOil.map(e => CalculateReports.converterTimes(e.time)), e.local = '' } })
        this.attributes.component['Топливо'].forEach(e => { if (e.name === 'Местоположение') { e.result = allOil.map(e => e.geo), e.local = '' } })
        this.attributes.component['Топливо'].forEach(e => { if (e.name === 'Начальный уровень топлива') { e.result = allOil.map(e => e.startOil), e.local = 'л' } })
        this.attributes.component['Топливо'].forEach(e => { if (e.name === 'Конечный уровень топлива') { e.result = allOil.map(e => e.finishOil), e.local = 'л' } })
        this.attributes.component['Топливо'].forEach(e => { if (e.name === 'Всего заправлено') { e.result = allOil.map(e => e.value), e.local = 'л' } })
        this.attributes.component['Топливо'].forEach(e => { if (e.name === 'Всего слито') { e.result = allOil.map(e => e.value2), e.local = 'л' } })

        this.attributes.component['Поездки'].forEach(e => { if (e.name === 'Начало') { e.result = traveling.map(e => CalculateReports.converterTimes(e[0].time)), e.local = '' } })
        this.attributes.component['Поездки'].forEach(e => { if (e.name === 'Начальное положение') { e.result = traveling.map(e => e[0].geo), e.local = '' } })
        this.attributes.component['Поездки'].forEach(e => { if (e.name === 'Конец') { e.result = traveling.map(e => CalculateReports.converterTimes(e[1].time)), e.local = '' } })
        this.attributes.component['Поездки'].forEach(e => { if (e.name === 'Конечное положение') { e.result = traveling.map(e => e[1].geo), e.local = '' } })
        this.attributes.component['Поездки'].forEach(e => { if (e.name === 'Длительность') { e.result = traveling.map(e => CalculateReports.formatTime(e[2].time)), e.local = 'ч' } })
        this.attributes.component['Поездки'].forEach(e => { if (e.name === 'Пробег') { e.result = traveling.map(e => e[2].distance), e.local = 'км' } })
        this.attributes.component['Поездки'].forEach(e => { if (e.name === 'Средняя скорость') { e.result = traveling.map(e => e[2].averageSpeed), e.local = 'км/ч' } })
        this.attributes.component['Поездки'].forEach(e => { if (e.name === 'Максимальная скорость') { e.result = traveling.map(e => e[2].maxSpeed), e.local = 'км/ч' } })

        this.attributes.component['Стоянки'].forEach(e => { if (e.name === 'Начало') { e.result = parkings.map(e => CalculateReports.converterTimes(e.time)), e.local = '' } })
        this.attributes.component['Стоянки'].forEach(e => { if (e.name === 'Длительность') { e.result = parkings.map(e => CalculateReports.formatTime(e.diff)), e.local = 'ч' } })
        this.attributes.component['Стоянки'].forEach(e => { if (e.name === 'Положение') { e.result = parkings.map(e => e.geo), e.local = '' } })

        this.attributes.component['Остановки'].forEach(e => { if (e.name === 'Начало') { e.result = stops.map(e => CalculateReports.converterTimes(e.time)), e.local = '' } })
        this.attributes.component['Остановки'].forEach(e => { if (e.name === 'Длительность') { e.result = stops.map(e => CalculateReports.formatTime(e.diff)), e.local = 'ч' } })
        this.attributes.component['Остановки'].forEach(e => { if (e.name === 'Положение') { e.result = stops.map(e => e.geo), e.local = '' } })


        this.attributes.component['СКДШ'].forEach(e => { if (e.name === 'Колесо') { e.result = skdsh.map(e => e.sensor), e.local = '' } })
        this.attributes.component['СКДШ'].forEach(e => { if (e.name === 'Ожидание') { e.result = skdsh.map(e => e.intervals.intervals.potery.totalTime), e.local = '' } })
        this.attributes.component['СКДШ'].forEach(e => { if (e.name === 'Низкое') { e.result = skdsh.map(e => e.intervals.intervals.belowKnd.totalTime), e.local = '' } })
        this.attributes.component['СКДШ'].forEach(e => { if (e.name === 'Ниже нормы') { e.result = skdsh.map(e => e.intervals.intervals.betweenKndDnn.totalTime), e.local = '' } })
        this.attributes.component['СКДШ'].forEach(e => { if (e.name === 'Нормальное') { e.result = skdsh.map(e => e.intervals.intervals.betweenDnnDvn.totalTime), e.local = '' } })
        this.attributes.component['СКДШ'].forEach(e => { if (e.name === 'Выше нормы') { e.result = skdsh.map(e => e.intervals.intervals.betweenDvnKvd.totalTime), e.local = '' } })
        this.attributes.component['СКДШ'].forEach(e => { if (e.name === 'Высокое') { e.result = skdsh.map(e => e.intervals.intervals.aboveKvd.totalTime), e.local = '' } })
        this.attributes.component['СКДШ'].forEach(e => { if (e.name === 'Всего') { e.result = skdsh.map(e => e.intervals.all.totalTime), e.local = '' } })
        this.attributes.component['СКДШ'].forEach(e => { if (e.name === 'Минимальное давление в БАР') { e.result = skdsh.map(e => e.intervals.porogy[0]), e.local = 'Бар' } })
        this.attributes.component['СКДШ'].forEach(e => { if (e.name === 'Максимальное давление в БАР') { e.result = skdsh.map(e => e.intervals.porogy[1]), e.local = 'Бар' } })
        this.attributes.component['СКДШ'].forEach(e => { if (e.name === 'Среднее давление в БАР') { e.result = skdsh.map(e => e.intervals.porogy[2]), e.local = 'Бар' } })

        return this.attributes

    }
    async getAttributesTemplates() {
        const result = await databaseService.getAttributeTemplaceToBase(this.idTemplates)
        const res = JSON.parse(result[0].jsonAttributes)
        return res
    }

    async getSetAttributesTemplates() {
        const result = await databaseService.getReportsAttribute(this.idObject)
        const res = JSON.parse(result[0].jsonsetAttribute)
        return res
    }
    async getDataGlobalStor() {
        const arrayColumns = ['last_valid_time', 'lift', 'liftBoolean', 'speed', 'lat', 'lon', 'engineOn', 'pwr', 'oil', 'summatorOil', 'mileage', 'sats', 'engine']
        const result = await databaseService.getParamsToPressureAndOilToBase(String(this.interval[0]), String(this.interval[1]), this.idObject, arrayColumns, 0)
        result.sort((a, b) => {
            return new Date(b.last_valid_time) - new Date(a.last_valid_time);
        });
        return result
    }
}



module.exports = {
    ReportsControllClass
}