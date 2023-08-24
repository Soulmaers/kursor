import { tr } from './content.js'
import { convert } from './helpersFunc.js'
import { ggg } from './menu.js'
import { createMap, createMapsUniq } from './geo.js'
import { testovfn } from './charts/bar.js'
import { Tooltip } from '../class/Tooltip.js'
import { DraggableContainer } from '../class/Dragdown.js'



const login = document.querySelectorAll('.log')[1].textContent
let isProcessing = false
export async function alarmFind() {
    if (isProcessing) {
        return;
    }
    isProcessing = true;
    const tr = document.querySelectorAll('.tr')
    if (tr) {
        tr.forEach(it => {
            it.remove();
        })
    }
    const idw = document.querySelector('.color').id
    const par = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idw })
    }
    const tyres = await fetch('/api/tyresView', par)
    const tyresmassiv = await tyres.json();
    if (tyresmassiv.result) {
        console.log(tyresmassiv.result)
        const sorTyres = convert(tyresmassiv.result)
        const storValue = [];
        sorTyres.forEach(async e => {
            const tyresP = e.pressure
            const stor = await fetch('/api/alarmFind', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idw, tyresP })
            })
            const storList = await stor.json();
            storValue.push(storList)
        })
        setTimeout(viewAlarmStorage, 1000, idw, storValue)
    }
    isProcessing = false
}

