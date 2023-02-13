import { visual, visualNone, clearGraf, viewOs } from './visual.js'
import { massiv } from './configurator.js';
import { massivionbd, loadParamsView } from './paramsTyresView.js';
import { geoloc } from './wialon.js';
//import { geoPosition } from './requests.js'

export function navigator(nav) {
    loadParamsView()//запрос в базу и получение параметров
    const navList = document.querySelectorAll('.carList')
    viewOs();
    //  geoloc()
    // console.log(navList)
    nav.forEach(el => {
        el.addEventListener('click', route)
        function route() {
            console.log(el)
            console.log('запускНавигатора')

            nav.forEach(e => {
                const msg = document.querySelectorAll('.msg')
                msg.forEach(it => {
                    console.log('удаляемм')
                    it.remove();
                })

                visualNone(e);  //скрываем для всех кнопок левый фрейм
                clearGraf(); //очистка графика скорости при нажатии на кнопку другой машины
                massiv.length = 0;
                massivionbd.length = 0;
            })
            visual(el)


        }

    })

}




