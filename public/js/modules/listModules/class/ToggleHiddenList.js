
import { initsmarkers } from '../../navModules/karta.js'
//import { filterCondition } from '../../filtersList.js'
import { initSummary, initCharts } from '../../spisokModules/class/SpisokObject.js'
import { classReports } from '../../navModules/reports.js'
import { NavigationMenu } from '../../navModules/NavigatorClass.js'
import { Tooltip } from '../../../class/Tooltip.js'
import { app } from '../../../main.js'
import { sett, obj } from '../../event.js'
export class ToggleHiddenList {
    constructor() {
        //  this.status = status
        //  this.final = final
        this.clickElement = null
        this.login = document.querySelectorAll('.log')[1].textContent
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
        this.parent = document.querySelector('.sortCondition')
        this.cond = document.querySelectorAll('.cond')
        this.mapUnit = document.querySelectorAll('.map_unit')
        this.reportUnit = document.querySelectorAll('.report_unit')
        this.mores = document.querySelector('.mores')
        this.ones = document.querySelector('.ones')
        this.delete = document.querySelectorAll('.deleteObject')
        this.deleteGroup = document.querySelectorAll('.deleteGroup')
        this.settingGroups = document.querySelectorAll('.settingsGroup')
        this.prefs = document.querySelectorAll('.pref')
        this.init()
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
        this.mapUnit.forEach(el => el.addEventListener('click', this.naviToggle.bind(this, el)))
        this.reportUnit.forEach(el => el.addEventListener('click', this.naviToggle.bind(this, el)))
        this.delete.forEach(el => el.addEventListener('click', this.confirmation.bind(this, el, 1)))
        this.deleteGroup.forEach(el => el.addEventListener('click', this.confirmation.bind(this, el, 2)))
        this.mores.addEventListener('click', this.toggleMoresOnes.bind(this))
        this.ones.addEventListener('click', this.toggleMoresOnes.bind(this))
        this.settingGroups.forEach(el => el.addEventListener('click', this.edit.bind(this, el)))
        this.prefs.forEach(el => el.addEventListener('click', this.editObject.bind(this, el)))
        Array.from(this.cond).forEach((e, index) => {
            e.addEventListener('click', () => {
                if (e.classList.contains('clicker')) {
                    e.classList.remove('clicker')
                    //  filterCondition(null, this.parent.children[index])
                }
                else {
                    Array.from(this.cond).forEach(el => {
                        el.classList.remove('clicker')
                    })
                    e.classList.add('clicker')
                    //   filterCondition(null, this.parent.children[index])
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
                //   initsmarkers.statistikaObjectCar()
            })
        })
    }


    editObject(el) {
        const list = document.querySelector('.border')
        if (list) {
            list.classList.remove('border')
            list.children[0].children[0].style.color = 'darkblue'
        }
        el.parentElement.parentElement.classList.add('border')
        el.style.color = 'green'
        obj.viewObjects(el)
    }
    async edit(el) {
        const id = el.parentElement.parentElement.id
        const nameGroup = el.parentElement.parentElement.getAttribute('rel')
        const modal = document.querySelector('.create_group_modal')
        const field_modal = modal.querySelector('.field_modal')
        const prefix = el.parentElement.parentElement.classList.contains('subgroup') ? 'sub' : 'group'
        field_modal.value = nameGroup
        field_modal.setAttribute('id', id)
        field_modal.setAttribute('rel', prefix)
        await sett.viewModal()
        const resSostav = await sett.getIdGroup(id)
        const sostavGroup = document.querySelectorAll('.sostav_group')
        const objectList = document.querySelectorAll('.objects_list')
        const podGroup = document.querySelectorAll('.pod_group')
        resSostav.forEach(it => {
            Array.from(objectList[0].children).forEach(e => {
                if (e.getAttribute('rel') === it.idObject && it.id_sub_g === id || e.getAttribute('rel') === it.idObject && it.id_sub_g === null) {
                    sostavGroup[0].appendChild(e)
                }
            })
            Array.from(podGroup[0].children).forEach(e => {
                if (prefix === 'sub') {
                    e.remove();
                }
                else {
                    if (e.getAttribute('rel') === id) {
                        e.remove();
                    }
                    if (e.getAttribute('rel') === it.id_sub_g && e.getAttribute('rel') !== id) {
                        sostavGroup[0].appendChild(e)
                    }

                }

            })
        })
    }
    confirmation(el, num) {
        console.log(el, num)
        const modal = document.querySelector('.modal_confirm')
        const popup = document.querySelector('.popup-background')
        popup.style.display = 'block'
        modal.style.display = 'flex'
        const cancel = modal.querySelector('.cancel')
        const ok = modal.querySelector('.ok_modal')
        const nameObject = num === 1 ? el.closest('.listItem').firstChild.textContent : el.parentNode.parentNode.getAttribute('rel')
        modal.children[1].textContent = nameObject
        num === 1 ? modal.children[0].textContent = 'Удалить объект?' : modal.children[0].textContent = 'Удалить группу?'
        cancel.addEventListener('click', () => {
            modal.style.display = 'none'
            popup.style.display = 'none'
        })
        ok.addEventListener('click', async () => {
            modal.style.display = 'none'
            popup.style.display = 'none'

            if (num === 1) {
                await this.deleteObjectToBase(el)
                await this.deleteObjectToBaseGroups(el)
                app.startClass()
            }
            if (num === 2) {
                const id = el.parentNode.parentNode.id
                await this.deleteGroupToBaseGroups(id)
                app.startClass()
                const createObject = document.querySelector('.create_object')
                const parentElement = document.querySelector('.list_item1')
                this.mores.classList.remove('toggle_list')
                this.ones.classList.remove('toggle_list')
                this.ones.classList.add('toggle_list')
                this.viewOnes(createObject, parentElement)
            }

        })
    }

    async deleteObjectToBase(el) {
        const id = el.closest('.listItem').id
        const login = this.login
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ login, id })
        }
        const res = await fetch('api/deleteObject', params)
        const mess = res.json()
    }
    async deleteGroupToBaseGroups(id) {
        const login = this.login
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ login, id })
        }
        const res = await fetch('api/deleteGroupToBaseGroups', params)
        const mess = res.json()
    }
    async deleteObjectToBaseGroups(el) {
        const id = el.closest('.listItem').id
        const login = this.login
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ login, id })
        }
        const res = await fetch('api/deleteObjectInGroups', params)
        const mess = res.json()
    }
    toggleMoresOnes(event) {
        const icon = event.target
        this.mores.classList.remove('toggle_list')
        this.ones.classList.remove('toggle_list')
        icon.classList.add('toggle_list')
        const parentElement = icon.parentElement;
        const createObject = document.querySelector('.create_object')
        const del = document.querySelectorAll('.deleteGroup')
        const sett = document.querySelectorAll('.settingsGroup')
        if (icon.classList.contains('mores')) {
            createObject.classList.add('gr')
            new Tooltip(createObject, ['Добавить новую группу'])
            parentElement.lastElementChild.textContent = 'Список групп';
            this.minusS.forEach(el => {
                el.style.display = 'none'
                el.previousElementSibling.style.display = 'flex'
                if (el.closest('.groups').children[2]) {
                    Array.from(el.closest('.groups').children[1].children).forEach(el => {
                        el.lastElementChild.style.display = 'none'
                    })
                    el.closest('.groups').children[2].style.display = 'none'
                }
                else {
                    el.closest('.groups').children[1].style.display = 'none'
                }

            })
            this.viewAndHidden(del, sett)
        }
        if (icon.classList.contains('ones')) {
            this.viewOnes(createObject, parentElement)
        }


    }
    viewOnes(createObject, parentElement) {
        const del = document.querySelectorAll('.deleteGroup')
        const sett = document.querySelectorAll('.settingsGroup')
        createObject.classList.remove('gr')
        new Tooltip(createObject, ['Добавить новый объект'])
        parentElement.lastElementChild.textContent = 'Список объектов';
        this.plusS.forEach(el => {
            el.style.display = 'none'
            el.nextElementSibling.style.display = 'flex'
            if (el.closest('.groups').children[2]) {
                Array.from(el.closest('.groups').children[1].children).forEach(el => {
                    el.lastElementChild.style.display = 'block'
                })
                el.closest('.groups').children[2].style.display = 'block'
            }
            else {
                el.closest('.groups').children[1].style.display = 'block'
            }
        })
        this.viewAndHidden(del, sett, 'num')
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
        console.log(changeGlobalCheck)
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
        initSummary.clickListUpdateSummary()
        initCharts ? initCharts.getDataSummary() : null
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

            element.classList.toggle('changeColorCheck')
            initsmarkers ? initsmarkers.toggleMarkersIcon() : null
            initSummary.clickListUpdateSummary()
            initCharts ? initCharts.getDataSummary() : null
            initsmarkers ? initsmarkers.createInfoControll() : null
        }

    }
    toggleHiddenChildList(event) {
        const element = event.target
        const childCheck = (element.closest('.groups').lastElementChild).parentElement.querySelectorAll('.checkInList')
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
            Array.from(childCheck).forEach(el => {
                if (element.classList.contains('changeColorCheck')) {
                    el.classList.add('changeColorCheck')
                }
                else {
                    el.classList.remove('changeColorCheck')
                }
            })
            initsmarkers ? initsmarkers.toggleMarkersIcon() : null
            initSummary.clickListUpdateSummary()
            initCharts ? initCharts.getDataSummary() : null
            initsmarkers ? initsmarkers.createInfoControll() : null
        }



    }
    hiddenList(event) {
        const element = event.target
        element.style.display = 'none'
        element.previousElementSibling.style.display = 'flex'
        if (element.closest('.groups').children[2]) {
            Array.from(element.closest('.groups').children[1].children).forEach(el => {
                el.lastElementChild.style.display = 'none'
            })
            element.closest('.groups').children[2].style.display = 'none'
        }
        else {
            element.closest('.groups').children[1].style.display = 'none'
        }

    }

    viewAndHidden(del, sett, num) {
        const role = document.querySelector('.role').getAttribute('rel')
        if (role === 'Администратор') {
            if (!num) {
                del.forEach(e => {
                    e.style.display = 'block'
                })
                sett.forEach(e => {
                    e.style.display = 'block'
                })
            }
            else {
                del.forEach(e => {
                    e.style.display = 'none'
                })
                sett.forEach(e => {
                    e.style.display = 'none'
                })
            }
        }

    }
    viewList(event) {
        const element = event.target
        element.style.display = 'none'
        element.nextElementSibling.style.display = 'flex'
        if (element.closest('.groups').children[2]) {
            Array.from(element.closest('.groups').children[1].children).forEach(el => {
                el.lastElementChild.style.display = 'block'
            })
            element.closest('.groups').children[2].style.display = 'block'
        }
        else {
            element.closest('.groups').children[1].style.display = 'block'
        }

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