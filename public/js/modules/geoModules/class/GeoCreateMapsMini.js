import { timeConvert } from '../../../modules/helpersFunc.js'
import { DraggableContainer } from '../../../class/Dragdown.js'

export class GeoCreateMapsMini {
    constructor(geoTrack, geo, num) {
        this.geoTrack = geoTrack
        this.geo = geo
        this.koordinates = null
        this.num = num
        this.map = null
        this.iss = null
        this.mapElement = null
        this.nameCar = null
        this.event = null
        this.initializeMap();
    }
    async initializeMap() {
        this.clearExistingMap();
        const wrapMap = this.createMapContainer();
        this.map = this.createMap('mapOil');
        const polyline = L.polyline(this.geoTrack, { color: 'darkred', weight: 2 }).addTo(this.map);

        let iconOptions = {
            iconUrl: this.num !== 'oil?' ? '../../image/trailer.png' : '../../image/ref.png',
            iconSize: [30, 22],
            iconAnchor: [0, -10],
            popupAnchor: [20, 24],
            className: 'custom-marker-alarm'
        };
        let customIcon = new L.Icon(iconOptions);

        switch (this.num) {
            case 'bar':
                this.koordinates = [this.geo.geo[0], this.geo.geo[1]]
                this.map.setView([this.koordinates[0], this.koordinates[1]], 12);
                await this.handleBarCase(customIcon, wrapMap);
                break;
            case 'alarm':
                this.koordinates = [this.geo.geoY, this.geo.geoX]
                this.map.setView([this.koordinates[0], this.koordinates[1]], 12);
                this.handleAlarmCase(customIcon, wrapMap);
                break;
            case 'oil':
                this.koordinates = [this.geo.geo[0], this.geo.geo[1]]
                this.map.setView([this.koordinates[0], this.koordinates[1]], 12);
                this.handleOilCase(customIcon, wrapMap);
                break;
            case 'stat':
                this.koordinates = [this.geo.geo[0], this.geo.geo[1]]
                this.map.setView([this.koordinates[0], this.koordinates[1]], 12);
                this.handleStatCase(customIcon, wrapMap);
                break;
            case 'log':
                this.koordinates = [this.geo[0].geo[0], this.geo[0].geo[1]]
                this.map.setView([this.koordinates[0], this.koordinates[1]], 12);
                this.handleLogCase(customIcon, wrapMap);
                break;
            default:
                break;
        }
        this.addMapControls();
    }

    clearExistingMap() {
        const existingMap = document.querySelector('.wrapMap');
        if (existingMap) existingMap.remove();
    }

    createMapContainer() {
        this.nameCar = document.querySelector('.color') ? document.querySelector('.color').children[0].textContent : null
        const targetContainer = this.num !== 'log' ? document.querySelector('.main') : document.querySelector('.wrapperFull');
        const wrapMap = document.createElement('div');
        wrapMap.classList.add('wrapMap');
        this.mapElement = document.createElement('div');
        this.mapElement.classList.add('mapsOilCard');
        this.mapElement.setAttribute('id', 'mapOil');
        wrapMap.appendChild(this.mapElement);
        wrapMap.style.zIndex = '2099';
        targetContainer.appendChild(wrapMap);
        return wrapMap;
    }

    createMap(elementId) {
        return L.map(elementId);
    }

    // Заглушки для обработчиков различных случаев
    async handleBarCase(customIcon, wrapMap) {
        const center = [this.koordinates[0], this.koordinates[1]];
        const date = new Date(this.geo.dates);
        const day = date.getDate();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
        this.mapElement.style.width = '300px';
        this.mapElement.style.height = '300px';
        wrapMap.style.height = '320px';
        wrapMap.style.position = 'absolute';
        wrapMap.style.left = '25px';
        wrapMap.style.top = '500px';
        wrapMap.style.width = '300px';
        new DraggableContainer(wrapMap);
        this.iss = L.marker(center, { icon: customIcon }).addTo(this.map);
        const popupContent = `Объект: ${this.nameCar}<br>Время: ${formattedDate}<br>Скорость: ${this.geo.speed} км/ч<br>Зажигание: ${this.geo.stop}`;
        const popup = L.popup({ className: 'my-popup-bar', autoPan: false });
        this.iss.bindPopup(popup).addTo(this.map);
        popup.setContent(popupContent);
        this.map.setView(center, 12);
        this.map.flyTo(center, 12);
    }

