
import { DraggableContainer } from '../../../class/Dragdown.js'
import { Tooltip } from '../../../class/Tooltip.js'
import { GetUpdateStruktura } from '../../../GetUpdateStruktura.js'


export class IconStatus {
    constructor(elem, info) {
        this.info = info
        this.elem = elem
        this.card = document.querySelectorAll('.icon_card')
        this.msg = null
        this.nameObject = null
        this.changeParams = document.querySelector('.changeParams')
        this.valueparamsObject = {}
        this.id = null
        this.targetElement = null
        this.targetCard = null
        this.params = null
        this.coefficient = null
        this.bool = false
        this.init()
        this.initEventListeners();
        GetUpdateStruktura.onDataReceived(this.render.bind(this));
        //  this.handleCardClick = this.toogleModalWindow.bind(this)

    }


    init() {
        console.log('инит')
        this.getParams(this.info)
        console.log('гет')
        this.listeModalWindow(this.elem)
        console.log(this.info)
        if (this.info.length === 0) return
    }
    reinitialize(newElem, info) {
        this.info = info
        this.elem = newElem; // Обновление id
        this.bool = false
        this.init()
    }

    initEventListeners() {
        console.log('слушатель')
        console.log(this.card)
        this.card.forEach(el => el.addEventListener('click', () => this.toogleModalWindow(event)));

    }

    render({ final }) {
        this.bool = true
        this.getParams(this.findData(final))
        this.displayIconValues(this.id)
    }

    findData(final) {
        const res = final.find(e => e.object_id === this.elem.id)
        return res
    }
    getParams(res) {
        console.log(res)
        this.info = this.bool ? res[2].result.map(e => [e.sens, e.params, e.idw, Number(e.value)]) :
            res[2].map(e => [e.sens, e.params, e.idw, Number(e.value)])
    }

    async listeModalWindow(elem) {
        this.targetElement = elem
        this.id = elem.id
        this.nameObject = elem.children[0].textContent.replace(/\s+/g, '')
        await this.displayIconValues(this.id)
    }
    //навешиваем значнеие кликнутого параметра на иконку и запускаем метод сохранения даных в бд
    async viewValueToSaveBase(element) {
        element.style.color = 'green'
        element.style.fontWeight = 'bold'
        const arrSpreed = [...element.textContent]
        let param;
        arrSpreed.forEach(el => {
            if (el === ':') {
                param = arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join('')
            }
        })

        const id = document.querySelector('.acto').id
        await this.postIconParams(param, id)
    }

    //вывод и скрытие модального окна
    toogleModalWindow(event) {
        const element = event.currentTarget
        this.targetCard = element
        const sensors = document.querySelector('.sensors')
        const btnsens = document.querySelectorAll('.btnsens')
        const wRight = document.querySelector('.wrapper_right')
        const tiresActiv = document.querySelector('.tiresActiv')
        if (tiresActiv) tiresActiv.classList.remove('tiresActiv');
        if (this.targetCard.classList.contains('acto')) {
            this.targetCard.classList.remove('acto')
            sensors.style.display = 'none'
            btnsens[2].style.display = 'none'
            const actBTN = document.querySelector('.actBTN')
            actBTN ? actBTN.classList.remove('actBTN') : null
            wRight.style.zIndex = 0,
                document.querySelector('.popup-background').style.display = 'none'
            return
        }
        this.card.forEach(el => {
            el.classList.remove('acto')

        })
        const checkConfig = document.getElementById('check_Title')
        checkConfig.checked ? (this.targetCard.classList.add('acto'), sensors.style.display = 'flex', new DraggableContainer(sensors.firstElementChild, 'config'), wRight.style.zIndex = 2,
            document.querySelector('.popup-background').style.display = 'block',
            this.msg = document.querySelectorAll('.msg'),
            this.msg.forEach(el => el.addEventListener('click', this.viewValueToSaveBase.bind(this, el))))
            : sensors.style.display = 'none'
        btnsens[0].style.display = 'none'
        btnsens[1].style.display = 'none'
        btnsens[2].style.display = 'flex'
        this.close(sensors, wRight)
    }

