

import { Helpers } from './Helpers.js'
import { SetModel } from './SetModel.js'
import { objColor, generT, generFront, textTest } from '../../content.js'
import { SKDSHClass } from './SKDSHClass.js'


export class Configurator {
    constructor(id) {
        this.id = id
        this.change = this.startConfig.bind(this)
        this.clickDisk = this.viewSubMenu.bind(this, 'flex')
        this.cancel = this.viewSubMenu.bind(this, 'none')
        this.saved = this.saveConfigurator.bind(this)
        this.del = this.viewSubMenuDel.bind(this, 'flex')
        this.cancelDel = this.viewSubMenuDel.bind(this, 'none')
        this.savedDel = this.saveConfiguratorDelete.bind(this)
        this.index = 0
        this.getDOM()
        this.initAddEvent()
    }

    getDOM() {
        this.altConfig = document.getElementById('check_Title')
        // this.selectType = document.querySelector('.select_type')
        this.disk = document.querySelector('.disk')
        this.sensors = document.querySelector('.sensors')
        this.btnsens = document.querySelectorAll('.btnsens')
        this.korz = document.querySelector('.korz')
        this.save = this.disk.nextElementSibling.children[0]
        this.otmena = this.disk.nextElementSibling.children[1]
        this.saveDel = this.korz.nextElementSibling.children[0]
        this.otmenaDel = this.korz.nextElementSibling.children[1]

    }
    reinitialize(newId) {
        this.removeEventListeners();
        this.id = newId;
        this.getDOM()
        this.initAddEvent();
    }

    initAddEvent() {
        this.altConfig.addEventListener('change', this.change)
        this.disk.addEventListener('click', this.clickDisk)
        this.otmena.addEventListener('click', this.cancel)
        this.save.addEventListener('click', this.saved)
        this.korz.addEventListener('click', this.del)
        this.otmenaDel.addEventListener('click', this.cancelDel)
        this.saveDel.addEventListener('click', this.savedDel)
    }
    removeEventListeners() {
        this.altConfig.removeEventListener('change', this.change)
        this.disk.removeEventListener('click', this.clickDisk)
        this.otmena.removeEventListener('click', this.cancel)
        this.save.removeEventListener('click', this.saved)
        this.korz.removeEventListener('click', this.del)
        this.otmenaDel.removeEventListener('click', this.cancelDel)
        this.saveDel.removeEventListener('click', this.savedDel)
    }
    viewSubMenuDel(num) {
        this.korz.nextElementSibling.style.display = num
    }
    viewSubMenu(num) {
        this.disk.nextElementSibling.style.display = num
    }

    async saveConfiguratorDelete() {
        const instance = new SetModel(this.selectType, this.sensors, this.id)
        await instance.reqDelete(this.id)
        await instance.paramsDelete(this.id)
        await instance.barDelete(this.id)
        this.viewSubMenuDel('none')
    }

    async saveConfigurator() {
        const instance = new SetModel(this.selectType, this.sensors, this.id)
        await instance.init()
        this.clearConfig()
        this.viewSubMenu('none')
    }

    startConfig() {
        // const selectOld = this.selectType.options[this.selectType.selectedIndex].textContent
        const checkAlt = document.getElementById('check_Title')
        checkAlt.checked ? this.createConfig() : this.clearConfig()
    }

