import { ContentGeneration } from '../html/content.js'
import { RequestStaticMetods } from './RequestStaticMetods.js'
import { Helpers } from './Helpers.js'
import { Tooltip } from '../../../class/Tooltip.js'
export class WindowCard {
    constructor(rows, instance) {
        this.rows = rows
        this.instanceSkladTyres = instance
        this.activeRow = null
        this.cardWindow = this.instanceSkladTyres.element.querySelector('.card_tyres_window')
        this.card = this.cardWindow.children[0]
        this.protektor = []
        this.pop = document.querySelector('.popup-background');
        this.init()
    }


    init() {
        this.validate()
        this.rows.forEach(row => {
            row.addEventListener('click', () => this.handleCardClick(row));
        });
    }

    validate() {
        if (this.instanceSkladTyres.clickCardRow) {
            this.activeRow = [...this.rows].find(el => el.getAttribute('rel') === this.instanceSkladTyres.clickCardRow)
            this.activeRow.classList.add('click_row');
        }
    }
    async handleCardClick(row) {
        const wasActive = row.classList.contains('click_row');
        this.resetActiveRow();
        if (!wasActive) {
            this.setActiveRow(row);
            this.methods(row);
            this.instanceSkladTyres.lastClickedElement = null
            // this.instanceSkladTyres.toggleTyresVisibility();
        } else {
            this.instanceSkladTyres.defaultDOMElements();

            this.cardWindow.style.display = 'none';
        }
    }

    resetActiveRow() {
        if (this.activeRow) {
            this.activeRow.classList.remove('click_row');
        }
        this.activeRow = null;
    }

    setActiveRow(row) {
        row.classList.add('click_row');
        this.activeRow = row;
    }

    methods(row) {
        this.renderCard(row);
        this.wiewDataTyres(row);
        if (this.targetWheel.flag_status !== '0') this.controllStatusTyres(row)
        this.saveReduct(row)
    }
    controllStatusTyres(row) {
        const icon = this.card.querySelector('.position_icon');
        const flag_status = icon.getAttribute('rel');
        icon.addEventListener('click', () => {
            this.showModal(flag_status);
            this.setupModalHandlers(row, flag_status);
        });
    }

    showModal(flag_status) {
        this.pop.style.display = 'block';
        this.cardWindow.closest('.globalSklad').insertAdjacentHTML('beforeend', ContentGeneration.htmlContantModal(flag_status));
        this.modal = this.cardWindow.closest('.globalSklad').querySelector('.modal_podtver');
    }

    setupModalHandlers(row) {
        const okButton = this.modal.querySelector('.ok_podtver');
        const cancelButton = this.modal.querySelector('.cancel_podtver');
        const actionSelect = this.modal.querySelector('#actionSelect');
        const comments = this.modal.querySelector('.comm');
        cancelButton.addEventListener('click', () => this.closeModal());
        okButton.addEventListener('click', async () => {
            if (Helpers.validateSelection(actionSelect)) {
                await this.updateStatus(row, actionSelect.value, comments.value);
            } else {
                return;
            }
            this.closeModal();
        });
    }

    async updateStatus(row, flag_status, comments) {
        const obj = this.getObject();
        obj.flag_status = flag_status;
        obj.comment = comments
        await RequestStaticMetods.updateWheel(obj);
        //await RequestStaticMetods.saveDataHistoryToDBTyres(obj)
        this.instanceSkladTyres.clickCardRow = row.getAttribute('rel');
        await this.instanceSkladTyres.getTyres();
        this.instanceSkladTyres.createRows();
        this.methods(row);
    }
    closeModal() {
        this.pop.style.display = 'none';
        this.modal.remove();
    }
    saveReduct(row) {
        const childElement = Array.from(row.querySelectorAll('.tyres_shema'))
            .find(element => element.getAttribute('rel') !== null && element.getAttribute('rel').trim() !== '');
        const save = this.cardWindow.querySelector('.save_params')
        const mess = this.cardWindow.querySelector('.mess_validation')
        save.addEventListener('click', async () => {
            const obj = this.getObject()
            const message = await RequestStaticMetods.updateWheel(obj)

            Helpers.viewRemark(mess, 'green', message)
            this.instanceSkladTyres.clickCardRow = row.getAttribute('rel')
            if (childElement) {
                const updateFilterTable = await RequestStaticMetods.updateFilterTable(row.getAttribute('data-att'), obj.id_bitrix_wiew, row.getAttribute('rel'), childElement.getAttribute('rel'))
            }
            await this.instanceSkladTyres.getTyres()
            this.instanceSkladTyres.createRows()
        })
    }

