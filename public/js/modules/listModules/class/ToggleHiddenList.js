
import { initsmarkers } from '../../navModules/karta.js'
import { classReports } from '../../navModules/reports.js'
import { NavigationMenu } from '../../navModules/NavigatorClass.js'
import { Helpers } from '../../usersModules/class/Helpers.js'
import { Requests } from '../../usersModules/class/RequestStaticMethods.js'
import { EditObject } from '../../usersModules/class/EditObject.js';
import { EditGroup } from '../../usersModules/class/EditGroup.js';
import { EditAccount } from '../../usersModules/class/EditAccount.js';
import { SimpleEventEmitter } from '../../../Emitter.js'

export class ToggleHiddenList {
    constructor() {
        this.clickElement = null
        this.login = document.querySelectorAll('.log')[1].textContent
        this.chekHiddens = document.querySelectorAll('.chekHidden')
        this.accountCheck = document.querySelectorAll('.accountCheck')
        this.plusS = document.querySelectorAll('.plusS')
        this.minusS = document.querySelectorAll('.minusS')
        this.filterV = document.querySelectorAll('.filterV')
        this.filterVN = document.querySelectorAll('.filterVN')
        this.checkInList = document.querySelectorAll('.checkInList')
        this.groups = document.querySelectorAll('.groups')
        this.globalcheck = document.querySelector('.globalcheck')
        this.listItem = document.querySelectorAll('.listItem')
        this.tableInfoCar = document.querySelector('.tableInfoCar')
        this.parent = document.querySelector('.sortCondition')
        this.cond = document.querySelectorAll('.cond')
        this.mapUnit = document.querySelectorAll('.map_unit')
        this.reportUnit = document.querySelectorAll('.report_unit')
        this.mores = document.querySelector('.mores')
        this.ones = document.querySelector('.ones')
        this.delete = document.querySelectorAll('.deleteObject')
        this.settingsAccount = document.querySelectorAll('.settingsAccount')
        this.settingGroups = document.querySelectorAll('.settingsGroup')
        this.prefs = document.querySelectorAll('.pref')
        this.init()
    }
    init() {
        this.minusS.forEach(el => el.addEventListener('click', this.hiddenList.bind(this)))
        this.plusS.forEach(el => el.addEventListener('click', this.viewList.bind(this)))
        this.filterVN.forEach(el => el.addEventListener('click', this.sortListUp.bind(this)))
        this.filterV.forEach(el => el.addEventListener('click', this.sortListDown.bind(this)))
        //  this.groups.forEach(el => this.hiddenWindows.bind(this, el)())
        this.chekHiddens.forEach(el => el.addEventListener('click', this.toggleHiddenChildList.bind(this, el, 'group')))
        this.checkInList.forEach(el => el.addEventListener('click', this.toggleHiddenList.bind(this)))
        this.accountCheck.forEach(el => el.addEventListener('click', this.toggleHiddenChildList.bind(this, el, 'account')))
        this.globalcheck.addEventListener('click', this.toggleGlobalObjectMaps.bind(this))
        this.listItem.forEach(el => el.children[0].addEventListener('mouseenter', this.opasity.bind(this)))
        this.listItem.forEach(el => el.children[0].addEventListener('mouseleave', this.opasityBack.bind(this)))
        this.mapUnit.forEach(el => el.addEventListener('click', this.naviToggle.bind(this, el)))
        this.reportUnit.forEach(el => el.addEventListener('click', this.naviToggle.bind(this, el)))
        this.mores.addEventListener('click', this.toggleMoresOnes.bind(this))
        this.ones.addEventListener('click', this.toggleMoresOnes.bind(this))
        this.settingsAccount.forEach(el => el.addEventListener('click', this.edit.bind(this, 'accounts', el)))
        this.settingGroups.forEach(el => el.addEventListener('click', this.edit.bind(this, 'groups', el)))
        this.prefs.forEach(el => el.addEventListener('click', this.edit.bind(this, 'listItem', el)))

        Array.from(this.cond).forEach((e, index) => {
            e.addEventListener('click', () => {
                if (e.classList.contains('clicker')) {
                    e.classList.remove('clicker')
                }
                else {
                    Array.from(this.cond).forEach(el => {
                        el.classList.remove('clicker')
                    })
                    e.classList.add('clicker')
                }
                Array.from(this.listItem).forEach(e => {
                    e.children[0].children[0].classList.remove('changeColorCheck')
                })
                Array.from(this.listItem).forEach(e => {
                    if (e.style.display !== 'flex') {
                        e.children[0].children[0].classList.add('changeColorCheck')
                    }
                })
                initsmarkers.toggleMarkersIcon()
            })
        })
    }

