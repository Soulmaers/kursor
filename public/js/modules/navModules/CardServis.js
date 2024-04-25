

//import { DraggableContainer } from "../../class/Dragdown.js";

export class CardServis {
    constructor(data, structura, wrapper) {
        this.data = data;
        this.structura = structura;
        this.onlineParams = null
        this.wrapper = wrapper;
        this.map = null
        this.icons = {
            'Экскаватор': `../../../image/exkavator.png`,
            'Кран': `../../../image/Kran.png`,
            'Бульдозер': `../../../image/Buldozer.png`,
            'Фронтальный погрузчик': `../../../image/frong-pogr.png`,
            'Газель': '../../../image/furgon.png',
            'Фургон': '../../../image/furgon.png',
            'Экскаватор-погрузчик': '../../../image/ex-pogr.png',
            'Трактор': '../../../image/traktor.png',
            'Фура': '../../../image/fura.png',
            'Легковушка': '../../../image/legk.png',
            'Самосвал': '../../../image/samosval.png',
            '-': '../../../image/tehnika.png'

        }
        this.global_inner = this.wrapper.nextElementSibling;
        this.close = document.querySelector('.close_settings_inner');
        this.globalInner = document.querySelector('.global_inner')
        this.valueInner = this.globalInner.querySelectorAll('.value_inner')
        this.gosnomer = this.globalInner.querySelector('.nomer_inner')
        this.mestopolo = this.globalInner.querySelector('.mestopolo')
        this.pictureInner = this.globalInner.querySelector('.picture_inner')
        this.dilerInfo = this.globalInner.querySelector('.diler_info')
        this.textDiler = this.dilerInfo.querySelectorAll('.value_center_inner')
        this.iconCalendar = this.globalInner.querySelector('.icon_inner')
        this.calendar = this.globalInner.querySelector('.calendar_inner')
        this.btnInner = this.globalInner.querySelectorAll('.btn_inner')
        this.bodyInner = this.globalInner.querySelectorAll('.body_inner')
        this.clear = this.calendar.querySelectorAll('.btm_formStart')[0]
        this.ok = this.calendar.querySelectorAll('.btm_formStart')[1]
        // Привязываем метод и сохраняем его для дальнейшего удаления
        this.boundClosed = this.closed.bind(this);
        this.clickCalendar = this.addCalendar.bind(this)
        this.boundClear = this.clearCalendar.bind(this)
        this.boundInner = this.toggleBodyInner.bind(this)
        // Устанавливаем обработчик событий
        this.close.addEventListener('click', this.boundClosed);
        this.iconCalendar.addEventListener('click', this.clickCalendar)
        this.clear.addEventListener('click', this.boundClear)
        this.btnInner.forEach(e => e.addEventListener('click', this.boundInner))
        this.init();
    }

    init() {
        console.log(this.data);
        console.log(this.structura);
        console.log(this.onlineParams)
        this.containerInitialisation(this.global_inner, 'flex');
        this.getData() //получение данных онлайн

        this.viewContent() //оображение данных
        this.createMap() //создание карты
        if (this.onlineParams) this.addMarkersToMap() // создание маркера

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
        console.log(elem)
    }
    clearCalendar() {
        this.containerInitialisation(this.calendar, 'none')
    }
    addCalendar() {
        console.log('слушатель')
        this.containerInitialisation(this.calendar, 'flex')
    }
    closed() {
        console.log('Closed called');

        this.containerInitialisation(this.global_inner, 'none')
        this.destroy()
    }
    // Метод для явного удаления обработчика событий
    destroy() {
        this.close.removeEventListener('click', this.boundClosed);
        this.iconCalendar.removeEventListener('click', this.clickCalendar)
        this.clear.removeEventListener('click', this.boundClear)
        this.btnInner.forEach(e => e.removeEventListener('click', this.boundInner))
    }
    containerInitialisation(elem, style) {
        elem.style.display = style;
        //new DraggableContainer(this.global_inner.children[0], parent)
    }



    viewContent() {
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
        this.mestopolo.textContent = this.onlineParams ? this.onlineParams.geo : '-'
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
        this.map.setView(this.onlineParams.geo, 9);
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
            iconSize: [30, 22],
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
        console.log(type)
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