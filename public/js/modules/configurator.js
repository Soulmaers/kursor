import { text } from './content.js'
import { viewMenuParams } from './paramsTyresView.js'
import { pricep } from './visual.js'
import { zapros } from './menu.js'
import { removeArrElem } from './helpersFunc.js'

//конфигуратор оси
export function select() {
    const linkSelect = document.querySelectorAll('.linkSelect');
    const wrapContaint = document.querySelector('.wrapper_containt')
    const cont = document.createElement('div')
    cont.classList.add('container')
    wrapContaint.insertBefore(cont, wrapContaint.children[2]);
    const container = document.querySelector('.container')
    linkSelect.forEach(el => {
        el.addEventListener('click', () => {
            linkSelect.forEach(e => {
                if (cont.childNodes.length > 0) {
                    removeArrElem(cont.childNodes)
                }
            })
            const count = el.textContent;
            for (let i = 0; i < count; i++) {
                container.innerHTML += `${text}`
            }
            const osi = document.querySelectorAll('.osi')
            let index = 0;
            osi.forEach(el => {
                el.style.display = 'flex'
                index++
                const centerOsDiv = document.createElement('div');
                centerOsDiv.classList.add('centerOs')
                const vnut = document.createElement('div')
                vnut.classList.add('vnut')
                centerOsDiv.appendChild(vnut)
                el.children[0].insertAdjacentElement('afterEnd', centerOsDiv);
                centerOsDiv.setAttribute("id", `${index}`);
            })
            const tires = document.querySelectorAll('.tires')
            let indexTires = 0;
            tires.forEach(el => {
                indexTires++
                const link = document.createElement('a');
                link.classList.add('tires_link')
                link.setAttribute("id", `${indexTires}`);
                el.appendChild(link);
                const tiresD = document.createElement('div');
                tiresD.classList.add('tiresD')
                const tiresT = document.createElement('div');
                tiresT.classList.add('tiresT')
                const place = document.createElement('div');
                place.classList.add('place')
                link.appendChild(tiresD);
                link.appendChild(tiresT);
                link.appendChild(place);
            })
            modul() //запоминаем последнюю выбранную ось
        })
    })
}
select() //запуск конфигуратора оси

const lostOs = [];
function modul() {
    const centerOs = document.querySelectorAll('.centerOs')
    const moduleConfig = document.querySelector('.moduleConfig')
    const saveId = document.querySelector('.saveId')
    centerOs.forEach(el => {
        el.addEventListener('click', () => {
            centerOs.forEach(el => el.classList.remove('os'));
            el.classList.add('os')
            moduleConfig.style.display = 'flex'
            saveId.style.marginBottom = '30px'
            lostOs.push(el)
        })
    })
    os(lostOs)
}

function os(arr) {
    const cont2 = document.createElement('div');
    const container = document.querySelector('.container')
    cont2.classList.add('cont')
    container.appendChild(cont2)
    const arrayTrailer = [];
    const linkSelectOs = document.querySelectorAll('.linkSelectOs')
    const linkSelectTires = document.querySelectorAll('.linkSelectTires')
    linkSelectOs.forEach(e =>
        e.addEventListener('click', () => {
            arrayTrailer.push(e)
            e.textContent == 'Прицеп' ?
                pricep(arr[arr.length - 1])
                :
                (arr[arr.length - 1].children[0].style.background = '#fff',//#3333ff'
                    arr[arr.length - 1].classList.add('tagach'))

            const centerOs = document.querySelectorAll('.centerOs')
            centerOs.forEach(el => {
                if (el.classList.contains('pricep')) {
                    const cont = document.querySelector('.cont')
                    console.log(cont.lastElementChild.children[1])
                    const gosNumber = document.querySelector('.gosNumber')
                    if (!gosNumber) {
                        const gosNumber = document.createElement('input')
                        gosNumber.classList.add('gosNumber')
                        gosNumber.setAttribute('placeholder', 'гос. номер прицепа')
                        cont.lastElementChild.children[1].appendChild(gosNumber)
                        cont.lastElementChild.children[1].style.position = 'relative'
                        gosNumber.style.display = 'flex'
                    }

                }
                if (el.classList.contains('tagach')) {
                    const gosNumberCar = document.createElement('input')
                    gosNumberCar.classList.add('gosNumberCar')
                    gosNumberCar.setAttribute('placeholder', 'гос. номер')
                    container.firstElementChild.children[1].prepend(gosNumberCar)
                    container.firstElementChild.children[1].style.position = 'relative'
                }
            })
        }))
    linkSelectTires.forEach(e =>
        e.addEventListener('click', () => {
            const arrayTyres = []
            arrayTyres.push(e)
            arr[arr.length - 1].previousElementSibling.children[0].style.display = 'none';
            arr[arr.length - 1].previousElementSibling.children[1].style.display = 'none';
            arr[arr.length - 1].nextElementSibling.children[0].style.display = 'none';
            arr[arr.length - 1].nextElementSibling.children[1].style.display = 'none';
            if (e.textContent == 2) {
                arr[arr.length - 1].children[0].style.width = '204px'
                arr[arr.length - 1].previousElementSibling.children[0].style.display = 'flex';
                arr[arr.length - 1].nextElementSibling.children[1].style.display = 'flex';
            }
            if (e.textContent == 4) {
                arr[arr.length - 1].children[0].style.width = '98px'
                arr[arr.length - 1].previousElementSibling.children[0].style.display = 'flex';
                arr[arr.length - 1].previousElementSibling.children[1].style.display = 'flex';
                arr[arr.length - 1].nextElementSibling.children[0].style.display = 'flex';
                arr[arr.length - 1].nextElementSibling.children[1].style.display = 'flex';
            }
        }))
    viewMenuParams()
}

export async function changeBase(massModel, activePost, idw) {
    const go = document.querySelector('.gosNumber')
    let gosp;
    if (go) {
        gosp = (document.querySelector('.gosNumber')).value
    }
    else {
        gosp = ''
    }
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ massModel, idw, activePost, gosp }))
    }
    const res = await fetch('/api/updateModel', param)
    const response = await res.json()
    const controll = document.querySelector('.container_left')
    controll.style.display = 'none'
    const modalCenterOs = document.querySelector('.modalCenterOs')
    modalCenterOs.style.display = 'none'
    const moduleConfig = document.querySelector('.moduleConfig')
    moduleConfig.style.display = 'none';
    zapros();
}


