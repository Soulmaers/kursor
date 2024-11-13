
import { Content } from './ContentGeneration.js'
import { ComponentAndGraficControll } from './ComponentAndGraficClassControll.js'
import { Helpers } from './Helpers.js'
import { GetUpdateStruktura } from '../../../GetUpdateStruktura.js'
import { GetDataRequests } from './GetDataRequests.js'
//import { Validation } from './Validation.js'

export class NewReportTemplate {
    constructor(container, wrapReports) {
        this.container = container
        this.wrapReports = wrapReports
        this.pop = document.querySelector('.popup-background')
        this.wrapSet = document.querySelector('.wrapper_set')
        this.btnCreateReport = this.container.querySelector('.create_reports')
        this.editionTemplate = this.container.querySelector('.edition_template')
        this.deleteTemplate = this.container.querySelector('.delete_template')
        this.windows = document.querySelector('.modal_form')
        this.attributes = {
            statistic: [],
            component: {

            },
            graphic: {

            }
        }
        this.resourses = GetUpdateStruktura.resourseData
        console.log(this.resourses)
        this.init()
    }


    init() {
        this.eventListener()
    }

    caseElements() {
        this.idUser = Number(document.querySelector('.role').getAttribute('data-att'))
        this.modal = this.wrapSet.querySelector('.wrapper_template')
        this.close = this.wrapSet.querySelector('.close_wrap_template')
        this.saveAttribute = this.wrapSet.querySelector('.btn_template')
        this.addResourse = this.wrapSet.querySelector('.add_resourse')
        this.stat = this.wrapSet.querySelector('.statics_temp').querySelector('.body_checkbox_fields')
        this.component = this.wrapSet.querySelector('.components_temp').querySelector('.body_checkbox_fields')
        this.grafix = this.wrapSet.querySelector('.grafics_temp').querySelector('.body_checkbox_fields')
        this.nameTemplate = this.wrapSet.querySelector('.name_template')
        this.mess = this.wrapSet.querySelector('.valid_message')
    }

    eventListener(close) {
        if (close) {
            close.addEventListener('click', this.modalActivity.bind(this, this.pop, 'none', 1));
        }
        else {
            if (this.btnCreateReport) this.btnCreateReport.addEventListener('click', () => this.startTemplateForm(false));
            if (this.editionTemplate) this.editionTemplate.addEventListener('click', () => this.startTemplateForm(true));
            if (this.deleteTemplate) this.deleteTemplate.addEventListener('click', () => this.deleteTemplace());
        }
    }

    async deleteTemplace() {
        const idTemplate = Number(this.wrapReports[1].value);
        const mess = await GetDataRequests.deleteTemplace(idTemplate)
        console.log(mess)
        this.getTemplatesAndCreateListElements()
    }

    async startTemplateForm(isEditing) {
        this.createContent()
        this.caseElements()
        // Если это режим редактирования, используем выбранное значение
        if (isEditing) {
            this.idTemplate = Number(this.wrapReports[1].value);
            const selectElement = this.wrapReports[1]
            const nameReports = selectElement.options[selectElement.selectedIndex].textContent;
            this.idResourse = Number(selectElement.options[selectElement.selectedIndex].getAttribute('rel'))
            this.attributes = await GetDataRequests.getAttributeTemplace(this.idTemplate)
            console.log(this.attributes)

            this.setTemplates = await this.getRenderSetValue(this.idTemplate)
            this.nameTemplate.value = nameReports
            console.log(this.setTemplates)
        }
        else {
            this.nameTemplate.value = ''
            this.attributes = {
                statistic: [],
                component: {},
                graphic: {}
            }
        }

        this.controllCountResourse()
        this.modalActivity(this.pop, 'flex', 2)
        this.eventListener(this.close)
        this.addListCheckbox()
        this.save()
    }


