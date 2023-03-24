
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


//
/*ПОЛУЧАЕТ ТЕКУЩУЮ ШИРИНУ ЭКРАНА*/
//function point() {

/*
var widthWind = document.querySelector('body').offsetWidth;
console.log(widthWind)
if (widthWind <= 860) {
    console.log('ап')
    const main = document.querySelector('.main')
    main.style.display = 'none'
    // return

}
if (widthWind > 860 && widthWind <= 1200) {
    console.log('медиум')
    const wLeft = document.querySelector('.wrapper_left')
    wLeft.style.display = 'none'
<<<<<<< HEAD
    //  return
=======
    const main = document.querySelector('.main')
    main.style.display = 'flex'
    // return
>>>>>>> 9cf9a4a95913b5e50f38e0bdd3377b1dbeeea7aa
}
else {
    const wLeft = document.querySelector('.wrapper_left')
    wLeft.style.display = 'block'
    console.log('пап')


}*/





//setInterval(point, 300)
//});