import { RequestStaticMetods } from "./RequestStaticMetods.js"
import { ContentGeneration } from '../html/content.js'
import { CreateDOMElements } from './CreateDOMElements.js'
import { Helpers } from './Helpers.js'
import { Tooltip } from "../../../class/Tooltip.js"
import { TyreSearch } from './TyreSearch.js'
import { TyresService } from './TyresService.js'
import { DragAndDrop } from './DragAndDropTyres.js'
import { WindowCard } from './WindowCard.js'
import { Crafika } from './Grafika.js'
import { AddChartsToModel } from "./AddChartsToModel.js"
import { Find } from './Find.js'

export class SkladTyres {
    constructor(element, data) {
        this.element = element
        this.data = data
        this.uniqData = null
        this.arrayNameColumns = ['marka', 'model', 'size', 'probegNow', 'probegVal', 'dateOutputSklad']
        this.allTyres = null
        this.jobTyres = this.element.querySelector('.job_tyres').querySelector('.body_sklad')
        this.pop = document.querySelector('.popup-background')
        this.skladTyres = this.element.querySelector('.sklad_tyres').querySelector('.body_sklad')
        this.job_field = this.element.querySelector('.job_field')
        this.container_shema = this.element.querySelector('.container_shema')
        this.add_model_tyres = this.element.querySelector('.add_model_tyres')
        this.add_tyres = this.element.querySelector('.add_tyres')
        this.navi = this.element.querySelectorAll('.up_name')
        this.icon_add_tyres = this.element.querySelectorAll('.icon_add_tyres')
        this.tyresRoom = this.element.querySelector('.tyres_room')
        this.find = this.element.querySelector('.search_input_meta')
        this.modelTyres = null
        this.modelCar = null
        this.clickCard = null
        this.fields = [
            'type_tire', 'marka', 'model', 'type_tyres',
            'radius', 'profil', 'width', 'sezon',
            'index_speed', 'index_massa'
        ];
        //   this.fieldsWheel = ['price_tyres', 'probeg_passport_wiew']
        this.lastClickedElement = null; // Храним ссылку на последний кликнутый элемент
        this.clickCardRow = null
        this.boundNavi = this.showBody.bind(this)
        this.boundModelTyresWindow = this.addWindow.bind(this)
        this.boundTyresWindow = this.addCardListTyres.bind(this)
        this.init()
    }

    async init() {

        await this.getTyres()
        this.defaultDOMElements()
        this.addTooltips()
        this.initEvent()
        this.uniqData = this.getUniqData(this.data)
        CreateDOMElements.createListObject(this.data)
        this.modelTyres = await RequestStaticMetods.getModelTyresGuide();


        this.createRows()
        this.controllListAndTyres()
    }

    async updateListTyres() {
        await this.getTyres();
        this.createRows();
        if (this.lastClickedElement) {
            if (this.dragAndDropInstance) {
                this.dragAndDropInstance.removeEventListeners(); // Удаляем старые события
            }
            this.dragAndDropInstance = new DragAndDrop(this.skladTyres, '.row_sklad', '.tyres_shema_car', this.element, this); // Пересоздаем с новыми элементами
        }
        this.addTooltip()
    }
    async addCardListTyres() {
        const windowClick = this.element.querySelector('.click_row')
        if (windowClick) windowClick.classList.remove('click_row')
        const element = this.job_field.querySelector('.tyres_model_list');
        this.toggleDisplay(element, 'flex');
        this.updateJobField('Карточка создания шины', 'none', 'none', 'flex', 'none');
        element.children[0].innerHTML = ContentGeneration.createCardTyres();
        this.container = document.querySelector('.body_card_tyres')
        const vvod = this.container.querySelectorAll('.vvod')
        vvod.forEach(e => Helpers.validatonPunctuation(e))
        const list_item_tyres_model = this.job_field.querySelector('.list_item_tyres_model');
        this.modelTyres = await RequestStaticMetods.getModelTyresGuide();
        CreateDOMElements.createListModelsTyres(list_item_tyres_model, this.modelTyres);
        const rowsModel = list_item_tyres_model.querySelectorAll('.row_model')
        const searchInput = element.querySelector('.search_input_meta')
        new Find(searchInput, rowsModel)
        this.viewValueParamsCard(element, this.modelTyres)
        this.clickReduct(element)
        this.saveTyres(element)
    }


