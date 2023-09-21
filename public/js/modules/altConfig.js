import { textTest } from './content.js'
import { loadParamsView } from './paramsTyresView.js'
import { objColor, generT, generFront } from './content.js'

export function conf(selectOld) {
    const checkAlt = document.getElementById('check_Title')
    const selectType = document.querySelector('.select_type')
    console.log(selectType.textContent)
    checkAlt.checked ? createConfig(selectOld) : clearConfig()

}
export function createConfig(selectOld) {
    const tiresActiv = document.querySelector('.tiresActiv')
    tiresActiv ? tiresActiv.classList.remove('tiresActiv') : null
    // document.querySelector('.wrapperFull').style.height = ''
    const checkAlt = document.querySelector('.checkAlt')
    checkAlt.style.color = 'red'
    checkAlt.style.fontWeight = 'bold'
    const selectType = document.querySelector('.select_type')

    for (let i = 0; i < selectType.options.length; i++) {
        if (selectType.options[i].textContent === selectOld) {
            console.log(selectType.options[i])
            selectType.options[i].selected = true;
            break;
        }
    }
    selectType.style.display = 'flex'
    selectType.style.appearance = '';
    // selectType.selectedIndex = 0;
    selectType.disabled = false;

    // Отображаем все скрытые элементы
    Array.from(selectType.children).forEach(el => {
        el.hidden = false;
        el.disabled = false;
    });
    const altConfig = document.querySelector('.altConfig')
    const alt = document.querySelector('.containerAlt')
    const disketa = document.querySelector('.disketa')
    disketa.style.display = 'flex'
    const korzina = document.querySelector('.korzina')
    korzina.style.display = 'flex'
    if (alt) {
        alt.style.marginTop = '0'
        nowModel(alt)
        return
    }
    const containerAlt = document.createElement('div')
    containerAlt.classList.add('containerAlt')
    altConfig.insertBefore(containerAlt, altConfig.children[1]);
    const wrapperTagach = document.createElement('div')
    wrapperTagach.classList.add('wrapperTagach')
    const wrapperPricep = document.createElement('div')
    wrapperPricep.classList.add('wrapperPricep')
    containerAlt.appendChild(wrapperTagach)
    containerAlt.appendChild(wrapperPricep)
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
    const wrapRight = document.querySelector('.wrapper_right')
    const sensors = document.querySelector('.sensors')
    const msg = document.querySelectorAll('.msg')
    msg.forEach(el => el.style.fontWeight = '300')
    document.querySelector('.acto') ? document.querySelector('.acto').classList.remove('acto') : null
    document.querySelector('.actBTN') ? document.querySelector('.actBTN').classList.remove('actBTN') : null
    sensors.style.display === 'flex' ? (sensors.style.display = 'none', wrapRight.style.zIndex = 0,
        document.querySelector('.popup-background').style.display = 'none') : null
    const selectType = document.querySelector('.select_type')
    selectType.style.display = 'none'
    const checkAlt = document.querySelector('.checkAlt')
    checkAlt.style.color = 'black'
    checkAlt.style.fontWeight = '400'
    const disketa = document.querySelector('.disketa')
    disketa.style.display = 'none'
    const korzina = document.querySelector('.korzina')
    korzina.style.display = 'none'
    const alt = document.querySelector('.containerAlt')
    if (alt) {
        alt.remove();
    }
    loadParamsView()
}
function listenerNum() {
    const arrayPlu = document.querySelectorAll('.pluT, .pluP');
    const arrayMi = document.querySelectorAll('.miT, .miP');
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
    elem.parentElement.parentElement.nextElementSibling.lastElementChild.remove()
    //  createOs(count, elem.parentElement.parentElement.nextElementSibling)
}
function up(elem) {
    const elemKolvo = elem.parentElement.previousElementSibling.children[1]
    let count = elem.parentElement.previousElementSibling.children[1].textContent
    count++
    elemKolvo.textContent = count
    createOsNow(elem.parentElement.parentElement.nextElementSibling)
}

