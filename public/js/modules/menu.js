
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

//const y= -2E-18x^6+3E-14x^5-2E-10x^4+4E-07x^3-0.0004x^2+0.2111x-8.851
//const y2 = 0.2111x
//const y1 = -0.000000000000000002 * 90 * 90 * 90 * 90 * 90 * 90 + 0.00000000000003 * 90 * 90 * 90 * 90 * 90 - 0.0000000002 * 90 * 90 * 90 * 90 + 0.0000004 * 90 * 90 * 90 - 0.0004 * 90 * 90 + 0.2111 * 90 - 8.851
//console.log(y1)
//console.log(Math.E * 2)
const ex = 777
var x6 = Math.pow(0.000000000000000002 * ex, 6);
var x5 = Math.pow(0.00000000000003 * ex, 5);
var x4 = Math.pow(0.0000000002 * ex, 4);
var x3 = Math.pow(0.0000004 * ex, 3);
var x2 = Math.pow(0.0004 * ex, 2);
var x = Math.pow(0.2111 * ex, 1);
const rez1 = -0.000000000000000002 * 531441000000  // -0.000000000000000002
const rez2 = 0.00000000000003 * 5904900000//0.00000000000003
const rez3 = -0.0000000002 * 65610000//-0.0000000002
const rez4 = 0.0000004 * 729000//0.0000004
const rez5 = -0.0004 * 8100
const rez6 = 0.2111 * 90
const rez7 = -8.851

const result = rez1 + rez2 + rez3 + rez4 + rez5 + rez6 + rez7
console.log(rez1, rez2, rez3, rez4, rez5, rez6, rez7)
//console.log((-x6 + x5 - x4 + x3 - x2 + x - 8.851) * 0.9979)

const rezal = func(3100)
function func(x0) {
    const coef2 = [-2E-18, 3E-14, -2E-10, 4E-07, -0.0004, 0.2111, -8.851]
    let y = 0;
    let count = 0;
    const r = 0.9979
    for (var i = coef2.length - 1; i > coef2[0]; i--) {
        console.log(i)
        console.log(coef2[count])
        const u = coef2[count] * Math.pow(x0, i);
        y += coef2[count] * Math.pow(x0, i);
        console.log(y)
        count++

    }
    return y * r;
}
console.log(rezal)