
import { RequestStaticMetods } from './RequestStaticMetods.js'
import { Find } from './Find.js'
import { Helpers } from './Helpers.js'
import { focusCorrectValue } from '../../helpersFunc.js'
import { GetDataTime } from '../../../class/GetDataTime.js'
import { viewDinamic } from '../../protector.js'

export class Sklad {
    constructor(tyres) {
        this.tyres = tyres
        this.mileage = null
        this.response = null
        this.login = document.querySelectorAll('.log')[1].textContent
        this.techInfo = document.querySelector('.techInfo')
        this.select = this.techInfo.querySelector('.controll_tyres')
        this.mileageTyres = this.techInfo.querySelector('.probeg_tyres')
        this.probegPassport = this.techInfo.querySelector('.probegPassport')
        this.probegOstatok = this.techInfo.querySelector('.probeg_ostatok')
        this.protectorPassport = this.techInfo.querySelector('.protector_passport')
        this.sklad = this.techInfo.querySelector('.select_sklad')
        this.skladList = this.techInfo.querySelector('.sklad_list')
        this.btnModal = this.techInfo.querySelector('.button_modal')
        this.focusInput = this.techInfo.querySelectorAll('.focus_input')
        this.idbaseTyres = this.techInfo.querySelector('.idbaseTyres')
        this.message = this.techInfo.querySelector('.validation_message_to')
        this.tth = this.techInfo.querySelectorAll('.modal')
        this.wheel = this.techInfo.querySelectorAll('.wheel')
        this.pro = this.techInfo.querySelectorAll('.pro')
        this.desc = this.techInfo.querySelectorAll('.desc')
        this.montaj = document.querySelector('.montaj_date')
        this.procentProtector = this.techInfo.querySelector('.procentProtector')
        this.markaFlash = document.querySelector('.marka_flash')
        this.techInfo = document.querySelector('.techInfo')
        this.modelFlash = this.techInfo.querySelector('.model_flash')
        this.uniqModal = this.techInfo.querySelector('.uniq_model')
        this.formValue = this.techInfo.querySelectorAll('.formValue')
        this.bar = this.techInfo.querySelector('.bar')
        this.wrapper = this.techInfo.querySelector('.sklad_controll')
        this.trigger = document.querySelectorAll('.trigger_calendar')
        this.models = null
        this.save = null
        this.items = this.techInfo.querySelectorAll('.item_type')
        this.input = null
        this.object = {
            login: null,
            idBitrix: null,
            id: null,
            identificator: null,
            idObject: null,
            nameCar: null,
            typeOs: null,
            numberOs: null,
            uniqTyresID: null,
            psi: null,
            bar: null,
            probegNow: null,
            probegVal: null,
            N1: null,
            N2: null,
            N3: null,
            N4: null,
            ostatok: null,
            rfid: null,
            comment: null,
            haveOnSklad: '1',
            dateInputSklad: null,
            dateOutputSklad: null,
            dateInstall: null,
            dateZamer: null,
            mileage: null
        }
        this.boudSelect = this.toggleSelect.bind(this)
        this.boudSelectMarka = this.toggleSelectPole.bind(this)
        this.boudSelectModel = this.toggleSelectPole.bind(this)
        this.boundMouseLeave = this.hiddenListOutsideKursor.bind(this)
        this.boundMouseLeaveMarka = this.hiddenListOutsideKursorPole.bind(this)
        this.boundMouseLeaveModel = this.hiddenListOutsideKursorPole.bind(this)
        this.AnyboundMouseLeaveModel = this.anyElementToggleMouse.bind(this)
        this.boundItems = this.process.bind(this)
        this.boundSave = this.saveTyresAndParams.bind(this)
        this.boundCalendar = this.openCalendar.bind(this)
        this.init()
    }

    init() {
        this.tech()
        this.focusInput.forEach(e => focusCorrectValue(e))
        this.createSelect()
        this.initEvent()
        this.findSvoznoy()
    }

