

import { map } from '../modules/navModules/karta.js'
import { mapLocal } from '../modules/objectMainModules/class/CreateMarkersEvent.js'

export class Flasher {
    constructor() {
        this.rigthFrame = document.querySelectorAll('.rigthFrame')
        this.searchList = document.querySelector('.search_list')
        this.rightContainerWidth = null
        this.rigthFrame.forEach(el => {
            console.log(el)
            el.children[1].addEventListener('click', this.handleClickOne.bind(this))
            el.children[0].addEventListener('click', this.handleClickTwo.bind(this))
        })
        this.wrapLeft = document.querySelector('.wrapper_left').clientWidth
    }
    init(parent) {
        let prevElement = parent.previousElementSibling;
        while (prevElement) {
            if (window.getComputedStyle(prevElement).display !== "none") {
                break;
            }
            prevElement = prevElement.previousElementSibling;
        }
        let nextElement = parent.nextElementSibling;
        while (nextElement) {
            if (window.getComputedStyle(nextElement).display !== "none") {
                break;
            }
            nextElement = nextElement.nextElementSibling;
        }
        return [prevElement, nextElement]
    }
    handleClickOne(event) {
        const parent = event.target.parentNode
        const side = this.init(parent)
        console.log(side)
        parent.children[1].style.display = 'none'
        parent.children[0].style.display = 'block'
        console.log(side[0])
        console.log(side[1])
        if (side[0].classList.contains('sections')) {
            side[0].style.width = '10px';
            side[1].style.width = '98%'
        }
        else {
            this.rightContainerWidth = document.querySelector('.main').offsetWidth
            side[0].style.width = '0px';
            side[0].style.margin = 0
            side[1].style.flexGrow = '1'
        }

        if (side[1].classList.contains('globalMaps')) {
            setTimeout(function () { map.invalidateSize(); }, 300);

        }
        if (side[1].classList.contains('main') || side[1].classList.contains('wrapper_left')) {
            setTimeout(function () { mapLocal.invalidateSize(); }, 300);
        }
    }
    handleClickTwo(event) {
        const parent = event.target.parentNode
        const side = this.init(parent)
        parent.children[0].style.display = 'none'
        parent.children[1].style.display = 'block'
        console.log(side[0])
        console.log(side[1])
        if (side[0].classList.contains('sections')) {
            side[0].style.width = '550px';
            side[1].style.width = '74%';
        }
        else {

            side[0].style.margin = '0 10px'
            side[0].style.width = '495px';
            side[1].style.flexGrow = '1'
        }
        if (side[1].classList.contains('globalMaps')) {
            setTimeout(function () { map.invalidateSize(); }, 300);
        }
        if (side[1].classList.contains('main') || side[1].classList.contains('wrapper_left')) {
            setTimeout(function () { mapLocal.invalidateSize(); }, 300);
        }
    }
}







