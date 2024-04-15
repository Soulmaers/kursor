import { Tooltip } from "../../../class/Tooltip.js";
import { titleLogs } from '../content.js'
import { Controll } from './Controll.js'

export class LogsTable {
    constructor() {
        this.container = null
        this.wrapperLogs = null
        this.controllInstance = null
        this.objColor = {
            'Заправка': 'darkblue',
            'Простой': 'darkgreen',
            'Предупреждение': 'darkred',
            'Слив': 'red',
            'Потеря связи': '#28ad9e',
            'Состояние': '#acad4c'
        }
        this.initializeTable()
    }

    initializeTable() {
        // Инициализация таблицы, если нужно
        this.container = document.querySelector('.alllogs')
        if (!this.container) {
            const body = document.getElementsByTagName('body')[0]
            this.wrapperLogs = document.createElement('div')
            this.wrapperLogs.classList.add('wrapperLogs')
            const headerlog = document.createElement('div')
            headerlog.classList.add('header_logs')
            this.container = document.createElement('div')
            this.container.classList.add('alllogs')
            const spanTitle = document.createElement('p')
            spanTitle.classList.add('spanTitle')
            spanTitle.textContent = 'Логи событий'
            const enterRows = document.createElement('input')
            enterRows.classList.add('enterRows')
            enterRows.value = 300
            const icon = document.createElement('i')
            icon.classList.add('fas')
            icon.classList.add('fa-binoculars')
            icon.classList.add('allobjects')
            body.appendChild(this.container)
            this.container.appendChild(spanTitle)
            this.container.appendChild(enterRows)
            this.container.appendChild(icon)
            this.container.appendChild(this.wrapperLogs)
            this.wrapperLogs.innerHTML = titleLogs
            const evnt = document.querySelector('.evnt')
            evnt.addEventListener('mouseenter', () => evnt.children[0].style.display = 'flex')
            evnt.addEventListener('mouseleave', () => evnt.children[0].style.display = 'none')
            const filterEvent = evnt.querySelector('.filterEvent')
            const allobjects = this.container.querySelector('.allobjects');
            this.controllInstance = new Controll(filterEvent, evnt, allobjects)

        }
    }


    // Метод для создания и обновления таблицы логов
    updateTable(rowsContent) {
        console.log(rowsContent)
        const allobjects = document.querySelector('.allobjects')
        new Tooltip(allobjects, ['Все объекты/Текущий']);
        // Удаление существующих строк таблицы, если они есть
        const existingRows = this.container.querySelectorAll('.trEvent');
        existingRows.forEach(row => row.remove());
        rowsContent.forEach(rowData => this.createRow(rowData));
    }

    // Метод для создания одной строки таблицы
    createRow(rowData) {
        const trEvent = document.createElement('div');
        trEvent.classList.add('trEvent');
        trEvent.setAttribute('rel', rowData.id);
        trEvent.setAttribute('tabindex', '0'); // Установить tabindex сразу при создании
        this.wrapperLogs.insertBefore(trEvent, this.wrapperLogs.firstChild.nextSibling)
        for (const key in rowData) {
            if (key !== 'id' && key !== 'data') {
                const td = document.createElement('p');
                td.classList.add('tdEvent');
                td.textContent = rowData[key];
                td.style.color = this.objColor[td.textContent] || 'initial';
                trEvent.appendChild(td);
            }
        }
        this.controllInstance.initListeners(trEvent)
    }
}