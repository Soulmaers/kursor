import { textTest } from './content.js'
import { loadParamsView } from './paramsTyresView.js'
import { tech } from './tech.js'
import { objColor, generT, generFront } from './content.js'

export function conf() {
    console.log('чекед')
    const checkAlt = document.getElementById('check_Title')
    checkAlt.checked ? createConfig() : clearConfig()

}



export function createConfig() {
    const altConfig = document.querySelector('.altConfig')
    const altOne = document.querySelector('.containerAltOne')
    if (altOne) {
        altOne.remove();
    }
    const alt = document.querySelector('.containerAlt')
    if (alt) {
        alt.style.zoom = '0.65'
        alt.style.MozTransformOrigin = "top"
        alt.style.MozTransform = "scale(0.65)"
        alt.style.maxHeight = "550px"
        alt.style.width = '50%'
        alt.style.marginLeft = '0'
        altConfig.appendChild(alt);
        alt.style.marginTop = '30px';
    }
    const disketa = document.querySelector('.disketa')
    disketa.style.display = 'flex'
    const korzina = document.querySelector('.korzina')
    korzina.style.display = 'flex'
    console.log('1')

    const containerAltOne = document.createElement('div')
    containerAltOne.classList.add('containerAltOne')
    // altConfig.appendChild(containerAltOne)
    altConfig.insertBefore(containerAltOne, altConfig.children[1]);
    const wrapperTagach = document.createElement('div')
    wrapperTagach.classList.add('wrapperTagach')
    const wrapperPricep = document.createElement('div')
    wrapperPricep.classList.add('wrapperPricep')
    containerAltOne.appendChild(wrapperTagach)
    containerAltOne.appendChild(wrapperPricep)
    const titleTagach = document.createElement('div')
    titleTagach.classList.add('titleTagach')
    wrapperTagach.appendChild(titleTagach)
    const containerTagach = document.createElement('div')
    containerTagach.classList.add('containerTagach')
    wrapperTagach.appendChild(containerTagach)
    const titlePricep = document.createElement('div')
    titlePricep.classList.add('titlePricep')
    wrapperPricep.appendChild(titlePricep)
    const containerPricep = document.createElement('div')
    containerPricep.classList.add('containerPricep')
    wrapperPricep.appendChild(containerPricep)
    const titleT = document.createElement('div')
    titleT.classList.add('titleT')
    titleTagach.appendChild(titleT)
    titleT.textContent = 'Тягач'
    const titleP = document.createElement('div')
    titleP.classList.add('titleP')
    titlePricep.appendChild(titleP)
    titleP.textContent = 'Прицеп'
    const numT = document.createElement('div')
    numT.classList.add('numT')
    titleTagach.appendChild(numT)
    const quantityT = document.createElement('div')
    quantityT.classList.add('quantityT')
    numT.appendChild(quantityT)
    quantityT.textContent = 'Кол-во осей:'
    const kolvoT = document.createElement('div')
    kolvoT.classList.add('kolvoT')
    numT.appendChild(kolvoT)
    kolvoT.textContent = 0
    const choiceT = document.createElement('div')
    choiceT.classList.add('choiceT')
    titleTagach.appendChild(choiceT)
    const pluT = document.createElement('div')
    pluT.classList.add('pluT')
    choiceT.appendChild(pluT)
    const miT = document.createElement('div')
    miT.classList.add('miT')
    choiceT.appendChild(miT)

    const numP = document.createElement('div')
    numP.classList.add('numP')
    titlePricep.appendChild(numP)
    const quantityP = document.createElement('div')
    quantityP.classList.add('quantityP')
    numP.appendChild(quantityP)
    quantityP.textContent = 'Кол-во осей:'
    const kolvoP = document.createElement('div')
    kolvoP.classList.add('kolvoP')
    numP.appendChild(kolvoP)
    kolvoP.textContent = 0

    const choiceP = document.createElement('div')
    choiceP.classList.add('choiceP')
    titlePricep.appendChild(choiceP)
    const pluP = document.createElement('div')
    pluP.classList.add('pluP')
    choiceP.appendChild(pluP)
    const miP = document.createElement('div')
    miP.classList.add('miP')
    choiceP.appendChild(miP)

    listenerNum()


}



function clearConfig() {

    const disketa = document.querySelector('.disketa')
    disketa.style.display = 'none'
    const korzina = document.querySelector('.korzina')
    korzina.style.display = 'none'
    const alt = document.querySelector('.containerAlt')
    if (alt) {
        alt.remove();
    }
    loadParamsView()
    const containerAltOne = document.querySelector('.containerAltOne')
    containerAltOne.style.display = 'none'

}