    handleAlarmCase(customIcon, wrapMap) {
        const center = [this.koordinates[0], this.koordinates[1]]
        this.mapElement.style.width = '350px';
        this.mapElement.style.height = '350px'
        wrapMap.style.height = '370px'
        wrapMap.style.position = 'absolute'
        wrapMap.style.left = '580px';
        wrapMap.style.top = '40px';
        new DraggableContainer(wrapMap);
        this.event = 'my-popup-alarm'
        this.iss = L.marker(center, { icon: customIcon })
            .bindPopup(`Объект: ${this.geo.info.car}\nВремя: ${this.geo.info.time}\nКолесо: ${this.geo.info.tyres}\nP,bar: ${this.geo.info.bar}\nt,C: ${this.geo.info.temp}\nСкорость: ${this.geo.speed} км/ч\nУведомление: ${this.geo.info.alarm}\nАдрес: ${this.geo.geoY, this.geo.geoX}`, { width: 60, className: 'my-popup-alarm', autoPan: false }).addTo(this.map);
    }

    handleOilCase(customIcon, wrapMap) {
        const center = [this.koordinates[0], this.koordinates[1]]
        this.mapElement.style.width = '300px';
        this.mapElement.style.height = '300px'
        wrapMap.style.height = '320px';
        wrapMap.style.width = '300px';
        wrapMap.style.position = 'absolute'
        wrapMap.style.left = '25px';
        wrapMap.style.top = '500px';
        new DraggableContainer(wrapMap);
        this.event = 'my-popup-oil'
        this.iss = L.marker(center, { icon: customIcon }).bindPopup(`Объект: ${this.nameCar}<br>Заправлено: ${this.geo.zapravka} л.<br>Дата: ${this.geo.time}<br>Адрес: ${this.geo.geo[0], this.geo.geo[1]}`, { className: 'my-popup-oil' }).addTo(this.map);
    }

    handleStatCase(customIcon, wrapMap) {
        const selectedTime = timeConvert(this.geo.time)
        const center = [this.koordinates[0], this.koordinates[1]]
        this.mapElement.style.width = '350px';
        this.mapElement.style.height = '350px'
        wrapMap.style.position = 'absolute'
        wrapMap.style.left = '580px';
        wrapMap.style.top = '40px';
        wrapMap.style.height = '370px'
        new DraggableContainer(wrapMap);
        this.event = 'my-popup-stat';
        this.iss = L.marker(center, { icon: customIcon }).bindPopup(`Объект: ${this.nameCar}<br>Время: ${selectedTime}<br>Состояние: ${this.geo.condition}<br>Скорость: ${this.geo.speed} км/ч<br>Местоположение: ${this.geo.geo[0], this.geo.geo[1]}`, { width: 60, className: 'my-popup-stat', autoPan: false }).addTo(this.map);
    }

    handleLogCase(customIcon, wrapMap) {
        const selectedTime = this.geo[0].logs[0]
        const center = [this.koordinates[0], this.koordinates[1]]
        this.mapElement.style.width = '350px';
        this.mapElement.style.height = '350px'
        wrapMap.style.position = 'absolute'
        wrapMap.style.left = '580px';
        wrapMap.style.top = '40px';
        wrapMap.style.height = '370px'
        new DraggableContainer(wrapMap);
        this.event = 'my-popup-log';
        this.iss = L.marker(center, { icon: customIcon }).bindPopup(`Время: ${selectedTime}<br>Объект: ${this.geo[0].logs[1]}<br>Время события: ${this.geo[0].logs[2]}`, { width: 60, className: 'my-popup-log', autoPan: false }).addTo(this.map);

    }

    addMapControls() {
        this.iss.on('mouseover', function (e) {
            this.openPopup();
        });
        this.iss.on('mouseout', function (e) {
            this.closePopup();
        });
        setTimeout(() => {
            this.map.invalidateSize();
        }, 0);
        // Добавление контролов к карте
        const leaf = document.querySelector('.leaflet-control-attribution');
        leaf.style.display = 'none';
        L.control.scale({ imperial: false }).addTo(this.map);
        this.map.attributionControl.setPrefix(false);
        const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
        this.map.addLayer(layer);
        this.map.on('zoomend', () => {
            this.map.panTo([this.koordinates[0], this.koordinates[1]]);
        });
    }

}