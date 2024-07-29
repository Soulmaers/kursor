
import { ContentGeneration } from "./CreateContent.js"
import { ControllModal } from './ControllModal.js'
import { Helpers } from "./Helpers.js"
import { Requests } from './RequestStaticMethods.js'
import { FilterFind } from './FilterFind.js'

//***Класс отрисовывает модальное окно  панели админа, управляет переключением элементов слева, запускает класс ControllModal */
export class IndexClassSettings {
    constructor(login) {
        this.login = login
        this.container = document.querySelector('.setting_container')
        this.button = document.querySelector('.global_settings')
        this.pop = document.querySelector('.popup-background')
        this.creater = document.querySelector('.role').getAttribute('data-att')
        this.prava = document.querySelector('.role').getAttribute('rel')
        this.boundButton = this.init.bind(this)
        this.boundButtonClose = this.modalActivity.bind(this, this.container, this.pop, 'none') //закрываем модалку
        this.initEvent()//ствил слушатель на кнопку панели
    }

    async init() {
        this.modalActivity(this.container, this.pop, 'flex') //открываем модалку
        this.addContent() //добавляем контент модуля
        await this.getAccounts()
        this.clickNavi() //стави слушатель меню навигации
        this.initClose() //ставим слушатель на крестик

    }

    async getAccounts() {
        if (this.prava === 'Курсор' || this.prava === 'Интегратор') this.creators = await Requests.getUsers(this.prava, this.creater)
    }
    initEvent() {
        this.button.addEventListener('click', this.boundButton)
    }
    initClose() {
        const close = this.container.querySelector('.close_modal_window')
        close.addEventListener('click', this.boundButtonClose)
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
        this.table = this.container.querySelector('.table_data_info')
        this.table.innerHTML = ''
        const elements = event.target.children[0]
        const row = event.target
        const buttonText = row.getAttribute('rel')
        const index = row.getAttribute('data-att')
        this.deleteHTML()
        console.log(index)
        this.controllStows(elements, row, buttonText, index, event.target)
    }
    deleteHTML() {
        const wrap = this.naviContainer.querySelector('.wrap_settings')
        if (wrap) wrap.remove()
    }
    createWrap(row, buttonText, index) {
        row.insertAdjacentHTML('afterend', ContentGeneration.createFindAndButton(buttonText, index));
        this.buttons = this.naviContainer.querySelectorAll('.button_setting')
    }
    controllStows(elements, row, buttonText, index, targetElements) {
        this.type_navi.forEach(e => {
            if (e.children[0] !== elements) {
                e.children[0].classList.remove('fa-angle-up');
                e.children[0].classList.add('fa-angle-down');
                e.classList.remove('activ_fon')
                e.children[0].classList.remove('active_fon_srows')
            } else {
                this.deleteHTML()
            }
        });
        if (!elements.classList.contains('fa-angle-up')) {
            this.createWrap(row, buttonText, index)
            new ControllModal(targetElements, this.pop, this.login, this.container, this.buttons, this.creators)
            new FilterFind(index, this.container)

        }
        elements.classList.toggle('fa-angle-up');
        elements.classList.toggle('fa-angle-down');
        elements.classList.toggle('active_fon_srows');
        elements.parentElement.classList.toggle('activ_fon')
        // this.table.innerHTML = ''
    }
    clickNavi() {
        this.type_navi.forEach(e => e.addEventListener('click', this.addContainer.bind(this)))
    }

}