
import { data } from './content.js'
//import { alarmClear } from './visual.js'
import { getUsers } from './admin.js'
import { reqProtectorBase } from './protector.js'
import { saveDouble } from './saveBaseId.js'
import { DraggableContainer } from '../class/Dragdown.js'
import { Tooltip } from '../class/Tooltip.js'
import { Flasher } from '../class/Flash.js'
import { CloseBTN } from '../class/CloseBTN.js'
import { ResizeContainer } from '../class/ResizeContainer.js'
import { viewTech } from './tech.js'
import { settingsRotate, objViewContent, jobFormSET } from './settingsRotate.js'
import { storTitleList } from './content.js'
import { initCharts, initSummary } from './spisokModules/class/SpisokObject.js'
import { CreateNewObject } from './propertyObjectModules/class/CreateNewObject.js'
import { CreateNewGroup } from './propertyObjectModules/class/CreateNewGroup.js'



export class AddTooltip {
    constructor() {
        this.arrayContent = []
        this.init()
    }
    init() {
        const role = document.querySelector('.role')
        const logout = document.querySelector('.logoutIcon')
        const create = document.querySelector('.create_object')
        const search = document.querySelector('.loop_find')
        const viewIcon = document.querySelectorAll('.viewIcon')
        const tableInfoCar = document.querySelector('.tableInfoCar')
        const inf = document.querySelector('.infosCenter')
        const alarm = document.querySelector('.wrap_alarm')
        const iconStata = document.querySelector('.icon_stata')
        const iconCheck = document.querySelector('.icon_check')
        const iconGraf = document.querySelector('.icon_graf')

        viewIcon.forEach(e => {
            const relValues = e.getAttribute('rel').split(' ');
            const lastRel = relValues[relValues.length - 1];
            this.arrayContent.push([e, [storTitleList[lastRel]]]);
        });
        [...tableInfoCar.children[0].children].forEach(e => {
            this.arrayContent.push([e, [e.getAttribute('rel')]]);
        })
        this.arrayContent.push([iconGraf, ['Календарь']])
        this.arrayContent.push([iconStata, ['Календарь']])
        this.arrayContent.push([iconCheck, ['Давление/Пробег']])
        this.arrayContent.push([role, [role.getAttribute('rel')]])
        this.arrayContent.push([alarm, ['События по давлению']])
        this.arrayContent.push([logout, [logout.getAttribute('rel')]])
        this.arrayContent.push([create, ['Добавить новый объект']])
        this.arrayContent.push([search, [['Поиск объектов по имени, ID, имени группы,'], ['уникальному IMEI, телефону']]])
        this.arrayContent.push([inf, ['Если зажигание включено и данные  приходят, то значения подсвечены в зависимости от условий подсветки',
            'Если зажигание включено, а данные не приходят, то колесо будет с серый фоном',
            'Если зажигание выключено, то колесо будет черным, а последние зафиксированные показатели серым цветом',
            'При наведении на колесо появится подсказка с параметром колеса и актуальностью данных']])
        this.initTooltipClass()
    }

    initTooltipClass() {
        this.arrayContent.forEach(el => {
            new Tooltip(el[0], el[1])
        })
    }
}

const sec = document.querySelector('.sections')
const centerBlock = document.querySelector('.centerBlock')
const start = document.querySelector('.start')
const menu = document.querySelector('.menu')
const main = document.querySelector('.main')
const wrapleft = document.querySelector('.wrapper_left')
const wrapright = document.querySelector('.wrapper_right')
const comeback = document.querySelector('.comeback')
const secondFlash = document.querySelectorAll('.secondFlash')
const sections = document.querySelector('.sections')
const techinfo = document.querySelector('.techInfo')
const mainMenu = document.querySelector('.main_menu')
const grafics = document.querySelector('.grafics')
const create = document.querySelector('.create_object')


new ResizeContainer(sec, start, secondFlash[0])
new Flasher()


mainMenu.addEventListener('click', (event) => {
    event.stopPropagation();
    new CloseBTN(menu, mainMenu)
    menu.style.display = 'flex'
})

export const obj = new CreateNewObject(create)
export const sett = new CreateNewGroup(create)


const itemInfoGlobal = document.querySelector('.itemInfoGlobal')
itemInfoGlobal.addEventListener('click', (event) => {
    event.target.classList.toggle('iconMapsInfoActive')
})

