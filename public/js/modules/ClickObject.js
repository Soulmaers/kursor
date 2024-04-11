
import { loadParamsView } from './paramsTyresView.js'
import { reqProtectorBase } from './protector.js'
import { kranParams } from './strelaKran.js'
import { clearElem } from './helpersFunc.js'
import { CreateMarkersEvent } from './objectMainModules/class/CreateMarkersEvent.js'
import { alarmFind } from './alarmModules/alarmStorage.js'
import { IconStatus } from './iconModules/class/IconStatus.js'
import { grafClick } from '../main.js'
import { dataInfo } from '../modules/paramsTyresView.js'
import { StatistikaPressure } from './StatistikaModules/Statistikapressure.js'
import { Detalisation } from './detalisationModules/class/Detalisation.js'
export let iconStatusClick;

export class ClickObject {
    constructor(elements) {
        this.elements = elements
        this.element = null
        this.createEvent = null
        this.instanceStatistika = null
        this.instanceDetalisation = null
        this.controller = null
        this.wrapperFull = document.querySelector('.wrapperFull')
        this.btnShina = document.querySelectorAll('.modals')
        this.widthWind = document.querySelector('body').offsetWidth;
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
        if (this.widthWind <= 860) {
            sections.style.display = 'none'
            wrapleft.style.display = 'none'
        }
    }
    mainblock() {
        const grafikButton = document.querySelector('.grafik_button')
        grafikButton.classList.remove('activGraf')
        this.hideElements(['.wrapper_right', '.config', '.secondFlash'], 'flex')
        this.hideElements(['.grafics'], 'none')
        this.hideElements(['.wrapper_left'], 'block')

    }

    createStata() {
        const [arg, params, osi] = dataInfo
        const sens = params.reduce((acc, item) => {
            const pressure = arg.find(element => element.params === item.pressure);
            if (pressure) {
                acc.push({ ...pressure, tyresdiv: item.tyresdiv });
            }
            return acc
        }, [])
        sens.sort((a, b) => a.tyresdiv - b.tyresdiv);
        const table = document.querySelector('.table_stata')
        const rows = document.querySelectorAll('.row_stata')
        if (rows) {
            [...rows].forEach(e => {
                e.remove()
            })
        }
        sens.forEach(it => {
            let count = 4
            const tr = document.createElement('tr')
            tr.classList.add('row_stata')
            table.appendChild(tr)
            const td = document.createElement('td')
            td.classList.add('cel')
            td.setAttribute('rel', it.params);
            td.textContent = it.sens
            tr.appendChild(td)
            for (let i = 0; i <= count; i++) {
                const td = document.createElement('td')
                td.classList.add('cel')
                td.textContent = '-'
                tr.appendChild(td)
            }
        })

    }
    handleClick(event) {
        this.windowAdaptiv()
        this.element = event.currentTarget;
        if (this.element.classList.contains('color') || event.target.classList.contains('checkInList')
            || event.target.classList.contains('map_unit')
            || event.target.classList.contains('report_unit')
            || event.target.classList.contains('deleteObject')
            || event.target.classList.contains('pref')) {
            return
        }
        this.deleteClasses('.color')
        this.element.classList.add('color')
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

        this.deleteClasses('.tablo', '.choice', '.acto', '.check_probeg', '.toogleIconEvent');  //метод удаляет переданыые классы
        this.hideElements(['.calendar_track', '.calendar_graf', '.select_type', '.start', '.techInfo', '.tableTarir', '.disketa', '.korzina', '.sensors', '.alllogs', '.allsec', '.delIcon', '.contKran'], 'none'); //метод скрывает переданные элементы
        this.hideElements(['.trEvent', '.main', '.wrapper_up', '.wrapperCont'], 'flex') //ставим flex элементам
        const elementsToDelete = check ? ['.msg', '.wrapMap', '.containerAlt', '.delIcon'] : ['.msg', '.wrapMap', '.containerAlt', '.delIcon', '.zamer', '.jobTSDetalisationGraf', '.jobTSDetalisationCharts_legenda'];
        this.deleteElements(elementsToDelete);
        if (!check) {
            this.clearTexContent('.odom_value', '.akb_value1', '.ohl_value', '.oil_value1', '.toil_value', '.ign_value', '.oborot_value', '.moto_value');
        }
        this.liCreate() //отрисовка строк под параметры

        await loadParamsView()
        const graf = document.querySelector('.activGraf')
        if (graf) grafClick.controllerMethodCharts();
        if (!check) {
            this.specific(this.element)//метод который обрабатывает специфические условия
            if (this.createEvent) {
                this.createEvent.reinitialize(this.element.id);
            }
            else {
                this.createEvent = new CreateMarkersEvent(idw);
            }
            if (iconStatusClick) {
                iconStatusClick.reinitialize(this.element);
            }
            else {
                iconStatusClick = new IconStatus(this.element);
            }
            if (this.createEvent.updateInterval) {
                clearInterval(this.createEvent.updateInterval);
                this.createEvent.hiddenTrackAndMarkersEnent();
            }

            if (this.instanceStatistika) {
                this.instanceStatistika.reinitialize(dataInfo, this.element);
            }
            else {
                this.instanceStatistika = new StatistikaPressure(dataInfo, this.element)
            }
            if (this.instanceDetalisation) {
                this.instanceDetalisation.reinitialize(this.element);
            }
            else {
                this.instanceDetalisation = new Detalisation(this.element)
            }

            alarmFind()
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