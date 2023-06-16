
import { init } from './modules/menu.js'
import { btnDel } from './modules/event.js'
import { liCreate } from './modules/visual.js'

let kluch;
const role = document.querySelectorAll('.log')[0].textContent
const login = document.querySelectorAll('.log')[1].textContent
const radioVal = document.querySelector('.radioVal')
const nameStatic = document.querySelectorAll('.nameStatic')

if (login !== 'TDRMX' || login !== 'Ромакс') {
    kluch = '0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178'
    if (role !== 'Пользователь') {
        init(kluch);
        btnDel();
    }
    else {
        init(kluch);
    }
}
if (login === 'TDRMX' || login === 'Ромакс') {
    radioVal.style.marginTop = '10px'
    radioVal.style.marginLeft = '10px'
    radioVal.style.justifyContent = 'start'
    kluch = '7d21706dbf99ed8dd9257b8b1fcc5ab3FDEAE2E1E11A17F978AC054411BB0A0CBD9051B3'
    init(kluch);
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
liCreate()
console.log(screen.width)

if (screen.width === 1366 && screen.height === 768) {
    document.body.style.maxWidth = '1366px';
    document.body.style.height = '768px';
} else if (screen.width === 1920 && screen.height === 1080) {
    document.body.style.maxWidth = '1920px';
    document.body.style.height = '1080px';
}




