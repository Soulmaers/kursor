import { charContainer } from './char.js'
import { skladContainer } from './sklad.js'
import { kartaContainer } from './karta.js'
import { reportsContainer } from './reports.js'

export class NavigationMenu {
    constructor() {
        this.buttonElements = document.querySelectorAll('.monitoring');
        this.currentTimeoutId = null;
        this.menuItems = {
            dash: { method: this.dash.bind(this), elem: 'globalDash' },
            karta: { method: this.karta.bind(this), elem: 'globalMaps' },
            reports: { method: this.reports.bind(this), elem: 'globalReports' },
            sklad: { method: this.sklad.bind(this), elem: 'globalSklad' }
        };
    }

    init() {
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
        //   dashContainer()
    }

    karta(elem) {
        elem.style.display = 'flex'
        const checkTypeMarkers = document.querySelector('.checkTypeMarkers')
        const tableInfoCar = document.querySelector('.tableInfoCar')
        checkTypeMarkers.style.display = 'flex'
        tableInfoCar.style.display = 'flex'
        const unitMap = document.querySelectorAll('.map_unit')
        unitMap.forEach(el => el.style.display = 'none')
        const wrap = document.querySelector('.globalMaps').children[0]
        kartaContainer(wrap)
        this.currentTimeoutId = setInterval(() => {
            kartaContainer(wrap)
        }, 30000);
    }

    reports(elem, avl) {
        elem.style.display = 'flex'
        reportsContainer(avl)
    }

    sklad(elem) {
        elem.style.display = 'flex'
        skladContainer()
    }
}




