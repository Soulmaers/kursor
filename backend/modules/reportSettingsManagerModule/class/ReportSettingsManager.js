const { StorDefaultSettings } = require('./StorDefaultSettings')
const { JobToBase } = require('./JobToBase')

class ReportSettingsManager {
    constructor(id, typeIndex, data) {
        this.id = id
        this.typeIndex = typeIndex
        this.data = data

        this.stor = [
            { type: 'Экскаватор', typeIndex: 10 },
            { type: 'Бульдозер', typeIndex: 10 },
            { type: 'Фронтальный погрузчик', typeIndex: 10 },
            { type: 'Экскаватор-погрузчик', typeIndex: 10 },
            { type: 'Трактор', typeIndex: 11 },
            { type: 'Каток', typeIndex: 11 },
            { type: 'Кран', typeIndex: 20 },
            { type: 'Манипулятор', typeIndex: 20 },
            { type: 'Газель', typeIndex: 30 },
            { type: 'Фургон', typeIndex: 30 },
            { type: 'Легковой автомобиль', typeIndex: 30 },
            { type: 'Фура', typeIndex: 30 },
            { type: 'Самосвал', typeIndex: 30 },
            { type: 'Бетономешалка', typeIndex: 40 },
            { type: 'Бензовоз', typeIndex: 40 },
            { type: 'Миксер', typeIndex: 40 },
            { type: 'ЖКХ', typeIndex: 50 },
            { type: 'Другое', typeIndex: 60 }

        ]
    }


    findIndex() {
        const found = this.stor.find(e => e.type === this.typeIndex);
        this.index = found ? found.typeIndex : null;
    }
    async setSettings() { //сохраняем данные
        this.findIndex()
        this.struktura = StorDefaultSettings.controllTypeIndexContent(this.index)
        const result = await JobToBase.setToBaseSettings(this.id, JSON.stringify(this.struktura))
        return result
    }


    async updateSettingsDefault() {
        this.findIndex()
        this.struktura = StorDefaultSettings.controllTypeIndexContent(this.index)
        const result = await JobToBase.updateSettingsDefaultToBase(this.id, JSON.stringify(this.struktura))
        return result
    }
    async updateSettings() { // обновляем данные
        console.log(this.data)
        const result = await JobToBase.updateAttributes(this.id, this.data)
        return result
    }

    async getSettings() { // отдаем текущие настройки
        return await JobToBase.getSettingsToBase(this.id)
    }
}

module.exports = { ReportSettingsManager }