
import { SummaryViewControll } from '../../summaryModules/class/SummaryViewControll.js'
import { ChartsViewControll } from '../../summaryModules/class/ChartsViewControll.js'
import { ClickObject } from '../../navigatorModules/class/ClickObject.js'
import { FilterElements } from '../../filterModules/class/FilterElements.js'
import { CreateList } from './CreateList.js'
import { AddparametrsIcons } from './AddparametrsIcons.js'
import { ToggleHiddenList } from '../../listModules/class/ToggleHiddenList.js'
import { GetUpdateStruktura } from '../../../GetUpdateStruktura.js'
import { Helpers } from './Helpers.js'
export let initSummary
export let initCharts


export class AddListSpisok {
    constructor(data, allId, final, role, login) {
        this.data = data
        this.allId = allId
        this.final = final
        this.element = null
        this.lowList = document.querySelector('.low_list')
        this.login = login
        this.role = role
        this.sensorsName = false;
        this.lastSensor = false;
        this.finishload = false;
        GetUpdateStruktura.onDataReceived(this.render.bind(this));
        this.init()

    }

    async render({ data, allId, final, groupId }) {
        const inspect = this.final.length === final.length
        this.data = data;
        this.allId = allId;
        this.final = final;
        if (inspect) {
            const elem = [document.querySelector('.border'), document.querySelector('.color')].filter(element => element !== null)
            this.updateElement(elem)
            this.controllConnectParams()
            new AddparametrsIcons(this.final, elem)
        }
        else {
            this.init()
        }


    }
    async init() {
        this.simulateLoader()
        this.findDomElement()  //поиск и удаление старых элементов
        Helpers.sorting(this.data)
        new CreateList(this.data, this.login, this.role)
        this.lists = this.lowList.querySelectorAll('.listItem')
        this.controllConnectParams()
        new AddparametrsIcons(this.final, this.lists)
        new ClickObject(this.lists, this.final)
        this.sensorsName = true
        this.lastSensor = true
        new ToggleHiddenList() //запускаем класс управления списком
        initSummary = new SummaryViewControll(this.allId)
        initCharts = new ChartsViewControll(this.allId)
        await this.viewList(this.login)
        this.validRole()
        this.finishload = true

    }

    controllConnectParams() {
        const wrench = [...this.lists].map(e => e.querySelector('.fa-wrench'))
        wrench.forEach(e => {
            const data = this.final.find(it => {
                return String(it[4]) === e.getAttribute('idx')
            })
            /* if (data[2].result.length === 0) {
                 e.style.color = 'red'
             }*/
        })
    }
    updateElement(elem) {
        elem.forEach(it => {
            const property = this.final.find(e => e.object_id === it.id);
            it.getAttribute('name', property.object_name)
            console.log(it.children[0].childNodes.childNodes[3])
            it.children[0].childNodes[8].textContent = property.object_name
            it.children[0].getAttribute('rel', property.inc_object)
            it.children[0].getAttribute('idx', property.inc_object)
            it.children[1].getAttribute('rel', property.object_name)
            it.children[1].getAttribute('id', property.object_name)
            it.children[2].getAttribute('rel', property.object_name)
            it.children[2].getAttribute('id', property.object_name)
            it.children[3].getAttribute('rel', property.object_name)
            it.children[3].getAttribute('id', property.object_name)
        })

    }
    simulateLoader() {
        let progress = 0;
        let loaderProgress = document.querySelector('.loaders-progress');
        let interval = setInterval(() => {
            progress = this.updateProgress(progress);
            if (this.finishload) {
                clearInterval(interval);
                const loaders = document.querySelector('.loaders');
                loaders.style.display = 'none';
            } else {
                loaderProgress.textContent = progress + '%';
            }
        }, 300);
    }
    updateProgress(progress) {
        if (progress === 95 || progress === 96) {
            return progress
        }
        let load = 0;
        if (this.data) {
            if (this.sensorsName) {
                progress = 66;
                load += 1;
            } else {

                progress = 52;
            }

            if (this.lastSensor && this.finishload) {
                progress = 100;
                load += 1;
            } else if (this.lastSensor) {
                progress = 95;
                load += 1;
            }
        } else {
            progress += 2 * (load === 1 ? 2 : (load === 2 ? 3 : 1));
        }
        return progress;
    }
    validRole() {
        const role = document.querySelector('.role').getAttribute('rel')
        const pref = document.querySelectorAll('.pref')
        const settingsGroups = document.querySelectorAll('.settingsGroup')
        const chekAlt = document.querySelector('.checkAlt')
        const titleModal = document.querySelectorAll('.titleModal')
        const list = document.querySelector('.list_item1')
        if (role === 'Пользователь') {
            list.style.width = '220px'
            list.style.marginLeft = '30px'
            list.style.marginRight = '70px'
            titleModal.forEach(e => {
                e.style.paddingLeft = '20px'
            })
            chekAlt.style.display = 'none';
            pref.forEach(e => {
                e.style.display = 'none'
            })
            settingsGroups.forEach(e => {
                e.style.display = 'none'
            })
        }
    }


    viewList = async (login) => {
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ login }))
        }
        const ress = await fetch('/api/viewList', param)
        const results = await ress.json()
        if (results.res.length === 0) {
            const instance = new FilterElements()
            instance.draggable()
            return
        } else {
            const objChangeList = results.res[0]
            delete objChangeList.login
            delete objChangeList.id
            const parsedObj = {};
            for (let key in objChangeList) {
                parsedObj[key] = JSON.parse(objChangeList[key]);
            }
            const parsedTtile = Object.assign({}, parsedObj);
            delete parsedObj.tagach
            for (let key in parsedObj) {
                if (key === 'pricep') {
                    parsedObj.pressure = parsedObj.pricep
                    delete parsedObj.pricep
                }
            }
            const uniqBar = document.querySelectorAll('.uniqBar')
            uniqBar.forEach(el => {
                if (parsedObj[el.children[0].id].view) {
                    el.children[0].checked = parsedObj[el.children[0].id].view === false ? false : true
                }

            })

            const titleChangeList = document.querySelectorAll('.title_list_global')
            titleChangeList.forEach(el => {
                el.style.display = parsedObj[el.getAttribute('rel').split(' ')[1] ? el.getAttribute('rel').split(' ')[0] : el.getAttribute('rel')].view === false ? 'none' : 'flex'
            })
            const newCelChange = document.querySelectorAll('.newCelChange')
            newCelChange.forEach(el => {
                el.style.display = parsedObj[el.getAttribute('rel').split(' ')[1] ? el.getAttribute('rel').split(' ')[0] : el.getAttribute('rel')].view === false ? 'none' : 'flex'
            })
            for (let key in parsedTtile) {
                const index = parsedTtile[key].index;
                const rel = key;
                const attributeList = Array.from(document.querySelectorAll('[rel]')).filter((el) => {
                    return el.getAttribute('rel').split(' ').includes(rel);
                });
                attributeList.forEach(el => {
                    const parent = el.parentNode;
                    const sibling = parent.children[index + 1];
                    parent.insertBefore(el, sibling);
                });
            }
            const instance = new FilterElements()
            instance.draggable()
        }
    }

    findDomElement() {
        this.groups = this.lowList.querySelectorAll('.groups');
        this.listItem = this.lowList.querySelectorAll('.listItem');
        this.removeElements(this.groups);
        this.removeElements(this.listItem);
    }
    removeElements(elements) {
        if (elements) {
            elements.forEach(element => {
                element.remove();
            });
        }
    }
    updateData(newData, elem) {
        this.data = newData
        this.element = elem
        this.init()
    }




}