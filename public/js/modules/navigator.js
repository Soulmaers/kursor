import { visual, visualNone } from './visual.js'
//import { massivionbd } from './paramsTyresView.js';

export function navigator() {
    const main = document.querySelector('.main')
    main.style.display = 'none';
    const start = document.querySelector('.start')
    start.style.display = 'flex';
    const nav = document.querySelectorAll('.listItem')
    // nav[0].classList.add('color')
    const menuGraf = document.querySelectorAll('.menu_graf')
    menuGraf[0].classList.add('activMenuGraf')
    //  visual(nav[0])
    var widthWind = document.querySelector('body').offsetWidth;
    if (widthWind <= 1200) {
        const wrapperLeft = document.querySelector('.wrapper_left')
        wrapperLeft.style.display = 'none'
    }
    nav.forEach(el => {
        el.addEventListener('click', route)
        function route() {
            nav.forEach(e => {
                el.classList.remove('color')
                visualNone(e);  //скрываем для всех кнопок левый фрейм
                // massivionbd.length = 0;
            })

            visual(el)
            const widthWind = document.querySelector('body').offsetWidth;
            if (widthWind <= 860) {
                const cblock = document.querySelector('.centerBlock')
                cblock.style.width = 100 + '%'
                const comeback = document.querySelector('.comeback')
                comeback.style.display = 'flex'
                const main = document.querySelector('.main')
                main.style.display = 'flex'
                const wrapperLeft = document.querySelector('.wrapper_left')
                wrapperLeft.style.display = 'block'
                const nameCar = document.querySelector('.color')
                const titleName = document.querySelector('.titleName')
                titleName.textContent = nameCar.children[0].textContent
            }
            if (widthWind >= 861 && widthWind <= 1200) {
                const comeback = document.querySelector('.comeback')
                comeback.style.display = 'flex'
                const sections = document.querySelector('.sections')
                sections.style.display = 'none'
                const main = document.querySelector('.main')
                main.style.display = 'flex'
                main.style.width = 100 + '%'
                main.style.justifyContent = 'center'
                const cblock = document.querySelector('.centerBlock')
                cblock.style.width = 40 + '%'
                const nameCar = document.querySelector('.color')
                const titleName = document.querySelector('.titleName')
                titleName.textContent = nameCar.children[0].textContent
                const wrapperLeft = document.querySelector('.wrapper_left')
                wrapperLeft.style.display = 'block'
            }
            else {
                return
            }
        }
    })
}

