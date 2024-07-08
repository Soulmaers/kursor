import { ContentGeneration } from '../html/content.js'
import { viewDinamic } from '../func/protector.js'
import { Helpers } from './Helpers.js'

export class AddChartsToModel {
    constructor(tyres, container, container_axis_text) {
        this.tyres = tyres
        this.container = container
        this.axisContainer = container_axis_text
        this.left = this.container.querySelector('.left_grafs')
        this.right = this.container.querySelector('.right_grafs')
        this.elementsTyres = container.querySelectorAll('.tyres_shema_car')
        this.init()
    }


    init() {
        this.filterWheel()
        this.addAxisElements()
        this.createContainers()
    }

    filterWheel() {
        this.wheel = [...this.elementsTyres].filter(e => e.getAttribute('rel'))
        const arrayIdSet = new Set(this.wheel.map(e => e.getAttribute('rel')));
        this.data = this.tyres.filter(tyre => arrayIdSet.has(tyre.idw_tyres));
    }

    addAxisElements() {
        const axis = this.axisContainer.querySelectorAll('.osi_shema_car')
        axis.forEach(e => {
            const os = e.querySelector('.centerOs_shema_car')
            const wheels = e.querySelectorAll('.tyres_shema_car')
            let left = [...wheels].filter(e => e.getAttribute('side') === 'left').map(it => `ID:${it.getAttribute('rel')} Протектор:${it.getAttribute('minn')} мм`)
            let right = [...wheels].filter(e => e.getAttribute('side') === 'right').map(it => `ID:${it.getAttribute('rel')} Протектор:${it.getAttribute('minn')} мм`)
            const div = document.createElement('div')
            div.classList.add('row_axis')
            const dicrpiption_wheel = `${left} --- Номер оси:${os.id} Тип оси:${os.getAttribute('rel')} --- ${right}`
            div.textContent = dicrpiption_wheel
            this.axisContainer.appendChild(div)
        })
        console.log(axis)
    }
    createContainers() {
        this.data.sort((a, b) => Number(a.identifikator) - Number(b.identifikator))
        this.wheel.forEach((el, index) => {
            const protektorMax = this.data[index].protektor_passport
            const persent = Number(this.data[index].ostatok)
            const pro = Helpers.protek(this.data[index]);
            const parent = el.parentElement
            const progressBar = ContentGeneration.addContainerCharts(this.data[index].idw_tyres)
            const container = progressBar.querySelectorAll('.contBar22')
            const discription = progressBar.querySelector('.discription_shina_wrap')
            if (el.getAttribute('side') === 'left') {
                parent.previousElementSibling.appendChild(progressBar)
                discription.style.left = '-110%'
            }
            else {
                parent.nextElementSibling.appendChild(progressBar)
                discription.style.right = '-105%'
            }
            Helpers.addContent(discription, this.data[index])
            viewDinamic(pro, protektorMax, container, persent, 2)
        });
    }

}