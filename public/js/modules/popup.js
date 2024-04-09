import { DraggableContainer } from '../class/Dragdown.js'
import { CloseBTN } from '../class/CloseBTN.js'
import { titleLogs } from './content.js'
import { createMapsUniq } from './geo.js'
import { Tooltip } from '../class/Tooltip.js'


async function createPopup(array) {
    const arr = Object.values(array[0]);
    console.log(arr)
    const body = document.getElementsByTagName('body')[0]
    const pop = document.createElement('div')
    pop.classList.add('popup')
    body.prepend(pop)
    const popH = document.createElement('div')
    popH.classList.add('popH')
    const popupHead = document.createElement('div')
    popupHead.classList.add('popup-header')
    popupHead.textContent = arr[0]
    arr.shift()
    pop.appendChild(popH)
    popH.appendChild(popupHead)
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
    popupClose.innerHTML = `<i class="fas fa fa-times "></i>`
    popH.appendChild(popupClose)
    const popup = document.querySelector('.popup');
    popup.style.display = "block";
    const popy = document.querySelector('.popup-background')
    popy.style.display = 'block'

    popup.classList.add('open');
    const closeButton = document.querySelector('.popup-close');
    closeButton.addEventListener('click', function () {
        popup.remove();
        popy.style.display = 'none'
    });
    setTimeout(function () {
        popup.remove();
        popy.style.display = 'none'
    }, 10000);

}

