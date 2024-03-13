
import { view, viewConfigurator } from './visual.js'
import { tech } from './tech.js'
import { gosNum } from './altConfig.js'
import { modalOs } from './modalOs.js'
import { Tooltip } from '../class/Tooltip.js'
import { DraggableContainer } from '../class/Dragdown.js'

let intervalId
let isProcessing = false;
export async function loadParamsView(signal) {
    if (isProcessing) {
        return;
    }
    isProcessing = true;
    clearInterval(intervalId)
    const titleCar = document.querySelector('.title_two')
    let activePost;
    const active = document.querySelectorAll('.color')
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.listItem')[0]
        activePost = listItem.textContent.replace(/\s+/g, '')
        titleCar.textContent = listItem.textContent
    }
    else {
        activePost = active[0].textContent.replace(/\s+/g, '')
    }
    const idw = document.querySelector('.color').id
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        signal: signal,
        body: (JSON.stringify({ idw }))
    }
    const mod = await fetch('/api/modelView', params)
    const model = await mod.json()
    console.log(model)
    if (model.result && model.result.length > 0) {
        createViewModel(model.result);
    }
    const inf = document.querySelector('.infosCenter')
    new Tooltip(inf, ['Если зажигание включено и данные  приходят, то значения подсвечены в зависимости от условий подсветки',
        'Если зажигание включено, а данные не приходят, то колесо будет с серый фоном',
        'Если зажигание выключено, то колесо будет черным, а последние зафиксированные показатели серым цветом',
        'При наведении на колесо появится подсказка с параметром колеса и актуальностью данных'])
    viewPokasateli(signal)

    intervalId = setInterval(viewPokasateli, 60000)
    isProcessing = false;
}

export let tsiparam;
function createViewModel(model) {
    const tsiControll = document.querySelector('.tsiControll')
    tsiControll.value = model[0].tsiControll
    tsiparam = Number(model[0].tsiControll)
    const type = model[0].type
    console.log(type)

    const selectType = document.querySelector('.select_type')
    selectType.style.display = type !== '' ? 'flex' : 'none'
    Array.from(selectType.children).forEach(el => {
        if (type !== el.textContent) {
            el.hidden = true;
        } else {
            selectType.value = el.value;
            selectType.disabled = true;
            el.disabled = true;
            el.selected = true;
            selectType.style.appearance = 'none';
        }
    });

    if (selectType.value === '') {
        selectType.selectedIndex = 0;
    }

    if (model.length === 1 && model[0].osi === '-') {
        return
    }
    if (model.length > 0) {
        const containerAll = document.querySelector('.containerAll')
        if (containerAll) {
            containerAll.remove()
        }
        const altConfig = document.querySelector('.altConfig')
        const containerAlt = document.createElement('div')
        containerAlt.classList.add('containerAlt')
        altConfig.appendChild(containerAlt)
        const containerTagach = document.createElement('div')
        containerTagach.classList.add('containerTagach')
        const containerPricep = document.createElement('div')
        containerPricep.classList.add('containerPricep')
        containerAlt.appendChild(containerTagach)
        containerAlt.appendChild(containerPricep)
        containerTagach.style.border = '2px solid darkblue'
        containerTagach.style.padding = '2px'
        containerPricep.style.padding = '2px'
        containerPricep.style.marginTop = '50px'

        model.sort((a, b) => a.osi - b.osi)
        for (let i = 0; i < model.length; i++) {
            const item = model[i];
            const container = item.trailer === 'Тягач' ? containerTagach : containerPricep;
            item.trailer === 'Прицеп' ? containerPricep.style.border = '2px solid darkblue' : containerPricep.style.border = 'none'
            container.innerHTML += `<div class=" osiTest">
        <div class="tires_spark_test">
            <div class="tiresTest mod">
            </div>
                  </div>
                  <div class="centerOsTest" id=${item.osi}>
<div class="vnutTest"></div>
                  </div>
            <div class="tires_spark_test">
                      <div class="tiresTest mod">
            </div>
        </div>
    </div>`;
            const centerOs = document.querySelectorAll('.centerOsTest')
            centerOs[i].closest('.containerTagach') ? centerOs[i].classList.add('tagachT') : centerOs[i].classList.add('pricepT')
            if (item.tyres === '4') {
                const osiTest = document.querySelectorAll('.osiTest')
                const tiresTest = document.createElement('div');
                tiresTest.classList.add('tiresTest', 'sp');
                osiTest[i].children[0].appendChild(tiresTest);
                const tiresTest1 = document.createElement('div');
                tiresTest1.classList.add('tiresTest', 'sp');
                osiTest[i].children[2].prepend(tiresTest1);
                osiTest[i].children[1].children[0].style.width = '112px'
            }
        }
        const centerOs = document.querySelectorAll('.centerOsTest')
        centerOs.forEach(e => {
            if (e.classList.contains('pricepT')) {
                e.children[0].style.background = '#000'
            }
        })
        const tiresTest = document.querySelectorAll('.tiresTest')
        let indexTires = 0;
        tiresTest.forEach(el => {
            indexTires++
            const linkTest = document.createElement('a');
            linkTest.classList.add('tires_link_test')
            linkTest.setAttribute("id", `${indexTires}`);
            el.appendChild(linkTest);
            const tiresDTest = document.createElement('div');
            tiresDTest.classList.add('tiresDTest')
            const tiresTTest = document.createElement('div');
            tiresTTest.classList.add('tiresTTest')
            linkTest.appendChild(tiresDTest);
            linkTest.appendChild(tiresTTest);
        })
        const center = document.querySelectorAll('.centerOsTest')
        gosNum(center)
        const nomerP = document.querySelector('.nomerP')
        if (nomerP) {
            nomerP.closest('.osiTest').children[0].children.length === 2 ? nomerP.style.left = '15px' : null
        }
        const gosNumber = document.querySelector('.gosNumber')
        const gosNumber1 = document.querySelector('.gosNumber1')
        const gosNumberCar = document.querySelector('.gosNumberCar')
        const gosNumberCar1 = document.querySelector('.gosNumberCar1')
        model[0].frontGosp ? gosNumberCar.value = model[0].frontGosp : null
        model[0].frontGosp1 ? gosNumberCar1.value = model[0].frontGosp1 : null
        model[0].gosp ? gosNumber.value = model[0].gosp : null
        model[0].gosp1 ? gosNumber1.value = model[0].gosp1 : null
    }
    viewMenuParams()
    modalOs();
}

