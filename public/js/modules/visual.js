import { text } from './content.js'
import { objColor, generT, generFront, generDav } from './content.js'
import { viewMenuParams, loadParamsView } from './paramsTyresView.js'
import { findTyresInstall } from './saveBaseId.js'
import { geoloc, iconParams } from './wialon.js'
import { protekGrafTwo, protekGrafThree, protekGrafFour, protekGrafFree } from './canvas.js'
import { alarmFind } from './alarmStorage.js'
import { modalOs } from './modalOs.js'
import { reqProtectorBase } from './protector.js'
import { kranParams } from './strelaKran.js'
import { iconFind, iconFindWindows, refactor } from './configIcons.js'
import { grafikPoly, tarirView } from './staticObject.js'
import { tooltip } from './cursorTooltip.js'
import { ggg } from './menu.js'
import { datas, oil } from './grafiks.js'
import { Tooltip } from '../class/Tooltip.js'
import { graftest } from './graf.js'




let start;
let time;
let timeIcon;

export async function visual(el) {
    const tarir = document.querySelector('.tarir')
    if (el.children[0].textContent === 'Цистерна ДТ') {
        tarir.style.display = 'block'
    }
    const tiresLink = document.querySelectorAll('.tires_link')
    clearInterval(time)
    clearInterval(timeIcon)
    const wrapperUp = document.querySelector('.wrapper_up')
    const speedGraf = document.querySelector('.speedGraf')
    const wrapperCont = document.querySelector('.wrapper_containt')
    const wrapperLeft = document.querySelector('.wrapper_left')
    const titleCar = document.querySelector('.title_two')
    const btnsens = document.querySelectorAll('.btnsens')
    const main = document.querySelector('.main')
    const plug = document.querySelectorAll('.plug')
    const grafics = document.querySelector('.grafics')
    const delIcon = document.querySelectorAll('.delIcon')
    delIcon.forEach(el => {
        el.classList.remove('del')
        el.style.display = 'none'
    })
    const tableTarir = document.querySelector('.tableTarir')
    tableTarir.style.display = 'none'
    tiresLink.forEach(e => {
        if (e.classList.contains('tiresActiv')) {
            grafics.style.display = 'flex'
        }
    })
    if (plug[2].classList.contains('activGraf')) {
        wrapperLeft.style.display = 'none'
        grafics.style.display = 'flex'
    }
    else {
        wrapperLeft.style.display = 'block'
    }
    alarmClear();
    wrapperUp.style.display = 'flex'
    wrapperCont.style.display = 'flex'
    speedGraf.style.display = 'block'
    el.classList.add('color')
    //  viewOs(); //отрисовываем оси для вставки данных с базы по модели и колесам конфигуратора
    titleCar.textContent = el.children[0].textContent
    console.log(titleCar.textContent)
    loadParamsView()

    findTyresInstall()
    liCreate()
    // const active = document.querySelector('.color')
    const activePost = el.children[0].textContent.replace(/\s+/g, '')
    iconFind(activePost)
    await iconFindWindows(activePost)
    btnsens.forEach(el => {
        el.classList.remove('actBTN')
    })
    kranParams()
    setInterval(kranParams, 300000)
    if (!start || start !== el) {
        start = el;
        geoloc()
        time = setInterval(geoloc, 300000) //отрисовываем карту osm
    }
    alarmFind()
    iconParams()
    tarirView();
    setInterval(tarirView, 300000)
    tooltip()
    const grafOld = document.querySelector('.infoGraf')
    if (grafOld) {
        grafOld.remove()
    }

    setTimeout(graftest, 500)


    const zamer = document.querySelectorAll('.zamer')
    const createList = document.querySelector('.createList')
    createList.value = ''
    if (zamer) {
        zamer.forEach(e => {
            e.remove()
        })
    }

}
export function visualNone(e) {
    const title_two = document.querySelector('.title_two')
    const headerCar = document.querySelector('.header_car')
    headerCar.appendChild(title_two)
    title_two.style.position = 'static'
    headerCar.style.flexDirection = 'column'


    const tarir = document.querySelector('.tarir')
    tarir.style.display = 'none'
    const gosNumber = document.querySelector('.gosNumber')
    const wrapC = document.querySelector('.wrapper_containt')
    wrapC.appendChild(gosNumber)

    const statusObj = document.querySelector('.status_obj')
    statusObj.textContent = ''
    statusObj.style.color = 'gray'
    /*
    const toChange = document.querySelector('.toChange')
    toChange.style.display = 'none'*/
    const probegElem = document.querySelector('.odom_value')
    const starterValue = document.querySelector('.akb_value1')
    const ohlValue = document.querySelector('.ohl_value')
    const oilValue = document.querySelector('.oil_value1')
    const toil_value = document.querySelector('.toil_value')
    const ign_value = document.querySelector('.ign_value')
    const oborotValue = document.querySelector('.oborot_value')

    toil_value.textContent = ''
    starterValue.textContent = ''
    probegElem.textContent = ''
    ohlValue.textContent = ''
    oilValue.textContent = ''
    ign_value.textContent = ''
    oborotValue.textContent = ''
    const wrapperUp = document.querySelector('.wrapper_up')
    const speedGraf = document.querySelector('.speedGraf')
    const container = document.querySelector('.container')
    const techInfo = document.querySelector('.techInfo')
    const modalCenterOs = document.querySelector('.modalCenterOs')
    const plus = document.querySelector('.plus')
    const minus = document.querySelector('.minus')
    const alarmStorage = document.querySelector('.alarmStorage')
    const clearConfirmWin = document.querySelector('.clearConfirmWin')
    clearConfirmWin.style.display = 'none'
    const contKran = document.querySelector('.contKran')
    contKran.style.display = 'none'
    const card = document.querySelectorAll('.cardClick')
    card.forEach(el => {
        el.classList.remove('acto')
    })
    const valueStatic = document.querySelectorAll('.valueStatic')
    valueStatic.forEach(el => {
        el.textContent = ''
        el.previousElementSibling.value = ''
        el.classList.remove('actoStatic')
    })

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
    speedGraf.style.display = 'none'
    e.classList.remove('color')
    if (container.children.length > 0) {
        const containerArr = Array.from(container.children)
        containerArr.forEach(it => {
            it.remove();
        })
        const tr = document.querySelectorAll('.tr')
        tr.forEach(it => {
            it.remove();
        })
    }
}