function sparka() {
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

            } else {
                osSpark.querySelectorAll('.tiresTest.sp').forEach(el => el.remove());
                osSpark.children[1].children[1].style.width = '214px';

            }
            const nomerP = document.querySelector('.nomerP')
            if (nomerP) {
                nomerP.closest('.centerOsTest').children[0].children[0].checked ? nomerP.style.left = '15px' : nomerP.style.left = '63.5px'
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
    const globalWrapper = document.querySelector('.containerAlt')
    const tyres = globalWrapper.querySelectorAll('.tires_link_test')
    tyres.forEach(e => {
        e.addEventListener('click', () => {
            /*  const actBTN = document.querySelector('.actBTN')
              if (actBTN) {
                  actBTN.classList.remove('actBTN')
              }*/
            const tact = document.querySelector('.tiresActivt')
            tact ? obo.style.display = 'flex' : obo.style.display = 'none'

            tyres.forEach(e => {
                const msg = document.querySelectorAll('.msg')
                msg.forEach(el => {
                    el.style.color = 'rgba(6, 28, 71, 1)';
                    el.classList.remove('act')
                })
                e.classList.remove('tiresActivt')
            });
            e.classList.add('tiresActivt')
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
            msg.forEach(e => {
                e.style.color = 'rgba(6, 28, 71, 1)'
            })
            el.style.color = 'green'
            el.style.fontWeight = 'bold'
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
                    console.log(el)
                    if (el === ':') {
                        tiresActivt.children[1].setAttribute('rel', arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join(''))
                        prmsT.push(arrSpreed.splice(arrSpreed[0] + 1, arrSpreed.indexOf(el)).join(''))
                    }
                })
                if (value === '-128' || value === '-51' || value === '-50' || value.length > 10) {
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

function nowModel(alt) {
    const centerOsTest = document.querySelectorAll('.centerOsTest')
    const osiTagach = document.querySelectorAll('.tagachT').length
    const osiPricep = document.querySelectorAll('.pricepT').length
    const wrapperTagach = document.createElement('div')
    wrapperTagach.classList.add('wrapperTagach')
    const wrapperPricep = document.createElement('div')
    wrapperPricep.classList.add('wrapperPricep')
    alt.appendChild(wrapperTagach)
    alt.appendChild(wrapperPricep)
    const titleTagach = document.createElement('div')
    titleTagach.classList.add('titleTagach')
    wrapperTagach.appendChild(titleTagach)
    const containerTagach = document.querySelector('.containerTagach')
    containerTagach.style.marginTop = '20px'
    wrapperTagach.appendChild(containerTagach)
    const titlePricep = document.createElement('div')
    titlePricep.classList.add('titlePricep')
    wrapperPricep.appendChild(titlePricep)
    const containerPricep = document.querySelector('.containerPricep')
    containerPricep.style.marginTop = '20px'
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
    osiTagach ? kolvoT.textContent = osiTagach : kolvoT.textContent = 0
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
    osiPricep ? kolvoP.textContent = osiPricep : kolvoP.textContent = 0
    const choiceP = document.createElement('div')
    choiceP.classList.add('choiceP')
    titlePricep.appendChild(choiceP)
    const pluP = document.createElement('div')
    pluP.classList.add('pluP')
    choiceP.appendChild(pluP)
    const miP = document.createElement('div')
    miP.classList.add('miP')
    choiceP.appendChild(miP)
    const arrayPlu = document.querySelectorAll('.pluT, .pluP');
    const arrayMi = document.querySelectorAll('.miT, .miP');
    arrayMi.forEach(e => {
        e.addEventListener('click', () => {
            const elemKolvo = e.parentElement.previousElementSibling.children[1]
            let count = e.parentElement.previousElementSibling.children[1].textContent
            count > 0 ? count-- : count
            elemKolvo.textContent = count
            e.parentElement.parentElement.nextElementSibling.lastElementChild.remove()

            const osiClear = document.querySelectorAll('.centerOsTest')
            const osi = [];
            osiClear.forEach(e => {

                if (e.closest('.containerPricep'))
                    osi.push(e)
            })
            const nomerP = document.createElement('div')
            nomerP.classList.add('nomerP')
            nomerP.style.top = '65px'
            osi[osi.length - 1].previousElementSibling.children.length === 2 ? nomerP.style.left = '15px' : nomerP.style.left = '63.5px'
            osi[osi.length - 1].style.position = 'relative'
            nomerP.style.display = 'flex'
            osi[osi.length - 1].appendChild(nomerP)
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
        })
    })
    arrayPlu.forEach(e => {
        e.addEventListener('click', () => {
            const elemKolvo = e.parentElement.previousElementSibling.children[1]
            let count = e.parentElement.previousElementSibling.children[1].textContent
            count++
            elemKolvo.textContent = count
            console.log(e.parentElement.parentElement.nextElementSibling.children.length)
            createOsNow(e.parentElement.parentElement.nextElementSibling)
        })
    })
    let index = 0;
    centerOsTest.forEach(el => {
        index++
        if (el.closest('.containerPricep')) {
            const spark = document.createElement('div')
            spark.classList.add('spark')
            spark.innerHTML = `<input class="sparkCheck" type="checkbox" rel=${index}>Колёса спарены`
            el.prepend(spark)
            el.previousElementSibling.children.length === 2 ? el.children[0].children[0].checked = true : null
            el.children[1].style.background = '#000'
        } else {
            if (index !== 1 && el.closest('.containerTagach')) {
                const spark = document.createElement('div')
                spark.classList.add('spark')
                spark.innerHTML = `<input class="sparkCheck" type="checkbox" rel=${index}>Колёса спарены`
                el.prepend(spark)
                el.previousElementSibling.children.length === 2 ? el.children[0].children[0].checked = true : null
            }
        }
    })
    sparka()
}
let index = 0;
function createOsNow(parent) {
    parent.innerHTML += `${textTest}`
    index++
    const centerOsDivTest = document.createElement('div');
    centerOsDivTest.classList.add('centerOsTest')
    const vnutTest = document.createElement('div')
    vnutTest.classList.add('vnutTest')
    centerOsDivTest.appendChild(vnutTest)
    parent.lastElementChild.children[0].insertAdjacentElement('afterEnd', centerOsDivTest);
    if (parent.lastElementChild.parentElement?.classList.contains('containerPricep')) {
        const spark = document.createElement('div')
        spark.classList.add('spark')
        spark.innerHTML = `<input class="sparkCheck" type="checkbox" rel=${index}>Колёса спарены`
        centerOsDivTest.prepend(spark)
        centerOsDivTest.classList.add('pricepT');
        centerOsDivTest.children[1].style.background = '#000'
        parent.querySelectorAll('.osiTest').forEach(el => {
            el.children[0].children.length === 2 ? el.children[1].children[0].children[0].checked = true : null
        })
    } else {
        centerOsDivTest.classList.add('tagachT');
        console.log(index)
        if (index !== 1 && parent.lastElementChild.parentElement?.classList.contains('containerTagach')) {
            const spark = document.createElement('div')
            spark.classList.add('spark')
            spark.innerHTML = `<input class="sparkCheck" type="checkbox" rel=${index}>Колёса спарены`
            centerOsDivTest.prepend(spark)
            parent.querySelectorAll('.osiTest').forEach(el => {
                el.children[0].children.length === 2 ? el.children[1].children[0].children[0].checked = true : null
            })
        }
    }
    const center = document.querySelectorAll('.centerOsTest')
    gosNum(center);
    const tiresTest = parent.lastElementChild.querySelectorAll('.tiresTest')
    let indexTires = 0;
    tiresTest.forEach(el => {
        indexTires++
        const linkTest = document.createElement('a');
        linkTest.classList.add('tires_link_test')
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