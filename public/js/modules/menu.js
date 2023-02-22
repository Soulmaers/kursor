
import { navigator } from './navigator.js'
import { speed } from './speed.js'
import { contur } from './visual.js'
import { loadParamsView } from './paramsTyresView.js'
import { objColor, generT, generFront, generDav } from './content.js'

//0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178-токен основной

export function init(kluch) {
    wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com");
    wialon.core.Session.getInstance().loginToken(kluch, "", // try to login
        function (code) {
            if (code) {
                return;
            }

            zapros() //делаем запрос на wialon получаем объекты

        });
};

const wrapContaint = document.querySelector('.wrapper_containt')
const cont = document.createElement('div')
cont.classList.add('container2')
wrapContaint.appendChild(cont);
export let dann;
export function zapros() {

    const flags = 1 + 1024//4096
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
            //  console.log(result)
            const arr1 = Object.values(result);
            const arrCar = arr1[5];
            console.log(arr1[5])

            //check = arr1[5][2].lmsg.p.pwr_ext;
            arrCar.forEach(el => {
                //   el.nm.replace(/\s+/g, '')
                loadParamsViewList(el.nm) //запрос в базу с массивом имен машин за готовыми моделями
                //setInterval(loadParamsViewList, 6000, el.nm)

            })

            const nav = document.querySelectorAll('.listItem')
            const navlist = document.querySelectorAll('.carList')
            //  setTimeout(navigator, 1300)

            dann = arrCar
            speed(arrCar)
            return dann
        });

}


function loadParamsViewList(car) {
    //  console.log('запуск')
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
            //   console.log(model)
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



