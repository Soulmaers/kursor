
import { navigator } from './navigator.js'
import { speed } from './speed.js'
import { loadParamsViewList, conturTest } from './spisok.js'
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
            console.log('после')
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
        async function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            const arr1 = Object.values(result);
            const arrCar = arr1[5];
            dann = arrCar

            const test = await Promise.all(arrCar.map(el => {
                return loadParamsViewList(el.nm) //запрос в базу с массивом имен машин за готовыми моделями
            })
            )
            const tt = new Date()
            //  console.log(test, tt)
            conturTest(test)
            //  dann = arrCar
            speed(arrCar)
            return dann
        });
    // navigator()

    //console.log(allMassiv[0].length)
}


