import { geoloc } from '../modules/geo.js'
import { alarmFind } from '../modules/alarmStorage.js'


export class Flash {
    constructor(one, two, three, sec) {
        this.one = one,
            this.two = two,
            this.three = three
        this.sec = sec
        this.one.addEventListener('click', this.handleClickOne.bind(this))
        this.two.addEventListener('click', this.handleClickTwo.bind(this))
    }
    handleClickOne() {
        console.log(this.sec)
        this.one.style.display = 'none'
        this.two.style.display = 'block'
        this.three.style.opacity = '0';
        this.three.style.transition = 'opacity 0.5s ease-in-out';
        setTimeout(() => {
            this.three.style.display = 'none';
        }, 300);
        if (this.sec) {
            this.sec.style.width = '10px';
            this.sec.style.transition = 'width 0.3s ease-in-out';

        }
        const start = document.querySelector('.start')
        start.style.display === 'none' ? (geoloc()) : null

    }
    handleClickTwo() {
        this.two.style.display = 'none'
        this.one.style.display = 'block'
        this.three.style.opacity = '1';
        this.three.style.width = 550 + 'px'
        setTimeout(() => {
            this.three.style.display = 'flex';
        }, 300);
        this.three.style.transition = 'opacity 0.5s ease-in-out';

        if (this.sec) {
            this.sec.style.width = '35%';
            this.sec.style.transition = 'width 0.3s ease-in-out';
        }
        const start = document.querySelector('.start')
        start.style.display === 'none' ? (geoloc()) : null
    }
}



export class CloseBTN {
    constructor(elem1, elem2, elem3, elem4) {
        this.elem1 = elem1,
            this.elem2 = elem2
        this.elem3 = elem3
        this.elem4 = elem4
        this.handleClickOutside = this.handleClickOutside.bind(this)
        document.addEventListener('click', this.handleClickOutside)
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
        if (this.elem4) {
            const isClickedOnElem1 = this.elem1.contains(event.target);
            const isClickedOnElem2 = this.elem2.contains(event.target);
            if (!isClickedOnElem1 && !isClickedOnElem2) {
                this.elem1.style.display = 'none';
                this.elem3.style.display = 'block';
                this.elem2.style.display = 'none'
                alarmFind()
                const mapss = document.getElementById('mapOil')
                if (mapss) {
                    mapss.remove();
                }
            }
        }
        else {
            const isClickedOnElem1 = this.elem1.contains(event.target);
            if (!isClickedOnElem1) {
                console.log('закрыли')
                this.elem1.style.display = 'none';
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
        console.log(this.leftContainer)
        console.log(this.rightContainer)
        const dx = event.clientX - this.initialX;
        const newLeftWidth = this.originalLeftContainerWidth + dx;
        const newRightWidth = this.originalRightContainerWidth - dx;
        this.leftContainer.style.width = `${newLeftWidth}px`;
        this.rightContainer.style.width = `${newRightWidth}px`;

        this.isResizing = false;
        this.initialX = null;
        this.resizeHandle.style.transform = 'translateX(0)';
    }
}