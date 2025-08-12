

import { GetDataTime } from '../../../class/GetDataTime.js'
import { Helpers } from './Helpers.js'
import { GetDataRequests } from './GetDataRequests.js'
import { Content } from './ContentGeneration.js'
import { ControllSettingsReportsObject } from '../../settingsEventAttributesModules/class/ManagerAttributes.js'
import { ValidationStatus } from '../../settingsEventAttributesModules/class/ValidationStatus.js'
import { ChartsClass } from './chartsCompomemts/ChartsClass.js'
import { ChartMileage } from './chartsCompomemts/ChartMileage.js'
import { ChartsClassSecond } from './chartsCompomemts/ChartClassSecond.js'
import { ChartPressureClass } from './chartsCompomemts/ChartPressureClass.js'
import { ChartCondition } from './chartsCompomemts/ChartCondition.js'
import { stor } from '../stor/stor.js'


export class GetReports {
    constructor(interval, object, templates, container, thisMap) {
        this.instanceMap = thisMap
        this.interval = interval,
            this.object = object,
            this.templates = templates
        this.container = container
        this.instansCharts = {}
        this.pop = document.querySelector('.popup-background')
        this.wrapSet = document.querySelector('.wrapper_set')
        this.objectVisibleSpoyler = {}
        this.flag = true
        this.init()
    }


    init() {
        this.timeInterval = Helpers.getTimeInterval('Выбранный интервал')
        this.caseElements()
        this.createCalendar()
        this.evenListener()
    }
    caseElements() {
        this.button = this.container.querySelector('.btm_formStart')
        this.input = this.container.querySelector('.input_data')
        this.checkInterval = this.interval.querySelector('.toggle_reports')
        this.checkObjects = this.object.querySelector('.toggle_reports')
        this.checkShablons = this.templates.querySelector('.toggle_reports')
        this.titleReports = this.container.querySelector('.list_reports')
        this.reports_module = this.container.querySelector('.wrapper_reports')
        this.legend_container = this.container.querySelector('.legend_container')

        this.mess = this.container.querySelector('.inform')
        this.loaders = document.querySelector('.loaders_report')
        this.wrapper_file = this.container.querySelector('.wrapper_file')
        this.prints = this.container.querySelectorAll('.icon_print')
        this.vis_reports = this.container.querySelector('.wrap_visible_reports')
        this.visible_reports = this.vis_reports.querySelectorAll('.visible_reports')
        this.window_choice_date = this.container.querySelector('.window_choice_date')
        this.fieldsData = this.container.querySelectorAll('.field_data')
        this.fieldsTime = this.container.querySelectorAll('.field_time')

    }


    startValueData() {
        const data = Math.floor(new Date().getTime() / 1000)
        const dataTime = Helpers.processConvertData(data)
        this.fieldsData.forEach((e => e.value = dataTime))
    }

    evenListener() {
        this.checkInterval.addEventListener('change', () => {
            if (this.checkInterval.value === 'Выбранный интервал') {
                this.fieldsTime[0].value = '00:00'
                this.fieldsTime[1].value = '23:59'
                this.createCalendar()
                this.window_choice_date.style.display = 'flex'
            }
            else {
                this.window_choice_date.style.display = 'none'
            }
            this.timeInterval = Helpers.getTimeInterval(this.checkInterval.value)
        })
        this.button.addEventListener('click', () => this.getReportAndCreateContent())
        //   this.buttons[1].addEventListener('click', () => this.startClassWiewFilters())
        this.prints[0].addEventListener('click', () => this.excelprint())
        this.prints[1].addEventListener('click', () => this.PDFprint())
        this.fieldsTime.forEach(e => e.addEventListener('input', () => {
            const selectionStart = e.selectionStart;
            const prefix = selectionStart <= 2 ? 'hours' : null;
            Helpers.validateTime(e, prefix)
        }));


        this.fieldsTime.forEach(e => e.addEventListener('click', () => {
            const selectionStart = e.selectionStart;
            if (selectionStart <= 2) {
                e.setSelectionRange(0, 2); // Выделяем часы
            } else {
                e.setSelectionRange(3, 5); // Выделяем минуты
            }
        }));


    }

