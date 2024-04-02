

import { convertTime } from '../helpersFunc.js'
import { GetDataTime } from '../../class/GetDataTime.js'
export class StatistikaPressure {
    constructor(data, id) {
        this.data = data
        this.id = id.id
        this.structura = null
        this.time = null
        this.iconStata = document.querySelector('.icon_stata')
        this.iconCheck = document.querySelector('.icon_check')
        this.calendar = document.querySelector('.calendar_graf_stata')
        this.button = this.calendar.querySelectorAll('.btm_formStart')
        this.button[0].addEventListener('click', this.clear.bind(this))
        this.button[1].addEventListener('click', this.ok.bind(this))
        this.iconCheck.addEventListener('click', this.updateTexContent.bind(this))
        this.clickIcon = this.toggleCalendar.bind(this)
        this.clickCheck = this.updateTexContent.bind(this)
        this.init()
        this.initEventListeners()

    }


    async init() {
        if (!this.time) this.installTime()
        console.log(this.time)
        console.time('1')
        await this.getParamsToInterval()
        console.timeEnd('1')
        const content = this.calcilator()
        this.createTableContent(content)
    }

    initEventListeners() {
        this.iconStata.addEventListener('click', this.clickIcon)
        this.iconCheck.removeEventListener('click', this.clickCheck)
    }
    removeEventListeners() {
        this.iconStata.removeEventListener('click', this.clickIcon)
        this.iconCheck.addEventListener('click', this.clickCheck)
    }
    reinitialize(newData, newId) {
        this.removeEventListeners();
        this.data = newData
        this.id = newId.id
        this.init(); // Переинициализация с новым id
        this.initEventListeners(); // Повторное добавление слушателей событий
    }
    async calendarOpen() {
        //  this.calendar.computedStyleMap.di
        const ide = `#${!this.calendar.children[0].children[0] ? this.calendar.children[0].id : this.calendar.children[0].children[0].id}`
        const getTime = new GetDataTime()
        this.time = await getTime.getTimeInterval(this.calendar, ide)
    }

    async toggleCalendar(event) {
        console.log('запуск')
        const element = event.target
        element.classList.toggle('clickUp')
        console.log(element)
        if (element.classList.contains('clickUp')) {
            this.calendar.style.display = 'flex'
            await this.calendarOpen()
        }
        else {
            this.calendar.style.display = 'none'
        }
    }
    ok() {
        console.log(this.time)
        this.calendar.style.display = 'none'
        console.log(this.clickIcon)
        this.iconStata.classList.remove('clickUp')
        this.calendar.children[0].children[0].value = ''
        this.init()
    }
    clear() {
        console.log('здесь')
        this.calendar.style.display = 'none'
        this.iconStata.classList.remove('clickUp')
        this.calendar.children[0].children[0].value = ''
    }

