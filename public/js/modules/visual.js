import { text } from './content.js'
import { objColor, generT, generFront, generDav } from './content.js'
import { viewMenuParams, loadParamsView } from './paramsTyresView.js'
//import { geoPosition } from './requests.js'
import { geoloc } from './wialon.js'


let start;
let time;
//let timeParams;
export function visual(el) {
    console.log(el)
    clearInterval(time)
    // clearInterval(timeParams)
    const wrapperUp = document.querySelector('.wrapper_up')
    const speedGraf = document.querySelector('.speedGraf')
    const wrapperRight = document.querySelector('.wrapper_right')
    const titleCar = document.querySelector('.title_two')
    const detalisation = document.querySelector('.detalisation')
    const btnsens = document.querySelectorAll('.btnsens')
    alarmClear();
    detalisation.style.display = 'none'
    wrapperUp.style.display = 'block'
    wrapperRight.style.display = 'flex'
    speedGraf.style.display = 'block'
    el.parentNode.classList.add('color')
    viewOs(); //отрисовываем оси для вставки данных с базы по модели и колесам конфигуратора
    titleCar.textContent = el.textContent
    loadParamsView()//запрос в базу и получение параметров
    //  setInterval(loadParamsView, 5000)
    btnsens.forEach(el => {
        el.classList.remove('actBTN')
    })
    if (!start || start !== el) {
        start = el;
        geoloc()
        time = setInterval(geoloc, 120000) //отрисовываем карту osm
        console.log(start)
        //  geoloc();
    }
}
export function visualNone(e) {
    const wrapperUp = document.querySelector('.wrapper_up')
    const speedGraf = document.querySelector('.speedGraf')
    const wrapperRight = document.querySelector('.wrapper_right')
    const obo = document.querySelector('.obo')
    const titleSens = document.querySelector('.title_sens')
    const moduleConfig = document.querySelector('.moduleConfig')
    const wrapperButton = document.querySelector('.wrapper_button')
    const container = document.querySelector('.container')
    const techInfo = document.querySelector('.techInfo')
    techInfo.style.display = 'none'
    wrapperUp.style.display = 'none'
    wrapperRight.style.display = 'none'
    speedGraf.style.display = 'none'
    obo.style.display = 'none'
    wrapperButton.style.display = 'none'
    titleSens.style.display = 'none'
    moduleConfig.style.display = 'none'
    e.parentNode.classList.remove('color')
    if (container.childNodes.length > 0) {
        console.log('удаление')
        container.childNodes.forEach(it => {
            it.remove();
        })
    }
}


//стираем выбранные значения графика скорости
export function clearGraf() {
    const selectSpeed = document.querySelector('.select_speed')
    const inputDate = document.querySelectorAll('.input_date')
    const grafView = document.querySelector('.grafik1')
    selectSpeed.value = 0;
    inputDate.forEach(e => {
        e.value = ''
        grafView.style.display = 'none'
    })
}



//создаем список под параметры
export function liCreate() {
    const obo = document.querySelector('.obo')
    const count = 97;
    for (let i = 0; i < count; i++) {
        let li = document.createElement('li');
        li.className = "msg";
        obo.append(li);
    }
}

//отрисовываем список под параметры
export function sensor(btnsens, titleSens, obo) {
    btnsens.forEach(e =>
        e.addEventListener('click', () => {
            btnsens.forEach(el => {
                obo.style.display = 'none';
                titleSens.style.display = 'none';
                el.classList.remove('actBTN')
            })
            e.classList.add('actBTN')
            obo.style.display = 'flex';
            titleSens.style.display = 'block';
        }))
}

