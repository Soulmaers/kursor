import { text, twoTyres, forTyres } from './content.js'
import { objColor, generT, generFront, generDav } from './content.js'
import { viewMenuParams, loadParamsView } from './paramsTyresView.js'
//import { geoPosition } from './requests.js'
import { geoloc } from './wialon.js'
import { protekGrafTwo, protekGrafThree, protekGrafFour } from './canvas.js'
import { navigator } from './navigator.js'

let start;
let time;
//let timeParams;
export function visual(el) {
    // console.log(el)
    clearInterval(time)
    // clearInterval(timeParams)
    const wrapperUp = document.querySelector('.wrapper_up')
    const speedGraf = document.querySelector('.speedGraf')
    const wrapperRight = document.querySelector('.wrapper_right')
    const titleCar = document.querySelector('.title_two')
    const btnsens = document.querySelectorAll('.btnsens')
    const main = document.querySelector('.main')
    // const section = document.querySelector('.section')
    alarmClear();
    //detalisation.style.display = 'none'
    //  section.style.display = 'none'
    wrapperUp.style.display = 'block'
    wrapperRight.style.display = 'flex'
    main.style.display = 'flex'
    speedGraf.style.display = 'block'
    el.parentNode.classList.add('color')
    viewOs(); //отрисовываем оси для вставки данных с базы по модели и колесам конфигуратора
    titleCar.textContent = el.textContent
    loadParamsView()
    //  setInterval(loadParamsView, 5000)
    btnsens.forEach(el => {
        el.classList.remove('actBTN')
    })
    if (!start || start !== el) {
        start = el;
        geoloc()
        time = setInterval(geoloc, 120000) //отрисовываем карту osm


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
    //  console.log(arg, params)
    const alerts = [];
    const tiresLink = document.querySelectorAll('.tires_link')
    //const tiresLinkId = document.getElementById('.tires_link')
    //const active = document.querySelectorAll('.color')
    let activePost;
    const active = document.querySelectorAll('.color')
    /* if (active[0].textContent == 'Кран 858') {
         active[0].textContent = 'КранГаличанин Р858ОР178'
     }*/
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.link_menu')[0]
        //  console.log(listItem.textContent)
        activePost = listItem.textContent.replace(/\s+/g, '')
    }
    else {
        activePost = active[0].textContent.replace(/\s+/g, '')
    }
    arg.forEach((el) => {
        let parapmsPress;
        // parapmsPress = 
        let signal;
        let done;
        params.forEach(item => {
            if (el.name == item.pressure) {
                tiresLink.forEach(e => {
                    if (e.id == item.tyresdiv) {
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

                            if (done < 6 || done > 9.9) {
                                e.classList.add('alarmCheck')
                            }
                        }
                        else {
                            signal = objColor[generFront(done)]
                            if (done < 8 || done > 10) {
                                e.classList.add('alarmCheck')
                            }
                        }
                        e.children[0].style.background = signal;

                    }
                })
            }
            if (el.name == item.temp) {
                tiresLink.forEach(e => {
                    if (e.id == item.tyresdiv) {
                        if (el.value === '-128' || el.value === '-51') {
                            el.value = 'err'
                            e.children[1].textContent = el.value
                        }
                        if (el.value > -50 && el.value < 36) {
                            e.children[1].textContent = el.value + '°'

                            e.children[1].style.background = objColor[generT(el.value)];
                        }
                    }
                })
            }
        })
        //    console.log(activePost)
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
        container.appendChild(cont2)
    }
    viewMenuParams()
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
    console.log('отработка прицеп')
    const cont = document.querySelector('.cont')
    cont.prepend(elem.parentNode)
    cont.style.marginTop = '72px'
    elem.style.backgroundImage = "url('../image/line_gray.png')"
}


const convert = (ob) => {
    const uniq = new Set(ob.map(e => JSON.stringify(e)));
    return Array.from(uniq).map(e => JSON.parse(e));
}

let startList = 0;
export function viewList(model, message, result, values) {

    //    listCar.remove();

    const modelUniq = convert(model.result)
    modelUniq.forEach(el => {
        el

    })



    console.log(modelUniq)
    const listProfil = document.querySelector('.list_profil')
    const listCar = document.createElement('div')
    listCar.classList.add('bigDiv')
    const nameCar = model.message.replace(/\s+/g, '')

    listCar.classList.add(`${nameCar}`)
    listProfil.appendChild(listCar)
    // let count = modelUniq.osi
    // console.log(count)
    modelUniq.forEach(os => {


        const osi = document.createElement('div')
        os.trailer === 'Прицеп' ? (osi.classList.add('osi_list'), osi.classList.add('trail')) : osi.classList.add('osi_list')
        listCar.appendChild(osi)
        os.tyres === 2 ? osi.innerHTML = twoTyres : osi.innerHTML = forTyres
    })

    const listTrail = document.querySelector('.list_trail')
    const trail = document.createElement('div')
    trail.classList.add('traile')
    trail.classList.add(`${nameCar}`)
    // console.log(listTrail)
    listTrail.appendChild(trail)
    const cont3 = document.createElement('div');
    cont3.classList.add('cont3')
    const trailer = document.querySelectorAll('.traile')
    trailer.forEach(e => {
        e.appendChild(cont3)
    })
    const bigDivCar = document.querySelectorAll(`.${nameCar}`)
    var childTrail = bigDivCar[0].querySelectorAll('.trail');
    childTrail.forEach(el => {
        cont3.appendChild(el)
    })
    viewShina(message, result, values)
    setInterval(viewShina, 6000, message, result, values)
}