//стираем выбранные значения графика скорости
export function clearGraf() {
    const selectSpeed = document.querySelector('.select_speed')
    const inputDate = document.querySelectorAll('.input_date')
    selectSpeed.value = 0;
    inputDate.forEach(e => {
        e.value = ''
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


export function view(arg) {
    // console.log(arg)
    const msg = document.querySelectorAll('.msg')
    arg.forEach((el, index) => {
        msg[index].textContent = `${el.name}:${el.value}`
    })

}

export const convert = (ob) => {
    const uniq = new Set(ob.map(e => JSON.stringify(e)));
    return Array.from(uniq).map(e => JSON.parse(e));
}


export async function viewConfigurator(arg, params, osi) {
    const role = document.querySelectorAll('.log')[0].textContent
    const active = document.querySelectorAll('.color')
    const allobj = await ggg(active[0].id)
    // console.log(allobj)
    //   console.log(osi)
    if (params) {
        const parametrs = convert(params)
        //  console.log(parametrs)
        const alerts = [];
        const tiresLink = document.querySelectorAll('.tires_link')
        let activePost;

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
                    arg.forEach((el) => {
                        if (el.name === item.pressure) {
                            if (activePost === 'А652УА198') {
                                done = parseFloat((el.value / 10).toFixed(1))
                            }
                            else {
                                done = parseFloat(el.value)
                            }
                            alerts.push(done)
                            e.children[0].style.position = 'relative'
                            e.children[0].style.border = 'none'
                            e.children[0].style.borderRadius = '30% 30% 0 0'
                            e.children[0].innerHTML = `${done}\n<span class="ppp">Bar</span>`
                            e.children[0].setAttribute('rel', `${item.pressure}`)
                            const ppp = document.querySelectorAll('.ppp')
                            ppp.forEach(el => {
                                el.style.position = 'absolute'
                                el.style.bottom = 0
                            })

                            if (role === 'Администратор') {
                                new Tooltip(e, [allobj[item.pressure] + '(' + item.pressure + ')', allobj[item.temp] + '(' + item.temp + ')']);
                                //  t.setMessage([allobj[item.pressure] + '(' + item.pressure + ')', allobj[item.temp] + '(' + item.temp + ')'])
                            }
                            else {
                                new Tooltip(e, [allobj[item.pressure], allobj[item.temp]]);
                                //  t.setMessage([allobj[item.pressure], allobj[item.temp]])
                            }
                            osi.forEach(element => {
                                if (element.idOs == item.osNumber) {
                                    signal = objColor[generDav(done, element)]
                                }
                            })
                            if (el.status === 'false') {
                                e.children[0].style.background = 'lightgray';
                                e.children[0].style.color = '#000'
                                return
                            }
                            e.children[0].style.color = signal;
                            if (signal === '#FF0000') {
                                e.parentElement.style.border = `1px solid ${signal}`;
                                e.parentElement.style.borderRadius = '15px'
                            }

                        }
                        if (el.name === item.temp) {
                            tiresLink.forEach(e => {
                                if (e.id == item.tyresdiv) {
                                    if (el.value === '-128' || el.value === '-50') {
                                        el.value = 'err'
                                        e.children[1].style.color = 'red'
                                        e.children[1].textContent = el.value
                                        e.children[1].style.border = 'none'
                                        e.children[1].style.borderRadius = '0 0 30% 30%'
                                        if (el.status === 'false') {
                                            e.children[1].style.background = 'lightgray';
                                            e.children[0].style.color = '#000'
                                            e.children[1].style.border = 'none'
                                            e.children[1].style.borderRadius = '0 0 30% 30%'

                                        }
                                    }
                                    if (el.value >= -51 && el.value < 36) {
                                        e.children[1].style.border = 'none'
                                        e.children[1].textContent = el.value + '°C'
                                        e.children[1].setAttribute('rel', `${item.temp}`)
                                        if (el.status === 'false') {
                                            e.children[1].style.background = 'lightgray';
                                            e.children[1].style.border = 'none'
                                            e.children[1].style.borderRadius = '0 0 30% 30%'
                                            e.children[1].style.color = '#000'
                                            return
                                        }
                                        e.children[1].style.color = objColor[generT(el.value)];
                                    }
                                }
                            })
                        }
                    })
                }
            })
        })
    }

}


