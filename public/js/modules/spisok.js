import { convert } from './helpersFunc.js'
import { navigator } from './navigator.js'
import { objColorFront, generDav } from './content.js'
import { approximateValue } from './staticObject.js'
import { convertTime, removeArrElem } from './helpersFunc.js'
import { globalSelect } from './filtersList.js'
import { dataspisok } from './menu.js'
import { ToggleHiddenList } from './listModules/class/ToggleHiddenList.js'
import { SummaryViewControll } from './summaryModules/class/SummaryViewControll.js'
import { ChartsViewControll } from './summaryModules/class/ChartsViewControll.js'
import { Tooltip } from '../class/Tooltip.js'

const login = document.querySelectorAll('.log')[1].textContent

simulateLoader();
export let initSummary
export let initCharts

let sensorsName = false;
let lastSensor = false;
let updateSensor = false;
let finishload = false
function simulateLoader() {
    let progress = 0;
    let loaderProgress = document.querySelector('.loaders-progress');

    let interval = setInterval(function () {
        progress = updateProgress(progress);

        if (finishload) {
            clearInterval(interval);
            const loaders = document.querySelector('.loaders');
            loaders.style.display = 'none';
        } else {
            loaderProgress.textContent = progress + '%';
        }
    }, 300);
}

function updateProgress(progress) {
    if (progress === 95 || progress === 96) {
        return progress
    }
    let load = 0;

    if (dataspisok) {
        if (sensorsName) {
            progress = 66;
            load += 1;
        } else {

            progress = 52;
        }

        if (lastSensor && finishload) {
            progress = 100;
            load += 1;
        } else if (lastSensor) {
            progress = 95;
            load += 1;
        }
    } else {
        progress += 2 * (load === 1 ? 2 : (load === 2 ? 3 : 1));
    }

    return progress;
}

export async function loadParamsViewList(car, el) {
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ car, el }))
    }
    const mod = await fetch('/api/listModel', params)
    const model = await mod.json()
    const tyr = await fetch('/api/listTyres', params)
    const models = await tyr.json()
    const dat = await fetch('/api/wialonAll', params)
    const data = await dat.json()
    const osis = await fetch('/api/barViewAll', params)
    const osi = await osis.json()

    model.result.sort((a, b) => {
        if (a.osi > b.osi) {
            return 1;
        } else if (a.osi < b.osi) {
            return -1;
        } else {
            return 0;
        }
    });
    return [model, models, data, osi, el]
}

