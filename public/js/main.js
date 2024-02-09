
import { zapros } from './modules/menu.js'
import { btnDel } from './modules/event.js'
import { liCreate } from './modules/visual.js'




async function init() {
    const role = document.querySelector('.role').getAttribute('rel')
    const login = document.querySelectorAll('.log')[1].textContent
    const radioVal = document.querySelector('.radioVal')
    console.log(login)
    role === 'Пользователь' ? dis() : btnDel()
    function dis() {
        const delIcon = document.querySelectorAll('.delIcon')
        delIcon.forEach(e => {
            e.style.display = 'none';
        })
        radioVal.style.marginTop = '10px'
        radioVal.style.marginLeft = '10px'
        radioVal.style.justifyContent = 'start'
        radioVal.style.display = 'none'
    }

    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ login }))

    }
    console.log(login + 'log')
    const res = await fetch('/api/viewLogs', param)
    const confirm = await res.json()
    console.log(confirm)

    zapros(login) //делаем запрос на wialon получаем объекты
    // zaprosKursor(login)
    liCreate()
    console.log(screen.width)
    console.log(screen.height)
    const wrapperFull = document.querySelector('.wrapperFull')
    const lowList = document.querySelector('.low_list')
    const start = document.querySelector('.start')
    if (screen.width < 860) {
        const newColumn = document.querySelectorAll('.newColumn')
        const newCel = document.querySelectorAll('.newCel')
        newColumn.forEach(e => e.remove())
        newCel.forEach(e => e.remove())

    }
    if (screen.width === 1366 && screen.height === 768) {
        // document.body.style.maxWidth = '1366px';
        wrapperFull.style.height = '651px'
        // wrapperFull.style.height = '693px'
        // start.style.height = '98vh'
    } else if (screen.width === 1920 && screen.height === 1080) {
        //  document.body.style.height = '1080px';
        wrapperFull.style.height = '883px'

    }

    console.log(wrapperFull.clientHeight)
    // wrapperFull.style.height = screen.height - 80 + 'px'
    lowList.style.height = wrapperFull.clientHeight - 65 + 'px';
    console.log(lowList.style.height)
}



init();



export function inits(data) {
    wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com");
    wialon.core.Session.getInstance().loginToken("0f481b03d94e32db858c7bf2d8415204977173E354D49AA7AFA37B01431539AEAC5DAD5E", "", // try to login
        function (code) {
            if (code) {
                return;
            }
            console.log(data)
            const result = data
                .map(el => Object.values(el)) // получаем массивы всех id
                .flat()
                .map(e => e[4])
                .filter(e => e !== null);
            zapross(result)
        });
};



async function zapross() {
    console.time('ggg')
    //   const arr = [27695838, 27697145, 25766831]
    const flagsAllGroup = 1 + 1024// + 1024//4096
    const prmsAllGoup = {
        "spec": {
            "itemsType": "avl_unit_group",
            "propName": "sys_name",
            "propValueMask": "*",
            "sortType": "sys_name"
        },
        "force": 1,
        "flags": flagsAllGroup,
        "from": 0,
        "to": 0xffffffff,
        "rand": Math.random() // Добавляем рандомный параметр rand
    };

    const test2 = wialon.core.Remote.getInstance();
    const r = await test2.remoteCall('core/search_items', prmsAllGoup,
        function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            console.log(result)
        })
    console.log(r)
    /*
                const promises = data.items.flatMap((elem) => {
                    const nameGroup = elem.nm;
                    const idGroup = elem.id;
                    const nameObject = elem.u;
                    return nameObject.map(async (el) => {
                        try {
                            const all = await wialonService.getAllParamsIdDataFromWialon(el);
                            const phone = await wialonService.getUniqImeiAndPhoneIdDataFromWialon(el);
                            if (!all.item || !phone.item) {
                                return;
                            }
                            return {
                                login: login,
                                data: String(time),
                                idg: String(idGroup),
                                name_g: nameGroup,
                                idObject: String(all.item.id),
                                nameObject: String(all.item.nm),
                                imei: phone.item.uid ? String(phone.item.uid) : null,
                                phone: phone.item.ph ? String(phone.item.ph) : null
                            };
                        } catch (error) {
                            console.error(error);
                            return;
                        }
                    });
    
                });
                const results = await Promise.all(promises);
                return results.filter(Boolean);
                const res = []
                for (let el of result.items) {
                    const nameGroup = el.nm;
                    const idGroup = el.id;
                    const nameObject = el.u;
                    for (let it of nameObject) {
                        const prmsId = {
                            "id": it,
                            "flags": 1
                        };
                        const test2 = wialon.core.Remote.getInstance();
                        test2.remoteCall('core/search_item', prmsAllGoup,
                            function (code, result) {
                                if (code) {
                                    console.log(wialon.core.Errors.getErrorText(code));
                                }
                                res.push({
                                    idg: String(idGroup),
                                    name_g: nameGroup,
                                    idObject: String(result.item.id),
                                    nameObject: String(result.item.nm),
    
                                })
                            })
                    }
    
    
                }
                console.log(res)
    
            })
        console.timeEnd('ggg')
    */
    //session.request('core/search_items', prmsAllGoup)
    /*
        for (let el of data) {
            const prmsId = {
                "itemId": el,
                "timeFrom": 1707201796,
                "timeTo": 1707295146,
                "flags": 1,
                "flagsMask": 1,
                "loadCount": 180000
            }
            const test2 = wialon.core.Remote.getInstance();
            test2.remoteCall('messages/load_interval', prmsId,
                function (code, result) {
                    if (code) {
                        console.log(wialon.core.Errors.getErrorText(code));
                    }
                    console.log(result)
    
                })
            const prms3 = {
                "source": "",
                "indexFrom": 0,
                "indexTo": 180000,
                "unitId": el,
                "sensorId": 0
    
            };
            const test3 = wialon.core.Remote.getInstance();
            test3.remoteCall('unit/calc_sensors', prms3,
                function (code, result) {
                    if (code) {
                        console.log(wialon.core.Errors.getErrorText(code));
                    }
                    console.log(result)
                })
    
        }*/


    /*
        const prmsId = {
            "id": 26936623,
            "flags": 0x00000100
        };
    
        const test2 = wialon.core.Remote.getInstance();
        test2.remoteCall('core/search_item', prmsId,
            function (code, result) {
                if (code) {
                    console.log(wialon.core.Errors.getErrorText(code));
                }
                console.log(result)
    
            })*/

}