export function alarmClear() {
    // const div = document.querySelector('.alarm')
    //  div.style.display = 'none'
    const ogon = document.querySelector('.ogon')
    ogon.style.display = 'none'
    const alarmCheck = document.querySelectorAll('.alarmCheck')
    alarmCheck.forEach(e => {
        e.style.borderTopLeftRadius = 'none'
        e.style.border = 'none'
    })

}



export async function viewOs(counts) {
    const container = document.querySelector('.container')
    if (container.children.length > 0) {
        const containerArr = Array.from(container.children)
        containerArr.forEach(it => {
            it.remove();
        })

    }
    //  else {
    const count = counts;
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
        el.style.display = 'none'
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
        // const place = document.createElement('div');
        //  place.classList.add('place')
        link.appendChild(tiresD);
        link.appendChild(tiresT);
        // link.appendChild(place);
    })
    const cont1 = document.createElement('div');
    cont1.classList.add('cont1')
    container.appendChild(cont1)
    const cont2 = document.createElement('div');
    cont2.classList.add('cont')
    container.appendChild(cont2)
    //  }

    const btnShina = document.querySelectorAll('.modals')
    if (btnShina[1].classList.contains('active')) {
        styleShinaActive(btnShina[1])
    }
    viewMenuParams()
    modalOs();
}
function styleShinaActive(arg) {
    reqProtectorBase()
    const tyresD = document.querySelectorAll('.tiresD')
    const tyresT = document.querySelectorAll('.tiresT')
    const main = document.querySelector('.main')
    main.style.display = 'flex'
    arg.style.fontSize = '0.65rem'
    tyresD.forEach(e => {
        //  e.style.background = 'black';
        //  e.style.borderBottom = 'none'
        e.style.Border = 'none'
    })
    tyresT.forEach(e => {
        //  e.style.background = 'black';
        e.style.borderTop = 'none'
        e.style.fontSize = '0.8rem'
        e.style.justifyContent = 'flex-start'
    })
}