    tech() {
        const job = document.querySelectorAll('.job')
        this.idbaseTyres.textContent = ''
        this.formValue.forEach(i => {
            i.value = ''
            if (i.getAttribute('rel') === 'probegNow') i.value = 0
            if (i.getAttribute('rel') === 'pasportMileage') i.value = 150000
        })
        job.forEach(i => i.textContent = '')
        const inputPSI = document.querySelector('.jobDav')
        const inputBar = document.querySelector('.bar')

        inputPSI.addEventListener('input', () => {
            inputBar.textContent = (inputPSI.value / 14.504).toFixed(1);
        })
        this.pro.forEach(e => {
            e.addEventListener('input', () => {
                this.procentProtector.value = Helpers.raschet(this.techInfo, this.pro)
            })
        })
        this.protectorPassport.addEventListener('input', () => {
            this.procentProtector.value = Helpers.raschet(this.techInfo, this.pro)
        })
        this.probegOstatok.textContent = Number(this.probegPassport.value) - Number(this.mileageTyres.value)
        this.probegPassport.addEventListener('input', () => {
            this.probegOstatok.textContent = Number(this.probegPassport.value) - Number(this.mileageTyres.value)
        })
        this.mileageTyres.addEventListener('input', () => {
            this.input = true
            this.probegOstatok.textContent = Number(this.probegPassport.value) - Number(this.mileageTyres.value)
        })
        this.viewTech(this.tyres.id);
        const calendar = document.querySelector('.open_calendar')
        if (calendar) calendar.classList.remove('open_calendar')
    }

    initEvent() {
        this.select.addEventListener('click', this.boudSelect)
        this.select.nextElementSibling.addEventListener('mouseleave', this.boundMouseLeave)
        this.markaFlash.addEventListener('click', this.boudSelectMarka)
        this.markaFlash.lastElementChild.addEventListener('mouseleave', this.boundMouseLeaveMarka)
        this.modelFlash.addEventListener('click', this.boudSelectModel)
        this.modelFlash.lastElementChild.addEventListener('mouseleave', this.boundMouseLeaveModel)
        this.skladList.addEventListener('mouseleave', this.AnyboundMouseLeaveModel)
        this.items.forEach(e => e.addEventListener('click', this.boundItems))
        this.trigger.forEach(e => e.addEventListener('click', this.boundCalendar))
        this.save.addEventListener('click', this.boundSave)
    }
    destroy() {
        this.select.removeEventListener('click', this.boudSelect);
        this.select.nextElementSibling.removeEventListener('mouseleave', this.boundMouseLeave);
        this.markaFlash.removeEventListener('click', this.boudSelectMarka)
        this.markaFlash.lastElementChild.removeEventListener('mouseleave', this.boundMouseLeaveMarka)
        this.modelFlash.removeEventListener('click', this.boudSelectModel)
        this.modelFlash.lastElementChild.removeEventListener('mouseleave', this.boundMouseLeaveModel)
        this.items.forEach(e => e.removeEventListener('click', this.boundItems));
        this.trigger.forEach(e => e.removeEventListener('click', this.boundCalendar))
        this.save.removeEventListener('click', this.boundSave)
    }


    async openCalendar(event) {
        const element = event.target
        const calendar = document.querySelector('.open_calendar')
        if (calendar) calendar.classList.remove('open_calendar')
        element.nextElementSibling.classList.add('open_calendar')
        const clear = element.nextElementSibling.querySelectorAll('.btm_formStart')[0]
        const made = element.nextElementSibling.querySelectorAll('.btm_formStart')[1]
        clear.addEventListener('click', () => {
            element.nextElementSibling.firstElementChild.value = ''
            element.nextElementSibling.classList.remove('open_calendar')
        })
        const getTime = new GetDataTime()
        const time = await getTime.getTimeIntervalOne(element.nextElementSibling)
        made.addEventListener('click', () => {
            element.nextElementSibling.classList.remove('open_calendar')
            element.previousElementSibling.value = time

        })
    }
    async findSvoznoy() {
        this.models = await RequestStaticMetods.getModelTyres()
    }

