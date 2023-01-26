
'use strict'
import { foreachArr, checked, init, liCreate, sensor, alarmMin, alarmMax, alertCreate } from './modules/func.js'
import { map } from './modules/osm.js'

import { reqDelete, loadModel, postModel, paramsDelete, geoPosition } from './modules/requests.js'
import { graf } from './modules/wialon.js'

//const alarmMax = document.querySelector('.div_max')
//const alarmMin = document.querySelector('.div_min')
//const info = document.querySelector('.info')
const linkSelect = document.querySelectorAll('.linkSelect');
const centerOs = document.querySelectorAll('.centerOs');
const moduleConfig = document.querySelector('.moduleConfig')
const tiresLink = document.querySelectorAll('.tires_link')
const linkSelectOs = document.querySelectorAll('.linkSelectOs')
const linkSelectTires = document.querySelectorAll('.linkSelectTires')
const wrapperButton = document.querySelector('.wrapper_button')
const tiresD = document.querySelectorAll('.tiresD')
const btnsens = document.querySelectorAll('.btnsens')
const titleSens = document.querySelector('.title_sens')
const obo = document.querySelector('.obo')
const osi = document.querySelectorAll('.osi')
const speedGraf = document.querySelector('.speedGraf')
const car = document.querySelector('.title_two')
const inputDate = document.querySelectorAll('.input_date')
const selectSpeed = document.querySelector('.select_speed')
const btnClear = document.querySelector('.btn_clear')
const btnSave = document.querySelector('.btn_save')
const job = document.querySelector('.job')
const tyres = document.querySelectorAll('.tires')
const place = document.querySelectorAll('.place')

console.log(tiresD)



//setTimeout(geoPosition, 3000)
geoPosition();
//создание дива для аларма
alertCreate();

//валидация токена на wialon
init();
//запрос в базу и получение параметров датчиков
//загрузка текущей модели конфигуратора из базы
loadModel();
setInterval(loadModel, 5000)
//очистка модели из базы и удаление отрисовки
btnClear.addEventListener('click', reqDelete)
btnClear.addEventListener('click', paramsDelete)
//обработка выбора графика скорости за интервал
//checked()
//управление графиком скорости

const btnForm = document.querySelectorAll('.btm_form')
//const inputDate = document.querySelectorAll('.input_date')
const grafView = document.querySelector('.grafik1')
//const selectSpeed = document.querySelector('.select_speed')


speed(btnForm, inputDate, grafView, selectSpeed)
//генерация списка под параметры датчиков с базы
liCreate()



export function speed(btnForm, inputDate, grafView, selectSpeed) {

    console.log(btnForm)
    btnForm.forEach(el =>
        el.addEventListener('click', () => {
            if (el.textContent === 'Выполнить' && inputDate[0].value !== '' && inputDate[1].value !== '') {
                grafView.style.display = 'block'
                dataInput()
                // dataInput2()
            }
            if (el.textContent === 'Выполнить' && inputDate[0].value == '' && inputDate[1].value == '') {
                grafView.style.display = 'block'
                dataSelect()
                //  dataSelect2()
            }
            if (el.textContent === 'Очистить') {
                selectSpeed.value = 0;
                inputDate.forEach(e => {
                    e.value = ''
                    //  console.log('очистил')
                    grafView.style.display = 'none'
                })
            }
        }))
}




export function dataInput() {
    selectSpeed.value = 0;
    const arrDate = [];
    inputDate.forEach(e => {
        arrDate.push(e.value)
    })
    let t01 = new Date(arrDate[0])
    let timeFrom = Math.floor(t01.setHours(t01.getHours()) / 1000)
    let t02 = new Date(arrDate[1])
    let nowDate = Math.floor(t02.setHours(t02.getHours()) / 1000)
    graf(timeFrom, nowDate, 30, 25766831)
}

let nowDate = Math.round(new Date().getTime() / 1000)
let nDate = new Date();
export function dataSelect() {
    switch (selectSpeed.value) {
        case '1': {
            let timeFrom = Math.round(nDate.setHours(nDate.getHours() - 24) / 1000);
            graf(timeFrom, nowDate, 30, 25766831)
        }
            break;
        case '2': {
            let timeFrom = Math.round(nDate.setDate(nDate.getDate() - 7) / 1000);
            graf(timeFrom, nowDate, 100, 25766831)
        }
            break;
        case '3': {
            let timeFrom = Math.round(nDate.setMonth(nDate.getMonth() - 1) / 1000);
            graf(timeFrom, nowDate, 300, 25766831)
        }
            break;
    }
}

