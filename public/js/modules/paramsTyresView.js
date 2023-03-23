
import { view, sensor, viewConfigurator, pricep } from './visual.js'
import { saveTyres } from './event.js'
import { objColor, generT, generFront, generDav } from './content.js'
import { liCreate } from './visual.js'
import { tech } from './tech.js'


const kolesos = [];
export function viewMenuParams() {
    const speedGraf = document.querySelector('.speedGraf')
    const titleSens = document.querySelector('.title_sens')
    const btnsens = document.querySelectorAll('.btnsens')
    const wrapperButton = document.querySelector('.wrapper_button')
    const wrapperMap = document.querySelector('.wrapper_left')
    // console.log(wrapperMap)
    const obo = document.querySelector('.obo')
    const tiresLink = document.querySelectorAll('.tires_link')
    const techInfo = document.querySelector('.techInfo')
    tiresLink.forEach(e => {
        e.addEventListener('click', () => {
            if (e.classList.contains('tiresActiv')) {
                e.classList.remove('tiresActiv')
                techInfo.style.display = 'none'
                wrapperMap.style.display = 'block'
                return
            }
            //  console.log('нажал')
            kolesos.push(e)
            speedGraf.style.display = 'none';
            sensor(btnsens, titleSens, obo)
            tiresLink.forEach(e => {
                obo.style.display = 'none'
                titleSens.style.display = 'none'
                wrapperButton.style.display = 'none'
                const msg = document.querySelectorAll('.msg')
                msg.forEach(el => el.classList.remove('act'))
                e.classList.remove('tiresActiv')
            });
            wrapperButton.style.display = 'flex';
            e.classList.add('tiresActiv')
            techInfo.style.display = 'block'
            speedGraf.style.display = 'block';
            wrapperMap.style.display = 'none'
            tech()//отображаем тех.характеристики+логика формул+забираем нужные данные в базу.
        })
    })
    koleso(kolesos, btnsens)
}

export async function loadParamsView() {
    // console.log('условия изменены')
    clearInterval(viewPokasateli)
    const titleCar = document.querySelector('.title_two')
    const btnShina = document.querySelectorAll('.plug')
    const listItem = document.querySelectorAll('.link_menu')[0]
    // console.log(listItem)
    //   console.log('запуск')
    let activePost;
    const active = document.querySelectorAll('.color')
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.listItem')[0]
        //    console.log(listItem.textContent)
        activePost = listItem.textContent.replace(/\s+/g, '')
        titleCar.textContent = listItem.textContent
    }
    else {
        activePost = active[0].textContent.replace(/\s+/g, '')
    }

    fetch('api/modelView', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ activePost }))
    })
        .then((res) => res.json())
        .then((res) => {
            const model = res
            // console.log(model)
            const osi = document.querySelectorAll('.osi')
            const centerOs = document.querySelectorAll('.centerOs')
            if (model.values.length > 0) {
                //   console.log('база целая')
                //  console.log(model.values)
                model.values.forEach(el => {

                    osi[el.osi - 1].style.display = 'flex';
                    centerOs[el.osi - 1].style.display = 'flex';
                    //  console.log(centerOs[el.osi - 1])
                    el.trailer == 'Прицеп' ?
                        pricep(centerOs[el.osi - 1])
                        :
                        centerOs[el.osi - 1].children[0].style.background = "#3333FF"
                    if (el.tyres == 2) {
                        btnShina[0].classList.contains('active') ? centerOs[el.osi - 1].children[0].style.width = '200px' :
                            centerOs[el.osi - 1].children[0].style.width = '150px'
                        centerOs[el.osi - 1].previousElementSibling.children[0].style.display = 'flex';
                        centerOs[el.osi - 1].nextElementSibling.children[1].style.display = 'flex';
                        centerOs[el.osi - 1].previousElementSibling.children[1].style.display = 'none';
                        centerOs[el.osi - 1].nextElementSibling.children[0].style.display = 'none';
                    }
                    else {
                        centerOs[el.osi - 1].children[0].style.width = '74px'
                        centerOs[el.osi - 1].previousElementSibling.children[0].style.display = 'flex';
                        centerOs[el.osi - 1].previousElementSibling.children[1].style.display = 'flex';
                        centerOs[el.osi - 1].nextElementSibling.children[0].style.display = 'flex';
                        centerOs[el.osi - 1].nextElementSibling.children[1].style.display = 'flex';
                    }
                })
            }
            else {
                console.log('база пустая')
            }

        })

    viewPokasateli()
    setInterval(viewPokasateli, 12000)
}

