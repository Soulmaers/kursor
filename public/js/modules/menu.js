
import { speed } from './speed.js'
import { loadParamsViewList, conturTest } from './spisok.js'
import { checkCreate } from './admin.js'



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
    const tiresActiv = document.querySelector('.tiresActiv')
    if (tiresActiv) {
        tiresActiv.remove()
    }
    console.log('работаем запрос')
    const flagsT = 1 + 1024// + 1024//4096
    const prmsT = {
        "spec": {
            "itemsType": "avl_unit_group",
            "propName": "sys_name",
            "propValueMask": "*",
            "sortType": "sys_name"
        },
        "force": 1,
        "flags": flagsT,
        "from": 0,
        "to": 0xffffffff
    };
    const remoteT = wialon.core.Remote.getInstance();
    remoteT.remoteCall('core/search_items', prmsT,
        async function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            console.log(result)
            await result
            const aLLmassObject = [];
            let Allcountr = 0;
            result.items.forEach(elem => {
                Allcountr++
                const nameGroup = elem.nm
                const nameObject = elem.u
                console.log(nameGroup)
                const massObject = [];
                let countr = 0;
                nameObject.forEach(el => {
                    console.log(el)
                    const prms2 = {
                        "id": el,
                        "flags": 1025
                    };

                    const remote3 = wialon.core.Remote.getInstance();
                    remote3.remoteCall('core/search_item', prms2,
                        async function (code, result) {
                            if (code) {
                                console.log(wialon.core.Errors.getErrorText(code));
                            }
                            const arr3 = await result
                            console.log(arr3)
                            if (!arr3.item.nm) {
                                return
                            }
                            const objects = arr3.item.nm
                            const prob = await loadParamsViewList(objects)
                            const role = document.querySelectorAll('.log')[0].textContent
                            const login = document.querySelectorAll('.log')[1].textContent
                            const massObjectCar = await dostupObject(login)
                            if (massObjectCar.includes(prob[0].message.replace(/\s+/g, ''))) {
                                massObject.push(await loadParamsViewList(objects))
                            }
                            countr++
                            if (countr === nameObject.length) {
                                massObject.forEach(e => {
                                    e.group = nameGroup
                                })
                                aLLmassObject.push(massObject)
                            }
                            if (aLLmassObject.length === Allcountr) {
                                console.log(aLLmassObject)
                                conturTest(aLLmassObject)
                                // const nameCarCheck = test.map(elem => elem[0].message)
                                // checkCreate(nameCarCheck)
                            }
                        })
                })
            });
        })
    /*
    const flagss = 1 + 4096//4096
    const prmss = {
    "spec": [{
        "type": 'id',
        "data": 26702383,//26702383,//26702371,
        "flags": 1048576,                 //    1048576
        "mode": 0
    }
    ]
    }
    const remote1s = wialon.core.Remote.getInstance();
    remote1s.remoteCall('core/update_data_flags', prmss,
    async function (code, result) {
        if (code) {
            console.log(wialon.core.Errors.getErrorText(code));
        }
        console.log(result)
     
     
    });*/

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
            console.log(result)
            const arr1 = Object.values(result);
            const arrCar = arr1[5];
            dann = arrCar
            const test = await Promise.all(arrCar.map(el => {
                return loadParamsViewList(el.nm) //запрос в базу с массивом имен машин за готовыми моделями
            })
            )
            const nameCarCheck = test.map(elem => elem[0].message)
            checkCreate(nameCarCheck)
            speed(arrCar)
            return dann
        });

}

async function dostupObject(name) {
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ name }))
    }
    const res = await fetch('/api/viewCheckObject', param)
    const response = await res.json()
    const nameCarCheck = response.result.map(elem => elem.Object)
    return nameCarCheck
}
