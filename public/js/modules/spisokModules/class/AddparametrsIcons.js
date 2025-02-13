import { Helpers } from './Helpers.js'


export class AddparametrsIcons {
    constructor(data, list) {
        this.data = data
        this.list = list
        this.init()
    }


    init() {
        this.addContent()

    }


    addContent() {
        for (const el of this.list) {
            const datas = this.filtersStruktura(el.id)
            this.findParams(datas[2].result, el, datas.typeobject)
            if (datas[0].result.length === 0) continue;
            this.drawOsi(datas, el)
            this.colorWheels(datas, el)
        }
    }

    findParams(datas, el, type) {
        const eng = datas.find(e => e.params === 'engine');
        const sat = datas.find(e => e.params === 'sats');
        this.engine = eng ? Number(eng.value) : null;
        this.sats = sat ? Number(sat.value) : null;
        this.statusnew = this.sats ? this.sats > 4 && this.engine === 1 ? 'ВКЛ' : 'ВЫКЛ' : null;
        Helpers.updateIconsSensors(datas, el, this.statusnew, this.sats, type, this.engine)
    }




    drawOsi(datas, el) {
        const trail = el.querySelector('.list_trail2')
        const profil = el.querySelector('.list_profil2')
        trail.innerHTML = ''
        profil.innerHTML = ''
        const modelUniq = Helpers.convert(datas[0].result)
        modelUniq.forEach(os => {
            const osi = document.createElement('div')
            osi.classList.add('osi_list')
            if (os.trailer !== 'Прицеп' && os.tyres === '2' || os.trailer !== 'Прицеп' && os.tyres === '4') {
                Helpers.drawTyres(os, el, '.list_profil2')
            }
            if (os.trailer === 'Прицеп' && os.tyres === '2' || os.trailer == 'Прицеп' && os.tyres === '4') {
                Helpers.drawTyres(os, el, '.list_trail2')
            }
        })
    }
    colorWheels(datas, elem) {
        const shina = elem.querySelectorAll('.arc');
        let num = 0;
        shina.forEach(e => {
            num++
            e.setAttribute('id', num)
        })
        Helpers.coloring(shina, datas[1], datas[2], datas[3], this.engine)

    }


    filtersStruktura(id) {
        return this.data.find(e => e.object_id === id);
    }
}