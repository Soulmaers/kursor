import { checkCreate } from './modules/admin.js'
import { SpisokObject } from './modules/spisokModules/class/SpisokObject.js'
import { NavigationMenu } from './modules/navModules/NavigatorClass.js'
import { DropDownList } from './class/DropdownList.js'
import { AlarmControll } from './modules/alarmModules/class/AlarmControll.js'
import { GrafikView } from './modules/grafikModules/class/GrafikView.js'
import { ToggleHiddenList } from './modules/listModules/class/ToggleHiddenList.js'
import { AddTooltip } from './modules/event.js'
import { LogsEvent } from './modules/eventModules/class/LogsEvent.js'

export let app;
export let grafClick
//export let initSummary
//export let initCharts

document.addEventListener('DOMContentLoaded', () => {
    // Это гарантирует, что DOM полностью загружен перед инициализацией классов
    const role = document.querySelector('.role').getAttribute('rel')
    const login = document.querySelectorAll('.log')[1].textContent
    app = new Application(role, login);

});


export class Application {
    //Основной класс 1 экземпляр при запуске приложения
    constructor(role, login) {
        this.data = null
        this.body = document.querySelector('body')
        this.wrapperFull = document.querySelector('.wrapperFull')
        this.lowList = this.wrapperFull.querySelector('.low_list')
        this.searchInput = this.wrapperFull.querySelector('.search_input')
        this.startActivButton = document.querySelector('.stat_start')
        this.role = role   //получаем роль прав доступа
        this.login = login //получаем логин пользователя
        this.dataspisok = false //флаг загрузки
        this.spisok = null
        this.init()  //основной метод который запускает стартовые методы загрузки данных на страницу
    }
    // Методы класса Application
    async init() {
        this.formatContainer() //метод который корректирует границы контейнеров взависимости от разрешения экрана
        this.adaptiv()  //адаптив
        this.activButton()
        await this.startClass()
    }
    activButton() {
        this.startActivButton.classList.add('tablo')
    }
    async startClass(elem) {
        await this.zapros(elem) //метод который забирает из бд данные по объектам, заппускает проверку обновления логов, проверку  объектов из бд соответствующих логину, запускает функцию отрисовки списка
        new DropDownList(this.searchInput)  //запускаем сквозной поиск по элементам
        new NavigationMenu()// запускаем класс по работе с меню навигацией
        new AlarmControll()// запускаем класс управление отображение списка алармов
        new ToggleHiddenList() //запускаем класс управления списком
        new AddTooltip() //запуск класса отображения тултипов
        grafClick = new GrafikView()

    }
    async zapros(elem) {
        const [wialonData, kursorData] = await Promise.all([this.zaprosWialon(this.login), this.zaprosKursor(this.login)])
        this.dataspisok = true
        const arrayList = wialonData.response.aLLmassObject
        const nameCarCheck = wialonData.response.arrName
        const data = kursorData.concat(arrayList)
        this.data = data
        new LogsEvent(this.data, this.login)
        if (data.flat().length === 0) {
            const loaders = document.querySelector('.loaders');
            loaders.style.display = 'none'
        }
        if (this.spisok) {
            this.spisok.updateData(data, elem)
        }
        else {
            this.spisok = new SpisokObject(data) //отрисовка списка и статусов списка
        }

        //передаем имена объектов для отображения в панели администратора
        checkCreate(nameCarCheck)
    }

    async zaprosWialon(login) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ login }))

        }
        const mods = await fetch('/api/dataSpisok', params)
        const models = await mods.json()
        return models
    }

    async zaprosKursor(login) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ login })
        }
        const res = await fetch('/api/getKursorObjects', params)
        const objects = await res.json()
        const arrayList = objects.result
        return arrayList
    }

    async logs() {
        const login = this.login
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ login }))

        }
        const res = await fetch('/api/viewLogs', param)
        const confirm = await res.json()
    }

    formatContainer() {
        if (screen.width < 860) {
            document.querySelectorAll('.newColumn, .newCel').forEach(e => e.remove());
        }
        this.lowList.style.height = `${this.wrapperFull.clientHeight - 65}px`;
    }

    adaptiv() {
        const widthWind = this.body.offsetWidth;
        if (widthWind > 860 && widthWind <= 1200) {
            this.wrapperFull.querySelector('.wrapper_left').style.display = 'none';
        }
        if (widthWind <= 860) {
            this.wrapperFull.querySelector('.start').style.display = 'none';
            this.wrapperFull.style.minHeight = `${screen.height - 85}px`;
            this.lowList.style.height = `${this.wrapperFull.clientHeight - 20}px`;
            const auth = this.body.querySelector('.auth');
            if (auth) {
                this.body.querySelector('.menu').appendChild(auth);
            }
            document.querySelector('.mobile_spisok').classList.add('mobile_active');
        }
    }

}
