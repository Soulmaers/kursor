
import { CloseBTN } from '../../../class/CloseBTN.js'
import { createMapsUniq } from '../../geo.js'
export class Controll {
    constructor(element, evnt, allObjects) {
        this.element = element
        this.evnt = evnt
        this.allObjects = allObjects
        this.sortConditionTypeFilter = this.element.nextElementSibling
        this.grays = this.sortConditionTypeFilter.querySelectorAll('.graysEvent')
        this.element.addEventListener('click', this.eventFilter.bind(this, 'flex'))
        this.sortConditionTypeFilter.addEventListener('mouseleave', this.eventFilter.bind(this, 'none'))
        this.grays.forEach(el => el.addEventListener('click', this.filterEventLogs.bind(this)))
        this.allObjects.addEventListener('click', this.chanchColor.bind(this))
    }

    chanchColor() {
        const rows = this.evnt.closest('.wrapperLogs').querySelectorAll('.trEvent');
        const activeElementId = document.querySelector('.color').id;
        const activeFilters = Array.from(this.sortConditionTypeFilter.querySelectorAll('.toogleIconEvent')).map(el => el.nextElementSibling.textContent);
        const isChoiceActive = this.allObjects.classList.toggle('choice');
        // Сначала скрываем все строки
        rows.forEach(row => row.style.display = 'none');
        rows.forEach(row => {
            const matchesActiveElement = row.getAttribute('rel') === activeElementId;
            const rowText = row.children[3].textContent;
            const matchesActiveFilter = activeFilters.includes(rowText);
            if (isChoiceActive) {
                // Показываем строки, если нет активных фильтров или строка соответствует активному фильтру
                if (activeFilters.length === 0 || matchesActiveFilter) {
                    row.style.display = 'flex';
                }
            } else {
                // Если "Все объекты" не активен, отображаем строки, соответствующие активному элементу
                if (matchesActiveElement) {
                    // Если есть активные фильтры, дополнительно проверяем соответствие фильтру
                    if (activeFilters.length === 0 || matchesActiveFilter) {
                        row.style.display = 'flex';
                    }
                }
            }
        });
        // Если режим "Все объекты" активен без выбранных фильтров и активного элемента, показываем все строки
        if (isChoiceActive && activeFilters.length === 0 && !activeElementId) {
            rows.forEach(row => row.style.display = 'flex');
        }
    }

    initListeners(element) {
        this.flash(element)
        this.styl(element)
        this.viewMap(element)
    }

    viewMap(element) {
        element.children[3].addEventListener('click', this.clickHandler.bind(this));
    }
    styl(element) {
        element.style.cursor = 'default'
        element.children[3].style.cursor = 'pointer'
        // element.children[2].style.cursor = 'pointer'
    }
    flash(element) {
        element.addEventListener('mouseenter', function () {
            element.style.backgroundColor = 'lightgray';
        });
        element.addEventListener('mouseleave', function () {
            element.style.backgroundColor = '';
        });
    }

    clickHandler(event) {
        event.stopPropagation();
        const elem = event.currentTarget
        const geo = [];
        geo.push(parseFloat(elem.parentElement.lastElementChild.textContent.split(',')[0]))
        geo.push(parseFloat(elem.parentElement.lastElementChild.textContent.split(',')[1]))
        const obj = [{
            geo: geo, logs: [elem.parentElement.lastElementChild.parentElement.children[0].textContent,
            elem.parentElement.lastElementChild.parentElement.children[2].textContent,
            elem.parentElement.lastElementChild.parentElement.children[4].textContent]
        }]
        createMapsUniq([], obj, 'log')
        const wrap = document.querySelector('.wrapMap')
        new CloseBTN(wrap)
    }

    filterEventLogs(event) {
        this.rows = this.evnt.closest('.wrapperLogs').querySelectorAll('.trEvent');
        this.activeElement = document.querySelector('.color');
        const choice = document.querySelector('.choice');
        // Переключение класса для активных фильтров
        if (event.isTrusted) {
            event.target.classList.toggle('toogleIconEvent');
        } else {
            event.classList.add('toogleIconEvent');
        }
        // Список текстов активных фильтров
        const activeFilters = Array.from(this.grays)
            .filter(el => el.classList.contains('toogleIconEvent'))
            .map(el => el.nextElementSibling.textContent);

        // Сначала скрываем все строки
        this.rows.forEach(row => row.style.display = 'none');

        // Логика отображения строк в зависимости от условий
        if (choice) {
            // Если choice есть
            if (activeFilters.length === 0) {
                // И нет активных фильтров - показываем все строки
                this.rows.forEach(row => row.style.display = 'flex');
            } else {
                // И есть активные фильтры - показываем строки, совпадающие с фильтрами
                this.rows.forEach(row => {
                    if (activeFilters.includes(row.children[3].textContent)) {
                        row.style.display = 'flex';
                    }
                });
            }
        } else {
            // Если choice нет
            if (activeFilters.length === 0) {
                // И нет активных фильтров - показываем строки, совпадающие с activeElement
                this.rows.forEach(row => {
                    if (row.getAttribute('rel') === this.activeElement.id) {
                        row.style.display = 'flex';
                    }
                });
            } else {
                // И есть активные фильтры - показываем строки, совпадающие с фильтрами и activeElement
                this.rows.forEach(row => {
                    if (activeFilters.includes(row.children[3].textContent) && row.getAttribute('rel') === this.activeElement.id) {
                        row.style.display = 'flex';
                    }
                });
            }
        }
        this.evnt.style.color = activeFilters.length ? 'gray' : 'rgba(6, 28, 71, 1)';
    }

    eventFilter(style) {
        if (style === 'none') {
            this.grays.forEach(el => {
                el.removeEventListener('click', this.filterEventLogs.bind(this))
            })
        }
        this.sortConditionTypeFilter.style.display = style
    }
}