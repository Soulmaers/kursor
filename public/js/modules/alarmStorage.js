import { tr } from './content.js'
import { convert } from './visual.js'

/*
export function proverka(arr, name) {
    console.log(arr)
    let alarm;
    arr.forEach(el => {
        // console.log(el)
        if (el[4] == -51 || el[4] == -128 || el[4] == -50) {
            alarm = 'Потеря связи с датчиком'
            const data = createDate()
            el.shift();
            //    alarmBase(el, data, alarm, name)
        }
        else {
            if (name === 'КранГаличанинР858ОР178') {
                if (el[3] < 6) {
                    alarm = 'Критически низкое давление'
                    const data = createDate()
                    el.shift();
                    //  alarmBase(el, data, alarm, name)
                }
                if (el[3] > 9.9) {
                    alarm = 'Критически высокое давление'
                    const data = createDate()
                    el.shift();
                    //   alarmBase(el, data, alarm, name)
                }
                if (el[4] > 36) {
                    alarm = 'Критически высокая температура'
                    const data = createDate()
                    el.shift();
                    //  alarmBase(el, data, alarm, name)
                }
            }
            else {
                if (el[3] < 8) {
                    alarm = 'Критически низкое давление'
                    const data = createDate()
                    el.shift();
                    // alarmBase(el, data, alarm, name)
                }
                if (el[3] > 10) {
                    alarm = 'Критически высокое давление'
                    const data = createDate()
                    el.shift();
                    //  alarmBase(el, data, alarm, name)
                }
                if (el[4] > 36) {
                    alarm = 'Критически высокая температура'
                    const data = createDate()
                    el.shift();
                    //  alarmBase(el, data, alarm, name)
                }
            }
        }
    })
}
*/
/*
async function alarmBase(tyres, data, alarm, name) {
    tyres.shift()
    const dannie = data.concat(tyres)
    dannie.unshift(name)
    dannie.push(alarm)
    const stor = await fetch('api/alarmStorage', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dannie, name })
    })
    const storList = await stor.json();
}*/


function createDate() {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    today = dd + '.' + mm + '.' + yyyy;
    let time = new Date();
    const hh = String(time.getHours()).padStart(2, '0');
    const min = String(time.getMinutes() + 1).padStart(2, '0'); //January is 0!
    time = hh + '.' + min
    return [today, time]
    // console.log(today)
}




export async function alarmFind(name) {
    const activePost = name.children[0].textContent.replace(/\s+/g, '')
    const par = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activePost })
    }
    const tyres = await fetch('api/tyresView', par)
    const tyresmassiv = await tyres.json();
    const sorTyres = convert(tyresmassiv.values)
    console.log(sorTyres)
    const storValue = [];
    sorTyres.forEach(async e => {
        e.pressure
        const activeName = 'alarm' + activePost + e.pressure
        // console.log(activeName)
        const stor = await fetch('api/alarmFind', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ activeName })
        })
        const storList = await stor.json();
        // console.log(storList)
        storValue.push(storList)
    })
    setTimeout(viewAlarmStorage, 1000, activePost, storValue)
}


function viewAlarmStorage(name, stor) {
    const tbody = document.querySelector('.tbody')
    tbody.innerHTML = tr
    console.log(stor)
    stor.forEach(el => {
        let count = 0;
        el.forEach(it => {
            count++
            const tr = document.createElement('div')
            tr.classList.add('tr')
            tr.classList.add('trnone')
            tr.classList.add(`${name}`)

            tbody.appendChild(tr)
            const toSearch = "Норма";
            if (count == 1) {
                tr.classList.add('views')
                //  tr.style.color = 'blue';
            }
            if (it.alarm == toSearch) {
                tr.classList.add('norma')
                //  tr.style.display = 'none';
            }

            for (var key in it) {
                const td = document.createElement('p')
                td.classList.add('td')
                td.textContent = it[key]
                tr.appendChild(td)
            }
            const t = document.querySelectorAll('.tr')
            for (let i = 0; i < t.length; i++) {
                if (t[i].children[5].textContent == 'Норма' && t[i + 1] !== undefined) {
                    t[i + 1].classList.add('views')
                    //   t[i + 1].classList.add('viewsOut')
                    t[i + 1].style.color = 'blue'
                    //t[i + 1].style.marginLeft = '20px'
                }
            }
        })
    })

    const arrName = tbody.querySelectorAll(`.${name}`)
    arrName.forEach(e => {
        e.children[3].style.background = 'yellow';
        if (e.children[4].textContent == '-51' || e.children[4].textContent == '-50') {
            e.children[4].style.background = 'yellow';
        }
    })
    const v = document.querySelectorAll('.views')
    console.log(v)
    //const vv = Array.from(v)
    /*
    var arrg = Array.prototype.slice.call(v);
    arrg.sort(function (a, b) {
        return a.children[3].innerHTML - b.children[3].innerHTML
    });
    console.log(arrg)
    arrg.forEach(e => {

        e.innerHTML = e.innerHTML
    })*/

    //console.log(arrg)
    const massEl = [];
    v.forEach(el => {
        el.addEventListener('click', () => {

            if (el.classList.contains('activeList')) {
                console.log('делит класс')
                el.nextSibling.style.display = 'none'
                el.nextSibling.style.background = 'none';
                el.classList.remove('activeList')
                el.classList.remove('actfon')
                return
            }
            //  console.log(el.textContent)
            // getSiblings(el)
            const next = nextAll(el)
            console.log(next)
            let countt = 0;
            next.forEach(function (it) {
                if (it.classList.contains('norma') !== false) {
                    countt++
                }
                if (it.classList.contains('norma') == false
                    && it.children[2].textContent == el.children[2].textContent && countt < 1)
                    it.classList.add('red');

            });
            if (el.nextSibling.classList.contains('norma') == false &&
                el.nextSibling.children[2].textContent == el.children[2].textContent) {
                el.nextSibling.style.display = 'flex'
                el.classList.add('activeList')
                el.classList.add('actfon')
                el.nextSibling.style.marginLeft = '20px'
                el.nextSibling.style.background = 'rgb(204, 227, 235)';
                console.log(el)
            }
        })

    })
}

function nextAll(elem) {
    var next = false;
    console.log(elem.parentNode.children)
    return [].filter.call(elem.parentNode.children, function (child) {
        if (child === elem) next = true;
        return next && child !== elem
    })
};
//var div = document.querySelector(".test"), next = nextAll(div);
/*next.forEach(function (el) {
    el.classList.add('red');
});*/





/*
function getSiblings(elem) {
    var siblings = [];
    var sibling = elem;

    sibling = elem;
    while (sibling.nextSibling.classList.contains('norma') == false
        && sibling.nextSibling.children[2].textContent == sibling.children[2].textContent) {
        sibling = sibling.nextSibling;
        sibling.nodeType == 1 && siblings.push(sibling);
    }
    siblings.forEach(e => {
        e.classList.add('views')
    })
    return console.log(siblings);
}*/


const plus = document.querySelector('.plus')
const minus = document.querySelector('.minus')
const alarmStorage = document.querySelector('.alarmStorage')

plus.addEventListener('click', () => {
    alarmStorage.style.display = 'block';
    plus.style.display = 'none';
    minus.style.display = 'block'

})
minus.addEventListener('click', () => {
    alarmStorage.style.display = 'none';
    plus.style.display = 'block';
    minus.style.display = 'none'
})

