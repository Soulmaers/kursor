
import { RequestStaticMetods } from './RequestStaticMetods.js'
import { Helpers } from './Helpers.js'
import { viewDinamic } from '../func/protector.js'
import { ContentGeneration } from '../html/content.js'
import { Dinamic } from './Dinamic.js'


export class Sklad {
    constructor(tyres) {
        this.tyres = tyres
        this.login = document.querySelectorAll('.log')[1].textContent
        this.techInfo = document.querySelector('.techInfo')
        this.containerCard = document.querySelector('.tth')
        this.boundSave = this.saveTyresAndParams.bind(this)
        this.init()
    }

    async init() {
        this.createCardTyres()
        const params = this.paramsGeneration()
        this.dannieWheel = await RequestStaticMetods.getTyresPosition(params)
        if (this.dannieWheel.length !== 0) {
            this.wiewDataTyres()
            this.protektorsEvent()
            this.addChartProtektor()
            const dinamicInstance = new Dinamic(this.dannieWheel, this.containerCard, 'monitoring');
            await dinamicInstance.init();
            this.initEvent()
        }
        else {
            Helpers.viewRemark(this.message, 'red', 'Шина не установлена')
        }
    }

    createCardTyres() {
        this.containerCard.innerHTML = ContentGeneration.createCarWheel()
        this.save = this.containerCard.querySelector('.save_params')
        this.message = this.containerCard.querySelector('.mess_validation')
    }

    paramsGeneration() {
        const identifikator = this.tyres.id
        const idObject = document.querySelector('.color').id
        return { identifikator: identifikator, idObject: idObject }
    }


    async wiewDataTyres() {
        const styleFon = this.dannieWheel.imagePath ? `url('../../../..${this.dannieWheel.imagePath}')` : `url('../../../../image/zeto_tyres.png')`;
        this.containerCard.querySelector('#imageContainer_wiew').style.backgroundImage = styleFon;
        const fields = [
            { id: '#type_tire_wiew', value: this.dannieWheel.type_tire },
            { id: '#marka_wiew', value: this.dannieWheel.marka },
            { id: '#model_wiew', value: this.dannieWheel.model },
            { id: '#type_tyres_wiew', value: this.dannieWheel.type_tyres },
            { id: '#radius_wiew', value: this.dannieWheel.radius },
            { id: '#profil_wiew', value: this.dannieWheel.profil },
            { id: '#width_wiew', value: this.dannieWheel.width },
            { id: '#sezon_wiew', value: this.dannieWheel.sezon },
            { id: '#index_speed_wiew', value: this.dannieWheel.index_speed },
            { id: '#index_massa_wiew', value: this.dannieWheel.index_massa },
            { id: '#psi_wiew', value: this.dannieWheel.psi },
            { id: '#bar_wiew', value: this.dannieWheel.bar },
            { id: '#protektor_passport_wiew', value: this.dannieWheel.protektor_passport },
            { id: '#probeg_now_wiew', value: this.dannieWheel.probeg_now },
            { id: '#probeg_last_wiew', value: this.dannieWheel.probeg_last },
            { id: '#N1', value: this.dannieWheel.N1 },
            { id: '#N2', value: this.dannieWheel.N2 },
            { id: '#N3', value: this.dannieWheel.N3 },
            { id: '#N4', value: this.dannieWheel.N4 },
            { id: '#ostatok', value: this.dannieWheel.ostatok },
            { id: '#comment', value: this.dannieWheel.comments }
        ];
        this.protektor = [this.dannieWheel.N1, this.dannieWheel.N2, this.dannieWheel.N3, this.dannieWheel.N4, this.dannieWheel.ostatok]
        fields.forEach(field => {
            const fieldElement = this.containerCard.querySelector(field.id);
            if (fieldElement) {
                fieldElement.tagName.toLowerCase() === 'input' ? fieldElement.value = field.value :
                    fieldElement.textContent = field.value;
            }
        });
        this.probeg = await Helpers.mileageCalc(this.dannieWheel.mileage, this.dannieWheel.probeg_now, this.dannieWheel.idObject)
        this.containerCard.querySelector('#probeg_now_wiew').value = this.probeg.mileageTyres
    }

    protektorsEvent() {
        const pro = this.containerCard.querySelectorAll('.protektors_wheel')
        const ostatok = this.containerCard.querySelector('#ostatok')
        pro.forEach(e => {
            e.addEventListener('input', (event) => {
                Helpers.validatonPunctuation(event.target)
                ostatok.value = Helpers.raschetProtector(this.containerCard, pro)
            })
        })
    }


    initEvent() {
        this.save.addEventListener('click', this.boundSave)
    }

    async saveTyresAndParams() {
        const protector = this.containerCard.querySelector('.protector').querySelectorAll('.styled-input')
        const obj = this.getObject(protector)
        console.log(obj)
        const message = await RequestStaticMetods.updateWheel(obj)
        Helpers.viewRemark(this.message, 'green', 'Изменения сохранены')
        pro = [...protector].filter(e => e.value !== '').map(it => it.value)
        pro.shift()
        const container = this.containerCard.querySelectorAll('.contBar22')
        viewDinamic(pro, this.dannieWheel.protektor_passport, container, this.dannieWheel.ostatok, 1.5)
        const dinamicInstance = new Dinamic(this.dannieWheel, this.containerCard, 'monitoring');
        await dinamicInstance.init();
    }
    getObject(pro) {
        const fieldsParams = this.containerCard.querySelector('.input-fields_params').querySelectorAll('.styled-input')
        const obj = {}
        fieldsParams.forEach(el => obj[el.getAttribute('id')] = el.value)
        obj.idw_tyres = this.dannieWheel.idw_tyres
        obj.login = document.querySelectorAll('.log')[1].textContent
        obj.dateZamer = !this.compareProtektor(obj) ? Helpers.getCurrentDate() : this.dannieWheel.dateZamer
        obj.flag_status = this.dannieWheel.flag_status
        obj.price_tyres = this.dannieWheel.price
        obj.probeg_passport_wiew = this.dannieWheel.probeg_passport
        obj.rfid = this.dannieWheel.rfid
        obj.id_bitrix = this.dannieWheel.id_bitrix
        obj.mileage = this.probeg.mileage

        pro.forEach(el => obj[el.getAttribute('id')] = el.value)
        return obj
    }

    compareProtektor(obj) {
        const n = [obj.N1, obj.N2, obj.N3, obj.N4, obj.ostatok];
        return this.protektor.every((value, index) => {
            return n[index] === value;
        });
    }

    async addChartProtektor() {
        const protector = [];
        protector.push(this.dannieWheel.N1, this.dannieWheel.N2, this.dannieWheel.N3, this.dannieWheel.N4)
        const pro = protector.filter(e => e !== '').map(it => it)
        const container = this.containerCard.querySelectorAll('.contBar22')
        viewDinamic(pro, this.dannieWheel.protektor_passport, container, this.dannieWheel.ostatok, 1.5)
    }

}