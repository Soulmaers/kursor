
import { initsmarkers } from '../../navModules/karta.js'

export class ToggleHiddenList {
    constructor() {
        //  this.status = status
        //  this.final = final
        this.chekHiddens = document.querySelectorAll('.chekHidden')
        this.plusS = document.querySelectorAll('.plusS')
        this.minusS = document.querySelectorAll('.minusS')
        this.filterV = document.querySelectorAll('.filterV')
        this.filterVN = document.querySelectorAll('.filterVN')
        this.checkInList = document.querySelectorAll('.checkInList')
        this.groups = document.querySelectorAll('.groups')
        this.globalcheck = document.querySelector('.globalcheck')
        this.listItem = document.querySelectorAll('.listItem')
        this.tableInfoCar = document.querySelector('.tableInfoCar')
    }
    init() {
        this.minusS.forEach(el => el.addEventListener('click', this.hiddenList.bind(this)))
        this.plusS.forEach(el => el.addEventListener('click', this.viewList.bind(this)))
        this.filterVN.forEach(el => el.addEventListener('click', this.sortListUp.bind(this)))
        this.filterV.forEach(el => el.addEventListener('click', this.sortListDown.bind(this)))
        this.groups.forEach(el => this.hiddenWindows.bind(this, el)())
        this.chekHiddens.forEach(el => el.addEventListener('click', this.toggleHiddenChildList.bind(this)))
        this.checkInList.forEach(el => el.addEventListener('click', this.toggleHiddenList.bind(this)))
        this.globalcheck.addEventListener('click', this.toggleGlobalObjectMaps.bind(this))
        this.listItem.forEach(el => el.children[0].addEventListener('mouseenter', this.opasity.bind(this)))
        this.listItem.forEach(el => el.children[0].addEventListener('mouseleave', this.opasityBack.bind(this)))


    }

    statistikaObjectCar(final) {
        const arrayStatus = [];
        const checkInList = document.querySelectorAll('.checkInList')
        const newCelChange = document.querySelectorAll('.newCelChange')
        const rely = Array.from(newCelChange).reduce((acc, el) => {
            if (el.getAttribute('rel') === 'statusnew' && !el.children[0].classList.contains('toogleIcon')) {
                acc = acc + 1;
            }
            return acc;
        }, 0);
        let count = checkInList.length;
        checkInList.forEach(e => {
            if (e.classList.contains('changeColorCheck')) {
                count--
            }
        })
        const statusCounts = Object.values(final[1]).reduce((acc, el) => {

            if (el.state === 1) {
                acc.move = (acc.move || 0) + 1;
            }
            if (el.state === 2) {
                acc.pause = (acc.pause || 0) + 1;
            }
            if (el.state === 0) {
                acc.stop = (acc.stop || 0) + 1;
            }
            return acc;
        }, {});
        arrayStatus.push(this.listItem.length)
        arrayStatus.push(count);
        arrayStatus.push(rely);
        arrayStatus.push(statusCounts.move !== undefined ? statusCounts.move : 0)
        arrayStatus.push(statusCounts.pause !== undefined ? statusCounts.pause : 0);
        arrayStatus.push(statusCounts.stop !== undefined ? statusCounts.stop : 0);
        Array.from(this.tableInfoCar.children[0].children).forEach((element, index) => {
            element.textContent = arrayStatus[index]
        });
    }


    opasity(event) {
        initsmarkers ? initsmarkers.opasityMarkers(event.target.parentElement) : null
    }
    opasityBack(event) {
        initsmarkers ? initsmarkers.opasityMarkersBack(event.target.parentElement) : null
    }

    toggleGlobalObjectMaps(event) {
        this.globalcheck.classList.toggle('changeGlobalCheck')
        const changeGlobalCheck = document.querySelector('.changeGlobalCheck')
        if (changeGlobalCheck) {
            this.checkInList.forEach(e => {
                e.classList.add('changeColorCheck')
            })
            this.chekHiddens.forEach(e => {
                e.classList.add('changeColorCheck')
            })
        }
        else {
            this.checkInList.forEach(e => {
                e.classList.remove('changeColorCheck')
            })
            this.chekHiddens.forEach(e => {
                e.classList.remove('changeColorCheck')
            })
        }
        initsmarkers.toggleMarkersIcon()
        initsmarkers.statistikaObjectCar()
    }
    toggleHiddenList(event) {
        event.stopPropagation()
        const element = event.target
        element.classList.toggle('changeColorCheck')
        initsmarkers.toggleMarkersIcon()
        initsmarkers.statistikaObjectCar()
    }
    toggleHiddenChildList(event) {
        const element = event.target
        element.classList.toggle('changeColorCheck')
        const childCheck = (element.closest('.groups').lastElementChild).parentElement.querySelectorAll('.checkInList')
        Array.from(childCheck).forEach(el => {
            el.classList.toggle('changeColorCheck')
        })
        initsmarkers.toggleMarkersIcon()
        initsmarkers.statistikaObjectCar()
    }
    hiddenList(event) {
        const element = event.target
        element.style.display = 'none'
        element.previousElementSibling.style.display = 'flex'
        element.closest('.groups').children[1].style.display = 'none'
    }
    viewList(event) {
        const element = event.target
        element.style.display = 'none'
        element.nextElementSibling.style.display = 'flex'
        element.closest('.groups').children[1].style.display = 'block'

    }
    sortListUp(event) {
        const element = event.target
        element.style.display = 'none';
        element.previousElementSibling.style.display = 'block'
        const arr = [];
        Array.from(element.parentNode.nextElementSibling.children).forEach(el => {
            arr.push(el)
        })
        arr.forEach(it => {
            element.parentNode.nextElementSibling.prepend(it)
        })
    }
    sortListDown(event) {
        const element = event.target
        element.style.display = 'none';
        element.nextElementSibling.style.display = 'block'
        const arr = [];
        Array.from(element.parentNode.nextElementSibling.children).forEach(el => {
            arr.push(el)
        })
        arr.forEach(it => {
            element.parentNode.nextElementSibling.prepend(it)
        })
    }
    hiddenWindows(el) {
        var items = el.children[1].childNodes;
        var itemsArr = [];
        for (var i in items) {
            if (items[i].nodeType == 1) {
                itemsArr.push(items[i]);
            }
        }
        itemsArr.sort(function (a, b) {
            return a.innerHTML == b.innerHTML
                ? 0
                : (a.innerHTML > b.innerHTML ? 1 : -1);
        });
        for (i = 0; i < itemsArr.length; ++i) {
            el.children[1].appendChild(itemsArr[i]);
        }
    }
}