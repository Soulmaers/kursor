
export class ViewModel {
    constructor(data) {
        [this.model, this.tyres, this.params, this.osi] = data
        this.config = document.querySelector('.config')


        this.init()
    }


    init() {
        this.model.length > 0 ? this.createViewModel() : null
    }


    controllViewType(type) {
        const selectType = this.config.querySelector('.select_type')
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
    }
    createViewModel() {
        const type = this.model.type
        this.controllViewType(type)
        console.log(this.model)
        if (this.model.length === 1 && this.osi === '-') return

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

        this.model.sort((a, b) => a.osi - b.osi)
        for (let i = 0; i < this.model.length; i++) {
            const item = this.model[i];
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
        //  gosNum(center)
        const nomerP = document.querySelector('.nomerP')
        if (nomerP) {
            nomerP.closest('.osiTest').children[0].children.length === 2 ? nomerP.style.left = '15px' : null
        }
        const gosNumber = document.querySelector('.gosNumber')
        const gosNumber1 = document.querySelector('.gosNumber1')
        const gosNumberCar = document.querySelector('.gosNumberCar')
        const gosNumberCar1 = document.querySelector('.gosNumberCar1')
        this.model[0].frontGosp ? gosNumberCar.value = this.model[0].frontGosp : null
        this.model[0].frontGosp1 ? gosNumberCar1.value = this.model[0].frontGosp1 : null
        this.model[0].gosp ? gosNumber.value = this.model[0].gosp : null
        this.model[0].gosp1 ? gosNumber1.value = this.model[0].gosp1 : null

        //  viewMenuParams()
        //  modalOs();
    }
}
