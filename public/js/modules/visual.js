import { text } from './content.js'
import { objColor, generT, generFront, generDav } from './content.js'
import { viewMenuParams, loadParamsView } from './paramsTyresView.js'

import { geoloc, iconParams } from './wialon.js'
import { protekGrafTwo, protekGrafThree, protekGrafFour, protekGrafFree } from './canvas.js'
import { alarmFind } from './alarmStorage.js'
import { modalOs } from './modalOs.js'
import { reqProtectorBase } from './protector.js'
import { kranParams } from './strelaKran.js'

let start;
let time;
let icon;
export function visual(el) {
    clearInterval(time)
    const wrapperUp = document.querySelector('.wrapper_up')
    const speedGraf = document.querySelector('.speedGraf')
    const wrapperRight = document.querySelector('.wrapper_right')
    // const wrapperLeft = document.querySelector('.wrapper_left')
    const titleCar = document.querySelector('.title_two')
    const btnsens = document.querySelectorAll('.btnsens')
    const main = document.querySelector('.main')
    alarmClear();
    wrapperUp.style.display = 'block'
    wrapperRight.style.display = 'flex'
    // wrapperLeft.style.display = 'block'
    /*
    const widthWind = document.querySelector('body').offsetWidth;
    if (widthWind <= 860) {
        main.style.display = 'none'
    }

    else {
        main.style.display = 'flex'
    }*/
    //main.style.display = 'flex'
    speedGraf.style.display = 'block'
    el.classList.add('color')
    //  console.log(el)
    viewOs(); //отрисовываем оси для вставки данных с базы по модели и колесам конфигуратора
    titleCar.textContent = el.textContent
    loadParamsView()
    //  setInterval(loadParamsView, 5000)
    console.log(el)


    alarmFind(el)
    //setInterval(alarmFind, 6000, el)

    btnsens.forEach(el => {
        el.classList.remove('actBTN')
    })
    if (!icon || icon !== el) {
        icon = el;
        iconParams()
        icon = setInterval(iconParams, 6000) //отрисовываем карту osm

    }
    kranParams()
    setInterval(kranParams, 6000)
    if (!start || start !== el) {
        start = el;
        geoloc()
        time = setInterval(geoloc, 120000) //отрисовываем карту osm
    }
}





