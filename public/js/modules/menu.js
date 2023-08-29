
import { conturTest } from './spisok.js'
import { checkCreate } from './admin.js'
import { yesterdaySummary, startAllStati } from './startAllStatic.js'
import { startList } from './checkObjectStart.js'
import { logsView } from './popup.js'
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

export let allObjects;
const wrapContaint = document.querySelector('.wrapper_containt')
const cont = document.createElement('div')
cont.classList.add('container2')
wrapContaint.appendChild(cont);

export async function zapros(login) {
    const selectElement = document.querySelectorAll('.select_summary.one');
    selectElement.forEach(el => {
        el[0].selected = true;
    })
    const selectElementTwo = document.querySelectorAll('.select_summary.two');
    selectElementTwo.forEach(el => {
        el[1].selected = true;
    })
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
    allObjects = arrayList
    //  startAllStati(arrayList)
    conturTest(arrayList)
    startList(arrayList)
    logsView(arrayList)
    //передаем имена объектов для отображения в панели администратора
    checkCreate(nameCarCheck)
    const tiresActiv = document.querySelector('.tiresActiv')
    if (tiresActiv) {
        tiresActiv.remove()
    }

    const processDataAtMidnight = async () => {
        yesterdaySummary();
        yesterdaySummary('Вчера');
        yesterdaySummary('Неделя');

    };
    processDataAtMidnight()
    setInterval(processDataAtMidnight, 60000)
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
            const allArr = [];
            arrNameSens.forEach((e, index) => {
                allArr.push([...e, valueSens[index]])
            })
            allArr.forEach(it => {
                allobj[it[1]] = it[0]
            })
        }
        resolve(allobj)
    });
}




