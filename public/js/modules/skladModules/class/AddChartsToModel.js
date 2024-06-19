import { ContentGeneration } from '../html/content.js'
import { viewDinamic } from '../../protector.js'
import { Helpers } from './Helpers.js'
export class AddChartsToModel {
    constructor(tyres, container) {
        this.tyres = tyres
        this.container = container
        this.left = this.container.querySelector('.left_grafs')
        this.right = this.container.querySelector('.right_grafs')
        this.elementsTyres = container.querySelectorAll('.tyres_shema_car')
        this.init()
    }


    init() {
        this.filterWheel()
        this.createContainers()
    }

    filterWheel() {
        this.wheel = [...this.elementsTyres].filter(e => e.getAttribute('rel'))
        const arrayIdSet = new Set(this.wheel.map(e => e.getAttribute('rel')));
        this.data = this.tyres.filter(tyre => arrayIdSet.has(tyre.idw_tyres));
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
                discription.style.right = '-125%'
            }
            Helpers.addContent(discription, this.data[index])
            viewDinamic(pro, protektorMax, container, persent, 2)
        });
    }

}