    async handleClick(type, element) {
        try {
            const creater = document.querySelector('.role').getAttribute('data-att');
            const prava = document.querySelector('.role').getAttribute('rel');
            const container = document.querySelector('.wrapper_set');
            const parentElement = element.closest(`.${type}`);
            // Общий запрос данных
            const dataPromises = [Helpers.getAccountAll(), Requests.getUsers(prava, creater)];

            if (type === 'listItem') {
                dataPromises.push(Requests.getObjectCreater());
            } else if (type === 'groups') {
                dataPromises.push(Requests.getGroupCreater());
            }
            const [data, creators, userdata] = await Promise.all(dataPromises);
            // Создание экземпляра нужного класса
            if (type === 'listItem') {
                new EditObject(data, parentElement, container, creater, creators, null, userdata);
            } else if (type === 'accounts') {
                new EditAccount(data, parentElement, container, creater, creators, null);
            } else if (type === 'groups') {
                new EditGroup(data, parentElement, container, creater, creators, null, userdata);
            }

        } catch (error) {
            console.error('Error fetching object data:', error);
        }
    }


    greenColorLast(el) {
        const list = document.querySelector('.border')
        if (list) {
            list.classList.remove('border')
            list.children[0].children[0].style.color = 'darkblue'
        }
        el.parentElement.parentElement.classList.add('border')
        el.style.color = 'green'
    }
    edit(name, el) {
        this.greenColorLast(el)
        this.handleClick(name, el)
    }


    toggleMoresOnes(event) {
        const icon = event.target
        this.mores.classList.remove('toggle_list')
        this.ones.classList.remove('toggle_list')
        icon.classList.add('toggle_list')
        const parentElement = icon.parentElement;
        if (icon.classList.contains('mores')) {
            parentElement.lastElementChild.textContent = 'Список групп';
            this.minusS.forEach(el => {
                el.style.display = 'none'
                if (el.closest('.groups')) {
                    el.closest('.groups').children[1].style.display = 'none'
                }
            })
            this.plusS.forEach(el => {
                el.style.display = 'none'
            })
        }
        else {
            this.viewOnes(parentElement)

        }
    }

    viewOnes(parentElement) {
        parentElement.lastElementChild.textContent = 'Список объектов';
        this.plusS.forEach(el => {
            el.style.display = 'none'
            el.previousElementSibling.style.display = 'flex'
            el.closest('.parent_class').children[1].style.display = 'block'


        })
    }