export function viewMenuParams() {
    const kolesos = [];
    const sensors = document.querySelector('.sensors')
    const wrapperMap = document.querySelector('.wrapper_left')
    const tiresLink = document.querySelectorAll('.tires_link_test')
    const techInfo = document.querySelector('.techInfo')
    const grafics = document.querySelector('.grafics')
    const plug = document.querySelectorAll('.plug')
    const tableTarir = document.querySelector('.tableTarir')
    const idbaseTyres = document.querySelector('.idbaseTyres')
    const wright = document.querySelector('.wrapper_right')
    var widthWind = document.querySelector('body').offsetWidth;
    idbaseTyres.textContent = ''
    tiresLink.forEach(e => {
        e.addEventListener('click', () => {
            const acto = document.querySelector('.acto')
            acto ? acto.classList.remove('acto') : null
            if (e.classList.contains('tiresActiv')) {
                e.classList.remove('tiresActiv')
                techInfo.style.display = 'none'
                tableTarir.style.display = 'none'
                sensors.style.display = 'none'
                wrapperMap.style.display = widthWind >= 860 ? 'block' : 'none'
                if (plug[1].classList.contains('activGraf')) {
                    grafics.style.display = 'flex';
                    wrapperMap.style.display = 'none'
                }
                return
            }
            kolesos.push(e)
            tiresLink.forEach(e => {
                tableTarir.style.display = 'none'
                e.classList.remove('tiresActiv')
            });
            e.classList.add('tiresActiv')
            const checkAlt = document.getElementById('check_Title')
            checkAlt.checked ? (sensors.style.display = 'flex', new DraggableContainer(sensors),
                wright.style.zIndex = 2,
                document.querySelector('.popup-background').style.display = 'block') : null
            techInfo.style.display = 'block'
            wrapperMap.style.display = 'none'
            grafics.style.display = 'none';
            tableTarir.style.display = 'none'
            const idbaseTyres = document.querySelector('.idbaseTyres')
            idbaseTyres.textContent = ''
            tech()//отображаем тех.характеристики+логика формул+забираем нужные данные в базу.
        })
    })
}


export async function viewPokasateli(signal) {
    const color = document.querySelector('.color')
    console.log(color)
    if (!color) {
        return
    }
    else {
        console.log('апдейт?')
        const btnShina = document.querySelectorAll('.modals')
        if (btnShina[1].classList.contains('active') === true) {
            return
        }
        let activePost;
        const active = document.querySelectorAll('.color')
        activePost = active[0].children[0].textContent.replace(/\s+/g, '')
        const idw = document.querySelector('.color').id
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            signal: signal,
            body: (JSON.stringify({ activePost, idw }))
        }
        const paramsss = await fetch('/api/tyresView', param)
        const params = await paramsss.json()
        console.log(idw)
        const datas = await fetch('/api/getSens', param)
        const data = await datas.json()
        console.log(data)

        const os = await fetch('/api/barView', param)
        const osi = await os.json()
        data.sort((prev, next) => {
            if (prev.name < next.name) return -1;
            if (prev.name < next.name) return 1;
        })
        view(data)
        viewConfigurator(data, params.result, osi)

    }
}