export function viewPokasateli() {
    // console.log('запускВиджет')
    const btnShina = document.querySelectorAll('.plug')
    if (btnShina[0].classList.contains('active') === true) {
        return
    }

    let activePost;
    const active = document.querySelectorAll('.color')
    /* if (active[0].textContent == 'Кран 858') {
         active[0].textContent = 'КранГаличанин Р858ОР178'
     }*/
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.listItem')[0]
        activePost = listItem.textContent.replace(/\s+/g, '')
    }
    else {
        activePost = active[0].textContent.replace(/\s+/g, '')
    }

    fetch('api/tyresView', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ activePost }))
    })
        .then((res) => res.json())
        .then((res) => {
            const params = res
            //   console.log(params)
            fetch('api/wialon', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: (JSON.stringify({ activePost }))
            })
                .then((res) => res.json())
                .then((res) => {
                    const data = res
                    // console.log(data)
                    data.values.sort((prev, next) => {
                        if (prev.name < next.name) return -1;
                        if (prev.name < next.name) return 1;
                    })
                    view(data.values)
                    //   console.log(data.values, params.values)
                    viewConfigurator(data.values, params.values)
                })
        })

    //   btnShina.classList.contains('active') === true ?  : viewPokasateli(), setInterval(viewPokasateli, 6000);

}
function koleso(kol, btnsens) {
    const active = document.querySelectorAll('.color')
    liCreate()
    const msg = document.querySelectorAll('.msg')
    // console.log(msg)
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
                    //console.log(value)
                }
            })
            if (btnsens[0].classList.contains('actBTN')) {
                arrSpreed.forEach(el => {
                    if (el === ':') {
                        prmsD.push(arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join(''))
                    }
                })
                if (active[0].textContent == 'PressurePro 933') {
                    value = (value * 0.069).toFixed(1)
                }
                else {
                    value
                }
                const valJob = value

                valJob.length > 10 ?
                    kol[kol.length - 1].children[0].textContent = '-' :
                    kol[kol.length - 1].children[0].textContent = valJob + '\nБар'
                kol[kol.length - 1].children[0].style.background = objColor[generFront(valJob)];
                paramPress.push(el)
            }
            if (btnsens[1].classList.contains('actBTN')) {
                arrSpreed.forEach(el => {
                    if (el === ':') {
                        prmsT.push(arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join(''))
                    }
                })
                if (value === '-128' || value === '-51' || value.length > 10) {
                    value = 'err'
                    kol[kol.length - 1].children[1].textContent = value
                }
                else {
                    kol[kol.length - 1].children[1].textContent = value + '°'
                    kol[kol.length - 1].children[1].style.background = objColor[generT(value)];
                }
                paramTemp.push(el)
                //  console.log(paramPress, paramTemp)
                valid(paramPress, paramTemp)
            }
            kol[kol.length - 1].children[2].textContent = 'p:' + prmsD[prmsD.length - 1] + '\nt:' + prmsT[prmsT.length - 1]
        })
    })
}


const massivion = [];
export const massivionbd = [];
function valid(paramPress, paramTemp) {
    const kol = kolesos[kolesos.length - 1];
    const kolId = kolesos[kolesos.length - 1].id;
    const dav = paramPress[paramPress.length - 1]
    const temp = paramTemp[paramTemp.length - 1]
    const arrSpreed1 = [...dav.textContent]
    let value;
    arrSpreed1.forEach(el => {
        if (el === ':') {
            value = arrSpreed1.splice(arrSpreed1[0] + 1, arrSpreed1.indexOf(el)).join('')
        }
    })
    const arrSpreed2 = [...temp.textContent]
    let value2;
    arrSpreed2.forEach(el => {
        if (el === ':') {
            value2 = arrSpreed2.splice(arrSpreed2[0] + 1, arrSpreed2.indexOf(el)).join('')
        }
    })
    const mass = [];
    mass.push(kol, dav, temp)
    const massbd = [];
    massbd.push(kolId, value, value2)
    massivion.push(mass)
    massivionbd.push(massbd)
    // console.log(massivionbd)
    saveTyres(massivionbd)
}