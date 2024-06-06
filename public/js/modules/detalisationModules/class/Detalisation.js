import { createJobTS, createChart, createOilTS, createMelagiTS } from '../charts.js'
import { jobTSDetalisation, jobTS, oilTS, melageTS, cal2, cal3 } from '../content.js'
import { convertDate } from '../../helpersFunc.js'
import { GetDataTime } from '../../../class/GetDataTime.js'

export class Detalisation {
    constructor(id) {
        this.id = id.id
        this.time = null
        this.structura = []
        this.data = null
        this.datas = null
        this.nav = null
        this.container = document.querySelector('.windowStatistic')
        this.navstat = this.container.querySelectorAll('.navstat')
        this.handleCardClick = this.toogleModalWindow.bind(this)
        this.handleCalensClick = this.toogleModalData.bind(this)
        this.wrap = document.querySelector('.wrapper_left')

        // Инициализация ResizeObserver
        this.initResizeObserver();
        this.init()
    }

    initResizeObserver() {
        this.currentWidth = this.wrap.clientWidth;
        this.resizeObserver = new ResizeObserver(entries => {
            const nav = document.querySelector('.activStatic')?.id;
            for (const entry of entries) {
                const { width } = entry.contentRect;
                console.log(this.currentWidth, width)
                if (Math.abs(this.currentWidth !== width)) {
                    this.currentWidth = width;
                    this.performResizeActions(nav);
                }
            }
        });
    }

    performResizeActions(nav) {
        console.log(this.container)
        switch (nav) {
            case 'nav1':
                // Выполняем перерисовку, так как размер изменился
                this.structura.forEach((elem, index) => {
                    createChart(Object.values(elem)[0].datas, index + 1, this.container);
                });
                break;
            case 'nav2':
                // Выполняем перерисовку, так как размер изменился
                this.structura.forEach((elem, index) => {
                    const data = this.dannieSortJobTS(Object.values(elem)[0].intervals)
                    createJobTS(data, index + 1, this.container)

                })
                break;
            case 'nav3':
                let zap = this.datas.reduce((acc, el) => Number(el.zapravka) + acc, 0)
                let ras = this.datas.reduce((acc, el) => Number(el.rashod) + acc, 0)
                const structura = [
                    { day: this.datas[this.datas.length - 1] },
                    { yesterday: this.datas[this.datas.length - 2] },
                    { week: { zapravka: zap, rashod: ras } }
                ];
                structura.forEach((elem, index) => {
                    createOilTS(elem, index + 1, this.container)
                })
                break;
            case 'nav4':
                createMelagiTS(this.datas, 1, this.container)
                break;
        }
    }

    async init() {
        this.nav = 'nav1'
        this.initEventListeners()
        this.createIntervalTime()
        this.container.insertAdjacentHTML('beforeend', ` ${jobTSDetalisation}`);
        this.eskiz()
        const stor = await this.getDataStor()
        this.createStructura(stor)
        this.initEventListenersCalendar()
        this.resizeObserver.observe(this.wrap);

    }

    reinitialize(id) {
        this.data = null
        this.id = id.id
        this.structura = []
        this.time = null
        this.removeEventListeners()
        this.resizeObserver.disconnect(); // Отключение ResizeObserver
        this.initResizeObserver(); // Переинициализация ResizeObserver
        this.init()
    }

    initEventListenersCalendar() {
        const calens = this.container.querySelectorAll('.calen')
        calens.forEach(el => el.addEventListener('click', this.handleCalensClick));
    }
    initEventListeners() {
        this.navstat.forEach(el => el.addEventListener('click', this.handleCardClick));
    }
    removeEventListeners() {
        this.navstat.forEach(el => el.removeEventListener('click', this.handleCardClick));

    }


    clear(event) {
        event.currentTarget.closest('.calendar').style.display = 'none'
    }

