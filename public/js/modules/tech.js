import { viewTech } from './requests.js'

export function tech() {
    const formValue = document.querySelectorAll('.formValue')
    const job = document.querySelectorAll('.job')
    console.log(formValue)
    formValue.forEach(i => {
        i.value = ''
    })
    job.forEach(i => i.textContent = '')
    const inputPSI = document.querySelector('.jobDav')
    const inputBar = document.querySelector('.bar')
    const techInfo = document.querySelector('.techInfo')
    techInfo.style.display = 'block'
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
    })
    const tyresActive = document.querySelector('.tiresActiv')
    viewTech(tyresActive.id);
}