    createSelect() {
        this.select.textContent = 'выберите действие'
        const btn = this.techInfo.querySelector('.buttonTth')
        if (btn) btn.remove()
        this.save = document.createElement('div')
        this.save.classList.add('buttonTth')
        this.save.textContent = 'Сохранить'
        this.btnModal.appendChild(this.save)
    }

    async saveTyresAndParams() {
        const pressure = this.tyres.firstElementChild.getAttribute('rel')
        const idObject = document.querySelector('.color').id
        const marka = this.markaFlash.firstElementChild.value
        const model = this.modelFlash.firstElementChild.value
        const idRel = this.tyres.getAttribute('rel')
        if (!idRel) {
            Helpers.viewRemark(this.message, 'red', 'Установите колесо!')
        }
        else if (marka === '' || model === '') {
            Helpers.viewRemark(this.message, 'red', 'Укажите марку  и модель!')
        }
        else if (this.montaj.value === '') {
            Helpers.viewRemark(this.message, 'red', 'Укажите дату монтажа!')
        }
        else {
            let relId = this.modelFlash.getAttribute('rel')
            const arrayWheel = [...this.wheel].map(el => el.value)
            relId = await RequestStaticMetods.setModelTyres(arrayWheel, relId)//СОХРАНЯЕМ ХЗАРАКТЕРИСТИКИ НОВОГО КОЛЕСА И ВОЗВРАЩАЕМ ID СВЯЗНОЙ ТАБЛИЦЫ
            console.log(relId)
            await this.accamulateInfo(relId, idObject)
            const saveTyres = await RequestStaticMetods.setTyres(this.object) //СОХРАНЯЕМ КОЛЕСО В БАЗУ КОЛЕС
            const res = await RequestStaticMetods.updateFilterTable(idObject, this.object.idBitrix, idRel, pressure) //СОХРАНЯЮ ИСТОРИЮ КОЛЕСА
            const mess = await RequestStaticMetods.setTyresHistory(this.object) //СОХРАНЯЮ ИСТОРИЮ КОЛЕСА
            Helpers.viewRemark(this.message, 'green', mess)
        }
    }

    async accamulateInfo(relId, idObject) {
        console.log(this.input)
        console.log(relId, idObject)
        this.procentProtector.value = Helpers.raschet(this.techInfo, this.pro)
        const res = await Helpers.mileageCalc(this.response.mileage, this.response.probegNow)
        // console.log(this.mileageTyres)
        this.mileageTyres.value = isNaN(res.mileageTyres) || this.input ? this.mileageTyres.value : res.mileageTyres
        this.mileage = res.mileage
        this.probegOstatok.textContent = Number(this.probegPassport.value) - Number(this.mileageTyres.value)
        console.log(this.mileageTyres.value)
        this.desc.forEach(e => {
            this.object[e.getAttribute('rel')] = e.value
        })
        this.object.login = this.login
        this.object.uniqTyresID = relId
        this.object.identificator = this.tyres.id
        this.object.id = this.tyres.getAttribute('rel')
        this.object.numberOs = this.tyres.closest('.osiTest').querySelector('.centerOsTest').id
        this.object.typeOs = this.tyres.closest('.osiTest').querySelector('.centerOsTest').classList.contains('pricepT') ? 'Прицеп' : 'Тягач'
        this.object.idObject = idObject
        this.object.nameCar = document.querySelector('.color').firstElementChild.textContent
        this.object.bar = (Number(this.object.psi) / 14.504).toFixed(1);
        this.object.mileage = this.mileage
        this.object.probegVal = this.probegOstatok.textContent
        console.log(this.object)
    }

    process(event) {
        const rel = event.target.getAttribute('rel')
        this.hiddenListOutsideKursor()
        this.ifLogick(rel)
    }