    saveTyres(element) {
        const saveButton = element.querySelector('.save_params')
        const mess = element.querySelector('.mess_validation')
        const fieldsParams = element.querySelector('.input-fields_params').querySelectorAll('.styled-input')
        saveButton.addEventListener('click', async () => {
            const bool = Helpers.validationInput(this.container)
            if (!bool) {
                Helpers.viewRemark(mess, 'red', 'Заполните обязательные поля')
            }
            else {

                const uniqID = saveButton.getAttribute('id')
                if (!uniqID) {
                    Helpers.viewRemark(mess, 'red', 'Выберите модель колеса')
                    return
                }
                const message = await TyresService.createTyre(uniqID, fieldsParams)
                Helpers.viewRemark(mess, 'green', message)
                this.clickCard = null
                saveButton.removeAttribute('rel');
                this.addCardListTyres()
                this.updateListTyres()

            }
        })
    }
    valueCalculate(element) {
        const psi = element.querySelector('#psi_wiew')
        const bar = element.querySelector('#bar_wiew')
        const ostatok = element.querySelector('#ostatok')
        const probeg_passport = element.querySelector('#probeg_passport_wiew')
        const probeg_now_wiew = element.querySelector('#probeg_now_wiew')
        const probeg_last_wiew = element.querySelector('#probeg_last_wiew')
        const pro = element.querySelectorAll('.protektors')
        this.psiEvent(psi, bar)
        this.protektorsEvent(element, pro, ostatok)
        this.probegEvent(probeg_passport, probeg_now_wiew, probeg_last_wiew)
    }

    probegEvent(probeg_passport, probeg_now_wiew, probeg_last_wiew) {
        console.log(probeg_passport, probeg_now_wiew, probeg_last_wiew)
        probeg_last_wiew.value = Number(probeg_passport.value) - Number(probeg_now_wiew.value)
        probeg_now_wiew.addEventListener('input', () => {
            probeg_last_wiew.value = Number(probeg_passport.value) - Number(probeg_now_wiew.value)
        })
        probeg_passport.addEventListener('input', () => {
            probeg_last_wiew.value = Number(probeg_passport.value) - Number(probeg_now_wiew.value)
        })
    }
    psiEvent(psi, bar) {
        psi.addEventListener('input', () => {
            bar.value = (psi.value / 14.504).toFixed(1);
        })
    }
    protektorsEvent(element, pro, ostatok) {
        pro.forEach(e => {
            e.addEventListener('input', (event) => {
                console.log(event.target)
                Helpers.validatonPunctuation(event.target)
                ostatok.value = Helpers.raschetProtector(element, pro)
            })
        })
        element.addEventListener('input', () => {
            ostatok.value = Helpers.raschetProtector(element, pro)
        })
    }
    clickReduct(element) {
        const reduct = element.querySelector('.reduct_params');
        const mess = element.querySelector('.mess_validation');
        reduct.addEventListener('click', () => {
            console.log(this.clickCard)
            if (!this.clickCard) {
                Helpers.viewRemark(mess, 'red', 'Выберите модель колеса')
                return
            }
            this.addWindow('reduct')
            this.viewValueParamsModel()
        })
    }