function listenerNum() {
    const arrayPlu = document.querySelectorAll('.pluT, .pluP');
    const arrayMi = document.querySelectorAll('.miT, .miP');

    console.log(arrayPlu)
    arrayMi.forEach(e => {
        e.addEventListener('click', () => {
            down(e)
        })
    })
    arrayPlu.forEach(e => {
        e.addEventListener('click', () => {
            up(e)
        })
    })
}

function down(elem) {
    const elemKolvo = elem.parentElement.previousElementSibling.children[1]
    let count = elem.parentElement.previousElementSibling.children[1].textContent
    count > 0 ? count-- : count
    elemKolvo.textContent = count
    createOs(count, elem.parentElement.parentElement.nextElementSibling)
}
function up(elem) {
    const elemKolvo = elem.parentElement.previousElementSibling.children[1]
    let count = elem.parentElement.previousElementSibling.children[1].textContent
    count++
    elemKolvo.textContent = count
    createOs(count, elem.parentElement.parentElement.nextElementSibling)
}
function createOs(count, parent) {
    if (parent.children.length !== 0) {
        Array.from(parent.children).forEach(el => {
            el.remove()
        })
    }
    for (let i = 0; i < count; i++) {
        parent.innerHTML += `${textTest}`
    }
    let index = 0;
    console.log(parent)
    Array.from(parent.children).forEach(el => {
        index++
        const centerOsDivTest = document.createElement('div');
        centerOsDivTest.classList.add('centerOsTest')
        const vnutTest = document.createElement('div')
        vnutTest.classList.add('vnutTest')
        centerOsDivTest.appendChild(vnutTest)
        el.children[0].insertAdjacentElement('afterEnd', centerOsDivTest);
        if (el.parentElement?.classList.contains('containerPricep')) {
            const spark = document.createElement('div')
            spark.classList.add('spark')
            spark.innerHTML = `<input class="sparkCheck" type="checkbox" rel=${index}>Колёса спарены`
            centerOsDivTest.prepend(spark)
            centerOsDivTest.classList.add('pricepT');
            console.log(centerOsDivTest)
            centerOsDivTest.children[1].style.background = '#000'
        } else {
            centerOsDivTest.classList.add('tagachT');
            if (index !== 1 && el.parentElement?.classList.contains('containerTagach')) {
                const spark = document.createElement('div')
                spark.classList.add('spark')
                spark.innerHTML = `<input class="sparkCheck" type="checkbox" rel=${index}>Колёса спарены`
                centerOsDivTest.prepend(spark)
            }
        }
    })
    const center = document.querySelectorAll('.centerOsTest')
    gosNum(center);

    const tiresTest = parent.querySelectorAll('.tiresTest')
    let indexTires = 0;
    tiresTest.forEach(el => {
        console.log(el)
        indexTires++
        const linkTest = document.createElement('a');
        linkTest.classList.add('tires_link_test')
        //  linkTest.setAttribute("id", `${indexTires}`);
        el.appendChild(linkTest);
        const tiresDTest = document.createElement('div');
        tiresDTest.classList.add('tiresDTest')
        const tiresTTest = document.createElement('div');
        tiresTTest.classList.add('tiresTTest')
        linkTest.appendChild(tiresDTest);
        linkTest.appendChild(tiresTTest);
    })
    sparka()



}

