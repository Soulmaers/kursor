
import { LogsTable } from './LogsTable.js'
import { CloseBTN } from '../../../class/CloseBTN.js'
import { Popup } from './Popup.js'
import { DraggableContainer } from '../../../class/Dragdown.js'
import { Helpers } from '../../spisokModules/class/Helpers.js'
export class LogsEvent {
    constructor(data, allId, groupId, login) {
        this.data = data
        this.login = login
        this.log = document.querySelector('.logs')
        this.wrapperLogs = null
        this.count = 300  //кол-во получаемых строк по умолчанию
        this.quantity = 0 //начальное кол-во рпосмотренных сообщений
        this.arrayId = allId
        this.arrayIdGroups = groupId.map(el => [el.object_id, el.group_name])
        this.value = null  //получаемые данные -кол-во  всего, кол-во по умолчанию
        this.rowsContent = null  // готовая структура строк для отрисовки
        this.logsTable = new LogsTable();
        this.logs();
        this.init()
        setInterval(() => this.update(), 110000)
        this.log.addEventListener('click', this.togglePopup.bind(this))
    }
    update() {
        this.wrapperLogs && this.wrapperLogs.style.display !== 'block' ? this.init() : null
    }
    async init() {
        try {
            await this.getLogs();
            await this.getQuantity();
            this.rowsContent ? this.validationPopup() : null
            this.createRowsEventLogs(); // Подготовка данных для отображения
            this.logsTable.updateTable(this.rowsContent); // Обновление таблицы с помощью LogsTable
            this.wrapperLogs = document.querySelector('.alllogs');
        } catch (error) {
            console.error('Ошибка в инициализации LogsEvent:', error);
        }
    }

    validationPopup() {
        const arrayPopup = this.value.view.filter((objB) => {
            return !this.rowsContent.some(function (objA) {
                return objA.data === objB.time;
            });
        });
        arrayPopup.length !== 0 ? new Popup(arrayPopup, this.login, this.arrayIdGroups) : null

    }

    updateValueCount() {
        const enterRows = document.querySelector('.enterRows')
        enterRows.addEventListener('input', async (event) => {
            const row = Number(event.target.value)
            this.count = row
            await this.getLogs();
            this.createRowsEventLogs(); // Подготовка данных для отображения
            this.logsTable.updateTable(this.rowsContent); // Обновление таблицы с помощью LogsTable
        })
    }
    async togglePopup() {
        if (!this.wrapperLogs) return;
        this.updateValueCount()
        const allobjects = this.wrapperLogs.querySelector('.allobjects');
        const color = document.querySelector('.color');
        !color ? allobjects.classList.add('choice') : null
        // Переключение состояния видимости попапа
        const isHidden = !this.wrapperLogs.style.display || this.wrapperLogs.style.display === 'none';
        this.wrapperLogs.style.display = isHidden ? 'block' : 'none';
        this.wrapperLogs.classList.toggle('clickLog', isHidden);
        new DraggableContainer(this.wrapperLogs)
        // Управление видимостью и фильтрацией событий
        if (isHidden) {
            this.logs(this.quantity);
            this.viewTableNum(0);
            const enterRows = document.querySelector('.enterRows')
            const numy = this.log.querySelector('.num')
            new CloseBTN(this.wrapperLogs, this.log, numy)
            const trEvents = this.wrapperLogs.querySelectorAll('.trEvent');
            trEvents.forEach(item => { item.style.display = 'flex'; });
            if (color) {
                enterRows.style.display = 'none'
                allobjects.style.display = 'block';
                trEvents.forEach(item => {
                    item.style.display = item.getAttribute('rel') !== color.id ? 'none' : 'flex';
                });
            } else {
                enterRows.style.display = 'flex'
                allobjects.style.display = 'none';
            }
        }
    }
    //преобразуем время  UNIX в нужный формат
    times(time) {
        const day = time.getDate();
        const month = (time.getMonth() + 1).toString().padStart(2, '0');
        const year = time.getFullYear();
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
        return formattedDate
    }
    //преобразуем входящую структуру в строки для отрисовки и сохраняем ее в свойство конструктора
    createRowsEventLogs() {
        // Предварительное преобразование arrayIdGroup в словарь для быстрого доступа
        const groupDict = this.arrayIdGroups.reduce((acc, [id, group]) => {
            acc[id] = group;
            return acc;
        }, {});
        this.rowsContent = this.value.view.map(el => {

            const parsedContent = JSON.parse(el.content);
            const typeEvent = parsedContent[0].event;
            const geoloc = el.geo !== '' ? JSON.parse(el.geo) : null;
            const geo = geoloc ? geoloc.map(e => Number(e).toFixed(5)).join(", ") : 'нет данных';
            const group = this.login === 'Курсор' ? 'demo' : typeEvent !== 'Предупреждение' ? el.groups : groupDict[el.idw] || [];

            const int = Object.values(parsedContent[0]);
            int.shift();
            const info = `${int.join(", ")}`
            const time = this.times(new Date(Number(el.time) * 1000));
            return {
                data: el.time, time: time, group: group, name: el.name, typeEvent: typeEvent, content: info, geo: geo, id: el.idw
            };
        });
    }
    // Вспомогательная функция для создания параметров запроса
    createFetchRequestParams(bodyContent) {
        return {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyContent)
        };
    }
    viewTableNum(num) {
        const nums = document.querySelector('.num')
        nums.textContent = num
    }
    async getQuantity() {
        const param = this.createFetchRequestParams({ login: this.login });
        const resLog = await fetch('/api/quantityLogs', param);
        const resultsLog = await resLog.json();
        const viewNum = this.value.quant - resultsLog[0].quantity;
        this.viewTableNum(viewNum)
    }
    async getLogs() {
        const param = this.createFetchRequestParams({ arrayId: this.arrayId, quantity: this.quantity, count: this.count });
        const ress = await fetch('/api/logsView', param);
        this.value = await ress.json();
        this.quantity = this.value.itog;
    }
    pushId() {
        this.arrayId = Helpers.format(this.data, 0)
        this.arrayIdGroups = Helpers.format(this.data, 2)
        console.log(this.arrayIdGroups)
    }

    async logs(quantity) {
        const param = quantity ? this.createFetchRequestParams({ login: this.login, quantity }) : this.createFetchRequestParams({ login: this.login });
        await fetch('/api/viewLogs', param);
    }
}