    ifLogick(rel) {
        switch (rel) {
            case '0': this.installNewTyres()
                break;
            case '1': this.getTyresToSklad()
                break;
            case '2': this.deleteTyresSklad()
                break;
        }
    }

    async getTyresToSklad() {
        if (this.montaj.value === '') {
            const elem = this.sklad.nextElementSibling
            this.anyElementToggle(elem)
            const res = await RequestStaticMetods.getTyresToSlad()
            this.createListSkladParams(res, this.skladList, this.idbaseTyres)
        }
        else {
            Helpers.viewRemark(this.message, 'red', 'Место занято!')
        }
    }

    async deleteTyresSklad() {
        const id = this.tyres.getAttribute('rel')
        if (id) {
            const relId = this.modelFlash.getAttribute('rel')
            const idObject = document.querySelector('.color').id
            await this.accamulateInfo(relId, idObject)
            this.tyres.removeAttribute('rel');
            this.object.haveOnSklad = '0'
            this.object.dateInputSklad = Helpers.getCurrentDate()
            this.object.dateOutputSklad = null
            const mess = await RequestStaticMetods.setTyres(this.object)
            console.log(this.object)
            await RequestStaticMetods.setTyresHistory(this.object) //СОХРАНЯЮ ИСТОРИЮ КОЛЕСА
            this.modelFlash.removeAttribute('rel');
            this.formValue.forEach(e => e.value = '')
            this.idbaseTyres.textContent = ''
            this.bar.textContent = ''
            Helpers.viewRemark(this.message, 'green', mess)
            this.select.textContent = 'Колесо снято'
            viewDinamic([])
        }
        else {
            Helpers.viewRemark(this.message, 'red', 'Установите колесо!')
        }

    }
    async installNewTyres() {
        const idRel = this.tyres.getAttribute('rel')
        if (idRel) {
            Helpers.viewRemark(this.message, 'red', 'Место занято!')
        } else {
            const newId = await RequestStaticMetods.findId()
            this.viewId(newId)
            this.object.haveOnSklad = '1'
            this.object.dateInputSklad = null
            this.object.dateOutputSklad = null
            this.select.textContent = 'Назначен id колеса'
        }
    }

    viewId(newId) {
        this.tyres.setAttribute('rel', newId)
        this.idbaseTyres.textContent = newId
    }

    anyElementToggle(element) {
        element.classList.toggle('hidden_view')
    }
    anyElementToggleMouse() {
        this.skladList.classList.remove('hidden_view')
    }

    toggleSelect() {
        this.sklad.classList.toggle('hidden_view')
    }
    toggleSelectPole(event) {
        const position = event.target.parentElement
        const wrapper = event.target.parentElement.lastElementChild
        if (position.classList.contains('marka_flash')) {
            this.createListMarkaParams(event.target, wrapper)
            const cell = wrapper.querySelectorAll('.list_params_tyres')
            new Find(event.target, cell)
        }
        else {
            this.createListModelParams(event.target, wrapper)
            const cell = wrapper.querySelectorAll('.list_params_tyres')
            new Find(event.target, cell, wrapper)
        }
        event.target.parentElement.lastElementChild.classList.toggle('hidden_view')
    }
    // скрывает список когда уходишь курсором
    hiddenListOutsideKursor() {
        this.sklad.classList.remove('hidden_view')
    }

    hiddenListOutsideKursorPole(event) {
        event.target.parentElement.lastElementChild.classList.remove('hidden_view')
    }

