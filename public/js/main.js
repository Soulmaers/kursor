import { NavigationMenu } from './modules/navModules/NavigatorClass.js'
import { DropDownList } from './class/DropdownList.js'
import { AlarmControll } from './modules/alarmModules/class/AlarmControll.js'
import { AddTooltip } from './modules/event.js'
import { LogsEvent } from './modules/eventModules/class/LogsEvent.js'
import { IndexClassSettings } from './modules/usersModules/class/IndexClassSettings.js'
import { RemClassControll } from './modules/remModules/class/RemSettingControll.js'
import { AddListSpisok } from './modules/spisokModules/class/addListSpisok.js'
import { GetUpdateStruktura } from './GetUpdateStruktura.js'
import { PermissionControllClass } from './modules/permissionModules/class/PermissionControllClass.js'


document.addEventListener('DOMContentLoaded', () => {
    // Это гарантирует, что DOM полностью загружен перед инициализацией классов
    const role = document.querySelector('.role').getAttribute('rel')
    const login = document.querySelectorAll('.log')[1].textContent
    const incriment = document.querySelector('.role').getAttribute('data-att')
    new Application(role, login, incriment);

});


export class Application {
    //Основной класс 1 экземпляр при запуске приложения
    constructor(role, login, incriment) {
        this.data = null
        this.nameCar = null
        this.body = document.querySelector('body')
        this.wrapperFull = document.querySelector('.wrapperFull')
        this.lowList = this.wrapperFull.querySelector('.low_list')
        this.searchInput = this.wrapperFull.querySelector('.search_input')
        this.startActivButton = document.querySelector('.stat_start')
        this.create = document.querySelector('.create_object')
        this.servis = document.querySelector('.servis')
        this.adminPanel = document.querySelector('.global_settings')
        this.rem = document.querySelector('.rem')
        this.role = role   //получаем роль прав доступа
        this.login = login //получаем логин пользователя
        this.incriment = incriment
        this.dataspisok = false //флаг загрузки
        this.spisok = null
        this.obj = null
        this.sett = null
        this.validationRole()
        this.init()  //основной метод который запускает стартовые методы загрузки данных на страницу
    }

    async validationRole() {
        if (this.role !== 'Дилер' && this.role !== 'Курсор') {
            this.servis.style.display = 'none'
        }
        if (this.role === 'Пользователь') {
            this.adminPanel.style.display = 'none'
        }
        if (this.role !== 'Курсор') {
            this.rem.style.display = 'none'
        }
        if (this.role === 'Пользователь' || this.role === 'Администратор') {
            await GetUpdateStruktura.getPermissions(this.incriment)
            new PermissionControllClass(this.incriment, this.role)
        }


    }
    // Методы класса Application
    async init() {

        const { data, allId, final, groupId, finalGroup } = await GetUpdateStruktura.zaprosData(this.incriment, this.role)
        const resourses = await GetUpdateStruktura.getAccountResourse(this.incriment, this.role)
        console.log(data, allId, final, groupId, finalGroup)
        this.data = data
        this.allId = allId
        this.final = final
        this.groupId = groupId
        this.finalGroup = finalGroup
        GetUpdateStruktura.updateData()
        new IndexClassSettings(this.login)
        new RemClassControll(this.login, final)
        this.formatContainer() //метод который корректирует границы контейнеров взависимости от разрешения экрана
        this.adaptiv()  //адаптив
        this.activButton()
        await this.startClass()
        new LogsEvent(this.data, this.allId, this.final, this.login)
    }
    activButton() {
        this.startActivButton.classList.add('tablo')
    }
    async startClass() {
        //  console.log(this.data, this.allId, this.final, this.role, this.login)
        new AddListSpisok(this.data, this.allId, this.final, this.role, this.login)
        new DropDownList(this.searchInput, this.final)  //запускаем сквозной поиск по элементам
        new NavigationMenu(this.finalGroup, this.final)// запускаем класс по работе с меню навигацией
        new AlarmControll()// запускаем класс управление отображение списка алармов
        new AddTooltip() //запуск класса отображения тултипов
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
