
import { view, viewConfigurator, pricep } from './visual.js'
import { saveTyres } from './event.js'
import { objColor, generT, generFront, generDav } from './content.js'
import { liCreate, viewOs } from './visual.js'
import { tech } from './tech.js'
import { modalOs } from './modalOs.js'

export const arrayTyres = [];
export function viewMenuParams() {
    const kolesos = [];
    const speedGraf = document.querySelector('.speedGraf')
    const titleSens = document.querySelector('.title_sens')
    const btnsens = document.querySelectorAll('.btnsens')
    const sensors = document.querySelector('.sensors')
    const wrapperMap = document.querySelector('.wrapper_left')
    // console.log(wrapperMap)
    const obo = document.querySelector('.obo')
    const tiresLink = document.querySelectorAll('.tires_link')
    const techInfo = document.querySelector('.techInfo')
    const grafics = document.querySelector('.grafics')
    const plug = document.querySelectorAll('.plug')
    const tableTarir = document.querySelector('.tableTarir')
    const idbaseTyres = document.querySelector('.idbaseTyres')
    idbaseTyres.textContent = ''
    const arrayTyres = [];
    tiresLink.forEach(e => {
        e.addEventListener('click', () => {
            if (e.classList.contains('tiresActiv')) {
                e.classList.remove('tiresActiv')
                techInfo.style.display = 'none'
                tableTarir.style.display = 'none'
                wrapperMap.style.display = 'block'

                if (plug[1].classList.contains('activGraf')) {
                    grafics.style.display = 'flex';
                    wrapperMap.style.display = 'none'
                }

                return
            }
            //  console.log('нажал')
            kolesos.push(e)
            speedGraf.style.display = 'none';
            //sensor(btnsens, titleSens, obo)
            tiresLink.forEach(e => {
                obo.style.display = 'none'
                titleSens.style.display = 'none'
                sensors.style.display = 'none'
                tableTarir.style.display = 'none'
                const msg = document.querySelectorAll('.msg')
                msg.forEach(el => el.classList.remove('act'))
                e.classList.remove('tiresActiv')
            });
            sensors.style.display = 'flex';
            e.classList.add('tiresActiv')
            btnsens[0].style.display = 'flex'
            btnsens[1].style.display = 'flex'
            techInfo.style.display = 'block'
            speedGraf.style.display = 'block';
            wrapperMap.style.display = 'none'
            grafics.style.display = 'none';
            tableTarir.style.display = 'none'
            const idbaseTyres = document.querySelector('.idbaseTyres')
            idbaseTyres.textContent = ''
            tech()//отображаем тех.характеристики+логика формул+забираем нужные данные в базу.
        })
    })
    koleso(kolesos, btnsens)
}

export async function loadParamsView() {
    clearInterval(viewPokasateli)
    const titleCar = document.querySelector('.title_two')
    const btnShina = document.querySelectorAll('.modals')
    const listItem = document.querySelectorAll('.link_menu')[0]
    const container = document.querySelector('.container')
    let activePost;
    const active = document.querySelectorAll('.color')
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.listItem')[0]
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
            const gos = document.querySelector('.gosNumber')
            const model = res
            if (model.values && model.values.length > 0) {
                viewOs(model.values.length)
                const osi = document.querySelectorAll('.osi')
                const centerOs = document.querySelectorAll('.centerOs')
                model.values.forEach(el => {
                    el.trailer == 'Прицеп' ?
                        pricep(centerOs[el.osi - 1])
                        : noPricep(centerOs[el.osi - 1])



                    if (el.tyres == 2) {
                        btnShina[1].classList.contains('active') ? centerOs[el.osi - 1].children[0].style.width = '212px' :
                            centerOs[el.osi - 1].children[0].style.width = '212px'
                        centerOs[el.osi - 1].previousElementSibling.children[0].style.display = 'flex';
                        centerOs[el.osi - 1].nextElementSibling.children[1].style.display = 'flex';
                        centerOs[el.osi - 1].previousElementSibling.children[1].style.display = 'none';
                        centerOs[el.osi - 1].nextElementSibling.children[0].style.display = 'none';
                    }
                    else if (el.tyres == 4) {
                        centerOs[el.osi - 1].children[0].style.width = '114px'
                        centerOs[el.osi - 1].previousElementSibling.children[0].style.display = 'flex';
                        centerOs[el.osi - 1].previousElementSibling.children[1].style.display = 'flex';
                        centerOs[el.osi - 1].nextElementSibling.children[0].style.display = 'flex';
                        centerOs[el.osi - 1].nextElementSibling.children[1].style.display = 'flex';
                    }

                })

                console.log(model.values)
                if (model.values.find(e => e.trailer === 'Прицеп')) {
                    gos.value = model.values[0].gosp
                    gos.style.display = 'flex'
                    return
                }
                gos.style.display = 'none'
            }
            else {
                console.log('база пустая')
                gos.style.display = 'none'
            }

        })

    viewPokasateli()
    setInterval(viewPokasateli, 300000)
}

