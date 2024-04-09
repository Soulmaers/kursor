

import { map } from '../modules/navModules/karta.js'
import { mapLocal } from '../modules/objectMainModules/class/CreateMarkersEvent.js'

export class Flasher {
    constructor() {
        this.rigthFrame = document.querySelectorAll('.rigthFrame')
        this.rigthFrame.forEach(el => {
            console.log(el)
            el.children[1].addEventListener('click', this.handleClickOne.bind(this))
            el.children[0].addEventListener('click', this.handleClickTwo.bind(this))
        })
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
        console.log(event.target.parentNode)
        const parent = event.target.parentNode
        const side = this.init(parent)
        console.log(side)
        parent.children[1].style.display = 'none'
        parent.children[0].style.display = 'block'

        side[0].style.width = '10px';
        side[0].style.transition = 'width 0s ease-in-out';
        side[1].style.width = '98%'
        side[1].style.transition = 'width 0s ease-in-out';
        if (side[1].classList.contains('globalMaps')) {
            setTimeout(function () { map.invalidateSize(); }, 300);

        }
        if (side[1].classList.contains('main') || side[1].classList.contains('wrapper_left')) {
            setTimeout(function () { mapLocal.invalidateSize(); }, 300);
        }
    }
    handleClickTwo(event) {
        const parent = event.target.parentNode
        console.time('side')
        const side = this.init(parent)
        console.timeEnd('side')
        parent.children[0].style.display = 'none'
        parent.children[1].style.display = 'block'


        side[0].style.width = '550px';
        //  side[0].style.transition = 'width 0s ease-in-out';
        side[1].style.width = '74%'
        console.log(side[1])
        console.log(side[1].clientWidth)
        // side[1].style.transition = 'width 0s ease-in-out';
        if (side[1].classList.contains('globalMaps')) {
            setTimeout(function () { map.invalidateSize(); }, 300);
        }
        if (side[1].classList.contains('main') || side[1].classList.contains('wrapper_left')) {
            setTimeout(function () { mapLocal.invalidateSize(); }, 300);
        }
    }
}







