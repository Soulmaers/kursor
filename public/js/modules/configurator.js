import { text } from './content.js'
import { viewMenuParams } from './paramsTyresView.js'
import { postModel } from './requests.js'
import { pricep } from './visual.js'


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
    centerOs.forEach(el => {
        el.addEventListener('click', () => {
            centerOs.forEach(el => el.classList.remove('os'));
            el.classList.add('os')
            moduleConfig.style.display = 'flex'
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
    //const arrPricep = [];
    const linkSelectOs = document.querySelectorAll('.linkSelectOs')
    const linkSelectTires = document.querySelectorAll('.linkSelectTires')

    linkSelectOs.forEach(e =>
        e.addEventListener('click', () => {
            arrayTrailer.push(e)

            e.textContent == 'Прицеп' ?
                pricep(arr[arr.length - 1])
                :
                arr[arr.length - 1].children[0].style.background = '#3333ff'
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
                arr[arr.length - 1].children[0].style.width = '150px'
                arr[arr.length - 1].previousElementSibling.children[0].style.display = 'flex';
                arr[arr.length - 1].nextElementSibling.children[1].style.display = 'flex';
            }
            if (e.textContent == 4) {
                arr[arr.length - 1].children[0].style.width = '74px'
                arr[arr.length - 1].previousElementSibling.children[0].style.display = 'flex';
                arr[arr.length - 1].previousElementSibling.children[1].style.display = 'flex';
                arr[arr.length - 1].nextElementSibling.children[0].style.display = 'flex';
                arr[arr.length - 1].nextElementSibling.children[1].style.display = 'flex';
            }

            validation(arrayTrailer, arrayTyres)

        }))
    viewMenuParams() //запускаем функцию отображения кнопок под параметры+сохраняем в массив последнее выбранное колесо+ скрываем див с графиком скорости
}




export const massiv = []
function validation(arrayTrailer, arrayTyres) {
    const osy = lostOs[lostOs.length - 1].id;
    const trailer = arrayTrailer.length ? arrayTrailer[arrayTrailer.length - 1].textContent : 'Тягач'
    const tyres = arrayTyres[arrayTyres.length - 1].textContent
    const mass = [];
    mass.push(osy, trailer, tyres)
    massiv.push(mass)
    console.log(massiv)
    const btnSave = document.querySelector('.btn_save')
    btnSave.addEventListener('click', () => {
        postModel(massiv) //передаем модель и отправляем запрос на сервер в базу
        massiv.length = 0;

    })
}



