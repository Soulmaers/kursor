import { objColor, generT, generDav } from './content.js'
import { loadParamsView } from './paramsTyresView.js'
import { findTyresInstall } from './saveBaseId.js'
import { reqProtectorBase } from './protector.js'
import { kranParams } from './strelaKran.js'
import { Tooltip } from '../class/Tooltip.js'
import { removeElem, clearElem } from './helpersFunc.js'
import { convert } from './helpersFunc.js'
import { timeIntervalStatistiks } from './detalisation.js'
import { CreateMarkersEvent } from './objectMainModules/class/CreateMarkersEvent.js'
import { alarmFind } from './alarmStorage.js'


import { IconStatus } from './iconModules/class/IconStatus.js'
import { visual } from './visual.js'
import { grafClick } from '../main.js'

export let iconStatusClick;

export class ClickObject {
    constructor(element) {
        this.element = element
        this.createEvent = null
        this.controller = null
        this.wrapperFull = document.querySelector('.wrapperFull')
        this.widthWind = document.querySelector('body').offsetWidth;
        this.element.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(event) {
        this.windowAdaptiv()
        if (this.element.classList.contains('color') || event.target.classList.contains('checkInList')
            || event.target.classList.contains('map_unit')
            || event.target.classList.contains('report_unit')
            || event.target.classList.contains('deleteObject')
            || event.target.classList.contains('pref')) {
            return
        }
        this.deleteClasses('.color')
        this.element.classList.add('color')
        //  visual(this.element)
        this.visual(this.element)
    }

    deleteClasses(...tags) {
        tags.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.classList.remove(selector.substring(1));
                }
            });
        });
    }
    deleteElements(...tags) {
        tags.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.remove(selector);
                }
            });
        });
    }
    hideElements(selectors, value) {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.display = value;
            });
        });
    }
    clearTexContent(...selectors) {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.textContent = ''
            });
        });
    }
    liCreate() {
        const obo = document.querySelector('.obo')
        const count = 250;
        for (let i = 0; i < count; i++) {
            let li = document.createElement('li');
            li.className = "msg";
            obo.append(li);
        }
    }
    async visual() {
        const idw = this.element.id
        this.deleteClasses('.tablo', '.choice', '.acto');  //метод удаляет переданыые классы
        this.hideElements(['.calendar_track', '.calendar_graf', '.select_type', '.start', '.tableTarir', '.disketa', '.korzina', '.sensors', '.allsec', '.delIcon'], 'none'); //метод скрывает переданные элементы
        this.hideElements(['.trEvent', '.main', '.wrapper_up', '.wrapperCont'], 'flex') //ставим flex элементам
        this.deleteElements('.msg', '.wrapMap', '.containerAlt', '.delIcon', '.zamer', '.jobTSDetalisationGraf', '.jobTSDetalisationCharts_legenda') //удаление элементов
        this.clearTexContent('.odom_value', '.akb_value1', '.ohl_value', '.oil_value1', '.toil_value', '.ign_value', '.oborot_value', '.moto_value') //очищаем текстконтент
        this.specific(this.element)//метод который обрабатывает специфические условия



        const graf = document.querySelector('.activGraf')
        if (graf) grafClick.controllerMethodCharts();

        const alarm = document.querySelector('.wrap_alarm')
        new Tooltip(alarm, ['События по давлению'])

        this.liCreate() //отрисовка строк под параметры

        if (this.controller && !this.controller.signal.aborted) {
            this.controller.abort()
        }
        this.controller = new AbortController();
        const signal = this.controller.signal;

        if (!this.createEvent) {
            this.createEvent = new CreateMarkersEvent(idw);
        } else {
            this.createEvent.reinitialize(idw);
        }
        if (!iconStatusClick) {
            iconStatusClick = new IconStatus(this.element);
        } else {
            iconStatusClick.reinitialize(this.element);
        }
        if (this.createEvent && this.createEvent.updateInterval) {
            clearInterval(this.createEvent.updateInterval);
            this.createEvent.hiddenTrackAndMarkersEnent()
        }

        await loadParamsView(signal)
        timeIntervalStatistiks(signal);

        kranParams()
        setInterval(kranParams, 300000)
        alarmFind()

    }

    specific(el) {
        const tsiControll = document.querySelector('.tsiControll')
        const checkConfig = document.getElementById('check_Title')
        const checkAlt = document.querySelector('.checkAlt')
        const tarir = document.querySelector('.tarir')
        const tiresLink = document.querySelectorAll('.tires_link')
        const wrapperLeft = document.querySelector('.wrapper_left')
        const titleCar = document.querySelector('.title_two')
        //const btnsens = document.querySelectorAll('.btnsens')
        const plug = document.querySelectorAll('.plug')
        const grafics = document.querySelector('.grafics')
        const createList = document.querySelector('.createList')
        const btnShina = document.querySelectorAll('.modals')

        checkConfig.checked = false
        checkAlt.style.color = 'black'
        checkAlt.style.fontWeight = '400'

        if (titleCar) {
            titleCar.textContent = el.children[0].textContent
        }
        if (el.children[0].textContent === 'Цистерна ДТ') {
            tarir.style.display = 'block'
        }
        tiresLink.forEach(e => {
            if (e.classList.contains('tiresActiv')) {
                grafics.style.display = 'flex'
            }
        })
        if (plug[2].classList.contains('activGraf')) {
            wrapperLeft.style.display = 'none'
            grafics.style.display = 'flex'
        }
        else {
            wrapperLeft.style.display = this.widthWind < 860 ? 'none' : 'block'
        }
        // btnsens.forEach(el => {
        //  el.classList.remove('actBTN')
        //     })

        if (btnShina[1].classList.contains('active')) {
            this.styleShinaActive(btnShina[1])
        }
        clearElem(createList.value)
        clearElem(tsiControll.value)
    }

    styleShinaActive() {
        reqProtectorBase();
        const container = document.querySelector('.wrapper_containt')
        const tyresD = container.querySelectorAll('.tiresD');
        const tyresT = container.querySelectorAll('.tiresT');
        tyresD.forEach(e => e.classList.add('tyreD-modified'));
        tyresT.forEach(e => e.classList.add('tyreT-modified'));
    }

    windowAdaptiv() {
        const sections = this.wrapperFull.querySelector('.sections')
        if (this.widthWind <= 860) {
            const cblock = document.querySelector('.centerBlock')
            cblock.style.width = 100 + '%'
            const comeback = document.querySelector('.comeback')
            comeback.style.display = 'flex'
            const main = document.querySelector('.main')
            main.style.display = 'flex'
            const wrapperLeft = document.querySelector('.wrapper_left')
            wrapperLeft.style.display = 'none'
            const nameCar = document.querySelector('.color')
            const titleName = document.querySelector('.titleName')
            titleName.textContent = nameCar.children[0].textContent
            sections.style.display = 'none'
            document.querySelector('.mobile_active').classList.remove('mobile_active')
            document.querySelector('.mobile_config').classList.add('mobile_active')
            document.querySelector('.mainAlarm').textContent = 'Уведом.'
            document.querySelector('.state_tyres').textContent = 'Шины'
            document.querySelector('.rigth_icons').style.order = 2
            document.querySelector('.config').style.order = 3
            document.querySelector('.side').appendChild(document.querySelector('.select_type'))
            document.querySelector('.select_type').style.order = 1
            document.querySelectorAll('.itemSide')[1].style.order = 2

        }
        if (this.widthWind >= 861 && this.widthWind <= 1200) {
            const comeback = document.querySelector('.comeback')
            comeback.style.display = 'flex'
            const sections = document.querySelector('.sections')
            sections.style.display = 'none'
            const main = document.querySelector('.main')
            main.style.display = 'flex'
            main.style.width = 100 + '%'
            main.style.justifyContent = 'center'
            const cblock = document.querySelector('.centerBlock')
            cblock.style.width = 40 + '%'
            const nameCar = document.querySelector('.color')
            const titleName = document.querySelector('.titleName')
            titleName.textContent = nameCar.children[0].textContent
            const wrapperLeft = document.querySelector('.wrapper_left')
            wrapperLeft.style.display = 'block'
        }
    }
}