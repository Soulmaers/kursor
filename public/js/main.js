
import { zapros } from './modules/menu.js'
import { btnDel } from './modules/event.js'
import { liCreate } from './modules/visual.js'




async function init() {
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

        })
}