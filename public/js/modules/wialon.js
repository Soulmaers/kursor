//import { chrt1 } from './canvas.js'
import { drawMyLine } from './strelaKran.js';
import { geoPosition } from './requests.js'
//запрос на wialon за данными по скорости
export function graf(t1, t2, int, id) {
    //console.log(t1, t2, int, id)
    const prms2 = {
        "itemId": id,   //25343786,

        "timeFrom": t1,//t1,//timeFrom,//1657205816,
        "timeTo": t2,//t2,//nowDate,//2757209816,
        "flags": 1,
        "flagsMask": 65281,
        "loadCount": 161000//82710
    }
    const remote2 = wialon.core.Remote.getInstance();
    remote2.remoteCall('messages/load_interval', prms2,
        function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            const arr2 = Object.values(result);
            // console.log(arr2)
            const arrIterTime = [];
            const arrIterTimeDate = [];
            arr2[1].forEach(el => {
                arrIterTime.push(el.t);
            })
            arrIterTime.forEach(item => {
                const dateObj = new Date(item * 1000);
                const utcString = dateObj.toString();
                const arrTimeDate = utcString.slice(8, 24);
                arrIterTimeDate.push(arrTimeDate);
            })
            let t = 0;
            const arrIterTimeDateT = arrIterTimeDate.filter(e => (++t) % int === 0);
            // console.log(arrIterTimeDateT)
            const arrSpee = [];
            arr2[1].forEach(el => {
                arrSpee.push(el.pos.s)
            })
            let s = 0;
            const arrSpeed = arrSpee.filter(e => (++s) % int === 0)
            chrt1(arrSpeed, arrIterTimeDateT);

        });
}

export function geoloc() {
    // console.log('запуск карты')
    let nowDate = Math.round(new Date().getTime() / 1000)
    let nDate = new Date();
    let timeFrom = Math.round(nDate.setHours(nDate.getHours() - 12) / 1000);
    //  console.log(timeFrom)


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
            //  console.log(arr1[5])
            const active = document.querySelector('.color')

            //   console.log(act)
            arrCar.forEach(it => {
                const active = document.querySelector('.color')
                const act = active.children[0].textContent
                //  console.log(active)
                if (it.nm === act) {
                    //  console.log(act)
                    const prmsT = {
                        "itemId": it.id,
                        "timeFrom": timeFrom,//1657205816,
                        "timeTo": nowDate,//2757209816,
                        "flags": 1,
                        "flagsMask": 65281,
                        "loadCount": 82710
                    }
                    //   console.log('запуск гео')

                    const remoteT = wialon.core.Remote.getInstance();
                    remoteT.remoteCall('messages/load_interval', prmsT,
                        function (code, result) {
                            if (code) {
                                console.log(wialon.core.Errors.getErrorText(code));
                            }
                            const arr2 = Object.values(result);
                            //  console.log(arr2[1])
                            // console.log(arr2[1][0].pos.x)
                            //  console.log(arr2[1][0].pos.y)
                            const geo = [];
                            const arrIterTimeDate = [];
                            var rows = arr2[1].length;
                            for (var i = 0; i < rows; i++) {
                                geo.push([]);
                            }
                            geo.forEach((el, index) => {
                                el.push(arr2[1][index].pos.y, arr2[1][index].pos.x);
                            })

                            geoPosition(geo);
                        })
                }
            });
        })
}

export function iconParams() {
    // console.log('икон')
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
            //    console.log(arr1[5])

            //check = arr1[5][2].lmsg.p.pwr_ext;
            loadAkb(arrCar);
        });
}

function addZero(digits_length, source) {
    let text = source + '';
    while (text.length < digits_length)
        text = '0' + text;
    return text;
}
function loadAkb(arrCar) {
    const active = document.querySelector('.color')
    const act = active.children[0].textContent


    let akb;
    let probeg;
    let oil;

    arrCar.forEach(it => {
        if (it.nm === act) {
            akb = (it.lmsg.p.pwr_ext).toFixed(1);
            if (it.lmsg.p.mileage) {
                probeg = (it.lmsg.p.mileage).toFixed(0);
                const odometr = addZero(8, probeg)
                const probegElem = document.querySelector('.probeg_value')
                probegElem.textContent = odometr + 'км'
                const toElem = document.querySelector('.to_value')

                const to = addZero(5, (10000 - probeg))
                toElem.textContent = to + 'км'
                //  console.log(odometr)
            }
            if (it.lmsg.p.rs485fuel_level6) {
                oil = (it.lmsg.p.rs485fuel_level6 * 0.0589).toFixed(0);

                const oilElem = document.querySelector('.oil_value')
                oilElem.textContent = oil + 'л'
                //  console.log(odometr)
            }

            //  console.log(akb)
            const akbElem = document.querySelector('.akb_value')
            akbElem.textContent = akb + 'V'
            const akbElems = document.querySelector('.akb_values')
            akbElems.textContent = akb + 'V'

        }
    })
    //  console.log(val)

}