let previus = 0;
let num = 0;
let quantity = 0;
let count = 300;
let arrayObjects;
let data;
export async function logsView(array) {
    let bool = false
    if (array) {
        arrayObjects = array
    }
    arrayObjects.forEach(el => {
        el.length !== 0 ? bool = true : null
    })
    if (!bool) {
        return
    }
    const login = document.querySelectorAll('.log')[1].textContent
    const arrayId = arrayObjects.reduce((acc, el) => {
        Object.values(el).forEach(subArray => {
            acc.push(subArray[4]);
        });
        return acc;
    }, []);
    const arrayIdGroup = arrayObjects.reduce((acc, el) => {
        Object.values(el).forEach(subArray => {
            acc.push([subArray[4], subArray[6]]);
        });
        return acc;
    }, []);
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ arrayId, quantity, count }))
    }
    const ress = await fetch('/api/logsView', param)
    const value = await ress.json()
    const results = value.itog
    quantity = results
    const paramLog = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ login }))
    }
    const resLog = await fetch('/api/quantityLogs', paramLog)
    const resultsLog = await resLog.json()
    const viewNum = value.quant - resultsLog[0].quantity
    viewTableNum(viewNum)

    if (num === 0) {
        previus = value.quant
    }
    if (previus !== value.quant && num !== 0) {
        const num = value.quant - previus
        // const arrayPopup = value.view.slice(-num)
        previus = value.quant
        var arraypop = value.view.filter(function (objB) {
            return !data.some(function (objA) {
                return objA.data === objB.time;
            });
        });
        arraypop.forEach(async el => {
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
            if (event === 'Заправка') {
                mess = [{ event: event, group: `Компания: ${el.groups}`, name: `Объект: ${el.name}`, litrazh: `${content[0].litrazh}`, time: `Время заправки: ${formattedDate}` }]
            }
            if (event === 'Простой') {
                mess = [{ event: event, group: `Компания: ${el.groups}`, name: `Объект: ${el.name}`, time: `${content[0].time}`, alarm: `${content[0].alarm}` }]
            }
            if (event === 'Предупреждение') {
                mess = [{ event: event, group: `Компания: ${group}`, name: `${el.name}`, time: `${content[0].time}`, tyres: `${content[0].tyres}`, param: `${content[0].param}`, alarm: `${content[0].alarm}` }]
            }
            if (event === 'Слив') {
                mess = [{ event: event, group: `Компания: ${el.groups}`, name: `Объект: ${el.name}`, litrazh: `${content[0].litrazh}`, time: `Время слива: ${formattedDate}` }]
            }
            if (event === 'Потеря связи') {
                mess = [{ event: event, group: `Компания: ${el.groups}`, name: `Объект: ${el.name}`, lasttime: `${content[0].lasttime}` }]
            }
            const prms = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: (JSON.stringify({ login }))
            }
            const res = await fetch('/api/viewEvent', prms)
            const result = await res.json()
            if (result.itog.length !== 0) {
                delete result.itog[0].login
                delete result.itog[0].id
                const viewObj = result.itog[0]
                for (let key in viewObj) {
                    viewObj[key] = JSON.parse(viewObj[key]);
                    viewObj[key] = viewObj[key].map(el => {
                        if (el === 'Давление' || el === 'Температура') {
                            return 'Предупреждение';
                        }
                        return el;
                    });
                }
                viewObj.alert.forEach(e => {
                    e === event ? createPopup(mess) : null; // Это изменено
                });
            }
            else {
                console.log('нет данных')
            }
        })
        previus = results.length
    }
    num++
    const clickLog = document.querySelector('.clickLog')
    if (value.view.length !== 0) {
        const mass = value.view.map(el => {
            const parsedContent = JSON.parse(el.content);
            const typeEvent = parsedContent[0].event;
            const geoloc = el.geo !== '' ? JSON.parse(el.geo) : null;
            const geo = geoloc !== null ? geoloc.map(e => Number(e).toFixed(5)) : 'нет данных'
            const id = parseFloat(el.idw)
            const group = arrayIdGroup
                .filter(it => it[0] === id)
                .map(it => it[1]);
            const int = Object.values(parsedContent[0]);
            int.shift();
            const time = times(new Date(Number(el.time) * 1000));
            const info = `${int.join(", ")}`;
            return { data: el.time, time: time, group: login === 'Курсор' ? 'demo' : typeEvent !== 'Предупреждение' ? el.groups : group, name: el.name, typeEvent: typeEvent, content: info, geo: geo, id: el.idw };
        });
        data = mass
        !clickLog ? await createLogsTable(mass) : null
    } else {
        !clickLog ? await createLogsTable([]) : null
    }

    if (!clickLog) {
        const tr = document.querySelectorAll('.trEvent')
        tr.forEach(e => {
            e.style.cursor = 'default'
            e.children[3].style.cursor = 'pointer'
            e.children[2].style.cursor = 'pointer'
            const clickHandler = (event) => {
                event.stopPropagation();
                const geo = [];
                geo.push(parseFloat(e.lastElementChild.textContent.split(',')[0]))
                geo.push(parseFloat(e.lastElementChild.textContent.split(',')[1]))
                const obj = [{ geo: geo, logs: [e.lastElementChild.parentElement.children[0].textContent, e.lastElementChild.parentElement.children[2].textContent, e.lastElementChild.parentElement.children[4].textContent] }]
                createMapsUniq([], obj, 'log')
                const wrap = document.querySelector('.wrapMap')
                new CloseBTN(wrap)
            };
            e.children[3].addEventListener('click', clickHandler);
            e.children[2].addEventListener('click', clickHandlerObject);
        })
        const log = document.querySelector('.logs')
        const wrapperLogs = document.querySelector('.alllogs')
        const numy = document.querySelector('.num')
        // Добавляем обработчики кликов
        new CloseBTN(wrapperLogs, log, numy)
        const allobjects = document.querySelector('.allobjects')
        allobjects.removeEventListener('click', chanchColor)
    }

}

