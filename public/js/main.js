

import { conturTest } from './modules/spisok.js'
import { checkCreate } from './modules/admin.js'
import { logsView } from './modules/popup.js'

export let app;

document.addEventListener('DOMContentLoaded', () => {
    // Это гарантирует, что DOM полностью загружен перед инициализацией классов
    const role = document.querySelector('.role').getAttribute('rel')
    const login = document.querySelectorAll('.log')[1].textContent
    app = new Application(role, login);

});


export class Application {
    //Основной класс 1 экземпляр при запуске приложения
    constructor(role, login) {
        this.role = role   //получаем роль прав доступа
        this.login = login //получаем логин пользователя
        this.dataspisok = false //флаг загрузки
        this.logsInterval = null; // Инициализация свойства для хранения интервала
        this.init()  //основной метод который запускает стартовые методы загрузки данных на страницу
    }
    // Методы класса Application
    async init() {
        this.formatContainer() //метод который корретирует границы контейнеров взависимости от разрешения экрана
        this.logs() //метод который сохраняет в базу число просмотренных логов
        this.zapros(this.login) //метод который забирает из бд данные по объектам, заппускает проверку обновления логов, проверку  объектов из бд соответствующих логину, запускает функцию отрисовки списка

    }
    async zapros(login) {
        const [wialonData, kursorData] = await Promise.all([this.zaprosWialon(login), this.zaprosKursor(login)])
        this.dataspisok = true
        const arrayList = wialonData.response.aLLmassObject
        const nameCarCheck = wialonData.response.arrName
        const data = kursorData.concat(arrayList)
        if (data.flat().length === 0) {
            const loaders = document.querySelector('.loaders');
            loaders.style.display = 'none'
        }
        await conturTest(data) //отрисовка списка и статусов списка, будет переписано на класс
        logsView(data) //отрисовка и наполнение логов будет переписано на класс
        // Очистка предыдущего интервала перед созданием нового
        if (this.logsInterval !== null) {
            clearInterval(this.logsInterval);
        }
        // Установка нового интервала и сохранение его идентификатора
        this.logsInterval = setInterval(logsView, 60000, data);
        //передаем имена объектов для отображения в панели администратора
        checkCreate(nameCarCheck)
    }

    async zaprosWialon(login) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ login }))

        }
        const mods = await fetch('/api/dataSpisok', params)
        const models = await mods.json()
        return models
    }

    async zaprosKursor(login) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ login })
        }
        const res = await fetch('/api/getKursorObjects', params)
        const objects = await res.json()
        const arrayList = objects.result
        return arrayList
    }



    async logs() {
        const login = this.login
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ login }))

        }
        const res = await fetch('/api/viewLogs', param)
        const confirm = await res.json()
    }




    formatContainer() {
        const wrapperFull = document.querySelector('.wrapperFull')
        const lowList = document.querySelector('.low_list')

        if (screen.width < 860) {
            const newColumn = document.querySelectorAll('.newColumn')
            const newCel = document.querySelectorAll('.newCel')
            newColumn.forEach(e => e.remove())
            newCel.forEach(e => e.remove())

        }
        if (screen.width === 1366 && screen.height === 768) {
            wrapperFull.style.height = '651px'
        } else if (screen.width === 1920 && screen.height === 1080) {
            wrapperFull.style.height = '883px'
        }
        lowList.style.height = wrapperFull.clientHeight - 65 + 'px';
    }
}









































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