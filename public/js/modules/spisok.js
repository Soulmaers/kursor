import { convert, visual } from './visual.js'
import { dashView } from './dash.js'
import { navigator } from './navigator.js'
import { twoTyres, forTyres } from './content.js'
import { objColor, generFront, generDav } from './content.js'
//import { proverka, restFn } from './alarmStorage.js'
/*
let isLoaded = false

if(isLoaded === true){
    navigator();
}*/
const testov = [];
export async function loadParamsViewList(car) {
    //console.log(1)
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ car }))
    }

    const mod = await fetch('api/listModel', params)
    const model = await mod.json()
    const tyr = await fetch('api/listTyres', params)
    const models = await tyr.json()
    const dat = await fetch('api/wialonAll', params)
    const data = await dat.json()
    testov.push([model, models, data])
    // contur(model, data.message, data.result, models.result);
    //console.log(testov)

    return [model, models, data]
}

//setTimeout(conturTest, 3000, testov)
export function conturTest(testov) {
    // console.log('один раз')
    // dashView(message)\
    const tt = new Date()
    // console.log(testov, tt)
    testov.forEach(elem => {
        dashView(elem[0].message)
        //   console.log(elem[0].message)
        const nameCar = elem[0].message.replace(/\s+/g, '')
        const listArr = document.querySelector('.list_arr2')
        const listItemCar = document.createElement('div')
        listItemCar.classList.add('listItem')
        listItemCar.classList.add(`${nameCar}`)
        listArr.appendChild(listItemCar)
        const listName = document.createElement('div')
        listName.classList.add('list_name2')
        listItemCar.appendChild(listName)
        listName.textContent = elem[0].message
        const listProfil = document.createElement('div')
        listProfil.classList.add('list_profil2')
        listItemCar.appendChild(listProfil)
        const listTrail = document.createElement('div')
        listTrail.classList.add('list_trail2')
        listItemCar.appendChild(listTrail)
        const modelUniq = convert(elem[0].result)
        // console.log(modelUniq)
        modelUniq.forEach(os => {
            const osi = document.createElement('div')
            osi.classList.add('osi_list')
            os.trailer === 'Прицеп' ? listTrail.appendChild(osi) : listProfil.appendChild(osi)
            os.tyres === 2 ? osi.innerHTML = twoTyres : osi.innerHTML = forTyres
        })
        const listItem = document.querySelector(`.${nameCar}`)
        const shina = listItem.querySelectorAll('.tiresProfil');
        const modelUniqValues = convert(elem[1].result)
        const r = [];
        let integer;
        modelUniqValues.forEach(el => {
            r.push(el.tyresdiv)
        })
        const uniq = convert(r)
        uniq.forEach((el, index) => {
            shina[index].setAttribute('id', el);
        })
        elem[1].result.forEach((el) => {
            modelUniqValues.forEach((item) => {
                if (el.name == item.pressure) {
                    shina.forEach(e => {
                        if (e.id == item.tyresdiv) {
                            if (nameCar == 'PressurePro933') {
                                integer = parseFloat((el.value * 0.069).toFixed(1))
                                e.style.background = objColor[generFront(parseFloat((el.value * 0.069).toFixed(1)))]
                            }
                            else {
                                integer = el.value
                                if ((nameCar == 'КранГаличанинР858ОР178')) {
                                    e.style.background = objColor[generDav(integer)]
                                }
                                else {
                                    e.style.background = objColor[generFront(integer)]
                                }
                            }
                        }
                    })
                }
            })
        })


    })
    navigator();
    zaprosSpisok()
}

let count = 0;
function zaprosSpisok() {
    //  console.log('список')
    const list = document.querySelectorAll('.listItem')
    list.forEach(async el => {
        const car = el.children[0].textContent
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ car }))
        }


        const par = await fetch('api/listTyres', param)
        const params = await par.json()

        const dat = await fetch('api/wialonAll', param)
        const data = await dat.json()

        viewListKoleso(data, params, el)
    })
    count++
    if (count === 1) {
        setTimeout(load, 500)
        function load() {
            const preloader = document.querySelector('.preloader') /* находим блок Preloader */
            preloader.classList.add('preloader_hidden') /* добавляем ему класс для скрытия */
        }
    }
}

setInterval(zaprosSpisok, 60000)

function viewListKoleso(arg, params, nameCar) {
    const massItog = [];
    const shina = nameCar.querySelectorAll('.tiresProfil');
    const modelUniqValues = convert(params.result)
    const activePost = nameCar.children[0].textContent.replace(/\s+/g, '')
    const r = [];
    let integer;
    modelUniqValues.forEach(el => {
        r.push(el.tyresdiv)
    })
    const uniq = convert(r)
    uniq.forEach((el, index) => {
        shina[index].setAttribute('id', el);
    })
    arg.result.forEach((el) => {
        modelUniqValues.forEach((item) => {
            if (el.name == item.pressure) {
                shina.forEach(e => {
                    if (e.id == item.tyresdiv) {
                        if (activePost == 'PressurePro933') {
                            integer = parseFloat((el.value * 0.069).toFixed(1))
                            // e.classList.add('done')
                            e.style.background = objColor[generFront(parseFloat((el.value * 0.069).toFixed(1)))]
                        }
                        else {
                            integer = el.value
                            if ((activePost == 'КранГаличанинР858ОР178')) {
                                //  e.classList.add('done')
                                e.style.background = objColor[generDav(integer)]
                            }
                            else {
                                //  e.classList.add('done')
                                e.style.background = objColor[generFront(integer)]
                            }
                        }
                        arg.result.forEach((it) => {
                            if (it.name === item.temp) {
                                //      e.classList.add('done')

                                massItog.push([activePost, e, item.pressure, integer, parseFloat(it.value)])
                                //console.log(massItog)
                                //  console.log(activePost, e, item.pressure, integer, item.temp, it.value)
                            }
                        })
                    }
                })
            }
        })
    })
    // console.log(massItog)
    //   proverka(massItog, activePost)
    //  restFn(massItog, activePost)
}

