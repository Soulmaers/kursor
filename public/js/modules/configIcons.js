

function addZero(digits_length, source) {
    let text = source + '';
    while (text.length < digits_length)
        text = '0' + text;
    return text;
}

export function iconParamsz() {
    // console.log('работаем')
    const active = document.querySelector('.color')
    const activePost = active.textContent.replace(/\s+/g, '')
    const changeParams = document.querySelector('.changeParams')
    const probegValue = document.querySelector('.probeg_value')
    const msg = document.querySelectorAll('.msg')
    msg.forEach(el => {
        el.addEventListener('click', () => {
            const arrSpreed = [...el.textContent]
            let value;
            let param;
            arrSpreed.forEach(el => {
                if (el === ':') {
                    value = (arrSpreed.splice(arrSpreed.indexOf(el) + 1, arrSpreed.length - 1).join('') * changeParams.value).toFixed(0)
                    //  console.log(value)
                }
            })
            arrSpreed.forEach(el => {
                if (el === ':') {
                    param = arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join('')
                }
            })
            //   console.log(param)
            const odometr = addZero(8, value)
            probegValue.textContent = odometr + 'км'
            //   console.log(probegValue.textContent)
            const coef = changeParams.value
            const id = document.querySelector('.acto').children[0].id
            //  console.log(id)
            postIconParams(activePost, param, coef, id)
        })
    })
}

async function postIconParams(activePost, param, coef, id) {
    // console.log(id)
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
    console.log(messaga.textContent)
    messaga.style.color = 'green'
    setTimeout(() => messaga.textContent = '', 3000)
    // console.log('параметр сохранен')
    iconFind(activePost)
}


export async function iconFind(activePost) {
    const changeParams = document.querySelector('.changeParams')
    const card = document.querySelectorAll('.cardClick')
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
                    if (elem.children[0].id === it.icons) {
                        console.log(elem.children[0])
                        console.log(elem.children[1])
                        console.log(elem)
                        const odometr = addZero(8, (el.value * it.coef).toFixed(0))
                        elem.children[1].textContent = odometr + otmet(it.icons)
                        elem.addEventListener('click', () => {
                            console.log(changeParams)
                            changeParams.value = it.coef
                        })
                    }
                })
            }
        })
    })
}

function otmet(arg) {
    if (arg === 'icon_speed')
        return 'км'
    if (arg === 'icon_oil')
        return 'л'

}
export const convert = (ob) => {
    const uniq = new Set(ob.map(e => JSON.stringify(e)));
    return Array.from(uniq).map(e => JSON.parse(e));
}



export function iconParamszWindows() {
    console.log('работаем')
    const active = document.querySelector('.color')
    const activePost = active.textContent.replace(/\s+/g, '')
    const changeParams = document.querySelector('.changeParams')
    const actoStatic = document.querySelector('.actoStatic')
    const msg = document.querySelectorAll('.msg')
    console.log(actoStatic)
    msg.forEach(el => {
        el.addEventListener('click', () => {
            const arrSpreed = [...el.textContent]
            let value;
            let param;
            arrSpreed.forEach(el => {
                if (el === ':') {
                    value = (arrSpreed.splice(arrSpreed.indexOf(el) + 1, arrSpreed.length - 1).join('') * changeParams.value).toFixed(2)
                    // console.log(value)
                }
            })
            arrSpreed.forEach(el => {
                if (el === ':') {
                    param = arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join('')
                }
            })
            //  console.log(param)
            //  const odometr = addZero(8, value)
            // probegValue.textContent = odometr + 'км'
            // console.log(actoStatic)
            const coef = changeParams.value
            actoStatic.textContent = value
            const nameInput = document.querySelector('.actoStatic').previousElementSibling.value
            const id = document.querySelector('.actoStatic').id

            //   console.log(id)
            postIconParamsWindow(activePost, param, coef, nameInput, id)
        })
    })

}

async function postIconParamsWindow(activePost, param, coef, nameInput, id) {
    //console.log(id)
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
    console.log(messaga.textContent)
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
                            // console.log(changeParams)
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
    console.log('проверка')
    const nameStatic = document.querySelectorAll('.nameStatic')
    nameStatic.forEach(e => {
        console.log(e.value)
        if (e.value === '') {
            console.log('пустая')


        }
        else {
            console.log('не пустая')
            console.log(e.closest('.itemStatic').children[2])
            e.closest('.itemStatic').children[2].style.display = 'block'
            //  console.log(e.closest('.itemStatic').children[2].style.background = 'white')
        }

        // e.value === '' ? (console.log(e.value), e.closest('.itemStatic').children[2].style.display = 'none') : null
    })

}