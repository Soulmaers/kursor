
import { speed } from './charts/speed.js'
import { oil } from './charts/oil.js'
import { datas } from './charts/bar.js'


const btnForm = document.querySelectorAll('.btm_form')
const inputDate = document.querySelectorAll('.input_date')
const selectSpeed = document.querySelector('.select_speed')


const times = []


const fp = flatpickr("#daterange", {
    mode: "range",
    dateFormat: "d-m-Y",
    locale: "ru",
    static: true,
    "locale": {
        "firstDayOfWeek": 1 // устанавливаем первым днем недели понедельник
    },
    onChange: function (selectedDates, dateStr, instance) {
        //  console.log(selectedDates);
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
        if (el.textContent === 'Выполнить' && times.length !== 0) {
            const grafOld = document.querySelector('.infoGraf')
            if (grafOld) {
                grafOld.remove()
            }
            const preloaderGraf = document.querySelector('.loader') /* находим блок Preloader */
            preloaderGraf.style.opacity = 1;
            preloaderGraf.style.display = 'flex'
            console.log('выполнить')

            // preloaderGraf.classList.remove('preloaderGraf_hidden') /* добавляем ему класс для скрытия */
            dataInput() //фунции выбора интервала графика скорости
        }
        if (el.textContent === 'Выполнить' && times.length === 0) {
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
export function click() {
    if (times.length !== 0) {
        const preloaderGraf = document.querySelector('.loader') /* находим блок Preloader */
        preloaderGraf.style.opacity = 1;
        preloaderGraf.style.display = 'flex'
        dataInput() //фунции выбора интервала графика скорости
    }
    if (times.length === 0) {
        const preloaderGraf = document.querySelector('.loader') /* находим блок Preloader */
        preloaderGraf.style.opacity = 1;
        preloaderGraf.style.display = 'flex'
        dataSelect() //фунции выбора интервала графика скорости
    }
}



export function dataInput() {
    const dateTime = times[times.length - 1]
    console.log(dateTime)
    const active = document.querySelector('.color')
    const selectSpeed = document.querySelector('.select_speed')
    selectSpeed.value = 0;

    let t01 = new Date(dateTime[0])
    let timeFrom = Math.floor(t01.setHours(t01.getHours()) / 1000)
    let t02 = new Date(dateTime[1])
    let nowDate = Math.floor(t02.setHours(t02.getHours()) / 1000)
    graftest(timeFrom, nowDate)
    times.length = 0;
}

export function dataSelect() {
    let nowDate = Math.round(new Date().getTime() / 1000)
    let nDate = new Date();
    const selectSpeed = document.querySelector('.select_speed')
    let timeFrom;
    console.log(selectSpeed.value)
    switch (selectSpeed.value) {
        case '0': {
            timeFrom = Math.round(nDate.setHours(nDate.getHours() - 24) / 1000);
            graftest(timeFrom, nowDate)
        }
            break;
        case '1': {
            timeFrom = Math.round(nDate.setHours(nDate.getHours() - 24) / 1000);
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


export function graftest(t1, t2) {
    const activeMenuGraf = document.querySelector('.activMenuGraf')
    if (activeMenuGraf.textContent === 'Давление') {
        datas(t1, t2)
    }
    if (activeMenuGraf.textContent === 'Топливо') {
        oil(t1, t2)
    }
    if (activeMenuGraf.textContent === 'Скорость') {
        speed(t1, t2)
    }
}




//function checked() {

//  const selectSpeed = document.querySelector('.select_speed');

selectSpeed.addEventListener('click', () => {
    dateInputValue.value = ''
    console.log(dateInputValue)
    inputDate.forEach(e => {
        e.value = ''
    })
})
//}
//checked()  //сбрасывает установленные значения интервала графика скорости
