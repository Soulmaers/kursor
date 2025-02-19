

import { GetDataTime } from '../../../class/GetDataTime.js'
import { Helpers } from './Helpers.js'
import { GetDataRequests } from './GetDataRequests.js'
import { Content } from './ContentGeneration.js'
import { ControllSettingsReportsObject } from '../../settingsEventAttributesModules/class/ManagerAttributes.js'
import { ValidationStatus } from '../../settingsEventAttributesModules/class/ValidationStatus.js'
import { ChartsClass } from './chartsCompomemts/ChartsClass.js'
import { ChartsClassSecond } from './chartsCompomemts/ChartClassSecond.js'

import { stor } from '../stor/stor.js'


export class GetReports {
    constructor(interval, object, templates, container) {
        this.interval = interval,
            this.object = object,
            this.templates = templates
        this.container = container
        this.instansCharts = {}
        this.pop = document.querySelector('.popup-background')
        this.wrapSet = document.querySelector('.wrapper_set')
        this.objectVisibleSpoyler = {}
        this.init()
    }


    init() {
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
        this.vis_reports = this.container.querySelector('.wrap_visible_reports')
        this.visible_reports = this.vis_reports.querySelectorAll('.visible_reports')

    }

    evenListener() {
        this.checkInterval.addEventListener('change', () => this.timeInterval = Helpers.getTimeInterval(this.checkInterval.value))
        this.buttons[0].addEventListener('click', () => this.getReportAndCreateContent())
        this.buttons[1].addEventListener('click', () => this.startClassWiewFilters())
        this.prints[0].addEventListener('click', () => this.excelprint())
    }

    async startClassWiewFilters() {
        const objects = this.checkObjects.querySelectorAll('.object_checks')
        const objectCheked = [...objects].filter(e => e.checked)
        if (objectCheked.length !== 1) {
            return
        }
        const selectedTemplates = this.checkShablons.querySelector('option:checked');
        const typeName = stor.find(e => e.type === objectCheked[0].parentElement.getAttribute('rel'))
        this.type = typeName ? typeName.typeIndex : ''
        this.name = objectCheked[0].parentElement.getAttribute('name')
        this.id = objectCheked[0].parentElement.getAttribute('idobject')
        this.group = objectCheked[0].parentElement.getAttribute('group')
        const templates = selectedTemplates.textContent
        this.idTemplate = selectedTemplates.value
        await this.getComponents()
        this.wrapSet.innerHTML = Content.formaFilters(this.type, this.name, templates)
        this.caseElementsSecond()
        this.modalActivity(this.pop, 'flex', 2)
        console.log(this.type)
        new ControllSettingsReportsObject(this.modal, this.id, objectCheked[0].parentElement.getAttribute('rel'))
        this.hiddenBlocks()
        this.close.addEventListener('click', () => this.modalActivity(this.pop, 'none', 1))
        this.start.addEventListener('click', async () => this.reports())
    }

    caseElementsSecond() {
        this.modal = this.wrapSet.querySelector('.settings_stor')
        this.close = this.wrapSet.querySelector('.close_modal_window')
        this.start = this.wrapSet.querySelector('.short_btn')
    }
    async getComponents() {
        this.attributes = await GetDataRequests.getAttributeTemplace(Number(this.idTemplate))
    }

    hiddenBlocks() {
        const { component, graphic } = this.attributes
        this.arrayTitleComponents = Helpers.trueTitles(component)
        const blocks = this.modal.querySelectorAll('.type_navi')
        blocks.forEach(e => {
            if (!this.arrayTitleComponents.includes(e.getAttribute('rel'))) {
                e.style.display = 'none'
                e.nextElementSibling.style.display = 'none'
            }

        })
    }
    modalActivity(pop, flex, num) {
        this.wrapSet.children[0].style.display = `${flex}`;
        this.modal.style.display = `${flex}`;
        pop.style.display = `${flex}`
        pop.style.zIndex = num;
    }

