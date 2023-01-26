
'use strict'
import { init, foreachArr2, sensor2, liCreate2, alertCreate2 } from './modules/func2.js'
import { map } from './modules/osm.js'
import { loadModel2, postModel2, paramsDelete2, reqDelete2, geoPosition2 } from './modules/requests2.js'
import { graf } from './modules/wialon.js'



const linkSelect2 = document.querySelectorAll('.linkSelect');
const centerOs2 = document.querySelectorAll('.centerOs');
const moduleConfig2 = document.querySelector('.moduleConfig')
const tiresLink2 = document.querySelectorAll('.tires_link')
const linkSelectOs2 = document.querySelectorAll('.linkSelectOs')
const linkSelectTires2 = document.querySelectorAll('.linkSelectTires')
const wrapperButton2 = document.querySelector('.wrapper_button')

const btnsens2 = document.querySelectorAll('.btnsens')
const titleSens2 = document.querySelector('.title_sens')
const obo2 = document.querySelector('.obo')
const osi2 = document.querySelectorAll('.osi')
const speedGraf2 = document.querySelector('.speedGraf')
const car2 = document.querySelector('.title_two')
const inputDate2 = document.querySelectorAll('.input_date')
const selectSpeed2 = document.querySelector('.select_speed')
const btnClear2 = document.querySelector('.btn_clear')
const btnSave2 = document.querySelector('.btn_save')
const job2 = document.querySelector('.job')
const tyres2 = document.querySelectorAll('.tires')
const place2 = document.querySelectorAll('.place')
//const btnsens2 = document.querySelectorAll('.btnsens')
//const titleSens2 = document.querySelector('.title_sens')
//console.log(place)



//setTimeout(geoPosition, 3000)
geoPosition2();
//создание дива для аларма
alertCreate2();

//валидация токена на wialon
init();
//запрос в базу и получение параметров датчиков
//загрузка текущей модели конфигуратора из базы
loadModel2(osi2, centerOs2);
setInterval(loadModel2, 5000)
//очистка модели из базы и удаление отрисовки
btnClear2.addEventListener('click', reqDelete2)
btnClear2.addEventListener('click', paramsDelete2)
//обработка выбора графика скорости за интервал
//checked()
//управление графиком скорости

const btnForm2 = document.querySelectorAll('.btm_form')
//const inputDate = document.querySelectorAll('.input_date')
const grafView2 = document.querySelector('.grafik1')
//const selectSpeed = document.querySelector('.select_speed')


speed(btnForm2, inputDate2, grafView2, selectSpeed2)
//генерация списка под параметры датчиков с базы
liCreate2()


function speed(btnForm2, inputDate2, grafView2, selectSpeed2) {
    console.log(btnForm2)
    btnForm2.forEach(el =>
        el.addEventListener('click', () => {
            if (el.textContent === 'Выполнить' && inputDate2[0].value !== '' && inputDate2[1].value !== '') {
                grafView2.style.display = 'block'
                dataInput()
                // dataInput2()
            }
            if (el.textContent === 'Выполнить' && inputDate2[0].value == '' && inputDate2[1].value == '') {
                grafView2.style.display = 'block'
                dataSelect()
                //  dataSelect2()
            }
            if (el.textContent === 'Очистить') {
                selectSpeed2.value = 0;
                inputDate2.forEach(e => {
                    e.value = ''
                    //  console.log('очистил')
                    grafView2.style.display = 'none'
                })
            }
        }))
}

export function dataInput() {
    selectSpeed2.value = 0;
    const arrDate = [];
    inputDate2.forEach(e => {
        arrDate.push(e.value)
    })
    let t01 = new Date(arrDate[0])
    let timeFrom = Math.floor(t01.setHours(t01.getHours()) / 1000)
    let t02 = new Date(arrDate[1])
    let nowDate = Math.floor(t02.setHours(t02.getHours()) / 1000)
    graf(timeFrom, nowDate, 30, 25343786)
}

let nowDate = Math.round(new Date().getTime() / 1000)
let nDate = new Date();
export function dataSelect() {
    switch (selectSpeed2.value) {
        case '1': {
            let timeFrom = Math.round(nDate.setHours(nDate.getHours() - 24) / 1000);
            graf(timeFrom, nowDate, 30, 25343786)
        }
            break;
        case '2': {
            let timeFrom = Math.round(nDate.setDate(nDate.getDate() - 7) / 1000);
            graf(timeFrom, nowDate, 100, 25343786)
        }
            break;
        case '3': {
            let timeFrom = Math.round(nDate.setMonth(nDate.getMonth() - 1) / 1000);
            graf(timeFrom, nowDate, 300, 25343786)
        }
            break;
    }
}

car2.addEventListener('click', () => {
    console.log('нажал на машину')
    speedGraf2.style.display = 'block';
    obo2.style.display = 'none'
    titleSens2.style.display = 'none'
    wrapperButton2.style.display = 'none'
})

const array = [];
function modul() {
    centerOs2.forEach(el => {
        el.addEventListener('click', () => {
            centerOs2.forEach(el => el.classList.remove('os'));
            el.classList.add('os')
            moduleConfig2.style.display = 'flex'
            array.push(el)
            console.log('нажал ось')
        })
    })
    os(array)
}
modul()

