import { alarmFind } from '../modules/alarmStorage.js'

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