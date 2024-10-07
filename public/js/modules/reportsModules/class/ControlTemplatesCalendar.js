

import { GetDataTime } from '../../../class/GetDataTime.js'
import { Helpers } from './Helpers.js'
import { GetDataRequests } from './GetDataRequests.js'
import { Content } from './ContentGeneration.js'
import { stor } from '../stor/stor.js'

export class GetReports {
    constructor(interval, object, templates, container) {
        this.interval = interval,
            this.object = object,
            this.templates = templates
        this.container = container

        this.init()
    }


    init() {
        //    console.log(this.objects)
        this.timeInterval = Helpers.getTimeInterval('Сегодня')
        this.caseElements()
        this.createCalendar()
        this.evenListener()
    }
    caseElements() {

        this.buttons = this.container.querySelectorAll('.btm_formStart')
        this.input = this.container.querySelector('.input_data')
        this.checkInterval = this.interval.querySelector('.toggle_reports')
        this.checkObjects = this.object.querySelector('.toggle_reports')
        this.checkShablons = this.templates.querySelector('.toggle_reports')
        this.titleReports = this.container.querySelector('.list_reports')
        this.reports_module = this.container.querySelector('.wrapper_reports')
        this.mess = this.container.querySelector('.inform')
        this.loaders = document.querySelector('.loaders_report')
        this.prints = this.container.querySelectorAll('.icon_print')
    }

    evenListener() {
        this.checkInterval.addEventListener('change', () => this.timeInterval = Helpers.getTimeInterval(this.checkInterval.value))
        this.buttons[0].addEventListener('click', () => { this.input.value = '' })
        this.buttons[1].addEventListener('click', () => this.getReportAndCreateContent())
        this.prints[0].addEventListener('click', () => this.excelprint())
    }


    excelprint() {
        if (!this.arrayStruktura) return;

        const selectedOption = this.checkShablons.querySelector('option:checked');
        const nameReport = selectedOption.textContent
        // Преобразование данных в удобный формат
        const res = this.arrayStruktura.reduce((acc, e) => {
            Object.keys(e).forEach(key => {
                const value = Helpers.trueAttributes(e[key]);
                if (value.length !== 0) {
                    acc[key] = acc[key] || []; // Инициализируем массив, если он еще не существует
                    acc[key].push(...value); // Добавляем атрибуты
                }
            });
            return acc;
        }, {});
        console.log(this.templates);
        const wb = XLSX.utils.book_new(); // Создание новой рабочей книги
        for (const key in res) {
            if (res.hasOwnProperty(key)) {
                const currentRes = res[key];
                const data = [];
                if (key === 'Статистика') {
                    data.push(['Название', 'Значение', 'Единицы измерения']);
                    currentRes.forEach(e => {
                        data.push([e.name, e.result, e.local]);
                    });
                    staticExel(key, data);
                } else {
                    // Заголовки
                    const headers = currentRes.map(e => e.name);
                    data.push(headers);

                    // Обработка результатов
                    console.log(currentRes[0])
                    const numberOfResults = currentRes[0].result.length;
                    console.log(numberOfResults)
                    if (numberOfResults.legth !== 0) {
                        const body = Array.from({ length: numberOfResults }, (_, index) =>
                            currentRes.map(e =>
                                //  console.log(e.result[index])
                                (Array.isArray(e.result[index]) ? e.result[index].join(',') : e.result[index])
                            )
                        );
                        data.push(...body);
                        // Создание и добавление листа в книгу
                        const ws = XLSX.utils.aoa_to_sheet(data);
                        XLSX.utils.book_append_sheet(wb, ws, key);
                        // Установка фиксированной ширины столбцов
                        const fixedWidth = 130; // Фиксированная ширина в пикселях
                        const colCount = headers.length; // Общее количество столбцов

                        ws['!cols'] = []; // Инициализация массива для ширины столбцов

                        for (let i = 0; i < colCount; i++) {
                            ws['!cols'][i] = { wpx: fixedWidth }; // Установка фиксированной ширины столбцов
                        }
                    }



                }
            }
        }

        function staticExel(key, data) {
            console.log(data);
            const ws = XLSX.utils.aoa_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, key);

            // Инициализация массива для ширины столбцов, если он не определен
            if (!ws['!cols']) {
                ws['!cols'] = [];
            }

            // Установка фиксированной ширины столбцов
            for (let i = 0; i < 3; i++) {
                ws['!cols'][i] = { wpx: 130 };
            }
        }

        // Сохранение файла
        const sheetName = new Date().toLocaleDateString(); // Имя файла - текущая дата
        XLSX.writeFile(wb, `${nameReport}.xlsx`);
    }

    async getReportAndCreateContent() {
        this.getType()
        this.bool = this.building()

        if (!this.bool) {
            console.log(this.mess)
            Helpers.viewRemark(this.mess, 'red', 'Выберите все параметры отчета')
            return
        }
        await this.getStrukturaReports()
        this.createCalendar()
    }

    building() {
        const selectedOption = this.checkObjects.querySelector('option:checked');
        this.object = {
            data: this.timeInterval,
            idObject: this.checkObjects.value,
            idTemplates: this.checkShablons.value,
            objectName: selectedOption.textContent,
            groupName: selectedOption.getAttribute('rel'),
            typeIndex: this.typeIndex
        }
        let bool = true;
        for (let key in this.object) {
            this.object[key] == null ? bool = false : null
        }
        return bool
    }



    getType() {
        const selectedOption = this.checkObjects.options[this.checkObjects.selectedIndex];
        const typeValue = stor.find(e => e.type === selectedOption.getAttribute('type'));
        console.log(typeValue)
        this.typeIndex = typeValue ? typeValue.typeIndex : ""
    }
    async getStrukturaReports() {
        console.log(this.object)
        this.titleReports.innerHTML = `<div class="loaders_report" style="display:flex"> <div class="loaders-globe-report"></div></div>`
        this.data = await GetDataRequests.getReport(this.object)
        console.log(this.data)
        this.analysisComponents()
        this.createListTitleReports(this.arrayStruktura)

    }
    async createCalendar() {
        const calendar = this.interval.nextElementSibling.querySelector('.input_data')
        const id = `#${calendar.id}`
        const getTime = new GetDataTime()
        this.timeInterval = await getTime.getTimeInterval(calendar, id)
        console.log(this.timeInterval)
    }


    analysisComponents() {
        this.arrayStruktura = [this.data.statistic, this.data.component]
        console.log(this.arrayStruktura)
        this.statistic = this.data.statistic
        this.components = this.data.component
        this.grapfics = this.data.grapfic
    }


    createListTitleReports() {
        this.titleReports.innerHTML = Content.renderTitlesReport(this.arrayStruktura)
        this.createStatsTable()
        this.eventListenetTitleReports()
    }

    eventListenetTitleReports() {
        this.titleNameReports = this.container.querySelectorAll('.titleNameReport')
        this.titleNameReports.forEach(el => el.addEventListener('click', () => this.createMetaTable(el)))

    }

    createMetaTable(el) {
        const idElement = el.id
        Helpers.ToggleClassElements(this.titleNameReports, el)
        if (idElement === 'Статистика') { this.createStatsTable() }
        else {
            this.trueAttributes = Helpers.trueAttributes(this.components[el.textContent])
            console.log(this.trueAttributes)
            this.reports_module.innerHTML = Content.renderComponentsReport(this.trueAttributes);
        }
    }


    createStatsTable() {
        const statistics = this.statistic['Статистика'].filter(e => e.checked === true).map(it => it)
        this.reports_module.innerHTML = Content.renderTableStatic(statistics)
    }


}