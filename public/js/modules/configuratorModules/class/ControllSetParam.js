import { RenderHTML } from "./RenderHTML.js"
import { viewRemark } from '../../helpersFunc.js'
import { TarirTable } from "../../configuratorModules/class/TarirTable.js"
import { ExportExceltarir } from '../../configuratorModules/class/ExportExceltarir.js'
import { RequestToBse } from "./RequestToBase.js"


export class ControllSetParam {
    constructor(stor, container, meta, id) {
        this.stor = stor
        this.container = container
        this.meta = meta
        this.id = id

        this.init()
    }

    init() {
        this.renderWindow()
        this.caseElements()
        this.validationInput([this.val_koef_ts, this.val_koef_ts_oil])
        this.flexNone()
        this.eventListener()

    }

    renderWindow() {
        console.log(this.container)
        this.container.innerHTML = RenderHTML.renderStor(this.stor, this.meta)


    }

    caseElements() {
        this.listRows = [...this.container.querySelectorAll('.item_stor')]
        this.val_koef_ts = this.container.querySelector('.val_koef_ts')
        this.val_koef_ts_oil = this.container.querySelector('.val_koef_ts_oil')
        this.buttonTarirTable = this.container.querySelectorAll('.table_tarir');
        this.excelTarirExport = this.container.querySelectorAll('.excel_tarir_export');
        this.setSaveParams = [...this.container.querySelectorAll('.set_save_param')]
    }


    validationInput(arr) {
        console.log(arr)
        arr.forEach((e, index) => e.addEventListener('keydown', (event) => {
            const key = event.key;
            const allowedKeys = index === 0 ? ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '.'] :
                ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
            if (!/^\d$/.test(key) && !allowedKeys.includes(key)) {
                event.preventDefault();
            }
        })
        )
    }

    flexNone() {
        this.listRows.forEach((e) => e.nextElementSibling.classList.add('flex_none'));
    }

    eventListener() {
        this.listRows.forEach(e => e.addEventListener('click', () => this.controllStows(e)))
        this.setSaveParams.forEach(e => e.addEventListener('click', () => this.sendConfig(e)))
        this.val_koef_ts.addEventListener('input', () => this.incorrectFormuls())
        this.buttonTarirTable.forEach(e => { e.addEventListener('click', () => { this.createTarir(e); }) })
        this.excelTarirExport.forEach(e => { e.addEventListener('click', () => { this.createExcelFile(e); }) })
    }

    incorrectFormuls() {
        const old = parseFloat(this.val_koef_ts.closest('.body_set_params').querySelector('.odometr_terminal').textContent) || 0; // Предотвращение NaN
        const news = parseFloat(this.val_koef_ts.value) || 0; // Предотвращение NaN
        const delta = parseFloat((news - old).toFixed(2)) >= 0 ? `+${parseFloat((news - old).toFixed(2))}` : parseFloat((news - old).toFixed(2));
        const inputFormula = this.val_koef_ts.closest('.body_set_params').querySelector('.val_koef')
        inputFormula.value = `(x${delta})`
    }

    controllStows(button) {
        const currentContainer = button.nextElementSibling;
        this.listRows.forEach(btn => {
            if (btn !== button) {
                const siblingContainer = btn.nextElementSibling;
                if (siblingContainer) {
                    siblingContainer.classList.add('flex_none'); // Скрываем другой контейнер
                    btn.classList.remove('activ_fon')
                    btn.classList.remove('clickStor')
                }
            }
        });

        let isVisible = !currentContainer.classList.contains('flex_none');
        currentContainer.classList.toggle('flex_none', isVisible);
        button.classList.toggle('activ_fon', !isVisible);
        button.classList.toggle('clickStor', !isVisible)
        if (!isVisible) {
            this.addValueConfigParam(button)
        }
    }
    async addValueConfigParam(button) {
        const param = button.getAttribute('rel')
        this.config = await RequestToBse.getConfigParam(this.id, param)
        if (this.config) this.addFieldsValue(button)
    }

    addFieldsValue(button) {
        console.log(this.config)
        //  console.log(fieldFormula)
        const fieldFormula = button.nextElementSibling.querySelector('.val_koef')
        const fieldOdometrTS = button.nextElementSibling.querySelector('.val_koef_ts')
        const fieldOdometrTSOil = button.nextElementSibling.querySelector('.val_koef_ts_oil')
        fieldFormula.value = this.config[0].formula
        console.log(fieldOdometrTSOil)
        if (fieldOdometrTS) fieldOdometrTS.value = this.config[0].dopValue
        if (fieldOdometrTSOil) fieldOdometrTSOil.value = this.config[0].dopValue
    }
    async sendConfig(btn) {
        this.parent = btn.closest('.body_set_params')
        const bool = this.validation(btn)
        this.mess = btn.previousElementSibling
        if (!bool) {
            viewRemark(this.mess, 'red', this.parent.classList.contains('oils') ? 'Сохраните тарировочную таблицу' : 'Добавьте формулу')
        }
        else {
            const tsElement = this.parent.querySelector('.val_koef_ts');
            const tsOilElement = this.parent.querySelector('.val_koef_ts_oil');
            const obj = {
                idw: this.id,
                param: btn.getAttribute('rel'),
                formula: this.parent.querySelector('.val_koef').value,
                dopValue: tsElement ? tsElement.value : (tsOilElement ? tsOilElement.value : null)
            }
            const res = await RequestToBse.setConfigParam(obj)
            viewRemark(this.mess, 'green', res)
        }

    }

    createExcelFile(el) {
        this.param = el.getAttribute('rel')
        new ExportExceltarir(this.id, this.param)
    }
    createTarir(el) {
        this.param = el.getAttribute('rel')
        new TarirTable(this.id, el, this.param)
    }

    validation(btn) {
        const value = this.parent.querySelector('.val_koef').value
        return value !== '' ? true : false

    }

    /*
    test() {
        const formula = this.modalka.querySelector('.val_koef')
        console.log(formula.value)
        const x = 14
        console.log(x)
        // Выполняем замену 'x' на значение переменной
        const formattedFormula = formula.value.replace(/x/g, x);
        console.log(formattedFormula)
        // Используем eval для оценки выражения
        const result = eval(formattedFormula);
        console.log(result)
    }*/


}