async function viewAlarmStorage(name, stor) {
    function removeDuplicates(arr) {
        const result = [];
        const duplicatesIndexes = [];
        // Проходимся по каждому элементу вложенного массива
        arr.forEach((item, index) => {
            // Превращаем текущий элемент в строку для сравнения с другими элеметами
            const itemAsString = JSON.stringify(item);
            // Если текущий элемент не является дубликатом - записываем его
            if (!duplicatesIndexes.includes(index)) {
                result.push(item);
                // Находим индексы всех дубликатов текущего элемента
                for (let i = index + 1; i < arr.length; i++) {
                    const currentItemAsString = JSON.stringify(arr[i]);
                    if (itemAsString === currentItemAsString) {
                        duplicatesIndexes.push(i);
                    }
                }
            }
        });
        return result;
    }
    const result = stor.map((arr) => removeDuplicates(arr))
    const tbody = document.querySelector('.tbody')

    tbody.innerHTML = tr
    const oneName = document.querySelector('.oneName')
    const info = document.createElement('div')
    info.classList.add('infosAlarm')
    oneName.children[0].prepend(info)
    const infos = document.querySelector('.infosAlarm')
    new Tooltip(infos, ['Лента уведомлений отражает зафиксированные отклонения от заданных параметров по давлению и температуре',
        'Если внутри зафиксированного отклонения есть дополнительные изменения, то они подгружаются по нажатию стрелки вниз напротив уведомления',
        'Если нажать красный маркер карты, то на карте отразится место события с переданными туда данными']);

    const active = document.querySelector('.color')
    const allobj = await ggg(active.id)
    result.forEach(el => {
        let count = 0;
        el.forEach(it => {
            if (!allobj.hasOwnProperty(it.senspressure)) {
                return
            }
            it.senspressure = allobj[it.senspressure]
            count++
            const tr = document.createElement('div')
            tr.classList.add('tr')
            tr.classList.add('trnone')
            tr.setAttribute('rel', `${name}`)
            tbody.appendChild(tr)

            const toSearch = "Норма";
            if (count == 1) {
                tr.classList.add('views')
            }
            if (it.alarm == toSearch) {
                tr.classList.add('norma')
            }
            for (var key in it) {
                const td = document.createElement('p')
                td.classList.add('td')
                td.textContent = it[key]
                tr.appendChild(td)
            }
            const t = document.querySelectorAll('.tr')
            for (let i = 0; i < t.length; i++) {
                if (t[i].children[4].textContent == 'Норма' && t[i + 1] !== undefined) {
                    t[i + 1].classList.add('views')
                }
                if (t[i].nextSibling !== null) {
                    if (t[i].classList.contains('views') && !t[i].nextSibling.classList.contains('views') && !t[i].nextSibling.classList.contains('norma')) {
                        t[i].classList.add('best')
                    }
                }
            }
        })
    })
    const t = document.querySelectorAll('.tr')
    if (t.length === 1) {
        return
    }
    t.forEach(el => {
        const dop = document.createElement('p')
        dop.classList.add('td')
        el.appendChild(dop);
        dop.style.width = '120px'
        if (el.nextSibling !== null && !el.classList.contains('norma') && el.children[1].textContent !== el.nextSibling.children[1].textContent
            && !el.classList.contains('oneName') || !el.classList.contains('norma')
            && !el.nextSibling) {
            if (el.previousSibling.children[1].textContent !== el.children[1].textContent || el.previousSibling.classList.contains('norma')) {
                el.classList.add('alarmOpen')
                const alarmFire = document.createElement('div')
                alarmFire.classList.add('alarmFire')
                el.appendChild(alarmFire)
                alarmFire.innerHTML = '&#128293'
                el.style.position = 'relative'
                alarmFire.style.position = 'absolute'
                alarmFire.style.right = '4px';
                alarmFire.style.top = 0;
                alarmFire.style.fontSize = '10px';
            }
            const prevElem = prevAll(el)
            let count = 0;
            const y = prevElem.reverse();
            y.forEach(e => {
                if (e.children[1].textContent === el.children[1].textContent && e.classList.contains('best') && !e.classList.contains('norma')) {
                    count++
                    if (count == 1) {
                        e.classList.add('alarmOpen')
                        const alarmFire = document.createElement('div')
                        alarmFire.classList.add('alarmFire')
                        e.appendChild(alarmFire)
                        alarmFire.innerHTML = '&#128293'
                        e.style.position = 'relative'
                        alarmFire.style.position = 'absolute'
                        alarmFire.style.right = '4px';
                        alarmFire.style.top = 0;
                        alarmFire.style.fontSize = '10px';
                    }
                }
            })
            function prevAll(el) {
                const prevElements = []
                let prevElement = el.parentNode.firstElementChild
                while (prevElement !== el) {
                    prevElements.push(prevElement)
                    prevElement = prevElement.nextElementSibling
                }
                return prevElements
            }
        }
    })
    if (t[0] && t[0].children[5]) {
        t[0].children[5].textContent = 'Время аларма'
        const best = document.querySelectorAll('.best')
        best.forEach(el => {
            const wrapItem = document.createElement('div')
            wrapItem.classList.add('wrapItem')
            el.appendChild(wrapItem)
            const itemIn = document.createElement('div')
            itemIn.classList.add('itemIn')
            const itemOut = document.createElement('div')
            itemOut.classList.add('itemOut')
            wrapItem.appendChild(itemIn)
            wrapItem.appendChild(itemOut)
            el.style.position = 'relative'
            itemIn.style.position = 'absolute'
            itemIn.style.left = '2px';
            itemIn.style.top = '5px';
            itemOut.style.position = 'absolute'
            itemOut.style.left = '2px';
            itemOut.style.top = '5px';
            const wrapSpoyler = document.createElement('div')
            wrapSpoyler.classList.add('wrapSpoyler')
            el.appendChild(wrapSpoyler)
            const next = nextAll(el)
            let countts = 0;
            next.forEach(it => {
                if (it.classList.contains('norma') !== false) {
                    countts++
                }
                if (it.classList.contains('norma') == false
                    && it.children[1].textContent == el.children[1].textContent && countts < 1) {
                    it.classList.add('spoyler');
                    wrapSpoyler.appendChild(it)
                }
            });
            el.addEventListener('click', () => {
                if (el.classList.contains('activeListtt')) {
                    itemIn.style.display = 'flex'
                    itemOut.style.display = 'none'
                    el.classList.remove('activeListtt')
                    el.querySelector('.wrapSpoyler').style.display = 'none'
                    return
                }
                el.classList.add('activeListtt')
                itemIn.style.display = 'none'
                itemOut.style.display = 'flex'
                el.querySelector('.wrapSpoyler').style.display = 'flex'
                const redHidden = document.querySelectorAll('.spoyler')
                redHidden.forEach(el => {
                    Array.from(el.children).forEach(it => {
                        it.style.fontSize = '11px'
                        it.style.fontWeight = 'normal'
                        it.style.color = '#000'
                    })
                })
            })
        })
    }
    t.forEach(el => {
        if (el.nextSibling !== null && !el.classList.contains('alarmOpen') && !el.classList.contains('oneName') && !el.classList.contains('spoyler')) {
            if (el.nextSibling.classList.contains('norma') && el.nextSibling.children[1].textContent == el.children[1].textContent) {
                const dt = [...el.nextSibling.children[0].textContent]
                const allmassiv = [];
                allmassiv.push(dt[6], dt[7], dt[8], dt[9], '-', dt[3], dt[4], '-', dt[0], dt[1], 'T', dt[11], dt[12], dt[13], dt[14], dt[15], ':', '0', '0', 'Z')
                const itog = Date.parse(allmassiv.join(''))
                const dt2 = [...el.children[0].textContent]
                const allmassiv2 = [];
                allmassiv2.push(dt2[6], dt2[7], dt2[8], dt2[9], '-', dt2[3], dt2[4], '-', dt2[0], dt2[1], 'T', dt2[11], dt2[12], dt2[13], dt2[14], dt2[15], ':', '0', '0', 'Z')
                const itog2 = Date.parse(allmassiv2.join(''))
                const res = (itog - itog2)
                const minutes = Math.floor((res / (1000 * 60)) % 60)
                const hours = Math.floor((res / (1000 * 60 * 60)) % 24);
                const day = Math.floor((res / (1000 * 60 * 60 * 24)) % 24);
                const days = (day < 1) ? "" + day : day;
                const hourss = (hours < 10) ? "" + hours : hours;
                const minutess = (minutes < 10) ? "" + minutes : minutes;
                const interval = days + 'd' + ' ' + hourss + "h" + ' ' + + minutess + "m"
                el.children[5].textContent = interval
            }
            else if (el.classList.contains('best') && el.nextSibling.classList.contains('norma') && el.nextSibling.children[1].textContent == el.children[1].textContent) {
                const dt = [...el.nextSibling.children[0].textContent]
                const allmassiv = [];
                allmassiv.push(dt[6], dt[7], dt[8], dt[9], '-', dt[3], dt[4], '-', dt[0], dt[1], 'T', dt[11], dt[12], dt[13], dt[14], dt[15], ':', '0', '0', 'Z')
                const itog = Date.parse(allmassiv.join(''))
                const dt2 = [...el.lastElementChild.lastElementChild.childre[0].textContent]
                const allmassiv2 = [];
                allmassiv2.push(dt2[6], dt2[7], dt2[8], dt2[9], '-', dt2[3], dt2[4], '-', dt2[0], dt2[1], 'T', dt2[11], dt2[12], dt2[13], dt2[14], dt2[15], ':', '0', '0', 'Z')
                const itog2 = Date.parse(allmassiv2.join(''))
                const res = (itog - itog2)
                const minutes = Math.floor((res / (1000 * 60)) % 60)
                const hours = Math.floor((res / (1000 * 60 * 60)) % 24);
                const day = Math.floor((res / (1000 * 60 * 60 * 24)) % 24);
                const days = (day < 1) ? "" + day : day;
                const hourss = (hours < 10) ? "" + hours : hours;
                const minutess = (minutes < 10) ? "" + minutes : minutes;
                const interval = days + 'd' + ' ' + hourss + "h" + ' ' + + minutess + "m"
                el.children[5].textContent = interval
            }
        }
    })
    const arrName = tbody.querySelectorAll(`[rel="${name}"]`);
    arrName.forEach(e => {
        if (e.children[3].textContent <= -50 || e.children[3].textContent > 70) {
            e.children[3].style.background = 'yellow';
        }
        else {
            e.children[2].style.background = 'yellow';
        }
    })
    const vieList = document.querySelectorAll('.views')
    const spoyler = document.querySelectorAll('.spoyler')
    function fntinesort(elem) {
        const dt = [...elem]
        const allmassive = [];
        allmassive.push(dt[6], dt[7], dt[8], dt[9], '-', dt[3], dt[4], '-', dt[0], dt[1], 'T', dt[11], dt[12], dt[13], dt[14], dt[15], ':', '0', '0', 'Z')
        const itog = Date.parse(allmassive.join(''))
        return itog
    }
    // tbody.style.height = '50vh'
    const arr = [];
    vieList.forEach(el => {
        el.style.position = 'relative'
        const mapIcon = document.createElement('div')
        mapIcon.classList.add('mapIcon')
        el.appendChild(mapIcon)
        arr.push(el)
    })
    spoyler.forEach(e => {
        e.style.position = 'relative'
        const mapIcon = document.createElement('div')
        mapIcon.classList.add('mapIcon')
        e.appendChild(mapIcon)
    })
    arr.sort(function (a, b) {
        return parseFloat(fntinesort(b.children[0].textContent)) - parseFloat(fntinesort(a.children[0].textContent))
    });
    arr.forEach(it => {
        tbody.appendChild(it)
    })
    alarmFire()



    const mess = document.querySelectorAll('.mapIcon')
    mess.forEach(icons => {
        icons.addEventListener('click', () => {
            const time = icons.parentElement.children[0].textContent
            const tr = icons.parentElement
            geoMarker(time, name, tr);
        })
    })
}
function alarmFire() {
    const alarmStorage = document.querySelectorAll('.alarmFire')
    const ogon = document.querySelector('.ogon')
    alarmStorage ? ogon.style.display = 'block' : ogon.style.display = 'none'
}
function nextAll(elem) {
    var next = false;
    return [].filter.call(elem.parentNode.children, function (child) {
        if (child === elem) next = true;
        return next && child !== elem
    })
};
const plus = document.querySelector('.plus')
const minus = document.querySelector('.minus')
const alarmStorage = document.querySelector('.alarmStorage')