    createListSkladParams(data, wrapper, pole) {
        wrapper.querySelectorAll('.list_params_tyres, .find_sklad').forEach(e => e.remove());
        const find = document.createElement('div')
        find.classList.add('find_sklad')
        const i = document.createElement('i')
        i.classList.add('loop_find_sklad', 'fas', 'fa-search')
        find.appendChild(i)
        const input = document.createElement('input')
        input.classList.add('search_input_tyres')
        input.setAttribute('placeholder', 'Поиск')
        find.appendChild(input)
        wrapper.appendChild(find)
        data.forEach(e => {
            const div = document.createElement('div')
            div.classList.add('list_params_tyres')
            wrapper.appendChild(div)
            const celMarka = document.createElement('div')
            celMarka.classList.add('cel_params_tyres', 'cel_marka')
            celMarka.textContent = e.marka
            div.appendChild(celMarka)
            const celModel = document.createElement('div')
            celModel.classList.add('cel_params_tyres', 'cel_model')
            celModel.textContent = e.model
            div.appendChild(celModel)
            const celType = document.createElement('div')
            celType.classList.add('cel_params_tyres', 'cel_type')
            celType.textContent = e.type
            div.appendChild(celType)
            const celSize = document.createElement('div')
            celSize.classList.add('cel_params_tyres', 'cel_size')
            celSize.textContent = e.size
            div.appendChild(celSize)
            const celSezon = document.createElement('div')
            celSezon.classList.add('cel_params_tyres', 'cel_sezon')
            celSezon.textContent = e.sezon
            div.appendChild(celSezon)
            div.addEventListener('click', async (event) => {
                const relId = e.uniqTyresID[0]
                pole.textContent = e.idw_tyres
                this.tyres.setAttribute('rel', e.idw_tyres)
                event.stopPropagation()
                this.modelFlash.setAttribute('rel', e.uniqTyresID[0])
                event.stopPropagation()
                delete e.uniqTyresID
                this.wheel.forEach((it, index) => {
                    it.value = Object.values(e)[index]
                })
                const ress = await Helpers.mileageCalc()
                this.mileage = ress.mileage
                console.log(this.mileage)

                const res = await RequestStaticMetods.getHistoryTyres(e.idw_tyres)
                res.login = this.login
                res.identificator = this.tyres.id
                res.numberOs = this.tyres.closest('.osiTest').querySelector('.centerOsTest').id
                res.typeOs = this.tyres.closest('.osiTest').querySelector('.centerOsTest').classList.contains('pricepT') ? 'Прицеп' : 'Тягач'
                res.idObject = document.querySelector('.color').id
                res.nameCar = document.querySelector('.color').firstElementChild.textContent
                res.haveOnSklad = '1'
                res.dateOutputSklad = Helpers.getCurrentDate()
                res.dateInstall = Helpers.getCurrentDate()
                res.dateInputSklad = null
                res.uniqTyresID = relId
                res.mileage = this.mileage
                console.log(res)
                await RequestStaticMetods.setTyres(res)
                await RequestStaticMetods.setTyresHistory(res) //СОХРАНЯЮ ИСТОРИЮ КОЛЕСА
                this.viewTech(this.tyres.id);
                this.anyElementToggleMouse()
                this.select.textContent = 'Колесо установлено'
            })
        })
        const cell = wrapper.querySelectorAll('.list_params_tyres')
        new Find(input, cell)
    }

    createListMarkaParams(pole, wrapper) {
        const rows = wrapper.querySelectorAll('.list_params_tyres')
        if (rows) rows.forEach(e => e.remove())
        const marka = [...new Set(this.models.map(e => e.marka))]
        marka.forEach(e => {
            const celMarka = document.createElement('div')
            celMarka.classList.add('list_params_tyres', 'cel_marka')
            celMarka.textContent = e
            wrapper.appendChild(celMarka)
            celMarka.addEventListener('click', (event) => {
                event.stopPropagation()
                pole.value = e
                this.modelFlash.firstElementChild.value = ''
            })
        })
    }
    createListModelParams(pole, wrapper) {
        const rows = wrapper.querySelectorAll('.list_params_tyres')
        if (rows) rows.forEach(e => e.remove())
        this.models.forEach(e => {
            const div = document.createElement('div')
            div.classList.add('list_params_tyres')
            wrapper.appendChild(div)
            const celMarka = document.createElement('div')
            celMarka.classList.add('cel_params_tyres', 'cel_marka')
            celMarka.textContent = e.marka
            div.appendChild(celMarka)
            const celModel = document.createElement('div')
            celModel.classList.add('cel_params_tyres', 'cel_model')
            celModel.textContent = e.model
            div.appendChild(celModel)
            div.addEventListener('click', (event) => {
                this.modelFlash.setAttribute('rel', e.uniqTyresID)
                event.stopPropagation()
                delete e.uniqTyresID
                this.wheel.forEach((it, index) => {
                    it.value = Object.values(e)[index]
                })
            })
        })
    }

