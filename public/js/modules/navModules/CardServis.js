

//import { DraggableContainer } from "../../class/Dragdown.js";
import { reverseGeocode, focusCorrect } from '../helpersFunc.js'
import { CloseBTNServis } from '../../class/CloseBTN.js';
import { TimeJob } from './TimeJob.js';
export class CardServis {
    constructor(data, structura, wrapper) {
        this.data = data;
        this.idObject = this.data[4]
        this.structura = structura;
        this.onlineParams = null
        this.shablon = null
        this.wrapper = wrapper;
        this.map = null
        this.arrayName = [['motohours', 'Моточасы'], ['mileage', 'Пробег'], ['day', 'Дни']]
        this.icons = {
            'Экскаватор': `../../../image/exkavator.png`,
            'Кран': `../../../image/kran_icon.png`,
            'Бульдозер': `../../../image/Buldozer.png`,
            'Фронтальный погрузчик': `../../../image/frong-pogr.png`,
            'Газель': '../../../image/gasel.png',
            'Фургон': '../../../image/furgon.png',
            'Экскаватор-погрузчик': '../../../image/ex-pogr.png',
            'Трактор': '../../../image/traktor.png',
            'Фура': '../../../image/fura.png',
            'Легковушка': '../../../image/legk.png',
            'Самосвал': '../../../image/samosval.png',
            'Каток': '../../../image/katok.png',
            'Бетономешалка': '../../../image/beton.png',
            'Бензовоз': '../../../image/benzovoz.png',
            'ЖКХ': '../../../image/zkh.png',
            '-': '../../../image/tehnika.png'

        }
        this.globalServis = document.querySelector('.globalServis')
        this.close = this.globalServis.querySelector('.close_settings_inner');
        this.closeShablonTo = this.globalServis.querySelector('.close_settings_inner_to');
        this.cancelShablonTo = this.globalServis.querySelector('.cancel');
        this.shablonsBtn = this.globalServis.querySelector('.shablons_model_marka');
        this.modalWindow = this.globalServis.querySelector('.modal_window');
        this.save = this.globalServis.querySelector('.ok_modal')
        this.matTo = this.globalServis.querySelector('.mat_to');
        this.jobTo = this.globalServis.querySelector('.job_to');
        this.tableTo = this.globalServis.querySelector('.tableTo');
        this.tableToUniq = this.globalServis.querySelector('.tableToUniq');

        this.message = this.globalServis.querySelector('.validation_message_to');

        this.globalInner = this.globalServis.querySelector('.global_inner')
        this.valueInner = this.globalInner.querySelectorAll('.value_inner')
        this.gosnomer = this.globalInner.querySelector('.nomer_inner')
        this.mestopolo = this.globalInner.querySelector('.mestopolo')
        this.pictureInner = this.globalInner.querySelector('.picture_inner')
        this.dilerInfo = this.globalInner.querySelector('.diler_info')
        this.textDiler = this.dilerInfo.querySelectorAll('.value_center_inner')
        this.valueTo = this.globalInner.querySelectorAll('.value_to_inner')
        this.iconCalendar = this.globalInner.querySelector('.icon_inner')
        this.calendar = this.globalInner.querySelector('.calendar_inner')
        this.leftArrow = this.globalInner.querySelector('.left_to_str');
        this.rightArrow = this.globalInner.querySelector('.right_to_str');
        this.jobs = this.globalInner.querySelectorAll('.body_job');
        this.btnInner = this.globalInner.querySelectorAll('.btn_inner')
        this.bodyInner = this.globalInner.querySelectorAll('.body_inner')
        this.typeTo = this.globalInner.querySelector('.type_to')
        this.typeShablons = this.globalInner.querySelector('.type_to_shablons')
        this.pop = document.querySelector('.popup-background')

        this.clear = this.calendar.querySelectorAll('.btm_formStart')[0]
        this.ok = this.calendar.querySelectorAll('.btm_formStart')[1]
        this.currentJobIndex = 0; // Индекс текущего активного элемента body_job
        // Привязываем метод и сохраняем его для дальнейшего удаления
        this.boundClosed = this.closed.bind(this);
        this.clickCalendar = this.addCalendar.bind(this)
        this.boundClear = this.clearCalendar.bind(this)
        this.boundInner = this.toggleBodyInner.bind(this)
        this.boundLeft = this.leftStr.bind(this)
        this.boundRight = this.rightStr.bind(this)
        this.boundShablons = this.createViewShablon.bind(this)
        this.boundClose = this.hiddenContainer.bind(this)
        this.boundCancel = this.hiddenContainer.bind(this)
        this.boundView = this.viewShablonsList.bind(this)
        this.boundSave = this.saveShablon.bind(this)

        this.initEvent()
        this.init();
    }