    async getRenderSetValue() {
        this.setReports = await GetDataRequests.getReportsAttribute(Number(this.idTemplate))
        if (this.setReports.length !== 0) {
            return JSON.parse(this.setReports[0].jsonsetAttribute)
        }
        else {
            return []
        }
    }
    save() {
        this.saveAttribute.addEventListener('click', async () => {
            if (!this.validationNameTemplate()) {
                Helpers.viewRemark(this.mess, 'red', 'Укажите имя отчета')
                return
            }
            if (this.idResourse === undefined) {
                Helpers.viewRemark(this.mess, 'red', 'Добавьте отчет к ресурсу')
                return
            }
            this.object = {
                idUser: Number(this.idUser),
                idResourse: this.idResourse,
                attributes: JSON.stringify(this.instanceControll.checkboxStates),
                nameTemplate: this.nameTemplate.value,
                proreptyTamplate: 'reports'
            }

            //  this.webpackObjectsSettings()
            if (!this.idTemplate) {
                const res = await GetDataRequests.saveTemplates(this.object)
            }
            else {
                const res = await GetDataRequests.updateTemplates(this.object, this.idTemplate)
            }

            this.modalActivity(this.pop, 'none', 1)
            this.getTemplatesAndCreateListElements()
        })
    }


    async getTemplatesAndCreateListElements() {
        this.resoursesID = this.resourses.map(e => e.idResourse)
        this.templates = await GetDataRequests.getTemplates(this.resoursesID, 'reports')
        console.log(this.templates)
        if (this.templates.length === 0) return
        this.temp = this.templates.map(e => ({ id: e.uniqTemplateID, name: e.nameTemplate, idResoure: e.uniqResourseID }))
        this.wrapReports[1].innerHTML = Content.addContent(this.temp)
    }

    controllCountResourse() {
        if (this.resourses.length > 1) {
            this.addResourse.style.display = 'flex'
            this.eventSaveTemplate()
        }
        else {
            this.idResourse = this.resourses[0].idResourse
            this.addResourse.style.display = 'none'
        }
    }

    eventSaveTemplate() {
        this.windows.innerHTML = Content.renderWindowResourse(this.resourses)
        this.closeTwo = this.windows.querySelector('.close_wrap_template_two')
        this.saveResourse = this.windows.querySelector('.save_resourse')
        this.addResourse.addEventListener('click', () => { this.modalTwo('flex', 1) })
        this.closeTwo.addEventListener('click', () => { this.modalTwo('none', 2) })
        this.saveResourse.addEventListener('click', () => {
            this.idResourse = Number(document.querySelector('input[name="accountSelection"]:checked').value)
            this.modalTwo('none', 2)
        })
    }
    validationNameTemplate() {
        return this.nameTemplate.value !== ''
    }

    modalTwo(flex, num) {
        this.modal.style.zIndex = num;
        this.windows.style.display = flex

    }
    modalActivity(pop, flex, num) {
        this.modal.style.display = `${flex}`;
        pop.style.display = `${flex}`
        pop.style.zIndex = num;
    }
    createContent() {
        this.wrapSet.innerHTML = Content.addContentTemplate()

    }

    addListCheckbox() {
        this.stat.innerHTML = Content.renderContent('Статистика', '0', this.attributes.statistic['Статистика'])
        this.instanceControll = new ComponentAndGraficControll([this.stat, this.component, this.grafix], [
            {
                block: this.component, arrayButtons: ['Топливо', 'Поездки', 'Стоянки', 'Остановки', 'Моточасы', 'Простои на холостом ходу', 'Техническое обслуживание', 'СКДШ'], indexs: '1',
                stores: {
                    'Топливо': this.attributes.component['Топливо'],
                    'Поездки': this.attributes.component['Поездки'],
                    'Стоянки': this.attributes.component['Стоянки'],
                    'Остановки': this.attributes.component['Остановки'],
                    'Моточасы': this.attributes.component['Моточасы'],
                    'Простои на холостом ходу': this.attributes.component['Простои на холостом ходу'],
                    'Техническое обслуживание': this.attributes.component['Техническое обслуживание'],
                    'СКДШ': this.attributes.component['СКДШ']
                }
            },
            {
                block: this.grafix, arrayButtons: ['Топливо', 'Поездки', 'Стоянки', 'Остановки', 'Моточасы', 'Техническое обслуживание', 'СКДШ'], indexs: '2',
                stores: {
                    'Топливо': this.attributes.graphic['Топливо'],
                    'Поездки': this.attributes.graphic['Поездки'],
                    'Стоянки': this.attributes.graphic['Стоянки'],
                    'Остановки': this.attributes.graphic['Остановки'],
                    'Моточасы': this.attributes.graphic['Моточасы'],
                    'Простои на холостом ходу': this.attributes.graphic['Простои на холостом ходу'],
                    'Техническое обслуживание': this.attributes.graphic['Техническое обслуживание'],
                    'СКДШ': this.attributes.graphic['СКДШ']
                }
            }
        ], this.setTemplates);
    }
}
