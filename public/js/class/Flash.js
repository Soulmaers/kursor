

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
        this.one.style.display = 'none'
        this.three.style.display = 'none'
        this.two.style.display = 'block'
        this.sec.style.width = '10px'
        this.sec.style.transition = 'width 0.3s ease-in-out';
    }
    handleClickTwo() {
        this.two.style.display = 'none'
        this.three.style.display = 'flex'
        this.one.style.display = 'block'
        this.sec.style.width = 35 + '%'
        this.sec.style.transition = 'width 0.3s ease-in-out';
    }

}