const mobileItem = document.querySelectorAll('.mobile_item')
mobileItem.forEach(el => {
    el.addEventListener('click', () => {
        mobileItem.forEach(el => {
            el.classList.remove('mobile_active')
        })
        el.classList.toggle('mobile_active');
        if (el.children[0].textContent === 'Список') {
            const sections = document.querySelector('.sections')
            const centerBlock = document.querySelector('.centerBlock')
            sections.style.display = 'flex'
            centerBlock.style.display = 'flex'
            start.style.display = 'none'
            comeback.style.display = 'none'
            main.style.display = 'none'
        }
        if (el.children[0].textContent === 'Статистика') {
            const wrapFull = document.querySelector('.wrapperFull')
            const contentCard = document.querySelectorAll('.content_card')
            comeback.style.display = 'none'
            main.style.display = 'none'
            sections.style.display = 'none'
            start.style.display = 'flex'
            start.style.flexDirection = 'column'
            start.style.flexWrap = 'nowrap'
            start.style.overflow = 'auto';
            wrapFull.style.height = ''
            contentCard.forEach(it => {
                it.style.width = 96 + '%'
                it.style.minHeight = '550px'
                it.style.margin = '2px'
                if (!it.children[0]) {
                    it.remove();
                }
                else {
                    it.children[0].children[0].children[0].style.width = 50 + '%'
                    it.children[0].children[0].style.justifyContent = 'space-around'
                    it.children[0].children[1].children[0].children[0].style.width = 50 + '%'
                    it.children[0].children[1].children[0].children[3].style.width = 20 + '%'
                    it.children[0].children[1].children[0].children[3].children[1].style.right = '40px'
                    Array.from(it.children[0].children[1].children[1].children).forEach(e => {
                        e.children[0].style.width = 50 + '%'
                    })
                }
            })
        }
        if (el.children[0].textContent === 'Карта') {
            const color = document.querySelector('.color')
            if (color) {
                document.querySelector('.jobTSDetalisation').textContent = 'Время раб. ТС дет.'
                document.querySelector('.engineTS').textContent = 'Зажигание ВКЛ'
                document.querySelector('.jobHHTS').textContent = 'Холостой ход'
                document.getElementById('map').style.height = ''
                sections.style.display = 'none'
                start.style.display = 'none'
                main.style.display = 'flex'
                centerBlock.style.display = 'none'
                techinfo.style.display = 'none'
                grafics.style.display = 'none'
                wrapleft.style.display = 'block'
            }
            else {
                console.log('ничего')
            }

        }
        if (el.children[0].textContent === 'Конфигуратор') {
            const color = document.querySelector('.color')
            if (color) {
                grafics.style.display = 'none'
                sections.style.display = 'none'
                start.style.display = 'none'
                main.style.display = 'flex'
                centerBlock.style.display = 'flex'
                wrapleft.style.display = 'none'
                techinfo.style.display = 'none'
                wrapright.style.display = 'flex'
            }
            else {
                console.log('ничего')
            }

        }
    })
})

const logo = document.querySelector('.logo')
logo.addEventListener('click', () => {
    const cond = document.querySelectorAll('.cond')
    const groups = document.querySelectorAll('.groups')
    groups.forEach(e => {
        e.querySelector('.chekHidden').style.opacity = 1
    })

    const list = document.querySelectorAll('.listItem')
    list.forEach(e => {
        e.querySelector('.checkInList').style.opacity = 1
    })
    cond.forEach((el, index) => {
        if (el.classList.contains('clicker')) {
            el.classList.remove('clicker')
        }
    })
    clearInterval(intervalId)
    clearInterval(intervalId2)
    const allsec = document.querySelectorAll('.allsec')
    allsec.forEach(el => {
        el.style.display = 'none';
    })

    const tablo = document.querySelector('.tablo')
    tablo ? tablo.classList.remove('tablo') : null
    const pen = document.querySelectorAll('.rigthFrame')[0]
    const main = document.querySelector('.main')
    const start = document.querySelector('.start')
    const sections = document.querySelector('.sections')
    const dash = document.querySelector('.wrapper_right_dash')
    const color = document.querySelector('.color')
    main.style.display = 'none'
    dash.style.display = 'none'
    start.style.display = 'flex'
    pen.style.display = 'flex'
    start.style.width = 100 + '%'
    sections.style.display = 'flex'
    color ? color.classList.remove('color') : null
    initSummary.clickListUpdateSummary()
    initCharts.getDataSummary()
})
const auth = document.querySelector('.settings')
const authClear = document.querySelector('.close_settings')
const account = document.querySelector('.settings_users')


