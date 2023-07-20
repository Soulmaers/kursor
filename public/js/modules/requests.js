import { loadParamsView } from './paramsTyresView.js'

const login = document.querySelectorAll('.log')[1].textContent
export function postTyres(tyres) {
    console.log('ченчбэйстайрес')
    console.log(tyres)
    const active = document.querySelectorAll('.color')
    const activePost = active[0].textContent.replace(/\s+/g, '')
    const name = active[0].textContent.replace(/\s+/g, '')
    const idw = document.querySelector('.color').id
    fetch('/api/tyres', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tyres, activePost, idw }),
    })
        .then((res) => res.json())
        .then(res => console.log(res))
    const messaga = document.querySelector('.messageId')
    messaga.textContent = 'Датчики добавлены'
    messaga.style.color = 'green'
    setTimeout(() => messaga.textContent = '', 2000)
}

export const reqDelete = async (idw) => {
    fetch('/api/delete', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idw }),
    })
        .then((res) => res.json())
        .then((res) => console.log(res))
    const containerAlt = document.querySelector('.containerAlt')
    if (containerAlt) {
        containerAlt.remove();
    }
    const messaga = document.querySelector('.messageId')
    messaga.textContent = 'Модель удалена'
    messaga.style.color = 'green'
    setTimeout(() => messaga.textContent = '', 2000)

}
export const barDelete = async (idw) => {
    const modalCenterOs = document.querySelector('.modalCenterOs')
    modalCenterOs.style.display = 'none'
    const complete = await fetch('/api/barDelete', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idw }),
    })
    const result = await complete.json()
    console.log(result)
}
export const paramsDelete = async (idw) => {
    fetch('/api/paramsDelete', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idw }),
    })
        .then((res) => res.json())
        .then((res) => console.log(res))
    const tyresD = document.querySelectorAll('.tiresD')
    const tyresT = document.querySelectorAll('.tiresT')
    tyresD.forEach(e => {
        e.textContent = ''
        e.style.background = '#fff'
    })
    tyresT.forEach(e => {
        e.textContent = ''
        e.style.background = '#fff'
    })
}

export async function reqModalBar(arr, id) {
    let activePost;
    const active = document.querySelectorAll('.color')
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.link_menu')[0]
        activePost = listItem.textContent.replace(/\s+/g, '')
    }
    else {
        activePost = active[0].textContent.replace(/\s+/g, '')
    }
    const idw = document.querySelector('.color').id
    const arrValue = [];
    const divFinal = document.querySelectorAll('.divfinal')
    const normal = document.querySelector('.normal')
    arrValue.push(idw)
    arrValue.push(activePost)
    arrValue.push(id)
    arrValue.push(normal.value)
    divFinal.forEach(el => {
        arrValue.push(el.textContent)
    })

    console.log(arrValue)
    const bar = await fetch('/api/modalBar', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, arr, arrValue, idw }),
    })
    const result = await bar.json();
    console.log(result)
}
export async function viewBar(id) {
    console.log(id)
    let activePost;
    const active = document.querySelectorAll('.color')
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.link_menu')[0]
        activePost = listItem.textContent.replace(/\s+/g, '')
    }
    else {
        activePost = active[0].textContent.replace(/\s+/g, '')
    }
    const idw = document.querySelector('.color').id
    const bar = await fetch('/api/barView', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, activePost, idw })
    })
    const barValue = await bar.json();
    console.log(barValue)
    const keys = [];
    if (barValue.result.length) {
        for (let key in barValue.result[0]) {
            keys.push(key);
        }

        const nval = (Object.entries(barValue.result[0]))
        console.log(nval)
        nval.shift()
        nval.shift()
        nval.shift()
        nval.shift()
        const divfinal = document.querySelectorAll('.divfinal')
        const inpfinal = document.querySelectorAll('.inpfinal')
        const normal = document.querySelector('.normal')
        normal.value = nval[0][1]
        nval.shift()
        divfinal.forEach((el, index) => {
            el.textContent = nval[index][1]
            inpfinal[index].value = ((parseFloat(el.textContent * 100) / normal.value)).toFixed(2)
        })
    }
}




import { zapros } from './menu.js'

//конфигуратор оси
export async function changeBase(massModel, activePost, idw, type, go, go1, goCar, goCar1) {
    // const containerAlt = document.querySelector('.containerAlt')
    //  containerAlt.remove()
    const tsiControll = document.querySelector('.tsiControll').value
    console.log(tsiControll)
    console.log('ченчбэйс')
    console.log(massModel)
    massModel.length !== 0 ? massModel : massModel.push(['-', '-', '-'])
    await reqDelete(idw);
    let gosp;
    let frontGosp;
    let gosp1;
    let frontGosp1;
    go ? gosp = go.value : gosp = ''
    goCar ? frontGosp = goCar.value : frontGosp = ''
    go1 ? gosp1 = go1.value : gosp1 = ''
    goCar1 ? frontGosp1 = goCar1.value : frontGosp1 = ''
    console.log(gosp, gosp1, frontGosp, frontGosp1)
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ massModel, idw, activePost, gosp, gosp1, frontGosp, frontGosp1, type, tsiControll }))
    }
    const res = await fetch('/api/updateModel', param)
    const response = await res.json()
    const controll = document.querySelector('.container_left')
    controll.style.display = 'none'
    const modalCenterOs = document.querySelector('.modalCenterOs')
    modalCenterOs.style.display = 'none'
    console.log(response)
    const par = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ idw }))
    }
    const zapuskUp = await fetch('/api/up', par)
    console.log(zapuskUp)
    zapros(login);

}