//обработка массива для скрытия осей и других элементов
export const divClear = (arr) => {
    if (arr.length > 0) {
        arr.forEach(it => {
            it.remove();
        })
    }
    else {
        arr.remove();
    }
}
export const pricep = (elem) => {
    const cont = document.querySelector('.cont')
    cont.append(elem.parentNode)
    cont.style.marginTop = '72px'
    cont.style.border = '2px solid darkblue'
    cont.style.padding = '5px'

    elem.children[0].style.background = '#000'// "#00FFFF"
    elem.classList.add('pricep')



}

export function viewDinamic(arr, maxProtector) {
    const conts = document.querySelectorAll('.contBar2')

    conts.forEach(el => {
        el.style.display = 'none'
    })

    const arrAll = [];

    arr.forEach(el => {
        arrAll.push(el * 10)
    })
    const mm = parseFloat(maxProtector * 10)

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
        if (mm <= 120) {
            y1 = (mm - arrAll[0]) / 2
            y2 = (mm - arrAll[1]) / 2
        }
        if (mm > 120 && mm <= 180) {
            y1 = (mm - arrAll[0]) / 3
            y2 = (mm - arrAll[1]) / 3
        }
        if (mm > 180) {
            y1 = (mm - arrAll[0]) / 4
            y2 = (mm - arrAll[1]) / 4
        }
        conts[0].style.display = 'block'
        conts[0].style.width = '348px'
        protekGrafTwo(y1, y2, arr, mm)
    }
    if (arrAll.length == 3) {
        if (mm <= 120) {
            y1 = (mm - arrAll[0]) / 2
            y2 = (mm - arrAll[1]) / 2
            y3 = (mm - arrAll[2]) / 2
        }
        if (mm > 120 && mm <= 180) {
            y1 = (mm - arrAll[0]) / 3
            y2 = (mm - arrAll[1]) / 3
            y3 = (mm - arrAll[2]) / 3
        }
        if (mm > 180) {
            y1 = (mm - arrAll[0]) / 4
            y2 = (mm - arrAll[1]) / 4
            y3 = (mm - arrAll[2]) / 4
        }

        conts[0].style.display = 'block'
        conts[1].style.display = 'block'
        conts[0].style.width = '174px'
        conts[1].style.width = '174px'
        protekGrafThree(y1, y2, y3, arr, mm)
    }
    if (arrAll.length === 4) {
        conts.forEach(e => {
            e.style.display = 'block'
            e.style.width = '116px'
        })

        if (mm <= 120) {
            y1 = (mm - arrAll[0]) / 2
            y2 = (mm - arrAll[1]) / 2
            y3 = (mm - arrAll[2]) / 2
            y4 = (mm - arrAll[3]) / 2
        }
        if (mm > 120 && mm <= 180) {

            y1 = (mm - arrAll[0]) / 3
            y2 = (mm - arrAll[1]) / 3
            y3 = (mm - arrAll[2]) / 3
            y4 = (mm - arrAll[3]) / 3
        }
        if (mm > 180) {
            y1 = (mm - arrAll[0]) / 4
            y2 = (mm - arrAll[1]) / 4
            y3 = (mm - arrAll[2]) / 4
            y4 = (mm - arrAll[3]) / 4
        }
        protekGrafFour(y1, y2, y3, y4, arr, mm)
    }
}

