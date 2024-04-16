
import { GetDataTime } from '../../../class/GetDataTime.js'
import { PressureCharts } from './PressureCharts.js'
import { OilCharts } from './OilCharts.js'
export class GrafikView {
    constructor(data) {
        this.data = data
        this.time = null
        this.activeGrafiks = null
        this.objectMethod = {
            'pressure': PressureCharts,
            'oil': OilCharts

        }
        // Привязываем методы и сохраняем ссылки на них
        this.initBound = this.init.bind(this);
        this.toggleCalendarBound = this.toggleCalendar.bind(this);
        this.okBound = this.ok.bind(this);
        this.clearBound = this.clear.bind(this);
        this.setupInitialListeners();
    }

    setup() {
        this.controllerMethodCharts()
    }

    setupInitialListeners() {
        this.grafik = document.querySelector('.grafik_button');
        this.menuGrafik = document.querySelectorAll('.menu_graf');
        this.iconGraf = document.querySelector('.icon_graf');
        this.calendar = document.querySelector('.calendar_graf');
        this.buttons = this.calendar.querySelectorAll('.btm_formStart');

        this.grafik.addEventListener('click', this.initBound);
        this.menuGrafik.forEach(el => el.addEventListener('click', () => this.navi(el)));
        this.iconGraf.addEventListener('click', this.toggleCalendarBound);
        this.buttons[0].addEventListener('click', this.clearBound);
        this.buttons[1].addEventListener('click', this.okBound);
    }
    removeAllListeners() {
        const grafOld = document.querySelector('.infoGraf')
        if (grafOld) {
            grafOld.remove()
        }
        this.grafik.removeEventListener('click', this.initBound);
        this.menuGrafik.forEach(el => el.removeEventListener('click', () => this.navi(el)));
        this.iconGraf.removeEventListener('click', this.toggleCalendarBound);
        this.buttons[0].removeEventListener('click', this.clearBound);
        this.buttons[1].removeEventListener('click', this.okBound);
    }
    reinitialize(data) {
        this.removeAllListeners();
        this.data = data;
        this.setup()
        this.setupInitialListeners();

    }

    ok() {
        this.calendar.style.display = 'none'
        this.calendar.previousElementSibling.classList.remove('clickUp')
        this.calendar.children[0].children[0].value = ''
        this.controllerMethodCharts()
    }
    clear() {
        console.log('здесь')
        this.calendar.style.display = 'none'
        this.calendar.previousElementSibling.classList.remove('clickUp')
        this.calendar.children[0].children[0].value = ''
    }
    async toggleCalendar(event) {
        const element = event.target
        element.classList.toggle('clickUp')
        if (element.classList.contains('clickUp')) {
            this.calendar.style.display = 'flex'
            await this.getTimeInterval()
        }
        else {
            this.calendar.style.display = 'none'
        }
    }

    async getTimeInterval() {
        const ide = `#${!this.calendar.children[0].children[0] ? this.calendar.children[0].id : this.calendar.children[0].children[0].id}`
        const getTime = new GetDataTime()
        this.time = await getTime.getTimeInterval(this.calendar, ide)
    }
    init(event) {
        const button = event.currentTarget
        this.switch(button)
        this.menuGrafik.forEach(e => {
            e.classList.remove('activMenuGraf')
        })
        this.menuGrafik[0].classList.add('activMenuGraf')
        this.activeGrafiks = this.menuGrafik[0].getAttribute('rel')
        this.installTime()
        this.controllerMethodCharts()
    }

    switch(button) {
        const wRight = document.querySelector('.wrapper_right')
        const wLeft = document.querySelector('.wrapper_left')
        const grafics = document.querySelector('.grafics')
        const techInfo = document.querySelector('.techInfo')
        const main = document.querySelector('.main')
        const secondFlash = document.querySelectorAll('.secondFlash')[1]
        button.classList.add('activGraf')
        wRight.style.display = 'none';
        techInfo.style.display = 'none';
        wLeft.style.display = 'none';
        grafics.style.display = 'flex';
        secondFlash.style.display = 'none'
        main.style.flexDirection = 'column'

    }
    navi(el) {
        this.menuGrafik.forEach(e => e.classList.remove('activMenuGraf'))
        el.classList.add('activMenuGraf')
        this.activeGrafiks = el.getAttribute('rel')
        this.controllerMethodCharts()
    }
    installTime() {
        const now = new Date();
        const nowDate = Math.round(now.getTime() / 1000)
        const startnowDate = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime() / 1000);
        this.time = [startnowDate, nowDate]
    }

    controllerMethodCharts() {

        if (this.grafik.classList.contains('activGraf')) {
            const grafOld = document.querySelector('.infoGraf')
            if (grafOld) {
                grafOld.remove()
            }
            const fn = this.objectMethod[this.activeGrafiks]
            new fn(this.time[0], this.time[1], this.data)
            const loaders = document.querySelector('.loaders_charts')
            loaders.style.display = 'flex';
        }
    }
}