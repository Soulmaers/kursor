
import { ggg } from './menu.js'

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
            console.log(mesto)
            const allobj = await ggg(alert[1][6])
            const tyres = allobj[alert[1][1]]
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


function createPopup(array) {
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