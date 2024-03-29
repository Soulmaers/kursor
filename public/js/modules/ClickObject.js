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
    constructor(elements) {
        this.elements = elements
        this.element = null
        this.createEvent = null
        this.controller = null
        this.wrapperFull = document.querySelector('.wrapperFull')
        this.btnShina = document.querySelectorAll('.modals')
        this.widthWind = document.querySelector('body').offsetWidth;
        this.elements.forEach(e => e.addEventListener('click', this.handleClick.bind(this, e)))
        this.btnShina.forEach(e => e.addEventListener('click', this.changeTyresValue.bind(this, e)))
    }

    changeTyresValue(e) {
        const main = document.querySelector('.main')
        main.style.flexDirection = 'row'
        this.btnShina.forEach(el => {
            el.classList.remove('active')
        })
        e.classList.add('active')
        this.visual('check')
        if (this.btnShina[1].classList.contains('active')) {
            this.styleShinaActive()
        }
        const activGraf = document.querySelector('.activGraf')
        if (activGraf) {
            this.mainblock()
        }
        if (this.widthWind <= 860) {
            sections.style.display = 'none'
            wrapleft.style.display = 'none'
        }
    }
    mainblock() {
        const rightFrame = document.querySelectorAll('.rigthFrame')
        rightFrame.forEach(e => e.style.display = 'flex')
        const wrapperFull = document.querySelector('.wrapperFull')
        const lowList = document.querySelector('.low_list')
        lowList.style.height = wrapperFull.clientHeight - 65 + 'px';

        const idw = document.querySelector('.color')
        if (!idw) {
            const main = document.querySelector('.main')
            const start = document.querySelector('.start')
            const sections = document.querySelector('.sections')
            const dash = document.querySelector('.wrapper_right_dash')
            main.style.display = 'none'
            dash.style.display = 'none'
            start.style.display = 'flex'
            sections.style.display = 'flex'
            return
        }
        const start = document.querySelector('.start')
        start.style.display = 'none'
        const dash = document.querySelector('.wrapper_right_dash')
        const sections = document.querySelector('.sections')
        const main = document.querySelector('.main')
        dash.style.display = 'none'
        sections.style.display = 'flex'
        main.style.display = 'flex'
        const wRight = document.querySelector('.wrapper_right')
        const wLeft = document.querySelector('.wrapper_left')
        const grafics = document.querySelector('.grafics')
        const wrapList = document.querySelector('.wrapList')
        const techInfo = document.querySelector('.techInfo')
        const plug = document.querySelectorAll('.plug')
        const config = document.querySelector('.config')
        plug[2].classList.remove('activGraf')
        wRight.style.display = 'flex';
        wLeft.style.display = 'block';
        grafics.style.display = 'none';
        config.style.display = 'flex';
        techInfo.style.display = 'none';
        wrapList.style.overflowY = 'visible';
        wrapList.style.height = 'none';
        wrapList.style.height = 'auto'
    }
    handleClick(e) {
        this.element = e
        this.windowAdaptiv()
        if (this.element.classList.contains('color') || e.classList.contains('checkInList')
            || e.classList.contains('map_unit')
            || e.classList.contains('report_unit')
            || e.classList.contains('deleteObject')
            || e.classList.contains('pref')) {
            return
        }
        this.deleteClasses('.color')
        this.element.classList.add('color')
        //  visual(this.element)
        this.visual()
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
    async visual(check) {
        const idw = this.element.id
        console.log(check)

        this.deleteClasses('.tablo', '.choice', '.acto');  //метод удаляет переданыые классы
        this.hideElements(['.calendar_track', '.calendar_graf', '.select_type', '.start', '.tableTarir', '.disketa', '.korzina', '.sensors', '.allsec', '.delIcon'], 'none'); //метод скрывает переданные элементы
        this.hideElements(['.trEvent', '.main', '.wrapper_up', '.wrapperCont'], 'flex') //ставим flex элементам
        const elementsToDelete = check ? ['.msg', '.wrapMap', '.containerAlt', '.delIcon'] : ['.msg', '.wrapMap', '.containerAlt', '.delIcon', '.zamer', '.jobTSDetalisationGraf', '.jobTSDetalisationCharts_legenda'];
        this.deleteElements(elementsToDelete);
        if (!check) {
            this.clearTexContent('.odom_value', '.akb_value1', '.ohl_value', '.oil_value1', '.toil_value', '.ign_value', '.oborot_value', '.moto_value');
        }

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
        await loadParamsView(signal)
        if (!check) {
            this.createEvent = this.createEvent || new CreateMarkersEvent(idw);
            this.createEvent.reinitialize(idw);
            iconStatusClick = iconStatusClick || new IconStatus(this.element);
            iconStatusClick.reinitialize(this.element);
            if (this.createEvent.updateInterval) {
                clearInterval(this.createEvent.updateInterval);
                this.createEvent.hiddenTrackAndMarkersEnent();
            }
            timeIntervalStatistiks(signal);
            alarmFind()
            this.specific(this.element)//метод который обрабатывает специфические условия
        }
        kranParams()
        setInterval(kranParams, 300000)
    }

    specific(el) {
        const tsiControll = document.querySelector('.tsiControll')
        const checkConfig = document.getElementById('check_Title')
        const checkAlt = document.querySelector('.checkAlt')
        const tarir = document.querySelector('.tarir')
        const tiresLink = document.querySelectorAll('.tires_link')
        const wrapperLeft = document.querySelector('.wrapper_left')
        const titleCar = document.querySelector('.title_two')
        const plug = document.querySelectorAll('.plug')
        const grafics = document.querySelector('.grafics')
        const createList = document.querySelector('.createList')

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