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
            const widthWind = document.querySelector('body').offsetWidth;
            console.log(widthWind)
            if (widthWind <= 1200) {
                console.log('ап')
                const comeback = document.querySelector('.comeback')
                comeback.style.display = 'flex'
                const sections = document.querySelector('.sections')
                sections.style.display = 'none'
                const main = document.querySelector('.main')
                main.style.display = 'flex'
                const nameCar = document.querySelector('.color')
                console.log(nameCar)
                const titleName = document.querySelector('.titleName')
                titleName.textContent = nameCar.children[0].textContent

            }

            else {
                console.log('пап')

            }

        }

    })

}


//setTimeout(navigator, 3000)