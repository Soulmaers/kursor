import { iconParams } from './wialon.js'

function addZero(digits_length, source) {
    let text = source + '';
    while (text.length < digits_length)
        text = '0' + text;
    return text;
}

export function fnToChange() {
    const to = document.querySelector('.icon_kluch')
    const toChanges = document.querySelector('.toChange')
    const toValChange = document.querySelector('.toValChange')
    const btnTO = document.querySelector('.btnTO')
    const btnTOUpdate = document.querySelector('.btnTOUpdate')
    if (to.classList.contains('actChange')) {
        to.classList.remove('actToChange')
        toChanges.style.display = 'none';
    }
    const active = document.querySelector('.color')
    const activePost = active.textContent.replace(/\s+/g, '')
    const UpTo = document.querySelector('.UpTo')
    const up = document.querySelector('.up')
    const noUp = document.querySelector('.noUp')
    to.classList.add('actToChange')
    toChanges.style.display = 'flex';
    btnTOUpdate.addEventListener('click', () => {
        UpTo.style.display = 'flex'
        up.addEventListener('click', () => {
            console.log('да?1')
            iconParams()
            UpTo.style.display = 'none'
            toChanges.style.display = 'none';
        })
        noUp.addEventListener('click', async () => {
            UpTo.style.display = 'none'
        })

    })
    btnTO.addEventListener('click', async () => {
        UpTo.style.display = 'flex'
        up.addEventListener('click', async () => {
            toChanges.style.display = 'none';
            const valueTO = toValChange.value
            let toChange = toValChange.value
            const param = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: (JSON.stringify({ activePost, valueTO }))
            }
            const res = await fetch('/api/to', param)
            const response = await res.json()
            UpTo.style.display = 'none'
            console.log('да?2')
            iconParams()
        })
        noUp.addEventListener('click', async () => {
            UpTo.style.display = 'none'
        })
    })
}
export function iconParamsz() {
    const active = document.querySelector('.color')
    const activePost = active.children[0].textContent.replace(/\s+/g, '')
    const changeParams = document.querySelector('.changeParams')
    const msg = document.querySelectorAll('.msg')
    msg.forEach(el => {
        el.addEventListener('click', () => {
            const arrSpreed = [...el.textContent]
            let value;
            let param;
            arrSpreed.forEach(el => {
                if (el === ':') {
                    value = (arrSpreed.splice(arrSpreed.indexOf(el) + 1, arrSpreed.length - 1).join('') * changeParams.value).toFixed(0)
                }
            })
            arrSpreed.forEach(el => {
                if (el === ':') {
                    param = arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join('')
                }
            })
            const coef = changeParams.value
            const id = document.querySelector('.acto').id
            postIconParams(activePost, param, coef, id)
        })
    })
}
async function postIconParams(activePost, param, coef, id) {
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ activePost, param, coef, id }))
    }
    const par = await fetch('api/icon', params)
    const paramssy = await par.json()
    const messaga = document.querySelector('.messageId')
    messaga.textContent = 'Параметр сохранен'
    messaga.style.color = 'green'
    setTimeout(() => messaga.textContent = '', 3000)
    iconFind(activePost)
}

