import { DraggableContainer } from '../class/Dragdown.js'
import { CloseBTN } from '../class/Flash.js'
import { titleLogs } from './content.js'
import { reverseGeocode, createMapsUniq } from './geo.js'



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
    //  pop.style.top = position + '%'
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
    popupClose.innerHTML = `<i class="fas fa fa-times popup-close"></i>`
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
    }, 60000);

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
    const viewNum = results.length - resultsLog[0].quantity
    viewTableNum(viewNum)
    if (num === 0) {
        previus = results.length
    }
    if (previus !== results.length && num !== 0) {
        const num = results.length - previus
        const arrayPopup = results.slice(-num)
        previus = results.length
        arrayPopup.forEach(el => {
            const content = JSON.parse(el.content)
            const event = content[0].event
            const id = Number(el.idw)
            const group = login === 'Курсор' ? 'demo' : arrayIdGroup
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
            console.log(group)
            if (event === 'Заправка') {
                mess = [{ event: event, group: `Компания: ${group}`, name: `${content[0].name}`, litrazh: `${content[0].litrazh}`, time: `Время заправки: ${formattedDate}` }]
            }
            if (event === 'Простой') {
                mess = [{ event: event, group: `Компания: ${group}`, name: `${content[0].name}`, time: `${content[0].time}`, alarm: `${content[0].alarm}` }]
            }
            if (event === 'Предупреждение') {
                mess = [{ event: event, group: `Компания: ${group}`, name: `${content[0].name}`, time: `${content[0].time}`, tyres: `${content[0].tyres}`, param: `${content[0].param}`, alarm: `${content[0].alarm}` }]
            }
            console.log(mess)
            createPopup(mess)
        })
        previus = results.length
    }
    num++
    const mass = Promise.all(results.map(async el => {
        const parsedContent = JSON.parse(el.content);
        const typeEvent = parsedContent[0].event;
        const geoloc = el.geo !== '' ? JSON.parse(el.geo) : null;
        const geo = geoloc !== null ? geoloc.map(e => e.toFixed(5)) : 'нет данных'
        const id = parseFloat(el.idw)
        const group = arrayIdGroup
            .filter(it => it[0] === id)
            .map(it => it[1]);
        const int = Object.values(parsedContent[0]);
        int.shift();
        if (!int.some(e => e.startsWith('Комп'))) {
            int.unshift(`Компания: ${login === 'Курсор' ? 'demo' : group[0]}`);
        }
        const time = times(new Date(Number(el.time) * 1000));
        const info = `${int.join(", ")}`;
        return { time: time, typeEvent: typeEvent, content: info, geo: geo };
    }));
    mass.then(async results => {
        const clickLog = document.querySelector('.clickLog')
        if (!clickLog) {
            await createLogsTable(results);
            const tr = document.querySelectorAll('.trEvent')
            tr.forEach(e => {
                e.style.cursor = 'pointer'
                const clickHandler = (event) => {
                    event.stopPropagation();
                    const geo = [];
                    geo.push(parseFloat(e.lastElementChild.textContent.split(',')[0]))
                    geo.push(parseFloat(e.lastElementChild.textContent.split(',')[1]))
                    console.log(geo)
                    const obj = [{ geo: geo, logs: [e.lastElementChild.parentElement.children[0].textContent, e.lastElementChild.parentElement.children[1].textContent, e.lastElementChild.parentElement.children[2].textContent] }]
                    createMapsUniq([], obj, 'log')
                    const map = document.getElementById('mapOil');
                    new CloseBTN(map)
                };
                e.addEventListener('click', clickHandler);
            })
            const log = document.querySelector('.logs')
            const wrapperLogs = document.querySelector('.alllogs')
            async function togglePopup() {
                if (wrapperLogs.style.display === '' || wrapperLogs.style.display === 'none') {
                    wrapperLogs.style.display = 'block'// Показываем попап
                    wrapperLogs.classList.add('clickLog')
                    const trEvent = document.querySelectorAll('.trEvent')
                    const quantity = trEvent.length;
                    const param = {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: (JSON.stringify({ login, quantity }))

                    }
                    const res = await fetch('/api/viewLogs', param)
                    const confirm = await res.json()
                    const viewNum = results.length - quantity
                    viewTableNum(viewNum)
                } else {
                    wrapperLogs.style.display = 'none'; // Скрываем попап
                    wrapperLogs.classList.remove('clickLog')

                }
            }
            const numy = document.querySelector('.num')
            // Добавляем обработчики кликов
            log.addEventListener('click', function (event) {
                event.stopPropagation();
                const wr = document.querySelector('.alllogs')
                const draggable = new DraggableContainer(wr);
                togglePopup(); // Появление/скрытие попапа при клике на элементе "log"
            });
            numy.addEventListener('click', function (event) {
                event.stopPropagation();
                togglePopup(); // Появление/скрытие попапа при клике на элементе "log"
            });

            new CloseBTN(wrapperLogs, log, numy)

        }

    }).catch(error => {
        console.error(error);
    })
    setTimeout(logsView, 60000, array)
}

function viewTableNum(num) {
    console.log(num)
    const nums = document.querySelector('.num')
    nums.textContent = num
}

const objColor = {
    'Заправка': 'darkblue',
    'Простой': 'darkgreen',
    'Предупреждение': 'darkred'
}
async function createLogsTable(mass) {
    const wrap = document.querySelector('.alllogs')
    if (wrap) {
        wrap.remove();
    }
    const body = document.getElementsByTagName('body')[0]
    const log = document.createElement('div')
    log.classList.add('wrapperLogs')
    const headerlog = document.createElement('div')
    headerlog.classList.add('header_logs')
    const alllogs = document.createElement('div')
    alllogs.classList.add('alllogs')
    const spanTitle = document.createElement('p')
    spanTitle.classList.add('spanTitle')
    spanTitle.textContent = 'Логи событий'
    body.appendChild(alllogs)
    alllogs.appendChild(spanTitle)
    alllogs.appendChild(log)
    log.innerHTML = titleLogs
    var firstChild = log.firstChild;
    mass.forEach(el => {
        const trEvent = document.createElement('div')
        trEvent.classList.add('trEvent')
        log.insertBefore(trEvent, firstChild.nextSibling)
        for (var key in el) {
            const td = document.createElement('p')
            td.classList.add('tdEvent')
            td.textContent = el[key]
            trEvent.appendChild(td)
            td.style.color = objColor[td.textContent]
        }
    })
    const trEvent = document.querySelectorAll('.trEvent')
    trEvent.forEach(el => {
        el.setAttribute('tabindex', '0');
        el.addEventListener('mouseenter', function () {
            el.style.backgroundColor = 'lightgray';
        });
        el.addEventListener('mouseleave', function () {
            el.style.backgroundColor = '';
        });
    });
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