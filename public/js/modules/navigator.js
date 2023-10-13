import { visual, visualNone } from './visual.js'
//import { massivionbd } from './paramsTyresView.js';
import { navMenu } from './event.js'
export function navigator() {
    const main = document.querySelector('.main')
    const auth = document.querySelector('.auth')
    const menu = document.querySelector('.menu')
    const lowList = document.querySelector('.low_list')
    const wrapperFull = document.querySelector('.wrapperFull')
    const sections = document.querySelector('.sections')
    main.style.display = 'none';
    const start = document.querySelector('.start')
    start.style.display = 'flex';
    const nav = document.querySelectorAll('.listItem')
    // const rigthFrame = document.querySelectorAll('.rigthFrame')
    // nav[0].classList.add('color')
    const headerAdmin = document.querySelector('.headerAdmin')
    const menuGraf = document.querySelectorAll('.menu_graf')
    menuGraf[0].classList.add('activMenuGraf')
    //  visual(nav[0])
    var widthWind = document.querySelector('body').offsetWidth;
    if (widthWind > 860 && widthWind <= 1200) {
        const wrapperLeft = document.querySelector('.wrapper_left')
        wrapperLeft.style.display = 'none'
        // menu.style.display = 'flex'
    }
    if (widthWind <= 860) {
        start.style.display = 'none';
        wrapperFull.style.minHeight = screen.height - 85 + 'px'
        lowList.style.height = wrapperFull.clientHeight - 20 + 'px';
        if (auth) {
            menu.appendChild(auth)
        }

        document.querySelector('.mobile_spisok').classList.add('mobile_active')
        //  rigthFrame.style.display = 'none';
    }
    nav.forEach(el => {
        el.addEventListener('click', route)
        function route(event) {
            navMenu.handleButtonClickList()
            if (el.classList.contains('color')) {
                return
            }
            else {
                nav.forEach(e => {
                    el.classList.remove('color')
                    visualNone(e);  //скрываем для всех кнопок левый фрейм
                    // massivionbd.length = 0;
                })
                const ide = el.children[0].children[0].children[0]
                console.log(ide)
                if (event.target !== ide) {
                    visual(el)
                    if (widthWind <= 860) {
                        const cblock = document.querySelector('.centerBlock')
                        cblock.style.width = 100 + '%'
                        const comeback = document.querySelector('.comeback')
                        comeback.style.display = 'flex'
                        const main = document.querySelector('.main')
                        main.style.display = 'flex'
                        const wrapperLeft = document.querySelector('.wrapper_left')
                        wrapperLeft.style.display = 'none'
                        const nameCar = document.querySelector('.color')
                        const titleName = document.querySelector('.titleName')
                        titleName.textContent = nameCar.children[0].textContent
                        sections.style.display = 'none'
                        document.querySelector('.mobile_active').classList.remove('mobile_active')
                        document.querySelector('.mobile_config').classList.add('mobile_active')
                        document.querySelector('.mainAlarm').textContent = 'Уведом.'
                        document.querySelector('.state_tyres').textContent = 'Шины'
                        document.querySelector('.rigth_icons').style.order = 2
                        document.querySelector('.config').style.order = 3
                        document.querySelector('.side').appendChild(document.querySelector('.select_type'))
                        document.querySelector('.select_type').style.order = 1
                        document.querySelectorAll('.itemSide')[1].style.order = 2

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
                }
                else {
                    return
                }
            }
        }
    })
}

