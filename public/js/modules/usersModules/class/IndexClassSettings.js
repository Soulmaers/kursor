
import { ContentGeneration } from "./CreateContent.js"
import { ControllModal } from './ControllModal.js'
import { CreateTableControllRows } from './CreateTableControllRows.js'


export class IndexClassSettings {
    constructor(login) {
        this.login = login
        this.container = document.querySelector('.setting_container')
        this.button = document.querySelector('.global_settings')
        this.pop = document.querySelector('.popup-background')
        this.boundButton = this.init.bind(this)
        this.boundButtonClose = this.modalActivity.bind(this, this.container, this.pop, 'none') //закрываем модалку
        this.initEvent()//ствил слушатель на кнопку панели
    }

    init() {
        this.modalActivity(this.container, this.pop, 'flex') //открываем модалку
        this.addContent() //добавляем контент модуля
        this.clickNavi() //стави слушатель меню навигации
        this.initClose() //ставим слушатель на крестик


    }

    initEvent() {
        this.button.addEventListener('click', this.boundButton)
    }
    initClose() {
        const close = this.container.querySelector('.close_modal_window')
        close.addEventListener('click', this.boundButtonClose)
    }

    clickCreateObjects() {
        console.log(this.buttons)
        this.buttons[0].addEventListener('click', (event) => new ControllModal(event.target, this.pop, this.login, this.container))
    }
    modalActivity(elem, pop, flex) {
        elem.style.display = `${flex}`
        pop.style.display = `${flex}`
        pop.style.zIndex = 1
    }

    addContent() {
        this.container.innerHTML = ContentGeneration.fomraSetting()
        this.type_navi = this.container.querySelectorAll('.type_navi')
        this.naviContainer = this.type_navi[0].parentElement
    }

    addContainer(event) {
        const elements = event.target.children[0]
        const row = event.target
        const buttonText = row.getAttribute('rel')
        const index = row.getAttribute('data-att')
        this.deleteHTML()
        console.log(index)
        this.controllStows(elements, row, buttonText, index)
        new CreateTableControllRows(index, this.container)

    }
    deleteHTML() {
        const wrap = this.naviContainer.querySelector('.wrap_settings')
        if (wrap) wrap.remove()
    }
    createWrap(row, buttonText, index) {
        row.insertAdjacentHTML('afterend', ContentGeneration.createFindAndButton(buttonText, index));
        this.buttons = this.naviContainer.querySelectorAll('.button_setting')
        this.clickCreateObjects()
    }
    controllStows(elements, row, buttonText, index) {
        this.type_navi.forEach(e => {
            if (e.children[0] !== elements) {
                e.children[0].classList.remove('fa-angle-up');
                e.children[0].classList.add('fa-angle-down');
            } else {
                this.deleteHTML()
            }
        });
        if (!elements.classList.contains('fa-angle-up')) this.createWrap(row, buttonText, index)
        elements.classList.toggle('fa-angle-up');
        elements.classList.toggle('fa-angle-down');

    }
    clickNavi() {
        this.type_navi.forEach(e => e.addEventListener('click', this.addContainer.bind(this)))
    }

}