car.addEventListener('click', () => {
    console.log('нажал на машину')
    speedGraf.style.display = 'block';
    obo.style.display = 'none'
    titleSens.style.display = 'none'
    wrapperButton.style.display = 'none'
})

const array = [];
function modul() {
    centerOs.forEach(el => {
        el.addEventListener('click', () => {
            centerOs.forEach(el => el.classList.remove('os'));
            el.classList.add('os')
            moduleConfig.style.display = 'flex'
            array.push(el)
            console.log('нажал ось')
        })
    })
    os(array)
}
modul()

function os(arr) {
    const arrayTrailer = [];
    linkSelectOs.forEach(e =>
        e.addEventListener('click', () => {
            arrayTrailer.push(e)
            e.textContent == 'Прицеп' ?
                arr[arr.length - 1].style.backgroundImage = "url('../image/line_red.png')" :
                arr[arr.length - 1].style.backgroundImage = "url('../image/line_gray.png')"
        }))

    linkSelectTires.forEach(e =>
        e.addEventListener('click', () => {

            const arrayTyres = []
            arrayTyres.push(e)
            console.log(arrayTrailer)
            // console.log(arr[arr.length - 1])
            arr[arr.length - 1].previousElementSibling.children[0].style.display = 'none';
            arr[arr.length - 1].previousElementSibling.children[1].style.display = 'none';
            arr[arr.length - 1].nextElementSibling.children[0].style.display = 'none';
            arr[arr.length - 1].nextElementSibling.children[1].style.display = 'none';
            if (e.textContent == 2) {
                arr[arr.length - 1].previousElementSibling.children[0].style.display = 'flex';
                arr[arr.length - 1].nextElementSibling.children[1].style.display = 'flex';
            }
            if (e.textContent == 4) {
                arr[arr.length - 1].previousElementSibling.children[0].style.display = 'flex';
                arr[arr.length - 1].previousElementSibling.children[1].style.display = 'flex';
                arr[arr.length - 1].nextElementSibling.children[0].style.display = 'flex';
                arr[arr.length - 1].nextElementSibling.children[1].style.display = 'flex';
            }
            console.log('запуск saveBase')
            validation(arrayTrailer, arrayTyres)
        }))
}

const massiv = []
function validation(arrayTrailer, arrayTyres) {
    const osy = array[array.length - 1].id;
    const trailer = arrayTrailer.length ? arrayTrailer[arrayTrailer.length - 1].textContent : 'Тягач'
    const tyres = arrayTyres[arrayTyres.length - 1].textContent
    console.log(osy, trailer, tyres)
    const mass = [];
    mass.push(osy, trailer, tyres)
    //console.log(mass)
    massiv.push(mass)
    console.log(massiv)
}

btnSave.addEventListener('click', () => {
    postModel(massiv)

})

function select() {
    linkSelect.forEach(el =>
        el.addEventListener('click', () => {
            console.log('нажал конфиг')
            moduleConfig.style.display = 'none'
            osi.forEach(it =>
                it.style.display = 'none')
            switch (el.textContent) {
                case '1':
                    foreachArr(osi, centerOs, 1)
                    break;
                case '2':
                    foreachArr(osi, centerOs, 2)
                    break;
                case '3':
                    foreachArr(osi, centerOs, 3)
                    break;
                case '4':
                    foreachArr(osi, centerOs, 4)
                    break;
                case '5':
                    foreachArr(osi, centerOs, 5)
                    break;
                case '6':
                    foreachArr(osi, centerOs, 6)
                    break;
                case '7':
                    foreachArr(osi, centerOs, 7)
                    break;
                case '8':
                    foreachArr(osi, centerOs, 8)
                    break;
            }
        }))
}
select()


