
import { initsmarkers } from '../../navModules/karta.js'

export class ToggleHiddenList {
    constructor() {
        this.chekHiddens = document.querySelectorAll('.chekHidden')
        this.plusS = document.querySelectorAll('.plusS')
        this.minusS = document.querySelectorAll('.minusS')
        this.filterV = document.querySelectorAll('.filterV')
        this.filterVN = document.querySelectorAll('.filterVN')
        this.checkInList = document.querySelectorAll('.checkInList')
        this.groups = document.querySelectorAll('.groups')
    }
    init() {
        this.minusS.forEach(el => el.addEventListener('click', this.hiddenList.bind(this)))
        this.plusS.forEach(el => el.addEventListener('click', this.viewList.bind(this)))
        this.filterVN.forEach(el => el.addEventListener('click', this.sortListUp.bind(this)))
        this.filterV.forEach(el => el.addEventListener('click', this.sortListDown.bind(this)))
        this.groups.forEach(el => this.hiddenWindows.bind(this, el)())
        this.chekHiddens.forEach(el => el.addEventListener('click', this.toggleHiddenChildList.bind(this)))
        this.checkInList.forEach(el => el.addEventListener('click', this.toggleHiddenList.bind(this)))
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