import { visual, visualNone, clearGraf, viewOs } from './visual.js'
import { massiv } from './configurator.js';
import { massivionbd, loadParamsView } from './paramsTyresView.js';
import { geoloc, iconParams } from './wialon.js';
//import { geoPosition } from './requests.js'

export function navigator() {
    // loadParamsView()//запрос в базу и получение параметров
    const nav = document.querySelectorAll('.listItem')
    // viewOs();
    // geoloc();
    // iconParams()
    //  setInterval(iconParams, 6000)
    nav[0].classList.add('color')
    visual(nav[0])
    // console.log(nav)
    nav.forEach(el => {
        el.addEventListener('click', route)
        function route() {
            // console.log(el)
            //   console.log('запускНавигатора')

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


