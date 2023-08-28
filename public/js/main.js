
import { zapros } from './modules/menu.js'
import { btnDel } from './modules/event.js'
import { liCreate } from './modules/visual.js'

let kluch;
const role = document.querySelectorAll('.log')[0].textContent
const login = document.querySelectorAll('.log')[1].textContent
const radioVal = document.querySelector('.radioVal')
const nameStatic = document.querySelectorAll('.nameStatic')

if (login !== 'TDRMX' || login !== 'Ромакс') {
    //  kluch = '0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178'
    if (role !== 'Пользователь') {
        btnDel();
    }
}
if (login === 'TDRMX' || login === 'Ромакс') {
    radioVal.style.marginTop = '10px'
    radioVal.style.marginLeft = '10px'
    radioVal.style.justifyContent = 'start'
    radioVal.style.display = 'none'
}
role === 'Пользователь' ? dis(nameStatic) : null
function dis(one) {
    const chekAlt = document.querySelector('.checkAlt')
    chekAlt.style.display = 'none';
    const delIcon = document.querySelectorAll('.delIcon')
    delIcon.forEach(e => {
        e.style.display = 'none';
    })
    one.forEach(el => {
        el.disabled = true
    });


}
const params = {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
    },
    body: (JSON.stringify({ login }))

}
const mods = await fetch('/getData', params)
const models = await mods.json()
console.log(models)



const param = {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
    },
    body: (JSON.stringify({ login }))

}

/*
const res = await fetch('/api/viewLogs', param)
const confirm = await res.json()
console.log(confirm)*/


zapros(login) //делаем запрос на wialon получаем объекты
liCreate()
console.log(screen.width)
console.log(screen.height)

if (screen.width === 1366 && screen.height === 768) {
    // document.body.style.maxWidth = '1366px';
    document.body.style.height = '768px';
} else if (screen.width === 1920 && screen.height === 1080) {
    // document.body.style.maxWidth = '1920px';
    document.body.style.height = '1080px';
}

async function waitAndExecute() {
    const preloader = document.querySelector('.preloader');
    preloader.classList.add('preloader_hidden');

    // Другой код, который должен выполниться после завершения работы функции zaprosSpisok
}

function waitForDOMLoad() {
    return new Promise((resolve) => {
        document.addEventListener('DOMContentLoaded', resolve);
    });
}

async function init() {
    await waitForDOMLoad(); // Ожидаем загрузку всего DOM
    waitAndExecute(); // Запускаем функцию после загрузки DOM
}

init();


