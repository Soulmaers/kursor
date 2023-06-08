
import { view, viewConfigurator } from './visual.js'
import { tech } from './tech.js'
import { gosNum } from './altConfig.js'
import { modalOs } from './modalOs.js'


export async function loadParamsView() {
    clearInterval(viewPokasateli)
    const titleCar = document.querySelector('.title_two')
    const btnShina = document.querySelectorAll('.modals')
    const listItem = document.querySelectorAll('.link_menu')[0]
    const container = document.querySelector('.container')
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
        body: (JSON.stringify({ idw }))
    }
    const mod = await fetch('api/modelView', params)
    const model = await mod.json()
    if (model.values && model.values.length > 0) {
        createViewModel(model.values);
    }
    viewPokasateli()
    setInterval(viewPokasateli, 60000)
}
function createViewModel(model) {
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
            tiresTest.classList.add('tiresTest');
            osiTest[i].children[0].appendChild(tiresTest);
            const tiresTest1 = document.createElement('div');
            tiresTest1.classList.add('tiresTest');
            osiTest[i].children[2].prepend(tiresTest1);
            osiTest[i].children[1].children[0].style.width = '112px'

        }
    }
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
    viewMenuParams()
    modalOs();
}

export function viewMenuParams() {
    const kolesos = [];
    const speedGraf = document.querySelector('.speedGraf')
    const titleSens = document.querySelector('.title_sens')
    const sensors = document.querySelector('.sensors')
    const wrapperMap = document.querySelector('.wrapper_left')
    const obo = document.querySelector('.obo')
    const tiresLink = document.querySelectorAll('.tires_link_test')
    const techInfo = document.querySelector('.techInfo')
    const grafics = document.querySelector('.grafics')
    const plug = document.querySelectorAll('.plug')
    const tableTarir = document.querySelector('.tableTarir')
    const idbaseTyres = document.querySelector('.idbaseTyres')
    idbaseTyres.textContent = ''
    tiresLink.forEach(e => {
        e.addEventListener('click', () => {
            if (e.classList.contains('tiresActiv')) {
                e.classList.remove('tiresActiv')
                techInfo.style.display = 'none'
                tableTarir.style.display = 'none'
                wrapperMap.style.display = 'block'
                if (plug[1].classList.contains('activGraf')) {
                    grafics.style.display = 'flex';
                    wrapperMap.style.display = 'none'
                }
                return
            }
            kolesos.push(e)
            speedGraf.style.display = 'none';
            tiresLink.forEach(e => {
                obo.style.display = 'none'
                titleSens.style.display = 'none'
                sensors.style.display = 'none'
                tableTarir.style.display = 'none'
                const msg = document.querySelectorAll('.msg')
                msg.forEach(el => el.classList.remove('act'))
                e.classList.remove('tiresActiv')
            });
            // sensors.style.display = 'flex';
            e.classList.add('tiresActiv')
            //  btnsens[0].style.display = 'flex'
            //  btnsens[1].style.display = 'flex'
            techInfo.style.display = 'block'
            speedGraf.style.display = 'block';
            wrapperMap.style.display = 'none'
            grafics.style.display = 'none';
            tableTarir.style.display = 'none'
            const idbaseTyres = document.querySelector('.idbaseTyres')
            idbaseTyres.textContent = ''
            tech()//отображаем тех.характеристики+логика формул+забираем нужные данные в базу.
        })
    })
}


export async function viewPokasateli() {
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
        body: (JSON.stringify({ activePost, idw }))
    }
    const paramsss = await fetch('api/tyresView', param)
    const params = await paramsss.json()
    const datas = await fetch('api/wialon', param)
    const data = await datas.json()
    const os = await fetch('api/barView', param)
    const osi = await os.json()
    data.values.sort((prev, next) => {
        if (prev.name < next.name) return -1;
        if (prev.name < next.name) return 1;
    })
    view(data.values)
    viewConfigurator(data.values, params.values, osi.values)
}




