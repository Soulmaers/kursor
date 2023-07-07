
import { loadParamsViewList, conturTest } from './spisok.js'
import { checkCreate } from './admin.js'
import { startAllStatic, uniqglobalInfo, yesterdaySummary } from './startAllStatic.js'
//0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178-токен основной

/*
export function init(kluch) {
    wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com");
    wialon.core.Session.getInstance().loginToken(kluch, "", // try to login
        function (code) {
            if (code) {
                return;
            }

        });
};*/
const wrapContaint = document.querySelector('.wrapper_containt')
const cont = document.createElement('div')
cont.classList.add('container2')
wrapContaint.appendChild(cont);


export async function zapros(login) {
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ login }))

    }
    const mods = await fetch('/api/dataSpisok', params)
    const models = await mods.json()
    console.log(models)

    const arrayList = models.response.aLLmassObject
    const nameCarCheck = models.response.arrName
    //получаем готовые данные с сервера и передаем в функцию для отрисовки списка
    console.log(arrayList)

    conturTest(arrayList)
    startAllStatic(arrayList)
    setInterval(startAllStatic, 300000, arrayList)
    yesterdaySummary();
    //передаем имена объектов для отображения в панели администратора
    checkCreate(nameCarCheck)
    const tiresActiv = document.querySelector('.tiresActiv')
    if (tiresActiv) {
        tiresActiv.remove()
    }


    const processDataAtMidnight = () => {
        const now = new Date();
        const date = new Date(now);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const data = `${year}-${month}-${day}`;
        //  console.log('Проверяем, что время - 23:59:30')
        if (now.getHours() === 23 && now.getMinutes() === 59 && now.getSeconds() === 30) {
            // Обрабатываем данные
            console.log(Object.entries(uniqglobalInfo))
            const arraySummary = Object.entries(uniqglobalInfo)

            arraySummary.forEach(async el => {
                const idw = el[0]
                const arrayInfo = el[1]
                const params = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: (JSON.stringify({ idw, arrayInfo, data }))

                }
                const mods = await fetch('/api/summary', params)
                const models = await mods.json()
                console.log(models)
            })
        }
    };
    setInterval(processDataAtMidnight, 1000)

}
const login = document.querySelectorAll('.log')[1].textContent
export async function ggg(id) {
    console.log('ggg')
    return new Promise(async function (resolve, reject) {
        const idw = id
        const allobj = {};
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw, login }))
        }
        const ress = await fetch('/api/sensorsName', param)
        const results = await ress.json()
        if (!results) {
            ggg(id)
        }
        const nameSens = Object.entries(results.item.sens)
        const arrNameSens = [];
        nameSens.forEach(el => {
            arrNameSens.push([el[1].n, el[1].p])
        })
        const res = await fetch('/api/lastSensors', param)
        const result = await res.json()
        if (result) {
            const valueSens = [];
            Object.entries(result).forEach(e => {
                valueSens.push(e[1])
            })
            //    console.log(valueSens)
            const allArr = [];
            arrNameSens.forEach((e, index) => {
                allArr.push([...e, valueSens[index]])

            })
            //console.log(allArr)
            allArr.forEach(it => {
                allobj[it[1]] = it[0]
            })
        }
        resolve(allobj)
    });
}




