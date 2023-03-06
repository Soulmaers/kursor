import { tr } from './content.js'









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
    // console.log(name[0])
    //const active = document.querySelector('.color')
    //  console.log(active)
    const activePost = name.children[0].textContent.replace(/\s+/g, '')
    console.log(activePost)
    const stor = await fetch('api/alarmFind', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activePost })
    })
    const storList = await stor.json();
    //console.log(storList)
    const storValue = [];
    storList.forEach(e => {
        storValue.push(Object.values(e))

    })
    const origin = [];
    //  console.log(storValue)
    storValue.forEach(el => {
        // console.log(sort(el))
        const val = sort(el)
        origin.push(val)

    })
    console.log(origin)
    viewAlarmStorage(activePost, storValue)

    // console.log(name)
    // setInterval(alarmFind, 6000)
}


function sort(el) {
    // console.log('ап')
    // console.log(el)
    const testAr = [];
    //  console.log(storValue)
    //  console.log(storValue[1])
    //  console.log(...storValue[1])

    testAr.push(el[0], el[1])
    const joi = [];
    joi.push(el[2], el[3], el[4]);

    const joinDone = joi.join('')
    // console.log(testAr)
    // console.log(joinDone)


    const finish = [];
    finish.push(testAr[0], testAr[1], joinDone, el[5], el[6])
    // console.log(finish)
    return finish
}
function viewAlarmStorage(name, stor) {
    console.log('ап')

    const tbody = document.querySelector('.tbody')
    tbody.innerHTML = tr

    stor.forEach(el => {
        const tr = document.createElement('tr')
        tr.classList.add('tr')
        tr.classList.add(`${name}`)
        tbody.appendChild(tr)
        el.forEach(it => {
            const td = document.createElement('td')
            td.classList.add('td')
            td.textContent = it
            tr.appendChild(td)

        })
        if (el[el.length - 1] == 'Потеря связи с датчиком') {
            const arrName = tbody.querySelectorAll(`.${name}`)
            //   console.log(arrName)
            arrName.forEach(e => {
                e.children[4].style.background = 'yellow';
            })

        }
        else {
            const arrName = tbody.querySelectorAll(`.${name}`)
            arrName.forEach(e => {
                e.children[3].style.background = 'yellow';
            })
        }
    })

}


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

