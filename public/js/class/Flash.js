
import { alarmFind } from '../modules/alarmStorage.js'
import { map } from '../modules/navModules/karta.js'
import { mapLocal } from '../modules/objectMainModules/class/CreateMarkersEvent.js'
import { initCharts } from '../modules/spisok.js'
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
        side[0].style.transition = 'width 0.3s ease-in-out';
        side[1].style.width = '98%'
        side[1].style.transition = 'width 0.3s ease-in-out';
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
        console.log(side)
        parent.children[0].style.display = 'none'
        parent.children[1].style.display = 'block'
        side[0].style.width = '550px';
        side[0].style.transition = 'width 0.3s ease-in-out';
        side[1].style.width = '74%'
        side[1].style.transition = 'width 0.3s ease-in-out';
        if (side[1].classList.contains('globalMaps')) {
            setTimeout(function () { map.invalidateSize(); }, 300);
        }
        if (side[1].classList.contains('main') || side[1].classList.contains('wrapper_left')) {
            setTimeout(function () { mapLocal.invalidateSize(); }, 300);
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
        if (this.elem3) {
            const isClickedOnElem1 = this.elem1.contains(event.target);
            const isClickedOnElem2 = this.elem2.contains(event.target);
            const isClickedOnElem3 = this.elem3.contains(event.target);
            if (!isClickedOnElem1 && !isClickedOnElem2 && !isClickedOnElem3) {
                this.elem1.style.display = 'none';
                this.elem1.classList.remove('clickLog')
            }
        }
        else {
            const isClickedOnElem1 = this.elem1.contains(event.target);
            if (!isClickedOnElem1) {
                this.elem1.style.display = 'none';
                if (this.elem1.classList.contains('alarmStorage')) {
                    this.elem2.classList.remove('check_alarm')
                    const wrapMap = document.querySelector('.wrapMap')
                    if (wrapMap) {
                        wrapMap.remove();
                    }
                    alarmFind()
                }

            }
        }

    }
}



export class ResizeContainer {
    constructor(leftContainer, rightContainer, resizeHandle) {
        this.leftContainer = leftContainer;
        this.rightContainer = rightContainer;
        this.resizeHandle = resizeHandle;
        this.isResizing = false;
        this.initialX = null;
        // Add event listeners
        this.resizeHandle.addEventListener('mousedown', this.startResize.bind(this));
        document.addEventListener('mousemove', this.resize.bind(this));
        document.addEventListener('mouseup', this.stopResize.bind(this));
    }
    startResize(event) {
        event.preventDefault()
        this.isResizing = true;
        this.initialX = event.clientX;
        this.originalLeftContainerWidth = this.leftContainer.offsetWidth;
        this.originalRightContainerWidth = this.rightContainer.offsetWidth;
    }
    resize(event) {
        if (!this.isResizing) {
            return;
        }
        const dx = event.clientX - this.initialX;
        const minContainerWidth = 50; // Set the minimum width (pixels) for containers
        const newLeftWidth = this.originalLeftContainerWidth + dx;
        const newRightWidth = this.originalRightContainerWidth - dx;

        if (newLeftWidth < minContainerWidth || newRightWidth < minContainerWidth) {
            return;
        }
        this.resizeHandle.style.transform = `translateX(${dx}px)`;

    }
    stopResize(event) {
        if (!this.isResizing) {
            return;
        }
        const dx = event.clientX - this.initialX;
        const newLeftWidth = this.originalLeftContainerWidth + dx;
        const newRightWidth = this.originalRightContainerWidth - dx;
        this.leftContainer.style.width = `${newLeftWidth}px`;
        this.rightContainer.style.width = `${newRightWidth}px`;
        this.isResizing = false;
        this.initialX = null;
        this.resizeHandle.style.transform = 'translateX(0)';
        setTimeout(function () { initCharts.createChart(); }, 300);
    }
}

