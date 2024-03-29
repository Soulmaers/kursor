
import { convert } from './helpersFunc.js'
import { objColorFront, generDav } from './content.js'
import { convertTime } from './helpersFunc.js'
import { globalSelect } from './filtersList.js'
import { app } from '../main.js'
import { SummaryViewControll } from './summaryModules/class/SummaryViewControll.js'
import { ChartsViewControll } from './summaryModules/class/ChartsViewControll.js'
import { Tooltip } from '../class/Tooltip.js'
import { ClickObject } from './ClickObject.js'


export let initSummary
export let initCharts


export class SpisokObject {
    constructor(data) {
        this.data = data
        this.lowList = document.querySelector('.low_list')
        this.login = document.querySelectorAll('.log')[1].textContent
        this.allId = null
        this.final = null
        this.sensorsName = false;
        this.lastSensor = false;
        this.finishload = false;
        this.init()

    }
    async init() {
        this.simulateLoader()
        this.allId = this.format(this.data, 0)//корректировка структуры data
        this.final = this.format(this.data, 1) //корректировка структуры data
        this.findDomElement()  //поиск и удаление старых элементов
        this.createListObjectAndGroup() //создание списка групп и объектов на страницы
        const lists = this.lowList.querySelectorAll('.listItem')
        // const logs = document.querySelectorAll('.trEvent')
        // const twoChildren = [...logs].map(e => e.children[2])
        //  console.log(twoChildren)
        new ClickObject(lists)
        //new ClickObject(twoChildren)
        this.sensorsName = true
        this.lastSensor = true
        initSummary = new SummaryViewControll(this.allId)
        initCharts = new ChartsViewControll()
        initCharts.getDataSummary()
        await this.viewList(this.login)
        this.validRole()
        this.finishload = true
        setInterval(this.zaprosSpisok.bind(this), 100000)
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
        if (app.dataspisok) {
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

    updateIconsSensors(data, elemId, listItemCar, statusnew, sats, type, engine) {
        const countElem = document.querySelectorAll('.newColumn')
        let condition;
        let updatetime;

        const objCondition = {
            0: `<i class="fas fa-parking toogleIcon"rel="03g"></i>`,
            1: `<i class="fas fa-arrow-alt-circle-right toogleIcon" rel="01g"></i>`,
            2: `<i class="fas fa-pause-circle toogleIcon"rel="02g"></i>`
        }

        let oil;
        const summator = data.find(i => i[1] === 'summatorOil' && i[2] === elemId);
        if (summator && summator[5] === 'ON') {
            oil = `${summator[3].toFixed(0)} л.`
        }
        else {
            const oilValue = data.find(i => i[1] === 'oil' && i[2] === elemId);
            oil = oilValue ? oilValue[3] === null ? '-' : `${oilValue[3].toFixed(0)} л.` : '-';
        }

        const pwrValue = data.find(i => i[1] === 'pwr' && i[2] === elemId);
        const pwr = pwrValue ? parseFloat(Number(pwrValue[3]).toFixed(1)) : '-';
        const meliageValue = data.find(i => i[1] === 'mileage' && i[2] === elemId);
        const meliage = meliageValue ? `${Number(meliageValue[3]).toFixed(0)} км.` : '-';
        const speedValue = data.find(i => i[1] === 'speed' && i[2] === elemId);
        const speed = speedValue ? parseInt((speedValue[3]).toFixed(0)) : '-';
        const lastTimeValue = data.find(i => i[1] === 'last_valid_time' && i[2] === elemId);
        if (lastTimeValue) {
            const nowTime = parseFloat(((new Date().getTime()) / 1000).toFixed(0))
            const currentTime = nowTime - Number(lastTimeValue[3])
            statusnew = currentTime > 3600 ? 'ВЫКЛ' : statusnew
            updatetime = convertTime(currentTime)
        }

        if (speed !== '-' && (speed || speed === 0)) {
            const num = (speed > 0 && engine === 1) ? 1 : (speed === 0 && engine === 1) ? 2 : (speed === 0 && engine === 0) ? 0 : undefined;
            condition = objCondition[num]
        }

        const iconValues = {
            statusnew: [statusnew, `<i class="fas fa-satellite-dish actIcon"></i>`],
            ingine: [engine, `<i class="fas fa-key actIcon"></i>`],
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
                newClass === 'type' ? newCel.style.width = '150px' : null
                newClass === 'oil' || newClass === 'pwr' ? (countElem[i].style.width = '50px', newCel.style.width = '50px') : null
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
    async zaprosSpisok() {
        const list = document.querySelectorAll('.listItem')
        const arrId = Array.from(list).map(el => (Number(el.id)))
        const uniqData = [...new Set(arrId.map(JSON.stringify))].map(JSON.parse).map(id => Number(id));
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ uniqData }))
        }
        const listsr = await fetch('/api/spisokList', param)
        const spisoks = await listsr.json()
        list.forEach(el => {
            const idw = el.id
            const spisok1 = spisoks.res.filter(e => {
                if (e.idw === Number(idw)) {
                    return e.result
                }
            });
            const spisok = spisok1[0].result
            const data = Object.values(spisok[2])[0].filter(e => e.idw === idw && e.value !== 'Н/Д' && e.value !== null).map(it => [it.sens, it.params, Number(it.idw), Number(it.value), it.status, it.meta]);
            this.viewListKoleso(spisok[0], spisok[1], spisok[2], spisok[3], el, data)
        })
    }
    viewListKoleso(model, params, arg, osi, nameCar, data) {
        const idw = parseFloat(nameCar.id)
        const engineValue = data.find(i => i[1] === 'engine' && i[2] === idw);
        const engine = engineValue ? Number(engineValue[3]) : null;
        const satsValue = data.find(i => i[1] === 'sats' && i[2] === idw);
        const sats = satsValue ? Number(satsValue[3]) : null;
        const statusnew = sats ? sats > 4 && engine === 1 ? 'ВКЛ' : 'ВЫКЛ' : null
        const type = model.result && model.result.length !== 0 ? model.result[0].type : undefined
        const shina = nameCar.querySelectorAll('.arc');
        this.coloring(shina, nameCar, params, arg, osi, engine)
        this.updateIconsSensors(data, idw, nameCar, statusnew, sats, type, engine)
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
    coloring(shina, nameCar, params, arg, osi, engine) {
        if (params.result) {
            const modelUniqValues = convert(params.result)
            arg.result.forEach((el) => {
                const matchingItem = modelUniqValues.find(item => el.params == item.pressure);
                if (matchingItem) {
                    const matchingTyre = [...shina].find(e => e.id == matchingItem.tyresdiv);
                    if (matchingTyre) {
                        const integer = el.value;
                        const backgroundStyle = engine === 0 || engine === null ? '#000' : el.status === 'false' ? 'gray' :
                            integer !== null ? objColorFront[generDav(integer, osi.result.find(it => it.idOs == matchingItem.osNumber))] : null
                        matchingTyre.children[0].style.fill = backgroundStyle
                    }
                }
            });
        }
    }

    createListObjectAndGroup() {
        for (let el of this.data) {
            if (el.length !== 0) {
                const lowList = document.querySelector('.low_list')
                const group = document.createElement('div')
                group.classList.add('groups')
                el[0][el[0].length - 1] === 'kursor' ? group.classList.add('kursorgroups') : group.classList.add('wialongroups')
                const nameGroup = el[0][6].replace(/\s/g, '_');
                group.classList.add(`${nameGroup}`)
                group.setAttribute('id', el[0][7])
                group.style.display = 'flex',
                    group.style.flexDirection = 'column'
                group.style.width = 100 + '%',
                    lowList.appendChild(group)
                const titleModal = document.createElement('div')
                titleModal.classList.add('titleModal')
                el[0][el[0].length - 1] !== 'kursor' ? titleModal.classList.add('titlewialon') : titleModal.classList.add('titlekursor')
                if (this.login === 'Курсор') {
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
                this.login === 'Курсор' ? (filterVN.style.display = 'none', filterV.style.display = 'none') : null
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
                        for (let elem of item) {
                            if (Object.values(elem[0]).length !== 0) {
                                this.createIconsAndLeftSpisok(elem, this.final, listArr, nameGroup, 'kursor') // создание объектов, покраска колес, установка статусов и значений датчиков
                            }
                        }


                    })
                }
                const hiddenModal = document.createElement('div')
                hiddenModal.classList.add('hiddenModal')
                group.classList.add(`${nameGroup}`)
                group.setAttribute('rel', `${nameGroup}`)
                group.appendChild(hiddenModal)
                const listArr = document.querySelector(`.${nameGroup}`)
                for (let elem of el) {
                    if (Object.values(elem[0]).length !== 0) {
                        this.createIconsAndLeftSpisok(elem, this.final, listArr, nameGroup, 'master') // создание объектов, покраска колес, установка статусов и значений датчиков
                    }
                }
            }
        }
    }

    fnTagach(arr, nameCarId, group) {
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
    fnPricep(arr, nameCarId, group) {
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

    createElements(listName, nameCar, listItemCar) {
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
    createIconsAndLeftSpisok(elem, data, listArr, nameGroup, prefix) {
        const nameCar = elem[0].message.replace(/\s+/g, '')
        const listItemCar = document.createElement('div')
        listItemCar.classList.add('listItem')
        listItemCar.classList.add(`${prefix}`)
        prefix === 'kursor' ? listItemCar.classList.add(`sub`) : null
        listItemCar.classList.add(`${elem[4]}`)
        listItemCar.setAttribute('rel', `${elem[4]}`)
        listItemCar.setAttribute('id', `${elem[4]}`)
        listArr.lastChild.appendChild(listItemCar)
        const listName = document.createElement('div')
        listName.classList.add('list_name2')
        listName.setAttribute('rel', `name`)
        listItemCar.appendChild(listName)
        listName.textContent = elem[0].message
        const typeOss = this.createElements(listName, nameCar, listItemCar) //отрисовка объекта в списке

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
        pref.style.color = elem[5] === false ? 'red' : 'darkblue'
        listName.prepend(pref)
        new Tooltip(pref, ['Редактировать объект'])

        if (prefix === 'master') {
            if (elem[elem.length - 1] === 'kursor') {
                listItemCar.classList.add('kursor')
                listName.classList.add('kursor_name')
            }
            else {
                listItemCar.classList.add('wialon')
            }
        }

        let type;
        const engineValue = data.find(i => i[1] === 'engine' && i[2] === elem[4]);
        const engine = engineValue ? Number(engineValue[3]) : null;
        const satsValue = data.find(i => i[1] === 'sats' && i[2] === elem[4]);
        const sats = satsValue ? Number(satsValue[3]) : null;
        const statusnew = sats ? sats > 4 && engine === 1 ? 'ВКЛ' : 'ВЫКЛ' : null

        if (elem[0].result) {
            const modelUniq = convert(elem[0].result)
            modelUniq.forEach(os => {
                type = os.type
                const osi = document.createElement('div')
                osi.classList.add('osi_list')
                if (os.trailer !== 'Прицеп' && os.tyres === '2' || os.trailer !== 'Прицеп' && os.tyres === '4') {
                    this.fnTagach(os, elem[4], nameGroup)
                }
                if (os.trailer === 'Прицеп' && os.tyres === '2' || os.trailer == 'Прицеп' && os.tyres === '4') {
                    this.fnPricep(os, elem[4], nameGroup)
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
            this.coloring(shina, nameCar, elem[1], elem[2], elem[3], engine)
        })
        this.updateIconsSensors(data, elem[4], listItemCar, statusnew, sats, type, engine)
        listItemCar.insertBefore(typeOss[1], listItemCar.children[6])
        listItemCar.insertBefore(typeOss[0], listItemCar.children[5])
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
    updateData(newData) {
        this.data = newData
        this.init()
    }


    format(data, num) {
        if (num === 1) {
            const resultData = data.flat().flatMap(el => {
                let res = el[2].result.filter(e => e.value !== null).map(it => [it.sens, it.params, Number(it.idw), Number(it.value), it.status, it.meta]).filter(arr => arr.length > 0)
                if (el.length === 10 && el[8].sub.length !== 0) {
                    return Object.values(el[8].sub).flat().flatMap(it => it[2].result.filter(e => e.value !== null).map(it => [it.sens, it.params, Number(it.idw), Number(it.value), it.status, it.meta]).filter(arr => arr.length > 0));
                }
                return res;
            })
            const uniqueArr = Array.from(new Set(resultData.map(subArr => JSON.stringify(subArr)))).map(str => JSON.parse(str));
            return uniqueArr
        }
        else {
            const subArray = []
            const resultData = data.flat().flatMap(el => {
                let res = el[4];
                if (el.length === 10 && el[8].sub.length !== 0) {
                    subArray.push(Object.values(el[8].sub).flat().map(it => it[4]))
                }
                return res;
            });
            const uniqueArr = [...new Set(resultData.concat(subArray.flat()))];
            return uniqueArr
        }
    }
}