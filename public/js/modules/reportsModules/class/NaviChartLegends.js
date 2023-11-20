export class NaviChartLegenda {
    constructor() {

        this.mark = document.querySelector('.markers')
        this.are = document.querySelector('.area')
        this.lin = document.querySelector('.line')
        this.checkMarkers = this.mark ? this.mark.querySelector('.checkAll') : null
        this.checkAres = this.are ? this.are.querySelector('.checkAll') : null
        this.checkLine = this.lin ? this.lin.querySelector('.checkAll') : null
        this.markers = document.querySelectorAll('.markers_image')
        this.area = this.are ? this.are.querySelectorAll('.galka') : null
        this.line = this.lin ? this.lin.querySelectorAll('.galka') : null

        this.markers ? this.markers.forEach(el => el.addEventListener('click', this.toogleClickLegends.bind(this, el))) : null
        this.area ? this.area.forEach(el => el.addEventListener('click', this.toogleClickLegends.bind(this, el))) : null
        this.line ? this.line.forEach(el => el.addEventListener('click', this.toogleClickLegends.bind(this, el))) : null

        this.checkMarkers ? this.checkMarkers.addEventListener('click', this.toogleClickLegendsAndCheckAll.bind(this)) : null
        this.checkAres ? this.checkAres.addEventListener('click', this.toogleClickLegendsAndCheckAll.bind(this)) : null
        this.checkLine ? this.checkLine.addEventListener('click', this.toogleClickLegendsAndCheckAll.bind(this)) : null
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
        console.log(type, global)
        const svg = d3.select(".chart_to_wialon").selectAll(`[rel='${type}']`)
        console.log(svg)
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