
import { viewDinamic } from './protector.js'

export function tech() {
    const grafics = document.querySelector('.grafics')
    grafics.style.display = 'none';
    const modalCenterOs = document.querySelector('.modalCenterOs')
    modalCenterOs.style.display = 'none';
    const formValue = document.querySelectorAll('.formValue')
    const job = document.querySelectorAll('.job')

    formValue.forEach(i => {
        i.value = ''
    })
    job.forEach(i => i.textContent = '')
    const inputPSI = document.querySelector('.jobDav')
    const inputBar = document.querySelector('.bar')
    const techInfo = document.querySelector('.techInfo')
    //techInfo.style.display = 'block'
    const probeg = document.querySelectorAll('.probeg')
    probeg.forEach(el => {
        el.addEventListener('input', () => {
            console.log(probeg[1].value)
            console.log(probeg[0].value)
            if (el = probeg[1]) {
                probeg[2].textContent = probeg[1].value - probeg[0].value
            }
        })
    })
    inputPSI.addEventListener('input', () => {
        inputBar.textContent = (inputPSI.value / 14.504).toFixed(1);
        console.log(inputBar.textContent)
    })
    const tyresActive = document.querySelector('.tiresActiv')
    viewTech(tyresActive.id);
}


export async function viewTech(id) {
    const rad = document.querySelectorAll('[name=radio]')
    rad[0].checked = true
    let activePost;
    const active = document.querySelectorAll('.color')
    const idw = document.querySelector('.color').id
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.link_menu')[0]
        activePost = listItem.textContent.replace(/\s+/g, '')
    }
    else {
        activePost = active[0].textContent.replace(/\s+/g, '')
    }
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ id, activePost, idw }))
    }
    const res = await fetch('/api/techView', param)
    const response = await res.json()

    const result = response[response.length - 1]
    const keys = [];
    if (result) {
        for (let key in result) {
            keys.push(key);
        }
    }
    const number = document.querySelectorAll('.number')
    const text = document.querySelectorAll('.text')
    const titleMM = document.querySelectorAll('.titleMM')
    const inputMM = document.querySelector('.mmtext')
    if (!result || result.length === 0) {
        number.forEach(e => {
            e.textContent = ''
        })
        text.forEach(e => {
            e.textContent = ''
        })
        rad.forEach(el => {
            el.addEventListener('change', () => {
                viewDinamic([])
            })
        })
        viewDinamic([])
    }
    else {
        number[0].textContent = keys[9]
        number[1].textContent = keys[10]
        number[2].textContent = keys[11]
        number[3].textContent = keys[12]
        text[0].textContent = result.N1 + 'мм',
            text[1].textContent = result.N2 + 'мм',
            text[2].textContent = result.N3 + 'мм',
            text[3].textContent = result.N4 + 'мм';
        inputMM.innerHTML = result.maxMM + 'mm';
        const protector = [];
        protector.push(result.N1, result.N2, result.N3, result.N4)
        const protectorClear = [];
        const protectorClearRigth = [];
        titleMM.forEach(el => {
            el.style.display = 'flex';
            if (el.children[1].textContent == 'мм' || el.children[1].textContent == '') {
                el.style.display = 'none';
            }
        })
        protector.forEach(el => {
            if (el !== '') {
                protectorClear.push(el)
                protectorClearRigth.push(el)
            }
        })
        const reverseprotectorClear = protectorClearRigth.reverse();
        const maxStoc = result.maxMM
        rad.forEach(el => {
            el.addEventListener('change', () => {
                el.id === '1' ? viewDinamic(protectorClear, maxStoc) : viewDinamic(reverseprotectorClear, maxStoc)
            })
        })
        console.log(protectorClear, maxStoc)
        viewDinamic(protectorClear, maxStoc)
        const nval = (Object.entries(result))
        const dd = nval.splice(8, 1)
        nval.splice(12, 0, dd[0])
        const id = nval.splice(2, 1)
        const idbaseTyres = document.querySelector('.idbaseTyres')
        idbaseTyres.innerHTML = id[0][1]
        const tiresActiv = document.querySelector('.tiresActiv')
        tiresActiv.setAttribute('rel', id[0][1])
        const formValue = document.querySelectorAll('.formValue')
        formValue.forEach((el, index) => {
            el.value = nval[index][1]
        })
    }
    const inputPSI = document.querySelector('.jobDav')
    const inputBar = document.querySelector('.bar')
    inputBar.textContent = (inputPSI.value / 14.504).toFixed(1);
    const probeg = document.querySelectorAll('.probeg')
    probeg[2].textContent = probeg[1].value - probeg[0].value
}
