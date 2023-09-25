import { DraggableContainer } from '../class/Dragdown.js'
import { CloseBTN } from '../class/Flash.js'
import { titleLogs } from './content.js'
import { reverseGeocode, createMapsUniq } from './geo.js'
import { Tooltip } from '../class/Tooltip.js'
import { filterEvent } from './content.js'


const objFuncAlarm = {
    email: { fn: sendEmail },
    alert: { fn: createPopup },
    what: { fn: sendWhat },
    teleg: { fn: sendTeleg },
    sms: { fn: sendSMS }
}


function sendWhat() {
    console.log('отправка ватсап')
}
function sendTeleg() {
    console.log('отправка телега')
}
function sendSMS() {
    console.log('отправка смс')
}

function sendEmail(mess) {
    console.log(mess)

    let smtpTransport;
    try {
        smtpTransport = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 465,
            secure: true, // true for 465, false for other ports 587
            auth: {
                user: "develop@cursor-gps.ru",
                pass: process.env.MAIL_PASS  //NphLycnf9gqPysYJt3jf
            }
        });
    } catch (e) {
        return console.log('Error: ' + e.name + ":" + e.message);
    }

    let mailOptions = {
        from: 'develop@cursor-gps.ru', // sender address
        to: 'soulmaers@gmail.com', // list of receivers
        subject: 'Уведомление', // Subject line
        text: mess // plain text body
    };
    smtpTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            // return console.log(error);
            return console.log(error);
        } else {
            console.log('отправлено')
        }

    })
}
/*
var options = {
    method: 'POST',
    url: 'https://api.ultramsg.com/instance45156/messages/chat',
    headers: { 'content-type': ' application/x-www-form-urlencoded' },
    form: {
        "token": "0cnqlft2roemo3j4",
        "to": 89627295770,
        "body": message
    }
};

request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
});*/



async function createPopup(array) {
    console.log(array)
    const arr = Object.values(array[0]);
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
        //  position = 0
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
    const viewNum = results.length - resultsLog[0].quantity
    viewTableNum(viewNum)
    if (num === 0) {
        previus = results.length
    }
    if (previus !== results.length && num !== 0) {
        const num = results.length - previus
        const arrayPopup = results.slice(-num)
        previus = results.length
        arrayPopup.forEach(async el => {
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
            console.log(el)
            if (event === 'Заправка') {
                mess = [{ event: event, group: `Компания: ${el.groups}`, name: `${el.name}`, litrazh: `${content[0].litrazh}`, time: `Время заправки: ${formattedDate}` }]
            }
            if (event === 'Простой') {
                mess = [{ event: event, group: `Компания: ${el.groups}`, name: `${el.name}`, time: `${content[0].time}`, alarm: `${content[0].alarm}` }]
            }
            if (event === 'Предупреждение') {
                mess = [{ event: event, group: `Компания: ${group}`, name: `${el.name}`, time: `${content[0].time}`, tyres: `${content[0].tyres}`, param: `${content[0].param}`, alarm: `${content[0].alarm}` }]
            }
            if (event === 'Слив') {
                mess = [{ event: event, group: `Компания: ${el.groups}`, name: `${el.name}`, litrazh: `${content[0].litrazh}`, time: `Время слива: ${formattedDate}` }]
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
        const time = times(new Date(Number(el.time) * 1000));
        const info = `${int.join(", ")}`;
        return { time: time, group: typeEvent !== 'Предупреждение' ? el.groups : login === 'Курсор' ? 'demo' : group, name: el.name, typeEvent: typeEvent, content: info, geo: geo, id: el.idw };
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
                    console.log(e)
                    const obj = [{ geo: geo, logs: [e.lastElementChild.parentElement.children[0].textContent, e.lastElementChild.parentElement.children[2].textContent, e.lastElementChild.parentElement.children[4].textContent] }]
                    createMapsUniq([], obj, 'log')
                    const wrap = document.querySelector('.wrapMap')
                    new CloseBTN(wrap)
                };
                e.addEventListener('click', clickHandler);
            })
            const log = document.querySelector('.logs')
            const wrapperLogs = document.querySelector('.alllogs')
            async function togglePopup() {
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
            const allobjects = document.querySelector('.allobjects')
            allobjects.removeEventListener('click', chanchColor)
        }

    }).catch(error => {
        console.error(error);
    })
    setTimeout(logsView, 10000, array)
}


function chanchColor() {
    const grays = document.querySelectorAll('.graysEvent')
    const allobjects = document.querySelector('.allobjects')
    console.log('джойс')
    let check = false
    grays.forEach(el => {
        if (el.classList.contains('toogleIconEvent')) {
            check = true
        }
    })

    const color = document.querySelector('.color')
    const trEvent = document.querySelectorAll('.trEvent')
    const choice = document.querySelector('.choice')
    if (choice) {
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
    console.log(num)
    const nums = document.querySelector('.num')
    nums.textContent = num
}

const objColor = {
    'Заправка': 'darkblue',
    'Простой': 'darkgreen',
    'Предупреждение': 'darkred',
    'Слив': 'red'
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
    const icon = document.createElement('i')
    icon.classList.add('fas')
    icon.classList.add('fa-binoculars')
    icon.classList.add('allobjects')
    body.appendChild(alllogs)
    alllogs.appendChild(spanTitle)
    alllogs.appendChild(icon)
    alllogs.appendChild(log)
    log.innerHTML = titleLogs
    const evnt = document.querySelector('.evnt')
    evnt.addEventListener('mouseenter', () => evnt.children[0].style.display = 'flex')
    evnt.addEventListener('mouseleave', () => evnt.children[0].style.display = 'none')
    const filterEvent = document.querySelector('.filterEvent')
    filterEvent.addEventListener('click', eventFilter)

    var firstChild = log.firstChild;
    new Tooltip(icon, ['Все объекты/Текущий']);
    mass.forEach(el => {
        const trEvent = document.createElement('div')
        trEvent.classList.add('trEvent')
        trEvent.setAttribute('rel', `${el.id}`)
        log.insertBefore(trEvent, firstChild.nextSibling)
        delete el.id
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
    event.target.classList.toggle('toogleIconEvent')
    console.log('клик по эвент?')
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
                    if (!choice) {
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
    !check ? choice || !color ? trEvent.forEach(e => e.style.display = 'flex') : trEvent.forEach(e => { if (color.id === e.getAttribute('rel')) { e.style.display = 'flex' } }) : null
}