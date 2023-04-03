import { viewTech } from './requests.js'
import { convert } from './visual.js'


export function createDate() {

    let today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    today = day + '.' + month + '.' + year;

    return today

}


export async function reqBaseId() {
    const tiresActiv = document.querySelector('.tiresActiv').id
    console.log(tiresActiv)

    const newId = (Math.random() * 10000).toFixed(0) + 'id'
    console.log(newId)
    const active = document.querySelector('.color')
    const activePost = active.textContent.replace(/\s+/g, '')
    const formValue = document.querySelectorAll('.formValue')
    const tyresActive = document.querySelector('.tiresActiv')
    const inputMM = document.querySelector('.maxMMM')
    const osId = tyresActive.closest('.osi').children[1].id
    let nameOs;
    tyresActive.closest('.osi').children[1].classList.contains('pricep') ? nameOs = 'Прицеп' : nameOs = 'Тягач'
    const arrNameColId = [];
    const pr = Array.from(formValue)
    console.log(pr)
    arrNameColId.push(createDate(new Date))
    arrNameColId.push(newId)
    arrNameColId.push(activePost)
    arrNameColId.push(nameOs)
    arrNameColId.push(osId)
    arrNameColId.push(tiresActiv)
    pr.forEach(e => {
        arrNameColId.push(e.value)
    })
    !inputMM.value ? arrNameColId.push(inputMM.placeholder) : arrNameColId.push(inputMM.value)

    const dd = arrNameColId.splice(17, 1)
    arrNameColId.splice(13, 0, dd[0])

    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ arrNameColId, newId }))
    }
    const res = await fetch('/api/generate', param)
    const response = await res.json()
    console.log(response)

    const messaga = document.querySelector('.messageId')

    if (response.boolean === false) {
        reqBaseId()
    }
    if (response.boolean === true) {
        messaga.textContent = response.message
        messaga.style.color = 'green'
        const idbaseTyres = document.querySelector('.idbaseTyres')
        idbaseTyres.textContent = response.result
    }
    setTimeout(() => messaga.textContent = '', 2000)

    console.log(tiresActiv)
    viewTech(tiresActiv)
}




export async function saveDouble(arr) {
    console.log(arr)
    const complete = await fetch('api/savePr', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ arr }),
    })
    const result = await complete.json()
    const tiresActiv = document.querySelector('.tiresActiv').id
    console.log(tiresActiv)
    viewTech(tiresActiv)

    return console.log(result)
}


export async function findId() {
    const complete = await fetch('api/findId', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
        //  body: JSON.stringify({ arr }),
    })
    const result = await complete.json()
    console.log(result.result)

    const uniq = convert(result.result)

    uniq.forEach(el => {
        console.log(el.identificator)
    })
    return uniq
}