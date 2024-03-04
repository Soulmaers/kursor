
import { DraggableContainer } from '../../../class/Dragdown.js'
import { Tooltip } from '../../../class/Tooltip.js'
export class IconStatus {
    constructor(nav) {
        this.list = nav
        this.card = document.querySelectorAll('.icon_card')
        this.msg = null
        this.nameObject = null
        this.changeParams = document.querySelector('.changeParams')
        this.valueparamsObject = {}
        this.id = null
        this.targetElement = null
        this.targetCard = null
        this.intervalId = null
        this.params = null
        this.list.forEach(el => el.addEventListener('click', this.listeModalWindow.bind(this, el)))
        this.card.forEach(el => el.addEventListener('click', this.toogleModalWindow.bind(this, el)))
    }

    async listeModalWindow(elem) {
        this.targetElement = elem
        this.id = elem.id
        this.nameObject = elem.children[0].textContent.replace(/\s+/g, '')
        await this.displayIconValues(this.id)
        clearInterval(this.intervalId)
        this.intervalId = setInterval(() => this.displayIconValues(this.id), 60000)
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
        const coef = this.changeParams.value
        const id = document.querySelector('.acto').id

        await this.postIconParams(param, coef, id)
    }



    //вывод и скрытие модального окна
    toogleModalWindow(element) {
        this.targetCard = element
        const sensors = document.querySelector('.sensors')
        const btnsens = document.querySelectorAll('.btnsens')
        const wRight = document.querySelector('.wrapper_right')
        const tiresActiv = document.querySelector('.tiresActiv')
        if (tiresActiv) tiresActiv.classList.remove('tiresActiv');
        if (element.classList.contains('acto')) {
            element.classList.remove('acto')
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
        this.changeParams.value = '1';
        const checkConfig = document.getElementById('check_Title')
        checkConfig.checked ? (element.classList.add('acto'), sensors.style.display = 'flex', new DraggableContainer(sensors), wRight.style.zIndex = 2,
            document.querySelector('.popup-background').style.display = 'block',
            this.msg = document.querySelectorAll('.msg'),
            this.msg.forEach(el => el.addEventListener('click', this.viewValueToSaveBase.bind(this, el))))
            : sensors.style.display = 'none'
        btnsens[0].style.display = 'none'
        btnsens[1].style.display = 'none'
        btnsens[2].style.display = 'flex'
        const engineEvent = document.querySelector('.engineEvent')
        element.id === 'tsi-card' ? engineEvent.style.display = 'flex' : engineEvent.style.display = 'none'
    }
    //сохранение назначенного параметра
    async postIconParams(param, coef, id) {
        const activePost = this.nameObject
        const idw = this.id
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ activePost, param, coef, id, idw }))
        }
        const par = await fetch('/api/icon', params)
        const paramssAve = await par.json()
        this.displayIconValues(idw)

    }

    //отображение значений иконок
    async displayIconValues(idw) {
        console.log('дисплэй?')
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw }))
        }
        const params = await this.iconFindParams(param)
        const editParams = await this.iconFindParamsEdit(param)
        console.log(params)
        console.log(editParams)
        this.pushObjectProperty(params, editParams)
        await this.statusTSI(param)

        this.status(params)
        this.viewValueElement()
    }


    pushObjectProperty(params, editParams) {
        this.card.forEach(e => this.valueparamsObject[e.id] = '---')
        params.forEach(el => {
            switch (el[1]) {
                case 'speed':
                    this.valueparamsObject['speed-card'] = Number(Number(el[3]).toFixed(0))
                    break;
                case 'in1':
                    this.valueparamsObject['ign-card'] = el[3]
                    break;

            }
        })
        editParams.result.forEach(item => {
            params.forEach(e => {
                if (e[1] === item.params) {
                    this.valueparamsObject[item.icons] = Number(e[3]) * item.coef
                }
            })
        })
        const engine = this.valueparamsObject['ign-card']
        this.valueparamsObject['ign-card'] = engine === 'Вход IN1(датчик сработал)' || engine === 1 ? 'ВКЛ' : 'ВЫКЛ'
    }
    // запрос параметров (params)
    async iconFindParams(param) {
        console.log(this.targetElement)
        const pref = this.targetElement.classList.contains('kursor')
        const idw = this.targetElement.id
        let result;
        if (!pref) {
            const res = await fetch('/api/getSensorsWialonToBaseId', param)
            const data = await res.json()
            console.log(data)
            result = data.map(e => {
                return [e.sens_name, e.param_name, Number(e.idw), Number(e.value)]
            })
        }
        else {
            const params = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: (JSON.stringify({ idw }))
            }
            const ress = await fetch('api/getParamsKursor', params)
            const data = await ress.json()

            const results = [];
            let speed;
            console.log(data)
            if (data.length !== 0) {
                Object.entries(data[0]).forEach(([key, value]) => {
                    if (key === 'speed') {
                        speed = Number(Number(data[0][key]).toFixed(0))
                    }
                    results.push([key, key, Number(data[0].idObject), data[0][key]]);
                });
                results.push(['state', 'state', Number(data[0].idObject), speed === 0 ? 0 : 1])
                results.push(['lasttime', 'listtime', Number(data[0].idObject), Number(data[0].time)])
                result = results
            }
            else {
                result = []
            }

        }
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
    async statusTSI(param) {
        const mod = await fetch('/api/modelView', param)
        const model = await mod.json()
        let tsiControll = model.result.length !== 0 || model.result[0] && model.result[0].tsiControll && model.result[0].tsiControll !== '' ? Number(model.result[0].tsiControll) : '';
        tsiControll === 0 ? tsiControll = '' : tsiControll = tsiControll
        this.valueparamsObject['tsi-card'] = tsiControll !== '' ? Number(this.valueparamsObject['akb-card']) > tsiControll ? 'ВКЛ' : 'ВЫКЛ' : 'ВЫКЛ'


        const vals = await fetch('/api/viewStatus', param)
        const val = await vals.json()
        if (val.result.length !== 0) {
            const startDate = val.result[0].time
            const startDateIng = val.result[0].timeIng
            const techdate = new Date();
            const nowDate = Math.floor(techdate.getTime() / 1000);
            const timeStor = getHoursDiff(startDate, nowDate)
            const timeStorIng = getHoursDiff(startDateIng, nowDate)
            function getHoursDiff(startDate, nowDate) {
                var diff = nowDate - startDate;
                let dayS;
                let hourS;
                const minutes = Math.floor(diff / 60)
                const hours = Math.floor(minutes / 60);
                const days = Math.floor(hours / 24);
                const day = days % 60;
                const hour = hours % 24;
                const minut = minutes % 60;
                day === 0 ? dayS = '' : dayS = days + 'д ';
                hour === 0 ? hourS = '' : hourS = hour + 'ч ';
                const mess = `${dayS} ${hourS} ${minut} мин`
                return mess;
            }
            let statName;
            let statNameIng;
            val.result[0].status === 'ВКЛ' ? statName = 'Включен' : val.result[0].status === '-' ? statName = '-' : statName = 'Выключен'
            val.result[0].statusIng === 'ВКЛ' ? statNameIng = 'Включено' : statNameIng = 'Выключено'
            //  tsiValue.textContent = val.result[0].status
            // ignValue.textContent = val.result[0].statusIng
            const message = val.result[0].status === '-' ? null : `${statName} ${timeStor}`
            const messageIng = `${statNameIng} ${timeStorIng}`

            const tsi_card = document.querySelector('.tsi_card')
            const ign_card = document.querySelector('.ign_card')
            new Tooltip(tsi_card, [tsi_card.getAttribute('rel'), message]);
            new Tooltip(ign_card, [ign_card.getAttribute('rel'), messageIng]);
        }
    }

    //расчет статуса объекта
    async status(data) {
        let sats;
        data.forEach(e => {
            if (e[1] === 'sats') {
                sats = Number(e[3])
            }
        })
        let mess;
        const statusObj = document.querySelector('.status_obj')
        const statusTSI = this.valueparamsObject['tsi-card']
        if (sats <= 4 || statusTSI === 'ВЫКЛ') {
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
            new Tooltip(statusObj, [mess]);
        }
        else if (sats > 3 || statusTSI === 'ВКЛ') {
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
            console.log(parametrs)
            switch (elem.id) {
                case 'odom-card':
                    elem.children[0].textContent = parametrs !== '---' ? this.addZero(8, parametrs.toFixed(0)) : '---'
                    break;
                case 'tsi-card':
                    elem.children[0].textContent = parametrs
                    break;
                case 'ign-card':
                    elem.children[0].textContent = parametrs
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