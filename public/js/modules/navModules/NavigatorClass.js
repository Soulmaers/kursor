import { initCharts } from '../spisokModules/class/SpisokObject.js'
import { kartaContainer } from './karta.js'
import { reportsContainer } from './reports.js'
import { Servis } from './servis.js'
import { SkladTyres } from '../skladModules/class/SkladTyres.js'

export class NavigationMenu {
    constructor(data) {
        this.data = data
        this.buttonElements = document.querySelectorAll('.monitoring');
        this.iconsToggle = document.querySelectorAll('.report_map_InList')
        this.mapUnit = document.querySelectorAll('.map_unit')
        this.reportUnit = document.querySelectorAll('.report_unit')
        this.globalContainer = document.querySelector('.wrapperFull')
        this.globalServis = document.querySelector('.globalServis')
        this.currentTimeoutId = null;
        this.instancSklad = null
        this.menuItems = {
            dash: { method: this.dash.bind(this), elem: 'globalDash' },
            karta: { method: this.karta.bind(this), elem: 'globalMaps' },
            reports: { method: this.reports.bind(this), elem: 'globalReports' },
            servis: { method: this.servis.bind(this), elem: 'globalServis' },
            sklad: { method: this.sklad.bind(this), elem: 'globalSklad' },
            statistika: { method: this.statistika.bind(this), elem: 'start' }
        };
        console.log(this.data)
        this.init()
    }

    init() {
        this.handleButtonClickList()
        this.buttonElements.forEach(button => {
            button.addEventListener('click', this.handleButtonClick.bind(this));
        });

    }

    handleButtonClickList() {
        if (this.currentTimeoutId) {
            clearInterval(this.currentTimeoutId);
            this.currentTimeoutId = null;
        }
    }

    handleButtonClick(event) {
        this.buttonElements.forEach(e => e.classList.remove('tablo'))
        event.target.classList.add('tablo')
        const groups = document.querySelectorAll('.groups')
        groups.forEach(e => {
            e.querySelector('.chekHidden').style.opacity = 1
        })
        const list = document.querySelectorAll('.listItem')
        list.forEach(e => {
            e.querySelector('.checkInList').style.opacity = 1
        })

        if (this.currentTimeoutId) {
            clearInterval(this.currentTimeoutId);
            const checkTypeMarkers = document.querySelector('.checkTypeMarkers')
            const tableInfoCar = document.querySelector('.tableInfoCar')
            tableInfoCar.style.display = 'none'
            checkTypeMarkers.style.display = 'none'
            this.currentTimeoutId = null; // очистить id таймера, так как он больше не активен

        }
        const start = document.querySelector('.start')
        const main = document.querySelector('.main')
        start.style.display = 'none'
        main.style.display = 'none'
        const color = document.querySelector('.color')
        const allsec = document.querySelectorAll('.allsec')
        allsec.forEach(el => {
            el.style.display = 'none';
        })
        const buttonKey = event.target.getAttribute('rel');
        const menuItem = this.menuItems[buttonKey];
        const element = document.querySelector(`.${menuItem.elem}`)
        if (menuItem) {
            menuItem.method(element);
            color ? color.classList.remove('color') : null
        }
    }

    dash(elem) {
        elem.style.display = 'flex'
        this.globalContainer.style.display = 'flex'
        //   dashContainer()
    }

    servis(elem) {
        this.globalContainer.style.display = 'none'
        elem.style.display = 'flex'
        new Servis(this.data)
        //    servisContainer(elem)
    }
    statistika(elem) {
        this.reportUnit.forEach(e => { e.style.display = 'block', e.classList.remove('act_modules') })
        this.mapUnit.forEach(e => { e.style.display = 'block', e.classList.remove('act_modules') })
        elem.style.display = 'flex'
        elem.style.width = 98 + '%'
        setTimeout(function () { initCharts.createChart(); }, 300);
        this.globalContainer.style.display = 'flex'
        //   dashContainer()
    }

    karta(elem) {
        this.globalContainer.style.display = 'flex'
        console.log('карта')
        elem.style.display = 'flex'
        const checkTypeMarkers = document.querySelector('.checkTypeMarkers')
        const tableInfoCar = document.querySelector('.tableInfoCar')
        checkTypeMarkers.style.display = 'flex'
        tableInfoCar.style.display = 'flex'
        const unitMap = document.querySelectorAll('.map_unit')
        unitMap.forEach(el => el.style.display = 'none')
        this.mapUnit.forEach(e => { e.style.display = 'none', e.classList.remove('act_modules') })
        this.reportUnit.forEach(e => { e.style.display = 'block', e.classList.remove('act_modules') })
        const wrap = document.querySelector('.globalMaps').children[0]
        kartaContainer(wrap)
        this.currentTimeoutId = setInterval(() => {
            kartaContainer(wrap)
        }, 6000);
    }

    reports(elem, avl, num) {
        this.globalContainer.style.display = 'flex'
        this.reportUnit.forEach(e => { e.style.display = 'none', e.classList.remove('act_modules') })
        this.mapUnit.forEach(e => { e.style.display = 'block', e.classList.remove('act_modules') })
        if (num) {
            num.classList.add('act_modules')
        }
        elem.style.display = 'flex'
        reportsContainer(avl)
    }

    sklad(elem) {
        this.globalContainer.style.display = 'none'
        elem.style.display = 'flex'

        if (!this.instancSklad) {
            this.instancSklad = new SkladTyres(elem, this.data);
        } else {
            this.instancSklad.destroy(elem, this.data);
        }
    }
}