if (auth) {
    auth.addEventListener('click', (event) => {
        const role = document.querySelectorAll('.log')[0].getAttribute('rel')
        event.stopPropagation();
        const pop = document.querySelector('.popup-background')
        pop.style.display = 'block'
        account.style.display = 'flex'
        const setOne = document.querySelector('.set_one')
        const setTwo = document.querySelector('.set_two')
        if (role === 'Пользователь' || role === 'Дежурный') {
            const account = document.querySelector('.account')
            setOne.remove();
            account.remove();
            setTwo.classList.add('active_set')
            const navClick = document.querySelector(`.${objViewContent[setTwo.getAttribute('rel')]}`)
            navClick.style.display = 'flex'
        }
        else {
            getUsers()
            setOne.classList.add('active_set')
            const navClick = document.querySelector(`.${objViewContent[setOne.getAttribute('rel')]}`)
            navClick.style.display = 'flex'
        }
        settingsRotate();
        new DraggableContainer(account)
        //  new CloseBTN(account)
    })
    authClear.addEventListener('click', () => {
        account.style.display = 'none'
        const navItem = document.querySelector('.active_set')
        navItem.classList.remove('active_set')
        const contentSet = document.querySelectorAll('.content_set')
        contentSet.forEach(e => {
            e.style.display = 'none'
        })
        const pop = document.querySelector('.popup-background')
        pop.style.display = 'none'
    })
}

const addForm = document.querySelector('.conF')
addForm.addEventListener('click', () => {
    const pop = document.querySelector('.popup-background')
    pop.style.display = 'block'
    account.style.zIndex = 0
    jobFormSET();
})




const closeForm = document.querySelector('.close_settings_form')
closeForm.addEventListener('click', () => {
    if (document.querySelector('.valid_text')) {
        document.querySelector('.valid_text').textContent = ''
    }
    document.querySelector('.email_set').value = ''
    document.querySelector('.phone_set').value = ''
    document.querySelector('.set_form').style.display = 'none'
    //  document.querySelector('.popup-background').style.display = 'none'
    account.style.zIndex = 2
})
const widthWind = document.querySelector('body').offsetWidth;
const iconStrela = document.querySelector('.iconStrela')
iconStrela.addEventListener('click', () => {
    if (widthWind <= 860) {
        const centerBlock = document.querySelector('.centerBlock')
        const sections = document.querySelector('.sections')
        const visualGrafics = document.querySelector('.visualGrafics')
        const wrapList = document.querySelector('.wrapList')
        centerBlock.style.display = 'flex'
        sections.style.display = 'flex'
        sections.style.width = 100 + '%'
        wrapList.style.height = '';
        const comeback = document.querySelector('.comeback')
        comeback.style.display = 'none'
        visualGrafics.style.display = 'none'
        const main = document.querySelector('.main')
        main.style.display = 'flex' ? main.style.display = 'none' : null
        document.querySelector('.mobile_active').classList.remove('mobile_active')
        document.querySelector('.mobile_spisok').classList.add('mobile_active')
        return
    }
    if (widthWind > 860 && widthWind <= 1200) {
        const comeback = document.querySelector('.comeback')
        comeback.style.display = 'none'
        const wLeft = document.querySelector('.wrapper_left')
        wLeft.style.display = 'none'
        const main = document.querySelector('.main')
        main.style.display = 'flex'
        const sections = document.querySelector('.sections')
        sections.style.display = 'flex'
        const cblock = document.querySelector('.centerBlock')
        cblock.style.width = 70 + '%'
        return
    }
    else {
        const sections = document.querySelector('.sections')
        sections.style.display = 'flex'
        const comeback = document.querySelector('.comeback')
        comeback.style.display = 'none'
        const main = document.querySelector('.main')
        main.style.display = 'flex'
        main.style.display = 55 + '%'
        const wLeft = document.querySelector('.wrapper_left')
        wLeft.style.display = 'block'
        const cblock = document.querySelector('.centerBlock')
        cblock.style.width = 70 + '%'
    }
})

let intervalId
let intervalId2

const dropdown = document.querySelector('.dropdown')
const dropdownContent = document.querySelector('.dropdown-content')
if (dropdown) {
    dropdown.addEventListener('click', () => {
        if (dropdown.classList.contains('btnActive')) {
            dropdownContent.style.display = 'none'
            dropdown.classList.remove('btnActive')
            return
        }
        dropdown.classList.add('btnActive')
        dropdownContent.style.display = 'block'
    })
}