function os(arr) {
    const arrayTrailer = [];
    linkSelectOs2.forEach(e =>
        e.addEventListener('click', () => {
            arrayTrailer.push(e)
            e.textContent == 'Прицеп' ?
                arr[arr.length - 1].style.backgroundImage = "url('../image/line_red.png')" :
                arr[arr.length - 1].style.backgroundImage = "url('../image/line_gray.png')"
        }))

    linkSelectTires2.forEach(e =>
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
    const osy2 = array[array.length - 1].id;
    const trailer2 = arrayTrailer.length ? arrayTrailer[arrayTrailer.length - 1].textContent : 'Тягач'
    const tyres2 = arrayTyres[arrayTyres.length - 1].textContent
    console.log(osy2, trailer2, tyres2)
    const mass = [];
    mass.push(osy2, trailer2, tyres2)
    //console.log(mass)
    massiv.push(mass)
    console.log(massiv)
}

btnSave2.addEventListener('click', () => {
    postModel2(massiv)

})

function select() {
    linkSelect2.forEach(el =>
        el.addEventListener('click', () => {
            console.log('нажал конфиг')
            moduleConfig2.style.display = 'none'
            osi2.forEach(it =>
                it.style.display = 'none')
            switch (el.textContent) {
                case '1':
                    foreachArr2(osi2, centerOs2, 1)
                    break;
                case '2':
                    foreachArr2(osi2, centerOs2, 2)
                    break;
                case '3':
                    foreachArr2(osi2, centerOs2, 3)
                    break;
                case '4':
                    foreachArr2(osi2, centerOs2, 4)
                    break;
                case '5':
                    foreachArr2(osi2, centerOs2, 5)
                    break;
                case '6':
                    foreachArr2(osi2, centerOs2, 6)
                    break;
                case '7':
                    foreachArr2(osi2, centerOs2, 7)
                    break;
                case '8':
                    foreachArr2(osi2, centerOs2, 8)
                    break;
            }
        }))
}
select()


//let div = document.createElement('div');
//div.className = "alarm";
export function view2(arr, params) {
    console.log('вью')
    const alerts = [];
    //div.style.display = 'none';
    const tiresLink2 = document.querySelectorAll('.tires_link')
    console.log(arr)
    console.log(params)
    arr.forEach((el, index) => {
        msg2[index].textContent = `${el.name}:${el.value}`
        let parapmsPress;
        if (job2.value !== '') {
            parapmsPress = (el.value * job2.value).toFixed(1)
        } else {
            parapmsPress = (el.value)
        }
        params.forEach(item => {
            if (el.name == item.pressure) {
                tiresLink2[item.tyresdiv - 1].children[0].textContent = parapmsPress
                tiresLink2[item.tyresdiv - 1].children[2].textContent = 'p:' + item.pressure + '\nt:' + item.temp
                alerts.push(tiresLink2[item.tyresdiv - 1].children[0].textContent)
                tiresLink2[item.tyresdiv - 1].children[0].textContent = parapmsPress + '\nБар'
                tiresLink2[item.tyresdiv - 1].children[0].style.background = objColor[generFront(parapmsPress)];
            }
            if (el.name == item.temp) {
                tiresLink2[item.tyresdiv - 1].children[1].textContent = el.value + '°'
                tiresLink2[item.tyresdiv - 1].children[1].style.background = objColor[generT(el.value)];
            }
        })
        /*
                if (alerts.some(element => element < 7.5 || element > 13) == true) {
                    alarm();
                }*/
    })

}
const msg2 = document.querySelectorAll('.msg')





const kolesos = [];
function fn() {
    tiresLink2.forEach(e => {
        e.addEventListener('click', () => {
            kolesos.push(e)
            console.log(kolesos[kolesos.length - 1].id)

            speedGraf2.style.display = 'none';
            sensor2(btnsens2, titleSens2)
            tiresLink2.forEach(e => {
                obo2.style.display = 'none'
                titleSens2.style.display = 'none'
                wrapperButton2.style.display = 'none'
                const msg2 = document.querySelectorAll('.msg')
                msg2.forEach(el => el.classList.remove('act'))
                //  console.log('убрали')
            });
            wrapperButton2.style.display = 'flex';
            //  console.log('поставили')
            tiresLink2.forEach(el => el.classList.remove('tiresActiv'));
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
    msg2.forEach(el => {
        el.addEventListener('click', () => {
            const arrSpreed = [...el.textContent]
            let value;
            arrSpreed.forEach(el => {
                if (el === ':') {
                    value = arrSpreed.splice(arrSpreed.indexOf(el) + 1, arrSpreed.length - 1).join('')
                }
            })
            if (btnsens2[0].classList.contains('actBTN')) {
                arrSpreed.forEach(el => {
                    if (el === ':') {
                        prmsD.push(arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join(''))
                    }
                })
                console.log(job2.value)
                const valJob = (job2.value.length == 0) ? value : value * job2.value
                valJob.length > 10 ?
                    kol[kol.length - 1].children[0].textContent = '-' :
                    kol[kol.length - 1].children[0].textContent = valJob + '\nБар'
                kol[kol.length - 1].children[0].style.background = objColor[generFront(valJob)];
                paramPress.push(el)
                console.log(paramPress)
            }
            if (btnsens2[1].classList.contains('actBTN')) {
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
    btnSave2.addEventListener('click', () => {
        postTyres2(massivionbd);
    })
    //postTyres(massivionbd);
    // views(massivion)
    //setInterval(() => views(massivion), 15000)
}


function postTyres2(arr) {
    fetch('api/tyres2', {
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


const menu2 = document.querySelectorAll('.car_item')
menu2.forEach(el => {
    el.addEventListener('click', menuBtn)
    function menuBtn() {
        menu2.forEach(el => {
            el.style.backgroundColor = '#fff'
        })
        el.style.backgroundColor = 'lightgray'
    }
})