function noPricep(elem) {
    const cont1 = document.querySelector('.cont1')
    cont1.append(elem.parentNode)
    cont1.style.border = '2px solid darkblue',
        cont1.style.padding = '5px',
        elem.children[0].style.background = '#000'

}

export async function viewPokasateli() {
    const btnShina = document.querySelectorAll('.modals')
    if (btnShina[1].classList.contains('active') === true) {
        return
    }
    let activePost;
    const active = document.querySelectorAll('.color')
    //console.log(active)
    /*
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.listItem')[0]
        activePost = listItem.textContent.replace(/\s+/g, '')
    }
    else { }*/
    activePost = active[0].children[0].textContent.replace(/\s+/g, '')
    // console.log(activePost)

    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ activePost }))
    }
    const paramsss = await fetch('api/tyresView', param)
    const params = await paramsss.json()
    const datas = await fetch('api/wialon', param)
    const data = await datas.json()
    const os = await fetch('api/barView', param)
    const osi = await os.json()

    data.values.sort((prev, next) => {
        if (prev.name < next.name) return -1;
        if (prev.name < next.name) return 1;
    })
    // console.log(data.values)
    view(data.values)
    viewConfigurator(data.values, params.values, osi.values)
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
                if (active[0].textContent == 'А 652 УА 198') {
                    value = (value / 10).toFixed(1)
                }
                else {
                    value
                }
                const valJob = value

                valJob.length > 10 ?
                    kol[kol.length - 1].children[0].textContent = '-' :
                    kol[kol.length - 1].children[0].textContent = valJob + '\nБар'
                kol[kol.length - 1].children[0].style.color = objColor[generFront(valJob)];
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
                    kol[kol.length - 1].children[1].style.color = objColor[generT(value)];
                }
                paramTemp.push(el)
                //const numberOs = kol[kol.length - 1].closest('.osi').children[1].id
                //  let typeOs;
                //  kol[kol.length - 1].closest('.osi').children[1].classList.contains('pricep') ? typeOs = 'Прицеп' : typeOs = 'Тягач'
                valid(paramPress, paramTemp, kol)
            }
            kol[kol.length - 1].children[2].textContent = 'p:' + prmsD[prmsD.length - 1] + '\nt:' + prmsT[prmsT.length - 1]
        })
    })
}


const massivion = [];
export const massivionbd = [];
function valid(paramPress, paramTemp, kolesos) {
    console.log(kolesos[kolesos.length - 1].closest('.osi').children[1].id)
    const kol = kolesos[kolesos.length - 1];
    const kolId = kolesos[kolesos.length - 1].id;
    const dav = paramPress[paramPress.length - 1]
    const temp = paramTemp[paramTemp.length - 1]
    const osId = kolesos[kolesos.length - 1].closest('.osi').children[1].id
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
    massbd.push(kolId, value, value2, osId)
    massivion.push(mass)
    massivionbd.push(massbd)
    console.log(massivionbd)
    saveTyres(massivionbd)
}