export function viewShina(message, arg, params) {
    //   console.log('запуск')
    const modelUniqValues = convert(params)
    const nameCar = message.replace(/\s+/g, '')
    const bigDiv = document.querySelectorAll(`.${nameCar}`)
    var child = bigDiv[0].querySelectorAll('.tiresProfil');
    const listTrailer = document.querySelector('.list_trail')
    var trail = listTrailer.querySelectorAll(`.${nameCar}`);
    var childTrail = trail[0].querySelectorAll('.tiresProfil');
    const r = [];
    const allKol = [];
    let integer;
    allKol.push(...child, ...childTrail)
    modelUniqValues.forEach(el => {
        r.push(el.tyresdiv)
    })
    r.forEach((el, index) => {
        allKol[index].setAttribute('id', el);
    })
    arg.forEach((el) => {
        params.forEach((item) => {
            if (el.name == item.pressure) {
                allKol.forEach(e => {
                    //    console.log(e)
                    if (e.id == item.tyresdiv) {
                        if (nameCar == 'PressurePro933') {
                            //   console.log((el.value * 0.069).toFixed(1))
                            integer = parseFloat((el.value * 0.069).toFixed(1))

                            e.style.background = objColor[generFront(parseFloat((el.value * 0.069).toFixed(1)))]
                        }
                        else {
                            integer = el.value
                            if ((nameCar == 'КранГаличанинР858ОР178')) {
                                e.style.background = objColor[generDav(integer)]
                                //   console.log(nameCar)
                            }
                            else {
                                //   console.log('красимостальное')
                                //console.log(e)
                                e.style.background = objColor[generFront(integer)]
                            }

                        }

                    }
                })
            }
        })
    })
}


export function viewDinamic(arr, keys) {
    const conts = document.querySelectorAll('.contBar2')
    const titleMM = document.querySelectorAll('.titleMM')
    const valuePro = document.querySelectorAll('.valuePro')
    conts.forEach(el => {
        el.style.display = 'none'
    })

    const arrAll = [];



    //number[0].textContent = keys[8]
    //number[1].textContent = keys[9]
    //number[2].textContent = keys[10]
    //number[3].textContent = keys[11]

    /*
    valuePro[0].children[0].textContent = 'ост.:' + res.values[0].N1
    valuePro[0].children[1].textContent = 'изн.:' + (120 / 10 - res.values[0].N1).toFixed(1)
    valuePro[1].children[0].textContent = 'ост.:' + res.values[0].N2
    valuePro[1].children[1].textContent = 'изн.:' + (120 / 10 - res.values[0].N2).toFixed(1)
    valuePro[2].children[0].textContent = 'ост.:' + res.values[0].N3
    valuePro[2].children[1].textContent = 'изн.:' + (120 / 10 - res.values[0].N3).toFixed(1)
    valuePro[3].children[0].textContent = 'ост.:' + res.values[0].N4
    valuePro[3].children[1].textContent = 'изн.:' + (120 / 10 - res.values[0].N4).toFixed(1)
*/




    arr.forEach(el => {
        arrAll.push(el * 10)
    })

    let y1;
    let y2;
    let y3;
    let y4;

    if (arrAll.length == 2) {
        y1 = (120 - arrAll[0]) / 2
        y2 = (120 - arrAll[1]) / 2
        conts[0].style.display = 'block'
        conts[0].style.width = '348px'
        protekGrafTwo(y1, y2)

        titleMM[0].style.display = 'flex'
        titleMM[1].style.display = 'flex'

        titleMM[0].style.position = 'absolute'
        titleMM[0].style.bottom = 0
        titleMM[0].style.left = '30px'
        position: absolute;
        bottom: 0;
        left: '30px';
        valuePro[0].children[0].textContent = 'ост.:' + arrAll[0] / 10
        valuePro[0].children[1].textContent = 'изн.:' + (120 / 10 - arrAll[0] / 10).toFixed(1)
        valuePro[1].children[0].textContent = 'ост.:' + arrAll[1] / 10
        valuePro[1].children[1].textContent = 'изн.:' + (120 / 10 - arrAll[1] / 10).toFixed(1)


    }
    if (arrAll.length == 3) {
        y1 = (120 - arrAll[0]) / 2
        y2 = (120 - arrAll[1]) / 2
        y3 = (120 - arrAll[2]) / 2

        conts[0].style.display = 'block'
        conts[1].style.display = 'block'
        conts[0].style.width = '174px'
        conts[1].style.width = '174px'
        protekGrafThree(y1, y2, y3)
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
        protekGrafFour(y1, y2, y3, y4)
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
