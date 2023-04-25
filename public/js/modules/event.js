import { postTyres, reqDelete, paramsDelete, barDelete, viewTech } from './requests.js'
import { alarmClear } from './visual.js'
import { data } from './content.js'
import { getDash } from './dash.js'
import { visual, visualNone } from './visual.js'
import { getUsers } from './admin.js'
import { geoloc } from './wialon.js'
import { reqProtectorBase } from './protector.js'
import { reqBaseId, saveDouble, findId } from './saveBaseId.js'
import { rotate, zbor } from './rotate.js'
import { changeBase } from './configurator.js'
import { iconParamsz, iconParamszWindows, deleteWinParams, fnToChange } from './configIcons.js'







const auth = document.querySelector('.auth')
const authClear = document.querySelector('.authClear')


if (auth) {
    auth.addEventListener('click', () => {
        console.log('вход')
        getUsers()
        const account = document.querySelector('.account')
        account.style.display = 'flex'
    })
    authClear.addEventListener('click', () => {
        const account = document.querySelector('.account')
        account.style.display = 'none'
    })
}


const rotateDiv = document.querySelector('.rotateDiv')
rotateDiv.addEventListener('click', () => {
    const rotates = document.querySelectorAll('.rotates')
    console.log(rotates)
    zbor(rotates);
    rotates.forEach(e => {
        e.classList.remove('rotates')
    })
})


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
    //wrapList.style.overflow = 'auto';
    wrapList.style.overflowY = 'visible';
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

const btnGenerate = document.querySelector('.btn_generate')
btnGenerate.addEventListener('click', reqBaseId)

const btnBase = document.querySelector('.btn_base')
btnBase.addEventListener('click', async () => {
    const findTyresId = document.querySelector('.findTyresId')
    if (findTyresId.classList.contains('activeFind')) {
        findTyresId.classList.remove('activeFind')
        findTyresId.style.display = 'none'
        return
    }
    findTyresId.classList.add('activeFind')
    findTyresId.style.display = 'flex'
    const uniq = await findId()
    console.log(uniq)
    const data = [];
    uniq.forEach(el => {
        data.push(el.identificator)
    })
    new DropDownList({ element: document.querySelector(`#inputId`), btn: document.querySelector('.buhId'), data });

})