export async function iconFind(activePost) {
    const changeParams = document.querySelector('.changeParams')
    const card = document.querySelectorAll('.icon_card')
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ activePost }))
    }
    const argy = await fetch('api/wialon', params)
    const arg = await argy.json()
    const parFind = await fetch('api/iconFind', params)
    const paramssyFind = await parFind.json()
    arg.values.forEach(el => {
        paramssyFind.result.forEach(it => {
            if (el.name === it.params) {
                card.forEach(elem => {
                    if (elem.id === it.icons) {
                        elem.children[0].textContent = (el.value * it.coef).toFixed(1) // + 'км'
                        el.status === 'false' ? elem.children[0].style.color = 'gray' : elem.children[0].style.color = 'black'
                        if (it.icons === 'odom-card') {
                            const val = addZero(8, (el.value * it.coef).toFixed(0))
                            elem.children[0].textContent = val// + 'км'
                        }
                        if (it.icons === 'ign-card') {
                            if (activePost !== 'КранГаличанинР858ОР178') {
                                const val = el.value
                                elem.children[0].textContent = val + '° C'
                                val > 0 ? elem.children[0].textContent = 'ВКЛ' : elem.children[0].textContent = 'ВЫКЛ';
                                const ignTest = document.querySelector('.ignTest_card')
                                val > 0 ? (ignTest.classList.remove('ignTest_card_vykl'), ignTest.classList.add('ignTest_card_vkl')) : (ignTest.classList.remove('ignTest_card_vkl'), ignTest.classList.add('ignTest_card_vykl'))
                            }
                        }
                        elem.addEventListener('click', () => {
                            changeParams.value = it.coef
                        })
                    }
                })
            }
        })
    })
}

export const convert = (ob) => {
    const uniq = new Set(ob.map(e => JSON.stringify(e)));
    return Array.from(uniq).map(e => JSON.parse(e));
}

export function iconParamszWindows() {
    const active = document.querySelector('.color')
    const activePost = active.children[0].textContent.replace(/\s+/g, '')
    const changeParams = document.querySelector('.changeParams')
    const actoStatic = document.querySelector('.actoStatic')
    const msg = document.querySelectorAll('.msg')
    msg.forEach(el => {
        el.addEventListener('click', () => {
            const arrSpreed = [...el.textContent]
            let value;
            let param;
            arrSpreed.forEach(el => {
                if (el === ':') {
                    value = (arrSpreed.splice(arrSpreed.indexOf(el) + 1, arrSpreed.length - 1).join('') * changeParams.value).toFixed(2)
                }
            })
            arrSpreed.forEach(el => {
                if (el === ':') {
                    param = arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join('')
                }
            })
            const coef = changeParams.value
            actoStatic.textContent = value
            const nameInput = document.querySelector('.actoStatic').previousElementSibling.value
            const id = document.querySelector('.actoStatic').id
            postIconParamsWindow(activePost, param, coef, nameInput, id)
        })
    })

}

async function postIconParamsWindow(activePost, param, coef, nameInput, id) {
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ activePost, param, coef, nameInput, id }))
    }
    const par = await fetch('api/iconWindows', params)
    const paramssy = await par.json()
    const messaga = document.querySelector('.messageId')
    messaga.textContent = 'Параметр сохранен'
    messaga.style.color = 'green'
    setTimeout(() => messaga.textContent = '', 3000)
    iconFindWindows(activePost)
}

export async function iconFindWindows(activePost) {
    const changeParams = document.querySelector('.changeParams')
    const valueStatic = document.querySelectorAll('.valueStatic')
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ activePost }))
    }
    const argy = await fetch('api/wialon', params)
    const arg = await argy.json()
    const parFind = await fetch('api/iconFindWindows', params)
    const paramssyFind = await parFind.json()
    arg.values.forEach(el => {
        paramssyFind.result.forEach(it => {
            if (el.name === it.params) {
                valueStatic.forEach(elem => {
                    if (elem.id === it.idv) {
                        elem.textContent = (el.value * it.coef).toFixed(2)
                        elem.previousElementSibling.value = it.nameInput
                        elem.addEventListener('click', () => {
                            changeParams.value = it.coef
                        })
                    }
                })
            }
        })
    })
    refactor()
}

export async function deleteWinParams(id) {
    const active = document.querySelector('.color')
    const activePost = active.textContent.replace(/\s+/g, '')
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ activePost, id }))
    }
    const argy = await fetch('api/deleteSatic', params)
    const arg = await argy.json()
    iconFindWindows(activePost)
}

export function refactor() {
    const nameStatic = document.querySelectorAll('.nameStatic')
    nameStatic.forEach(e => {
        if (e.value === '') {
        }
        else {
            e.closest('.itemStatic').children[2].style.display = 'block'
        }
    })
}

