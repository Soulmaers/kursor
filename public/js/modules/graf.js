
import { speed } from './charts/speed.js'
import { oil } from './charts/oil.js'
import { datas } from './charts/bar.js'


const btnForm = document.querySelectorAll('.btm_form')
const inputDate = document.querySelectorAll('.input_date')
const selectSpeed = document.querySelector('.select_speed')






btnForm.forEach(el =>
    el.addEventListener('click', () => {
        if (el.textContent === 'Выполнить' && inputDate[0].value !== '' && inputDate[1].value !== '') {
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
        if (el.textContent === 'Выполнить' && inputDate[0].value == '' && inputDate[1].value == '') {
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
            inputDate.forEach(e => {
                e.value = ''
            })
        }
    })
)
export function click() {
    const inputDate = document.querySelectorAll('.input_date')
    if (inputDate[0].value !== '' && inputDate[1].value !== '') {
        const preloaderGraf = document.querySelector('.loader') /* находим блок Preloader */
        preloaderGraf.style.opacity = 1;
        preloaderGraf.style.display = 'flex'
        dataInput() //фунции выбора интервала графика скорости
    }
    if (inputDate[0].value == '' && inputDate[1].value == '') {
        const preloaderGraf = document.querySelector('.loader') /* находим блок Preloader */
        preloaderGraf.style.opacity = 1;
        preloaderGraf.style.display = 'flex'
        dataSelect() //фунции выбора интервала графика скорости
    }
}



export function dataInput() {

    const active = document.querySelector('.color')
    const inputDate = document.querySelectorAll('.input_date')
    const selectSpeed = document.querySelector('.select_speed')
    selectSpeed.value = 0;
    const arrDate = [];

    console.log(active.id)
    inputDate.forEach(e => {
        arrDate.push(e.value)
    })
    let t01 = new Date(arrDate[0])
    let timeFrom = Math.floor(t01.setHours(t01.getHours()) / 1000)
    let t02 = new Date(arrDate[1])
    let nowDate = Math.floor(t02.setHours(t02.getHours()) / 1000)
    graftest(timeFrom, nowDate)
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




function checked() {
    const selectSpeed = document.querySelector('.select_speed');
    const inputDate = document.querySelectorAll('.input_date')
    selectSpeed.addEventListener('click', () => {
        inputDate.forEach(e => {
            e.value = ''
        })
    })
}
checked()  //сбрасывает установленные значения интервала графика скорости
