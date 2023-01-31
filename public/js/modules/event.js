import { postTyres, reqDelete, paramsDelete } from './requests.js'
import { alarmClear } from './visual.js'

export function saveTyres(arr) {
    const btnSave = document.querySelector('.btn_save')
    btnSave.addEventListener('click', () => {
        postTyres(arr);
        arr.length = 0;
    })

}
//очистка модели из базы и удаление отрисовки
export const btnClear = document.querySelector('.btn_clear')
btnClear.addEventListener('click', () => {
    const active = document.querySelectorAll('.color')
    console.log(active)
    const activePost = active[0].textContent.replace(/\s+/g, '')
    console.log('запуск')
    alarmClear()
    reqDelete(activePost);
    paramsDelete(activePost);
})

const detaly = document.querySelector('.detaly')
detaly.addEventListener('click', () => {
    const wrapperUp = document.querySelector('.wrapper_up')
    const speedGraf = document.querySelector('.speedGraf')
    const wrapperRight = document.querySelector('.wrapper_right')
    wrapperUp.style.display = 'none'
    wrapperRight.style.display = 'none'
    speedGraf.style.display = 'none'
    const detalisation = document.querySelector('.detalisation')
    detalisation.style.display = 'flex'
})