    async init() {

        this.containerInitialisation(this.globalInner, 'flex');
        this.getData() //получение данных онлайн

        this.viewContent() //оображение данных
        this.createMap() //создание карты
        if (this.onlineParams) this.addMarkersToMap() // создание маркера
        this.shablon = await this.getShablon()
        this.shablon.length !== 0 ? this.createCompliteShablon(this.shablon) : this.createViewShablonBase()
        //new TimeJob(this.idObject)
    }

    initEvent() {
        // Устанавливаем обработчик событий
        this.close.addEventListener('click', this.boundClosed);
        this.iconCalendar.addEventListener('click', this.clickCalendar)
        this.clear.addEventListener('click', this.boundClear)
        this.btnInner.forEach(e => e.addEventListener('click', this.boundInner))
        this.leftArrow.addEventListener('click', this.boundLeft)
        this.rightArrow.addEventListener('click', this.boundRight)
        this.typeShablons.addEventListener('click', this.boundShablons)
        this.closeShablonTo.addEventListener('click', this.boundClose)
        this.cancelShablonTo.addEventListener('click', this.boundCancel)
        this.shablonsBtn.addEventListener('click', this.boundView)
        this.save.addEventListener('click', this.boundSave)
    }

    // Метод для явного удаления обработчика событий
    destroy() {
        this.close.removeEventListener('click', this.boundClosed);
        this.iconCalendar.removeEventListener('click', this.clickCalendar)
        this.clear.removeEventListener('click', this.boundClear)
        this.btnInner.forEach(e => e.removeEventListener('click', this.boundInner))
        this.leftArrow.removeEventListener('click', this.boundLeft)
        this.rightArrow.removeEventListener('click', this.boundRight)
        this.typeShablons.removeEventListener('click', this.boundShablons)
        this.closeShablonTo.removeEventListener('click', this.boundClose)
        this.cancelShablonTo.removeEventListener('click', this.boundCancel)
        this.shablonsBtn.removeEventListener('mouseenter', this.boundView)
        this.save.removeEventListener('click', this.boundSave)
        this.shablon = null
    }


    raschetTO(shablon, typeTo, key) {
        const jobTO = this.tableToUniq.querySelector('.job_to')
        const rows = document.querySelectorAll('.header_shablon_servis_to_uniq')
        if (rows) rows.forEach(e => e.remove())
        this.valueTo[0].textContent = '-'
        this.valueTo[1].textContent = '-'
        const toData = shablon.filter(e => e[key] === typeTo)
        console.log(toData)
        if (toData.length === 0) return
        this.currentJobIndex = toData[0].typeTo
        const motohourse = toData[0].motohours - this.structura.engineHours
        const nearesTo = toData[0].nameTo

        const matArray = toData.filter(e => e.guideType === 'Материалы' && e.IsRequired === 1)
        const jobArray = toData.filter(e => e.guideType === 'Работы' && e.IsRequired === 1)
        this.createRowsUniq(matArray)
        this.tableToUniq.appendChild(jobTO);
        this.createRowsUniq(jobArray)

        this.valueTo[0].textContent = nearesTo
        this.valueTo[1].textContent = motohourse < 0 ? '-' : motohourse

    }

