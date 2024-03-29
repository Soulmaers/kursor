
import { Tooltip } from '../../../class/Tooltip.js'
import { GetDataTime } from '../../../class/GetDataTime.js'
import { PressureCharts } from '../../charts/PressureCharts.js'
import { OilCharts } from '../../charts/OilCharts.js'
export class GrafikView {
    constructor() {
        //  this.list = nav
        this.time = null
        this.activeGrafiks = null
        this.objectMethod = {
            'pressure': PressureCharts,
            'oil': OilCharts

        }
        this.grafik = document.querySelector('.grafik_button')
        this.menuGrafik = document.querySelectorAll('.menu_graf')
        this.iconGraf = document.querySelector('.icon_graf')
        this.calendar = document.querySelector('.calendar_graf')
        this.button = this.calendar.querySelectorAll('.btm_formStart')
        this.grafik.addEventListener('click', this.init.bind(this))
        this.menuGrafik.forEach(el => el.addEventListener('click', this.navi.bind(this, el)))
        this.iconGraf.addEventListener('click', this.toggleCalendar.bind(this))
        this.button[0].addEventListener('click', this.clear.bind(this))
        this.button[1].addEventListener('click', this.ok.bind(this))
        this.init()
    }
    init() {
        this.menuGrafik[0].classList.add('activMenuGraf')
    }
    ok() {
        console.log(this.time)
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
    init() {
        new Tooltip(this.iconGraf, ['Календарь']);
        this.menuGrafik[0].classList.add('activMenuGraf')
        this.activeGrafiks = this.menuGrafik[0].getAttribute('rel')
        this.installTime()
        this.controllerMethodCharts()
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
            new fn(this.time[0], this.time[1])
            const loaders = document.querySelector('.loaders_charts')
            loaders.style.display = 'flex';
        }
    }
}