

import { tech } from './tech.js'
import { DraggableContainer } from '../class/Dragdown.js'




export function viewMenuParams() {
    const sensors = document.querySelector('.sensors')
    const wrapperMap = document.querySelector('.wrapper_left')
    const tiresLink = document.querySelectorAll('.tires_link_test')
    const techInfo = document.querySelector('.techInfo')
    const grafics = document.querySelector('.grafics')
    const plug = document.querySelectorAll('.plug')
    const tableTarir = document.querySelector('.tableTarir')
    const idbaseTyres = document.querySelector('.idbaseTyres')
    const wright = document.querySelector('.wrapper_right')
    var widthWind = document.querySelector('body').offsetWidth;
    idbaseTyres.textContent = ''
    tiresLink.forEach(e => {
        e.addEventListener('click', () => {
            const acto = document.querySelector('.acto')
            acto ? acto.classList.remove('acto') : null
            if (e.classList.contains('tiresActiv')) {
                e.classList.remove('tiresActiv')
                techInfo.style.display = 'none'
                tableTarir.style.display = 'none'
                sensors.style.display = 'none'
                wrapperMap.style.display = widthWind >= 860 ? 'block' : 'none'
                if (plug[1].classList.contains('activGraf')) {
                    grafics.style.display = 'flex';
                    wrapperMap.style.display = 'none'
                }
                return
            }
            tiresLink.forEach(e => {
                tableTarir.style.display = 'none'
                e.classList.remove('tiresActiv')
            });
            e.classList.add('tiresActiv')
            const checkAlt = document.getElementById('check_Title')
            checkAlt.checked ? (sensors.style.display = 'flex', new DraggableContainer(sensors),
                wright.style.zIndex = 2,
                document.querySelector('.popup-background').style.display = 'block') : null
            techInfo.style.display = 'block'
            wrapperMap.style.display = 'none'
            grafics.style.display = 'none';
            tableTarir.style.display = 'none'
            const idbaseTyres = document.querySelector('.idbaseTyres')
            idbaseTyres.textContent = ''
            tech()//отображаем тех.характеристики+логика формул+забираем нужные данные в базу.
        })
    })
}