    async ok(event) {
        event.currentTarget.closest('.calendar').style.display = 'none'
        const element = event.currentTarget.closest('.calendar').previousElementSibling.getAttribute('rel')
        const title = event.currentTarget.closest('.calendar').previousElementSibling.parentElement
        const perem = element === 'cal2' ? cal2 : cal3;
        const titles = this.time[0][0] !== this.time[0][1]
            ? `${this.time[0][1]}-${this.time[1][1]}<div class="calen" rel="${element}"></div>${perem}`
            : `${this.time[0][1]}<div class="calen" rel="${element}"></div>${perem}`;
        title.innerHTML = titles
        switch (this.nav) {
            case 'nav1':
                this.condition([await this.getDataStor()]);
                createChart(this.data.time.datas, element === 'cal2' ? 2 : 3, this.container)
                break;
            case 'nav2':
                this.condition([await this.getDataStor()]);
                const data = this.dannieSortJobTS(this.data.time.intervals)
                createJobTS(data, element === 'cal2' ? 2 : 3, this.container)

                break;
            case 'nav3':
                const datas = await this.getParamsOilAndMileage(3)
                console.log(datas)
                let zap = datas.reduce((acc, el) => Number(el.zapravka) + acc, 0)
                let ras = datas.reduce((acc, el) => Number(el.rashod) + acc, 0)
                const structura = [
                    { time: { zapravka: zap, rashod: ras } }
                ];
                createOilTS(structura[0], element === 'cal2' ? 2 : 3, this.container)
                break;
            case 'nav4':
                const datasMileage = await this.getParamsOilAndMileage(4)
                createMelagiTS(datasMileage, 1, this.container)
                break;
        }
        this.initEventListenersCalendar()
    }
    async toogleModalData(event) {
        const elem = event.currentTarget
        const btns = elem.nextElementSibling.querySelectorAll('.btm_formStart')
        elem.nextElementSibling.style.display = 'flex'
        btns[0].addEventListener('click', this.clear.bind(this))
        btns[1].addEventListener('click', this.ok.bind(this))
        const getTime = new GetDataTime()
        const time = await getTime.getTimeInterval(elem.nextElementSibling)
        this.time = time.map(elem => {
            const date = new Date(elem * 1000);
            const year = date.getFullYear();
            const month = ("0" + (date.getMonth() + 1)).slice(-2); // добавляем ведущий ноль, если месяц < 10
            const day = ("0" + date.getDate()).slice(-2); // добавляем ведущий ноль, если день < 10
            return [`${year}-${month}-${day}`, `${day}.${month}.${year}`, date.getTime() / 1000];
        });
    }
    async toogleModalWindow(event) {
        this.time = null
        this.navstat.forEach(el => {
            el.classList.remove('activStatic')
        })
        const element = event.currentTarget
        element.classList.add('activStatic')
        this.container.children[1].remove()
        this.container.children[1].remove()
        switch (element.id) {
            case 'nav1':
                this.nav = 'nav1'
                this.container.insertAdjacentHTML('beforeend', ` ${jobTSDetalisation}`);
                this.eskiz()
                this.structura.forEach((elem, index) => { createChart(Object.values(elem)[0].datas, index + 1, this.container) })
                break;
            case 'nav2':
                this.nav = 'nav2'
                this.container.insertAdjacentHTML('beforeend', ` ${jobTS}`);
                this.updateHTML()
                this.eskiz()
                this.structura.forEach((elem, index) => {
                    const data = this.dannieSortJobTS(Object.values(elem)[0].intervals)
                    createJobTS(data, index + 1, this.container)

                })
                break;
            case 'nav3':
                this.nav = 'nav3'
                this.container.insertAdjacentHTML('beforeend', ` ${oilTS}`);
                this.updateHTML()
                this.eskiz()
                this.datas = await this.getParamsOilAndMileage(3)
                let zap = this.datas.reduce((acc, el) => Number(el.zapravka) + acc, 0)
                let ras = this.datas.reduce((acc, el) => Number(el.rashod) + acc, 0)
                const structura = [
                    { day: this.datas[this.datas.length - 1] },
                    { yesterday: this.datas[this.datas.length - 2] },
                    { week: { zapravka: zap, rashod: ras } }
                ];
                structura.forEach((elem, index) => {
                    createOilTS(elem, index + 1, this.container)
                })
                break;
            case 'nav4':
                this.nav = 'nav4'
                this.container.insertAdjacentHTML('beforeend', ` ${melageTS}`);
                const interval = document.querySelector('.intervalTitle')
                interval.innerHTML = `10 дней: ${this.convertTime(4)} <div class="calen" rel="cal2"></div>${cal2}`
                this.datas = await this.getParamsOilAndMileage(4)
                createMelagiTS(this.datas, 1, this.container)
                break;
        }
        this.initEventListenersCalendar()
    }
    async getParamsOilAndMileage(num) {
        const data = this.time && this.time[0].length > 2 ? [this.time[0][0], this.time[1][0]] : [convertDate(9), convertDate(0)]
        const idw = this.id
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data, idw }),
        };
        const mods = await fetch('/api/summaryIdwToBase', params);
        const models = await mods.json();
        models.sort((a, b) => a.data - b.data);
        let obj = {}
        if (num === 4) {
            obj = models.map(it => {
                return { data: `${it.data.split('-')[2]}-${it.data.split('-')[1]}`, melagi: it.probeg }
            })
            return obj
        }
        else {
            obj = models.map(el => ({ zapravka: Number(el.zapravka), rashod: Number(el.rashod) }))
            console.log(obj)
            return obj
        }
    }
    dannieSortJobTS(datas) {
        if (datas["Повернут ключ зажигания"]) {
            datas["Парковка"] += datas["Повернут ключ зажигания"];
            delete datas["Повернут ключ зажигания"];
        }
        return datas
    }

    createStructura(stor) {
        this.installTime(stor)
        this.structura.forEach((element, index) => this.condition(Object.values(element), Object.keys(element), index));
    }

    updateHTML() {
        console.log('работает апдейт')
        const jobTSDetalisationGraf = document.querySelector(".jobTSDetalisationGraf")
        jobTSDetalisationGraf.style.flexDirection = 'row'
        jobTSDetalisationGraf.style.justifyContent = 'center'
        const jobTSDetalisationLine = document.querySelector(".jobTSDetalisationLine")
        jobTSDetalisationLine.style.width = '200px'
        const chartJobTS = document.querySelectorAll('.chartJobTS')
        const jobTSDetalisationDate = document.querySelectorAll(".jobTSDetalisationDate")
        jobTSDetalisationDate.forEach(el => {
            el.style.fontSize = '13px'
        })
        chartJobTS.forEach(el => {
            el.style.alignItems = 'start'
        })
    }

    eskiz() {
        const today = document.querySelector('.todayTitle')
        const yestoday = document.querySelector('.yestodayTitle')
        const week = document.querySelector('.weekTitle')
        today.textContent = `Сегодня: ${this.convertTime(1)}`
        yestoday.innerHTML = `Вчера: ${this.convertTime(2)}<div class="calen" rel="cal2"></div>${cal2}`
        week.innerHTML = `Неделя: ${this.convertTime(3)}<div class="calen" rel="cal3"></div>${cal3}`
    }
    convertTime(num) {
        if (num === 1) {
            const todayData = new Date();
            var day = String(todayData.getDate()).padStart(2, '0');
            var month = String(todayData.getMonth() + 1).padStart(2, '0');
            var year = todayData.getFullYear();
            var formattedDate = day + "." + month + "." + year;
            return formattedDate
        }
        if (num === 2) {
            const todayData = new Date();
            todayData.setDate(todayData.getDate() - 1);
            const day = String(todayData.getDate()).padStart(2, '0');
            const month = String(todayData.getMonth() + 1).padStart(2, '0');
            const year = todayData.getFullYear();
            const formattedDate = day + "." + month + "." + year;
            return formattedDate;

        }
        if (num === 3 || num === 4) {
            const todayData = new Date();
            var day = String(todayData.getDate() - (num !== 4 ? 7 : 10)).padStart(2, '0');
            var month = String(todayData.getMonth() + 1).padStart(2, '0');
            var year = todayData.getFullYear();
            if (day <= 0) {
                // Если день стал отрицательным, значит нужно уменьшить месяц на 1
                todayData.setMonth(todayData.getMonth() - 1);
                // Получаем последний день предыдущего месяца
                const lastDayOfPrevMonth = new Date(todayData.getFullYear(), todayData.getMonth() + 1, 0).getDate();
                // Устанавливаем день на последний день предыдущего месяца
                day = String(lastDayOfPrevMonth + (Number(day))).padStart(2, '0');
                month = String(todayData.getMonth() + 1).padStart(2, '0');
            }
            var formattedDate = day + "." + month + "." + year;
            const todayData2 = new Date();
            todayData2.setDate(todayData2.getDate() - 1); // Вычитаем 1 день из текущей даты
            var day2 = String(todayData2.getDate()).padStart(2, '0');
            var month2 = String(todayData2.getMonth() + 1).padStart(2, '0');
            var year2 = todayData2.getFullYear();
            if (day2 <= 0) {
                // Если день стал отрицательным, значит нужно уменьшить месяц на 1
                todayData2.setMonth(todayData2.getMonth() - 1);
                // Получаем последний день предыдущего месяца
                const lastDayOfPrevMonth = new Date(todayData2.getFullYear(), todayData2.getMonth() + 1, 0).getDate();
                // Устанавливаем день на последний день предыдущего месяца
                day2 = String(lastDayOfPrevMonth + Number(day2)).padStart(2, '0');
                month = String(todayData.getMonth() + 1).padStart(2, '0');
            }
            var formattedDate2 = day2 + "." + month2 + "." + year2;
            return `${formattedDate}-${formattedDate2}`
        }
    }
    condition(element, key, index) {
        console.log(element, key, index)
        const intStopNew = this.prostoy(element)
        if (intStopNew) {
            intStopNew.forEach(el => {
                const startIndex = element[0].findIndex(x => x.time === el[0][0]);
                const endIndex = element[0].findIndex(x => x.time === el[1][0]);
                if (startIndex !== -1 && endIndex !== -1) {
                    // Обновить значения в свойстве condition
                    for (let i = startIndex; i <= endIndex; i++) {
                        element[0][i].condition = 'Работа на холостом ходу';
                    }
                }
            })
        }
        const { datas, intervals } = this.calculateIntervalsAndTotalTime(element);
        if (key) {
            this.structura[index] = { [key]: { datas, intervals } }
            createChart(this.structura[index][key].datas, index + 1, this.container)
        } else {
            this.data = { ['time']: { datas, intervals } }
        }
    }

    calculateIntervalsAndTotalTime(data) {
        let totalStateDurations = {}; // Для хранения общего времени каждого состояния
        let currentState = null;
        let stateStart = null;

        data[0].forEach((item, index, arr) => {
            const newState = item.condition || (item.speed > 0 && item.engineOn === 1 ? 'Движется'
                : item.speed === 0 && item.engine === 1 ? 'Повернут ключ зажигания' : 'Парковка');
            if (newState !== currentState || index === 0) {
                if (stateStart !== null && currentState !== null) {
                    // Закрытие предыдущего интервала и добавление его продолжительности
                    const intervalSeconds = (item.time - stateStart) / 1000;
                    if (!totalStateDurations[currentState]) {
                        totalStateDurations[currentState] = 0;
                    }
                    totalStateDurations[currentState] += intervalSeconds;
                    // Добавляем интервал ко всем элементам в группе
                    const interval = this.convertToHoursAndMinutes(intervalSeconds);
                    for (let j = arr.findIndex(el => el.time === stateStart); j < index; j++) {
                        arr[j].interval = interval;
                    }
                }
                stateStart = item.time; // Начало нового состояния
            }
            item.condition = newState; // Присваиваем состояние
            currentState = newState; // Обновляем текущее состояние

            // Если это последний элемент, закрываем текущий интервал
            if (index === data.length - 1) {
                const intervalSeconds = (item.time - stateStart) / 1000;
                if (!totalStateDurations[currentState]) {
                    totalStateDurations[currentState] = 0;
                }
                totalStateDurations[currentState] += intervalSeconds;

                const interval = this.convertToHoursAndMinutes(intervalSeconds);
                for (let j = arr.findIndex(el => el.time === stateStart); j <= index; j++) {
                    arr[j].interval = interval;
                }
            }
        });
        return {
            datas: data, // Данные с интервалами по каждому состоянию
            intervals: totalStateDurations // Общее время по всем состояниям
        };
    }

    convertToHoursAndMinutes(value) {
        const hours = Math.floor(value / 3600)
        const lastSeconds = value % 3600
        const minutes = Math.floor(lastSeconds / 60)
        return { hours: hours, minutes: minutes };
    }

    prostoy(newdata) {
        if (newdata.length === 0) {
            return undefined
        }
        else {
            const res = newdata[0].reduce((acc, e) => {
                if (e.engineOn === 1 && e.speed === 0 && e.sats > 4) {
                    if (Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length > 0
                        && acc[acc.length - 1][0].engineOn === 1 && acc[acc.length - 1][0].speed === 0 && acc[acc.length - 1][0].sats > 4) {
                        acc[acc.length - 1].push(e);
                    } else {
                        acc.push([e]);
                    }
                } else if (e.engineOn === 0 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0
                    || e.speed > 0 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0
                    || e.sats <= 4 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0) {
                    acc.push([]);
                }

                return acc;
            }, []).filter(el => el.length > 0).reduce((acc, el) => {
                if (((el[el.length - 1].time.getTime()) / 1000) - ((el[0].time.getTime()) / 1000) > 1200) {
                    acc.push([[el[0].time, el[0].geo, el[0].oil], [el[el.length - 1].time, el[el.length - 1].geo, el[el.length - 1].oil]])
                }
                return acc
            }, [])
            return res
        }

    }

    installTime(stor) {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
        const startOfYesterday = startOfToday - 86400;
        let todayEvents = [];
        let yesterdayEvents = [];

        stor.forEach(e => {
            const eTimeUnix = Math.floor(new Date(e.time).getTime() / 1000);
            if (eTimeUnix >= startOfToday) {
                todayEvents.push(e);
            } else if (eTimeUnix >= startOfYesterday && eTimeUnix < startOfToday) {
                yesterdayEvents.push(e);
            }
        });

        this.structura = [
            { day: todayEvents },
            { yesterday: yesterdayEvents },
            { week: stor }
        ];
    }
    createIntervalTime() {
        this.navstat.forEach(el => {
            el.classList.remove('activStatic')
        })
        this.navstat[0].classList.add('activStatic')

        const nowTime = Math.floor(new Date().getTime() / 1000)
        const oldTime = nowTime - 604800
        this.time = [oldTime, nowTime]
        console.log(this.time)
    }
    async getDataStor() {
        const arrayColumns = ['last_valid_time', 'speed', 'lat', 'lon', 'engine', 'sats', 'engineOn']
        const idw = this.id
        const t1 = this.time[0].length > 2 ? this.time[0][2] : this.time[0]
        const t2 = this.time[0].length > 2 ? this.time[1][2] + 86399 : this.time[1]
        const num = 0

        // Отмена предыдущего запроса, если он существует
        if (this.abortController) {
            this.abortController.abort();
        }

        // Создание нового контроллера для отмены
        this.abortController = new AbortController();
        const signal = this.abortController.signal;

        const workerKey = 'detalisationStatistiks'
        const paramss = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw, t1, t2, arrayColumns, num, workerKey })),
            signal: signal

        }
        const res = await fetch('/api/getPressureOil', paramss)
        const data = await res.json();
        data.sort((a, b) => a.last_valid_time - b.last_valid_time);
        const newGlobal = data.map(it => {
            return {
                time: new Date(Number(it.last_valid_time) * 1000),
                speed: Number(it.speed),
                geo: [Number(it.lat), Number(it.lon)],
                engine: Number(it.engine),
                sats: Number(it.sats),
                engineOn: Number(it.engineOn)
            }
        })
        return newGlobal
    }
}