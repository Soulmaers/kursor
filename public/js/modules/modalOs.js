
import { reqModalBar, viewBar } from './requests.js'

export function modalOs() {
    const modalCenterOs = document.querySelector('.modalCenterOs')
    const modalClear = document.querySelector('.modalClear')
    const btnModal = document.querySelector('.btnModal')
    const btnModalClear = document.querySelector('.btnModalClear')
    const vnut = document.querySelectorAll('.vnutTest')
    vnut.forEach(e => {
        e.addEventListener('click', () => {
            if (e.parentElement.classList.contains('centerOsActiv')) {
                e.parentElement.classList.remove('centerOsActiv')
                modalCenterOs.style.display = 'none'
                return
            }
            vnut.forEach(e => {
                e.parentElement.classList.remove('centerOsActiv')
            });
            e.parentElement.classList.add('centerOsActiv')
            modalCenterOs.style.display = 'block'
            const modalInput = document.querySelectorAll('.modalInput')
            modalInput.forEach(i => {
                i.value = ''
            })
            const centerOsActiv = document.querySelector('.centerOsActiv')
            const modalNumberOs = document.querySelector('.modalNumberOs')
            console.log(e)
            if (e.parentElement.classList.contains('pricepT')) {
                modalNumberOs.textContent = centerOsActiv.id + '-' + 'Прицеп'
            }
            else {
                modalNumberOs.textContent = centerOsActiv.id + '-' + 'Тягач'
            }
            const divfinal = document.querySelectorAll('.divfinal')
            const inpfinal = document.querySelectorAll('.inpfinal')
            divfinal.forEach(e => {
                e.textContent = ''
            })
            inpfinal.forEach(e => {
                e.value = ''
            })
            viewBar(centerOsActiv.id);
            const norma = document.querySelector('.normal')
            norma.addEventListener('input', () => {
                fncalc(norma.value)
            })
        })
    })
    modalClear.addEventListener('click', () => {
        modalCenterOs.style.display = 'none'
    })

}
const btnModal = document.querySelector('.btnModal')
const btnModalClear = document.querySelector('.btnModalClear')
btnModal.addEventListener('click', () => {
    const normal = document.querySelector('.normal')
    console.log(normal.value)
    normal.value === '' ? messfn() : modalBar()
})
btnModalClear.addEventListener('click', clearBar)

function messfn() {
    const mess = document.querySelector('.mess')
    mess.style.display = 'flex'
    setTimeout(() => mess.style.display = 'none', 3000)
}

function clearBar() {
    const norma = document.querySelector('.normal')
    const inpfinal = document.querySelectorAll('.inpfinal')
    const divfinal = document.querySelectorAll('.divfinal')
    inpfinal.forEach((e, index) => {
        e.value = e.placeholder
        divfinal[index].textContent = ((String(norma.value / 100 * e.placeholder)).substr(0, 5))
    })
}
function fncalc(val) {
    console.log(val)
    const inpfinal = document.querySelectorAll('.inpfinal')
    const divfinal = document.querySelectorAll('.divfinal')
    let values;
    inpfinal.forEach((el, index) => {
        !el.value ? values = el.placeholder : values = el.value
        divfinal[index].textContent = ((String(val / 100 * values)).substr(0, 5))
        const res = val / 100 * values
        console.log(res)
    })
}
const norma = document.querySelector('.normal')
const inpfinal = document.querySelectorAll('.inpfinal')
inpfinal.forEach(it => {
    it.addEventListener('input', () => {
        let values = it.value;
        const valuess = values.replace(/,/g, '.'); // заменяем все запятые на точки
        it.value = valuess;
        if (norma.value) {
            console.log(norma.value / 100 * it.value)
            it.previousElementSibling.textContent = ((String(norma.value / 100 * it.value)).substr(0, 5))
            console.log(it.previousElementSibling.textContent)
        }
    })
})

async function modalBar() {
    const modalCenterOs = document.querySelector('.modalCenterOs')
    modalCenterOs.style.display = 'none'
    const centerOsActiv = document.querySelector('.centerOsActiv')
    const modalText = document.querySelectorAll('.modalText')
    const arrNameCol = [];
    modalText.forEach(el => {
        arrNameCol.push(el.id)
    })
    console.log(arrNameCol, centerOsActiv.id)
    await reqModalBar(arrNameCol, centerOsActiv.id);
    viewBar(centerOsActiv.id);
    centerOsActiv.classList.remove('centerOsActiv')
}