    close(sensors, wRight) {
        const closeIconConfig = document.querySelector('.closeIconConfig')
        closeIconConfig.addEventListener('click', () => {
            const tiresActivt = document.querySelector('.tiresActivt')
            tiresActivt ? tiresActivt.classList.remove('tiresActivt') : null
            const tiresActiv = document.querySelector('.tiresActiv')
            tiresActiv ? tiresActiv.classList.remove('tiresActiv') : null
            const acto = document.querySelector('.acto')
            acto ? acto.classList.remove('acto') : null
            document.querySelector('.actBTN') ? document.querySelector('.actBTN').classList.remove('actBTN') : null
            sensors.style.display = 'none'
            wRight.style.zIndex = 0,
                document.querySelector('.popup-background').style.display = 'none'
        })
    }
    //сохранение назначенного параметра
    async postIconParams(param, id) {
        const activePost = this.nameObject
        const idw = this.id
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ activePost, param, id, idw }))
        }
        const par = await fetch('/api/icon', params)
        const paramssAve = await par.json()
        this.displayIconValues(idw)

    }

    //отображение значений иконок
    async displayIconValues(idw) {
        // Отмена предыдущего запроса, если он существует
        if (this.abortController) {
            this.abortController.abort();
        }

        // Создание нового контроллера для отмены
        this.abortController = new AbortController();
        const signal = this.abortController.signal;

        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw })),
            signal: signal
        }
        const editParams = await this.iconFindParamsEdit(param)

        this.pushObjectProperty(this.info, editParams)
        await this.statusTSI(param)

        this.status(this.info)
        this.viewValueElement()
    }


    async pushObjectProperty(params, editParams) {
        //  console.log(editParams)
        this.card.forEach(e => this.valueparamsObject[e.id] = '---')
        params.forEach(el => {
            // console.log(el)
            switch (el[1]) {
                case 'speed':
                    this.valueparamsObject['speed-card'] = Number(Number(el[3]).toFixed(0))
                    break;
                case 'engine':
                    this.valueparamsObject['ign-card'] = el[3]
                    break;
            }
        })
        editParams.result.forEach(item => {
            params.forEach(e => {
                if (e[1] === item.params) {
                    this.valueparamsObject[item.icons] = Number(e[3])
                }
            })
        })
        this.coefficient = await this.validationIngition('engine')
        const eng = (this.info.find(e => e[1] === 'engine')) ? ((this.info.find(e => e[1] === 'engine')))[3] : null
        const res = this.coefficient ? eval(this.coefficient.formula.replace(/x/g, eng)) : null

        this.valueparamsObject['ign-card'] = res ? 'ВКЛ' : 'ВЫКЛ'


    }


    async validationIngition(param) {
        const idw = this.elem.id
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ idw, param })
        }
        const res = await fetch('api/getConfigParam', params)
        const result = await res.json()
        return result ? result[0] : null
    }
    // запрос параметров (params)
    async iconFindParams(param) {
        let result;

        const res = await fetch('/api/getSens', param)
        const data = await res.json()
        result = data.map(e => {
            return [e.sens, e.params, Number(e.idw), Number(e.value)]
        })
        return result
    }
    // запрос назначенных параметров и коэффициента
    async iconFindParamsEdit(param) {
        const res = await fetch('/api/iconFind', param)
        const result = await res.json()
        this.params = result
        return result
    }
    //расчет  работы двигателя
    async statusTSI() {
        this.coefficient = await this.validationIngition('pwr')
        const pwr = (this.info.find(e => e[1] === 'pwr')) ? ((this.info.find(e => e[1] === 'pwr')))[3] : null
        const tsi = this.coefficient ? eval(this.coefficient.formula.replace(/x/g, pwr)) : null
        this.valueparamsObject['tsi-card'] = tsi && this.valueparamsObject['ign-card'] === 'ВКЛ' ? 'ВКЛ' : 'ВЫКЛ'
        let statName;
        let statNameIng;
        this.valueparamsObject['tsi-card'] === 'ВКЛ' ? statName = 'Включен' : this.valueparamsObject['tsi-card'] === '-' ? statName = '-' : statName = 'Выключен'
        this.valueparamsObject['ign-card'] === 'ВКЛ' ? statNameIng = 'Включено' : statNameIng = 'Выключено'

        const message = this.valueparamsObject['tsi-card'] === '-' ? null : `${statName}`// ${timeStor}
        const messageIng = `${statNameIng}`// ${timeStorIng}

        const tsi_card = document.querySelector('.tsi_card')
        const ign_card = document.querySelector('.ign_card')
        new Tooltip(tsi_card, [tsi_card.getAttribute('rel'), message]);
        new Tooltip(ign_card, [ign_card.getAttribute('rel'), messageIng]);
    }


    //расчет статуса объекта
    async status(data) {
        if (data.length === 0) return
        const lastValidTime = data.find(e => e[1] === 'last_valid_time')
        console.log(lastValidTime)
        const nowTime = Math.floor(new Date().getTime() / 1000)
        const status = (nowTime - Number(lastValidTime[3])) > 3600 ? 0 : 1
        let sats;
        data.forEach(e => {
            if (e[1] === 'sats') {
                sats = Number(e[3])
            }
        })
        let mess;
        const statusObj = document.querySelector('.status_obj')
        const statusTSI = this.valueparamsObject['tsi-card']
        if (status === 0) {
            statusObj.textContent = 'Offline'
            statusObj.style.color = 'gray'
        }
        else if (sats <= 4 || statusTSI === 'ВЫКЛ') {
            if (sats <= 4 && statusTSI === 'ВКЛ') {
                mess = 'Не установлена связь со спутниками'
            }
            else if (sats > 4 && statusTSI === 'ВЫКЛ') {
                mess = 'Двигатель выключен'
            }
            else if (sats <= 4 && statusTSI === 'ВЫКЛ') {
                mess = 'Двигатель выключен, Не установлена связь со спутниками'
            }
            statusObj.textContent = 'Offline'
            statusObj.style.color = 'gray'
            new Tooltip(statusObj, [mess]);
        }
        else if (sats > 3 && statusTSI === 'ВКЛ') {
            statusObj.textContent = 'Online'
            statusObj.style.color = '#15a32d'
            mess = `Установлена связь с ${sats} спутниками`
            new Tooltip(statusObj, [mess]);
        }
    }

    //вывод значений в дом элементы
    viewValueElement() {
        const role = document.querySelector('.role').getAttribute('rel')
        this.card.forEach(elem => {
            this.params.result.forEach(it => {
                if (it.icons === elem.id) {
                    role === 'Администратор' ? new Tooltip(elem, [elem.getAttribute('rel'), it.params]) : new Tooltip(elem, [elem.getAttribute('rel')]);
                }
            })
            const parametrs = this.valueparamsObject[elem.id] === -348201.3876 ? '---' : this.valueparamsObject[elem.id]
            switch (elem.id) {
                case 'odom-card': console.log(parametrs)
                    elem.children[0].textContent = parametrs !== '---' ? this.addZero(8, parametrs.toFixed(0)) : '---'
                    break;
                case 'tsi-card':
                    elem.children[0].textContent = parametrs
                    break;
                case 'ign-card':
                    elem.children[0].textContent = parametrs
                    break;
                case 'moto-card':
                    elem.children[0].textContent = parametrs !== '---' ? parametrs.toFixed(1) : '---'
                    break;
                case 'akb-card':
                    elem.children[0].textContent = parametrs !== '---' ? parametrs.toFixed(1) : '---'
                    break;
                case 'oil-card':
                    elem.children[0].textContent = parametrs !== '---' ? parametrs.toFixed(0) : '---'
                    break;
                default:
                    elem.children[0].textContent = parametrs !== '---' ? parametrs : "---"
            }


        })

    }
    addZero(digits_length, source) {
        let text = source + '';
        while (text.length < digits_length)
            text = '0' + text;
        return text;
    }
}