    getObject() {
        const fieldsParams = this.cardWindow.querySelector('.input-fields_params').querySelectorAll('.styled-input')
        const obj = {}
        fieldsParams.forEach(el => obj[el.getAttribute('id')] = el.value);
        obj.idw_tyres = this.activeRow.getAttribute('rel')
        obj.login = document.querySelectorAll('.log')[1].textContent
        obj.dateZamer = !this.compareProtektor(obj) ? Helpers.getCurrentDate() : this.targetWheel.dateZamer
        obj.flag_status = this.targetWheel.flag_status
        obj.mileage = this.probeg.mileage
        return obj
    }
    compareProtektor(obj) {
        const n = [obj.N1, obj.N2, obj.N3, obj.N4, obj.ostatok];
        return this.protektor.every((value, index) => {
            return n[index] === value;
        });
    }

    async wiewDataTyres(row) {
        const idw_tyres = row.getAttribute('rel')
        const targetWheel = this.instanceSkladTyres.allTyres.find(el => el.idw_tyres === idw_tyres)
        this.targetWheel = targetWheel
        const styleFon = targetWheel.imagePath ? `url('../../../..${targetWheel.imagePath}')` : `url('../../../../image/zeto_tyres.png')`;
        this.cardWindow.querySelector('#imageContainer_wiew').style.backgroundImage = styleFon;
        const fields = [
            { id: '#type_tire_wiew', value: targetWheel.type_tire },
            { id: '#marka_wiew', value: targetWheel.marka },
            { id: '#model_wiew', value: targetWheel.model },
            { id: '#type_tyres_wiew', value: targetWheel.type_tyres },
            { id: '#radius_wiew', value: targetWheel.radius },
            { id: '#profil_wiew', value: targetWheel.profil },
            { id: '#width_wiew', value: targetWheel.width },
            { id: '#sezon_wiew', value: targetWheel.sezon },
            { id: '#index_speed_wiew', value: targetWheel.index_speed },
            { id: '#index_massa_wiew', value: targetWheel.index_massa },
            { id: '#probeg_passport_wiew', value: targetWheel.probeg_passport },
            { id: '#protektor_passport_wiew', value: targetWheel.protektor_passport },
            { id: '#id_bitrix_wiew', value: targetWheel.id_bitrix },
            { id: '#psi_wiew', value: targetWheel.psi },
            { id: '#bar_wiew', value: targetWheel.bar },
            { id: '#probeg_now_wiew', value: targetWheel.probeg_now },
            { id: '#probeg_last_wiew', value: targetWheel.probeg_last },
            { id: '#N1', value: targetWheel.N1 },
            { id: '#N2', value: targetWheel.N2 },
            { id: '#N3', value: targetWheel.N3 },
            { id: '#N4', value: targetWheel.N4 },
            { id: '#ostatok', value: targetWheel.ostatok },
            { id: '#rfid_cod', value: targetWheel.rfid },
            { id: '#price_tyres', value: targetWheel.price },
            { id: '#comment', value: targetWheel.comments }
        ];
        this.protektor = [targetWheel.N1, targetWheel.N2, targetWheel.N3, targetWheel.N4, targetWheel.ostatok]
        fields.forEach(field => {
            const fieldElement = this.cardWindow.querySelector(field.id);
            if (fieldElement) {
                fieldElement.tagName.toLowerCase() === 'input' ? fieldElement.value = field.value :
                    fieldElement.textContent = field.value;
            }
        });
        this.probeg = await Helpers.mileageCalc(targetWheel.mileage, targetWheel.probeg_now, targetWheel.idObject)
        console.log(this.cardWindow)
        this.cardWindow.querySelector('#probeg_now_wiew').value = this.probeg.mileageTyres
        this.instanceSkladTyres.valueCalculate(this.cardWindow)

    }
    renderCard(row) {
        const idw_tyres = row.getAttribute('rel')
        const targetWheel = this.instanceSkladTyres.allTyres.find(el => el.idw_tyres === idw_tyres)
        this.card.innerHTML = ContentGeneration.createCardTyres(targetWheel.flag_status)
        if (targetWheel.flag_status !== '0') {
            this.card.querySelector('.status_tyres').classList.add('position_icon')
            new Tooltip(this.card.querySelector('.status_tyres'), ['Изменение статуса колеса'])
        }
        this.card.querySelector('.footer_card_tyres').remove()
        const parent = this.instanceSkladTyres.element.querySelector('.body_last_container');
        Array.from(parent.children).forEach(child => {
            if (child !== this.cardWindow) {
                child.style.display = 'none';
            }
        });
        // Отображаем элемент card_tyres_window
        const cardWindow = this.cardWindow;
        cardWindow.style.display = 'flex';
        // Устанавливаем текст в header
        const header = this.instanceSkladTyres.element.querySelector('.up_name_last_container');
        if (header) {
            header.textContent = 'Основные характеристики колеса';
        }
        // Удаляем класс clickElement, если он был активен
        const clickElement = this.instanceSkladTyres.element.querySelector('.clickElement');
        if (clickElement) {
            clickElement.classList.remove('clickElement');
        }
    }
}