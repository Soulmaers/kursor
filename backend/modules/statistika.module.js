const databaseService = require('../services/database.service');
const helpers = require('../helpers.js')

class SummaryStatistiks {
    constructor(object) {
        this.object = object
        this.strustura = {}
        this.data = '-'
        this.id = '-'
        this.nameCar = '-'
        this.probeg = '-'
        this.zapravka = '-'
        this.rashod = '-'
    }

    async init() {
        const idwArray = helpers.format(this.object)        // Запускаем все асинхронные операции одновременно и ждем их завершения
        const dataPromises = idwArray.map(el => this.getSensorsAndParametrs(el[0], el[el.length - 1]));
        const dataResults = await Promise.allSettled(dataPromises);
        // Обрабатываем результаты асинхронных операций
        const strusturas = idwArray.map(([id, message, group, pref], index) => {
            const result = dataResults[index];
            const data = result.status === 'fulfilled' ? result.value : null;
            // Инициализация структуры объекта с дефолтными значениями
            const strustura = this.initializeStrustura(id, message, group, 'Тест');
            if (data) {
                this.fillStrusturaWithData(strustura, data, pref);
            }
            return strustura;
        })
        // Объединение всех strustura в один объект
        this.strustura = Object.assign({}, ...strusturas.map(s => ({ [s.id]: s })));
        return this.strustura;
    }

    fillStrusturaWithData(strustura, data, pref) {
        const mileg = data.some(it => it.params === 'mileage' && it.value.length !== 0);
        if (mileg) {
            this.probeg = this.calculationMileage(data);
            strustura.probeg = this.probeg;
            strustura.job = this.calculationJobTs(data);

        }
        const oil = data.some(it => it.params === 'oil' && it.value.length !== 0);
        if (oil && pref !== 'kursor') {
            const [rashod, zapravka] = this.calculationOil(data);
            strustura.rashod = rashod;
            strustura.zapravka = zapravka;
            strustura.medium = this.calculationMedium(rashod);
        }
        const engineOn = data.some(it => it.params === 'engineOn' && it.value.length !== 0)
        if (engineOn) {
            const engineOn = data.filter(it => it.params === 'engineOn').map(it => it);
            const prostoys = this.calculateDuration(engineOn, 'prostoy');
            strustura.prostoy = prostoys !== undefined ? prostoys : 0;
            const motos = this.calculateDuration(engineOn, 'motos');
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
        let probegZero = 0
        let probegNow = 0;
        if (arrayValue.value.length !== 0) {
            if (Number(arrayValue.value[arrayValue.value.length - 1].toFixed(0)) === 0) {
                for (let i = arrayValue.value.length - 1; i >= 0; i--) {
                    if (Number(arrayValue.value[i].toFixed(0)) !== 0) {
                        probegNow = Number(arrayValue.value[i].toFixed(0));
                        break;
                    }
                }
            } else {
                probegNow = Number(arrayValue.value[arrayValue.value.length - 1].toFixed(0));
            }
            if (Number(arrayValue.value[0].toFixed(0)) === 0) {
                for (let i = 0; i <= arrayValue.value.length - 1; i++) {
                    if (Number(arrayValue.value[i].toFixed(0)) !== 0) {
                        if (this.id == 27472317) {
                            probegZero = 373134
                        }
                        else {
                            probegZero = Number(arrayValue.value[i].toFixed(0));
                        }
                        break;
                    }
                }
            } else {
                probegZero = Number(arrayValue.value[0].toFixed(0));
            }
        }

        const probegDay = probegNow - probegZero < 0 ? 0 : probegNow - probegZero;
        return probegDay
    }


    quickly(data) {
        data.sort((a, b) => a.time - b.time); // Упрощённая сортировка
        const allsens = {
            time: [],
            speed: [],
            sats: [],
            geo: [],
            oil: [],
            mileage: [],
            engine: [],
            pwr: [],
            engineOn: []
        };
        for (let i = 0; i < data.length; i++) {
            const el = data[i];
            const timestamp = Number(el.data);
            allsens.time.push(new Date(timestamp * 1000)); // Напрямую создаём Date
            allsens.speed.push(parseInt(el.speed)); // Предполагаем, что el.speed уже число
            allsens.sats.push(parseInt(el.sats));
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
            sens: key, // Название сенсора
            params: key, // Параметры
            value: allsens[key] // Значения
        }));
        return datas
    }
    async getSensorsAndParametrs(el) {
        const interval = helpers.timefn()
        const timeOld = interval[1]
        const timeNow = interval[0]
        const itognew = await helpers.getDataToInterval(el, timeOld, timeNow)
        const alt = this.quickly(itognew)
        return alt
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
        return [Number(rashod.toFixed(1)), Number(zapravleno.toFixed(1))]
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

const popupProstoy = async (array) => {
    const arrays = helpers.format(array)
    const [timeNow, timeOld] = helpers.timefn()

    const processArrayItem = async (e) => {
        const [active, group, name] = e
        const newGlobal = await helpers.getDataToInterval(active, timeOld, timeNow)
        newGlobal.sort((a, b) => a.time - b.time)

        const resnew = await prostoyNew(newGlobal)
        if (resnew) {
            for (const el of resnew) {
                const map = JSON.parse(el[1][1]);
                const timesProstoy = timesFormat(Number(el[1][0]) - Number(el[0][0]));
                const formattedDate = new Date(Number(el[0][0]) * 1000).toLocaleString(); // Упрощенное форматирование даты
                const data = [{
                    event: `Простой`, group: `Компания: ${group}`,
                    name: `Объект: ${name}`,
                    time: `Дата начала простоя: ${formattedDate}`, alarm: `Время простоя: ${timesProstoy}`
                }];
                const newTime = Math.floor(new Date().getTime() / 1000);
                const delta = newTime - Number(el[1][0]);

                if (delta > 900) {
                    await databaseService.controllerSaveToBase(data, active, map, group, name);
                }
            }
        }
    }
    await Promise.all(arrays.map(e => processArrayItem(e)))
}

function timesFormat(dates) {
    const totalSeconds = Math.floor(dates);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    const motoHours = `${hours}:${minutes}`;
    return motoHours;
}


async function prostoyNew(newdata) {
    if (newdata.length === 0) {
        return undefined
    }
    else {
        const res = newdata.reduce((acc, e) => {
            if (Number(e.engineOn) === 1 && e.speed === 0 && e.sats > 4) {
                if (Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length > 0
                    && acc[acc.length - 1][0].engineOn === 1 && acc[acc.length - 1][0].speed === 0 && acc[acc.length - 1][0].sats > 4) {
                    acc[acc.length - 1].push(e);
                } else {
                    acc.push([e]);
                }
            } else if (Number(e.engineOn) === 0 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0
                || e.speed > 0 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0
                || e.sats <= 4 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0) {
                acc.push([]);
            }

            return acc;
        }, []).filter(el => el.length > 0).reduce((acc, el) => {
            if (Number(el[el.length - 1].data) - Number(el[0].data) > 1200) {
                acc.push([[el[0].data, [el[0].lat, el[0].lon], el[0].oil], [el[el.length - 1].data, [el[el.length - 1].lat, el[el.length - 1].lon], el[el.length - 1].oil]])
            }
            return acc
        }, [])
        return res
    }

}

module.exports = {
    SummaryStatistiks,
    popupProstoy
}