    createConfig() {
        const tiresActiv = document.querySelector('.tiresActiv')
        tiresActiv ? tiresActiv.classList.remove('tiresActiv') : null
        const checkAlt = document.querySelector('.checkAlt')
        checkAlt.style.color = 'red'
        checkAlt.style.fontWeight = 'bold'

        const altConfig = document.querySelector('.altConfig')
        const alt = document.querySelector('.containerAlt')
        const disketa = document.querySelector('.disketa')
        disketa.style.display = 'flex'
        const korzina = document.querySelector('.korzina')
        korzina.style.display = 'flex'
        if (alt) {
            alt.style.marginTop = '0'
            this.nowModel(alt)
            return
        }
        const containerAlt = document.createElement('div')
        containerAlt.classList.add('containerAlt')
        altConfig.insertBefore(containerAlt, altConfig.children[1]);
        const wrapperTagach = document.createElement('div')
        wrapperTagach.classList.add('wrapperTagach')
        const wrapperPricep = document.createElement('div')
        wrapperPricep.classList.add('wrapperPricep')
        containerAlt.appendChild(wrapperTagach)
        containerAlt.appendChild(wrapperPricep)
        const titleTagach = document.createElement('div')
        titleTagach.classList.add('titleTagach')
        wrapperTagach.appendChild(titleTagach)
        const containerTagach = document.createElement('div')
        containerTagach.classList.add('containerTagach')
        wrapperTagach.appendChild(containerTagach)
        const titlePricep = document.createElement('div')
        titlePricep.classList.add('titlePricep')
        wrapperPricep.appendChild(titlePricep)
        const containerPricep = document.createElement('div')
        containerPricep.classList.add('containerPricep')
        wrapperPricep.appendChild(containerPricep)
        const titleT = document.createElement('div')
        titleT.classList.add('titleT')
        titleTagach.appendChild(titleT)
        titleT.textContent = 'Тягач'
        const titleP = document.createElement('div')
        titleP.classList.add('titleP')
        titlePricep.appendChild(titleP)
        titleP.textContent = 'Прицеп'
        const numT = document.createElement('div')
        numT.classList.add('numT')
        titleTagach.appendChild(numT)
        const quantityT = document.createElement('div')
        quantityT.classList.add('quantityT')
        numT.appendChild(quantityT)
        quantityT.textContent = 'Кол-во осей:'
        const kolvoT = document.createElement('div')
        kolvoT.classList.add('kolvoT')
        numT.appendChild(kolvoT)
        kolvoT.textContent = 0
        const choiceT = document.createElement('div')
        choiceT.classList.add('choiceT')
        titleTagach.appendChild(choiceT)
        const pluT = document.createElement('div')
        pluT.classList.add('pluT')
        choiceT.appendChild(pluT)
        const miT = document.createElement('div')
        miT.classList.add('miT')
        choiceT.appendChild(miT)
        const numP = document.createElement('div')
        numP.classList.add('numP')
        titlePricep.appendChild(numP)
        const quantityP = document.createElement('div')
        quantityP.classList.add('quantityP')
        numP.appendChild(quantityP)
        quantityP.textContent = 'Кол-во осей:'
        const kolvoP = document.createElement('div')
        kolvoP.classList.add('kolvoP')
        numP.appendChild(kolvoP)
        kolvoP.textContent = 0
        const choiceP = document.createElement('div')
        choiceP.classList.add('choiceP')
        titlePricep.appendChild(choiceP)
        const pluP = document.createElement('div')
        pluP.classList.add('pluP')
        choiceP.appendChild(pluP)
        const miP = document.createElement('div')
        miP.classList.add('miP')
        choiceP.appendChild(miP)
        this.listenerNum()
    }

    async clearConfig() {
        const wrapRight = document.querySelector('.wrapper_right')
        const msg = document.querySelectorAll('.msg')
        msg.forEach(el => el.style.fontWeight = '300')
        document.querySelector('.acto') ? document.querySelector('.acto').classList.remove('acto') : null
        document.querySelector('.actBTN') ? document.querySelector('.actBTN').classList.remove('actBTN') : null
        this.sensors.style.display === 'flex' ? (this.sensors.style.display = 'none', wrapRight.style.zIndex = 0,
            document.querySelector('.popup-background').style.display = 'none') : null
        const checkAlt = document.querySelector('.checkAlt')
        checkAlt.style.color = 'black'
        checkAlt.style.fontWeight = '400'
        const disketa = document.querySelector('.disketa')
        disketa.style.display = 'none'
        const korzina = document.querySelector('.korzina')
        korzina.style.display = 'none'
        const alt = document.querySelector('.containerAlt')
        if (alt) {
            alt.remove();
        }
        const idw = document.querySelector('.color').id
        const data = await this.getNewData(idw)
        // console.log(data)
        new SKDSHClass(data, idw)
    }

