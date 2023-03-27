import { tr } from './content.js'
import { convert } from './visual.js'

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
    //  console.log(stor)
    /*
        const globalMass = [];
        stor.forEach(e => {
            globalMass.push(...e)
        })
        console.log(globalMass)
    
        globalMass.sort(function (a, b) {
            //  console.log('фн')
            return parseFloat(b.data) - parseFloat(a.data);
        });
        console.log(globalMass)
    */
    stor.forEach(el => {
        let count = 0;
        el.forEach(it => {
            count++
            const tr = document.createElement('div')
            tr.classList.add('tr')
            tr.classList.add('trnone')
            tr.classList.add(`${name}`)
            tbody.appendChild(tr)
            // const wrapSort = document.createElement('div')
            //  wrapSort.classList.add('wrapSort')
            //  tr.appendChild(wrapSort)
            const toSearch = "Норма";
            if (count == 1) {
                tr.classList.add('views')
                //  return
            }
            if (it.alarm == toSearch) {
                tr.classList.add('norma')
                //   return

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
                    // return

                }
                if (t[i].nextSibling !== null) {
                    if (t[i].classList.contains('views') && !t[i].nextSibling.classList.contains('views') && !t[i].nextSibling.classList.contains('norma')) {
                        t[i].classList.add('best')
                        // return

                    }
                }
            }
        })
    })
    const t = document.querySelectorAll('.tr')
    // console.log(t)

    t.forEach(el => {
        if (el.nextSibling !== null && !el.classList.contains('norma') && el.children[1].textContent !== el.nextSibling.children[1].textContent
            && !el.classList.contains('oneName') || !el.classList.contains('norma')
            && !el.nextSibling) {
            if (el.previousSibling.children[1].textContent !== el.children[1].textContent || el.previousSibling.classList.contains('norma')) {
                el.classList.add('alarmOpen')
                //el.style.border = '1px solid black'
                const alarmFire = document.createElement('div')
                alarmFire.classList.add('alarmFire')
                el.appendChild(alarmFire)
                alarmFire.innerHTML = '&#128293'
                el.style.position = 'relative'
                alarmFire.style.position = 'absolute'
                alarmFire.style.right = '4px';
                alarmFire.style.top = 0;
                alarmFire.style.fontSize = '10px';



                //  return
            }

            const prevElem = prevAll(el)
            let count = 0;
            // console.log(prevElem)
            const y = prevElem.reverse();
            y.forEach(e => {
                // console.log(prevElem[0])
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
                        //  console.log(e)
                    }
                }
            })
            function prevAll(el) {
                const prevElements = []
                let prevElement = el.parentNode.firstElementChild
                //   console.log(el)
                while (prevElement !== el) {
                    prevElements.push(prevElement)
                    prevElement = prevElement.nextElementSibling
                }

                return prevElements
            }

        }
    })
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
        //  console.log(next)
        next.forEach(it => {
            if (it.classList.contains('norma') !== false) {
                countts++
                //  console.log(it)
                // return
            }
            if (it.classList.contains('norma') == false
                && it.children[1].textContent == el.children[1].textContent && countts < 1) {
                it.classList.add('spoyler');

                wrapSpoyler.appendChild(it)
                // console.log('спойлер')
                // console.log(it)
                //return



            }

            //  
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
            //    console.log(redHidden)
            redHidden.forEach(el => {
                Array.from(el.children).forEach(it => {
                    it.style.fontSize = '11px'
                    it.style.fontWeight = 'normal'
                    it.style.color = '#000'
                })
            })
        })
    })




    const arrName = tbody.querySelectorAll(`.${name}`)
    arrName.forEach(e => {
        e.children[2].style.background = 'yellow';
        if (e.children[3].textContent == '-51' || e.children[3].textContent == '-50') {
            e.children[3].style.background = 'yellow';
        }
    })
    const vieList = document.querySelectorAll('.views')
    const arr = [];
    vieList.forEach(el => {
        arr.push(el)
    })

    arr.sort(function (a, b) {
        return parseFloat(b.children[0].textContent) - parseFloat(a.children[0].textContent)
    });

    arr.forEach(it => {
        tbody.appendChild(it)
    })


}


function nextAll(elem) {
    var next = false;
    //  console.log(elem.parentNode.children)
    return [].filter.call(elem.parentNode.children, function (child) {
        if (child === elem) next = true;
        return next && child !== elem
    })
};

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