export async function conturTest(testov) {
    console.log(testov)
    const resultImei = testov
        .map(el => Object.values(el)) // получаем массивы всех id
        .flat()
        .map(e => ({ id: e[4], imei: e[0].imei }))
        .filter(e => e !== null);
    const result = testov
        .map(el => Object.values(el)) // получаем массивы всех id
        .flat()
        .map(e => e[4])
        .filter(e => e !== null);
    const final = await alternativa(resultImei)
    const groups = document.querySelectorAll('.groups')
    if (groups) {
        removeArrElem(groups)
    }
    const listItem = document.querySelectorAll('.listItem')
    if (listItem) {
        removeArrElem(listItem)
    }
    testov.forEach(el => {
        if (el.length !== 0) {

            const lowList = document.querySelector('.low_list')
            const group = document.createElement('div')
            group.classList.add('groups')
            el[0][el[0].length - 1] === 'kursor' ? group.classList.add('kursorgroups') : group.classList.add('wialongroups')
            const nameGroup = el[0][6].replace(/\s/g, '_');
            group.classList.add(`${nameGroup}`)
            group.setAttribute('id', el[0][6])
            group.style.display = 'flex',
                group.style.flexDirection = 'column'
            group.style.width = 100 + '%',
                lowList.appendChild(group)
            const titleModal = document.createElement('div')
            titleModal.classList.add('titleModal')
            el[0][el[0].length - 1] !== 'kursor' ? titleModal.classList.add('titlewialon') : titleModal.classList.add('titlekursor')
            if (login === 'Курсор') {
                titleModal.textContent = `${'Компания...'}` + ' ' + '(' + `${el.length}` + ')'
            }
            else {
                titleModal.textContent = `${nameGroup}` + ' ' + '(' + `${el.length}` + ')'
            }
            group.appendChild(titleModal)
            const filterV = document.createElement('i')
            filterV.classList.add('fas')
            filterV.classList.add('fa-sort-amount-up')
            filterV.classList.add('filterV')
            titleModal.appendChild(filterV)
            const filterVN = document.createElement('i')
            filterVN.classList.add('fas')
            filterVN.classList.add('fa-sort-amount-down')
            filterVN.classList.add('filterVN')
            login === 'Курсор' ? (filterVN.style.display = 'none', filterV.style.display = 'none') : null
            titleModal.appendChild(filterVN)
            const chek = document.createElement('i')
            chek.classList.add('fa')
            chek.classList.add('fa-check')
            chek.classList.add('chekHidden')
            titleModal.prepend(chek)
            const minusS = document.createElement('i')
            minusS.classList.add('fas')
            minusS.classList.add('fa-toggle-on')
            minusS.classList.add('minusS')
            const plusS = document.createElement('i')
            plusS.classList.add('fas')
            plusS.classList.add('fa-toggle-off')
            plusS.classList.add('plusS')
            titleModal.prepend(minusS)
            titleModal.prepend(plusS)
            const del = document.createElement('i')
            del.classList.add('fas')
            del.classList.add('fa-times')
            del.classList.add('deleteGroup')
            const sett = document.createElement('i')
            sett.classList.add('fas')
            sett.classList.add('fa-wrench')
            sett.classList.add('settingsGroup')
            titleModal.appendChild(del)
            titleModal.appendChild(sett)

            let sub = false
            if (el[0].length > 8 && el[0][8].sub.length !== 0) {
                sub = true
                const subgroupAll = document.createElement('div');
                subgroupAll.classList.add('subgroupAll');
                group.appendChild(subgroupAll)
                el[0][8].sub.forEach(item => {
                    const nameSubGroup = item[0][6]
                    const subgroup = document.createElement('div');
                    subgroup.classList.add('subgroup');
                    subgroup.classList.add(`${nameSubGroup}`)
                    subgroup.setAttribute('rel', `${nameSubGroup}`)
                    subgroup.setAttribute('id', item[0][7])
                    subgroup.style.display = 'flex',
                        subgroup.style.flexDirection = 'column'
                    subgroup.style.alignItems = 'start'
                    subgroup.style.width = 100 + '%'
                    subgroupAll.appendChild(subgroup)
                    const subTitle = document.createElement('div');
                    subTitle.classList.add('subTitle');
                    subTitle.classList.add('titlekursor');
                    subTitle.innerHTML = `<i class="fa fa-check chekHidden subcheck"></i> 
                    ${item[0][6]} (${item.length})
                     <i class="fas fa-times deleteGroup"></i>
                      <i class="fas fa-wrench settingsGroup"></i>
                      <i class="fas fa-sort-amount-up filterV"></i>
                      <i class="fas fa-sort-amount-down filterVN"></i>`
                    subgroup.appendChild(subTitle);
                    const hiddenModal = document.createElement('div')
                    hiddenModal.classList.add('hiddenSubModal')
                    subgroup.appendChild(hiddenModal);
                    const listArr = document.querySelector(`.${nameGroup}`).querySelector(`.${nameSubGroup}`)
                    item.forEach(async elem => {
                        if (Object.values(elem[0]).length !== 0) {
                            const nameCar = elem[0].message.replace(/\s+/g, '')
                            const listItemCar = document.createElement('div')
                            listItemCar.classList.add('listItem')
                            listItemCar.classList.add('kursor')
                            listItemCar.classList.add('sub')
                            listItemCar.classList.add(`${elem[4]}`)
                            listItemCar.setAttribute('rel', `${elem[4]}`)
                            listItemCar.setAttribute('id', `${elem[4]}`)
                            listArr.lastChild.appendChild(listItemCar)
                            const listName = document.createElement('div')
                            listName.classList.add('list_name2')
                            listName.setAttribute('rel', `name`)
                            listName.classList.add('kursor_name')
                            listItemCar.appendChild(listName)
                            listName.textContent = elem[0].message

                            const typeOss = createElements(listName, nameCar, listItemCar)

                            const listCheck = document.createElement('i')
                            listCheck.classList.add('fa')
                            listCheck.classList.add('fa-check')
                            listCheck.classList.add('checkInList')
                            listCheck.style.marginLeft = '10px'
                            listCheck.setAttribute('rel', `${nameCar}`)
                            listCheck.setAttribute('id', `${nameCar}`)
                            listName.prepend(listCheck)


                            const listDelete = document.createElement('i')
                            listDelete.classList.add('fas')
                            listDelete.classList.add('fa-times')
                            listDelete.classList.add('deleteObject')
                            listDelete.setAttribute('rel', `${nameCar}`)
                            listDelete.setAttribute('id', `${nameCar}`)
                            listName.prepend(listDelete)
                            new Tooltip(listDelete, ['Удалить объект'])

                            const pref = document.createElement('i')
                            pref.classList.add('fas')
                            pref.classList.add('fa-wrench')
                            pref.classList.add('pref')
                            listName.prepend(pref)
                            new Tooltip(pref, ['Редактировать объект'])

                            let in1;
                            let statusnew;
                            let sats;
                            let type;
                            final.forEach(i => {
                                if (i[0] === 'Зажигание' && i[2] === elem[4] || i[0] === 'in1' && i[2] === elem[4]) {
                                    in1 = i[3] === -348201.3876 ? '-' : Number(i[3])
                                }
                            })

                            if (elem[0].result) {
                                const modelUniq = convert(elem[0].result)
                                modelUniq.forEach(os => {
                                    type = os.type
                                    const osi = document.createElement('div')
                                    osi.classList.add('osi_list')
                                    if (os.trailer !== 'Прицеп' && os.tyres === '2' || os.trailer !== 'Прицеп' && os.tyres === '4') {
                                        fnTagach(os, elem[4], nameGroup)
                                    }
                                    if (os.trailer === 'Прицеп' && os.tyres === '2' || os.trailer == 'Прицеп' && os.tyres === '4') {
                                        fnPricep(os, elem[4], nameGroup)
                                    }
                                })
                            }

                            const groups = document.querySelector(`.${nameGroup}`)
                            const listRel = Array.from(groups.lastElementChild.querySelectorAll('.listItem')).filter(it => it.getAttribute('rel') === `${String(elem[4])}`)
                            listRel.forEach(e => {
                                const shina = e.querySelectorAll('.arc');
                                let num = 0;
                                shina.forEach(e => {
                                    num++
                                    e.setAttribute('id', num)
                                })
                                const r = [];
                                let integer;
                                if (elem[1].result) {
                                    const modelUniqValues = convert(elem[1].result)
                                    modelUniqValues.forEach(el => {
                                        r.push(el.tyresdiv)
                                    })
                                    elem[2].result.forEach((el) => {
                                        if (el.name === 'sats') {
                                            sats = el.value
                                        }
                                        modelUniqValues.forEach((item) => {
                                            if (el.name == item.pressure) {

                                                shina.forEach(e => {
                                                    if (e.id == item.tyresdiv) {
                                                        if (el.status === 'false' && in1 === 1) {
                                                            e.children[0].style.fill = 'gray'
                                                            return
                                                        }
                                                        if (in1 === 0 || in1 === '-') {
                                                            e.children[0].style.fill = '#000'
                                                            return
                                                        }
                                                        if (nameCar == 'А652УА198') {
                                                            integer = parseFloat((el.value / 10).toFixed(1))
                                                        }
                                                        else {
                                                            integer = el.value
                                                        }
                                                        elem[3].result.forEach(it => {
                                                            if (it.idOs == item.osNumber) {
                                                                e.children[0].style.fill = objColorFront[generDav(integer, it)]
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    })
                                    statusnew = sats === '' ? '-' : sats > 4 && in1 === 1 ? 'ВКЛ' : 'ВЫКЛ';

                                }
                            })

                            updateIconsSensors(final, elem[4], listItemCar, statusnew, sats, type, in1)
                            listItemCar.insertBefore(typeOss[1], listItemCar.children[6])
                            listItemCar.insertBefore(typeOss[0], listItemCar.children[5])
                        }

                    })

                })
            }
            const hiddenModal = document.createElement('div')
            hiddenModal.classList.add('hiddenModal')
            group.classList.add(`${nameGroup}`)
            group.setAttribute('rel', `${nameGroup}`)
            group.appendChild(hiddenModal)

            const listArr = document.querySelector(`.${nameGroup}`)
            el.forEach(async elem => {
                if (Object.values(elem[0]).length !== 0) {
                    const nameCar = elem[0].message.replace(/\s+/g, '')
                    const listItemCar = document.createElement('div')
                    listItemCar.classList.add('listItem')
                    listItemCar.classList.add('master')
                    listItemCar.classList.add(`${elem[4]}`)
                    listItemCar.setAttribute('rel', `${elem[4]}`)
                    listItemCar.setAttribute('id', `${elem[4]}`)
                    listArr.lastChild.appendChild(listItemCar)
                    const listName = document.createElement('div')
                    listName.classList.add('list_name2')
                    listName.setAttribute('rel', `name`)
                    listItemCar.appendChild(listName)
                    listName.textContent = elem[0].message

                    const typeOss = createElements(listName, nameCar, listItemCar)

                    const listCheck = document.createElement('i')
                    listCheck.classList.add('fa')
                    listCheck.classList.add('fa-check')
                    listCheck.classList.add('checkInList')
                    listCheck.setAttribute('rel', `${nameCar}`)
                    listCheck.setAttribute('id', `${nameCar}`)
                    listName.prepend(listCheck)


                    const listDelete = document.createElement('i')
                    listDelete.classList.add('fas')
                    listDelete.classList.add('fa-times')
                    listDelete.classList.add('deleteObject')
                    listDelete.setAttribute('rel', `${nameCar}`)
                    listDelete.setAttribute('id', `${nameCar}`)
                    listName.prepend(listDelete)
                    new Tooltip(listDelete, ['Удалить объект'])

                    const pref = document.createElement('i')
                    pref.classList.add('fas')
                    pref.classList.add('fa-wrench')
                    pref.classList.add('pref')
                    pref.style.color = elem[5] === true ? 'rgba(6, 28, 71, 1)' : 'red'
                    listName.prepend(pref)
                    new Tooltip(pref, ['Редактировать объект'])
                    if (elem[elem.length - 1] === 'kursor') {
                        listItemCar.classList.add('kursor')
                        listName.classList.add('kursor_name')
                    }
                    else {
                        listItemCar.classList.add('wialon')
                    }

                    let in1;
                    let statusnew;
                    let sats;
                    let type;

                    final.forEach(i => {
                        if (i[0] === 'Зажигание' && i[2] === elem[4] || i[0] === 'in1' && i[2] === elem[4]) {
                            in1 = i[3] === -348201.3876 ? '-' : Number(i[3])
                        }
                    })
                    if (elem[0].result) {
                        const modelUniq = convert(elem[0].result)
                        modelUniq.forEach(os => {
                            type = os.type
                            const osi = document.createElement('div')
                            osi.classList.add('osi_list')
                            if (os.trailer !== 'Прицеп' && os.tyres === '2' || os.trailer !== 'Прицеп' && os.tyres === '4') {
                                fnTagach(os, elem[4], nameGroup)
                            }
                            if (os.trailer === 'Прицеп' && os.tyres === '2' || os.trailer == 'Прицеп' && os.tyres === '4') {
                                fnPricep(os, elem[4], nameGroup)
                            }
                        })
                    }
                    const groups = document.querySelector(`.${nameGroup}`)
                    const listRel = Array.from(groups.lastElementChild.querySelectorAll('.listItem')).filter(it => it.getAttribute('rel') === `${String(elem[4])}`)
                    listRel.forEach(e => {
                        const shina = e.querySelectorAll('.arc');
                        let num = 0;
                        shina.forEach(e => {
                            num++
                            e.setAttribute('id', num)
                        })
                        const r = [];
                        let integer;
                        if (elem[1].result) {
                            const modelUniqValues = convert(elem[1].result)
                            modelUniqValues.forEach(el => {
                                r.push(el.tyresdiv)
                            })
                            elem[2].result.forEach((el) => {
                                if (el.name === 'sats') {
                                    sats = el.value
                                }
                                modelUniqValues.forEach((item) => {
                                    if (el.name == item.pressure) {
                                        shina.forEach(e => {
                                            if (e.id == item.tyresdiv) {
                                                if (el.status === 'false' && in1 === 1) {
                                                    e.children[0].style.fill = 'gray'
                                                    return
                                                }
                                                if (in1 === 0 || in1 === '-') {
                                                    e.children[0].style.fill = '#000'
                                                    return
                                                }
                                                if (nameCar == 'А652УА198') {
                                                    integer = parseFloat((el.value / 10).toFixed(1))
                                                }
                                                else {
                                                    integer = el.value
                                                }
                                                elem[3].result.forEach(it => {
                                                    if (it.idOs == item.osNumber) {
                                                        e.children[0].style.fill = objColorFront[generDav(integer, it)]
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            })
                            statusnew = sats === '' ? '-' : sats > 4 && in1 === 1 ? 'ВКЛ' : 'ВЫКЛ';

                        }

                    })

                    updateIconsSensors(final, elem[4], listItemCar, statusnew, sats, type, in1)
                    listItemCar.insertBefore(typeOss[1], listItemCar.children[6])
                    listItemCar.insertBefore(typeOss[0], listItemCar.children[5])
                }
            })
        }
    })

    updateSensor = true
    await viewList(login)

    const toggleList = new ToggleHiddenList()
    toggleList.init()
    toggleList.statistikaObjectCar(final)
    initSummary = new SummaryViewControll(result)
    initCharts = new ChartsViewControll()
    initCharts.getDataSummary()
    finishload = true
    validRole()
    navigator();
    setInterval(zaprosSpisok, 60000, toggleList)
}


function validRole() {
    const role = document.querySelector('.role').getAttribute('rel')
    const pref = document.querySelectorAll('.pref')
    const deleteObject = document.querySelectorAll('.deleteObject')
    const deleteGroup = document.querySelectorAll('.deleteGroup')
    const settingsGroups = document.querySelectorAll('.settingsGroup')
    const createObject = document.querySelector('.create_object')
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
        createObject.style.display = 'none';
        pref.forEach(e => {
            e.style.display = 'none'
        })
        deleteObject.forEach(e => {
            e.style.display = 'none'
        })
        deleteGroup.forEach(e => {
            e.style.display = 'none'
        })
        settingsGroups.forEach(e => {
            e.style.display = 'none'
        })
    }
}


function createElements(listName, nameCar, listItemCar) {
    const listReport = document.createElement('i')
    listReport.classList.add('fas')
    listReport.classList.add('fa-print')
    listReport.classList.add('report_map_InList')
    listReport.classList.add('report_unit')
    listReport.setAttribute('rel', `${nameCar}`)
    listReport.setAttribute('id', `${nameCar}`)
    listName.prepend(listReport)

    new Tooltip(listReport, ['Перейти в отчеты'])

    const listMap = document.createElement('i')
    listMap.classList.add('fas')
    listMap.classList.add('fa-map-marker-alt')
    listMap.classList.add('report_map_InList')
    listMap.classList.add('map_unit')
    listMap.setAttribute('rel', `${nameCar}`)
    listMap.setAttribute('id', `${nameCar}`)
    listName.prepend(listMap)
    new Tooltip(listMap, ['Перейти на карту'])

    const listProfil = document.createElement('div')
    listProfil.classList.add('newCelChange')
    listProfil.setAttribute('rel', `pressure tagach`)
    listProfil.classList.add('list_profil2')
    listItemCar.appendChild(listProfil)
    const listTrail = document.createElement('div')
    listTrail.classList.add('newCelChange')
    listTrail.setAttribute('rel', `pressure pricep`)
    listTrail.classList.add('list_trail2')
    listItemCar.appendChild(listTrail)


    return [listProfil, listTrail]
}
export const viewList = async (login) => {
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
        globalSelect()
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
            el.children[0].checked = parsedObj[el.children[0].id].view === false ? false : true
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
        globalSelect()
    }
}
export async function alternativa(data) {
    const arr = data.filter(e => e.id)
    return new Promise(async function (resolve, reject) {
        sensorsName = true
        const login = document.querySelectorAll('.log')[1].textContent
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ arr, login }))
        }
        const sens = await fetch('/api/getSensorsWialonToBase', param)
        const allsens = await sens.json()
        const itog = allsens.map(e => {
            return [e.sens_name, e.param_name, Number(e.idw), Number(e.value)]
        })
        lastSensor = true
        const sesnorsKursor = await getParamsKursorSensors(arr)
        const result = itog.concat(sesnorsKursor[0])
        resolve(result)

    });
}

async function getParamsKursorSensors(data) {
    const id = data.map(e => e.id);
    const last = id.map(async idw => {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw }))
        }
        const parametrs = await fetch('api/getParamsKursor', params)
        const lastParams = await parametrs.json()
        const itog = lastParams.flatMap(el => {
            let speed;
            const bool = id.includes(Number(el.idObject));
            if (bool) {
                return Object.entries(el).map(([key, value]) => {
                    if (key === 'speed') {
                        speed = Number(Number(el[key]).toFixed(0))
                    }
                    return [key, key, Number(el.idObject), el[key]];
                }).concat(
                    [['state', 'state', Number(el.idObject), speed === 0 ? 0 : 1],
                    ['lasttime', 'listtime', Number(el.idObject), Number(el.time)]]
                )
            }
            return []; // Возвращаем пустой массив, если условие не выполнено
        });
        return itog
    })

    const lastParams = await Promise.allSettled(last)
    const fulfilledPromises = lastParams
        .filter(promise => promise.status === 'fulfilled')
        .map(promise => promise.value);

    if (fulfilledPromises.length !== 0) {
        const itog = fulfilledPromises.reduce((accumulator, currentArray) => {
            return [accumulator[0].concat(currentArray)];
        }, [[], []])
        return itog
    }
    else {
        return [[]]
    }
}

function updateIconsSensors(data, elemId, listItemCar, statusnew, sats, type, in1) {
    const countElem = document.querySelectorAll('.newColumn')
    let oil;
    let pwr;
    let meliage;
    let condition;
    let updatetime;

    const objCondition = {
        0: `<i class="fas fa-parking toogleIcon"rel="03g"></i>`,
        1: `<i class="fas fa-arrow-alt-circle-right toogleIcon" rel="01g"></i>`,
        2: `<i class="fas fa-pause-circle toogleIcon"rel="02g"></i>`
    }

    data.forEach(i => {
        if (i[2] === elemId) {
            if (i[0] === 'Топливо') {
                oil = i[3] === -348201 ? '-' : `${i[3].toFixed(0)} л.`
            }
            if (i[0].startsWith('Бортовое') || i[0].startsWith('pwr_ex')) {
                pwr = i[3] === -348201 ? '-' : parseFloat(Number(i[3]).toFixed(1))
            }
            if (i[0].startsWith('Одом') || i[0].startsWith('Пробег') || i[0].startsWith('meliage')) {
                meliage = i[3] === -348201 ? '-' : `${Number(i[3]).toFixed(0)} км.`
            }
            if (i[0] === 'lasttime') {
                const nowTime = parseFloat(((new Date().getTime()) / 1000).toFixed(0))
                const currentTime = nowTime - i[3]
                statusnew = currentTime > 3600 ? 'ВЫКЛ' : statusnew
                updatetime = i[3] == null ? undefined : convertTime(currentTime)
            }
            if (i[0] === 'state') {
                condition = objCondition[i[3]]
            }

        }
    })
    const iconValues = {
        statusnew: [statusnew, `<i class="fas fa-satellite-dish actIcon"></i>`],
        ingine: [in1, `<i class="fas fa-key actIcon"></i>`],
        condition: [condition, condition],
        oil: [oil, oil],
        pwr: [pwr, pwr],
        sats: [sats, sats],
        type: [type, type],
        meliage: [meliage, meliage],
        lasttime: [updatetime, updatetime]
    }
    for (let i = 0; i < countElem.length; i++) {
        const newClass = countElem[i].getAttribute('rel')
        const existingCel = listItemCar.querySelector(`.newCel[rel="${newClass}"]`);

        if (!existingCel) {
            const newCel = document.createElement('div')
            newCel.classList.add('newCel')
            newCel.classList.add('newCelChange')
            newCel.setAttribute('rel', `${newClass}`)
            newClass === 'type' || newClass === 'meliage' ? newCel.classList.add('newCelTextType') : null
            const classes = ['meliage', 'pwr', 'oil', 'lasttime'];
            if (classes.includes(newClass)) {
                newCel.classList.add('rightLine');
            }
            newClass === 'lasttime' ? newCel.classList.add('newCelTimeType') : null
            newCel.innerHTML = iconValues[newClass][1]
            iconValues[newClass][0] === undefined ? newCel.innerHTML = '-' : null
            newClass === 'statusnew' && iconValues[newClass][0] === 'ВКЛ' ? newCel.children[0].classList.add('toogleIcon') : newClass === 'statusnew' && iconValues[newClass][0] === undefined ? newCel.innerHTML = '-' : null
            newClass === 'ingine' && iconValues[newClass][0] === 1 ? newCel.children[0].classList.add('toogleIcon') : newClass === 'ingine' && iconValues[newClass][0] === '-' ? newCel.innerHTML = '-' : null
            newClass === 'type' && iconValues[newClass][0] === 'Тип ТС' || newClass === 'type' && iconValues[newClass][0] == undefined ? newCel.innerHTML = '-' : null
            listItemCar.appendChild(newCel)
        }
        else {
            existingCel.innerHTML = iconValues[newClass][1];
            newClass === 'statusnew' && iconValues[newClass][0] === 'ВКЛ' ? existingCel.children[0].classList.add('toogleIcon') : newClass === 'statusnew' && iconValues[newClass][0] === undefined ? existingCel.innerHTML = '-' : null;
            newClass === 'ingine' && iconValues[newClass][0] === 1 ? existingCel.children[0].classList.add('toogleIcon') : newClass === 'ingine' && iconValues[newClass][0] === '-' ? existingCel.innerHTML = '-' : null;
            newClass === 'type' && iconValues[newClass][0] === 'Тип ТС' || newClass === 'type' && iconValues[newClass][0] === undefined ? existingCel.innerHTML = '-' : null;
            iconValues[newClass][0] === undefined ? existingCel.innerHTML = '-' : null;
        }
    }

}

function fnTagach(arr, nameCarId, group) {
    const groups = document.querySelector(`.${group}`)
    const listRel = Array.from(groups.lastElementChild.querySelectorAll('.listItem')).filter(it => it.getAttribute('rel') === `${String(nameCarId)}`)
    listRel.forEach(e => {
        const obj = [];
        let counts = 0
        for (let i = 0; i < arr.tyres; i++) {
            counts++
            const ob = {}
            ob.tyres = counts
            ob.rate = 100 / arr.tyres
            obj.push(ob)
        }
        const svg = d3.select(e).select(".list_profil2").append("svg")
            .attr("class", "axis2")
            .attr("width", 18)
            .attr("height", 18)
            .style('margin', '0 1px')
            .append("g")
            .attr('class', 'gOs')
            .attr('id', arr.osi)
            .attr("transform",
                "translate(" + (9) + "," + (9) + ")");
        // задаем радиус
        const radius = 4;
        const rr = (Math.PI / 180);
        // создаем элемент арки с радиусом
        const arc = d3.arc()
            .outerRadius(radius)
            .innerRadius(8)
            .startAngle(function (d) { return d.startAngle + Math.PI })
            .endAngle(function (d) { return d.endAngle + Math.PI });
        const pie = d3.pie()
            .sort(null)
            .value(function (d) { return d.rate; });
        const g = svg.selectAll(".arc")
            .data(pie(obj))
            .enter()
            .append("g")
            .attr("class", "arc")
        g.append("path")
            .attr("d", arc)
            .style('fill', 'white')
            .style("stroke", 'black');
        const g1 = svg.append("g")
            .attr("transform", function (d, i) {
                return "translate(0,0)";
            });
        g1.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 4)
            .style('fill', 'black')
            .style('stroke', 'gray')
        const g2 = svg.append("g")
            .attr("transform", function (d, i) {
                return "translate(0,0)";
            });
        g2.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 0.5)
            .style('fill', 'white')

    })

}
function fnPricep(arr, nameCarId, group) {
    const groups = document.querySelector(`.${group}`)
    const listRel = Array.from(groups.lastElementChild.querySelectorAll('.listItem')).filter(it => it.getAttribute('rel') === `${String(nameCarId)}`)
    listRel.forEach(e => {
        // задаем радиус
        const obj = [];
        let counts = 0
        for (let i = 0; i < arr.tyres; i++) {
            counts++
            const ob = {}
            ob.tyres = counts
            ob.rate = 100 / arr.tyres
            obj.push(ob)
        }
        const svg = d3.select(e).select(".list_trail2").append("svg")
            .attr("class", "axis2")
            .attr("width", 18)
            .attr("height", 18)
            .style('margin', '0 0.5px')
            .append("g")
            .attr('class', 'gOs')
            .attr('id', arr.osi)
            .attr("transform",
                "translate(" + (9) + "," + (9) + ")");
        // задаем радиус
        const radius = 4;
        // создаем элемент арки с радиусом
        const arc = d3.arc()
            .outerRadius(radius)
            .innerRadius(8)
            .startAngle(function (d) { return d.startAngle + Math.PI })
            .endAngle(function (d) { return d.endAngle + Math.PI });
        const pie = d3.pie()
            .sort(null)
            .value(function (d) { return d.rate; });
        const g = svg.selectAll(".arc")
            .data(pie(obj))
            .enter().append("g")
            .attr("class", "arc")
        g.append("path")
            .attr("d", arc)
            .style('fill', 'white')
            .style("stroke", 'black');
        const g1 = svg.append("g")
            .attr("transform", function (d, i) {
                return "translate(0,0)";
            });
        g1.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 4)
            .style('fill', 'black')
            .style('stroke', 'gray')
        const g2 = svg.append("g")
            .attr("transform", function (d, i) {
                return "translate(0,0)";
            });
        g2.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 0.5)
            .style('fill', 'white')
    })
}
async function zaprosSpisok(toggleList) {
    const list = document.querySelectorAll('.listItem')
    const arrId = Array.from(list).map(el => ({ id: Number(el.id) }))
    const uniqData = [...new Set(arrId.map(JSON.stringify))].map(JSON.parse)
    const res = await alternativa(uniqData)
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ uniqData, arrId }))
    }
    const listsr = await fetch('/api/spisokList', param)
    const spisoks = await listsr.json()
    list.forEach(async el => {
        const idw = el.id
        const inn = res.filter(e => {
            if (e[2] === parseFloat(idw)) {
                return e;
            }
        });
        const spisok1 = spisoks.res.filter(e => {
            if (e.idw.id === Number(idw)) {
                return e.result
            }
        });
        const spisok = spisok1[0].result
        viewListKoleso(spisok[0], spisok[1], spisok[2], spisok[3], el, inn, res, toggleList)
    })
    const updateTime = document.querySelector('.update_time')
    let today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    today = day + '.' + month + '.' + year;
    let time = new Date();
    const hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    time = hour + ':' + minutes
    const todays = today + ' ' + time
    updateTime.textContent = 'Актуальность данных' + ' ' + todays
}
async function viewListKoleso(model, params, arg, osi, nameCar, inn, res, toggleList) {
    let in1;
    let statusnew;
    let sats;
    let type;
    const idw = parseFloat(nameCar.id)
    type = model.result && model.result.length !== 0 ? model.result[0].type : undefined
    const massItog = [];
    const shina = nameCar.querySelectorAll('.arc');

    if (params.result) {
        const modelUniqValues = convert(params.result)
        const activePost = nameCar.children[0].textContent.replace(/\s+/g, '')
        let integer;
        inn.forEach(i => {
            if (i[0] === 'Зажигание' || i[0] === 'in1') {
                in1 = i[3]
            }
        })
        arg.result.forEach((el) => {
            if (el.name === 'sats') {
                sats = el.value
            }
            modelUniqValues.forEach((item) => {

                if (el.name == item.pressure) {
                    shina.forEach(e => {
                        if (e.id == item.tyresdiv) {
                            if (el.status === 'false' && in1 === 1) {
                                e.children[0].style.fill = 'gray'
                                return
                            }
                            if (in1 === 0) {
                                e.children[0].style.fill = '#000'
                                return
                            }
                            if (activePost == 'А652УА198') {
                                integer = parseFloat((el.value / 10).toFixed(1))
                            }
                            else {
                                integer = el.value
                            }
                            arg.result.forEach((it) => {
                                if (it.name === item.temp) {
                                    massItog.push([activePost, e, item.pressure, integer, parseFloat(it.value)])
                                }
                            })
                            osi.result.forEach(it => {
                                if (it.idOs === item.osNumber) {
                                    e.children[0].style.fill = objColorFront[generDav(integer, it)]
                                }
                            })
                        }
                    })
                }
            })

        })
        statusnew = sats === '' ? '-' : sats > 4 && in1 === 1 ? 'ВКЛ' : 'ВЫКЛ';
        updateIconsSensors(res, idw, nameCar, statusnew, sats, type, in1)
    }
    toggleList.statistikaObjectCar(res)
}