    createRowsUniq(data) {
        data.forEach(job => {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            tr.classList.add('header_shablon_servis_to_uniq')
            td.classList.add('cel_body_uniq')
            td.textContent = job.guideDescription;
            tr.appendChild(td);
            this.tableToUniq.appendChild(tr);
        });
    }


    createCompliteShablon(data) {
        data.sort((a, b) => a.typeTo - b.typeTo)
        this.raschetTO(data, this.structura.nearestTo, 'nameTo')
        const nameTo = document.querySelectorAll('.name_to')
        if (nameTo) nameTo.forEach(e => e.parentElement.remove())

        const uniqueTypeToData = {};
        Object.values(data).forEach(item => {
            uniqueTypeToData[item.typeTo] = item;
        });

        this.arrayName.forEach(elem => {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            tr.classList.add('header_shablon_servis_to')
            td.classList.add('cel_body', 'name_to')
            td.textContent = elem[1]
            tr.appendChild(td);
            td.setAttribute('data-att', elem[0]);
            this.tableTo.appendChild(tr);
            Object.values(uniqueTypeToData).forEach(e => {
                let text;
                switch (elem[0]) {
                    case 'motohours': text = e.motohours; break;
                    case 'mileage': text = e.mileage; break;
                    case 'day': text = e.day; break;
                }
                const td = document.createElement('td');
                td.classList.add('cel_body', 'editable')
                td.setAttribute('contenteditable', 'true');
                td.textContent = text
                tr.appendChild(td);
                focusCorrect(td)

            });
        })

        this.tableTo.appendChild(this.matTo);

        const uniqueGuideToData = {};
        Object.values(data).forEach(item => {
            uniqueGuideToData[item.guideID] = item;
        });
        const guideId = Object.values(uniqueGuideToData).map(e => ({ guideID: e.guideID, guideDescription: e.guideDescription, guideType: e.guideType }))
        const matArray = guideId.filter(e => e.guideType === 'Материалы')
        const jobArray = guideId.filter(e => e.guideType === 'Работы')

        this.createRows(matArray, data)
        this.tableTo.appendChild(this.jobTo);
        this.createRows(jobArray, data)
    }



    createRows(array, data) {
        array.forEach(job => {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            tr.classList.add('header_shablon_servis_to')
            td.classList.add('cel_body', 'name_to')
            td.setAttribute('data-att', job.guideID)
            td.textContent = job.guideDescription;
            tr.appendChild(td);
            this.tableTo.appendChild(tr);
            this.createCheck(td)
            data.forEach(el => {
                if (job.guideID === el.guideID) {
                    const td = document.createElement('td');
                    td.classList.add('cel_body', 'editable')
                    td.setAttribute('contenteditable', 'true');
                    td.textContent = el.IsRequired
                    tr.appendChild(td);
                    this.validationInput(td)
                    focusCorrect(td)
                }
            })
        });
    }
    createCheck(td) {
        const i = document.createElement('i');
        i.classList.add('fa', 'fa-check', 'check_to_guide')
        td.appendChild(i);
        i.addEventListener('click', () => {
            i.classList.toggle('check_hidden')
        })
    }
    async saveShablon() {
        const struktura = this.preparingStruktura()
        await this.saveShablonToBase(struktura)
    }


