const databaseService = require('../services/database.service');
const { HelpersDefault } = require('../services/HelpersDefault.js')
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
            if (data) {
                // Обновляем глобальное состояние
                global.summaryStatisticsState.lastUpdateTime = this.lastUpdateTime;
                global.summaryStatisticsState.dailyDataStorage = this.dailyDataStorage;

                // Инициализация структуры объекта с дефолтными значениями
                const strustura = this.initializeStrustura(el[0], el[1], el[2], 'Тест'); // Подготовка шаблона структуры объекта
                this.fillStrusturaWithData(strustura, data, el[3]); // Наполнение структуры объекта

                // Добавляем strustura в массив
                strusturas.push(strustura);
            }
        }

        //console.log(strusturas)
        console.timeEnd('sum')
        // Объединение всех strustura в один объект
        this.strustura = Object.assign({}, ...strusturas.map(s => ({ [s.id]: s })));
        const arraySummary = Object.entries(this.strustura)
        //  console.log(arraySummary)
        const now = new Date();
        const date = new Date(now);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const datas = `${year}-${month}-${day}`;
        await Promise.all(arraySummary.map(([idw, arrayInfo]) =>
            databaseService.summaryToBase(idw, arrayInfo, datas)
        ));
    }

    fillStrusturaWithData(strustura, data, pref) {
        const mileg = data.some(it => it.params === 'mileage' && it.value.length !== 0);
        if (mileg) {
            this.probeg = this.calculationMileage(data); //получение статистики по пробегу
            strustura.probeg = this.probeg;
            strustura.job = this.calculationJobTs(data); //получение статистики по объектам в работе
        }
        const oil = data.some(it => it.params === 'oil' && it.value.length !== 0);
        if (oil && pref !== 'kursor') {
            const [rashod, zapravka] = this.calculationOil(data); //получение статистики по заправкам и расходам
            strustura.rashod = rashod;
            strustura.zapravka = zapravka;
            strustura.medium = this.calculationMedium(rashod); //получение статистики по среднему расходу
        }
        const engineOn = data.some(it => it.params === 'engineOn' && it.value.length !== 0)
        if (engineOn) {
            const engineOn = data.filter(it => it.params === 'engineOn').map(it => it);
            const prostoys = this.calculateDuration(engineOn, 'prostoy'); //получение статистики по простоям
            strustura.prostoy = prostoys !== undefined ? prostoys : 0;
            const motos = this.calculateDuration(engineOn, 'motos'); //получение статистики по времени работы
            strustura.moto = motos !== undefined ? motos : 0;
        }
        else {
            strustura.moto = 0
            strustura.prostoy = 0
        }
    }


    initializeStrustura(id, nameCar, group, type) {
        return { id, ts: 1, nameCar, group, type, probeg: '-', job: '-', rashod: '-', zapravka: '-', medium: '-', moto: '-', prostoy: '-' };
    }

    calculationMedium(rashod) {
        let medium;
        if (this.probeg !== 0 && this.probeg !== '-') {
            medium = Number(((rashod / this.probeg) * 100).toFixed(0))
        }
        else {
            medium = '-'
        }
        return medium
    }
    calculationJobTs() {
        if (this.probeg > 5) {
            return 1
        } else {
            return 0
        }
    }
    calculationMileage(data) {
        const arrayValue = data.find(it => it.params === 'mileage');
        if (arrayValue.value.length !== 0) {
            function processSensor(sensorData) {
                let totalMileage = 0;
                let previousMileage = sensorData.value.find(val => val !== 0); // Начальное значение пробега, не равное 0

                sensorData.value.forEach((point, index) => {
                    if (sensorData.dvs[index] === 1 && sensorData.speed[index] > 0) {
                        let currentMileage = point;

                        // Пропускаем значения currentMileage, равные 0, и берем предыдущее значение, не равное 0
                        if (currentMileage === 0) {
                            for (let i = index - 1; i >= 0; i--) {
                                if (sensorData.value[i] !== 0) {
                                    currentMileage = sensorData.value[i];
                                    break;
                                }
                            }
                        }
                        // Пропускаем значения previousMileage, равные 0, и берем следующее значение, не равное 0
                        if (previousMileage === 0) {
                            for (let i = index; i < sensorData.value.length; i++) {
                                if (sensorData.value[i] !== 0) {
                                    previousMileage = sensorData.value[i];
                                    break;
                                }
                            }
                        }

                        // Вычисление пробега
                        totalMileage += currentMileage - previousMileage;
                        previousMileage = currentMileage; // Обновляем предыдущее значение пробега
                    }
                });

                return totalMileage; // Возвращает общий пробег
            }

            const result = processSensor(arrayValue);
            return parseInt(result);
        }
    }

    quickly(data) {
        data.sort((a, b) => Number(a.last_valid_time) - Number(b.last_valid_time)); // Упрощённая сортировка
        const allsens = {
            time: [],
            speed: [],
            sats: [],
            geo: [],
            oil: [],
            mileage: [],
            engine: [],
            pwr: [],
            engineOn: [],
            dvs: []
        };
        for (let i = 0; i < data.length; i++) {
            const el = data[i];
            const timestamp = Number(el.last_valid_time);
            allsens.time.push(new Date(timestamp * 1000)); // Напрямую создаём Date
            allsens.speed.push(parseInt(el.speed)); // Предполагаем, что el.speed уже число
            allsens.sats.push(parseInt(el.sats));
            allsens.dvs.push(parseInt(el.engineOn));
            allsens.geo.push([parseFloat(el.lat), parseFloat(el.lon)]);
            el.oil !== null && el.oil !== 'Н/Д' ? allsens.oil.push(Number(Number(el.oil).toFixed(0))) : null;
            el.mileage !== null && el.mileage !== 'Н/Д' ? allsens.mileage.push(Number(Number(el.mileage).toFixed(1))) : null;
            el.engine !== null && el.engine !== 'Н/Д' ? allsens.engine.push(parseInt(el.engine)) : null;
            el.pwr !== null && el.pwr !== 'Н/Д' ? allsens.pwr.push(Number(Number(el.pwr).toFixed(1))) : null;
            el.engineOn !== null && el.engineOn !== 'Н/Д' ? allsens.engineOn.push(parseInt(el.engineOn)) : null;
        }
        const datas = Object.keys(allsens).map(key => ({
            time: allsens.time,
            speed: allsens.speed,
            sats: allsens.sats,
            geo: allsens.geo,
            dvs: allsens.dvs,
            sens: key, // Название сенсора
            params: key, // Параметры
            value: allsens[key] // Значения
        }));
        return datas
    }

    async getSensorsAndParametrs(id) {
        const currentTime = Date.now();
        let itognew = [];
        if (this.lastUpdateTime < currentTime) {
            itognew = await HelpersDefault.getDataToInterval(id, Math.floor(this.lastUpdateTime / 1000), Math.floor(currentTime / 1000));

            this.dailyDataStorage[id] = this.dailyDataStorage[id] ? [...this.dailyDataStorage[id], ...itognew] : itognew;
            this.lastUpdateTime = currentTime;
        }

        const alt = this.quickly(this.dailyDataStorage[id] || []);
        return alt;
    }


    calculationOil(data) {
        const arrayValue = data.find(it => (it.params === 'oil'))
        if (arrayValue && Array.isArray(arrayValue.value)) {
            arrayValue.value = arrayValue.value.map(element => {
                return element;
            });
        }
        let i = 0;
        const newData = JSON.parse(JSON.stringify(arrayValue));
        while (i < newData.value.length - 1) {
            if (newData.value[i] === newData.value[i + 1]) {
                newData.value.splice(i, 1);
                newData.time.splice(i, 1);
                newData.speed.splice(i, 1);
                newData.sats.splice(i, 1);
                newData.geo.splice(i, 1)
            } else {
                i++;
            }
        }
        const increasingIntervals = [];
        let start = 0;
        let end = 0;
        for (let i = 0; i < arrayValue.value.length - 1; i++) {
            const currentObj = arrayValue.value[i];
            const nextObj = arrayValue.value[i + 1];
            const div = (arrayValue.time[i + 1].getTime() / 1000) - (arrayValue.time[i].getTime() / 1000)
            if (currentObj < nextObj) {
                if (start === end) {
                    start = i;
                }
                end = i + 1;
            } else if (currentObj > nextObj) {
                if (start !== end) {
                    increasingIntervals.push([[arrayValue.value[start], arrayValue.time[start], arrayValue.geo[start]], [arrayValue.value[end], arrayValue.time[end], arrayValue.geo[end]]]);
                }
                start = end = i + 1;
            }
        }
        if (start !== end) {
            increasingIntervals.push([[arrayValue.value[start], arrayValue.time[start], arrayValue.geo[start]], [arrayValue.value[end], arrayValue.time[end], arrayValue.geo[end]]]);
        }
        const zapravka = increasingIntervals.filter((interval, index) => {
            const firstOil = interval[0][0];
            const lastOil = interval[interval.length - 1][0];
            const difference = lastOil - firstOil;
            const threshold = firstOil * 0.15;
            if (index < increasingIntervals.length - 1) {
                const nextInterval = increasingIntervals[index + 1];
                const currentTime = interval[interval.length - 1][1];
                const nextTime = nextInterval[0][1];
                const timeDifference = nextTime - currentTime;
                if (timeDifference < 5 * 60 * 1000) {
                    interval.push(nextInterval[nextInterval.length - 1]);
                    interval.splice(1, 1)
                }
            }
            return firstOil > 5 && difference > 60 && difference >= threshold;
        });
        for (let i = 0; i < zapravka.length - 1; i++) {
            const time0 = zapravka[i][0][1]
            const time1 = zapravka[i][1][1]
            const initTime = time1 - time0
            if (zapravka[i][1][1] === zapravka[i + 1][1][1]) {
                zapravka.splice(i + 1, 1);
            }
        }
        const filteredZapravka = zapravka.filter(e => {
            const time0 = e[0][1];
            const time1 = e[1][1];
            const initTime = time1 - time0;
            return initTime >= 5 * 60 * 1000;
        });
        const rash = [];
        const firstData = arrayValue.value[0];
        const lastData = arrayValue.value[arrayValue.value.length - 1];
        if (filteredZapravka.length !== 0) {
            rash.push(firstData - filteredZapravka[0][0][0]);
            for (let i = 0; i < filteredZapravka.length - 1; i++) {
                rash.push(filteredZapravka[i][1][0] - filteredZapravka[i + 1][0][0]);
            }
            rash.push(filteredZapravka[filteredZapravka.length - 1][1][0] - lastData);
        }
        else {
            rash.push(firstData - lastData >= 0 ? firstData - lastData : 0)
        }
        const rashod = rash.reduce((el, acc) => el + acc, 0) < 0 ? '-' : rash.reduce((el, acc) => el + acc, 0)
        const zap = [];
        filteredZapravka.forEach(e => {
            zap.push(e[1][0] - e[0][0])
        })
        const zapravleno = zap.reduce((acc, el) => acc + el, 0) < 0 ? '-' : zap.reduce((acc, el) => acc + el, 0)
        return [rashod !== '-' ? Number(rashod.toFixed(1)) : 0, zapravleno !== '-' ? Number(zapravleno.toFixed(1)) : 0]
    }

    calculateDuration(newdata, type) {
        let totalDuration = 0;
        newdata.forEach((item) => {
            let segmentStart = null;
            for (let i = 0; i < item.time.length; i++) {
                let isActive;
                if (type === 'prostoy') {
                    // Условие для простоя: двигатель включен, скорость равна 0, количество спутников более 4
                    isActive = item.value[i] === 1 && item.speed[i] === 0 && item.sats[i] > 4;
                } else if (type === 'motos') {
                    // Условие для моточасов: двигатель включен
                    isActive = item.value[i] === 1;
                }

                if (isActive && segmentStart === null) {
                    segmentStart = item.time[i]; // Начало сегмента активности
                } else if ((!isActive || i === item.time.length - 1) && segmentStart !== null) {
                    // Конец сегмента активности или последняя точка данных
                    const segmentEnd = item.time[i] || segmentStart; // Конец сегмента или текущий момент
                    let duration = segmentEnd - segmentStart;

                    if (type === 'prostoy') {
                        duration /= 1000; // Переводим время из миллисекунд в секунды для простоев
                        if (duration > 1200) { // Только сегменты длительностью более 1200 секунд
                            totalDuration += duration;
                        }
                    } else if (type === 'motos') {
                        totalDuration += duration; // Для моточасов сохраняем миллисекунды
                    }
                    segmentStart = null;
                }
            }
        });
        return totalDuration;
    }
}


module.exports = {
    SummaryStatistiks
}