const rad = document.querySelectorAll('[name=radio]')
rad.forEach(el => {
    el.addEventListener('change', () => {
        const headerMM = document.querySelector('.headerMM')
        let children = headerMM.children;
        let newOrder = [3, 2, 1, 0];
        for (let i = 0; i < newOrder.length; i++) {
            for (let j = 0; j < newOrder.length; j++) {
                if (i == newOrder[j]) {
                    headerMM.appendChild(children[j]);
                }
            }
        }
    })
})

const buttonTth = document.querySelector('.buttonTth')
buttonTth.addEventListener('click', pr)
export async function pr() {
    console.log('сохранил')
    const techText = document.querySelectorAll('.tech')
    const formValue = document.querySelectorAll('.formValue')
    const tyresActive = document.querySelector('.tiresActiv')
    const osId = tyresActive.closest('.osiTest').children[1].id
    let nameOs;
    tyresActive.closest('.osiTest').children[1].classList.contains('pricepT') ? nameOs = 'Прицеп' : nameOs = 'Тягач'
    const arrNameCol = [];
    const arrNameColId = [];
    techText.forEach(el => {
        arrNameCol.push(el.id)
    })
    const active = document.querySelector('.color')
    const activePost = active.textContent.replace(/\s+/g, '')
    const idw = document.querySelector('.color').id
    tyresActive.closest('.osiTest').children[1].classList.contains('pricepT') ? nameOs = 'Прицеп' : nameOs = 'Тягач'
    const pr = Array.from(formValue)
    const maxMM = pr.pop()
    const idbaseTyres = document.querySelector('.idbaseTyres')
    arrNameColId.push(idw)
    arrNameColId.push(idbaseTyres.textContent)
    arrNameColId.push(activePost)
    arrNameColId.push(nameOs)
    arrNameColId.push(osId)
    arrNameColId.push(tyresActive.id)
    pr.forEach(e => {
        arrNameColId.push(e.value)
    })
    !maxMM.value ? arrNameColId.push(maxMM.placeholder) : arrNameColId.push(maxMM.value)
    arrNameColId.splice(13, 0, arrNameColId.splice(17, 1)[0]);
    if (idbaseTyres.textContent !== '') {
        await saveDouble(arrNameColId)
    }
    const btnShina = document.querySelectorAll('.modals')
    if (btnShina[1].classList.contains('active')) {
        console.log('икс')
        reqProtectorBase()
    }
    viewTech(tyresActive.id)
}

class DropDownList {
    constructor({ element, data, btn }) {
        this.element = element;
        this.data = data;
        this.btn = btn;
        this.listElement = null;
        this._onElementInput = this._onElementInput.bind(this);
        this._onElementKursor = this._onElementKursor.bind(this);
        this._onItemListClick = this._onItemListClick.bind(this);
        this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
        this.bind();
    }
    _onDocumentKeyDown({ keyCode }) {
        console.log(keyCode);
    }
    _onElementInput({ target }) {
        console.log(target.value)
        this.removeList();

        if (!target.value) {
            return
        }
        this.createList(this.data.filter(it => it.toLowerCase().indexOf(target.value.toLowerCase()) !== -1));
        this.appendList();
    }
    _onElementKursor() {
        this.removeList();
        this.createList(this.data);
        this.appendList();
    }
    _onItemListClick({ target }) {
        this.element.value = target.textContent;
        this.removeList();
    }
    createList(data) {
        this.listElement = document.createElement(`ul`);
        this.listElement.className = `drop-down__list`;
        this.listElement.innerHTML = data.map(it => `<li tabindex="0" class="drop-down__item">${it}</li>`).join(``);

        [...this.listElement.querySelectorAll(`.drop-down__item`)].forEach(it => {
            it.addEventListener(`click`, this._onItemListClick);
        });
        document.addEventListener(`keydown`, this._onDocumentKeyDown);
    }
    appendList() {
        const { left, width, bottom } = this.element.getBoundingClientRect();
        this.listElement.style.width = width + `px`;
        this.listElement.style.left = window.scrollX + left + `px`;
        this.listElement.style.top = window.scrollY + bottom + `px`;
        this.listElement.style.display = 'block'
        this.listElement.style.zIndex = '1000'
        document.body.appendChild(this.listElement);
    }
    removeList() {
        if (this.listElement) {
            this.listElement.remove();
            this.listElement = null;
        }
    }
    bind() {
        this.element.addEventListener(`input`, this._onElementInput);
        this.btn.addEventListener(`click`, this._onElementKursor);
        document.addEventListener('click', (e) => {
            if (e.target !== this.btn) {
                this.removeList()
            }
        })
    }
}
new DropDownList({ element: document.querySelector(`#input`), btn: document.querySelector('.buh'), data });




