
import { reqModalBar, viewBar } from './requests.js'
import { loadParamsView } from './paramsTyresView.js'


export function modalOs() {
    const modalCenterOs = document.querySelector('.modalCenterOs')
    const modalClear = document.querySelector('.modalClear')
    const btnModal = document.querySelector('.btnModal')
    const btnModalClear = document.querySelector('.btnModalClear')
    const centerOs = document.querySelectorAll('.centerOs')
    centerOs.forEach(e => {
        e.addEventListener('click', () => {
            if (e.classList.contains('centerOsActiv')) {
                e.classList.remove('centerOsActiv')
                modalCenterOs.style.display = 'none'
                return
            }
            centerOs.forEach(e => {
                e.classList.remove('centerOsActiv')
            });
            e.classList.add('centerOsActiv')
            modalCenterOs.style.display = 'block'
            const modalInput = document.querySelectorAll('.modalInput')
            modalInput.forEach(i => {
                i.value = ''
            })
            const centerOsActiv = document.querySelector('.centerOsActiv')
            const modalNumberOs = document.querySelector('.modalNumberOs')
            const modalTitle = document.querySelector('.modalTitle')
            if (e.classList.contains('pricep')) {
                modalNumberOs.textContent = centerOsActiv.id + '-' + 'Прицеп'
            }
            else {
                modalNumberOs.textContent = centerOsActiv.id + '-' + 'Тягач'
            }
            modalTitle.style.display = 'flex'
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
            console.log(norma)
            norma.addEventListener('input', () => {
                fncalc(norma.value)
            })
        })
    })
    modalClear.addEventListener('click', () => {
        modalCenterOs.style.display = 'none'
    })
    btnModal.addEventListener('click', modalBar)
    btnModalClear.addEventListener('click', clearBar)
}

function clearBar() {
    const inpfinal = document.querySelectorAll('.inpfinal')
    inpfinal.forEach(e => {
        e.value = e.placeholder
    })
}
function fncalc(val) {
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
//Math.trunc(nPos * 100) / 100;

const norma = document.querySelector('.normal')
const inpfinal = document.querySelectorAll('.inpfinal')
inpfinal.forEach(it => {
    it.addEventListener('input', () => {
        if (norma.value) {
            it.previousElementSibling.textContent = ((String(norma.value / 100 * it.value)).substr(0, 5))
            console.log(it.previousElementSibling.textContent)
        }
    })
})


async function modalBar() {
    const modalCenterOs = document.querySelector('.modalCenterOs')
    modalCenterOs.style.display = 'none'
    const centerOsActiv = document.querySelector('.centerOsActiv')
    console.log(centerOsActiv.id)
    const modalText = document.querySelectorAll('.modalText')
    console.log(modalText)
    const arrNameCol = [];
    modalText.forEach(el => {
        arrNameCol.push(el.id)
    })

    console.log(arrNameCol)
    await reqModalBar(arrNameCol, centerOsActiv.id);
    await loadParamsView()
    viewBar(centerOsActiv.id);
}