    viewValueParamsModel() {
        const globalParent = this.job_field.querySelector('.card_model_window')
        const styleFon = this.clickCard.imagePath ? `url('../../../..${this.clickCard.imagePath}')` : `url('../../../../image/zeto_tyres.png')`;
        globalParent.querySelector('#imageContainer').style.backgroundImage = styleFon;
        const fields = [
            { id: '#type_tire', value: this.clickCard.type_tire },
            { id: '#marka', value: this.clickCard.marka },
            { id: '#model', value: this.clickCard.model },
            { id: '#type_tyres', value: this.clickCard.type_tyres },
            { id: '#radius', value: this.clickCard.radius },
            { id: '#profil', value: this.clickCard.profil },
            { id: '#width', value: this.clickCard.width },
            { id: '#sezon', value: this.clickCard.sezon },
            { id: '#index_speed', value: this.clickCard.index_speed },
            { id: '#index_massa', value: this.clickCard.index_massa },
            { id: '#probeg_passport', value: this.clickCard.probeg_passport },
            { id: '#protektor_passport', value: this.clickCard.protektor_passport }

        ];
        fields.forEach(field => {
            const fieldElement = globalParent.querySelector(field.id);
            if (fieldElement) {
                fieldElement.value = field.value;
            }
        });
    }
    viewValueParamsCard(element, modelsTyres) {
        const rows = element.querySelectorAll('.row_model');
        const globalParent = element.querySelector('.card_model_tyres');
        const uniqID = element.querySelector('.save_params');
        rows.forEach(el => el.addEventListener('click', () => {
            const info = modelsTyres.find(e => e.uniqTyresID === Number(el.getAttribute('rel')));
            this.clickCard = info
            uniqID.setAttribute('id', el.getAttribute('rel'))
            const styleFon = info.imagePath ? `url('../../../..${info.imagePath}')` : `url('../../../../image/zeto_tyres.png')`;
            globalParent.querySelector('#imageContainer_wiew').style.backgroundImage = styleFon;

            const fields = [
                { id: '#type_tire_wiew', value: info.type_tire },
                { id: '#marka_wiew', value: info.marka },
                { id: '#model_wiew', value: info.model },
                { id: '#type_tyres_wiew', value: info.type_tyres },
                { id: '#radius_wiew', value: info.radius },
                { id: '#profil_wiew', value: info.profil },
                { id: '#width_wiew', value: info.width },
                { id: '#sezon_wiew', value: info.sezon },
                { id: '#index_speed_wiew', value: info.index_speed },
                { id: '#index_massa_wiew', value: info.index_massa },
                { id: '#probeg_passport_wiew', value: info.probeg_passport },
                { id: '#protektor_passport_wiew', value: info.protektor_passport }
            ];
            fields.forEach(field => {
                const fieldElement = globalParent.querySelector(field.id);
                if (fieldElement) {
                    fieldElement.textContent = field.value;
                }
            });
            this.valueCalculate(element)
        }));
    }

    addWindow(reduct) {
        const windowClick = this.element.querySelector('.click_row')
        if (windowClick) windowClick.classList.remove('click_row')
        if (reduct.isTrusted) this.clickCard = null
        const element = this.job_field.querySelector('.tyres_model_card')
        element.style.display = 'flex'
        element.innerHTML = ContentGeneration.createWindowModelTyres()
        element.style.zIndex = 2
        this.pop.style.display = 'block'
        new TyreSearch(this.modelTyres, this.fields)
        this.closeFunction(element)
        this.loadButton(element)
        this.saveData(element, 'reduct')
    }

