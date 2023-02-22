import { convert } from './visual.js'
import { dashView } from './dash.js'
import { twoTyres, forTyres } from './content.js'
import { objColor, generFront, generDav } from './content.js'

export function loadParamsViewList(car) {
    fetch('api/listModel', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ car }))
    })
        .then((res) => res.json())
        .then((res) => {
            const model = res
            fetch('api/listTyres', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: (JSON.stringify({ car }))
            })
                .then((res) => res.json())
                .then((res) => {
                    const models = res
                    fetch('api/wialonAll', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: (JSON.stringify({ car }))
                    })
                        .then((res) => res.json())
                        .then((res) => {
                            const data = res
                            contur(model, data.message, data.result, models.result);
                        })
                })
        })
}




function contur(model, message, arg, params) {
    dashView(message)
    const nameCar = model.message.replace(/\s+/g, '')
    const listArr = document.querySelector('.list_arr2')
    const listItemCar = document.createElement('div')
    listItemCar.classList.add('listItem')
    listItemCar.classList.add(`${nameCar}`)
    listArr.appendChild(listItemCar)
    const listName = document.createElement('div')
    listName.classList.add('list_name2')
    listItemCar.appendChild(listName)
    listName.textContent = message
    const listProfil = document.createElement('div')
    listProfil.classList.add('list_profil2')
    listItemCar.appendChild(listProfil)
    const listTrail = document.createElement('div')
    listTrail.classList.add('list_trail2')
    listItemCar.appendChild(listTrail)
    const modelUniq = convert(model.result)
    modelUniq.forEach(os => {
        const osi = document.createElement('div')
        osi.classList.add('osi_list')
        os.trailer === 'Прицеп' ? listTrail.appendChild(osi) : listProfil.appendChild(osi)
        os.tyres === 2 ? osi.innerHTML = twoTyres : osi.innerHTML = forTyres
    })
    const listItem = document.querySelector(`.${nameCar}`)
    const shina = listItem.querySelectorAll('.tiresProfil');
    const modelUniqValues = convert(params)
    const r = [];
    let integer;
    modelUniqValues.forEach(el => {
        r.push(el.tyresdiv)
    })
    const uniq = convert(r)
    uniq.forEach((el, index) => {
        shina[index].setAttribute('id', el);
    })
    arg.forEach((el) => {
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
}

function zaprosSpisok() {
    const list = document.querySelectorAll('.listItem')
    list.forEach(el => {
        const car = el.children[0].textContent
        fetch('api/listTyres', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ car }))
        })
            .then((res) => res.json())
            .then((res) => {
                const params = res
                fetch('api/wialonAll', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: (JSON.stringify({ car }))
                })
                    .then((res) => res.json())
                    .then((res) => {
                        const data = res
                        viewListKoleso(data, params, el)
                    })
            })
    })
}

setInterval(zaprosSpisok, 6000)

function viewListKoleso(arg, params, nameCar) {
    const shina = nameCar.querySelectorAll('.tiresProfil');
    const modelUniqValues = convert(params.result)
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
                        if (nameCar.children[0].textContent == 'PressurePro 933') {
                            integer = parseFloat((el.value * 0.069).toFixed(1))
                            e.style.background = objColor[generFront(parseFloat((el.value * 0.069).toFixed(1)))]
                        }
                        else {
                            integer = el.value
                            if ((nameCar.children[0].textContent == 'КранГаличанин Р858ОР178')) {
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
}

