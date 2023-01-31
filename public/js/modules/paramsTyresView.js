
import { view, sensor, viewConfigurator } from './visual.js'
import { saveTyres } from './event.js'
import { objColor, generT, generFront, generDav } from './content.js'
import { liCreate } from './visual.js'


const kolesos = [];
export function viewMenuParams() {
    const speedGraf = document.querySelector('.speedGraf')
    const titleSens = document.querySelector('.title_sens')
    const btnsens = document.querySelectorAll('.btnsens')
    const wrapperButton = document.querySelector('.wrapper_button')
    const obo = document.querySelector('.obo')
    const tiresLink = document.querySelectorAll('.tires_link')
    tiresLink.forEach(e => {
        e.addEventListener('click', () => {
            console.log('старт')
            kolesos.push(e)
            speedGraf.style.display = 'none';
            sensor(btnsens, titleSens, obo)
            tiresLink.forEach(e => {
                obo.style.display = 'none'
                titleSens.style.display = 'none'
                wrapperButton.style.display = 'none'
                const msg = document.querySelectorAll('.msg')
                msg.forEach(el => el.classList.remove('act'))
            });
            wrapperButton.style.display = 'flex';
            tiresLink.forEach(el => el.classList.remove('tiresActiv'));
            e.classList.add('tiresActiv')
        })
    })
    koleso(kolesos, btnsens)
}

export function loadParamsView() {
    const active = document.querySelectorAll('.color')
    // console.log(active)
    const activePost = active[0].textContent.replace(/\s+/g, '')
    // console.log(JSON.stringify({ activePost }))
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
            const osi = document.querySelectorAll('.osi')
            const centerOs = document.querySelectorAll('.centerOs')
            if (model.values.length > 0) {
                model.values.forEach(el => {
                    osi[el.osi - 1].style.display = 'flex';
                    centerOs[el.osi - 1].style.display = 'flex';
                    el.trailer == 'Прицеп' ?
                        centerOs[el.osi - 1].style.backgroundImage = "url('../image/line_gray.png')" :
                        centerOs[el.osi - 1].style.backgroundImage = "url('../image/line_red.png')"
                    if (el.tyres == 2) {
                        centerOs[el.osi - 1].previousElementSibling.children[0].style.display = 'flex';
                        centerOs[el.osi - 1].nextElementSibling.children[1].style.display = 'flex';
                        centerOs[el.osi - 1].previousElementSibling.children[1].style.display = 'none';
                        centerOs[el.osi - 1].nextElementSibling.children[0].style.display = 'none';
                    }
                    else {
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
        }),
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
                //    console.log(params)
                // console.log(JSON.stringify({ body }))
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
                        //    console.log(data)
                        data.values.sort((prev, next) => {
                            if (prev.name < next.name) return -1;
                            if (prev.name < next.name) return 1;
                        })
                        //   console.log(data.values, params.values)
                        view(data.values)
                        viewConfigurator(data.values, params.values)
                    })
            })
}
function koleso(kol, btnsens) {
    liCreate()
    const msg = document.querySelectorAll('.msg')
    const paramPress = [];
    const paramTemp = [];
    let prmsD = [];
    let prmsT = [];
    // console.log(msg)
    msg.forEach(el => {
        el.addEventListener('click', () => {
            //    console.log('запуск')
            const arrSpreed = [...el.textContent]
            let value;
            arrSpreed.forEach(el => {
                if (el === ':') {
                    value = arrSpreed.splice(arrSpreed.indexOf(el) + 1, arrSpreed.length - 1).join('')
                }
            })
            if (btnsens[0].classList.contains('actBTN')) {
                //  console.log('запуск1')
                arrSpreed.forEach(el => {
                    if (el === ':') {
                        prmsD.push(arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join(''))
                    }
                })
                //console.log(job3.value)
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
                value.length > 10 ?
                    kol[kol.length - 1].children[1].textContent = '-' :
                    kol[kol.length - 1].children[1].textContent = value + '°'
                kol[kol.length - 1].children[1].style.background = objColor[generT(value)];
                paramTemp.push(el)
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
    saveTyres(massivionbd)
}