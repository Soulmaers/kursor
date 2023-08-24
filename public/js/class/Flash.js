import { geoloc } from '../modules/geo.js'

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
        start.style.display === 'none' ? geoloc() : null

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
        start.style.display === 'none' ? geoloc() : null
    }
}