    async getNewData(idw) {
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw }))
        }
        const mod = await fetch('/api/modelView', param)
        const model = await mod.json()
        const paramsss = await fetch('/api/tyresView', param)
        const params = await paramsss.json()
        const datas = await fetch('/api/getSens', param)
        const data = await datas.json()
        const os = await fetch('/api/barView', param)
        const osi = await os.json()
        data.sort((prev, next) => {
            if (prev.name < next.name) return -1;
            if (prev.name < next.name) return 1;
        })
        return [model.result, params.result, data, osi]
    }

    createOsNow(parent) {
        parent.innerHTML += `${textTest}`
        this.index++
        const centerOsDivTest = document.createElement('div');
        centerOsDivTest.classList.add('centerOsTest')
        const vnutTest = document.createElement('div')
        vnutTest.classList.add('vnutTest')
        centerOsDivTest.appendChild(vnutTest)
        parent.lastElementChild.children[0].insertAdjacentElement('afterEnd', centerOsDivTest);
        if (parent.lastElementChild.parentElement?.classList.contains('containerPricep')) {
            const spark = document.createElement('div')
            spark.classList.add('spark')
            spark.innerHTML = `<input class="sparkCheck" type="checkbox" rel=${this.index}>Колёса спарены`
            centerOsDivTest.prepend(spark)
            centerOsDivTest.classList.add('pricepT');
            centerOsDivTest.children[1].style.background = '#000'
            parent.querySelectorAll('.osiTest').forEach(el => {
                el.children[0].children.length === 2 ? el.children[1].children[0].children[0].checked = true : null
            })
        } else {
            centerOsDivTest.classList.add('tagachT');
            if (this.index !== 1 && parent.lastElementChild.parentElement?.classList.contains('containerTagach')) {
                const spark = document.createElement('div')
                spark.classList.add('spark')
                spark.innerHTML = `<input class="sparkCheck" type="checkbox" rel=${this.index}>Колёса спарены`
                centerOsDivTest.prepend(spark)
                parent.querySelectorAll('.osiTest').forEach(el => {
                    el.children[0].children.length === 2 ? el.children[1].children[0].children[0].checked = true : null
                })
            }
        }
        const center = document.querySelectorAll('.centerOsTest')
        Helpers.gosNum(center);
        const tiresTest = parent.lastElementChild.querySelectorAll('.tiresTest')
        let indexTires = 0;
        tiresTest.forEach(el => {
            indexTires++
            const linkTest = document.createElement('a');
            linkTest.classList.add('tires_link_test')
            el.appendChild(linkTest);
            const tiresDTest = document.createElement('div');
            tiresDTest.classList.add('tiresDTest')
            const tiresTTest = document.createElement('div');
            tiresTTest.classList.add('tiresTTest')
            linkTest.appendChild(tiresDTest);
            linkTest.appendChild(tiresTTest);
        })
        this.sparka()
    }

    nowModel(alt) {
        const centerOsTest = document.querySelectorAll('.centerOsTest')
        const osiTagach = document.querySelectorAll('.tagachT').length
        const osiPricep = document.querySelectorAll('.pricepT').length
        const wrapperTagach = document.createElement('div')
        wrapperTagach.classList.add('wrapperTagach')
        const wrapperPricep = document.createElement('div')
        wrapperPricep.classList.add('wrapperPricep')
        alt.appendChild(wrapperTagach)
        alt.appendChild(wrapperPricep)
        const titleTagach = document.createElement('div')
        titleTagach.classList.add('titleTagach')
        wrapperTagach.appendChild(titleTagach)
        const containerTagach = document.querySelector('.containerTagach')
        containerTagach.style.marginTop = '20px'
        wrapperTagach.appendChild(containerTagach)
        const titlePricep = document.createElement('div')
        titlePricep.classList.add('titlePricep')
        wrapperPricep.appendChild(titlePricep)
        const containerPricep = document.querySelector('.containerPricep')
        containerPricep.style.marginTop = '20px'
        wrapperPricep.appendChild(containerPricep)
        const titleT = document.createElement('div')
        titleT.classList.add('titleT')
        titleTagach.appendChild(titleT)
        titleT.textContent = 'Тягач'
        const titleP = document.createElement('div')
        titleP.classList.add('titleP')
        titlePricep.appendChild(titleP)
        titleP.textContent = 'Прицеп'
        const numT = document.createElement('div')
        numT.classList.add('numT')
        titleTagach.appendChild(numT)
        const quantityT = document.createElement('div')
        quantityT.classList.add('quantityT')
        numT.appendChild(quantityT)
        quantityT.textContent = 'Кол-во осей:'
        const kolvoT = document.createElement('div')
        kolvoT.classList.add('kolvoT')
        numT.appendChild(kolvoT)
        osiTagach ? kolvoT.textContent = osiTagach : kolvoT.textContent = 0
        const choiceT = document.createElement('div')
        choiceT.classList.add('choiceT')
        titleTagach.appendChild(choiceT)
        const pluT = document.createElement('div')
        pluT.classList.add('pluT')
        choiceT.appendChild(pluT)
        const miT = document.createElement('div')
        miT.classList.add('miT')
        choiceT.appendChild(miT)
        const numP = document.createElement('div')
        numP.classList.add('numP')
        titlePricep.appendChild(numP)
        const quantityP = document.createElement('div')
        quantityP.classList.add('quantityP')
        numP.appendChild(quantityP)
        quantityP.textContent = 'Кол-во осей:'
        const kolvoP = document.createElement('div')
        kolvoP.classList.add('kolvoP')
        numP.appendChild(kolvoP)
        osiPricep ? kolvoP.textContent = osiPricep : kolvoP.textContent = 0
        const choiceP = document.createElement('div')
        choiceP.classList.add('choiceP')
        titlePricep.appendChild(choiceP)
        const pluP = document.createElement('div')
        pluP.classList.add('pluP')
        choiceP.appendChild(pluP)
        const miP = document.createElement('div')
        miP.classList.add('miP')
        choiceP.appendChild(miP)
        const arrayPlu = document.querySelectorAll('.pluT, .pluP');
        const arrayMi = document.querySelectorAll('.miT, .miP');
        arrayMi.forEach(e => {
            e.addEventListener('click', () => {
                const elemKolvo = e.parentElement.previousElementSibling.children[1]
                let count = e.parentElement.previousElementSibling.children[1].textContent
                count > 0 ? count-- : count
                elemKolvo.textContent = count
                e.parentElement.parentElement.nextElementSibling.lastElementChild.remove()

                const osiClear = document.querySelectorAll('.centerOsTest')
                const osi = [];
                osiClear.forEach(e => {

                    if (e.closest('.containerPricep'))
                        osi.push(e)
                })
                const nomerP = document.createElement('div')
                nomerP.classList.add('nomerP')
                nomerP.style.top = '65px'
                osi[osi.length - 1].previousElementSibling.children.length === 2 ? nomerP.style.left = '15px' : nomerP.style.left = '63.5px'
                osi[osi.length - 1].style.position = 'relative'
                nomerP.style.display = 'flex'
                osi[osi.length - 1].appendChild(nomerP)
                const gosNumber = document.createElement('input')
                gosNumber.classList.add('gosNumber')
                gosNumber.setAttribute('placeholder', 'A000AA')
                gosNumber.maxLength = 6;
                nomerP.appendChild(gosNumber)
                const flagss = document.createElement('div')
                flagss.classList.add('flagss')
                nomerP.appendChild(flagss)
                const gosNumber1 = document.createElement('input')
                gosNumber1.classList.add('gosNumber1')
                gosNumber1.setAttribute('placeholder', '00')
                gosNumber1.maxLength = 3;
                flagss.appendChild(gosNumber1)
                const flag = document.createElement('div')
                flag.classList.add('flagy')
                flagss.appendChild(flag)
                const elemFlag1 = document.createElement('div')
                elemFlag1.classList.add('flagWhite')
                flag.appendChild(elemFlag1)
                const elemFlag2 = document.createElement('div')
                elemFlag2.classList.add('flagBlue')
                flag.appendChild(elemFlag2)
                const elemFlag3 = document.createElement('div')
                elemFlag3.classList.add('flagRed')
                flag.appendChild(elemFlag3)
            })
        })
        arrayPlu.forEach(e => {
            e.addEventListener('click', () => {
                const elemKolvo = e.parentElement.previousElementSibling.children[1]
                let count = e.parentElement.previousElementSibling.children[1].textContent
                count++
                elemKolvo.textContent = count
                console.log(e.parentElement.parentElement.nextElementSibling.children.length)
                this.createOsNow(e.parentElement.parentElement.nextElementSibling)
            })
        })
        let index = 0;
        centerOsTest.forEach(el => {
            index++
            if (el.closest('.containerPricep')) {
                const spark = document.createElement('div')
                spark.classList.add('spark')
                spark.innerHTML = `<input class="sparkCheck" type="checkbox" rel=${index}>Колёса спарены`
                el.prepend(spark)
                el.previousElementSibling.children.length === 2 ? el.children[0].children[0].checked = true : null
                el.children[1].style.background = '#000'
            } else {
                if (index !== 1 && el.closest('.containerTagach')) {
                    const spark = document.createElement('div')
                    spark.classList.add('spark')
                    spark.innerHTML = `<input class="sparkCheck" type="checkbox" rel=${index}>Колёса спарены`
                    el.prepend(spark)
                    el.previousElementSibling.children.length === 2 ? el.children[0].children[0].checked = true : null
                }
            }
        })
        this.sparka()
    }

    sparka() {
        const sparkCheck = document.querySelectorAll('.sparkCheck')
        sparkCheck.forEach(el => {
            el.addEventListener('change', () => {
                const osSpark = el.closest('.osiTest');
                if (el.checked) {
                    const spElements = osSpark.querySelectorAll('.tiresTest.sp');
                    if (spElements.length === 0) {
                        const tiresTest = document.createElement('div');
                        tiresTest.classList.add('tiresTest', 'sp');
                        osSpark.children[0].appendChild(tiresTest);
                        const linkTest = document.createElement('div');
                        linkTest.classList.add('tires_link_test');
                        tiresTest.appendChild(linkTest);
                        const tiresDTest = document.createElement('div');
                        tiresDTest.classList.add('tiresDTest');
                        const tiresTTest = document.createElement('div');
                        tiresTTest.classList.add('tiresTTest');
                        linkTest.appendChild(tiresDTest);
                        linkTest.appendChild(tiresTTest);
                        const tiresTest1 = document.createElement('div');
                        tiresTest1.classList.add('tiresTest', 'sp');
                        osSpark.children[2].prepend(tiresTest1);
                        const linkTest1 = document.createElement('div');
                        linkTest1.classList.add('tires_link_test');
                        tiresTest1.appendChild(linkTest1);
                        const tiresDTest1 = document.createElement('div');
                        tiresDTest1.classList.add('tiresDTest');
                        const tiresTTest1 = document.createElement('div');
                        tiresTTest1.classList.add('tiresTTest');
                        linkTest1.appendChild(tiresDTest1);
                        linkTest1.appendChild(tiresTTest1);
                    }
                    osSpark.children[1].children[1].style.width = '112px';

                } else {
                    osSpark.querySelectorAll('.tiresTest.sp').forEach(el => el.remove());
                    osSpark.children[1].children[1].style.width = '214px';

                }
                const nomerP = document.querySelector('.nomerP')
                if (nomerP) {
                    nomerP.closest('.centerOsTest').children[0].children[0].checked ? nomerP.style.left = '15px' : nomerP.style.left = '63.5px'
                }
                this.forTyres()
            });
        });
        this.forTyres()
    }
    forTyres() {
        const obo = document.querySelector('.obo')
        const globalWrapper = document.querySelector('.containerAlt')
        const tyres = globalWrapper.querySelectorAll('.tires_link_test')
        tyres.forEach(e => {
            e.addEventListener('click', () => {
                const tact = document.querySelector('.tiresActiv')
                tact ? obo.style.display = 'flex' : obo.style.display = 'none'
                tyres.forEach(e => {
                    const msg = document.querySelectorAll('.msg')
                    msg.forEach(el => {
                        el.style.color = 'rgba(6, 28, 71, 1)';
                        el.classList.remove('act')
                    })
                    e.classList.remove('tiresActiv')
                });
                e.classList.add('tiresActiv')
                this.sensors.style.display = 'flex';
                this.btnsens[0].style.display = 'flex'
                this.btnsens[1].style.display = 'flex'
            })
        })
        this.allparamsTyres()
    }

    allparamsTyres() {
        const active = document.querySelectorAll('.color')
        const msg = document.querySelectorAll('.msg')
        let prmsD = [];
        let prmsT = [];
        msg.forEach(el => {
            el.addEventListener('click', () => {
                const tiresActiv = document.querySelector('.tiresActiv')
                msg.forEach(e => {
                    e.style.color = 'rgba(6, 28, 71, 1)'
                })
                el.style.color = 'green'
                el.style.fontWeight = 'bold'
                const arrSpreed = [...el.textContent]
                let value;
                arrSpreed.forEach(el => {
                    if (el === ':') {
                        value = arrSpreed.splice(arrSpreed.indexOf(el) + 1, arrSpreed.length - 1).join('')
                    }
                })
                if (this.btnsens[0].classList.contains('actBTN')) {
                    arrSpreed.forEach(el => {
                        if (el === ':') {
                            tiresActiv.children[0].setAttribute('rel', arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join(''))
                            prmsD.push(arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join(''))
                        }
                    })
                    if (active[0].textContent == 'А 652 УА 198') {
                        value = (value / 10).toFixed(1)
                    }
                    else {
                        value
                    }
                    const valJob = value
                    valJob.length > 10 ?
                        tiresActiv.children[0].textContent = '-' :
                        tiresActiv.children[0].textContent = valJob + '\nБар'
                    tiresActiv.children[0].style.color = objColor[generFront(valJob)];
                }
                if (this.btnsens[1].classList.contains('actBTN')) {
                    arrSpreed.forEach(el => {
                        if (el === ':') {
                            tiresActiv.children[1].setAttribute('rel', arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join(''))
                            prmsT.push(arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join(''))
                        }
                    })
                    if (value === '-128' || value === '-51' || value === '-50' || value.length > 10) {
                        value = 'err'
                        tiresActiv.children[1].textContent = value
                    }
                    else {
                        tiresActiv.children[1].textContent = value + '°'
                        tiresActiv.children[1].style.color = objColor[generT(value)];
                    }
                }
            })
        })
    }

    down(elem) {
        const elemKolvo = elem.parentElement.previousElementSibling.children[1]
        let count = elem.parentElement.previousElementSibling.children[1].textContent
        count > 0 ? count-- : count
        elemKolvo.textContent = count
        elem.parentElement.parentElement.nextElementSibling.lastElementChild.remove()
        //  createOs(count, elem.parentElement.parentElement.nextElementSibling)
    }
    up(elem) {
        const elemKolvo = elem.parentElement.previousElementSibling.children[1]
        let count = elem.parentElement.previousElementSibling.children[1].textContent
        count++
        elemKolvo.textContent = count
        this.createOsNow(elem.parentElement.parentElement.nextElementSibling)
    }


    listenerNum() {
        const arrayPlu = document.querySelectorAll('.pluT, .pluP');
        const arrayMi = document.querySelectorAll('.miT, .miP');
        arrayMi.forEach(e => {
            e.addEventListener('click', () => {
                this.down(e)
            })
        })
        arrayPlu.forEach(e => {
            e.addEventListener('click', () => {
                this.up(e)
            })
        })
    }

}