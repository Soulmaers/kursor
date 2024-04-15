


export class Helpers {

    static gosNum(center) {
        center.forEach(el => {
            if (el.classList.contains('pricepT')) {
                const containerPricep = el.closest('.containerPricep')
                const nomerP = document.querySelector('.nomerP')
                if (!nomerP) {
                    const nomerP = document.createElement('div')
                    nomerP.classList.add('nomerP')
                    nomerP.style.top = '65px'
                    nomerP.style.left = '63.5px'
                    containerPricep.lastElementChild.children[1].style.position = 'relative'
                    nomerP.style.display = 'flex'
                    containerPricep.lastElementChild.children[1].appendChild(nomerP)
                    const gosNumber = document.createElement('input')
                    gosNumber.classList.add('gosNumber')
                    gosNumber.setAttribute('placeholder', 'A000AA')
                    gosNumber.maxLength = 6;
                    nomerP.appendChild(gosNumber)
                    const flagss = document.createElement('div')
                    flagss.classList.add('flagss')
                    nomerP.appendChild(flagss)
                    const gosNumber1 = document.createElement('input')
                    gosNumber1.classList.add('gosNumber1')
                    gosNumber1.setAttribute('placeholder', '00')
                    gosNumber1.maxLength = 3;
                    flagss.appendChild(gosNumber1)
                    const flag = document.createElement('div')
                    flag.classList.add('flagy')
                    flagss.appendChild(flag)
                    const elemFlag1 = document.createElement('div')
                    elemFlag1.classList.add('flagWhite')
                    flag.appendChild(elemFlag1)
                    const elemFlag2 = document.createElement('div')
                    elemFlag2.classList.add('flagBlue')
                    flag.appendChild(elemFlag2)
                    const elemFlag3 = document.createElement('div')
                    elemFlag3.classList.add('flagRed')
                    flag.appendChild(elemFlag3)
                }
                if (nomerP) {
                    containerPricep.lastElementChild.children[1].style.position = 'relative'
                    containerPricep.lastElementChild.children[0].children.length === 1 ? nomerP.style.left = '63.5px' : null
                    containerPricep.lastElementChild.children[1].appendChild(nomerP)
                }

            }
            if (el.classList.contains('tagachT')) {
                const containerTagach = el.closest('.containerTagach')
                const nomerV = document.querySelector('.nomerV')
                if (!nomerV) {
                    const nomerV = document.createElement('div')
                    nomerV.classList.add('nomerV')
                    containerTagach.children[0].children[1].appendChild(nomerV)
                    nomerV.style.bottom = '70px'
                    nomerV.style.left = '63.5px'
                    containerTagach.children[0].children[1].style.position = 'relative'
                    nomerV.style.display = 'flex'
                    const gosNumberCar = document.createElement('input')
                    gosNumberCar.classList.add('gosNumberCar')
                    gosNumberCar.setAttribute('placeholder', 'A000AA')
                    gosNumberCar.maxLength = 6;
                    nomerV.appendChild(gosNumberCar)
                    const flagss = document.createElement('div')
                    flagss.classList.add('flagss')
                    nomerV.appendChild(flagss)
                    const gosNumberCar1 = document.createElement('input')
                    gosNumberCar1.classList.add('gosNumberCar1')
                    gosNumberCar1.setAttribute('placeholder', '00')
                    gosNumberCar1.maxLength = 3;
                    flagss.appendChild(gosNumberCar1)
                    const flag = document.createElement('div')
                    flag.classList.add('flagy')
                    flagss.appendChild(flag)
                    const elemFlag1 = document.createElement('div')
                    elemFlag1.classList.add('flagWhite')
                    flag.appendChild(elemFlag1)
                    const elemFlag2 = document.createElement('div')
                    elemFlag2.classList.add('flagBlue')
                    flag.appendChild(elemFlag2)
                    const elemFlag3 = document.createElement('div')
                    elemFlag3.classList.add('flagRed')
                    flag.appendChild(elemFlag3)
                }
            }
        })
    }
}