    async reports() {
        this.webpackObjectsSettings()
        await this.getReportAndCreateContent(this.set)
        this.createCalendar()
        this.modalActivity(this.pop, 'none', 1)

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
                    const numberOfResults = currentRes[0].result.length;
                    if (numberOfResults.legth !== 0) {
                        const body = Array.from({ length: numberOfResults }, (_, index) =>
                            currentRes.map(e =>
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

    async getReportAndCreateContent(sett) {
        const objects = this.checkObjects.querySelectorAll('.object_checks')
        const objectCheked = [...objects].filter(e => e.checked)
        this.objects = objectCheked.map(el => {
            return ({
                data: this.timeInterval,
                idObject: el.parentElement.getAttribute('idobject'),
                idTemplates: this.checkShablons.value,
                objectName: el.parentElement.getAttribute('name'),
                groupName: el.parentElement.getAttribute('group'),
                typeIndex: el.parentElement.getAttribute('rel')
            })
        })
        if (this.objects.length === 0) {
            Helpers.viewRemark(this.mess, 'red', 'Выберите все параметры отчета')
            return
        }
        this.objectVisibleSpoyler = {}
        await this.getStrukturaReports(sett)
        this.createCalendar()
    }

    async getStrukturaReports(sett) {
        this.titleReports.innerHTML = `<div class="loaders_report" style="display:flex"> <div class="loaders-globe-report"></div></div>`
        this.data = await GetDataRequests.getReport(this.objects, sett)
        this.analysisComponents()
        this.createListTitleReports(this.arrayStruktura)
        if (this.objects.length > 1) this.vis_reports.style.display = 'flex'
    }
    async createCalendar() {
        const calendar = this.interval.nextElementSibling.querySelector('.input_data')
        const id = `#${calendar.id}`
        const getTime = new GetDataTime()
        this.timeInterval = await getTime.getTimeInterval(calendar, id)
        this.timeInterval[1] += 86399
    }

    sorting() {
        this.data.sort((a, b) => b.statistic['Статистика'][0].result > a.statistic['Статистика'][0].result)
    }
    analysisComponents() {
        this.arrayStruktura = [this.data[0].statistic, this.data[0].component, this.data[0].graphic]
    }


    createListTitleReports() {
        this.titleReports.innerHTML = Content.renderTitlesReport(this.arrayStruktura)
        this.activeTitleReports = this.container.querySelector('.activeTitleReports')
        this.createStatsTable()
        this.eventListenetTitleReports()
    }

    eventListenetTitleReports() {
        this.titleNameReports = this.container.querySelectorAll('.titleNameReport')
        this.spoyler = this.container.querySelectorAll('.spoyler_report')
        this.titleNameReports.forEach(el => el.addEventListener('click', () => this.createMetaTable(el)))
        this.spoyler.forEach(el => el.addEventListener('click', () => this.controllStows(el)))
    }

    createMetaTable(el) {
        const idElement = el.id
        Helpers.ToggleClassElements(this.titleNameReports, el)
        this.activeTitleReports = this.container.querySelector('.activeTitleReports')
        if (idElement === 'Статистика') {
            this.createStatsTable()
        }
        else if (el.parentElement.id === 'components') {
            const trueAttributes = this.data.map(e => Helpers.trueAttributes(e.component[el.textContent]))
            this.reports_module.innerHTML = Content.renderComponentsReport(trueAttributes, this.statistics, this.activeTitleReports.id, this.objectVisibleSpoyler);
            this.visible_process()

        }
        else {
            this.reports_module.innerHTML = Content.renderChartsContent(this.data, this.statistics, el.textContent, this.activeTitleReports.id, this.objectVisibleSpoyler);
            this.createCharts(el.textContent)
            this.fullButtons = this.container.querySelectorAll('.full_screen')
            this.fullButtons.forEach(e => e.addEventListener('click', () => this.fullScreen(e)))
            this.visible_process()
        }

    }

    visible_process() {
        this.swich = this.container.querySelectorAll('.swich')
        this.swich.forEach(e => e.addEventListener('click', () => {
            Helpers.toggleWiewList(e, 'vis')
            const boolean = e.classList.contains('toggleClass')
            const key = e.nextElementSibling.textContent;
            this.buildObject(key, boolean)
        }))


        this.visible_reports.forEach((e, index) => {
            e.addEventListener('click', () => {
                index === 0 ? (Helpers.visible_all_objects(this.swich, '-', 'flex')) :
                    (Helpers.visible_all_objects(this.swich, '+', 'none'))
                this.statistics.forEach((e, index) => {
                    const name = e[1].result
                    const boolean = this.swich[index].classList.contains('toggleClass')
                    this.buildObject(name, boolean)
                })
            })
        })
    }

    buildObject(name, boolean) {
        if (!this.objectVisibleSpoyler[name]) {
            this.objectVisibleSpoyler[name] = {};
        }
        this.objectVisibleSpoyler[name][this.activeTitleReports.id] = boolean;
    }
    fullScreen(e) {
        const svg = e.parentElement.nextElementSibling
        if (svg.requestFullscreen) {
            svg.requestFullscreen();
        } else if (svg.webkitRequestFullscreen) { // Safari
            svg.webkitRequestFullscreen();
        } else if (svg.msRequestFullscreen) { // IE11
            svg.msRequestFullscreen();
        }
    }
    createCharts(types) {
        this.data.forEach((el, index) => {
            const chartContainer = document.getElementById(`${types}${index}`);
            if (chartContainer) { // Проверяем, что элемент существует
                if (types !== 'СКДШ' && types !== 'Моточасы') {
                    if (el.graphic[types][0].result) {
                        this.instansCharts[`${types}${index}`] = new ChartsClass(el.graphic[types], chartContainer);
                    }
                }
                else {
                    this.instansCharts[`${types}${index}`] = new ChartsClassSecond(el.graphic[types], chartContainer, types);
                }

            }

        });

    }
    createStatsTable() {
        this.statistics = this.data.map(el => el.statistic['Статистика'].filter(e => e.checked))
        this.reports_module.innerHTML = Content.renderTableStatic(this.statistics, this.activeTitleReports.id, this.objectVisibleSpoyler)
        this.visible_process()
    }


    controllStows(button) {
        this.activeTitleReports.classList.remove('activeTitleReports')
        const currentContainer = button.nextElementSibling;
        this.spoyler.forEach(btn => {
            if (btn !== button) {
                const siblingContainer = btn.nextElementSibling;
                if (siblingContainer) {
                    siblingContainer.classList.add('flex_none'); // Скрываем другой контейнер
                    btn.classList.remove('activ_fon')
                }
            }
        });
        let isVisible = !currentContainer.classList.contains('flex_none');
        // Управление видимостью текущего контейнера
        currentContainer.classList.toggle('flex_none', isVisible);
        button.classList.toggle('activ_fon', !isVisible);
    }


    async webpackObjectsSettings() {
        const distanceMin = document.querySelector('#min_distance').nextElementSibling.nextElementSibling.value
        const distanceMax = document.querySelector('#max_distance').nextElementSibling.nextElementSibling.value
        const mileageMin = document.querySelector('#min_mileage').nextElementSibling.nextElementSibling.value
        const mileageMax = document.querySelector('#max_mileage').nextElementSibling.nextElementSibling.value
        const minDistanceProstoy = document.querySelector('#min_distance_prostoy').nextElementSibling.nextElementSibling.value
        const minDurationParking = document.querySelector('#min_duration_parking').nextElementSibling.nextElementSibling.value
        const minDurationStop = document.querySelector('#min_duration_stop').nextElementSibling.nextElementSibling.value
        const minDurationMoto = document.querySelector('#min_duration_moto').nextElementSibling.nextElementSibling.value
        const timeRefillValue = document.querySelector('#min_diration_refill').nextElementSibling.nextElementSibling.value
        const timeDrainValue = document.querySelector('#min_diration_drain').nextElementSibling.nextElementSibling.value
        const volumeRefillValue = document.querySelector('#min_value_refill').nextElementSibling.nextElementSibling.value
        const volumeDrainValue = document.querySelector('#min_value_drain').nextElementSibling.nextElementSibling.value

        const dat = document.querySelector('#datchik_ugla')
        const angleSensorElement = document.querySelector('#angleSensor')
        const attachmentsSensorElement = document.querySelector('#attachmentsSensor')

        this.set = {
            idw: this.idx,
            object: JSON.stringify({
                'Топливо': {
                    duration: {
                        timeRefill: timeRefillValue,
                        timeDrain: timeDrainValue
                    },
                    volume: {
                        volumeRefill: volumeRefillValue,
                        volumeDrain: volumeDrainValue
                    }
                },
                'Поездки': {
                    duration:
                    {
                        minDuration: distanceMin,
                        maxDuration: distanceMax
                    },
                    mileage: {
                        minMileage: mileageMin,
                        maxMileage: mileageMax
                    }
                },
                'Стоянки': { minDuration: minDurationParking },
                'Остановки': { minDuration: minDurationStop },
                'Моточасы': { minDuration: minDurationMoto },
                'Простои на холостом ходу': {
                    minDuration: minDistanceProstoy,
                    ...(dat ? {
                        angleSensorSettings: {
                            minValue: dat.parentElement.querySelectorAll('.porog_value')[0]?.value || null,
                            maxValue: dat.parentElement.querySelectorAll('.porog_value')[1]?.value || null
                        }
                    } : {

                        angleSensor: angleSensorElement?.checked || false,
                        attachmentsSensor: attachmentsSensorElement?.checked || false
                    })
                },
                'Техническое обслуживание': null
            })
        }
        if (Object.values(ValidationStatus.status).some(value => value === false)) {
            Helpers.viewRemark(this.mess, 'red', 'Введите корректно параметры настроек')
            return false
        }
        return true
    }
}