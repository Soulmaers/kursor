

import { map } from '../modules/navModules/karta.js'
import { mapLocal } from '../modules/objectMainModules/class/CreateMarkersEvent.js'
import { load } from '../modules/detalisation/detalisation.js'
import { Detalisation } from '../modules/detalisationModules/class/Detalisation.js'

console.log('флеш')

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
        side[0].style.transition = 'width 0.2s ease-in-out';
        side[1].style.width = '98%'
        side[1].style.transition = 'width 0.2s ease-in-out';
        if (side[1].classList.contains('globalMaps')) {
            setTimeout(function () { map.invalidateSize(); }, 300);

        }
        if (side[1].classList.contains('main') || side[1].classList.contains('wrapper_left')) {
            setTimeout(function () { mapLocal.invalidateSize(); }, 300);
        }
        const act = document.querySelector('.activStatic').id
        const color = document.querySelector('.color')
        if (color) {
            const num = [1, 2, 3]
            num.forEach(e => {
                const chartStatic = document.querySelector(`.chartStatic${e}`)
                if (chartStatic) {
                    chartStatic.remove();
                }
            })
            // new Detalisation(document.querySelector('.activStatic'))
            setTimeout(function () {
                Promise.all([
                    load(act, 0, 1),
                    load(act, 1, 2),
                    load(act, 2, 3)
                ])

            }, 500)
        }

    }
    handleClickTwo(event) {
        const parent = event.target.parentNode
        const side = this.init(parent)
        console.log(side)
        parent.children[0].style.display = 'none'
        parent.children[1].style.display = 'block'


        side[0].style.width = '550px';
        side[0].style.transition = 'width 0.2s ease-in-out';
        side[1].style.width = '74%'
        side[1].style.transition = 'width 0.2s ease-in-out';
        if (side[1].classList.contains('globalMaps')) {
            setTimeout(function () { map.invalidateSize(); }, 300);
        }
        if (side[1].classList.contains('main') || side[1].classList.contains('wrapper_left')) {
            setTimeout(function () { mapLocal.invalidateSize(); }, 300);
        }
        const color = document.querySelector('.color')
        const act = document.querySelector('.activStatic').id
        if (color) {
            const num = [1, 2, 3]
            num.forEach(e => {
                const chartStatic = document.querySelector(`.chartStatic${e}`)
                if (chartStatic) {
                    chartStatic.remove();
                }
            })

            setTimeout(function () {
                Promise.all([
                    load(act, 0, 1),
                    load(act, 1, 2),
                    load(act, 2, 3)
                ])

            }, 500)
        }

    }
}







