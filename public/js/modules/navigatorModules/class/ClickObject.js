
import { reqProtectorBase } from '../../skladModules/func/protector.js'
import { kranParams } from '../../strelaKran.js'
import { clearElem } from '../../helpersFunc.js'
import { CreateMarkersEvent } from '../../objectMainModules/class/CreateMarkersEvent.js'
import { alarmFind } from '../../alarmModules/alarmStorage.js'
import { IconStatus } from '../../iconModules/class/IconStatus.js'
import { StatistikaPressure } from '../../StatistikaModules/Statistikapressure.js'
import { Detalisation } from '../../detalisationModules/class/Detalisation.js'
import { DOMHelper } from './DOMHelper.js'
import { SKDSHClass } from '../../skdshModules/class/SKDSHClass.js'
import { GrafikView } from '../../grafikModules/class/GrafikView.js'
import { GetUpdateStruktura } from '../../../GetUpdateStruktura.js'
export let iconStatusClick;

export class ClickObject {
    constructor(elements, data) {
        this.elements = elements
        this.data = data
        this.info == null
        this.element = null
        this.createEvent = null
        this.instanceStatistika = null
        this.instanceDetalisation = null
        this.controller = null
        this.wrapperFull = document.querySelector('.wrapperFull')
        this.btnShina = document.querySelectorAll('.plug')
        this.widthWind = document.querySelector('body').offsetWidth;
        this.uniqStruktura = this.findObjectByIdRecursive(this.data);
        this.elements.forEach(e => e.addEventListener('click', this.handleClick.bind(this)))
        this.btnShina.forEach(e => e.addEventListener('click', this.changeTyresValue.bind(this, e)))
    }

    changeTyresValue(e) {
        const main = document.querySelector('.main')
        const detalisation = document.querySelector('.windowStatistic')
        const stata = document.querySelector('.stata_container')
        main.style.flexDirection = 'row'
        this.btnShina.forEach(el => {
            el.classList.remove('active')
        })
        e.classList.add('active')
        this.visual('check')
        console.log('визуал')
        if (this.btnShina[1].classList.contains('active')) {
            detalisation.style.display = 'none'
            stata.style.display = 'flex'
            this.styleShinaActive()
        }
        else {
            detalisation.style.display = 'flex'
            stata.style.display = 'none'
        }
        const activGraf = document.querySelector('.activGraf')
        if (activGraf) {
            this.mainblock()
        }
        DOMHelper.hideElements(['.wrapper_left'], 'block')
    }
    mainblock() {
        const grafikButton = document.querySelector('.grafik_button')
        grafikButton.classList.remove('activGraf')
        DOMHelper.hideElements(['.wrapper_right', '.config', '.secondFlash'], 'flex')
        DOMHelper.hideElements(['.grafics'], 'none')
        DOMHelper.hideElements(['.wrapper_left'], 'block')

    }

    findObjectByIdRecursive(data) {
        const resultData = data.flat().reduce((acc, it) => {
            if (it.length === 10 && it[8].sub.length !== 0) {
                acc.push(...Object.values(it[8].sub).flat());
            }
            acc.push(it);
            return acc;
        }, []);
        const uniqueSubArrays = Array.from(new Map(resultData.map(item => [item[4], item])).values());
        return uniqueSubArrays
    }

    filterData(id) {
        const foundElement = GetUpdateStruktura.globalData.final.find(el => el[4] === Number(id));
        this.info = [foundElement[0].result, foundElement[1].result, foundElement[2].result, foundElement[3].result]
    }

    handleClick(event) {
        this.element = event.currentTarget;
        this.filterData(this.element.id)
        this.windowAdaptiv()

        if (this.element.classList.contains('color') || event.target.classList.contains('checkInList')
            || event.target.classList.contains('map_unit')
            || event.target.classList.contains('report_unit')
            || event.target.classList.contains('deleteObject')
            || event.target.classList.contains('pref')) {
            return
        }
        DOMHelper.deleteClasses('.color')
        this.element.classList.add('color')
        this.visual()
    }

    async visual(check) {
        const idw = this.element.id
        if (this.btnShina[1].classList.contains('active')) {
            this.styleShinaActive()
        }
        DOMHelper.deleteClasses('.tablo', '.choice', '.acto', '.check_probeg', '.toogleIconEvent');  //метод удаляет переданыые классы
        DOMHelper.hideElements(['.calendar_track', '.calendar_graf', '.select_type', '.start', '.techInfo', '.modalCenterOs', '.tableTarir', '.disketa', '.korzina', '.sensors', '.alllogs', '.allsec', '.delIcon', '.contKran'], 'none'); //метод скрывает переданные элементы
        DOMHelper.hideElements(['.trEvent', '.main', '.wrapper_up', '.wrapperCont'], 'flex') //ставим flex элементам
        const elementsToDelete = check ? ['.msg', '.wrapMap', '.containerAlt', '.delIcon'] : ['.msg', '.wrapMap', '.containerAlt', '.delIcon', '.zamer', '.jobTSDetalisationGraf', '.jobTSDetalisationCharts_legenda'];
        DOMHelper.deleteElements(elementsToDelete);


        if (!check) {
            DOMHelper.clearTextContent('.odom_value', '.akb_value1', '.ohl_value', '.oil_value1', '.toil_value', '.ign_value', '.oborot_value', '.moto_value');
        }
        DOMHelper.createListItems('.obo', 250, 'msg', this.info[2])

        //  new SKDSHClass(this.info, idw)
        this.reinitializeOrCreateInstance('instanceSKDH', SKDSHClass, this.info, idw);

        console.log(this.info)
        if (!check) {
            this.specific(this.element)//метод который обрабатывает специфические условия
            this.reinitializeOrCreateInstance('createEvent', CreateMarkersEvent, idw);
            this.reinitializeOrCreateInstance('iconStatusClick', IconStatus, this.element, this.info);
            this.reinitializeOrCreateInstance('instanceStatistika', StatistikaPressure, this.element, this.info);
            this.reinitializeOrCreateInstance('instanceDetalisation', Detalisation, this.element);
            this.reinitializeOrCreateInstance('instanceGrafik', GrafikView, this.info);

            if (this.createEvent.updateInterval) {
                clearInterval(this.createEvent.updateInterval);
                this.createEvent.hiddenTrackAndMarkersEnent();
            }
            console.log(this.info)
            alarmFind(this.info)
        }
        kranParams()
        setInterval(kranParams, 300000)
    }

    reinitializeOrCreateInstance(property, Constructor, ...args) {
        if (this[property]) {
            this[property].reinitialize(...args);
        } else {
            this[property] = new Constructor(...args);
        }
    }

    specific(el) {
        const checkConfig = document.getElementById('check_Title')
        const checkAlt = document.querySelector('.checkAlt')
        const tarir = document.querySelector('.tarir')
        const tiresLink = document.querySelectorAll('.tires_link')
        const wrapperLeft = document.querySelector('.wrapper_left')
        const titleCar = document.querySelector('.title_two')
        const plug = document.querySelectorAll('.plug')
        const grafics = document.querySelector('.grafics')
        const createList = document.querySelector('.createList')
        const techInfo = document.querySelector('.techInfo')
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
    }

    styleShinaActive() {
        //reqProtectorBase();
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