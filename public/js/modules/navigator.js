import { visual, visualNone, clearGraf, viewOs } from './visual.js'
import { massiv } from './configurator.js';
import { massivionbd } from './paramsTyresView.js';
import { btnClear } from './event.js';
//import { geoPosition } from './requests.js'

export function navigator() {
    const nav = document.querySelectorAll('.car')


    nav.forEach(el => {
        el.addEventListener('click', route)
        function route() {
            console.log(el)

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




