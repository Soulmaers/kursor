
import { ggg } from './menu.js'
import { timefn, timesFormat } from './startAllStatic.js'
import { testovfn } from './charts/bar.js'
import { fnParMessage } from './grafiks.js'

export async function popupProstoy(array) {
    const result = array
        .map(el => Object.values(el)) // получаем массивы всех значений свойств объектов
        .flat()
    const arrays = result.filter(e => e[6] && !e[6].startsWith('Цистерна')).map(e => e);
    const interval = timefn()
    const timeOld = interval[1]
    const timeNow = interval[0]

    for (const e of arrays) {

        const time = [];
        const speed = [];
        const sats = [];
        const geo = [];
        const idw = e[4];
        console.log(idw)
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw }))
        }
        try {
            const tsi = await fetch('/api/modelView', param)
            const tsiY = await tsi.json()
            let tsiControll = tsiY.result.length !== 0 || tsiY.result.tsiControll && tsiY.result.tsiControll !== '' ? Number(tsiY.result[0].tsiControll) : null;
            tsiControll === 0 ? tsiControll = null : tsiControll = tsiControll
            if (tsiControll === null) {
                continue
            }
            const itog = await testovfn(idw, timeOld, timeNow)
            itog.forEach(el => {
                const timestamp = Number(el.data);
                const date = new Date(timestamp * 1000);
                const isoString = date.toISOString();
                time.push(new Date(isoString))
                speed.push(el.speed)
                sats.push(el.sats)
                geo.push(JSON.parse(el.geo))
            })
            const sensArr = itog.map(e => {
                return JSON.parse(e.sens)
            })
            const nameSens = await fnParMessage(idw)
            const allArrNew = [];
            if (sensArr[0] && nameSens.length === sensArr[0].length) {
                nameSens.forEach((item) => {
                    allArrNew.push({ sens: item[0], params: item[1], value: [] })
                })
            }
            nameSens.pop()
            nameSens.forEach((item) => {
                allArrNew.push({ sens: item[0], params: item[1], value: [] })
            })
            sensArr.forEach(el => {
                if (el.length === 0) {
                    return // Пропускаем текущую итерацию, если sensArr пустой
                }
                for (let i = 0; i < allArrNew.length; i++) {
                    allArrNew[i].value.push(Number(Object.values(el)[i].toFixed(0)))
                }
            });
            allArrNew.forEach(el => {
                el.time = time
                el.speed = speed
                el.sats = sats
                el.geo = geo
            })
            console.log(allArrNew)
            allArrNew.forEach(async it => {
                if (it.sens.startsWith('Бортовое')) {
                    const res = prostoy(it, tsiControll);
                    if (res !== undefined) {
                        const map = await createMesto(res[3])
                        const timesProstoy = timesFormat(res[0])
                        const group = e[5]
                        const name = e[0].message
                        const time = res[1]
                        const day = time.getDate();
                        const month = (time.getMonth() + 1).toString().padStart(2, '0');
                        const year = time.getFullYear();
                        const hours = time.getHours().toString().padStart(2, '0');
                        const minutes = time.getMinutes().toString().padStart(2, '0');
                        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
                        const lastTime = res[2]
                        const nowTime = new Date()
                        const diffInSeconds = (nowTime.getTime() - lastTime.getTime()) / 1000;
                        diffInSeconds < 60 ? createPopup([{
                            event: `Простой`, group: `Компания: ${group}`,
                            name: `Объект: ${name}`,
                            time: `Время: ${formattedDate}`, alarm: `Время простоя: ${timesProstoy}`, res: `Местоположение: ${map}`
                        }]) : console.log('ждем условия')
                    }
                }
            })

        }
        catch (e) {
            console.log(e)
        }
    }
}



function prostoy(data, tsi) {
    if (data.value.length === 0) {
        return undefined
    }
    else {
        const prostoy = [];
        const korzina = [];
        let startIndex = 0;
        data.value.forEach((values, index) => {
            if (values !== data.value[startIndex]) {
                const speedTime = { speed: data.speed.slice(startIndex, index), time: data.time.slice(startIndex, index), geo: data.geo.slice(startIndex, index) };
                (data.value[startIndex] <= tsi ? korzina : prostoy).push(speedTime);
                startIndex = index;
            }
        });
        const speedTime = { speed: data.speed.slice(startIndex), time: data.time.slice(startIndex), geo: data.geo.slice(startIndex) };
        (data.value[startIndex] <= tsi ? korzina : prostoy).push(speedTime);
        const filteredData = prostoy.map(obj => {
            const newS = [];
            const timet = [];
            const geo = []
            for (let i = 0; i < obj.speed.length; i++) {
                if (obj.speed[i] < 5) {
                    newS.push(obj.speed[i]);
                    timet.push(obj.time[i])
                    geo.push(obj.geo[i])
                } else {
                    break;
                }
            }
            return { speed: newS, time: timet, geo: geo };
        });
        console.log(filteredData)
        const timeProstoy = filteredData.map(el => {
            return [el.time[0], el.time[el.time.length - 1], el.geo[0]]
        })
        const unixProstoy = [];
        console.log(timeProstoy)
        timeProstoy.forEach(it => {
            if (it[0] !== undefined) {
                const diffInSeconds = (it[1].getTime() - it[0].getTime()) / 1000;
                if (diffInSeconds > 600) {
                    unixProstoy.push([diffInSeconds, it[0], it[1], it[2]])
                }
            }
        })
        const timeBukl = unixProstoy[unixProstoy.length - 1]
        return timeBukl
    }
}