function sparka() {
    console.log('чек?')
    const sparkCheck = document.querySelectorAll('.sparkCheck')
    sparkCheck.forEach(el => {
        el.addEventListener('change', () => {
            const osSpark = el.closest('.osiTest');
            if (el.checked) {
                const spElements = osSpark.querySelectorAll('.tiresTest.sp');
                if (spElements.length === 0) {
                    const tiresTest = document.createElement('div');
                    tiresTest.classList.add('tiresTest', 'sp');
                    osSpark.children[0].appendChild(tiresTest);
                    const linkTest = document.createElement('div');
                    linkTest.classList.add('tires_link_test');
                    tiresTest.appendChild(linkTest);
                    const tiresDTest = document.createElement('div');
                    tiresDTest.classList.add('tiresDTest');
                    const tiresTTest = document.createElement('div');
                    tiresTTest.classList.add('tiresTTest');
                    linkTest.appendChild(tiresDTest);
                    linkTest.appendChild(tiresTTest);
                    const tiresTest1 = document.createElement('div');
                    tiresTest1.classList.add('tiresTest', 'sp');
                    osSpark.children[2].prepend(tiresTest1);
                    const linkTest1 = document.createElement('div');
                    linkTest1.classList.add('tires_link_test');
                    tiresTest1.appendChild(linkTest1);
                    const tiresDTest1 = document.createElement('div');
                    tiresDTest1.classList.add('tiresDTest');
                    const tiresTTest1 = document.createElement('div');
                    tiresTTest1.classList.add('tiresTTest');
                    linkTest1.appendChild(tiresDTest1);
                    linkTest1.appendChild(tiresTTest1);
                }
                osSpark.children[1].children[1].style.width = '112px';
                const nomerP = document.querySelector('.nomerP')
                nomerP.style.left = '15px'
            } else {
                osSpark.querySelectorAll('.tiresTest.sp').forEach(el => el.remove());
                osSpark.children[1].children[1].style.width = '214px';

            }
            forTyres()
        });
    });
    forTyres()
}
function forTyres() {
    const btnsens = document.querySelectorAll('.btnsens')
    const sensors = document.querySelector('.sensors')
    const obo = document.querySelector('.obo')
    const tiresLinkTest = document.querySelectorAll('.tires_link_test')
    const globalWrapper = document.querySelector('.containerAltOne')
    const tyres = globalWrapper.querySelectorAll('.tires_link_test')
    console.log(tyres)
    tyres.forEach(e => {
        e.addEventListener('click', () => {
            /* if (e.classList.contains('tiresActivt')) {
                 e.classList.remove('tiresActivt')
                 return
             }*/
            const actBTN = document.querySelector('.actBTN')
            console.log(actBTN)
            if (actBTN) {
                actBTN.classList.remove('actBTN')
            }

            obo.style.display = 'none'
            sensors.style.display = 'none'
            tyres.forEach(e => {
                const msg = document.querySelectorAll('.msg')
                msg.forEach(el => {
                    el.style.color = 'black';
                    el.classList.remove('act')
                })
                e.classList.remove('tiresActivt')
            });

            e.classList.add('tiresActivt')
            console.log(e)

            sensors.style.display = 'flex';
            btnsens[0].style.display = 'flex'
            btnsens[1].style.display = 'flex'
        })
    })
    allparamsTyres(btnsens)
}

function allparamsTyres(btnsens) {
    const active = document.querySelectorAll('.color')
    const msg = document.querySelectorAll('.msg')
    let prmsD = [];
    let prmsT = [];
    msg.forEach(el => {
        el.addEventListener('click', () => {
            const tiresActivt = document.querySelector('.tiresActivt')
            console.log(tiresActivt)
            msg.forEach(e => {
                e.style.color = 'black'
            })
            el.style.color = 'green'
            const arrSpreed = [...el.textContent]
            let value;
            arrSpreed.forEach(el => {
                if (el === ':') {
                    value = arrSpreed.splice(arrSpreed.indexOf(el) + 1, arrSpreed.length - 1).join('')
                }
            })
            if (btnsens[0].classList.contains('actBTN')) {
                arrSpreed.forEach(el => {
                    if (el === ':') {
                        tiresActivt.children[0].setAttribute('rel', arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join(''))
                        prmsD.push(arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join(''))
                    }
                })
                if (active[0].textContent == 'А 652 УА 198') {
                    value = (value / 10).toFixed(1)
                }
                else {
                    value
                }
                const valJob = value
                valJob.length > 10 ?
                    tiresActivt.children[0].textContent = '-' :
                    tiresActivt.children[0].textContent = valJob + '\nБар'
                tiresActivt.children[0].style.color = objColor[generFront(valJob)];
            }
            if (btnsens[1].classList.contains('actBTN')) {
                arrSpreed.forEach(el => {
                    if (el === ':') {
                        tiresActivt.children[1].setAttribute('rel', arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join(''))
                        prmsT.push(arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join(''))
                    }
                })
                if (value === '-128' || value === '-51' || value.length > 10) {
                    value = 'err'
                    tiresActivt.children[1].textContent = value
                }
                else {
                    tiresActivt.children[1].textContent = value + '°'
                    tiresActivt.children[1].style.color = objColor[generT(value)];
                }
            }
        })
    })
}

export function gosNum(center) {
    console.log(center)
    center.forEach(el => {
        if (el.classList.contains('pricepT')) {
            const containerPricep = el.closest('.containerPricep')
            const nomerP = document.querySelector('.nomerP')
            if (!nomerP) {
                const nomerP = document.createElement('div')
                nomerP.classList.add('nomerP')
                containerPricep.lastElementChild.children[1].appendChild(nomerP)
                nomerP.style.top = '65px'
                nomerP.style.left = '63.5px'
                containerPricep.lastElementChild.children[1].style.position = 'relative'
                nomerP.style.display = 'flex'
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
        }
        if (el.classList.contains('tagachT')) {
            const containerTagach = el.closest('.containerTagach')
            const nomerV = document.querySelector('.nomerV')
            if (!nomerV) {
                const nomerV = document.createElement('div')
                nomerV.classList.add('nomerV')
                console.log(containerTagach.children[0])
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