    naviToggle(el) {
        const monitoring = document.querySelectorAll('.monitoring')
        monitoring.forEach(e => e.classList.remove('tablo'))
        const start = document.querySelector('.start')
        const main = document.querySelector('.main')
        start.style.display = 'none'
        main.style.display = 'none'
        const allsec = document.querySelectorAll('.allsec')
        allsec.forEach(el => {
            el.style.display = 'none';
        })
        this.checkInList.forEach(e => {
            e.classList.add('changeColorCheck')
        })
        this.chekHiddens.forEach(e => {
            e.classList.add('changeColorCheck')
        })
        el.parentNode.children[2].classList.remove('changeColorCheck')
        const karta = document.querySelector('.karta')
        const reports = document.querySelector('.reports')
        el.classList.add('act_modules')
        console.log(document.querySelector('.act_modules'))

        const click = new NavigationMenu()
        console.log(el)
        if (el.classList.contains('map_unit')) {
            this.reportUnit.forEach(e => {
                e.style.display = 'block'
                e.classList.remove('act_modules')
            })
            this.mapUnit.forEach(e => {
                e.style.display = 'none'
            })
            const menuItem = click.menuItems['karta']
            const element = document.querySelector(`.${menuItem.elem}`)
            reports.classList.remove('tablo')
            karta.classList.add('tablo')
            click.karta(element)
            initsmarkers ? initsmarkers.toggleMarkersIcon() : null
            initsmarkers ? initsmarkers.createInfoControll() : null
        }
        if (el.classList.contains('report_unit')) {
            this.mapUnit.forEach(e => {
                e.style.display = 'block'
                e.classList.remove('act_modules')
            })
            this.reportUnit.forEach(e => {
                e.style.display = 'none'
            })
            const menuItem = click.menuItems['reports']
            const element = document.querySelector(`.${menuItem.elem}`)
            reports.classList.add('tablo')
            karta.classList.remove('tablo')
            click.reports(element, 'avl_unit', el)
        }
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
        initsmarkers ? initsmarkers.toggleMarkersIcon() : null
        SimpleEventEmitter.emit('check');
        initsmarkers ? initsmarkers.createInfoControll() : null

    }
    toggleHiddenList(event) {
        event.stopPropagation()
        const element = event.target
        const tablo = document.querySelector('.tablo')
        if (tablo && tablo.getAttribute('rel') === 'reports') {
            this.checkInList.forEach(e => {
                e.classList.add('changeColorCheck')
            })
            element.classList.remove('changeColorCheck')
            classReports ? classReports.createListObjectsSelect(element) : null
        }
        else {
            console.log('клик!?')
            SimpleEventEmitter.emit('check');
            element.classList.toggle('changeColorCheck')
            initsmarkers ? initsmarkers.toggleMarkersIcon() : null
            initsmarkers ? initsmarkers.createInfoControll() : null
        }

    }

    toggleHiddenChildList(element, name) {

        const tablo = document.querySelector('.tablo')
        if (tablo && tablo.getAttribute('rel') === 'reports') {
            this.chekHiddens.forEach(e => {
                e.classList.add('changeColorCheck')
            })
            element.classList.remove('changeColorCheck')
            classReports ? classReports.createListGroupSelect(element) : null
        }
        else {
            element.classList.toggle('changeColorCheck')
            if (name === 'group') {
                this.childCheck = (element.closest('.groups').lastElementChild).parentElement.querySelectorAll('.checkInList')
                this.iteration(element, this.childCheck)
            }
            else {
                this.childCheck = (element.closest('.accounts').lastElementChild).parentElement.querySelectorAll('.checkInList')
                this.groupCheck = (element.closest('.accounts').lastElementChild).parentElement.querySelectorAll('.chekHidden')
                this.iteration(element, this.childCheck)
                this.iteration(element, this.groupCheck)
            }
            initsmarkers ? initsmarkers.toggleMarkersIcon() : null
            SimpleEventEmitter.emit('check');
            initsmarkers ? initsmarkers.createInfoControll() : null
        }
    }


    iteration(element, array) {
        array.forEach(el => {
            if (element.classList.contains('changeColorCheck')) {
                el.classList.add('changeColorCheck')
            }
            else {
                el.classList.remove('changeColorCheck')
            }
        })
    }


    hiddenList(event) {
        const element = event.target
        element.style.display = 'none'
        element.nextElementSibling.style.display = 'flex'
        element.closest('.parent_class').lastElementChild.style.display = 'none'
    }


    viewList(event) {
        const element = event.target
        element.style.display = 'none'
        element.previousElementSibling.style.display = 'flex'
        element.closest('.parent_class').lastElementChild.style.display = 'block'

    }
    sortListUp(event) {
        const element = event.target
        element.style.display = 'none';
        element.previousElementSibling.style.display = 'block'
        const arr = [];
        Array.from(element.parentNode.nextElementSibling.children).forEach(el => {
            arr.push(el)
        })
        console.log(Array.from(element.parentNode.nextElementSibling.children))
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