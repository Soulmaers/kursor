import { visual, visualNone } from './visual.js'
import { NavigationMenu } from './navModules/NavigatorClass.js'
import { IconStatus } from './iconModules/class/IconStatus.js'
import { GrafikView } from './grafikModules/class/GrafikView.js'
import { AlarmControll } from './alarmModules/class/AlarmControll.js'
export let iconStatusClick;
export let grafClick;
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
    const statStart = document.querySelector('.stat_start').classList.add('tablo')
    iconStatusClick = new IconStatus(nav)
    grafClick = new GrafikView(nav)

    new AlarmControll(nav)
    const navMenu = new NavigationMenu();
    navMenu.init();

    const menuGraf = document.querySelectorAll('.menu_graf')
    menuGraf[0].classList.add('activMenuGraf')
    var widthWind = document.querySelector('body').offsetWidth;
    if (widthWind > 860 && widthWind <= 1200) {
        const wrapperLeft = document.querySelector('.wrapper_left')
        wrapperLeft.style.display = 'none'
    }
    if (widthWind <= 860) {
        start.style.display = 'none';
        wrapperFull.style.minHeight = screen.height - 85 + 'px'
        lowList.style.height = wrapperFull.clientHeight - 20 + 'px';
        if (auth) {
            menu.appendChild(auth)
        }
        document.querySelector('.mobile_spisok').classList.add('mobile_active')
    }
    nav.forEach(el => {
        el.addEventListener('click', route)
        function route(event) {
            navMenu.handleButtonClickList()
            if (el.classList.contains('color') || event.target.classList.contains('checkInList')
                || event.target.classList.contains('map_unit')
                || event.target.classList.contains('report_unit')
                || event.target.classList.contains('deleteObject')) {
                return
            }
            else {
                nav.forEach(e => {
                    el.classList.remove('color')
                    visualNone(e);  //скрываем для всех кнопок левый фрейм
                })
                const ide3 = el.children[0].children[2]
                const ide2 = el.children[0].children[1]
                const ide1 = el.children[0].children[0]

                if (event.target !== ide1 && event.target !== ide2 && event.target !== ide3) {
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

