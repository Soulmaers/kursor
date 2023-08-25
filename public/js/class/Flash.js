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
                this.elem1.style.display = 'none';
            }
        }

    }
}