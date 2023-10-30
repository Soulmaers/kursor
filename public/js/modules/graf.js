
import { speed } from './charts/speed.js'
import { oil } from './charts/oil.js'
import { datas } from './charts/bar.js'

const btnForm = document.querySelectorAll('.btm_form')
const selectSpeed = document.querySelector('.select_speed')

export const times = []

const fp = flatpickr("#daterange", {
    mode: "range",
    dateFormat: "d-m-Y",
    locale: "ru",
    static: true,
    "locale": {
        "firstDayOfWeek": 1 // устанавливаем первым днем недели понедельник
    },
    onChange: function (selectedDates, dateStr, instance) {
        const formattedDates = selectedDates.map(date => {
            const year = date.getFullYear();
            const month = ("0" + (date.getMonth() + 1)).slice(-2); // добавляем ведущий ноль, если месяц < 10
            const day = ("0" + date.getDate()).slice(-2); // добавляем ведущий ноль, если день < 10
            return `${year}-${month}-${day}`;
        });
        times.push(formattedDates)
    }
});

const dateInputValue = document.getElementById('daterange')
btnForm.forEach(el =>
    el.addEventListener('click', () => {
        const mapss = document.getElementById('mapOil')
        if (mapss) {
            mapss.remove();
        }
        if (el.textContent === 'Выполнить' && dateInputValue.value !== '') {

            const grafOld = document.querySelector('.infoGraf')
            if (grafOld) {
                grafOld.remove()
            }
            const preloaderGraf = document.querySelector('.loader') /* находим блок Preloader */
            preloaderGraf.style.opacity = 1;
            preloaderGraf.style.display = 'flex'
            dataInput() //фунции выбора интервала графика скорости
        }
        if (el.textContent === 'Выполнить' && dateInputValue.value === '') {
            const grafOld = document.querySelector('.infoGraf')
            if (grafOld) {
                grafOld.remove()
            }
            const preloaderGraf = document.querySelector('.loader') /* находим блок Preloader */
            preloaderGraf.style.opacity = 1;
            preloaderGraf.style.display = 'flex'
            dataSelect() //фунции выбора интервала графика скорости
        }
        if (el.textContent === 'Очистить') {
            selectSpeed.value = 0;
            dateInputValue.value = ''
        }
    })
)

export async function click() {
    if (times.length !== 0) {
        const preloaderGraf = document.querySelector('.loader') /* находим блок Preloader */
        preloaderGraf.style.opacity = 1;
        preloaderGraf.style.display = 'flex'
        await dataInput() //фунции выбора интервала графика скорости
    }
    if (times.length === 0) {
        const preloaderGraf = document.querySelector('.loader') /* находим блок Preloader */
        preloaderGraf.style.opacity = 1;
        preloaderGraf.style.display = 'flex'
        await dataSelect() //фунции выбора интервала графика скорости
    }
}
export async function dataInput() {
    const dateTime = times[times.length - 1]
    const selectSpeed = document.querySelector('.select_speed')
    selectSpeed.value = 0;
    let t01 = new Date(dateTime[0])
    let timeFrom = Math.floor(t01.setHours(t01.getHours()) / 1000)
    let t02 = new Date(dateTime[1])
    let nowDate = Math.floor(t02.setHours(t02.getHours()) / 1000)
    graftest(timeFrom - 10800, nowDate - 10800)
}
export async function dataSelect() {
    let nowDate = Math.round(new Date().getTime() / 1000)
    let nDate = new Date();
    const selectSpeed = document.querySelector('.select_speed')
    const activeMenuGraf = document.querySelector('.activMenuGraf')
    let timeFrom;
    console.log(selectSpeed.value)
    switch (selectSpeed.value) {
        case '0': {
            timeFrom = Math.round(nDate.setHours(nDate.getHours() - 24) / 1000);
            activeMenuGraf.textContent === 'Топливо' ? graftest(timeFrom, nowDate) : graftest(timeFrom, nowDate)
        }
            break;
        case '1': {
            timeFrom = Math.round(nDate.setDate(nDate.getDate() - 1) / 1000);
            graftest(timeFrom, nowDate)
        }
            break;
        case '2': {
            timeFrom = Math.round(nDate.setDate(nDate.getDate() - 7) / 1000);
            graftest(timeFrom, nowDate)
        }
            break;
        case '3': {
            timeFrom = Math.round(nDate.setMonth(nDate.getMonth() - 1) / 1000);
            graftest(timeFrom, nowDate)
        }
            break;
    }
}

export async function graftest(t1, t2) {
    console.log(t1, t2)
    const activeMenuGraf = document.querySelector('.activMenuGraf')
    if (activeMenuGraf.textContent === 'Давление') {
        datas(t1, t2);
        console.log('финиш')
    }
    if (activeMenuGraf.textContent === 'Топливо') {
        oil(t1, t2)

    }
    if (activeMenuGraf.textContent === 'Скорость') {
        speed(t1, t2)
    }

}
selectSpeed.addEventListener('click', () => {
    dateInputValue.value = ''
})

