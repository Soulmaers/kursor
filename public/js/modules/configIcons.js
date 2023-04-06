

function addZero(digits_length, source) {
    let text = source + '';
    while (text.length < digits_length)
        text = '0' + text;
    return text;
}

export function iconParamsz() {
    console.log('работаем')
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
                    console.log(value)
                }
            })
            arrSpreed.forEach(el => {
                if (el === ':') {
                    param = arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join('')
                }
            })
            console.log(param)
            const odometr = addZero(8, value)
            probegValue.textContent = odometr + 'км'
            console.log(probegValue.textContent)
            const coef = changeParams.value
            postIconParams(activePost, param, coef)
        })
    })
}

async function postIconParams(activePost, param, coef) {
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ activePost, param, coef }))
    }
    const par = await fetch('api/icon', params)
    const paramssy = await par.json()
    console.log('параметр сохранен')
    iconFind(activePost)
}
export async function iconFind(activePost) {
    console.log(activePost)
    console.log('ищем')
    const probegValue = document.querySelector('.probeg_value')
    const changeParams = document.querySelector('.changeParams')

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

    const val = paramssyFind.result[paramssyFind.result.length - 1].params

    console.log(val)
    console.log(arg)
    arg.values.forEach(el => {
        if (el.name === val) {
            const odometr = addZero(8, (el.value * paramssyFind.result[paramssyFind.result.length - 1].coef).toFixed(0))
            probegValue.textContent = odometr + 'км'
        }
    })
    // 
}