    async saveShablonToBase(struktura) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ struktura })
        }
        const res = await fetch('/api/save_shablon', params)
        const req = await res.json()
        this.message.textContent = req
        setTimeout(() => this.message.textContent = '', 3000)
    }

    preparingStruktura() {
        const firstCel = document.querySelectorAll('.name_to')
        const arrayStruktura = []
        const porogs = [...firstCel].slice(0, 3)

        let arrayMoto;
        let arrayMileage;
        let arrayDay;
        // Обработка пороговых значений
        porogs.forEach((e) => {
            const dataAtt = [...e.parentElement.children].shift().getAttribute('data-att')
            switch (dataAtt) {
                case 'motohours':
                    arrayMoto = ([...e.parentElement.children].slice(1).map(e => e.textContent !== '' ? parseInt(e.textContent) : null))
                    break;
                case 'mileage':
                    arrayMileage = ([...e.parentElement.children].slice(1).map(e => e.textContent !== '' ? parseInt(e.textContent) : null))
                    break;
                case 'day':
                    arrayDay = ([...e.parentElement.children].slice(1).map(e => e.textContent !== '' ? parseInt(e.textContent) : null))
                    break;
            }
        });
        const guides = [...firstCel].slice(3)
        guides.forEach((e) => {
            const dataAtt = parseInt(e.getAttribute('data-att'))
            const bool = ([...e.parentElement.children].slice(1).map(e => e.textContent !== '' ? parseInt(e.textContent) : null))
            if (!e.children[0].classList.contains('check_hidden')) {
                const count = 26
                for (let i = 0; i < count; i++) {
                    arrayStruktura.push({ to: i + 1, guide: dataAtt, bool: bool[i], moto: arrayMoto[i], mileage: arrayMileage[i], day: arrayDay[i], idObject: String(this.idObject) })
                }
            }
        })
        return arrayStruktura
    }


    async getShablon() {
        const idw = this.idObject
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idw })
        }
        const res = await fetch('/api/get_shablon', params)
        const req = await res.json()
        return req
    }
    async createViewShablonBase() {

        const nameTo = document.querySelectorAll('.name_to')
        if (nameTo) nameTo.forEach(e => e.parentElement.remove())
        this.valueTo[0].textContent = '-'
        this.valueTo[1].textContent = '-'
        const res = await this.getGuide()

        const matArray = res.filter(e => e.guideType === 'Материалы')
        const jobArray = res.filter(e => e.guideType === 'Работы')
        this.arrayName.forEach(elem => {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            tr.classList.add('header_shablon_servis_to')
            td.classList.add('cel_body', 'name_to')
            td.textContent = elem[1]
            tr.appendChild(td);
            td.setAttribute('data-att', elem[0]);
            this.tableTo.appendChild(tr);
            let count = 27
            for (let i = 1; i < count; i++) {
                const td = document.createElement('td');
                td.classList.add('cel_body', 'editable')
                td.setAttribute('contenteditable', 'true');
                tr.appendChild(td);

            }
        })
        this.tableTo.appendChild(this.matTo);
        this.createRowsDefault(matArray)
        this.tableTo.appendChild(this.jobTo);
        this.createRowsDefault(jobArray)

    }

    createRowsDefault(array) {
        array.forEach(job => {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            tr.classList.add('header_shablon_servis_to')
            td.classList.add('cel_body', 'name_to')
            td.setAttribute('data-att', job.guideID)
            td.textContent = job.guideDescription;
            tr.appendChild(td);
            this.tableTo.appendChild(tr);
            this.createCheck(td)
            let count = 27
            for (let i = 1; i < count; i++) {
                const td = document.createElement('td');
                td.classList.add('cel_body', 'editable')
                td.setAttribute('contenteditable', 'true');
                tr.appendChild(td);
                this.validationInput(td)

            }
        });
    }

    validationInput(td) {
        td.addEventListener('keypress', function (event) {
            const key = event.key;
            console.log(key)
            // Разрешить ввод только если это '0' или '1', и в ячейке нет других символов
            if (key !== '0' && key !== '1' || this.textContent.length >= 1) {
                event.preventDefault(); // Предотвратить ввод
            }
        });
    }
    async getGuide() {
        const params = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await fetch('/api/guide_to', params)
        const guide = await res.json()
        return guide
    }



    toggleBodyInner(event) {
        const elem = event.currentTarget
        const activInner = document.querySelector('.activ_inner')
        activInner.classList.remove('activ_inner')
        const activBodyInner = document.querySelector('.activ_body_inner')
        activBodyInner.classList.remove('activ_body_inner')
        elem.classList.add('activ_inner')
        this.btnInner.forEach((e, index) => {
            if (e.classList.contains('activ_inner')) this.bodyInner[index].classList.add('activ_body_inner')
        })
    }


    viewShablonsList() {
        this.containerInitialisation(this.modalWindow, 'flex');
        new CloseBTNServis(this.modalWindow, this.shablonsBtn, this.modalWindow)

    }
    hiddenContainer() {
        const element = this.globalServis.children[1]
        this.containerInitialisation(this.pop, 'none');
        this.containerInitialisation(element, 'none');
    }
    createViewShablon() {
        const elementShablon = this.wrapper.nextElementSibling
        this.containerInitialisation(this.pop, 'flex');
        this.containerInitialisation(elementShablon, 'flex')
    }
    leftStr() {
        this.currentJobIndex = this.currentJobIndex - 1;
        if (this.currentJobIndex < 1) {  // Если индекс выходит за нижнюю границу, сбрасываем его на 26
            this.currentJobIndex = 26;
        }
        this.raschetTO(this.shablon, this.currentJobIndex, 'typeTo')
    }

    rightStr() {
        this.currentJobIndex = this.currentJobIndex + 1;
        if (this.currentJobIndex > 26) {  // Если индекс выходит за верхнюю границу, сбрасываем его на 1
            this.currentJobIndex = 1;
        }
        this.raschetTO(this.shablon, this.currentJobIndex, 'typeTo')
    }



    clearCalendar() {
        this.containerInitialisation(this.calendar, 'none')
    }
    addCalendar() {
        this.containerInitialisation(this.calendar, 'flex')
    }
    closed() {
        this.containerInitialisation(this.globalInner, 'none')
        this.destroy()
    }

    containerInitialisation(elem, style) {
        elem.style.display = style;
        //new DraggableContainer(this.global_inner.children[0], parent)
    }



    async viewContent() {
        const type = this.data[6].typeObject ? this.data[6].typeObject : '-'
        const paramsMap = new Map(this.data[2].result.map(p => [p.params, p.value]));
        const mileage = paramsMap.get('mileage') ? parseInt(paramsMap.get('mileage')) : '-'
        const sats = paramsMap.get('mileage')
        const engine = paramsMap.get('engine')
        const time = paramsMap.get('last_valid_time')
        const lastValidTime = time ? this.convert(Number(time)) : '-'
        const status = sats && engine && time ? this.statusValid(Number(sats), Number(engine), Number(time)) : '-'
        const engineHours = this.structura.engineHours
        const { marka, model, vin, typeDevice, dut, gosnomer } = this.data[6];
        const arrayValue = [marka, model, vin, engineHours, mileage, status, typeDevice, dut, lastValidTime];

        this.valueInner.forEach((e, index) => {
            e.textContent = arrayValue[index]
            if (e.getAttribute('rel') === 'status') {
                e.style.color = arrayValue[index] === 'online' ? '#00FF7F' : 'gray'
            }
        })
        this.pictureInner.style.backgroundImage = `url(${this.icons[type]})`
        this.gosnomer.textContent = gosnomer
        this.mestopolo.textContent = this.onlineParams ? await reverseGeocode(this.onlineParams.geo[0], this.onlineParams.geo[1]) : '-'
        const arrayOnfoDiler = [this.structura.company, this.structura.contact[0], this.structura.contact[1]]
        this.textDiler.forEach((e, index) => {
            e.textContent = arrayOnfoDiler[index]
        })
    }


    statusValid(sats, engine, time) {
        let status;
        const now = Math.floor(new Date().getTime() / 1000)
        const times = now - time
        if (sats > 4 && engine === 1 && times < 3600) {
            status = 'online'
        } else {
            status = 'offline'
        }
        return status
    }
    convert(time) {
        // Создание объекта Date на основе времени в Unix
        const date = new Date(time * 1000);

        // Форматирование часов и минут
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        // Форматирование дня, месяца и года
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
        const year = date.getFullYear();

        // Возвращение отформатированной строки
        return `${hours}:${minutes} ${day}.${month}.${year}`;
    }

    createMap() {
        // Удаление предыдущего контейнера, если он существует
        const existingContainer = document.getElementById('mapInner');
        if (existingContainer) {
            existingContainer.remove();
        }
        const mapInner = document.querySelector('.map_inner')
        const maps = document.createElement('div')
        maps.classList.add('map_servis_id')
        maps.setAttribute('id', 'mapInner')
        mapInner.appendChild(maps)
        this.map = L.map('mapInner');
        this.onlineParams ? this.map.setView(this.onlineParams.geo, 9) : null
        this.map.attributionControl.setPrefix(false);
        const leaf = document.querySelector('.leaflet-control-attribution');
        leaf.style.display = 'none';
        const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        }).addTo(this.map);

        L.control.scale({
            imperial: ''
        }).addTo(this.map);
        this.map.addLayer(layer);
        setTimeout(() => {
            this.map.invalidateSize();
        }, 300);
    }

    addMarkersToMap() {
        const { geo, course, speed, nameObject, nameGroup, condition, type } = this.onlineParams
        const LeafIcon = L.Icon.extend({
            options: {
                iconSize: [30, 30],
                iconAnchor: [10, 18],
                popupAnchor: [0, 0]
            }
        });
        const iconCar = new LeafIcon({
            iconUrl: this.icons[type],
            iconSize: [30, 15],
            iconAnchor: [20, 20],
            popupAnchor: [0, -10],
            className: 'custom-markers'
        });
        var divIcon = L.divIcon({
            className: 'custom-marker-arrow',
            html: `<div class="wrapContainerArrow" style="pointer-events: none;height: 75px;transform: rotate(${course}deg);"><img src="../../image/arrow2.png" style="width: 20px"></div>`
        });
        const marker = L.marker(geo, { icon: iconCar }).addTo(this.map);
        marker.bindPopup(`Группа: ${nameGroup}<br>Объект: ${nameObject}<br>Cостояние: ${condition}<br>${condition === 'Поездка' ? `Скорость: ${speed} км/ч<br>` : ''}Координаты: ${geo}`, { className: 'my-popup-markers' });
        marker.on('mouseover', function (e) {
            this.openPopup();
        });
        marker.on('mouseout', function (e) {
            this.closePopup();
        });

        const markerCourse = L.marker(geo, { icon: divIcon }).addTo(this.map);
        condition !== 'Стоянка' && condition !== 'Нет данных' ? markerCourse.addTo(this.map) : this.map.removeLayer(markerCourse);

    }

    getData() {
        const objCondition = {
            0: 'Стоянка',
            1: 'Движется',
            2: 'Остановка',
            3: 'Нет данных'
        }

        const params = this.data[2].result;
        const type = this.data[6].typeObject ? this.data[6].typeObject : '-'
        if (params.length === 0) return null; // Возвращаем null, если нет параметров
        const paramsMap = new Map(params.map(p => [p.params, p.value]));
        const lat = paramsMap.get('lat');
        const lon = paramsMap.get('lon');
        const speed = paramsMap.get('speed');
        const course = paramsMap.get('course');
        const engine = paramsMap.get('engine');
        const time = paramsMap.get('last_valid_time');

        let condition;
        if (speed && engine) {
            const num = (Number(speed) > 0 && Number(engine) === 1) ? 1
                : (Number(speed) === 0 && Number(engine) === 1) ? 2
                    : (Number(speed) === 0 && Number(engine) === 0) ? 0 : 3;
            condition = objCondition[num]
        }
        // Возвращаем объект только если имеются все необходимые данные
        if (lat && lon && speed && course && time) {
            this.onlineParams = {
                idObject: this.data[4],
                nameObject: this.data[0].message,
                idGroup: this.data[8],
                nameGroup: this.data[7],
                geo: [lat, lon],
                speed: speed,
                course: course,
                time: time,
                condition: condition,
                type: type
            };
        }
    }

}