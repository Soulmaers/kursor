
import { zapros } from './modules/menu.js'
import { btnDel } from './modules/event.js'
import { liCreate } from './modules/visual.js'



function waitForDOMLoad() {
    return new Promise((resolve) => {
        document.addEventListener('DOMContentLoaded', resolve);
    });
}

async function init() {
    await waitForDOMLoad(); // Ожидаем загрузку всего DOM
    //  waitAndExecute(); // Запускаем функцию после загрузки DOM


    const role = document.querySelectorAll('.log')[0].textContent
    const login = document.querySelectorAll('.log')[1].textContent
    const radioVal = document.querySelector('.radioVal')

    role === 'Пользователь' ? dis() : btnDel()
    function dis() {
        const chekAlt = document.querySelector('.checkAlt')
        chekAlt.style.display = 'none';
        const delIcon = document.querySelectorAll('.delIcon')
        delIcon.forEach(e => {
            e.style.display = 'none';
        })
        radioVal.style.marginTop = '10px'
        radioVal.style.marginLeft = '10px'
        radioVal.style.justifyContent = 'start'
        radioVal.style.display = 'none'

    }

    inits();

    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ login }))

    }

/*
    const res = await fetch('/api/viewLogs', param)
    const confirm = await res.json()
    console.log(confirm)*/

    
         zapros(login) //делаем запрос на wialon получаем объекты
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
   if (screen.width >= 1366 && screen.height === 768) {
        // document.body.style.maxWidth = '1366px';
        document.body.style.height = '768px';
        // wrapperFull.style.height = '693px'
       // start.style.height = '98vh'
    } else if (screen.width === 1920 && screen.height === 1080) {
        document.body.style.height = '1080px';
        // wrapperFull.style.height = '1005px'
    
    }

    console.log(wrapperFull.clientHeight)
    wrapperFull.style.minHeight = screen.height - 80 + 'px'
    lowList.style.height = wrapperFull.clientHeight - 20 + 'px';
    console.log(lowList.style.height)
}



init();



function inits() {
    wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com");
    wialon.core.Session.getInstance().loginToken("0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178", "", // try to login
        function (code) {
            if (code) {
                return;
            }
            zapross()
        });
};



function zapross() {
    const params11 = {
        "itemId": 26702371,
        "ivalType": 1,
        "timeFrom": 1695427200,
        "timeTo":
            1695513600,
        "detectors": [
            {
                "type": 'sensors',
                "filter1": 0
            }, {
                "type": 'lls',
                "filter1": 0
            }, {
                "type": 'trips',
                "filter1": 0
            }
        ],
    }
    const remote122 = wialon.core.Remote.getInstance();
    remote122.remoteCall('events/load', params11,
        function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            console.log(result)


            const params112 = {
                "selector": {
                    "type": '*',
                    //   "expr": 'trips{m<90}',
                    "timeFrom": 1695427200,
                    "timeTo":
                        1695513600,
                    "detalization": 23
                }
            }
            const remote1221 = wialon.core.Remote.getInstance();
            remote1221.remoteCall('events/get', params112,
                function (code, result) {
                    if (code) {
                        console.log(wialon.core.Errors.getErrorText(code));
                    }
                    console.log(result)

                });
        });


    const prmsId = {
        "id": 26702383,
        "flags": 0x0010000000
    };
    const flagsAllGroup = '0x3FFFFFFFFFFFFFF'// 0x0100000000000	// + 1024//4096
    const prmsAllGoup = {
        "spec": {
            "itemsType": "avl_resource",
            "propName": "trailers",
            "propType": 'propitemname',
            "propValueMask": "*",
            "sortType": "trailers"
        },
        "force": 1,
        "flags": flagsAllGroup,
        "from": 0,
        "to": 0xffffffff,
        //  "rand": Math.random() // Добавляем рандомный параметр rand
    };

    const remote122144 = wialon.core.Remote.getInstance();
    remote122144.remoteCall('core/search_items', prmsAllGoup,
        function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            console.log(result)

        });
    console.log('запрос!!')
    const params = {
        "mode": "add",
        "units": [
            {
                "id": 25399453,
                "detect":
                {
                    "ignition": 0,
                    "sensors": 0,
                    'trips': 0,
                    'lls': 0,
                    "counters": 0
                }
            },
        ]
    }

    const remote111 = wialon.core.Remote.getInstance();
    remote111.remoteCall('events/update_units', params,
        function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            console.log(result)

            const prms = {
                //   "lang": 'ru',
                //   "measure": 0,
                "detalization": 3
            }



            const remote1 = wialon.core.Remote.getInstance();
            remote1.remoteCall('events/check_updates&params', prms,
                function (code, result) {
                    if (code) {
                        console.log(wialon.core.Errors.getErrorText(code));
                    }
                    console.log(result)

                });

        });




}