import { visual, visualNone, clearGraf, viewOs } from './visual.js'
import { massiv } from './configurator.js';
import { massivionbd, loadParamsView } from './paramsTyresView.js';
import { alarmFind } from './alarmStorage.js';

export function navigator() {
    const nav = document.querySelectorAll('.listItem')

    nav[0].classList.add('color')
    visual(nav[0])

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


setTimeout(navigator, 3000)