export function visualNone(e) {
    const probegElem = document.querySelector('.probeg_value')
    probegElem.textContent = ''
    const oilElem = document.querySelector('.oil_value')
    oilElem.textContent = ''
    const toElem = document.querySelector('.to_value')
    toElem.textContent = ''
    const wrapperUp = document.querySelector('.wrapper_up')
    const speedGraf = document.querySelector('.speedGraf')
    const wrapperRight = document.querySelector('.wrapper_right')
    const obo = document.querySelector('.obo')
    const titleSens = document.querySelector('.title_sens')
    const moduleConfig = document.querySelector('.moduleConfig')
    const wrapperButton = document.querySelector('.wrapper_button')
    const container = document.querySelector('.container')
    const techInfo = document.querySelector('.techInfo')
    const modalCenterOs = document.querySelector('.modalCenterOs')
    const plus = document.querySelector('.plus')
    const minus = document.querySelector('.minus')
    const alarmStorage = document.querySelector('.alarmStorage')
    const oneName = document.querySelector('.oneName')


    const contKran = document.querySelector('.contKran')
    contKran.style.display = 'none'
    const newBoad = document.querySelector('.speed')
    if (newBoad) {
        newBoad.remove();
    }

    plus.style.display = 'block'
    minus.style.display = 'none'
    alarmStorage.style.display = 'none'

    techInfo.style.display = 'none'
    modalCenterOs.style.display = 'none'


    wrapperUp.style.display = 'none'
    wrapperRight.style.display = 'none'
    speedGraf.style.display = 'none'




    obo.style.display = 'none'
    wrapperButton.style.display = 'none'
    titleSens.style.display = 'none'
    moduleConfig.style.display = 'none'
    e.classList.remove('color')
    if (container.children.length > 0) {
        console.log('удаление')
        //  console.log(container.children)
        const containerArr = Array.from(container.children)
        containerArr.forEach(it => {
            //    console.log('удаление цикл')
            it.remove();
        })


        const tr = document.querySelectorAll('tr')
        tr.forEach(it => {
            //    console.log('удаление цикл')
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
    const count = 150;
    for (let i = 0; i < count; i++) {
        let li = document.createElement('li');
        li.className = "msg";
        obo.append(li);
    }
}

/*
const obo = document.querySelector('.obo')
if (obo.children.length !== 0) {
    const list = Array.from(obo.children)
    list.forEach(el => {
        el.remove();
    })
}
const count = arg.length
for (let i = 0; i <= count; i++) {
    let li = document.createElement('li');
    li.className = "msg";
    obo.append(li);
}*/





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

    //liCreate(arg)
    const msg = document.querySelectorAll('.msg')
    //console.log(msg)
    // console.log(arg)
    arg.forEach((el, index) => {
        msg[index].textContent = `${el.name}:${el.value}`
    })

}
export function viewConfigurator(arg, params) {
    // const massItog = [];

    // console.log(arg)
    //  console.log(params)
    const parametrs = convert(params)
    const alerts = [];
    const tiresLink = document.querySelectorAll('.tires_link')
    let activePost;
    const active = document.querySelectorAll('.color')
    const alarm = document.querySelector('.alarm')
    const alarmCheck = document.querySelector('.alarmCheck')
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.listItem')[0]
        activePost = listItem.textContent.replace(/\s+/g, '')
    }
    else {
        activePost = active[0].textContent.replace(/\s+/g, '')
    }
    const par = [];
    arg.forEach(el => {
        par.push(el.name)
    })
    parametrs.forEach(item => {
        let signal;
        let done;
        tiresLink.forEach(e => {
            if (e.id == item.tyresdiv) {
                if (!par.includes(item.pressure)) {
                    // console.log('не тру')
                    //  return
                    e.children[0].textContent = 'off'
                    e.children[0].style.color = '#000'
                }
                if (!par.includes(item.temp)) {
                    //  console.log('не тру')
                    //   return
                    e.children[1].textContent = 'off'
                }
                else {
                    arg.forEach((el) => {
                        if (el.name === item.pressure) {

                            if (activePost === 'PressurePro933') {
                                done = parseFloat((el.value * 0.069).toFixed(1))
                            }
                            else {
                                done = parseFloat(el.value)
                            }
                            alerts.push(done)
                            e.children[0].textContent = done + '\nБар'
                            e.children[2].textContent = 'p:' + item.pressure + '\nt:' + item.temp
                            if (activePost == 'КранГаличанинР858ОР178') {
                                signal = objColor[generDav(done)]

                            }
                            else {
                                signal = objColor[generFront(done)]

                            }
                            e.children[0].style.background = signal;

                        }
                        if (el.name === item.temp) {
                            //  massTemp.push(item.temp, el.value)
                            //  console.log(el.name)
                            tiresLink.forEach(e => {
                                if (e.id == item.tyresdiv) {
                                    if (el.value === '-128' || el.value === '-50') {
                                        el.value = 'err'
                                        e.children[1].textContent = el.value
                                    }
                                    if (el.value >= -51 && el.value < 36) {
                                        e.children[1].textContent = el.value + '°'

                                        e.children[1].style.background = objColor[generT(el.value)];
                                    }
                                }
                            })
                        }
                    })
                }
            }

        })
        if (activePost == 'КранГаличанинР858ОР178') {
            if (alerts.some(element => element < 6) == true) {
                alarmMin();
            }
            if (alerts.some(element => element > 9.9) == true) {
                alarmMax();
            }
        }
        else {

            if (alerts.some(element => element > 10) == true) {
                alarmMax();
            }
            if (alerts.some(element => element < 8) == true) {
                alarmMin();
            }
        }
    })
}
/*
function alertCreate() {
    let div = document.createElement('div');
    div.className = "alarm";
    const headerCar = document.querySelector('.header_car')
    headerCar.prepend(div);
}
//alertCreate()

*/

function alarmMin() {
    const div = document.querySelector('.alarm')
    div.style.display = 'block'
    const ogon = document.querySelector('.ogon')
    ogon.style.display = 'block'

}
function alarmMax() {
    const div = document.querySelector('.alarm')
    div.style.display = 'block'
    const ogon = document.querySelector('.ogon')
    ogon.style.display = 'block'
}



export function alarmClear() {
    const div = document.querySelector('.alarm')
    div.style.display = 'none'

    const ogon = document.querySelector('.ogon')
    ogon.style.display = 'none'
    //  const alarmMinn = document.querySelector('.dav_min')
    //const info = document.querySelector('.info')
    // alarmMinn.style.display = 'none'
    // info.style.display = 'none'
    //  const alarmMaxx = document.querySelector('.dav_max')
    // alarmMaxx.style.display = 'none'
    const alarmCheck = document.querySelectorAll('.alarmCheck')
    alarmCheck.forEach(e => {
        e.style.borderTopLeftRadius = 'none'
        e.style.border = 'none'
    })

}



export async function viewOs() {
    console.log('рисуем оси')
    const container = document.querySelector('.container')
    if (container.children.length > 0) {
        // console.log('удаление')
        //  console.log(container.children)
        const containerArr = Array.from(container.children)
        containerArr.forEach(it => {
            console.log('удаление цикл')
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
            const vnut = document.createElement('vnut')
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
        container.appendChild(cont2)
    }
    viewMenuParams()
    modalOs();
    const btnShina = document.querySelectorAll('.plug')
    btnShina[0].classList.contains('active') ? styleShinaActive(btnShina[0]) : styleShina(btnShina[0])
}
function styleShinaActive(arg) {
    reqProtectorBase()
    arg.textContent = 'Давл.\nТемп.'
    const tyresD = document.querySelectorAll('.tiresD')
    const tyresT = document.querySelectorAll('.tiresT')
    const centerOs = document.querySelectorAll('.centerOs')
    const vnut = document.querySelectorAll('.vnut')
    const osi = document.querySelectorAll('.osi')
    const place = document.querySelectorAll('.place')
    const main = document.querySelector('.main')
    main.style.display = 'flex'

    arg.style.fontSize = '0.65rem'
    // console.log(tyresD)
    osi.forEach(e => {
        e.style.width = '330px'
    })
    tyresD.forEach(e => {
        e.style.width = '60px'
        //e.style.alignItems = 'flex-start'
        e.style.background = 'black';
        e.style.borderBottom = 'none'
    })
    tyresT.forEach(e => {
        e.style.width = '60px'
        e.style.background = 'black';
        e.style.borderTop = 'none'
        e.style.fontSize = '0.8rem'
        e.style.justifyContent = 'flex-start'
    })
    centerOs.forEach(e => {
        e.style.width = '300px'
    })

    place.forEach(e => {
        e.style.display = 'none';
    })
}
function styleShina(arg) {
    arg.textContent = 'Состояние шин'
    const tyresD = document.querySelectorAll('.tiresD')
    const tyresT = document.querySelectorAll('.tiresT')
    const centerOs = document.querySelectorAll('.centerOs')
    //  console.log(tyresD)
    tyresD.forEach(e => {
        e.style.width = '30px'
    })
    tyresT.forEach(e => {
        e.style.width = '30px'
    })
    centerOs.forEach(e => {
        e.style.width = '150px'
    })
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
    // console.log('отработка прицеп')
    // console.log(elem)
    const cont = document.querySelector('.cont')
    cont.append(elem.parentNode)
    cont.style.marginTop = '72px'
    console.log(elem.children[0])
    elem.children[0].style.background = "#00FFFF"
    elem.classList.add('pricep')
}


export const convert = (ob) => {
    const uniq = new Set(ob.map(e => JSON.stringify(e)));
    return Array.from(uniq).map(e => JSON.parse(e));
}





export function viewDinamic(arr) {
    const conts = document.querySelectorAll('.contBar2')
    //  console.log(arr)
    conts.forEach(el => {
        el.style.display = 'none'
    })

    const arrAll = [];
    console.log(arr)
    arr.forEach(el => {
        arrAll.push(el * 10)
    })

    let y1;
    let y2;
    let y3;
    let y4;
    if (arr.length === 0) {
        conts.forEach(e => {
            e.style.display = 'block'
            e.style.width = '116px'
        })
        protekGrafFree()
    }
    if (arrAll.length == 2) {
        y1 = (120 - arrAll[0]) / 2
        y2 = (120 - arrAll[1]) / 2
        conts[0].style.display = 'block'
        conts[0].style.width = '348px'
        protekGrafTwo(y1, y2, arr)
    }
    if (arrAll.length == 3) {
        y1 = (120 - arrAll[0]) / 2
        y2 = (120 - arrAll[1]) / 2
        y3 = (120 - arrAll[2]) / 2

        conts[0].style.display = 'block'
        conts[1].style.display = 'block'
        conts[0].style.width = '174px'
        conts[1].style.width = '174px'
        protekGrafThree(y1, y2, y3, arr)
    }
    if (arrAll.length === 4) {
        conts.forEach(e => {
            e.style.display = 'block'
            e.style.width = '116px'
        })
        console.log(conts)
        y1 = (120 - arrAll[0]) / 2
        y2 = (120 - arrAll[1]) / 2
        y3 = (120 - arrAll[2]) / 2
        y4 = (120 - arrAll[3]) / 2
        protekGrafFour(y1, y2, y3, y4, arr)
    }
}





/*
var c = document.getElementById("drawLine");
var ctx = c.getContext("2d");

ctx.beginPath();
ctx.lineWidth = "1";
ctx.strokeStyle = "#000";
ctx.moveTo(0, 60);
ctx.lineTo(0, y1);
ctx.lineTo(346, y2);
ctx.lineTo(346, 60);
ctx.lineTo(173, 60);

ctx.lineTo(0, 60);
ctx.fillStyle = "rgba(204,85,0, 0.5)";
ctx.fill();
ctx.stroke();

ctx.beginPath();
ctx.lineWidth = "1";
ctx.strokeStyle = "#000";
ctx.moveTo(0, 0);
ctx.lineTo(0, 50);
ctx.lineTo(4, 50);
ctx.lineTo(9, 0);
ctx.fillStyle = "rgba(255,255,255, 1)";
ctx.fill();
ctx.stroke();

ctx.beginPath();
ctx.lineWidth = "1";
ctx.strokeStyle = "#000";
ctx.moveTo(346, 0);
ctx.lineTo(346, 50);
ctx.lineTo(342, 50);
ctx.lineTo(337, 0);
ctx.fillStyle = "rgba(255,255,255, 1)";
ctx.fill();
ctx.stroke();


ctx.beginPath();
ctx.lineWidth = "1";
ctx.strokeStyle = "#000";
ctx.moveTo(164, 0);
ctx.lineTo(169, 50);
ctx.lineTo(176, 50);
ctx.lineTo(181, 0);
ctx.fillStyle = "rgba(255,255,255, 1)";
ctx.fill();
ctx.stroke();
*/