const configs = document.querySelector('.configs')
const configClear = document.querySelector('.configClear')
if (configs) {
    configs.addEventListener('click', () => {
        const card = document.querySelectorAll('.cardClick')
        card.forEach(el => {
            el.classList.remove('acto')
        })
        const controll = document.querySelector('.container_left')
        const config = document.querySelector('.config')
        const clear = document.querySelector('.clear')
        const comfirm = document.querySelector('.comfirm')
        const sensors = document.querySelector('.sensors')
        const tiresActiv = document.querySelector('.tiresActiv')
        controll.style.display = 'flex'
        config.style.display = 'flex'
        clear.style.display = 'flex'
        comfirm.style.display = 'block';
        sensors.style.display = 'none';
        configs.classList.add('conf')
        rotate()

    })
    configClear.addEventListener('click', () => {
        //  zapros()
        const configs = document.querySelector('.configs')
        const findTyresId = document.querySelector('.findTyresId')
        const findValueId = document.querySelector('.findValueId')
        const controll = document.querySelector('.container_left')
        const sensors = document.querySelector('.sensors')
        const moduleConfig = document.querySelector('.moduleConfig')
        const rotates = document.querySelectorAll('.rotates')
        rotates.forEach(e => {
            e.classList.remove('rotates')
        })
        const wPod = document.querySelector('.wrap_pod')
        if (findTyresId.classList.contains('activeFind')) {
            findTyresId.classList.remove('activeFind')
            findTyresId.style.display = 'none'
        }
        findValueId.value = ''
        controll.style.display = 'none'
        sensors.style.display = 'none';
        moduleConfig.style.display = 'none';
        wPod.style.display = 'none';
        console.log(configs)
        configs.classList.remove('conf')
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
        barDelete(activePost);
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

/*
const to = document.querySelector('.icon_kluch')
to.addEventListener('click', fnToChange)

const x = document.querySelector('.x')
x.addEventListener('click', () => {
    const toChange = document.querySelector('.toChange')
    toChange.style.display = 'none'
})*/


const modalNameOs = document.querySelector('.modalNameOs')
modalNameOs.addEventListener('click', () => {
    const moduleConfig = document.querySelector('.moduleConfig')
    moduleConfig.style.display = 'flex';
    modalNameOs.classList.add('changeOs')
    const linkSelectOs = document.querySelectorAll('.linkSelectOs')
    linkSelectOs.forEach(el => {
        el.addEventListener('click', () => {
            if (el.textContent === 'Прицеп') {
                const centerOsActiv = document.querySelector('.centerOsActiv').closest('.osi')
                centerOsActiv.children[1].children[0].style.background = "#00FFFF"
                centerOsActiv.children[1].classList.add('pricep')
                const cont = document.querySelector('.cont')
                cont.prepend(centerOsActiv)
            }
            if (el.textContent === 'Тягач') {
                const centerOsActiv = document.querySelector('.centerOsActiv').closest('.osi')
                centerOsActiv.children[1].children[0].style.background = '#3333ff'
                centerOsActiv.children[1].classList.remove('pricep')
                const container = document.querySelector('.container')
                container.prepend(centerOsActiv)
            }
        })
    })
})

const btnSave = document.querySelector('.btn_save')
btnSave.addEventListener('click', () => {
    const massModel = [];
    const active = document.querySelector('.color')
    const activePost = active.textContent.replace(/\s+/g, '')
    const osi = document.querySelectorAll('.osi')
    osi.forEach(el => {
        massModel.push(fnsort(el))
    })
    changeBase(massModel, activePost)
})

export function fnsort(el) {
    console.log('сбор')
    const numberOs = parseFloat(el.children[1].id)
    let typeOs;
    el.children[1].classList.contains('pricep') ? typeOs = 'Прицеп' : typeOs = 'Тягач'
    const tyres = el.querySelectorAll('.tires')
    let count = 0;
    tyres.forEach(elem => {
        elem.style.display == 'flex' ? count++ : null
    })
    return [numberOs, typeOs, count]
}



const buttonTth = document.querySelector('.buttonTth')
buttonTth.addEventListener('click', async () => {
    const techText = document.querySelectorAll('.tech')
    const formValue = document.querySelectorAll('.formValue')
    const identificator = document.querySelector('.idbaseTyres').textContent
    const tyresActive = document.querySelector('.tiresActiv')
    const inputMM = document.querySelector('.maxMMM')
    const osId = tyresActive.closest('.osi').children[1].id
    let nameOs;
    tyresActive.closest('.osi').children[1].classList.contains('pricep') ? nameOs = 'Прицеп' : nameOs = 'Тягач'
    const arrNameCol = [];
    const arrNameColId = [];
    techText.forEach(el => {
        arrNameCol.push(el.id)
    })
    const active = document.querySelector('.color')
    const activePost = active.textContent.replace(/\s+/g, '')

    tyresActive.closest('.osi').children[1].classList.contains('pricep') ? nameOs = 'Прицеп' : nameOs = 'Тягач'
    const pr = Array.from(formValue)
    const maxMM = pr.pop()

    //  arrNameColId.push(createDate(new Date))
    const idbaseTyres = document.querySelector('.idbaseTyres')
    arrNameColId.push(idbaseTyres.textContent)
    arrNameColId.push(activePost)
    arrNameColId.push(nameOs)
    arrNameColId.push(osId)
    arrNameColId.push(tyresActive.id)
    pr.forEach(e => {
        arrNameColId.push(e.value)
    })
    !maxMM.value ? arrNameColId.push(maxMM.placeholder) : arrNameColId.push(maxMM.value)
    arrNameColId.splice(12, 0, arrNameColId.splice(16, 1)[0]);
    if (idbaseTyres.textContent !== '') {
        // await reqTech(arrNameColId, tyresActive.id)
        await saveDouble(arrNameColId)
    }


    const btnShina = document.querySelectorAll('.modals')
    if (btnShina[1].classList.contains('active')) {
        reqProtectorBase()
    }
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
    wrapList.style.overflowY = 'auto';
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

const card = document.querySelectorAll('.icon_card')
card.forEach(elem => {
    const changeParams = document.querySelector('.changeParams')
    const sensors = document.querySelector('.sensors')
    const btnsens = document.querySelectorAll('.btnsens')
    const wButton = document.querySelector('.wrapper_button')
    const titleSens = document.querySelector('.title_sens')
    const obo = document.querySelector('.obo')
    elem.addEventListener('click', () => {
        if (elem.classList.contains('acto')) {
            elem.classList.remove('acto')
            sensors.style.display = 'none'
            //    btnsens[0].style.display = 'flex'
            //   btnsens[1].style.display = 'flex'
            btnsens[2].style.display = 'none'
            return
        }
        card.forEach(el => {
            el.classList.remove('acto')
        })
        changeParams.value = '1';
        console.log('икон')
        iconParamsz()
        elem.classList.add('acto')
        sensors.style.display = 'flex'
        // wButton.style.justifyContent = 'flex-start'
        btnsens[0].style.display = 'none'
        btnsens[1].style.display = 'none'
        btnsens[2].style.display = 'flex'
        obo.style.display = 'none'
        titleSens.style.display = 'none'
    })
})


const valueStatic = document.querySelectorAll('.valueStatic')
valueStatic.forEach(elem => {
    const changeParams = document.querySelector('.changeParams')
    const sensors = document.querySelector('.sensors')
    const btnsens = document.querySelectorAll('.btnsens')
    const wButton = document.querySelector('.wrapper_button')
    const titleSens = document.querySelector('.title_sens')
    const obo = document.querySelector('.obo')
    const role = document.querySelectorAll('.log')[0].textContent
    elem.addEventListener('click', () => {
        if (elem.classList.contains('actoStatic')) {
            elem.classList.remove('actoStatic')
            sensors.style.display = 'none'
            //    btnsens[0].style.display = 'flex'
            //   btnsens[1].style.display = 'flex'
            btnsens[2].style.display = 'none'
            return
        }
        valueStatic.forEach(el => {
            el.classList.remove('actoStatic')
        })
        changeParams.value = '1';
        console.log('икон')
        role !== 'Пользователь' ? elem.classList.add('actoStatic') : null

        iconParamszWindows()
        sensors.style.display = 'flex'
        // wButton.style.justifyContent = 'flex-start'
        btnsens[0].style.display = 'none'
        btnsens[1].style.display = 'none'
        btnsens[2].style.display = 'flex'
        obo.style.display = 'none'
        titleSens.style.display = 'none'
    })
})





const delIcon = document.querySelectorAll('.delIcon')
delIcon.forEach(el => {
    el.addEventListener('click', () => {
        delIcon.forEach(el => {
            el.classList.remove('del')
        })
        el.classList.add('del')

        const clearConfirmWin = document.querySelector('.clearConfirmWin')
        clearConfirmWin.style.display = 'flex'
        const y = document.querySelector('.y')
        const n = document.querySelector('.n')
        n.addEventListener('click', () => {
            clearConfirmWin.style.display = 'none'
        })
        y.addEventListener('click', () => {
            const id = el.previousElementSibling.id
            el.previousElementSibling.textContent = ''
            el.closest('.itemStatic').children[0].value = ''
            clearConfirmWin.style.display = 'none'
            el.style.display = 'none'

            deleteWinParams(id)
        })

    })

});

/*
const wbIcon = document.querySelector('.wrapper_button_icon')
wbIcon.addEventListener('click', () => {
    const titleSIcon = document.querySelector('.title_sensIcon')
    const obo = document.querySelector('.obo')
    if (titleSIcon.classList.contains('act')) {
        titleSIcon.classList.remove('act')
        obo.style.display = 'none';
        titleSIcon.style.display = 'none'
        return
    }
    titleSIcon.classList.add('act')
    titleSIcon.style.display = 'flex'
    obo.style.display = 'flex';
})*/


//отрисовываем список под параметры
const btnsens = document.querySelectorAll('.btnsens')
const titleSens = document.querySelector('.title_sens')
const obo = document.querySelector('.obo')
btnsens.forEach(e => {
    e.addEventListener('click', () => {
        if (e.classList.contains('actBTN')) {
            e.classList.remove('actBTN')
            obo.style.display = 'none';
            titleSens.style.display = 'none';
            return
        }
        btnsens.forEach(el => {
            obo.style.display = 'none';
            titleSens.style.display = 'none';
            el.classList.remove('actBTN')
        })
        e.classList.add('actBTN')
        obo.style.display = 'flex';
        titleSens.style.display = 'block';
    })
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
        this.listElement.style.zIndex = '1000'
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



/*
const valueStatic = document.querySelectorAll('.valueStatic')
valueStatic.forEach(e => {
    e.addEventListener('input', func)
})
function func() {
    if (this.value.indexOf(".") != '-1') {
        this.value = this.value.substring(0, this.value.indexOf(".") + 3);

    }
}*/

/*
valueStatic.forEach(el => {
   
})*/