export async function modalView(zapravka, name, group) {
    console.log(zapravka)
    console.log(zapravka[0], name, group)
    const litrazh = zapravka[0][1][0] - zapravka[0][0][0]
    const geo = zapravka[0][0][2]
    const time = zapravka[0][0][1]
    const lastTime = zapravka[0][1][1]
    const nowTime = new Date()
    const diffInSeconds = (nowTime.getTime() - lastTime.getTime()) / 1000;
    const day = time.getDate();
    const month = (time.getMonth() + 1).toString().padStart(2, '0');
    const year = time.getFullYear();
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    const lat = geo[0];
    const lon = geo[1];
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ru`;
    const mestnost = await fetch(url)
    const location = await mestnost.json()
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
    const data = [{ event: `Заправка`, group: `Компания: ${group}`, name: `Объект: ${name}`, litrazh: `Запралено: ${litrazh} л.`, time: `Время: ${formattedDate}`, res: `Местоположение: ${res}` }]
    console.log(data)
    diffInSeconds < 60 ? createPopup([{ event: `Заправка`, group: `Компания: ${group}`, name: `Объект: ${name}`, litrazh: `Запралено: ${litrazh} л.`, time: `Время: ${formattedDate}`, res: `Местоположение: ${res}` }]) : console.log('ждем условия')
}

/*
// Создаем WebSocket-соединение
const socket = new WebSocket('ws://localhost:3333');
// Обработчик открытия соединения
socket.onopen = () => {
    console.log('Соединение установлено');
};
// Обработчик получения сообщения от сервера
socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log(message)
    createPopup(message)
};
// Обработчик закрытия соединения
socket.onclose = () => {
    console.log('Соединение закрыто');
};*/

function poll() {
    setTimeout(async function () {
        const par = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const res = await fetch('/api/alert', par)
        const alert = await res.json();
        console.log(alert)
        if (alert !== null) {
            const mesto = await createMesto(alert[1][7])
            console.log(alert[1][5])
            const allobj = await ggg(alert[1][5])
            const tyres = allobj[alert[1][1]]
            console.log(tyres)
            let val;
            alert[1][2] !== 'Потеря связи с датчиком' ? val = alert[1][2] + ' ' + 'Бар' : val = alert[1][3] + '' + 't'
            const event = 'Уведомление'
            createPopup([{
                event: event, time: `Время ${alert[0]}`, name: `Объект: ${alert[1][0]}`, tyres: `Колесо: ${tyres}`,
                param: `Параметр: ${val}`, alarm: `Событие: ${alert[2]}`, res: `Местоположение: ${mesto}`
            }])
        }
        poll()
    }, 5000)
}
poll()

async function createMesto(geo) {
    const lat = geo[0];
    const lon = geo[1];
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ru`;
    const mestnost = await fetch(url)
    const location = await mestnost.json()
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
    return res
}


async function createPopup(array) {
    const newdata = JSON.stringify(array)
    //  const newdata = JSON.stringify(array.map(obj => Object.values(obj).join(", ")).join(", "));
    console.log(newdata);

    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ newdata }))
    }
    const res = await fetch('/api/logs', params)
    console.log(res)
    const arr = Object.values(array[0]);
    const body = document.getElementsByTagName('body')[0]
    const popap = document.querySelector('.popup')
    console.log(body)
    if (popap) {
        const pop = document.createElement('div')
        pop.classList.add('popup')
        pop.style.top = 50 + '%'
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
        const closeButton = document.querySelector('.popup-close');
        closeButton.addEventListener('click', function () {
            popup.remove();
        });
        setTimeout(function () {
            popup.remove();
            //   popup.style.display = "none";
        }, 20000);

    }
    else {
        const pop = document.createElement('div')
        pop.classList.add('popup')
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
        const closeButton = document.querySelector('.popup-close');
        closeButton.addEventListener('click', function () {
            popup.remove();
        });
        setTimeout(function () {
            popup.remove();
            //   popup.style.display = "none";
        }, 20000);
    }

}