
import { navigator } from './navigator.js'
import { speed } from './speed.js'
import { viewList, viewOs } from './visual.js'
import { loadParamsView } from './paramsTyresView.js'
import { objColor, generT, generFront, generDav } from './content.js'

export function init() {
    wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com");
    wialon.core.Session.getInstance().loginToken("0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178", "", // try to login
        function (code) {
            if (code) {
                return;
            }

            zapros() //делаем запрос на wialon получаем объекты

        });
};

export function zapros() {
    const flags = 1 + 1024
    const prms = {
        "spec": {
            "itemsType": "avl_unit",
            "propName": "sys_name",
            "propValueMask": "*",
            "sortType": "sys_name"
        },
        "force": 1,
        "flags": flags,
        "from": 0,
        "to": 0
    };

    const remote1 = wialon.core.Remote.getInstance();
    remote1.remoteCall('core/search_items', prms,
        function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            const arr1 = Object.values(result);
            const arrCar = arr1[5];
            console.log(arr1[5])


            arrCar.forEach(el => {
                //   el.nm.replace(/\s+/g, '')
                loadParamsViewList(el.nm) //запрос в базу с массивом имен машин за готовыми моделями
                //  setInterval(loadParamsViewList, 6000, el.nm)

            })

            const nav = document.querySelectorAll('.listItem')
            const navlist = document.querySelectorAll('.carList')
            setTimeout(navigator, 300)
            //  navigator(nav)
            // navigator(nav)
            // navigator(navlist)

            speed(arrCar)
            return arrCar
            //   geoloc(arrCar)
        });

}


function loadParamsViewList(car) {
    console.log('запуск')
    // console.log(car)
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
            console.log(model)
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
                            //  console.log(data)
                            //  console.log(models)
                            // console.log(model, models)
                            // viewList(model, data.message, data.result, models.values)
                            contur(model, data.message, data.result, models.values);
                        })
                })

        })
}



const convert = (ob) => {
    const uniq = new Set(ob.map(e => JSON.stringify(e)));
    return Array.from(uniq).map(e => JSON.parse(e));
}


export const twoTyres = ` 
    <div class="frontSpare">
        <div class="tiresProfil spareWill1"></div>
        <div class="tiresProfil spareWill12"></div>
        <div class="imgDivTires"><img class="img" src="./image/kol.png"></div>
           </div>`

export const forTyres = `
<div class="frontSpare sparka">
    <div class="tiresUp">
        <div class="tiresProfil spareWill1_1"></div>
        <div class="tiresProfil spareWill1_2"></div>
    </div>
    <div class="tiresDown">
        <div class="tiresProfil spareWill1_3"></div>
        <div class="tiresProfil spareWill1_4"></div>
    </div>
    <div class="imgDivTires"><img class="img" src="./image/kol.png"></div>
</div>`


export function contur(model, message, arg, params) {
    console.log(model, message)
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
    r.forEach((el, index) => {
        shina[index].setAttribute('id', el);
    })
    arg.forEach((el) => {
        params.forEach((item) => {
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
    // 
}
