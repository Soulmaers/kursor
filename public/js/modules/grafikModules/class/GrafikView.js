import { datas } from '../../charts/bar.js'
import { oil } from '../../charts/oil.js'
import { Tooltip } from '../../../class/Tooltip.js'
export class GrafikView {
    constructor(nav) {
        this.list = nav
        this.time = null
        this.activeGrafiks = null
        this.objectMethod = {
            'pressure': datas,
            'oil': oil,

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
        const fp = flatpickr(ide, {
            mode: "range",
            dateFormat: "d-m-Y",
            locale: "ru",
            static: true,
            "locale": {
                "firstDayOfWeek": 1 // устанавливаем первым днем недели понедельник
            },
            onChange: (selectedDates, dateStr, instance) => {
                const formattedDates = selectedDates.map(date => {
                    const year = date.getFullYear();
                    const month = ("0" + (date.getMonth() + 1)).slice(-2); // добавляем ведущий ноль, если месяц < 10
                    const day = ("0" + date.getDate()).slice(-2); // добавляем ведущий ноль, если день < 10
                    return [`${year}-${month}-${day}`, `${day}.${month}.${year}`, date.getTime() / 1000];
                });

                this.time = formattedDates.map(el => el[el.length - 1])
                console.log(this.time)
                return
            }
        })
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
            console.log(this.time)
            console.log(this.activeGrafiks)
            const fn = this.objectMethod[this.activeGrafiks]
            fn(this.time[0], this.time[1])
            const grafOld = document.querySelector('.infoGraf')
            if (grafOld) {
                grafOld.remove()
            }
            const loaders = document.querySelector('.loaders_charts')
            loaders.style.display = 'flex';


        }

    }
}