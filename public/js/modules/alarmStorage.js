import { tr } from './content.js'


export function proverka(arr, name) {
    //  console.log(arr)
    // console.log(name)
    let alarm;
    arr.forEach(el => {
        if (name === 'КранГаличанинР858ОР178') {
            //  console.log('кран')
            if (el[5] == -51 || el[5] == -128) {
                //  console.log('нет датчика')
                if (!el[1].classList.contains('alarmIn')) {
                    el[1].classList.add('alarmIn')
                    alarm = 'Потеря связи с датчиком'
                    const data = createDate()
                    el.shift();
                    //  console.log(el)
                    alarmBase(el, data, alarm, name)
                }
                else {
                    //   console.log('уже есть аларм')
                }
            }
            else {
                if (el[3] < 6) {
                    if (!el[1].classList.contains('alarmIn')) {
                        el[1].classList.add('alarmIn')
                        alarm = 'Критически низкое давление'
                        const data = createDate()
                        el.shift();
                        //   console.log(el)
                        alarmBase(el, data, alarm, name)
                    }
                    else {
                        //  console.log('уже есть аларм')
                    }
                }
                if (el[3] > 9.9) {
                    if (!el[1].classList.contains('alarmIn')) {
                        el[1].classList.add('alarmIn')
                        alarm = 'Критически высокое давление'
                        const data = createDate()
                        el.shift();
                        //   console.log(el)
                        alarmBase(el, data, alarm, name)
                    }
                    else {
                        //  console.log('уже есть аларм')
                    }
                }
                if (el[5] > 36) {
                    if (!el[1].classList.contains('alarmIn')) {
                        el[1].classList.add('alarmIn')
                        alarm = 'Критически высокая температура'
                        const data = createDate()
                        el.shift();
                        //    console.log(el)
                        alarmBase(el, data, alarm, name)
                    }
                    else {
                        //   console.log('уже есть аларм')
                    }
                }
            }
        }
        else {
            //  console.log('не кран')
            if (el[5] == -51 || el[5] == -128) {
                // console.log('нет датчика')
                if (!el[1].classList.contains('alarmIn')) {
                    el[1].classList.add('alarmIn')
                    alarm = 'Потеря связи с датчиком'
                    const data = createDate()
                    el.shift();
                    //  console.log(el)
                    alarmBase(el, data, alarm, name)
                }
                else {
                    //  console.log('уже есть аларм')
                }
            }
            else {

                if (el[3] < 8) {
                    if (!el[1].classList.contains('alarmIn')) {
                        el[1].classList.add('alarmIn')
                        alarm = 'Критически низкое давление'
                        const data = createDate()
                        el.shift();
                        // console.log(el)
                        alarmBase(el, data, alarm, name)
                    }
                    else {
                        //  console.log('уже есть аларм')
                    }
                }
                if (el[3] > 10) {
                    console.log(el[1])

                    if (!el[1].classList.contains('alarmIn')) {
                        el[1].classList.add('alarmIn')
                        alarm = 'Критически высокое давление'
                        const data = createDate()
                        el.shift();
                        //  console.log(el)
                        alarmBase(el, data, alarm, name)

                        console.log('это')
                    }
                    else {
                        console.log('уже есть аларм')
                    }
                }
                if (el[5] > 36) {
                    if (!el[1].classList.contains('alarmIn')) {
                        el[1].classList.add('alarmIn')
                        alarm = 'Критически высокая температура'
                        const data = createDate()
                        el.shift();
                        //   console.log(el)
                        alarmBase(el, data, alarm, name)
                    }
                    else {
                        //сonsole.log('уже есть аларм')
                    }
                }


            }

        }
    })
}

async function alarmBase(tyres, data, alarm, name) {
    tyres.shift()
    const dannie = data.concat(tyres)
    dannie.unshift(name)
    dannie.push(alarm)
    //  console.log(dannie)

    const stor = await fetch('api/alarmStorage', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dannie, name })
    })
    const storList = await stor.json();
    // console.log(storList)

}


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
    const storValue = [];
    storList.forEach(e => {
        storValue.push(Object.values(e))
        //console.log(storValue)
    })

    //  console.log(storValue)
    viewAlarmStorage(activePost, storValue)

    // console.log(name)
    // setInterval(alarmFind, 6000)
}


function viewAlarmStorage(name, stor) {
    console.log('ап')
    /*
    const tr = document.querySelectorAll('tr')
    tr.forEach(it => {
        //    console.log('удаление цикл')
        it.remove();
    })*/

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
        if (el[el.length - 1] !== 'Потеря связи с датчиком' || el[el.length - 1] !== 'Потеря связи с датчиком') {
            const arrName = tbody.querySelectorAll(`.${name}`)

            arrName.forEach(e => {
                e.children[3].style.background = 'yellow';
            })

        }
        else {
            const arrName = tbody.querySelector(`.${name}`)
            arrName.forEach(e => {
                e.children[4].style.background = 'yellow';
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

