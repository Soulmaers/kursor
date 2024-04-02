

import { convertTime } from '../helpersFunc.js'
export class StatistikaPressure {
    constructor(data, id) {
        this.data = data
        this.id = id.id
        this.structura = null
        this.time = null
        this.init()
    }


    async init() {
        this.installTime()
        await this.getParamsToInterval()
        const content = this.calcilator()
        this.createTableContent(content)
    }


    createTableContent(content) {
        const table = document.querySelector('.table_stata')
        const rows = document.querySelectorAll('.row_stata')
        if (rows) {
            [...rows].forEach(e => {
                e.remove()
            })
        }
        content.forEach(it => {
            console.log(Object.entries(it.intervals))
            const tr = document.createElement('tr')
            tr.classList.add('row_stata')
            table.appendChild(tr)
            const td = document.createElement('td')
            td.classList.add('cel')
            td.setAttribute('rel', it.params);
            td.textContent = it.sensor
            tr.appendChild(td)
            for (let i = 0; i < Object.entries(it.intervals).length; i++) {
                const td = document.createElement('td')
                td.classList.add('cel')
                td.textContent = Object.entries(it.intervals)[i][1]
                tr.appendChild(td)
            }
        })
    }
    calcilator() {
        const result = this.structura.map(sensor => ({
            sensor: sensor.sens,
            intervals: this.processSensor(sensor, Number(sensor.bar.knd), Number(sensor.bar.kvd), Number(sensor.bar.dnn), Number(sensor.bar.dvn))
        }));
        const resultWithDurations = result.map(sensor => {
            // Инициализируем переменную для хранения суммарного времени всех интервалов
            let totalTimeAll = 0;
            // Для каждой категории интервала в каждом сенсоре рассчитываем общее время
            Object.keys(sensor.intervals).forEach(category => {
                const totalTime = sensor.intervals[category].reduce((acc, interval) => {
                    // Добавляем разницу между концом и началом интервала к аккумулятору
                    return acc + (interval.end - interval.start);
                }, 0); // Начинаем с 0
                // Накапливаем суммарное время всех интервалов
                totalTimeAll += totalTime;

                // Заменяем массив интервалов суммарным временем для данной категории
                sensor.intervals[category] = totalTime !== 0 ? convertTime(totalTime) : '-';
            });
            // Добавляем свойство all с суммарным временем всех интервалов в текущем сенсоре
            // и преобразуем его в удобочитаемый формат
            sensor.intervals.all = totalTimeAll !== 0 ? convertTime(totalTimeAll) : '-';

            return sensor;
        });
        return resultWithDurations;

    }



    processSensor(sensorData, knd, kvd, dnn, dvn) {
        // Инициализируем объект для хранения интервалов пяти категорий
        let intervals = { belowKnd: [], betweenKndDnn: [], betweenDnnDvn: [], betweenDvnKvd: [], aboveKvd: [] };
        let currentInterval = { type: null, start: null, end: null };

        sensorData.val.forEach((point, index) => {
            const time = new Date(point.dates).getTime() / 1000;
            const isMovingAndStopSignal = point.stop === 'ВКЛ' && point.speed > 4;
            let type = null;

            // Определяем тип интервала на основе значений давления
            if (isMovingAndStopSignal) {
                if (point.value <= knd) type = 'belowKnd';
                else if (point.value > knd && point.value <= dnn) type = 'betweenKndDnn';
                else if (point.value > dnn && point.value < dvn) type = 'betweenDnnDvn';
                else if (point.value >= dvn && point.value < kvd) type = 'betweenDvnKvd';
                else if (point.value >= kvd) type = 'aboveKvd';

                if (currentInterval.type === type) {
                    // Продолжаем текущий интервал
                    currentInterval.end = time;
                } else {
                    // Закрываем предыдущий интервал и начинаем новый
                    if (currentInterval.start !== null) {
                        intervals[currentInterval.type].push({ start: currentInterval.start, end: currentInterval.end });
                    }
                    currentInterval = { type: type, start: time, end: time };
                }
            } else if (currentInterval.start !== null) {
                // Закрываем текущий интервал, если условия не выполняются
                intervals[currentInterval.type].push({ start: currentInterval.start, end: currentInterval.end });
                currentInterval = { type: null, start: null, end: null };
            }

            // Проверка на конец массива для незакрытых интервалов
            if (index === sensorData.val.length - 1 && currentInterval.start !== null) {
                intervals[currentInterval.type].push({ start: currentInterval.start, end: currentInterval.end });
            }
        });

        return intervals;
    }




    async getParamsToInterval() {
        const t1 = this.time[0]
        const t2 = this.time[1]
        const idw = this.id
        const param = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ idw, t1, t2 })
        }

        const res = await fetch('/api/getDataParamsInterval', param)
        const data = await res.json()
        console.log(data)

        const [params, tyres, osibar] = this.data
        // Преобразование массива osss в объект для быстрого доступа
        const osssMap = {};
        osibar.forEach(e => {
            osssMap[e.idOs] = e;
        });
        const paramnew = tyres.map(el => {
            if (osssMap[el.osNumber]) {
                const sens = params.find(it => Object.values(it).includes(el.pressure));
                if (!sens) return
                return {
                    sens: sens.sens,
                    position: Number(el.tyresdiv),
                    parametr: el.pressure,
                    bar: osssMap[el.osNumber],
                    val: data.map(elem => {
                        return ({
                            dates: new Date(Number(elem.last_valid_time) * 1000),
                            geo: [Number(elem.lat), Number(elem.lon)],
                            speed: Number(elem.speed),
                            stop: Number(elem.engineOn) === 1 ? 'ВКЛ' : 'ВЫКЛ',
                            value: elem[el.pressure] ? Number(elem[el.pressure]) : -0.5,
                            tvalue: elem[el.temp] ? (Number(elem[el.temp]) !== -128 && Number(elem[el.temp]) !== -50 && Number(elem[el.temp]) !== -51 ? Number(elem[el.temp]) : -0.5) : -0.5
                        })
                    })
                };
            }
        }).filter(el => el !== undefined)
        paramnew.sort((a, b) => a.position - b.position)
        paramnew.forEach(e => e.val.sort((a, b) => {
            if (a.dates > b.dates) {
                return 1;
            }
            if (a.dates < b.dates) {
                return -1;
            }
            return 0;
        }))
        this.structura = paramnew
    }
    installTime() {
        const now = new Date();
        const nowDate = Math.round(now.getTime() / 1000)
        const startnowDate = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime() / 1000);
        this.time = [startnowDate, nowDate]
    }
}