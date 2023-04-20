import { text } from './content.js'
import { viewMenuParams, loadParamsView } from './paramsTyresView.js'
import { postModel, postTyres, paramsDelete } from './requests.js'
import { pricep, viewOs } from './visual.js'
import { zapros } from './menu.js'
import { fnsort } from './event.js'


//viewMenuParams()
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
                    console.log('удаление')
                    cont.childNodes.forEach(it => {
                        it.remove();
                    })
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
            console.log(tires)
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
                arr[arr.length - 1].children[0].style.background = '#000'//#3333ff'


            const centerOs = document.querySelectorAll('.centerOs')
            const gosNumber = document.querySelector('.gosNumber')

            centerOs.forEach(el => {

                if (el.classList.contains('pricep')) {
                    console.log(el)
                    gosNumber.style.display = 'flex'
                    return
                }
                gosNumber.style.display = 'none'
            })
        }))
    linkSelectTires.forEach(e =>
        e.addEventListener('click', () => {
            const arrayTyres = []
            arrayTyres.push(e)
            console.log(arrayTyres)
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
    //запускаем функцию отображения кнопок под параметры+сохраняем в массив последнее выбранное колесо+ скрываем див с графиком скорости


}



export async function changeBase(massModel, activePost) {
    console.log('работаем колесо')
    const gosp = (document.querySelector('.gosNumber')).value
    console.log(document.querySelector('.gosNumber'))
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ massModel, activePost, gosp }))
    }
    console.log('запускаем пост')
    const res = await fetch('/api/updateModel', param)
    console.log(res)
    const response = await res.json()
    console.log(response)
    const controll = document.querySelector('.container_left')
    controll.style.display = 'none'
    const modalCenterOs = document.querySelector('.modalCenterOs')
    modalCenterOs.style.display = 'none'
    const moduleConfig = document.querySelector('.moduleConfig')
    moduleConfig.style.display = 'none';
    // loadParamsView();
    zapros();
}


