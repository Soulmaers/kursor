
import { init } from './modules/menu.js'
import { btnDel } from './modules/event.js'
import { liCreate } from './modules/visual.js'
import { select } from './modules/configurator.js'
import { radCecked } from './modules/tech.js'



let kluch;
const role = document.querySelectorAll('.log')[0].textContent
const login = document.querySelectorAll('.log')[1].textContent
const save = document.querySelector('.save')
const clear = document.querySelector('.clear')
const dropdown = document.querySelector('.dropdown')
const modal = document.querySelectorAll('.modal')
const radioModule = document.querySelector('.radioModule')
const radioVal = document.querySelector('.radioVal')




console.log(login)

if (login !== 'TDRMX') {
    console.log('старт11')
    kluch = '0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178'
    if (role !== 'Пользователь') {
        init(kluch);
        btnDel();
        radCecked();
    }
}
if (login === 'TDRMX') {
    console.log('старт22')
    radioVal.style.marginTop = '10px'
    radioVal.style.marginLeft = '10px'
    radioVal.style.justifyContent = 'start'
    kluch = '7d21706dbf99ed8dd9257b8b1fcc5ab3FDEAE2E1E11A17F978AC054411BB0A0CBD9051B3'
    init(kluch);
}

//запуск функции атворизации на wialon--> запрос параметров созданых объектов--> отрисовка меню


//условия для запроса графика скорости
//speed();

//отрисовка списка под параметры
liCreate()










const Obj = {
    'PressurePro 933': 25343786,
    'TDRMX 339': 26421451,
    'TDRMX 652': 25594204,
    'КранГаличанин Р858ОР178': 25766831

}


document.addEventListener("DOMContentLoaded", function (event) {
    /*ПОЛУЧАЕТ ТЕКУЩУЮ ШИРИНУ ЭКРАНА*/
    var widthWind = document.querySelector('body').offsetWidth;
    console.log(widthWind)
    if (widthWind <= 640) {
        console.log('ап')
    }
    console.log('пап')
});