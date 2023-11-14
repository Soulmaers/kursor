export class NaviChartLegenda {
    constructor() {
        this.legenda = document.querySelector('.legenda_navi')
        this.checkMarkers = this.legenda.children[0].querySelector('.checkAll')
        this.checkAres = this.legenda.children[1].querySelector('.checkAll')
        this.checkLine = this.legenda.children[2].querySelector('.checkAll')
        this.markers = document.querySelectorAll('.markers_image')
        this.area = this.legenda.children[1].querySelectorAll('.galka')
        this.line = this.legenda.children[2].querySelectorAll('.galka')
        this.markers.forEach(el => el.addEventListener('click', this.toogleClickLegends.bind(this, el)))
        this.area.forEach(el => el.addEventListener('click', this.toogleClickLegends.bind(this, el)))
        this.line.forEach(el => el.addEventListener('click', this.toogleClickLegends.bind(this, el)))
        this.checkMarkers.addEventListener('click', this.toogleClickLegendsAndCheckAll.bind(this))
        this.checkAres.addEventListener('click', this.toogleClickLegendsAndCheckAll.bind(this))
        this.checkLine.addEventListener('click', this.toogleClickLegendsAndCheckAll.bind(this))
    }
    toogleClickLegendsAndCheckAll(event) {
        const element = event.target
        const checkinElements = element.parentNode.nextElementSibling.children
        element.classList.toggle('noactiveCheckAll')
        Array.from(checkinElements).forEach(el => {
            element.classList.contains('noactiveCheckAll') ? el.children[0].classList.add('noactive') : el.children[0].classList.remove('noactive')
            element.classList.contains('noactiveCheckAll') ? this.controllVisualElementsToCharts(el.children[0].getAttribute('rel'), 'hidden') :
                this.controllVisualElementsToCharts(el.children[0].getAttribute('rel'), 'view')
        })

    }
    toogleClickLegends(el) {
        el.classList.toggle('noactive')
        this.controllVisualElementsToCharts(el.getAttribute('rel'))
    }

    controllVisualElementsToCharts(type, global) {
        const svg = d3.select(".chart_to_wialon").selectAll(`[rel='${type}']`)

        if (global) {
            if (global === 'hidden') {
                svg.style('opacity', 0)
                    .classed('hidden', true);
            }
            else {
                svg.style('opacity', 1)
                    .classed('hidden', false);
            }
        }
        else {
            if (svg.classed('hidden')) {
                svg.style('opacity', 1)
                    .classed('hidden', false);
            } else {
                svg.style('opacity', 0)
                    .classed('hidden', true);
            }
        }
    }
}