    updateTexContent() {
        this.iconCheck.classList.toggle('check_probeg')
        const celValue = document.querySelectorAll('.celValue')
        celValue.forEach(e => {
            this.iconCheck.classList.contains('check_probeg') ? e.textContent = e.getAttribute('rel') : e.textContent = e.getAttribute('rel1')
        })
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
                td.classList.add('celValue')
                td.setAttribute('rel', Object.entries(it.intervals)[i][1].totalMileage)
                td.setAttribute('rel1', Object.entries(it.intervals)[i][1].totalTime)
                td.textContent = Object.entries(it.intervals)[i][1].totalTime
                tr.appendChild(td)
            }
        })
    }
    calcilator() {
        console.log(this.structura);
        const result = this.structura.map(sensor => ({
            sensor: sensor.sens,
            intervals: this.processSensor(sensor, Number(sensor.bar.knd), Number(sensor.bar.kvd), Number(sensor.bar.dnn), Number(sensor.bar.dvn))
        }));

        const resultWithDurations = result.map(sensor => {
            // Инициализируем переменную для хранения суммарного времени и общего пробега всех интервалов
            let totalTimeAll = 0;
            let totalMileageAll = 0;

            // Для каждой категории интервала в каждом сенсоре рассчитываем общее время и пробег
            Object.keys(sensor.intervals).forEach(category => {
                const totalTime = sensor.intervals[category].reduce((acc, interval) => {
                    // Добавляем разницу между концом и началом интервала к аккумулятору времени
                    const intervalTime = interval.end - interval.start;
                    // Рассчитываем пробег для интервала
                    const intervalMileage = interval.endMileage - interval.startMileage;
                    // Накапливаем общий пробег

                    // Возвращаем объект с посчитанными значениями для каждого интервала
                    return { ...acc, totalTime: acc.totalTime + intervalTime, mileageInterval: acc.mileageInterval + intervalMileage };
                }, { totalTime: 0, mileageInterval: 0 }); // Начальные значения аккумулятора

                // Накапливаем суммарное время всех интервалов
                totalTimeAll += totalTime.totalTime;
                totalMileageAll += totalTime.mileageInterval;
                // Заменяем массив интервалов суммарным временем и пробегом для данной категории
                sensor.intervals[category] = {
                    totalTime: totalTime.totalTime !== 0 ? convertTime(totalTime.totalTime) : '-',
                    totalMileage: totalTime.mileageInterval !== 0 ? `${totalTime.mileageInterval} км` : '-'
                };;
            });
            // Добавляем свойства all с суммарным временем и общим пробегом всех интервалов в текущем сенсоре
            sensor.intervals.all = { totalTime: totalTimeAll !== 0 ? convertTime(totalTimeAll) : '-', totalMileage: totalMileageAll !== 0 ? `${totalMileageAll} км` : '-' };

            return sensor;
        });
        return resultWithDurations;
    }



    processSensor(sensorData, knd, kvd, dnn, dvn) {
        // Инициализируем объект для хранения интервалов пяти категорий
        let intervals = { belowKnd: [], betweenKndDnn: [], betweenDnnDvn: [], betweenDvnKvd: [], aboveKvd: [] };
        let currentInterval = { type: null, start: null, end: null, startMileage: 0, endMileage: 0 };

        sensorData.val.forEach((point, index) => {
            const time = new Date(point.dates).getTime() / 1000;
            const isMovingAndStopSignal = point.stop === 'ВКЛ' && point.speed > 0;
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
                    currentInterval.endMileage = point.mileage; // Обновляем пробег на конец интервала
                } else {
                    // Закрываем предыдущий интервал и начинаем новый
                    if (currentInterval.start !== null) {
                        intervals[currentInterval.type].push({
                            start: currentInterval.start,
                            end: currentInterval.end,
                            startMileage: currentInterval.startMileage,
                            endMileage: currentInterval.endMileage
                        });
                    }
                    currentInterval = { type: type, start: time, end: time, startMileage: point.mileage, endMileage: point.mileage };
                }
            } else if (currentInterval.start !== null) {
                // Закрываем текущий интервал, если условия не выполняются
                intervals[currentInterval.type].push({
                    start: currentInterval.start,
                    end: currentInterval.end,
                    startMileage: currentInterval.startMileage,
                    endMileage: currentInterval.endMileage
                });
                currentInterval = { type: null, start: null, end: null, startMileage: 0, endMileage: 0 };
            }

            // Проверка на конец массива для незакрытых интервалов
            if (index === sensorData.val.length - 1 && currentInterval.start !== null) {
                intervals[currentInterval.type].push({
                    start: currentInterval.start,
                    end: currentInterval.end,
                    startMileage: currentInterval.startMileage,
                    endMileage: currentInterval.endMileage
                });
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
        //getPressureOil
        const res = await fetch('/api/getDataParamsInterval', param)
        const data = await res.json()

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
                            mileage: parseInt(elem.mileage),
                            stop: Number(elem.engineOn) === 1 ? 'ВКЛ' : 'ВЫКЛ',
                            value: elem[el.pressure] ? Number(elem[el.pressure]) : -0.1,
                            tvalue: elem[el.temp] ? (Number(elem[el.temp]) !== -128 && Number(elem[el.temp]) !== -50 && Number(elem[el.temp]) !== -51 ? Number(elem[el.temp]) : -0.1) : -0.1
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