plus.addEventListener('click', (event) => {
    alarmStorage.style.display = 'block';
    new DraggableContainer(alarmStorage)

    plus.style.display = 'none';
    minus.style.display = 'block'
    event.stopPropagation();
    document.addEventListener('click', function (event) {
        if (event.target !== alarmStorage && !alarmStorage.contains(event.target) && event.target !== minus) {
            alarmStorage.style.display = 'none';
            plus.style.display = 'block';
            minus.style.display = 'none'
            alarmFind()
            const mapss = document.getElementById('mapOil')
            if (mapss) {
                mapss.remove();
            }
        }
    });
})
minus.addEventListener('click', () => {
    alarmStorage.style.display = 'none';
    plus.style.display = 'block';
    minus.style.display = 'none'
    alarmFind()
    const mapss = document.getElementById('mapOil')
    if (mapss) {
        mapss.remove();
    }
})

async function geoMarker(time, idw, tr) {
    const dateString = time;
    const dateFormat = "dd.mm.yyyy HH:MM";
    const parts = dateString.match(/(\d+)/g);
    const dateObj = new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4]);
    const unixTime = Math.floor(dateObj.getTime() / 1000);
    const nowDate = unixTime
    const timeFrom = unixTime - 3600
    console.log(nowDate, timeFrom, idw, login); // 1687935780
    const ttt = await testovfn(idw, timeFrom, nowDate)
    const geoCard = ttt.map(e => {
        return {
            ...e,
            geo: JSON.parse(e.geo)
        };
    });
    console.log(geoCard);
    const trackAlarm = geoCard.map(it => {
        return it.geo
    })
    console.log(trackAlarm);
    const nameCar = document.querySelector('.color').children[0].textContent
    const alarm = {
        car: nameCar,
        time: tr.children[0].textContent,
        tyres: tr.children[1].textContent,
        bar: tr.children[2].textContent,
        temp: tr.children[3].textContent,
        alarm: tr.children[4].textContent,
    }
    const geo = {
        geoX: geoCard[geoCard.length - 1].geo[1],
        geoY: geoCard[geoCard.length - 1].geo[0],
        info: alarm,
        speed: geoCard[geoCard.length - 1].speed
    }
    createMapsUniq(trackAlarm, geo, 'alarm')
}