export function view(arg) {
    const msg = document.querySelectorAll('.msg')
    arg.forEach((el, index) => {
        msg[index].textContent = `${el.name}:${el.value}`
    })
}
export function viewConfigurator(arg, params) {
    console.log(arg, params)
    const alerts = [];
    const tiresLink = document.querySelectorAll('.tires_link')
    //const tiresLinkId = document.getElementById('.tires_link')
    console.log(tiresLink[0].id)
    const active = document.querySelectorAll('.color')[0].textContent
    arg.forEach((el) => {
        let parapmsPress;
        parapmsPress = (el.value)
        let signal;
        params.forEach(item => {
            if (el.name == item.pressure) {
                tiresLink.forEach(e => {
                    if (e.id == item.tyresdiv) {
                        e.children[0].textContent = el.value
                        e.children[2].textContent = 'p:' + item.pressure + '\nt:' + item.temp
                        alerts.push(e.children[0].textContent)
                        e.children[0].textContent = parapmsPress + '\nБар'
                        if (active == 'КранГаличанин Р858ОР178') {
                            signal = objColor[generDav(parapmsPress)]
                        }
                        else {
                            signal = objColor[generFront(parapmsPress)]
                        }
                        e.children[0].style.background = signal;
                        if (parapmsPress < 6 || parapmsPress > 9.9) {
                            e.classList.add('alarmCheck')
                            // e.style.borderRadius = '15px'
                            //e.style.border = '3px solid red'
                        }
                    }
                    // console.log(elem)
                })
            }
            if (el.name == item.temp) {
                tiresLink.forEach(e => {
                    if (e.id == item.tyresdiv) {
                        //       console.log(el.value)
                        if (el.value === '-128' || el.value === '-51') {
                            el.value = 'err'
                            e.children[1].textContent = el.value
                            //  console.log(tiresLink[item.tyresdiv - 1].children[1].textContent)
                        }
                        if (el.value > -40 && el.value < 60) {
                            e.children[1].textContent = el.value + '°'
                            //  console.log(tiresLink[item.tyresdiv - 1].children[1].textContent)
                            e.children[1].style.background = objColor[generT(el.value)];
                        }
                    }
                })
            }
        })
        if (alerts.some(element => element < 6) == true) {
            alarmMin();
        }
        if (alerts.some(element => element > 9.9) == true) {
            alarmMax();
        }
    })
}

export function alertCreate() {
    let div = document.createElement('div');
    div.className = "alarm";
    const headerCar = document.querySelector('.header_car')
    headerCar.prepend(div);
}
alertCreate()




function alarmMin() {
    const div = document.querySelector('.alarm')
    div.style.display = 'block'
    const alarmMinn = document.querySelector('.dav_min')
    const info = document.querySelector('.info')
    alarmMinn.style.display = 'flex'
    info.style.display = 'flex'
}

export function alarmClear() {
    const div = document.querySelector('.alarm')
    div.style.display = 'none'
    const alarmMinn = document.querySelector('.dav_min')
    const info = document.querySelector('.info')
    alarmMinn.style.display = 'none'
    info.style.display = 'none'
    const alarmMaxx = document.querySelector('.dav_max')
    alarmMaxx.style.display = 'none'
}

function alarmMax() {
    const div = document.querySelector('.alarm')
    div.style.display = 'block'
    const alarmMaxx = document.querySelector('.dav_max')
    const info = document.querySelector('.info')
    alarmMaxx.style.display = 'flex'
    info.style.display = 'flex'
}


export function viewOs() {
    const container = document.querySelector('.container')
    if (container.childNodes.length > 0) {
        console.log('удаление')
        container.childNodes.forEach(it => {
            it.remove();
        })
    }
    else {
        const count = 8;
        for (let i = 0; i < count; i++) {
            container.innerHTML += `${text}`
        }
        const osi = document.querySelectorAll('.osi')
        let index = 0;
        osi.forEach(el => {
            index++
            const centerOsDiv = document.createElement('div');
            centerOsDiv.classList.add('centerOs')
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
            link.href = "#";
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
        osi.forEach(el => {
            el.style.display = 'none'
        })
        const cont2 = document.createElement('div');
        cont2.classList.add('cont')
        //  const container = document.querySelector('.container')
        container.appendChild(cont2)
    }
    //eventBtnTyres();
    viewMenuParams()
    //  const tiresLink = document.querySelectorAll('.tires_link')
    // console.log(tiresLink)
}


//обработка массива для скрытия осей и других элементов
export const divClear = (arr) => {

    if (arr.length > 0) {
        /*
        arr.forEach(e => {
            e.style.display = 'none';
        })*/
        arr.forEach(it => {
            it.remove();
        })
    }
    else {
        //  arr.style.display = 'none';
        arr.remove();
    }
}

export const pricep = (elem) => {
    const cont = document.querySelector('.cont')
    console.log(elem.parentNode)
    cont.prepend(elem.parentNode)
    cont.style.marginTop = '72px'
    elem.style.backgroundImage = "url('../image/line_gray.png')"
}