    async viewTech(id) {
        const rad = document.querySelectorAll('[name=radio]')
        rad[0].checked = true
        const idw = document.querySelector('.color').id
        const response = await RequestStaticMetods.getHistoryTyresidTyres(id, idw)
        this.response = response
        const idBitrix = document.querySelector('.idBitrix')
        const uniqModel = document.querySelector('.model_flash')
        const number = document.querySelectorAll('.number')
        const text = document.querySelectorAll('.text')
        const titleMM = document.querySelectorAll('.titleMM')
        const inputMM = document.querySelector('.mmtext')
        if (response.length === 0) {
            this.tyres.removeAttribute('rel');
            number.forEach(e => {
                e.textContent = ''
            })
            text.forEach(e => {
                e.textContent = ''
            })
            rad.forEach(el => {
                el.addEventListener('change', () => {
                    viewDinamic([])
                })
            })
            viewDinamic([])
        }
        else {
            if (response.haveOnSklad === '0') {
                this.tyres.removeAttribute('rel');
                viewDinamic([])
                return
            }
            this.formValue.forEach(el => {
                el.value = response[el.getAttribute('rel')]
            })

            this.idbaseTyres.textContent = response.id
            this.tyres.setAttribute('rel', response.id)
            idBitrix.value = response.id_bitrix
            uniqModel.setAttribute('rel', response.uniqTyresID[0])
            number[0].textContent = 'N1'
            number[1].textContent = 'N2'
            number[2].textContent = 'N3'
            number[3].textContent = 'N4'
            text[0].textContent = response.N1 + 'мм',
                text[1].textContent = response.N2 + 'мм',
                text[2].textContent = response.N3 + 'мм',
                text[3].textContent = response.N4 + 'мм';
            inputMM.innerHTML = response.passportProtektor + 'mm';
            const protector = [];
            protector.push(response.N1, response.N2, response.N3, response.N4)
            const protectorClear = [];
            const protectorClearRigth = [];
            titleMM.forEach(el => {
                el.style.display = 'flex';
                if (el.children[1].textContent == 'мм' || el.children[1].textContent == '') {
                    el.style.display = 'none';
                }
            })
            protector.forEach(el => {
                if (el !== '') {
                    protectorClear.push(el)
                    protectorClearRigth.push(el)
                }
            })
            const reverseprotectorClear = protectorClearRigth.reverse();
            const maxStoc = response.passportProtektor
            rad.forEach(el => {
                el.addEventListener('change', () => {
                    el.id === '1' ? viewDinamic(protectorClear, maxStoc) : viewDinamic(reverseprotectorClear, maxStoc)
                })
            })
            const inputPSI = document.querySelector('.jobDav')
            const inputBar = document.querySelector('.bar')
            inputBar.textContent = (inputPSI.value / 14.504).toFixed(1);
            const res = await Helpers.mileageCalc(response.mileage, response.probegNow)
            console.log(res.mileageTyres, response.probegVal)
            this.mileageTyres.value = res.mileageTyres
            this.probegOstatok.textContent = Number(response.pasportMileage) - res.mileageTyres
            console.log(this.probegOstatok.textContent)
            viewDinamic(protectorClear, maxStoc)
        }

    }
}