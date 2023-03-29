import { postTyres, reqDelete, paramsDelete, reqTech, viewTech, loadParamsViewShina } from './requests.js'
import { alarmClear, viewOs } from './visual.js'
import { data } from './content.js'
import { getDash } from './dash.js'
import { visual, visualNone } from './visual.js'
import { getUsers } from './admin.js'
import { geoloc } from './wialon.js'
import { reqProtectorBase } from './protector.js'



const auth = document.querySelector('.auth')
const authClear = document.querySelector('.authClear')
if (auth) {
    auth.addEventListener('click', () => {
        getUsers()
        const account = document.querySelector('.account')
        account.style.display = 'flex'
    })
    authClear.addEventListener('click', () => {
        const account = document.querySelector('.account')
        account.style.display = 'none'
    })
}


const iconStrela = document.querySelector('.iconStrela')
iconStrela.addEventListener('click', () => {
    const widthWind = document.querySelector('body').offsetWidth;
    console.log(widthWind)
    if (widthWind <= 860) {
        const sections = document.querySelector('.sections')
        sections.style.display = 'flex'
        const comeback = document.querySelector('.comeback')
        comeback.style.display = 'none'
        const main = document.querySelector('.main')
        main.style.display = 'flex' ? main.style.display = 'none' : null
        return
    }
    if (widthWind > 860 && widthWind <= 1200) {
        console.log('медиум')
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

const btnDash = document.querySelector('.dash')
btnDash.addEventListener('click', () => {
    const dash = document.querySelector('.wrapper_right_dash')
    const sections = document.querySelector('.sections')
    const main = document.querySelector('.main')
    dash.style.display = 'flex'
    sections.style.display = 'none'
    main.style.display = 'none'
    getDash()
    setInterval(getDash, 10000)

});

const monitor = document.querySelector('.monitor')
monitor.addEventListener('click', mainblock)


function mainblock() {
    geoloc()
    const dash = document.querySelector('.wrapper_right_dash')
    const sections = document.querySelector('.sections')
    const main = document.querySelector('.main')
    dash.style.display = 'none'
    sections.style.display = 'flex'
    main.style.display = 'flex'
    const wRight = document.querySelector('.wrapper_right')
    const wLeft = document.querySelector('.wrapper_left')
    const icon = document.querySelector('.icon')
    const model = document.querySelector('.wrapper_containt')
    const grafics = document.querySelector('.grafics')
    const visualGrafics = document.querySelector('.visualGrafics')
    const wrapList = document.querySelector('.wrapList')
    const techInfo = document.querySelector('.techInfo')
    const plug = document.querySelectorAll('.plug')
    const config = document.querySelector('.config')
    plug[2].classList.remove('activGraf')
    console.log(wLeft)
    wRight.style.display = 'flex';
    wLeft.style.display = 'block';
    icon.style.display = 'flex';
    grafics.style.display = 'none';
    config.style.display = 'none';
    techInfo.style.display = 'none';
    visualGrafics.style.display = 'none';
    main.style.flexDirection = 'row'
    model.style.zoom = '1'
    model.style.width = '100%'
    model.style.maxHeight = "none"
    model.style.MozTransform = "scale(1)"
    wRight.appendChild(model);
    wrapList.style.overflowY = 'none';
    wrapList.style.height = 'none';
}







export function saveTyres(arr) {
    const modCnf = document.querySelector('.moduleConfig')
    const btnSave = document.querySelector('.btn_save')
    btnSave.addEventListener('click', () => {
        modCnf.style.display = 'none';
        postTyres(arr);
        arr.length = 0;
    })

}




const configs = document.querySelector('.configs')
const configClear = document.querySelector('.configClear')
if (configs) {
    configs.addEventListener('click', () => {
        const controll = document.querySelector('.container_left')
        const config = document.querySelector('.config')
        controll.style.display = 'flex'
        config.style.display = 'flex'
    })
    configClear.addEventListener('click', () => {
        const controll = document.querySelector('.container_left')
        // const config = document.querySelector('.config')
        controll.style.display = 'none'
        //  config.style.display = 'none'
    })
}


//очистка модели из базы и удаление отрисовки
export function btnDel() {
    const modCnf = document.querySelector('.moduleConfig')
    const btnClear = document.querySelector('.btn_clear')
    const clear = document.querySelector('.clear')
    const wrapPod = document.querySelector('.wrap_pod')
    const yes = document.querySelector('.yes')
    const no = document.querySelector('.no')
    btnClear.addEventListener('click', () => {

        wrapPod.style.display = 'flex';
        clear.style.display = 'none';
    })

    no.addEventListener('click', () => {
        wrapPod.style.display = 'none';
        clear.style.display = 'block';

    })
    yes.addEventListener('click', () => {
        wrapPod.style.display = 'none';
        modCnf.style.display = 'none';
        clear.style.display = 'block';
        const active = document.querySelectorAll('.color')
        console.log(active)
        const activePost = active[0].textContent.replace(/\s+/g, '')
        console.log('запуск')
        alarmClear()
        reqDelete(activePost);
        paramsDelete(activePost);
    })

}





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




const btnShina = document.querySelectorAll('.modals')
btnShina.forEach(el => {

    el.addEventListener('click', () => {

        btnShina.forEach(el => {
            el.classList.remove('active')
        })
        el.classList.add('active')
        const e = document.querySelector('.color')
        console.log(e)
        visualNone(e);
        visual(e)
        const activGraf = document.querySelectorAll('.activGraf')
        if (activGraf) {
            mainblock()
        }
    })
})




const burger = document.querySelector('.burger')
burger.addEventListener('click', () => {
    const control = document.querySelector('.control_panel')
    const adminka = document.querySelector('.container_flash')
    if (burger.classList.contains('burgerActive')) {
        adminka.style.display = 'flex'
        control.style.display = 'none'
        burger.classList.remove('burgerActive')
        return
    }
    adminka.style.display = 'none'
    control.style.display = 'flex'
    control.style.width = 30 + '%'
    control.style.background = 'rgba(6, 28, 71, 1)'
    control.style.paddingBottom = '5px'
    control.style.paddingTop = '5px'
    burger.classList.add('burgerActive')

})

/*
const detaly = document.querySelector('.detaly')
detaly.addEventListener('click', () => {
    const wrapperUp = document.querySelector('.wrapper_up')
    const speedGraf = document.querySelector('.speedGraf')
    const wrapperRight = document.querySelector('.wrapper_right')
    wrapperUp.style.display = 'none'
    wrapperRight.style.display = 'none'
    speedGraf.style.display = 'none'
    const detalisation = document.querySelector('.detalisation')
    detalisation.style.display = 'flex'
})*/



const buttonTth = document.querySelector('.buttonTth')
buttonTth.addEventListener('click', async () => {
    const techText = document.querySelectorAll('.tech')
    const inputMM = document.querySelector('.maxMMM')
    console.log(techText)
    const arrNameCol = [];
    techText.forEach(el => {
        arrNameCol.push(el.id)
    })
    arrNameCol.push('maxMM')
    const tyresActive = document.querySelector('.tiresActiv')
    await reqTech(arrNameCol, tyresActive.id)
    reqProtectorBase()
    viewTech(tyresActive.id)

})



const plug = document.querySelectorAll('.plug')

plug[2].addEventListener('click', () => {
    console.log('нажал')
    const wRight = document.querySelector('.wrapper_right')
    const wLeft = document.querySelector('.wrapper_left')
    const icon = document.querySelector('.icon')
    const model = document.querySelector('.wrapper_containt')
    const visualGrafics = document.querySelector('.visualGrafics')
    const grafics = document.querySelector('.grafics')
    const main = document.querySelector('.main')
    const sections = document.querySelector('.sections')
    const wrapList = document.querySelector('.wrapList')
    const techInfo = document.querySelector('.techInfo')
    plug[2].classList.add('activGraf')
    wrapList.style.overflowY = 'scroll';
    wrapList.style.height = '300px';
    model.style.zoom = '0.65'
    model.style.MozTransformOrigin = "top"
    model.style.MozTransform = "scale(0.65)"
    model.style.maxHeight = "550px"
    wRight.style.display = 'none';
    techInfo.style.display = 'none';
    wLeft.style.display = 'none';
    icon.style.display = 'none';
    grafics.style.display = 'flex';
    visualGrafics.style.display = 'flex';
    main.style.flexDirection = 'column'
    // visualGrafics.style.marginTop = '40%'
    model.style.width = '50%'
    model.style.marginLeft = '0'
    sections.style.width = '40%'

    visualGrafics.prepend(model);
})












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
        console.log('удаление')
        this.element.value = target.textContent;
        this.removeList();
    }
    createList(data) {
        console.log(data)
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
        console.log(left, width, bottom)

        this.listElement.style.width = width + `px`;
        // this.listElement.style.height = height + `px`;
        this.listElement.style.left = window.scrollX + left + `px`;
        this.listElement.style.top = window.scrollY + bottom + `px`;
        this.listElement.style.display = 'block'
        document.body.appendChild(this.listElement);
    }

    removeList() {
        if (this.listElement) {
            this.listElement.remove();
            this.listElement = null;
        }
        // document.removeEventListener(`keydown`, this._onDocumentKeyDown);
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