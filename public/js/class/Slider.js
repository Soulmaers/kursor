

export class SliderController {
    constructor(data) {
        this.pen = document.querySelector('.pen_servis');
        this.strL = this.pen.querySelector('.strL');
        this.strR = this.pen.querySelector('.strR');
        this.map = null
        this.data = data
        this.leftContainer = document.querySelector('.list_servis');
        this.rightContainer = document.querySelector('.map_servis');

        this.attachEventListeners();
    }

    attachEventListeners() {
        if (this.strL) {
            this.strL.addEventListener('click', () => this.moveLeft());

        }
        if (this.strR) {
            this.strR.addEventListener('click', () => this.moveRight());

        }

    }

    moveLeft() {
        console.log()
        this.leftContainer.style.width = '20%';
        this.rightContainer.style.width = '80%';
        this.strL.style.display = 'none'
        this.strR.style.display = 'flex'
        if (!this.map) {
            this.createMap();  // Создать карту, если она еще не была создана
        } else {
            setTimeout(() => {
                this.map.invalidateSize();  // Обновить размеры карты
            }, 300);
        }
    }

    moveRight() {
        this.leftContainer.style.width = '100%';
        this.rightContainer.style.width = '0%';
        this.strR.style.display = 'none'
        this.strL.style.display = 'flex'
    }


    createMap() {
        this.map = L.map('mapServis');
        //    this.iss = L.marker(center, { icon: customIcon }).addTo(map);
        // const popupContent = `Объект: ${this.nameCar}<br>Время: ${formattedDate}<br>Скорость: ${this.geo.speed} км/ч<br>Зажигание: ${this.geo.stop}`;
        // const popup = L.popup({ className: 'my-popup-bar', autoPan: false });
        // this.iss.bindPopup(popup).addTo(this.map);
        // popup.setContent(popupContent);
        this.map.setView([59.9386, 30.3141], 9);
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

        this.addMarkersToMap()

    }


    addMarkersToMap() {
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
        this.data.forEach(item => {
            const { idObject, geo, course, speed, nameObject, idGroup, nameGroup, time, condition, type } = item
            console.log(type)
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
        })
    }
}