async function fnStaticObjectOil(idw) {
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ idw }))
    }

    const res = await fetch('/api/tarirView', param)
    const response = await res.json()
    const x = [];
    const y = [];
    const points = []
    response.result.forEach(el => {
        const point = []
        x.push(Number(el.DUT))
        y.push(Number(el.litrs))
        point.push(Number(el.DUT))
        point.push(Number(el.litrs))
        points.push(point)
    })
    const argy = await fetch('/api/wialon', param)
    const arg = await argy.json()
    const parFind = await fetch('/api/iconFind', param)
    const paramssyFind = await parFind.json()
    arg.forEach(el => {
        paramssyFind.result.forEach(it => {
            if (el.name === it.params) {
                if (it.icons === 'oil-card') {
                    const val = el.value
                    let degree;
                    if (x.length < 3) {
                        degree = 1
                    }
                    if (x.length >= 3) {
                        degree = 6
                    }
                    const approximated = approximateValue(val, x, y, degree);
                    const znak = (approximated[0] * 0.9987).toFixed(0)
                    const progressBarText = document.querySelector('.progressBarText')
                    const progressBar = document.querySelector('.progressBar')
                    const value = znak * 100 / y[y.length - 1]
                    progressBarText.textContent = znak + ' ' + 'л.'
                    progressBar.style.width = value + '%'
                    if (value > 30 && value < 70) {
                        progressBar.style.background = 'yellow'
                    }
                    if (value < 20) {
                        progressBar.style.background = 'red'
                        progressBar.style.fontSize = '0.8rem'
                        progressBar.style.color = 'black'
                    }
                }
            }
        })
    })
}