async function togglePopup() {
    const login = document.querySelectorAll('.log')[1].textContent
    const wrapperLogs = document.querySelector('.alllogs')
    const grays = document.querySelectorAll('.graysEvent')
    grays.forEach(e => {
        if (e.classList.contains('toogleIconEvent')) {
            e.classList.remove('toogleIconEvent')
        }
    })
    if (wrapperLogs.style.display === '' || wrapperLogs.style.display === 'none') {
        wrapperLogs.style.display = 'block'// Показываем попап
        wrapperLogs.classList.add('clickLog')
        const color = document.querySelector('.color')
        const evnt = document.querySelector('.evnt')
        evnt.style.color = 'rgba(6, 28, 71, 1)'
        const trEvent = document.querySelectorAll('.trEvent')
        trEvent.forEach(item => item.style.display = 'flex')
        const allobjects = document.querySelector('.allobjects')
        const choice = document.querySelector('.choice')
        choice ? choice.classList.remove('choice') : null
        color ? (allobjects.style.display = 'block', trEvent.forEach(item => {
            item.getAttribute('rel') !== color.id ? item.style.display = 'none' : null
        })) : (trEvent.forEach(item => { item.style.display = 'flex' }), allobjects.style.display = 'none')
        allobjects.addEventListener('click', chanchColor)
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ login, quantity }))

        }
        const res = await fetch('/api/viewLogs', param)
        const confirm = await res.json()

        viewTableNum(0)
        updateRows()

    } else {
        wrapperLogs.style.display = 'none'; // Скрываем попап
        wrapperLogs.classList.remove('clickLog')

    }
}
function updateRows() {
    const enterRows = document.querySelector('.enterRows')
    enterRows.addEventListener('input', async function (event) {
        const row = Number(event.target.value)
        count = row
        await logsView()
        createLogsTable(data)
        const evgentElement = document.querySelector('.toogleIconEvent')
        evgentElement ? filterEventLogs(evgentElement) : null
        const tr = document.querySelectorAll('.trEvent')
        tr.forEach(e => {
            e.style.cursor = 'default'
            e.children[3].style.cursor = 'pointer'
            e.children[2].style.cursor = 'pointer'
            const clickHandler = (event) => {
                event.stopPropagation();
                const geo = [];
                geo.push(parseFloat(e.lastElementChild.textContent.split(',')[0]))
                geo.push(parseFloat(e.lastElementChild.textContent.split(',')[1]))
                const obj = [{ geo: geo, logs: [e.lastElementChild.parentElement.children[0].textContent, e.lastElementChild.parentElement.children[2].textContent, e.lastElementChild.parentElement.children[4].textContent] }]
                createMapsUniq([], obj, 'log')
                const wrap = document.querySelector('.wrapMap')
                new CloseBTN(wrap)
            };
            e.children[3].addEventListener('click', clickHandler);
            e.children[2].addEventListener('click', clickHandlerObject);
        })
    });
}



function clickHandlerObject(event) {
    const allobjects = document.querySelector('.allobjects')
    allobjects.style.display = 'flex'
    const element = event.target
    const id = element.parentElement.getAttribute('rel')
    const listItem = document.querySelectorAll('.listItem')
    listItem.forEach(it => {
        if (it.getAttribute('rel') === id) {
            chanchColor()
            const evgentElement = document.querySelector('.toogleIconEvent')
            filterEventLogs(evgentElement)
        }
    })
}
function chanchColor() {
    const grays = document.querySelectorAll('.graysEvent')
    const allobjects = document.querySelector('.allobjects')
    let check = false
    grays.forEach(el => {
        if (el.classList.contains('toogleIconEvent')) {
            check = true
        }
    })

    const color = document.querySelector('.color')
    const trEvent = document.querySelectorAll('.trEvent')
    const choice = document.querySelector('.choice')
    if (!choice) {
        trEvent.forEach(e => {
            if (e.getAttribute('rel') !== color.id) {
                e.style.display = 'none';
            }
        });
    } else {
        if (!check) {
            trEvent.forEach(e => e.style.display = 'flex');
        }
        else {
            grays.forEach(el => {
                if (el.classList.contains('toogleIconEvent')) {
                    trEvent.forEach(it => {
                        if (it.children[3].textContent === el.nextElementSibling.textContent) {
                            it.style.display = 'flex'
                        }
                    })
                }
            })
        }
    }
    allobjects.classList.toggle('choice')
}
function viewTableNum(num) {
    const nums = document.querySelector('.num')
    nums.textContent = num
}

