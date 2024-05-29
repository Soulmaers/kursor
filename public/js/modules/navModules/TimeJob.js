


export class TimeJob {
    constructor(id) {
        this.id = id
        this.structura = []
        this.container = document.querySelectorAll('.wrap_inner_graf')
        this.init()
    }

    async init() {
        const stor = await this.getData()//забираем данные
        this.createStructura(stor)
    }
    createStructura(stor) {
        this.installTime(stor)
        this.structura.forEach((element, index) => this.condition(Object.values(element), Object.keys(element), index));

    }
    dannieSortJobTS(datas) {
        console.log(datas)
        if (datas["Повернут ключ зажигания"] || datas["Парковка"]) {
            delete datas["Повернут ключ зажигания"];
            delete datas["Парковка"];
        }
        return datas
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
            { yesterday: todayEvents },
            { week: yesterdayEvents },
            { month: stor }
        ];
    }
    condition(element, key, index) {
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
        this.structura[index] = { [key]: { intervals } }
        const data = this.dannieSortJobTS(intervals)
        console.log(data)
        this.createJobTS(data, key, index)
    }

    convertToHoursAndMinutes(value) {
        const hours = Math.floor(value / 3600)
        const lastSeconds = value % 3600
        const minutes = Math.floor(lastSeconds / 60)
        return { hours: hours, minutes: minutes };
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
    async getData() {
        const arrayColumns = ['last_valid_time', 'speed', 'lat', 'lon', 'engine', 'sats', 'engineOn']
        const idw = this.id
        const t2 = Math.floor(new Date().getTime() / 1000)
        const t1 = t2 - 2592000
        const num = 0
        const paramss = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw, t1, t2, arrayColumns, num }))

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



    createJobTS(data, key, num) {
        const chartStatic = this.container[num]
        const chartStatics = chartStatic.querySelector(`.chartStatic${num}`)
        if (chartStatics) chartStatics.remove();
        const obj = {
            0: 'inner_yestoday',
            1: 'inner_week',
            2: 'inner_month',
        }
        const objColor = {
            'Движется': ' lightgreen',
            'Работа на холостом ходу': 'orange'
        }
        const dataArray = Object.entries(data).map(([category, value]) => ({ category, value }));
        // Задание размеров графика
        const width = 100 + '%';
        const height = 150;

        // Создание контейнера для графика
        const svg = d3.select(`.${obj[num]}`)
            .append("svg")
            .attr('class', `chartStatic${num}`)
            .attr("width", width)
            .attr("height", height);

        var maxValue = d3.max(dataArray.map(item => item.value));
        console.log(maxValue)
        // Создание масштаба для оси Y
        var yScale = d3.scaleLinear()
            .domain([0, maxValue * 1.1]) // Используем максимальное значение для определения диапазона
            .range([0, width]); // Подстраиваем высоту графика
        const barWidth = 75; // Ширина каждого столбца
        // Присоединяет данные к rect элементам и задает их атрибуты
        // Создание столбцов

        const bars = svg.selectAll("rect")
            .data(dataArray)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", (d, i) => i * barWidth)
            .attr("width", (d) => yScale(d.value))
            .attr("height", barWidth - 1)
            .attr('stroke', (d) => yScale(d.value) > 3 ? 'black' : objColor[d.category])
            .attr("fill", function (d, i) {
                return objColor[d.category];
            });

        const datas = [dataArray]
        const viewData = datas[0].map(function (d) {
            var time = convertToHoursAndMinutes(d.value);
            return {
                category: d.category, value: d.value, hours: time.hours, minutes: time.minutes
            }
        });
        // values: (time.hours > 0 ? time.hours + " ч.\n " : "") + (time.minutes > 0 ? time.minutes + " мин." : "")
        function convertToHoursAndMinutes(value) {
            const hours = Math.floor(value / 3600)
            const lastSeconds = value % 3600
            const minutes = Math.floor(lastSeconds / 60)
            return { hours: hours, minutes: minutes };
        }

        svg.selectAll("g.values")
            .data(viewData)
            .enter()
            .append('g')
            .attr('class', 'values')
            .attr('transform', function (d, i) {
                const y = i * barWidth + (barWidth - 1) / 2; // центрирование текста на столбце
                var barWidth = yScale(d.value);
                var x = barWidth + 5; // отступ для текста
                return `translate(${x}, ${y})`;
            })
            .each(function (d, i) {
                var barWidth = yScale(d.value);
                if (d.hours > 0) {
                    d3.select(this)
                        .append('text')
                        .attr('x', 0)
                        .attr('y', barWidth > 30 ? barWidth / 3 : 0)
                        .attr('dy', barWidth > 30 ? '0.75em' : '-1.75em') // Смещение вверх над столбцем для часов
                        .text(d.hours + ' ч.')
                        .attr("fill", "black")
                        .attr("font-size", "14px")
                        .attr("font-family", "Roboto")
                        .attr("font-weight", "bold")
                        .style('text-anchor', 'start'); // Выравнивание текста по левому краю
                }
                if (d.minutes > 0) {
                    d3.select(this)
                        .append('text')
                        .attr('x', 0)
                        .attr('y', barWidth > 30 ? barWidth / 3 : 0)
                        .attr('dy', barWidth > 30 ? '1.75em' : '-0.35em') // Смещение вниз над часами для минут
                        .text(d.minutes + ' мин.')
                        .attr("fill", "black")
                        .attr("font-size", "14px")
                        .attr("font-family", "Roboto")
                        .attr("font-weight", "bold")
                        .style('text-anchor', 'start'); // Выравнивание текста по левому краю
                }
            });
    }
}