    loadButton(element) {
        const loadButton = element.querySelector('#uploadButton');
        const fileInput = element.querySelector('#imageUpload');
        const imageContainer = element.querySelector('#imageContainer');
        loadButton.addEventListener('click', () => {
            console.log('Клик по кнопке загрузки');
            fileInput.click();
        });
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imageContainer.style.backgroundImage = `url(${e.target.result})`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    saveData(element, reduct) {
        const mess_validation = element.querySelector('.mess_validation');
        const saveButton = element.querySelector('.save_params');
        const fileInput = element.querySelector('#imageUpload');
        saveButton.addEventListener('click', async () => {
            const isValid = Helpers.validationModelTyres(element, mess_validation)
            if (!isValid) {
                Helpers.viewRemark(mess_validation, 'red', 'Заполните все поля!');
                return; // Прерываем выполнение, если есть ошибки
            }
            const formData = new FormData();
            formData.append('type_tire', element.querySelector('#type_tire').value);
            formData.append('marka', element.querySelector('#marka').value);
            formData.append('model', element.querySelector('#model').value);
            formData.append('type_tyres', element.querySelector('#type_tyres').value);
            formData.append('radius', element.querySelector('#radius').value);
            formData.append('profil', element.querySelector('#profil').value);
            formData.append('width', element.querySelector('#width').value);
            formData.append('sezon', element.querySelector('#sezon').value);
            formData.append('index_speed', element.querySelector('#index_speed').value);
            formData.append('index_massa', element.querySelector('#index_massa').value);
            formData.append('reduct', reduct ? this.clickCard ? this.clickCard.uniqTyresID : null : null)
            const file = fileInput.files[0];
            if (file) {
                formData.append('image', file);
            } else if (this.clickCard && this.clickCard.imagePath) {
                formData.append('imagePath', this.clickCard.imagePath);
            }
            const res = await RequestStaticMetods.saveDataToDB(formData);
            console.log(res)
            Helpers.viewRemark(mess_validation, 'green', res)
            if (reduct) this.addCardListTyres()
        })
    }

    closeFunction(element) {
        const close = element.querySelector('.close_modal_window')
        close.addEventListener('click', () => {
            element.style.display = 'none'
            element.style.zIndex = 0
            this.pop.style.display = 'none'
        })
    }
    initEvent() {
        this.navi.forEach(e => e.addEventListener('click', this.boundNavi))
        this.add_model_tyres.addEventListener('click', this.boundModelTyresWindow)
        this.add_tyres.addEventListener('click', this.boundTyresWindow)


    }
    removeEvent() {
        this.navi.forEach(e => e.removeEventListener('click', this.boundNavi))
        this.add_model_tyres.removeEventListener('click', this.boundModelTyresWindow)
        this.add_tyres.removeEventListener('click', this.boundTyresWindow)
    }


    destroy(element, data) {
        this.removeEvent()
        this.element = element
        this.data = data
        this.init()
    }

    addTooltips() {
        new Tooltip(this.add_model_tyres, ['Создать модель колеса'])
        new Tooltip(this.add_tyres, ['Создать колесо'])
    }

    defaultDOMElements() {
        new Crafika(this.allTyres, 'sklad')
        this.updateJobField('Аналитика', 'flex', 'none', 'none', 'none');
        this.navi.forEach(e => e.classList.remove('activ_button_sklad'))
        this.navi[1].classList.add('activ_button_sklad')
        this.toggleDisplay(this.jobTyres.parentElement, 'none');
        this.toggleDisplay(this.skladTyres.parentElement, 'flex');
        this.icon_add_tyres.forEach(e => e.style.display = 'flex')
        this.clickCard = null
        this.clickCardRow = null
        this.lastClickedElement = null;

    }
    controllListAndTyres() {
        const listItemSklad = this.element.querySelectorAll('.listItemSklad')
        console.log(listItemSklad)
        listItemSklad.forEach(e => e.addEventListener('click', (event) => {
            const windowClick = this.element.querySelector('.click_row')
            if (windowClick) windowClick.classList.remove('click_row')
            const object = event.target
            this.controllActivElement(object)
            this.toggleTyresVisibility()
            if (this.lastClickedElement) this.addShema();
            if (this.dragAndDropInstance) {
                this.dragAndDropInstance.removeEventListeners(); // Удаляем старые события
            }
            this.dragAndDropInstance = new DragAndDrop(this.skladTyres, '.row_sklad', '.tyres_shema_car', this.element, this)

        }))
    }


    addShema() {
        this.modelCar = this.uniqData.find(e => e[4] === Number(this.lastClickedElement.getAttribute('rel')))
        this.container_shema.innerHTML = CreateDOMElements.createModelCar(this.modelCar, this.allTyres)
        this.container_shema.previousElementSibling.textContent = this.modelCar[0].message
        Helpers.tooltipView('tyres_shema_car', 'Остаток протектора', this.container_shema)
        new AddChartsToModel(this.allTyres, this.job_field.children[1].children[1])
    }

    controllActivElement(object) {
        if (this.lastClickedElement && this.lastClickedElement !== object) {
            this.lastClickedElement.classList.remove('clickElement');
        }
        if (object.classList.contains('clickElement')) {
            object.classList.remove('clickElement');
            this.lastClickedElement = null;
            this.updateJobField('Аналитика', 'flex', 'none', 'none', 'none');
        } else {
            object.classList.add('clickElement');
            this.lastClickedElement = object;
            this.updateJobField('Колесная схема', 'none', 'flex', 'none', 'none');
            this.changeSkaldAndJob()
        }
    }

    updateJobField(title, display0, display1, display2, display3) {
        this.job_field.children[0].textContent = title;
        this.job_field.children[1].children[0].style.display = display0;
        this.job_field.children[1].children[1].style.display = display1;
        this.job_field.children[1].children[3].style.display = display2;
        this.job_field.children[1].children[4].style.display = display3;
    }

    toggleTyresVisibility() {
        if (this.lastClickedElement) {
            [...this.jobTyres.children].forEach(e => {
                this.lastClickedElement.getAttribute('rel') === e.getAttribute('data-att') ? e.style.display = 'flex' : e.style.display = 'none'
            })
        }
        else {
            [...this.jobTyres.children].forEach(e => e.style.display = 'flex')
        }
        const jobTyres = [...this.jobTyres.children].filter(e =>
            e.style.display === 'flex'
        );
        this.instanceFind.updateRows(jobTyres)
    }

    showBody(event) {
        const element = event.target
        const activ = document.querySelector('.activ_button_sklad')
        activ.classList.remove('activ_button_sklad')
        element.classList.add('activ_button_sklad')

        if (element.classList.contains('navi_job_tyres')) {
            this.changeSkaldAndJob()
            this.toggleTyresVisibility()

        }
        else {
            this.changeJobAndSklad()
            const rowsSklad = this.skladTyres.querySelectorAll('.row_sklad')
            rowsSklad.forEach(e => e.style.display = 'flex')
            this.instanceFind.updateRows(rowsSklad)
        }
    }
    changeJobAndSklad() {
        this.toggleDisplay(this.jobTyres.parentElement, 'none');
        this.toggleDisplay(this.skladTyres.parentElement, 'flex');
        this.icon_add_tyres.forEach(e => e.style.display = 'flex')
        new Crafika(this.allTyres, 'sklad')
    }
    changeSkaldAndJob() {
        this.toggleDisplay(this.jobTyres.parentElement, 'flex');
        this.toggleDisplay(this.skladTyres.parentElement, 'none');
        this.icon_add_tyres.forEach(e => e.style.display = 'none')
        const activ = document.querySelector('.activ_button_sklad')
        activ.classList.remove('activ_button_sklad')
        this.navi[0].classList.add('activ_button_sklad')
        new Crafika(this.allTyres, 'install')
    }
    toggleDisplay(element, display) {
        element.style.display = display;
    }

    createRows() {//отрисовка строк с данными
        const rows = this.element.querySelectorAll('.row_sklad')
        if (rows) rows.forEach(e => e.remove())
        this.allTyres.forEach(el => {
            const rowHTML = ContentGeneration.tyresRow(el, this.uniqData);
            if (el.flag_status !== '0') {
                this.skladTyres.insertAdjacentHTML('beforeend', rowHTML);
            } else {
                this.jobTyres.insertAdjacentHTML('beforeend', rowHTML);
            }
        });
        this.addTooltip()
        const newRows = this.element.querySelectorAll('.row_sklad')
        new WindowCard(newRows, this)
        const rowsSklad = this.skladTyres.querySelectorAll('.row_sklad')
        this.instanceFind = new Find(this.find, rowsSklad)
    }
    async getTyres() {
        this.allTyres = await RequestStaticMetods.getAllTyres()
    }

    getUniqData(data) {
        const alldata = data.flat()
        const uniqueMap = new Map(alldata.map(item => [item[4], item]))
        const res = Array.from(uniqueMap.values());
        return res
    }

    addTooltip() {
        Helpers.tooltipView('battery', 'Остаток протектора', this.element)
        Helpers.tooltipView('fa-database', 'На складе', this.element)
        Helpers.tooltipView('fa-tools', 'В ремонте', this.element)
        Helpers.tooltipView('fa-trash', 'Утилизация', this.element)
    }

}