const objColor = {
    'Заправка': 'darkblue',
    'Простой': 'darkgreen',
    'Предупреждение': 'darkred',
    'Слив': 'red',
    'Потеря связи': '#28ad9e',
    'Состояние': '#acad4c'
}
async function createLogsTable(mass) {
    const wrap = document.querySelector('.alllogs')
    if (!wrap) {
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
        const enterRows = document.createElement('input')
        enterRows.classList.add('enterRows')
        enterRows.value = 300
        const icon = document.createElement('i')
        icon.classList.add('fas')
        icon.classList.add('fa-binoculars')
        icon.classList.add('allobjects')
        body.appendChild(alllogs)
        alllogs.appendChild(spanTitle)
        alllogs.appendChild(enterRows)
        alllogs.appendChild(icon)
        alllogs.appendChild(log)
        log.innerHTML = titleLogs
        const evnt = document.querySelector('.evnt')
        evnt.addEventListener('mouseenter', () => evnt.children[0].style.display = 'flex')
        evnt.addEventListener('mouseleave', () => evnt.children[0].style.display = 'none')
        const filterEvent = document.querySelector('.filterEvent')
        filterEvent.addEventListener('click', eventFilter)

    }
    const wrapLogs = document.querySelector('.wrapperLogs')
    const allobjects = document.querySelector('.allobjects')
    const firstChild = wrapLogs.firstChild;
    new Tooltip(allobjects, ['Все объекты/Текущий']);

    const trEvents = document.querySelectorAll('.trEvent')
    trEvents.forEach(e => {
        e.remove()
    })
    mass.forEach(el => {
        const trEvent = document.createElement('div')
        trEvent.classList.add('trEvent')
        trEvent.setAttribute('rel', `${el.id}`)
        wrapLogs.insertBefore(trEvent, firstChild.nextSibling)
        //  delete el.id
        for (var key in el) {
            if (key !== 'id' && key !== 'data') {
                const td = document.createElement('p')
                td.classList.add('tdEvent')
                td.textContent = el[key]
                td.setAttribute('rel', `${el.id}`)
                trEvent.appendChild(td)
                td.style.color = objColor[td.textContent]
            }

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


const log = document.querySelector('.logs')
log.addEventListener('click', function (event) {
    event.stopPropagation();
    const wr = document.querySelector('.alllogs')
    const draggable = new DraggableContainer(wr);
    togglePopup(); // Появление/скрытие попапа при клике на элементе "log"
});
const numy = document.querySelector('.num')
numy.addEventListener('click', function (event) {
    event.stopPropagation();
    togglePopup(); // Появление/скрытие попапа при клике на элементе "log"
});


export function times(time) {
    const day = time.getDate();
    const month = (time.getMonth() + 1).toString().padStart(2, '0');
    const year = time.getFullYear();
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
    return formattedDate
}

function eventFilter() {
    const sortConditionTypeFilter = document.querySelector('.sortConditionTypeFilter')
    sortConditionTypeFilter.style.display = 'flex'
    const grays = document.querySelectorAll('.graysEvent')
    sortConditionTypeFilter.addEventListener('mouseleave', () => (sortConditionTypeFilter.style.display = 'none', grays.forEach(el => {
        el.removeEventListener('click', filterEventLogs);
    })))

    grays.forEach(el => {
        el.addEventListener('click', filterEventLogs)
    })
}

function filterEventLogs(event) {
    const choice = document.querySelector('.choice')
    if (event.isTrusted) {
        event.target.classList.toggle('toogleIconEvent');
    }
    else {
        event.classList.add('toogleIconEvent');
    }
    const grays = document.querySelectorAll('.graysEvent')
    const trEvent = document.querySelectorAll('.trEvent')
    trEvent.forEach(e => e.style.display = 'none')
    const color = document.querySelector('.color')
    const evnt = document.querySelector('.evnt')
    grays.forEach(el => {
        if (el.classList.contains('toogleIconEvent')) {
            trEvent.forEach(it => {
                if (!color) {
                    if (it.children[3].textContent === el.nextElementSibling.textContent) {
                        it.style.display = 'flex'
                    }
                }
                else {
                    if (choice) {
                        if (it.children[3].textContent === el.nextElementSibling.textContent && color.id === it.getAttribute('rel')) {
                            it.style.display = 'flex'
                        }
                    }
                    else {
                        if (it.children[3].textContent === el.nextElementSibling.textContent) {
                            it.style.display = 'flex'
                        }
                    }

                }

            })
        }
    })
    let check = false
    grays.forEach(el => {
        if (el.classList.contains('toogleIconEvent')) {
            check = true
        }
    })
    !check ? evnt.style.color = 'rgba(6, 28, 71, 1)' : evnt.style.color = 'gray'
    !check ? !choice || !color ? trEvent.forEach(e => e.style.display = 'flex') : trEvent.forEach(e => { if (color.id === e.getAttribute('rel')) { e.style.display = 'flex' } }) : null
}