
import { zapros, zaprosKursor } from './modules/menu.js'
import { btnDel } from './modules/event.js'
import { liCreate } from './modules/visual.js'



function waitForDOMLoad() {
    return new Promise((resolve) => {
        document.addEventListener('DOMContentLoaded', resolve);
    });
}

async function init() {
    //   await waitForDOMLoad(); // Ожидаем загрузку всего DOM
    //  waitAndExecute(); // Запускаем функцию после загрузки DOM


    const role = document.querySelector('.role').getAttribute('rel')
    const login = document.querySelectorAll('.log')[1].textContent
    const radioVal = document.querySelector('.radioVal')

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


    //  inits();


    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ login }))

    }


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



function inits() {
    wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com");
    wialon.core.Session.getInstance().loginToken("0f481b03d94e32db858c7bf2d8415204977173E354D49AA7AFA37B01431539AEAC5DAD5E", "", // try to login
        function (code) {
            if (code) {
                return;
            }
            //  zapross()
        });
};



function zapross() {


    const paramysss = {
        "reportResourceId": 25383830,//26936615,//24937438,
        "reportTemplateId": 5,//2,//1,
        "reportObjectId": 25399437,
        'reportObjectSecId': 0,
        'reportObjectIdList': [],
        "interval": {
            "from":
                1699736400,
            "to":
                1699822799,
            "flags": 0x00
        }
    }

    const test2 = wialon.core.Remote.getInstance();
    test2.remoteCall('report/exec_report', paramysss,
        function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            console.log(result)

            const param = {
                "attachmentIndex": 0,
                "width": 100,
                "useCrop": 0,
                'cropBegin': 1699736400,
                'cropEnd': 1699822799
            }

            const chart = wialon.core.Remote.getInstance();
            chart.remoteCall('report/render_json', param,
                function (code, result) {
                    if (code) {
                        console.log(wialon.core.Errors.getErrorText(code));
                    }
                    console.log(result)
                })
        })

    /*https://hst-api.wialon.com/wialon/ajax.html?svc=report/export_result&params={"format"2}&sid=02c1af974d1a5bf8d5631b0dc34aab71*/
}