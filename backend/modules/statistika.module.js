const databaseService = require('../services/database.service');
const { HelpersDefault } = require('../services/HelpersDefault.js')
const { CalculateReports } = require('./reportsModule/class/Calculate.js')
const { OilCalculator } = require('./reportsModule/class/OilControllCalculater.js')
const { DrainCalculate } = require('./reportsModule/class/DrainControllCalculate.js')
const { JobToBase } = require('./reportSettingsManagerModule/class/JobToBase.js')
const { ProstoyControll } = require('./reportsModule/class/ProstoyControllCalculater.js')
const { Worker } = require('worker_threads');
const path = require('path');

// Предположим, у нас есть глобальное хранилище для сохранения состояния
global.summaryStatisticsState = {
    lastUpdateTime: new Date().setHours(0, 0, 0, 0), // Начало текущего дня
    dailyDataStorage: {}
};
class SummaryStatistiks {
    constructor(datas) {
        this.datas = datas
        this.strustura = {}
        this.data = '-'
        this.id = '-'
        this.nameCar = '-'
        this.probeg = '-'
        this.zapravka = '-'
        this.rashod = '-'
        this.drain = ''
        this.checkAndResetStateIfNeeded();
        this.init()
    }

    checkAndResetStateIfNeeded() {
        const currentDate = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
        // Если глобальное состояние еще не инициализировано, инициализируем его
        if (!global.summaryStatisticsState) {
            global.summaryStatisticsState = {
                lastUpdateTime: currentDate,
                dailyDataStorage: {}
            };
        }
        const lastUpdateDate = new Date(global.summaryStatisticsState.lastUpdateTime).getTime();
        // Сбрасываем хранилище данных и время обновления, если начался новый день
        if (lastUpdateDate < currentDate) {
            global.summaryStatisticsState.lastUpdateTime = currentDate;
            global.summaryStatisticsState.dailyDataStorage = {};
        }
        this.lastUpdateTime = global.summaryStatisticsState.lastUpdateTime;
        this.dailyDataStorage = global.summaryStatisticsState.dailyDataStorage;
    }

    async processDataInWorker(dataElement) {
        return new Promise((resolve, reject) => {
            const worker = new Worker(path.resolve(__dirname, '../workers/worker.js'));
            worker.on('message', (result) => {
                worker.terminate();
                resolve(result);
            });
            worker.on('error', (err) => {
                worker.terminate();
                reject(err);
            });
            worker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Worker stopped with exit code ${code}`));
                }
            });
            worker.postMessage({ id: dataElement, lastUpdateTime: this.lastUpdateTime, dailyDataStorage: this.dailyDataStorage });
        });
    }
    async init() {
        console.time('sum')
        const idwArray = HelpersDefault.formats(this.datas)
        const strusturas = []; // Создаем пустой массив для хранения результатов
        for (const el of idwArray) {
            // Обрабатываем каждый элемент последовательно
            const data = await this.processDataInWorker(el); // Получаем структуру данных
            if (data.length !== 0) {
                this.typeObject = el[4]
                // Обновляем глобальное состояние
                global.summaryStatisticsState.lastUpdateTime = this.lastUpdateTime;
                global.summaryStatisticsState.dailyDataStorage = this.dailyDataStorage;

                // Инициализация структуры объекта с дефолтными значениями
                const strustura = this.initializeStrustura(el[0], el[1], el[2], 'Тест'); // Подготовка шаблона структуры объекта
                const result = await JobToBase.getSettingsToBase(el[0])
                this.settings = JSON.parse(result[0].jsonsetAttribute)

                await this.fillStrusturaWithData(strustura, data); // Наполнение структуры объекта

                // Добавляем strustura в массив
                strusturas.push(strustura);
            }
        }


        console.timeEnd('sum')
        // Объединение всех strustura в один объект
        this.strustura = Object.assign({}, ...strusturas.map(s => ({ [s.id]: s })));
        const arraySummary = Object.entries(this.strustura)
        const now = new Date();
        const date = new Date(now);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const datas = `${year}-${month}-${day}`;
        //  console.log(this.strustura)
        await Promise.all(arraySummary.map(([idw, arrayInfo]) =>
            databaseService.summaryToBase(idw, arrayInfo, datas)
        ));
    }

    async fillStrusturaWithData(strustura, data) {
        strustura.probeg = this.calculationMileage(data); //получение статистики по пробегу
        strustura.job = strustura.probeg > 5 ? 1 : 0
        strustura.zapravka = await this.calculationOil(data, strustura); //получение статистики по заправкам и расходам
        strustura.drain = await this.calculationDrainOil(data, strustura)
        strustura.rashod = this.instance.fuelConsumption()
        strustura.moto = await this.calculateDuration(data, strustura); //получение статистики по времени работы
        strustura.prostoy = this.calculateDowntime(data, strustura); //получение статистики по времени работы
        strustura.medium = strustura.probeg !== 0 ? parseInt((strustura.rashod / strustura.probeg) * 100) : 0
    }

    initializeStrustura(id, nameCar, group, type) {
        return { id, ts: 1, nameCar, group, type, probeg: '-', job: '-', rashod: '-', zapravka: '-', drain: '', medium: '-', moto: '-', prostoy: '-' };
    }

    calculationMileage(data) {
        return parseInt(CalculateReports.calculationMileage(data) === 'Н/Д' ? 0 : CalculateReports.calculationMileage(data))
    }

    async calculationOil(data, struktura) {
        this.instance = new OilCalculator(data, this.settings, struktura.id)
        const res = await this.instance.init()
        return res ? res[0] : 0

    }
    async calculationDrainOil(data, struktura) {
        const drainInstance = new DrainCalculate(data, this.settings, struktura.id)
        const res = await drainInstance.init()
        return res ? res[0] : 0

    }

    async calculateDuration(data, id) {
        const result = await CalculateReports.moto(data, this.settings, id.id)
        return result.motoAll
    }

    calculateDowntime(data, id) {
        this.sotFunc()
        const inst = new ProstoyControll(data, this.index, this.settings, id.id)
        const result = inst.controll()
        const moto = result.reduce((acc, el) => {
            acc += acc + el[2].moto
            return acc
        }, 0)
        return result.length !== 0 ? moto : 0
    }


    sotFunc() {
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
        const found = this.stor.find(e => e.type === this.typeObject);
        this.index = found ? found.typeIndex : '';
    }
}

module.exports = {
    SummaryStatistiks
}