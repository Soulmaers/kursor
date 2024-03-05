
import { alarmFind } from '../modules/alarmStorage.js'
import { map } from '../modules/navModules/karta.js'
import { mapLocal } from '../modules/objectMainModules/class/CreateMarkersEvent.js'
import { initCharts } from '../modules/spisok.js'
import { load } from '../modules/detalisation.js'
export class Flash {
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



export class CloseBTN {
    constructor(elem1, elem2, elem3) {
        this.elem1 = elem1,
            this.elem2 = elem2
        this.elem3 = elem3
        document.addEventListener('click', this.handleClickOutside.bind(this))
    }

    handleClickOutside(event) {
        const isClickedOnElem1 = this.elem1.contains(event.target);
        const wrapMap = document.querySelector('.wrapMap');
        const elemMap = wrapMap?.contains(event.target);

        if (this.elem3) {
            const isClickedOnElem2 = this.elem2.contains(event.target);
            const isClickedOnElem3 = this.elem3.contains(event.target);
            if (!isClickedOnElem1 && !isClickedOnElem2 && !isClickedOnElem3) {
                this.elem1.style.display = 'none';
                this.elem1.classList.remove('clickLog');
            }
        } else {
            if (!isClickedOnElem1) {
                if (this.elem1.classList.contains('alarmStorage') && !elemMap) {
                    this.elem1.style.display = 'none';
                    this.elem2.classList.remove('check_alarm');
                    wrapMap?.remove();
                    alarmFind();
                }
                if (!this.elem1.classList.contains('alarmStorage')) {
                    this.elem1.style.display = 'none';
                }
            }
        }
    }
}



export class ResizeContainer {
    constructor(leftContainer, rightContainer, resizeHandle) {
        this.leftContainer = leftContainer;
        this.rightContainer = rightContainer;
        this.sliderBar = resizeHandle;
        this.currentX = 0;
        this.isResizing = false;

        this.sliderBar.addEventListener('mousedown', this.startResize.bind(this));
        document.addEventListener('mousemove', this.resize.bind(this));
        document.addEventListener('mouseup', this.stopResize.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    startResize(event) {
        this.isResizing = true;
        this.currentX = event.clientX;
        this.sliderBar.style.userSelect = 'none';
    }
    resize(event) {
        if (!this.isResizing) return;

        const deltaX = event.clientX - this.currentX;
        const newWidth = this.leftContainer.offsetWidth + deltaX;

        if (newWidth < 330 || newWidth > 1200) {
            this.stopResize();
            return;
        }
        this.leftContainer.style.width = newWidth + 'px';
        this.rightContainer.style.width = `calc(100% - ${newWidth}px)`;
        this.currentX = event.clientX;
    }
    handleResize() {
        const newWidth = this.leftContainer.offsetWidth;

        if (newWidth < 100) {
            this.leftContainer.style.width = '100px';
            this.rightContainer.style.width = `calc(100% - 100px)`;
        } else if (newWidth > 900) {
            this.leftContainer.style.width = '900px';
            this.rightContainer.style.width = `calc(100% - 900px)`;
        }
    }

    stopResize(event) {
        if (!this.isResizing) return; // добавляем проверку
        this.isResizing = false;
        this.sliderBar.style.removeProperty('user-select');
        console.log('дубль!!!')
        const color = document.querySelector('.color')
        const act = document.querySelector('.activStatic').id
        if (color) {
            setTimeout(function () {
                Promise.all([
                    load(act, 0, 1),
                    load(act, 1, 2),
                    load(act, 2, 3)
                ])

            }, 500)
        }
        setTimeout(function () { initCharts.createChart(); }, 300);
    }
}

