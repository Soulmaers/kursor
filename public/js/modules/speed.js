import { graf } from './graf.js'

export function speed(arrCar) {
    const btnForm = document.querySelectorAll('.btm_form')
    const grafView = document.querySelector('.grafik1')
    const inputDate = document.querySelectorAll('.input_date')
    const selectSpeed = document.querySelector('.select_speed')
    btnForm.forEach(el =>
        el.addEventListener('click', () => {
            if (el.textContent === 'Выполнить' && inputDate[0].value !== '' && inputDate[1].value !== '') {
                grafView.style.display = 'block'
                dataInput(arrCar) //фунции выбора интервала графика скорости
            }
            if (el.textContent === 'Выполнить' && inputDate[0].value == '' && inputDate[1].value == '') {
                grafView.style.display = 'block'
                dataSelect(arrCar) //фунции выбора интервала графика скорости
            }
            if (el.textContent === 'Очистить') {
                selectSpeed.value = 0;
                inputDate.forEach(e => {
                    e.value = ''
                    grafView.style.display = 'none'
                })
            }
        })
    )
}

function dataInput(arrCar) {
    arrCar.forEach(it => {
        const active = document.querySelector('.color')
        console.log(active)
        if (it.nm === active.textContent) {
            const inputDate = document.querySelectorAll('.input_date')
            const selectSpeed = document.querySelector('.select_speed')
            selectSpeed.value = 0;
            const arrDate = [];
            inputDate.forEach(e => {
                arrDate.push(e.value)
            })
            let t01 = new Date(arrDate[0])
            let timeFrom = Math.floor(t01.setHours(t01.getHours()) / 1000)
            let t02 = new Date(arrDate[1])
            let nowDate = Math.floor(t02.setHours(t02.getHours()) / 1000)
            graf(timeFrom, nowDate, 30, it.id) //параметров для запроса на wialon данных скорости и времени
        }
    })
}

function dataSelect(arrCar) {
    arrCar.forEach(it => {
        const active = document.querySelector('.color')
        console.log(active)
        if (it.nm === active.textContent) {
            console.log(active)
            console.log(it.id)
            //  speed(it.id)//условия для запроса графика скорости
            let nowDate = Math.round(new Date().getTime() / 1000)
            let nDate = new Date();
            const selectSpeed = document.querySelector('.select_speed')
            switch (selectSpeed.value) {
                case '1': {
                    let timeFrom = Math.round(nDate.setHours(nDate.getHours() - 24) / 1000);
                    console.log(timeFrom)
                    graf(timeFrom, nowDate, 30, it.id)
                }
                    break;
                case '2': {
                    let timeFrom = Math.round(nDate.setDate(nDate.getDate() - 7) / 1000);
                    graf(timeFrom, nowDate, 100, it.id)
                }
                    break;
                case '3': {
                    let timeFrom = Math.round(nDate.setMonth(nDate.getMonth() - 1) / 1000);
                    graf(timeFrom, nowDate, 300, it.id)
                }
                    break;
            }
        }
    })
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