    caseElementsSecond() {
        this.modal = this.wrapSet.querySelector('.settings_stor')
        this.close = this.wrapSet.querySelector('.close_modal_window')
        this.start = this.wrapSet.querySelector('.short_btn')
    }
    //  async getComponents() {
    // this.attributes = await GetDataRequests.getAttributeTemplace(Number(this.idTemplate))
    // }

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

        //  this.createCalendar()
        // this.modalActivity(this.pop, 'none', 1)

    }

    async PDFprint() {
        console.log(this.arrayStruktura)
        const globalObject = this.arrayStruktura

        const selectedText = this.checkShablons.options[this.checkShablons.selectedIndex].textContent;

        console.log(this.data)
        const nameObjects = this.data.map(e => e.statistic['Статистика'][1].result)
        console.log(globalObject)
        console.log(selectedText)
        console.log(nameObjects)
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ globalObject, selectedText, nameObjects })
        }
        const resfile = await fetch('/api/fileDown', params)
        const blob = await resfile.blob()
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `report.pdf`
        link.click()


    }

    getSvgAsImage(svgElementId, callback) {
        const svg = document.getElementById(svgElementId);

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);

        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const image = new Image();
        image.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;

            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);

            const base64 = canvas.toDataURL('image/png');
            callback(base64);

            URL.revokeObjectURL(url);
        };
        image.src = url;
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
        const oildTimeInterval = [...this.timeInterval]
        if (this.checkInterval.value === 'Выбранный интервал') {

            this.calcTimeInterval() //приводим введенные минуты и часы в секунды и добавляем к времнеи юникс
        }

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
        if (this.checkInterval.value === 'Выбранный интервал') {
            console.log(oildTimeInterval)
            this.timeInterval = oildTimeInterval
            // this.calcTimeInterval()
            console.log(this.timeInterval)
        }
        console.log(this.wrapper_file)
        this.wrapper_file.style.display = 'flex'
    }
    calcTimeInterval() {
        //    console.log(this.timeInterval)
        this.timeInterval.forEach((e, index) => {
            let timeParts = this.fieldsTime[index].value.split(':');
            let hours = parseInt(timeParts[0], 10); // Получаем часы
            let minutes = parseInt(timeParts[1], 10); // Получаем минуты
            // Переводим часы и минуты в секунды
            let totalSeconds = (hours * 3600) + (minutes * 60);
            this.timeInterval[index] = e + totalSeconds;
        });
    }
    async getStrukturaReports(sett) {
        console.log(this.titleReports.parentElement)
        this.titleReports.innerHTML = `<div class="loaders_report" style="display:flex"> <div class="loaders-globe-report"></div></div>`
        this.titleReports.parentElement.style.padding = '0'
        this.titleReports.style.padding = '0'
        this.data = await GetDataRequests.getReport(this.objects, sett)
        this.analysisComponents()
        this.createListTitleReports(this.arrayStruktura)
        this.titleReports.parentElement.style.paddingTop = '20px'
        if (this.objects.length > 1) this.vis_reports.style.display = 'flex'
    }
    async createCalendar() {
        const arrayId = [...this.fieldsData].map(e => e.id);

        arrayId.forEach(((inputId, index) => {
            const getDataTime = new GetDataTime(); // Создаем новый экземпляр для каждого input

            // Функция для обновления this.timeInterval
            const updateTimeInterval = (newTime) => {
                console.log(newTime)
                this.timeInterval[index] = newTime;
                console.log("this.timeInterval обновлен:", this.timeInterval);
            };

            getDataTime.initDatePickers(inputId, updateTimeInterval, this.timeInterval[index]);
        }));
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
        this.swich_reports_title = this.container.querySelectorAll('.swich_reports_title')
        this.titleNameReports.forEach(el => el.addEventListener('click', () => this.createMetaTable(el)))
        this.swich_reports_title.forEach(el => el.addEventListener('click', () => this.toggleListSubMenu(el)))
    }

    toggleListSubMenu(element) {
        element.classList.toggle('toggleClass')
        if (element.classList.contains('toggleClass')) {
            element.textContent = '+'
            element.parentElement.nextElementSibling.style.display = 'none'
        } else {
            element.textContent = '-'
            element.parentElement.nextElementSibling.style.display = 'flex'
        }
    }
    createMetaTable(el) {
        this.legend_container.style.display = 'none'
        const spoyler = this.container.querySelector('.activ_fon')
        spoyler.classList.remove('activ_fon')
        const oldActivBTN = this.container.querySelector('.activeTitleReports')
        Helpers.ToggleClassElements(this.titleNameReports, el)
        this.activeTitleReports = this.container.querySelector('.activeTitleReports')
        const idElement = el.id
        if (idElement === 'Статистика') {
            el.classList.add('activ_fon')
            this.createStatsTable()
        }
        else if (el.parentElement.id === 'components') {
            el.parentElement.previousElementSibling.lastElementChild.classList.add('activ_fon')
            const trueAttributes = this.data.map(e => Helpers.trueAttributes(e.component[el.textContent]))
            this.reports_module.innerHTML = Content.renderComponentsReport(trueAttributes, this.statistics, this.activeTitleReports.id, this.objectVisibleSpoyler);
            this.visible_process()
            const geo = this.container.querySelectorAll('.pointer')
            console.log(geo)
            this.processMapClass() //логика работы с картой -очистка поли и маркеров. прослушка поинтеров
        }
        else {

            el.parentElement.previousElementSibling.lastElementChild.classList.add('activ_fon')
            const trueAttributes = this.data.map(e => Helpers.trueAttributes(e.graphic[el.textContent]))
            this.reports_module.innerHTML = Content.renderChartsContent(this.data, this.statistics, el.textContent, this.activeTitleReports.id, this.objectVisibleSpoyler);
            this.legend_container.innerHTML = Content.renderChartsLegend(trueAttributes, this.statistics, el.textContent, this.activeTitleReports.id, this.objectVisibleSpoyler, this.legend_container);
            this.createCharts(el.textContent)
            this.controllLegend()
            this.fullButtons = this.container.querySelectorAll('.full_screen')
            this.fullButtons.forEach(e => e.addEventListener('click', () => this.fullScreen(e)))
            this.visible_process()
        }

        if (oldActivBTN.id === idElement) {
            this.toggleDoubleClick(el)
        }
        else {
            oldActivBTN.classList.remove('flag_two_controll')
        }


    }

    toggleDoubleClick(el) {
        if (!el.classList.contains('flag_two_controll')) {
            console.log(this.data.length)
            this.data.length === 1 ? Helpers.visible_all_objects(this.swich, '+', 'none') :
                Helpers.visible_all_objects(this.swich, '-', 'flex')
            el.classList.add('flag_two_controll')
        }
        else {
            this.data.length === 1 ? Helpers.visible_all_objects(this.swich, '-', 'flex') :
                Helpers.visible_all_objects(this.swich, '+', 'none')
            el.classList.remove('flag_two_controll')
        }
    }
    controllLegend() {
        this.uniqum_legend = this.container.querySelectorAll('.uniqum_legend')
        if (this.uniqum_legend.length !== 0) {
            this.uniqum_legend.forEach(e => {
                e.lastElementChild.addEventListener('click', () => {
                    e.lastElementChild.classList.toggle('disabled_icon')
                    const attribute = e.lastElementChild.getAttribute('rel')
                    const elements = document.querySelectorAll(`[type="${attribute}"]`);
                    elements.forEach(el => {
                        el.style.display = e.lastElementChild.classList.contains('disabled_icon') ? 'none' : 'block'
                    })
                })
            })
        }

    }

    processMapClass() {
        this.instanceMap.clearMarker()
        this.instanceMap.clearPoly()

        if (this.data.length === 1 && this.activeTitleReports.id === 'componentsПоездки') this.createAllTrek()
        this.clickGeoVieMarkerMap()

    }
    createAllTrek() {
        console.log(this.data[0].statistic['Статистика'][1])
        this.allArrayGeo = this.data[0].statistic['Статистика'][1].geoTrek || null
        console.log(this.allArrayGeo)
        if (!this.allArrayGeo || this.allArrayGeo.length === 0) return
        const allTrek = this.allArrayGeo.map(e => [e[0], e[1]])
        this.instanceMap.createPolyLine(allTrek, 'rgb(0, 0, 204)', 2)
    }

    clickGeoVieMarkerMap() {
        this.pointer = this.container.querySelectorAll('.pointer')
        console.log(this.pointer)
        if (this.pointer.length === 0) return
        this.pointer.forEach(e => e.addEventListener('click', () => {
            const coordinates = e.getAttribute('rel').split(',');
            const colorMarker = e.getAttribute('color_marker');
            const typeIcon = e.getAttribute('type');
            const lat = parseFloat(coordinates[0].trim());
            const lon = parseFloat(coordinates[1].trim());
            this.instanceMap.createMarker([lat, lon], colorMarker, typeIcon)
        }))


        this.icon_trek = this.container.querySelectorAll('.icon_trek')
        this.icon_trek.forEach(e => e.addEventListener('click', (event) => {
            event.stopPropagation();
            const isCurrentlyGreen = e.classList.contains('green_apple');
            this.icon_trek.forEach(el => el.classList.remove('green_apple'))
            if (!isCurrentlyGreen) {
                e.classList.add('green_apple');
                const time = e.getAttribute('rel').split(',')


                if (this.data.length > 1) {
                    const nameObject = e.getAttribute('data-att')
                    const object = this.data.find(e => e.statistic['Статистика'][1].result === nameObject)
                    this.allArrayGeo = object.statistic['Статистика'][1].geoTrek || null
                    if (!this.allArrayGeo) return
                    const allTrek = this.allArrayGeo.map(e => [e[0], e[1]])
                    this.instanceMap.createPolyLine(allTrek, 'rgb(0, 0, 204)', 2)
                }

                const trek = this.allArrayGeo.filter(e => {
                    const startTime = Number(time[0]);
                    const endTime = Number(time[1]);
                    const elementTime = Number(e[2].time);
                    return startTime <= elementTime && endTime >= elementTime;
                }).map(el => [el[0], el[1]]);


                this.instanceMap.createPolyLine(trek, '#DC381F', 6, true)
            } else {
                this.instanceMap.createPolyLine([], 'red', 4, true)
            }

        }))
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
        this.swichSub = this.container.querySelectorAll('.swich_sub')
        this.swichSub.forEach(e => e.addEventListener('click', () => {
            Helpers.toggleTrList(e)
        }))
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
                if (types === 'Учёт топлива') {
                    if (el.graphic[types][0].result) {
                        this.instansCharts[`${types}${index}`] = new ChartsClass(el.graphic[types], chartContainer, this.data.length);
                    }
                }
                else if (types === 'Поездки по дням') {
                    if (el.graphic[types][0].result) {
                        this.instansCharts[`${types}${index}`] = new ChartMileage(el.graphic[types], chartContainer, this.data.length);
                    }
                }
                else if (types === 'СКДШ') {
                    if (el.graphic[types][0].result) {
                        this.instansCharts[`${types}${index}`] = new ChartPressureClass(el.graphic[types], chartContainer, this.data.length);
                    }
                }
                else if (types === 'Моточасы') {
                    console.log(chartContainer.nextElementSibling)
                    console.log(index)
                    this.instansCharts[`${types}${index}`] = new ChartsClassSecond(el.graphic[types], chartContainer, types, this.timeInterval, index);
                    el.graphic[types][0].condition.forEach(e => new ChartCondition(e, chartContainer.nextElementSibling, types, this.timeInterval, index));
                }



            }

        });

    }
    createStatsTable() {
        this.statistics = this.data.map(el => el.statistic['Статистика'].filter(e => e.checked))
        this.reports_module.innerHTML = Content.renderTableStatic(this.statistics, this.activeTitleReports.id, this.objectVisibleSpoyler)
        this.visible_process()
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