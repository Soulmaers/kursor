
import { init } from './modules/menu.js'
import { speed } from './modules/speed.js'
import { liCreate } from './modules/visual.js'
import { select } from './modules/configurator.js'


//запуск функции атворизации на wialon--> запрос параметров созданых объектов--> отрисовка меню
init();

//условия для запроса графика скорости
//speed();

//отрисовка списка под параметры
//liCreate()

const detaly = document.querySelector('.detaly')
detaly.addEventListener('click', () => {
    const detalisation = document.querySelector('.detalisation')
    detalisation.style.display = 'flex'
})








const Obj = {
    'PressurePro 933': 25343786,
    'TDRMX 339': 26421451,
    'TDRMX 652': 25594204,
    'КранГаличанин Р858ОР178': 25766831

}

