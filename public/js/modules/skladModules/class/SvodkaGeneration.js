

import { convertTime } from '../../helpersFunc.js'
import { ContentGeneration } from '../html/content.js'
import { indexSpeedObject, objectDiscription } from '../html/stor.js'


export class SvodkaGeneration {
    constructor(data, interval, info, container, wheel) {
        this.data = data
        this.interval = interval
        this.info = info
        this.container = container
        this.wheel = wheel
        this.init()
    }


    init() {
        console.log(this.data)
        this.clearRows()
        this.formatTineUnix()
        this.addActualData()
        this.proparation()
        this.addStruktura()
        if (this.structura.length === 0) return
        const content = this.calcilator()
        console.log(content)
        this.createTableContent(content)
    }

    clearRows() {
        const rows = this.container.querySelectorAll('.row_stata');
        rows.forEach(e => e.remove());
        const list_discription = this.container.querySelectorAll('.list_discription');
        list_discription.forEach(e => e.remove());
    }
    proparation() {
        const res = this.actualArray.reduce((acc, obj) => {
            const key = `${obj.idObject}-${obj.params}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {});
        this.groupedData = Object.values(res);
    }

    createTableContent(content) {
        const tables = this.container.querySelectorAll('.table_stata');
        const description = this.container.querySelectorAll('.description_wheel');
        const table1 = tables[0];
        const table2 = tables[1];
        const description1 = description[0];
        const description2 = description[1];
        // Извлечение данных
        const intervals = Object.entries(content.intervals);
        const speeding = Object.entries(content.speeding);

        // Функция для создания строки таблицы
        const createRow = (data, table) => {
            const tr = document.createElement('tr');
            tr.classList.add('row_stata');
            data.forEach(value => {
                const td = document.createElement('td');
                td.classList.add('cel', 'celValue');
                td.textContent = value;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        };

        // Создание строк таблицы для первой таблицы (интервалы)
        createRow(intervals.map(([_, interval]) => interval.totalTime), table1);
        createRow(intervals.map(([_, interval]) => interval.totalMileage), table1);
        description1.innerHTML = ContentGeneration.renderDiscription(this.condition)
        // Создание строк таблицы для второй таблицы (скорости)
        createRow(speeding.map(([_, speed]) => speed.totalTime), table2);
        createRow(speeding.map(([_, speed]) => speed.totalMileage), table2);
        description2.innerHTML = ContentGeneration.renderDiscription(this.speed)
    }

    calcilator() {
        const indexSpeed = indexSpeedObject[this.wheel.index_speed];
        const result = this.structura.map(sensor => ({
            intervals: this.processSensor(sensor[0], Number(sensor[0].bar.knd), Number(sensor[0].bar.kvd), Number(sensor[0].bar.dnn), Number(sensor[0].bar.dvn)),
            speeding: this.processSpeed(sensor[0], indexSpeed)
        }));
        // Функция для расчета общего времени и пробега
        const calculateTotalTimeAndMileage = (intervals) => {
            let totalTimeAll = 0;
            let totalMileageAll = 0;

            const resultIntervals = {};

            Object.keys(intervals).forEach(category => {
                const total = intervals[category].reduce((acc, interval) => {
                    const intervalTime = interval.end - interval.start;
                    const intervalMileage = interval.mileage;

                    return { totalTime: acc.totalTime + intervalTime, mileageInterval: acc.mileageInterval + intervalMileage };
                }, { totalTime: 0, mileageInterval: 0 });

                totalTimeAll += total.totalTime;
                totalMileageAll += total.mileageInterval;

                resultIntervals[category] = {
                    totalTime: total.totalTime !== 0 ? total.totalTime : 0,//convertTime(total.totalTime)
                    totalMileage: total.mileageInterval !== 0 ? total.mileageInterval : 0//`${total.mileageInterval} км`
                };
            });
            resultIntervals.all = {
                totalTime: totalTimeAll !== 0 ? totalTimeAll : '-',//convertTime(totalTimeAll) 
                totalMileage: totalMileageAll !== 0 ? totalMileageAll : '-'//`${totalMileageAll} км` 
            };

            return resultIntervals;
        };

        // Применение функции для расчета общего времени и пробега
        const resultWithDurations = result.map(sensor => {
            sensor.intervals = calculateTotalTimeAndMileage(sensor.intervals);
            sensor.speeding = calculateTotalTimeAndMileage(sensor.speeding);
            return sensor;
        });


        // Инициализация итоговой структуры
        const groupedResults = {
            intervals: {},
            speeding: {}
        };

        // Суммирование данных по категориям для intervals и speeding
        resultWithDurations.forEach(sensor => {
            const { intervals, speeding } = sensor;

            // Суммирование для intervals
            Object.keys(intervals).forEach(category => {
                if (!groupedResults.intervals[category]) {
                    groupedResults.intervals[category] = {
                        totalTime: 0,
                        totalMileage: 0
                    };
                }
                groupedResults.intervals[category].totalTime += intervals[category].totalTime;
                groupedResults.intervals[category].totalMileage += intervals[category].totalMileage;
            });

            // Суммирование для speeding
            Object.keys(speeding).forEach(category => {
                if (!groupedResults.speeding[category]) {
                    groupedResults.speeding[category] = {
                        totalTime: 0,
                        totalMileage: 0
                    };
                }
                groupedResults.speeding[category].totalTime += speeding[category].totalTime;
                groupedResults.speeding[category].totalMileage += speeding[category].totalMileage;
            });
        });

        // Форматирование итоговых данных
        Object.keys(groupedResults.intervals).forEach(category => {
            groupedResults.intervals[category] = {
                totalTime: groupedResults.intervals[category].totalTime ? convertTime(groupedResults.intervals[category].totalTime) : '-',
                totalMileage: groupedResults.intervals[category].totalMileage ? `${groupedResults.intervals[category].totalMileage} км` : '-'
            };
        });

        Object.keys(groupedResults.speeding).forEach(category => {
            groupedResults.speeding[category] = {
                totalTime: groupedResults.speeding[category].totalTime ? convertTime(groupedResults.speeding[category].totalTime) : '-',
                totalMileage: groupedResults.speeding[category].totalMileage ? `${groupedResults.speeding[category].totalMileage} км` : '-'
            };
        });
        return groupedResults;
    }

    processSpeed(sensorData, indexSpeed) {
        let intervals = {
            norma: [],
            speeding: []
        };
        let currentCategory = null;
        let intervalStart = null;
        let startMileage = null;

        sensorData.val.forEach((point, index) => {
            const time = new Date(point.dates).getTime() / 1000;
            const isMovingAndStopSignal = point.speed > 0 && point.dvs === 1;
            let category = null;
            if (isMovingAndStopSignal) {
                if (point.speed <= indexSpeed) {
                    category = 'norma';
                    this.speed = 'speeding'
                } else {

                    category = 'speeding';
                }
                if (category && (category !== currentCategory || intervalStart === null)) {
                    if (intervalStart !== null) {
                        intervals[currentCategory].push({
                            start: intervalStart,
                            end: time,
                            mileage: startMileage !== null ? point.mileage - startMileage : 0
                        });
                    }
                    intervalStart = time;
                    startMileage = point.mileage;
                    currentCategory = category;
                }
            } else if (intervalStart !== null) {
                intervals[currentCategory].push({
                    start: intervalStart,
                    end: time,
                    mileage: startMileage !== null ? point.mileage - startMileage : 0
                });
                intervalStart = null;
                startMileage = null;
                currentCategory = null;
            }

            if (index === sensorData.val.length - 1 && intervalStart !== null) {
                intervals[currentCategory].push({
                    start: intervalStart,
                    end: time,
                    mileage: startMileage !== null ? point.mileage - startMileage : 0
                });
            }
        });

        return intervals;
    }
    processSensor(sensorData, knd, kvd, dnn, dvn) {
        let intervals = {
            potery: [],
            belowKnd: [],
            betweenKndDnn: [],
            betweenDnnDvn: [],
            betweenDvnKvd: [],
            aboveKvd: []
        };

        let currentCategory = null;
        let intervalStart = null;
        let startMileage = null;

        sensorData.val.forEach((point, index) => {
            const time = new Date(point.dates).getTime() / 1000;
            const isMovingAndStopSignal = point.speed > 0 && point.dvs === 1;
            let category = null;
            if (isMovingAndStopSignal) {
                if (point.value === -0.1) {
                    category = 'potery';
                } else if (point.value >= 0 && point.value <= knd) {
                    category = 'belowKnd';
                } else if (point.value > knd && point.value <= dnn) {
                    category = 'betweenKndDnn';
                } else if (point.value > dnn && point.value < dvn) {
                    category = 'betweenDnnDvn';
                } else if (point.value >= dvn && point.value < kvd) {
                    category = 'betweenDvnKvd';
                } else if (point.value >= kvd) {
                    category = 'aboveKvd';
                }

                if (category && (category !== currentCategory || intervalStart === null)) {
                    if (intervalStart !== null) {
                        intervals[currentCategory].push({
                            start: intervalStart,
                            end: time,
                            mileage: startMileage !== null ? point.mileage - startMileage : 0
                        });
                    }
                    intervalStart = time;
                    startMileage = point.mileage;
                    currentCategory = category;
                }
            } else if (intervalStart !== null) {
                intervals[currentCategory].push({
                    start: intervalStart,
                    end: time,
                    mileage: startMileage !== null ? point.mileage - startMileage : 0
                });
                intervalStart = null;
                startMileage = null;
                currentCategory = null;
            }

            if (index === sensorData.val.length - 1 && intervalStart !== null) {
                intervals[currentCategory].push({
                    start: intervalStart,
                    end: time,
                    mileage: startMileage !== null ? point.mileage - startMileage : 0
                });
            }
        });

        // Вычисление high
        const high = this.calculateTotalMileage(intervals.betweenDvnKvd) + this.calculateTotalMileage(intervals.aboveKvd);
        // Вычисление low
        const low = this.calculateTotalMileage(intervals.betweenKndDnn) + this.calculateTotalMileage(intervals.belowKnd);
        // Установка значения this.condition
        this.condition = high > low ? 'pressureHigh' : 'pressureLow';
        return intervals;
    }

    // Функция для вычисления суммарного пробега по массиву интервалов
    calculateTotalMileage = (intervals) => {
        return intervals.reduce((acc, e) => acc + e.mileage, 0);
    };

    addStruktura() {
        this.structura = this.groupedData.map(elemGroup => {
            const idObject = elemGroup[0].idObject;
            const celevoy = this.info.find(e => e[4] == idObject);
            const [, tyres, params, osibar] = celevoy;
            // Преобразование массива osss в объект для быстрого доступа
            const osssMap = {};
            osibar.result.forEach(e => {
                osssMap[e.idOs] = e;
            });
            // Фильтрация и преобразование параметров для конкретного elem.params
            const paramnew = tyres.result.map(el => {
                if (el.pressure !== elemGroup[0].params) return null; // Отфильтровываем по параметру

                if (osssMap[el.osNumber]) {
                    const sens = params.result.find(it => Object.values(it).includes(el.pressure));
                    if (!sens) return null;
                    return {
                        sens: sens.sens,
                        position: Number(el.tyresdiv),
                        parametr: el.pressure,
                        bar: osssMap[el.osNumber],
                        val: elemGroup.map(elm => ({
                            dates: new Date(Number(elm.time) * 1000),
                            speed: Number(elm.speed),
                            value: Number(elm.value),
                            mileage: Number(elm.mileage),
                            dvs: Number(elm.dvs)
                        }))
                    };
                }
                return null;
            }).filter(el => el !== null);
            paramnew.sort((a, b) => a.position - b.position);
            paramnew.forEach(e => e.val.sort((a, b) => a.dates - b.dates));
            return paramnew;
        })
        console.log(this.structura)
    }




    addActualData() {
        if (this.time.length === 1) {
            this.actualArray = this.data.filter(e => Number(e.time) <= this.time[0])
        }
        else {
            this.actualArray = this.data.filter(e => Number(e.time) >= this.time[0] && Number(e.time) <= this.time[1])
        }
    }

    formatTineUnix() {
        this.time = this.interval.map(e => {
            const [day, month, year] = e.split("-");
            const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
            const unixTime = Math.floor(date.getTime() / 1000);
            return unixTime
        })

    }
}