import { postTyres, reqDelete, paramsDelete, reqTech, viewTech, loadParamsViewShina } from './requests.js'
import { alarmClear, viewOs } from './visual.js'
import { data } from './content.js'
import { loadParamsView } from './paramsTyresView.js'
import { visual, visualNone } from './visual.js'


export function saveTyres(arr) {
    const btnSave = document.querySelector('.btn_save')
    btnSave.addEventListener('click', () => {
        postTyres(arr);
        arr.length = 0;
    })

}
//очистка модели из базы и удаление отрисовки
export const btnClear = document.querySelector('.btn_clear')
btnClear.addEventListener('click', () => {
    const active = document.querySelectorAll('.color')
    console.log(active)
    const activePost = active[0].textContent.replace(/\s+/g, '')
    console.log('запуск')
    alarmClear()
    reqDelete(activePost);
    paramsDelete(activePost);
})

const btnShina = document.querySelector('.btn_icon')
btnShina.addEventListener('click', () => {
    btnShina.classList.toggle('active')
    const e = document.querySelector('.color')
    console.log(e)
    visualNone(e);
    visual(e)
    //  viewOs();
    // loadParamsView()
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
buttonTth.addEventListener('click', () => {
    const techText = document.querySelectorAll('.tech')
    console.log(techText)
    const arrNameCol = [];
    techText.forEach(el => {
        arrNameCol.push(el.id)
    })
    const tyresActive = document.querySelector('.tiresActiv')
    console.log(tyresActive.id)

    reqTech(arrNameCol, tyresActive.id);
    viewTech(tyresActive.id);
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
        this.listElement.style.width = width + `px`;
        this.listElement.style.left = left + `px`;
        this.listElement.style.top = bottom + `px`;
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




