
import { zapros } from './modules/menu.js'
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


    // inits();


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
    lowList.style.height = wrapperFull.clientHeight - 30 + 'px';
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
            zapross()
        });
};



function zapross() {
    const param = {
        'tzOffset': 0,
        "language": 'ru',
    };

    const local = wialon.core.Remote.getInstance();
    local.remoteCall('render/set_locale', param,
        function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            console.log(result)
        })

    const paramysss = {
        "reportResourceId": 25383830,
        "reportTemplateId": 4,
        "reportObjectId": 25766831,
        'reportObjectSecId': 0,
        'reportObjectIdList': [],
        "interval": {
            "from": 1698613200 + 10800,
            "to": 1698699600 + 10799,
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
            /* const file = wialon.core.Remote.getInstance();
             file.remoteCall('report/export_result', { "format": 2, "compress": 0 },
                 function (code, result) {
                     if (code) {
                         console.log(code)
                         console.log(wialon.core.Errors.getErrorText(code));
                     }
                     const file = new Blob([result], { type: 'application/pdf' }); // Создаем объект Blob, который представляет файл с данными
                     const fileURL = URL.createObjectURL(file); // Создаем ссылку на файл, используя метод createObjectURL
 
                     const link = document.createElement('a'); // Создаем элемент <a>, который будет использоваться для загрузки файла
                     link.href = fileURL; // Устанавливаем значение атрибута href равным ссылке на файл
                     link.download = 'report.pdf'; // Устанавливаем значение атрибута download для определения имени файла при загрузке
                     link.click(); // Запускаем загрузку файла, вызывая метод click() на элементе <a>
                     //  console.log(result)
 
                 })*/

        })






    /*https://hst-api.wialon.com/wialon/ajax.html?svc=report/export_result&params={"format"2}&sid=02c1af974d1a5bf8d5631b0dc34aab71*/






    /*
                const form = {
                     "format": 8,
                "pageWidth": 0,
                "pageOrientation": "landscap",
                "headings": 1,
                "compress": 0,
                "attachMap": 0,
                "pageSize": "a4",
                "coding": "utf8",
                "hideMapBasis": 0,
                "delimiter": "semicolon",
                "outputFileName": "Online"
                }
                const testfile = wialon.core.Remote.getInstance();
                testfile.remoteCall('report/export_result', form,
                    function (code, result) {
                        if (code) {
                            console.log(wialon.core.Errors.getErrorText(code));
                        }
                        console.log(result)
    
                    })*/



    const tesOarams = {
        "spec": {
            "itemsType": "avl_resource",
            "propName": "reporttemplates",
            "propValueMask": "*",
            "sortType": ""
        },
        "force": 1,
        "flags": 0x00002001,
        "from": 0,
        "to": 0,

    };

    const test1 = wialon.core.Remote.getInstance();
    test1.remoteCall('core/search_items', tesOarams,
        function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            console.log(result)
        })

}