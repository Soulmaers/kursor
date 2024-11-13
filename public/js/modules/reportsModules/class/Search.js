


export class Search {
    constructor(element, groups, objects) {
        this.element = element
        this.groups = groups
        this.objects = objects
        this.globalArray = []
        this.init()
    }


    init() {
        console.log(this.groups)
        this.pushArray() //добавляем элементы в массив
        this.eventlistener() //слушаем импут ввода текста
    }



    pushArray() {
        this.globalArray = [
            ...[...this.groups].map(e => e.lastElementChild.textContent),
            ...[...this.objects].map(e => e.lastElementChild.textContent)
        ];
    }


    eventlistener() {
        this.element.addEventListener('input', (event) => this.onElementInput(event))
    }


    onElementInput(event) {
        this.hidden()
        const value = event.target.value.trim();
        if (value === '') {
            this.afterFilterArray = []; // Или можно оставить пустым массивом
            this.viewAllObjects(); // Вызовите find, чтобы скрыть все элементы
            return;
        }
        this.afterFilterArray = this.globalArray.filter(e => e.toLowerCase().indexOf(value.toLowerCase()) !== -1)
        this.find()
    }

    hidden() {
        this.groups.forEach(e => e.style.display = 'none')
        this.objects.forEach(e => {
            e.style.display = 'none'
            e.parentElement.previousElementSibling.style.display = 'none'
            e.parentElement.previousElementSibling.children[0].textContent = '+'
            e.parentElement.previousElementSibling.children[0].classList.remove('toggleClass')
            e.parentElement.style.display = 'none'
        })
    }

    viewAllObjects() {
        this.groups.forEach(e => e.style.display = 'flex')
        this.objects.forEach(e => {
            e.style.display = 'flex'
            e.parentElement.previousElementSibling.style.display = 'flex'
            e.parentElement.previousElementSibling.children[0].textContent = '+'
            e.parentElement.previousElementSibling.children[0].classList.remove('toggleClass')
            e.parentElement.style.display = 'none'
        })
    }
    find() {
        this.groupsFind()
        this.objectsFind()
    }


    objectsFind() {
        this.objects.forEach(e => {
            if (this.afterFilterArray.includes(e.lastElementChild.textContent)) {
                e.style.display = 'flex'
                e.parentElement.previousElementSibling.style.display = 'flex'
                e.parentElement.previousElementSibling.children[0].textContent = '-'
                e.parentElement.previousElementSibling.children[0].classList.add('toggleClass')
                e.parentElement.style.display = 'block'
            }
        })

    }


    groupsFind() {
        this.groups.forEach(e => {
            if (this.afterFilterArray.includes(e.lastElementChild.textContent)) {
                e.style.display = 'flex'
                const objects = e.nextElementSibling.querySelectorAll('.object_list')
                objects.forEach(el => el.style.display = 'flex')
            }
        })
    }
}