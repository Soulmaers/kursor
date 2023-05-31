import { viewTech } from './requests.js'
import { convert } from './helpersFunc.js'

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
    let newId = await findId()
    let ide;
    newId === undefined ? ide = 1 + 'id' : ide = increment(newId);
    function increment(newId) {
        let sortt = [...newId.identificator]
        console.log(sortt)
        sortt.forEach(el => {
            if (el === 'i') {
                sortt.splice(sortt.indexOf(el), 2).join('')
            }
        })
        const value = Number(sortt.join('')) + 1
        return value + 'id'
    }
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
    const maxMM = pr.pop()
    arrNameColId.push(createDate(new Date))
    arrNameColId.push(ide)
    arrNameColId.push(activePost)
    arrNameColId.push(nameOs)
    arrNameColId.push(osId)
    arrNameColId.push(tiresActiv)
    pr.forEach(e => {
        arrNameColId.push(e.value)
    })
    !maxMM.value ? arrNameColId.push(maxMM.placeholder) : arrNameColId.push(maxMM.value)
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
    const messaga = document.querySelector('.messageId')
    if (response.boolean === false) {
        reqBaseId()
    }
    if (response.boolean === true) {
        messaga.textContent = response.message
        messaga.style.color = 'green'
        const tiresActiv = document.querySelector('.tiresActiv')
        tiresActiv.children[0].style.border = '2px solid #000'
        tiresActiv.children[0].style.borderRadius = '30% 30% 0 0'
        tiresActiv.children[1].style.border = '2px solid #000'
        tiresActiv.children[1].style.borderRadius = '0 0 30% 30%'
        const idbaseTyres = document.querySelector('.idbaseTyres')
        idbaseTyres.textContent = response.result
    }
    setTimeout(() => messaga.textContent = '', 3000)
    viewTech(tiresActiv)
}

export async function saveDouble(arr) {
    const complete = await fetch('api/savePr', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ arr }),
    })
    const result = await complete.json()
    const tiresActiv = document.querySelector('.tiresActiv').id
    viewTech(tiresActiv)
    const messaga = document.querySelector('.messageId')
    messaga.textContent = 'Ротация колес выполнена'
    messaga.style.color = 'green'
    setTimeout(() => messaga.textContent = '', 3000)
    return
}
export async function findId() {
    const complete = await fetch('api/findId', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const result = await complete.json()
    const uniq = convert(result.result)
    uniq.sort(function (a, b) {
        return parseFloat(a.identificator) - parseFloat(b.identificator);
    });
    return uniq[uniq.length - 1]
}
export async function findTyresInstall() {
    const active = document.querySelector('.color')
    const activePost = active.textContent.replace(/\s+/g, '')
    const tyres = document.querySelectorAll('.tires_link')
    const tyresId = [];
    tyres.forEach(el => {
        tyresId.push(el.id)
    })
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ activePost, tyresId }))
    }
    const par = await fetch('api/listTyresId', param)
    const params = await par.json()
    const result = Object.values(params.result.reduce(
        (acc, val) => {
            acc[val.idTyres] = Object.assign(acc[val.idTyres] ?? {}, val);
            return acc;
        },
        {}
    ));
    const tiresLink = document.querySelectorAll('.tires_link')
    tiresLink.forEach(el => {
        result.forEach(item => {
            if (el.id === item.idTyres) {
                el.style.border = '2px solid #000'
                el.children[0].style.width = '44px'
                el.children[1].style.width = '44px'
            }
        })
    })
}