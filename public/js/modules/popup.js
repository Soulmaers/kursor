
import { ggg } from './menu.js'
import { timefn, timesFormat } from './startAllStatic.js'
import { testovfn } from './charts/bar.js'
import { fnParMessage } from './grafiks.js'
import { titleLogs } from './content.js'



async function createMesto(geo) {
    console.log(geo)
    const lat = geo[0];
    const lon = geo[1];
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ru`;
        const mestnost = await fetch(url)
        const location = await mestnost.json()
        console.log(location)
        const address = location.address;
        const adres = [];
        adres.push(address.amenity);
        adres.push(address.road);
        adres.push(address.municipality);
        adres.push(address.county);
        adres.push(address.city);
        adres.push(address.state);
        adres.push(address.country);
        const res = adres.filter(val => val !== undefined).join(', ');
        if (res) {
            return res
        }
        else {
            return null
        }
    }

    catch (e) {
        return null
    }
}

let position = 20
async function createPopup(array) {
    console.log(position)
    const arr = Object.values(array[0]);
    console.log(arr)
    const body = document.getElementsByTagName('body')[0]
    const popap = document.querySelector('.popup')
    // if (popap) {
    const pop = document.createElement('div')
    pop.classList.add('popup')
    pop.style.top = position + '%'
    body.prepend(pop)
    const popupHead = document.createElement('div')
    popupHead.classList.add('popup-header')
    popupHead.textContent = arr[0]
    arr.shift()
    pop.appendChild(popupHead)
    const popupContent = document.createElement('div')
    popupContent.classList.add('popup-content')
    pop.appendChild(popupContent)
    for (let i = 0; i < arr.length; i++) {
        const item = document.createElement('div');
        item.classList.add('body_content');
        item.textContent = arr[i];
        popupContent.appendChild(item); // Добавляем каждый элемент в родительский элемент
    }
    const popupClose = document.createElement('div')
    popupClose.classList.add('popup-close')
    popupClose.textContent = 'X'
    pop.appendChild(popupClose)
    const popup = document.querySelector('.popup');
    popup.style.display = "block";
    popup.classList.add('open');
    //  body.style.background = 'lightGray'
    position += 30
    const closeButton = document.querySelector('.popup-close');
    closeButton.addEventListener('click', function () {
        popup.remove();
    });
    setTimeout(function () {
        popup.remove();
        position = 0
        //   popup.style.display = "none";
    }, 10000);

}

let previus = 0;
let num = 0;
export async function logsView(array) {
    const login = document.querySelectorAll('.log')[1].textContent
    const arrayId = array
        .map(el => Object.values(el)) // получаем массивы всех значений свойств объектов
        .flat()
        .map(it => it[4])

    const arrayIdGroup = array
        .map(el => Object.values(el)) // получаем массивы всех значений свойств объектов
        .flat()
        .map(it => [it[4], it[5]])
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ arrayId }))
    }
    const ress = await fetch('/api/logsView', param)
    const results = await ress.json()

    const paramLog = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ login }))
    }
    const resLog = await fetch('/api/quantityLogs', paramLog)
    const resultsLog = await resLog.json()
    console.log(resultsLog[0].quantity)
    const viewNum = results.length - resultsLog[0].quantity
    viewTableNum(viewNum)
    previus = results.length
    num++
    console.log(results.length)
    console.log(previus)
    if (previus !== results.length && num !== 0) {
        const num = results.length - previus
        const arrayPopup = results.slice(-num)
        previus = results.length
        arrayPopup.forEach(el => {
            const content = JSON.parse(el.content)
            const event = content[0].event
            const id = Number(el.idw)
            const group = arrayIdGroup
                .filter(it => it[0] === id)
                .map(it => it[1]);
            const time = new Date(Number(el.time) * 1000)
            const day = time.getDate();
            const month = (time.getMonth() + 1).toString().padStart(2, '0');
            const year = time.getFullYear();
            const hours = time.getHours().toString().padStart(2, '0');
            const minutes = time.getMinutes().toString().padStart(2, '0');
            const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
            let mess;
            if (event === 'Заправка') {
                mess = [{ event: event, group: `Компания: ${group}`, name: `${content[0].name}`, litrazh: `${content[0].litrazh}`, time: `Время заправки: ${formattedDate}`, res: `Местоположение: ${content[0].res}` }]
            }
            if (event === 'Простой') {
                mess = [{ event: event, group: `Компания: ${group}`, name: `${content[0].name}`, time: `${content[0].time}`, alarm: `${content[0].alarm}`, res: `Местоположение: ${content[0].res}` }]
            }
            if (event === 'Предупреждение') {
                mess = [{ event: event, group: `Компания: ${group}`, name: `${content[0].name}`, time: `${content[0].time}`, tyres: `${content[0].tyres}`, param: `${content[0].param}`, alarm: `${content[0].alarm}`, res: `Местоположение: ${content[0].res}` }]
            }
            console.log(mess)
            createPopup(mess)
        })
    }
    const mass = Promise.all(results.map(async el => {
        const parsedContent = JSON.parse(el.content);
        const typeEvent = parsedContent[0].event;
        const koor = (parsedContent[0].res).split(",");
        const coord = [parseFloat(koor[0]), parseFloat(koor[1])];
        let g;
        const geo = await createMesto(coord);
        console.log(geo)
        geo === null ? g = koor : g = geo
        console.log(g)
        const int = Object.values(parsedContent[0]);
        int.shift();
        int.pop();
        const time = times(new Date(Number(el.time) * 1000));
        const info = `${int.join(", ")}, Местоположение: ${g}`;
        return { time: time, typeEvent: typeEvent, content: info };
    }));
    mass.then(async results => {
        console.log(results)
        const clickLog = document.querySelector('.clickLog')
        if (!clickLog) {
            await createLogsTable(results);
            const log = document.querySelector('.logs')
            const wrapperLogs = document.querySelector('.wrapperLogs')
            async function togglePopup() {
                if (wrapperLogs.style.display === '' || wrapperLogs.style.display === 'none') {
                    wrapperLogs.style.display = 'block'// Показываем попап
                    wrapperLogs.classList.add('clickLog')
                    const trEvent = document.querySelectorAll('.trEvent')
                    console.log(trEvent)
                    const quantity = trEvent.length;
                    console.log(quantity)
                    const param = {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: (JSON.stringify({ login, quantity }))

                    }
                    const res = await fetch('/api/viewLogs', param)
                    const confirm = await res.json()
                    console.log(confirm)
                    const paramLog = {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: (JSON.stringify({ login }))
                    }
                    const resLog = await fetch('/api/quantityLogs', paramLog)
                    const resultsLog = await resLog.json()
                    console.log(resultsLog[0].quantity)
                    const viewNum = results.length - resultsLog[0].quantity
                    viewTableNum(viewNum)
                } else {
                    wrapperLogs.style.display = 'none'; // Скрываем попап
                    wrapperLogs.classList.remove('clickLog')
                }
            }
            // Добавляем обработчики кликов
            log.addEventListener('click', function (event) {
                togglePopup(); // Появление/скрытие попапа при клике на элементе "log"
            });
            document.addEventListener('click', function (event) {
                if (event.target !== wrapperLogs && !wrapperLogs.contains(event.target) && event.target !== log) {
                    wrapperLogs.style.display = 'none'; // Скрываем попап при клике на любую область, кроме элемента "log"
                    wrapperLogs.classList.remove('clickLog')
                }
            });
        }
    }).catch(error => {
        console.error(error);
    })
    setInterval(logsView, 60000, array)
}


function viewTableNum(num) {
    console.log(num)
    const nums = document.querySelector('.num')
    nums.textContent = num
}
async function createLogsTable(mass) {
    console.log(mass)
    console.log('up')
    const wrap = document.querySelector('.wrapperLogs')
    if (wrap) {
        wrap.remove();
    }
    const body = document.getElementsByTagName('body')[0]
    const log = document.createElement('div')
    log.classList.add('wrapperLogs')
    body.appendChild(log)
    log.innerHTML = titleLogs

    mass.forEach(el => {
        const trEvent = document.createElement('div')
        trEvent.classList.add('trEvent')
        log.appendChild(trEvent)
        for (var key in el) {
            const td = document.createElement('p')
            td.classList.add('tdEvent')
            td.textContent = el[key]
            trEvent.appendChild(td)
        }
    })


}


function times(time) {
    const day = time.getDate();
    const month = (time.getMonth() + 1).toString().padStart(2, '0');
    const year = time.getFullYear();
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
    return formattedDate
}