//let div = document.createElement('div');
//div.className = "alarm";
export function view(arr, params) {
    const alerts = [];
    console.log(alerts)
    //div.style.display = 'none';
    const tiresLink = document.querySelectorAll('.tires_link')
    const tiresD = document.querySelectorAll('.tiresD')
    console.log(arr)
    console.log(params)
    arr.forEach((el, index) => {
        msg[index].textContent = `${el.name}:${el.value}`
        let parapmsPress;

        parapmsPress = (el.value)
        //console.log(parapmsPress)
        params.forEach(item => {
            if (el.name == item.pressure) {
                tiresLink[item.tyresdiv - 1].children[0].textContent = parapmsPress
                //console.log(tiresLink[item.tyresdiv - 1].children[0].textContent)
                tiresLink[item.tyresdiv - 1].children[2].textContent = 'p:' + item.pressure + '\nt:' + item.temp
                alerts.push(tiresLink[item.tyresdiv - 1].children[0].textContent)
                //  console.log(tiresLink[item.tyresdiv - 1].children[0].textContent)
                // console.log(tiresLink[item.tyresdiv - 1].children[0])
                tiresLink[item.tyresdiv - 1].children[0].textContent = parapmsPress + '\nБар'

                tiresLink[item.tyresdiv - 1].children[0].style.background = objColor[generDav(parapmsPress)];
                if (parapmsPress < 6 || parapmsPress > 9.9) {
                    tiresLink[item.tyresdiv - 1].style.borderRadius = '15px'
                    tiresLink[item.tyresdiv - 1].style.border = '3px solid red'
                }
            }
            if (el.name == item.temp) {
                tiresLink[item.tyresdiv - 1].children[1].textContent = el.value + '°'
                tiresLink[item.tyresdiv - 1].children[1].style.background = objColor[generT(el.value)];
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
const msg = document.querySelectorAll('.msg')





const kolesos = [];
function fn() {
    tiresLink.forEach(e => {
        e.addEventListener('click', () => {
            kolesos.push(e)
            console.log(kolesos[kolesos.length - 1].id)

            speedGraf.style.display = 'none';
            sensor(btnsens, titleSens)
            tiresLink.forEach(e => {
                obo.style.display = 'none'
                titleSens.style.display = 'none'
                wrapperButton.style.display = 'none'
                const msg = document.querySelectorAll('.msg')
                msg.forEach(el => el.classList.remove('act'))
                //  console.log('убрали')
            });
            wrapperButton.style.display = 'flex';
            //  console.log('поставили')
            tiresLink.forEach(el => el.classList.remove('tiresActiv'));
            e.classList.add('tiresActiv')
            //console.log('нажал')

        })
    })
    koleso(kolesos)
}
fn()
function koleso(kol) {
    const paramPress = [];
    const paramTemp = [];
    let prmsD = [];
    let prmsT = [];
    msg.forEach(el => {
        el.addEventListener('click', () => {
            const arrSpreed = [...el.textContent]
            let value;
            arrSpreed.forEach(el => {
                if (el === ':') {
                    value = arrSpreed.splice(arrSpreed.indexOf(el) + 1, arrSpreed.length - 1).join('')
                }
            })
            if (btnsens[0].classList.contains('actBTN')) {
                arrSpreed.forEach(el => {
                    if (el === ':') {
                        prmsD.push(arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join(''))
                    }
                })
                console.log(job.value)
                const valJob = (job.value.length == 0) ? value : value * job.value
                valJob.length > 10 ?
                    kol[kol.length - 1].children[0].textContent = '-' :
                    kol[kol.length - 1].children[0].textContent = value + '\nБар'
                kol[kol.length - 1].children[0].style.background = objColor[generDav(value)];
                paramPress.push(el)
                console.log(paramPress)
            }
            if (btnsens[1].classList.contains('actBTN')) {
                arrSpreed.forEach(el => {
                    if (el === ':') {
                        prmsT.push(arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join(''))
                    }
                })
                value.length > 10 ?
                    kol[kol.length - 1].children[1].textContent = '-' :
                    kol[kol.length - 1].children[1].textContent = value + '°'
                kol[kol.length - 1].children[1].style.background = objColor[generT(value)];
                paramTemp.push(el)
                console.log(paramTemp)
                valid(paramPress, paramTemp)
            }
            kol[kol.length - 1].children[2].textContent = 'p:' + prmsD[prmsD.length - 1] + '\nt:' + prmsT[prmsT.length - 1]
            console.log(kol[kol.length - 1].children[2].textContent)
        })
    })
}


const massivion = [];
function valid(paramPress, paramTemp) {
    const massivionbd = [];
    const kol = kolesos[kolesos.length - 1];
    const kolId = kolesos[kolesos.length - 1].id;
    console.log(kolId)
    const dav = paramPress[paramPress.length - 1]
    const temp = paramTemp[paramTemp.length - 1]

    const arrSpreed1 = [...dav.textContent]
    let value;
    arrSpreed1.forEach(el => {
        if (el === ':') {
            value = arrSpreed1.splice(arrSpreed1[0] + 1, arrSpreed1.indexOf(el)).join('')
        }
    })
    console.log(value)
    const arrSpreed2 = [...temp.textContent]
    let value2;
    arrSpreed2.forEach(el => {
        if (el === ':') {
            value2 = arrSpreed2.splice(arrSpreed2[0] + 1, arrSpreed2.indexOf(el)).join('')
        }
    })
    console.log(value2)
    const mass = [];
    mass.push(kol, dav, temp)
    console.log(mass)
    const massbd = [];
    massbd.push(kolId, value, value2)
    console.log(massbd)
    //console.log(mass)
    massivion.push(mass)
    massivionbd.push(massbd)
    console.log(massivion)
    console.log(massivionbd)
    btnSave.addEventListener('click', () => {
        postTyres(massivionbd);
    })
    //postTyres(massivionbd);
    // views(massivion)
    //setInterval(() => views(massivion), 15000)
}


function postTyres(arr) {
    fetch('api/tyres', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(arr),
    })
        .then((res) => res.json())
        .then(res => console.log(res))



}

/*
const views = (arr) => {
    console.log('итерация')
    console.log(arr)
    arr.forEach(el => {
        const arrSpreed = [...el[1].textContent]
        //console.log(arrSpreed)
        let value;
        arrSpreed.forEach(el => {
            if (el === ':') {
                value = arrSpreed.splice(arrSpreed.indexOf(el) + 1, arrSpreed.length - 1).join('')
            }
        })
        //console.log(value)
        const arrSpreed2 = [...el[2].textContent]
        //console.log(arrSpreed2)
        let value2;
        arrSpreed2.forEach(el => {
            if (el === ':') {
                value2 = arrSpreed2.splice(arrSpreed2.indexOf(el) + 1, arrSpreed2.length - 1).join('')
            }
        })
        // console.log(value2)
        console.log(el[0])
        console.log('втораые данные')
        el[0].children[0].textContent = (value * job.value).toFixed(1) + '\nБар'
        el[0].children[1].textContent = value2 + '°'
        console.log(el[0].children[0].textContent, el[0].children[1].textContent)
    })
}
*/
//условия для подсветки шин D и T


function generDav(el) {
    //  modulAlarm();
    let generatedValue;
    if (el >= 10) {
        generatedValue = 1;

    }
    if (el <= 5.9) {
        generatedValue = 1;
    }
    else {
        generatedValue = 3;
    }
    return generatedValue;
};




function generFront(el) {
    let generatedValue;
    if (el >= 8 && el <= 9) {
        generatedValue = 3;
        //  console.log('al')
        //  div.style.display = 'none';
    }
    if (el >= 7.5 && el < 8 || el > 9 && el <= 13) {
        generatedValue = 2;
        //  console.log('al')
        //  div.style.display = 'none';
    }
    if (el > -100 && el < 7.5 || el > 13) {
        generatedValue = 1;
        // console.log('noal')
        // alarm()
    }
    return generatedValue;
};

function generT(el) {
    let generatedValue;
    if (el >= -50 && el <= 35)
        generatedValue = 4;
    if (el > 36)
        generatedValue = 1;

    return generatedValue;
};
//создаем объект где ключ-результат условия, а свойства - соответсующее условию значение
const objColor = {
    1: '#e03636',
    2: '#9ba805',
    3: '#3eb051',
}


const menu = document.querySelectorAll('.car_item')
menu.forEach(el => {
    el.addEventListener('click', menuBtn)
    function menuBtn() {
        menu.forEach(el => {
            el.style.backgroundColor = '#fff'
        })
        el.style.backgroundColor = 'lightgray'
    }
})