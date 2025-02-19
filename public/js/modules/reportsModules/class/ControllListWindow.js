

import { Search } from './Search.js'
import { Helpers } from './Helpers.js'

export class ControllListWindow {
    constructor(container) {
        this.container = container
        this.init()
    }


    init() {
        this.caseElements()
        this.eventListener()
        new Search(this.find, this.group_list, this.object_list)
    }


    caseElements() {
        this.find = this.container.querySelector('.field_find')
        this.list_objects_reports = this.container.querySelector('.list_objects_reports')
        this.switch = this.container.querySelectorAll('.switch')
        this.span_controll = this.container.querySelectorAll('.span_controll')
        this.btns = this.container.querySelectorAll('.btn_list_rows')
        this.groupChecks = this.container.querySelectorAll('.group_checks')
        this.objectsContainer = this.container.querySelectorAll('.objects_container')
        this.numberOfChoise = this.container.querySelector('.numberOfChoise')
        this.object_list = this.container.querySelectorAll('.object_list')
        this.group_list = this.container.querySelectorAll('.group_list')
        this.reports = document.querySelector('.reports')
    }



    eventListener() {
        console.log(this.fullButtons)
        this.span_controll.forEach((e, index) => {
            e.addEventListener('click', () => {
                if (index === 0) {
                    Helpers.visiale_toggle_global(this.object_list, '-', 'block')
                }
                else {
                    console.log(this.group_list)
                    Helpers.visiale_toggle_global(this.object_list, '+', 'none')
                }

            })

        })
        this.find.addEventListener('focus', () => this.openRows('block'))
        this.switch.forEach(e => e.addEventListener('click', () => Helpers.toggleWiewList(e)))
        this.btns.forEach(e => e.addEventListener('click', () => this.hiddenWindowList(e)))
        this.groupChecks.forEach(e => e.addEventListener('change', () => this.toggleCheck(e)))
        document.addEventListener('click', (event) => this.closeOnClickOutside(event));
    }
    openRows(prop) {
        this.list_objects_reports.style.display = `${prop}`
    }

    closeOnClickOutside(event) {
        console.log('тут')
        if (!this.list_objects_reports.contains(event.target) && !this.find.contains(event.target) && !this.reports.contains(event.target)) {
            this.openRows('none');
            this.objectCheked = [...this.container.querySelectorAll('.object_checks')].filter(e => e.checked)
            this.numberOfChoise.textContent = `(${this.objectCheked.length})`
            this.find.value = `(выбрано ${this.objectCheked.length} объектов)`
        }
    }
    toggleCheck(e) {
        e.classList.toggle('toggleClass')
        const wrapObject = e.parentElement.nextElementSibling
        const checkboxes = wrapObject.querySelectorAll('.object_checks')
        if (e.classList.contains('toggleClass')) {
            checkboxes.forEach(e => e.checked = true)
        }
        else {
            checkboxes.forEach(e => e.checked = false)
        }
    }

    hiddenWindowList(e) {
        this.openRows('none')

        if (e.classList.contains('cancel_start')) {
            this.checkedCheckboxes = this.container.querySelectorAll('.checkbox_item input[type="checkbox"]:checked');
            this.toggleClass = this.container.querySelectorAll('.toggleClass')
            this.checkedCheckboxes.forEach(e => e.checked = false)
            this.objectsContainer.forEach(e => e.style.display = 'block')
            this.toggleClass.forEach(e => e.classList.remove('toggleClass'))
            this.switch.forEach(e => e.textContent = '-')
            this.numberOfChoise.textContent = '(0)'
            this.find.value = ''
        }
        else {
            this.objectCheked = [...this.container.querySelectorAll('.object_checks')].filter(e => e.checked)
            this.numberOfChoise.textContent = `(${this.objectCheked.length})`
            this.find.value = `(выбрано ${this.objectCheked.length} объектов)`
        }
    }

}


