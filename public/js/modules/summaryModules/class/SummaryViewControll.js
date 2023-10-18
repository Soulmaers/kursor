
export class SummaryViewControll {
    constructor() {
        this.arrayinterval = ['', 'Вчера', 'Неделя']
        this.params = document.querySelectorAll('.name_list')
        this.selectOne = document.querySelector('.select_summary')[0]
        this.selectTwo = document.querySelector('.select_summary')[1]


        this.params.forEach(el => el.addEventListener('click', this.toggleClassAndParamsCollection.bind(this)))

    }

    toggleClassAndParamsCollection(event) {
        this.params.forEach(e => {
            if (e.classList.contains('clickToggle'))
                e.classList.remove('clickToggle')
        })
        console.log(this)
        event.target.classList.toggle('clickToggle')

    }

}