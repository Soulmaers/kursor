
import { ContentGeneration } from "./CreateContent.js"
import { ControllModal } from './ControllModal.js'
import { Tooltip } from '../../../class/Tooltip.js'
import { Requests } from './RequestStaticMethods.js'
import { FilterFind } from './FilterFind.js'
import { Helpers } from './Helpers.js'

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
        this.boundButtonClose = this.modalActivity.bind(this, this.container, this.pop, 'none', 1) //закрываем модалку
        this.handleIconClick = this.handleIconClick.bind(this);
        this.initEvent()//ствил слушатель на кнопку панели
        this.ierarhiaClick = this.ierarhiaClick.bind(this)
        this.closeIerarhiaClick = this.closeIerarhiaClick.bind(this)

    }

    async init() {
        this.modalActivity(this.container, this.pop, 'flex', 1) //открываем модалку
        this.addContent() //добавляем контент модуля
        await this.getAccounts()
        this.clickNavi() //стави слушатель меню навигации
        this.initClose() //ставим слушатель на крестик
        this.eventIerarhis()
    }

    async getAccounts() {
        if (this.prava === 'Курсор' || this.prava === 'Интегратор') this.creators = await Requests.getUsers(this.prava, this.creater)
        this.struktura = await Helpers.getAccountAll()
        console.log(this.struktura)
        this.addIerarhia()
    }
    initEvent() {
        this.button.addEventListener('click', this.boundButton)
    }
    initClose() {
        const close = this.container.querySelector('.close_modal_window')
        close.addEventListener('click', this.boundButtonClose)
    }
    addIerarhia() {
        const accountsById = new Map(this.struktura.uniqueAccounts.map(account => [account.incriment, {
            nameAccount: account.name,
            users: [],
            objects: [],
            groups: [],
            retras: []
        }]));
        this.struktura.uniqueUsers.forEach(user => { const account = accountsById.get(user.incriment_account); if (account) account.users.push(user.name); });
        this.struktura.uniqueObjects.forEach(object => { const account = accountsById.get(object.incriment_account); if (account) account.objects.push(object.name); });
        this.struktura.uniqueGroups.forEach(group => { const account = accountsById.get(group.incriment_account); if (account) account.groups.push(group.name); });
        this.struktura.uniqueRetras.forEach(retra => { const account = accountsById.get(retra.incriment_account); if (account) account.retras.push(retra.name); });
        const data = Array.from(accountsById.values());
        this.bodyIerarhia = document.querySelector('.body_ierarhia')
        console.log(this.bodyIerarhia)
        this.bodyIerarhia.innerHTML = ContentGeneration.addIerarhia(data)
    }
    eventIerarhis() {
        this.checkIer = document.querySelectorAll('.check_ier')
        this.iconIerarhia = document.querySelector('.ierarhia')
        this.close_ierarhia = document.querySelector('.close_ierarhia')
        this.iconIerarhia.removeEventListener('click', this.ierarhiaClick);  // Удаляем обработчик
        this.iconIerarhia.addEventListener('click', this.ierarhiaClick);
        this.close_ierarhia.removeEventListener('click', this.closeIerarhiaClick);  // Удаляем обработчик
        this.close_ierarhia.addEventListener('click', this.closeIerarhiaClick);
        this.checkIer.forEach(e => e.addEventListener('click', (e) => {
            this.controllSlash(e)
        }))
    }

    controllSlash(event) {
        const elem = event.target
        const atribute = elem.getAttribute('rel')
        atribute === 'plus' ? elem.nextElementSibling.classList.add('slash_check') : elem.previousElementSibling.classList.add('slash_check')
        atribute === 'plus' ? elem.parentElement.nextElementSibling.classList.add('no_flex_element') : elem.parentElement.nextElementSibling.classList.remove('no_flex_element')
        elem.classList.toggle('slash_check')
    }
    ierarhiaClick() {
        this.ierarhi = document.querySelector('.window_list')
        this.modalActivity(this.ierarhi, this.pop, 'flex', 3)
    }
    closeIerarhiaClick() {
        this.modalActivity(this.ierarhi, this.pop, 'none', 3)
    }
    modalActivity(elem, pop, flex, num) {
        elem.style.display = `${flex}`
        pop.style.display = `${flex}`
        pop.style.zIndex = num
    }

    addContent() {
        this.container.innerHTML = ContentGeneration.fomraSetting(this.prava)
        this.type_navi = this.container.querySelectorAll('.type_navi')
        this.naviContainer = this.type_navi[0].parentElement
    }


    viewIcons() {
        this.wrapIcons = this.container.querySelector('.icons_clear_rows')
        this.wrapIcons.classList.add('flex_element')
    }
    addContainer(el) {
        this.viewIcons()
        this.table = this.container.querySelector('.table_data_info')
        this.table.innerHTML = ''
        const elements = el.children[0]
        const row = el
        const buttonText = row.getAttribute('rel')
        const index = row.getAttribute('data-att')
        this.deleteHTML()
        this.controllStows(elements, row, buttonText, index, el)
        this.filterRows()
    }

    filterRows() {
        this.icons = this.wrapIcons.querySelectorAll('.position_icons');
        this.tolltipOpen(this.icons[0], ['Скрыть/Отобразить активные'])
        this.tolltipOpen(this.icons[1], ['Скрыть.Отобразить удаленные'])
        // Удаляем существующие обработчики событий, если они уже были добавлены
        this.icons.forEach(el => {
            el.classList.remove('color_gray')
            el.removeEventListener('click', this.handleIconClick);  // Удаляем обработчик
        });
        // Добавляем новые обработчики событий
        this.icons.forEach(el => el.addEventListener('click', this.handleIconClick));
    }

    tolltipOpen(element, text) {
        new Tooltip(element, text)
    }
    // Отдельный метод для обработки клика по иконке
    handleIconClick(event) {
        const el = event.currentTarget;
        el.classList.toggle('color_gray');
        this.promoCheck();  // Перепроверяем состояние иконок после клика
    }

    promoCheck() {
        // Обновляем список строк
        this.rows = this.container.querySelectorAll('.rows_stata');
        this.sleepblock = this.container.querySelectorAll('.sleepblock');
        // Определяем состояние иконок
        const isNodeletesActive = this.wrapIcons.querySelector('[rel="deletes"]').classList.contains('color_gray');
        const isOtherActive = Array.from(this.icons).some(e => e.getAttribute('rel') !== 'deletes' && e.classList.contains('color_gray'));
        // Логика отображения строк в зависимости от состояния иконок
        if (isNodeletesActive && isOtherActive) {
            // Если обе иконки активны, скрываем все строки
            this.rows.forEach(i => i.style.display = 'none');
            this.sleepblock.forEach(i => i.style.display = 'none');
        } else if (isNodeletesActive) {
            // Если активна только иконка с rel="nodeletes", показываем все строки, кроме sleep
            this.rows.forEach(i => i.style.display = 'table-row');
            this.sleepblock.forEach(i => i.style.display = 'none');
        } else if (isOtherActive) {
            // Если активна другая иконка, показываем только строки sleep
            this.rows.forEach(i => i.style.display = 'none');
            this.sleepblock.forEach(i => i.style.display = 'table-row');
        } else {
            // Если ни одна иконка не активна, показываем все строки
            this.rows.forEach(i => i.style.display = 'table-row');
            this.sleepblock.forEach(i => i.style.display = 'table-row');
        }
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
        console.log(elements)
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
    }
    clickNavi() {
        this.type_navi.forEach(e => e.addEventListener('click', this.addContainer.bind(this, e)))
    }

}