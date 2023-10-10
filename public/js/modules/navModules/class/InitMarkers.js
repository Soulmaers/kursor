import { visual } from '../../visual.js'


export class InitMarkers {
    static markers = {}; // Хранилище для маркеров
    static markersArrow = {}//Хранилище маркеров курса
    static poly = {}//Хранлище полилиний
    static iconsMode = "normal";
    static namesMode = 'normal'
    static trackMode = 'normal'
    constructor(list, map, geoTrack) {
        this.list = list;
        this.map = map;
        this.geoTrack = geoTrack;
        this.settings = document.querySelector('.settingsMap')
        this.container = document.querySelector('.containerSettingsMap')
        this.objIconsMarkers = {}
        this.listObject = document.querySelectorAll('.listItem')
        this.tableInfoCar = document.querySelector('.tableInfoCar')
        //  this.titleInfoMap = document.querySelector('.titleInfoMap')
    }

    opasityMarkers(event) {
        const objectId = event.id
        const marker = InitMarkers.markers[objectId]
        const markerArrow = InitMarkers.markersArrow[objectId]
        if (marker) {
            console.log(marker)
            Object.values(InitMarkers.markers).forEach(e => {
                e.setOpacity(0.0)
                if (e._tooltip) {
                    e.closeTooltip()
                }

            })
            Object.values(InitMarkers.markersArrow).forEach(e => {
                e.setOpacity(0.0)
                if (e._tooltip) {
                    e.closeTooltip()
                }
            })
            if (marker._tooltip) {
                marker.openTooltip()
            }
            marker.setOpacity(1)
            markerArrow.setOpacity(1)
            const markerPosition = marker.getLatLng()
            this.map.setView(markerPosition, 8)
        }
    }
    opasityMarkersBack(event) {
        Object.values(InitMarkers.markers).forEach(e => {
            e.setOpacity(1)
            if (e._tooltip) {
                e.openTooltip()
            }
        })
        Object.values(InitMarkers.markersArrow).forEach(e => {
            e.setOpacity(1)
        })
        this.map.setView([59.9386, 30.3141], 9)
    }
    statistikaObjectCar() {
        const arrayStatus = [];
        const checkInList = document.querySelectorAll('.checkInList')
        let count = checkInList.length;
        checkInList.forEach(e => {
            if (e.classList.contains('changeColorCheck')) {
                count--
            }
        })
        const statusCounts = Array.from(this.list).reduce((acc, el) => {
            if (el[6] === 'off') {
                acc.offline = (acc.offline || 0) + 1;
            }
            if (el[4] === 'Поездка') {
                acc.move = (acc.move || 0) + 1;
            }
            if (el[4] === 'Остановка') {
                acc.pause = (acc.pause || 0) + 1;
            }
            if (el[4] === 'Стоянка') {
                acc.stop = (acc.stop || 0) + 1;
            }
            return acc;
        }, {});
        arrayStatus.push(this.listObject.length)
        arrayStatus.push(count);
        arrayStatus.push(statusCounts.offline !== undefined ? statusCounts.offline : 0);
        arrayStatus.push(statusCounts.move !== undefined ? statusCounts.move : 0)
        arrayStatus.push(statusCounts.pause !== undefined ? statusCounts.pause : 0);
        arrayStatus.push(statusCounts.stop !== undefined ? statusCounts.stop : 0);
        console.log(arrayStatus)
        Array.from(this.tableInfoCar.children[1].children).forEach((element, index) => {
            element.textContent = arrayStatus[index]
        });
    }

    clickMarkers(event) {
        const marker = event.target
        console.log(marker)
        this.listObject.forEach(el => {
            if (el.id === marker.id) {
                visual(el)
            }
        })
    }

    viewHiddenInfoMap() {
        this.tableInfoCar.addEventListener('mouseenter', () => {
            this.tableInfoCar.children[0].style.display = 'none'
            this.tableInfoCar.children[1].style.display = 'flex'
        })
        this.tableInfoCar.addEventListener('mouseleave', () => {
            this.tableInfoCar.children[0].style.display = 'flex'
            this.tableInfoCar.children[1].style.display = 'none'
        })
    }

    viewHiddenMenuMap() {
        this.settings.addEventListener('mouseenter', () => {
            this.container.style.display = 'flex'
            this.settings.style.width = '165px'
            this.settings.firstElementChild.innerHTML = `<i class="fas fa-cogs" style="padding-right:10px" ></i> Настройки`
        })
        this.settings.addEventListener('mouseleave', () => {
            this.container.style.display = 'none'
            this.settings.style.width = '30px'
            this.settings.firstElementChild.innerHTML = `<i class="fas fa-cogs"></i>`
        })
    }

    nameObjectView() {
        console.log(InitMarkers.namesMode)
        InitMarkers.namesMode = InitMarkers.namesMode === 'normal' ? 'alternate' : 'normal';
        console.log(InitMarkers.namesMode)
        Object.values(InitMarkers.markers).forEach(marker => {
            if (InitMarkers.namesMode !== 'normal') {
                marker.bindTooltip(InitMarkers.iconsMode === 'normal' ? marker.group : marker.name, {
                    permanent: true,    // делает тултип постоянным
                    direction: "top",  // устанавливает позицию тултипа относительно маркера
                    className: 'my-custom-tooltip',  // указываем класс тултипа для дальнейшего стилизования
                }).openTooltip();
            }
            else {
                marker.unbindTooltip();
            }

        });
    }
    toggleMarkersIcon() {
        const checkInList = document.querySelectorAll('.checkInList')
        checkInList.forEach(el => {
            const idw = el.closest('.listItem').id
            if (InitMarkers.markers[idw]) {
                if (el.classList.contains('changeColorCheck')) {
                    this.map.removeLayer(InitMarkers.markers[idw]);
                    this.map.removeLayer(InitMarkers.markersArrow[idw]);
                }
                else {
                    InitMarkers.markers[idw].addTo(this.map)
                    this.list.forEach(it => {
                        if (it[0] === idw) {
                            it[4] !== 'Стоянка' ? InitMarkers.markersArrow[idw].addTo(this.map) : this.map.removeLayer(InitMarkers.markersArrow[idw]);
                        }
                    })
                }
            }
        })
    }
    changeMarkersIcon() {
        console.log('апдейт маркер')
        InitMarkers.iconsMode = InitMarkers.iconsMode === "normal" ? "alternate" : "normal";
        Object.values(InitMarkers.markers).forEach(marker => {
            let newIcon;
            const LeafIcon = L.Icon.extend({
                options: {
                    iconSize: [30, 30],
                    iconAnchor: [10, 18],
                    popupAnchor: [0, 0]
                }
            });
            if (InitMarkers.iconsMode === 'normal') {
                newIcon = new LeafIcon({
                    iconUrl: '../../image/trailer.png',
                    iconSize: [30, 22],
                    iconAnchor: [20, 20],
                    popupAnchor: [0, 0],
                    className: 'custom-markers'
                });
                marker.setTooltipContent(marker.group)
            } else {
                newIcon = new LeafIcon({
                    iconUrl: this.objIconsMarkers[marker.group],
                    iconSize: [30, 30],
                    iconAnchor: [20, 20],
                    popupAnchor: [0, 0],
                    className: 'custom-markers-group'
                });
                marker.setTooltipContent(marker.name)
            }
            marker.setIcon(newIcon);
        });
    }


    addPolyLine() {
        InitMarkers.trackMode = InitMarkers.trackMode === 'normal' ? 'alternate' : 'normal';
        if (InitMarkers.trackMode === 'alternate') {
            Object.values(InitMarkers.poly).forEach(el => {
                el.addTo(this.map)
            })
        }
        else {
            Object.values(InitMarkers.poly).forEach(el => {
                el.remove(this.map)
            })
        }
    }


    addMarkersToMap() {
        console.log('есть?')
        const uniqueElements = Array.from(new Set(this.list.map(subarr => subarr[8])));
        uniqueElements.forEach((el, index) => {
            this.objIconsMarkers[el] = `../../../image/${index + 1}.png`
        })
        this.list.forEach(item => {
            const [id, coordinates, course, speed, state, relevance, , name, group] = item

            const LeafIcon = L.Icon.extend({
                options: {
                    iconSize: [30, 30],
                    iconAnchor: [10, 18],
                    popupAnchor: [0, 0]
                }
            });
            const iconCar = new LeafIcon({
                iconUrl: '../../image/trailer.png',
                iconSize: [30, 22],
                iconAnchor: [20, 20],
                popupAnchor: [0, -10],
                className: 'custom-markers'
            });
            var divIcon = L.divIcon({
                className: 'custom-marker-arrow',
                html: `<div class="wrapContainerArrow" style="pointer-events: none;height: 75px;transform: rotate(${course}deg);"><img src="../../image/arrow2.png" style="width: 20px"></div>`
            });

            if (InitMarkers.markers[id]) {  // Если маркер с таким ID уже есть, просто обновляем его координаты
                InitMarkers.markers[id].setLatLng(coordinates);
                InitMarkers.markersArrow[id].setLatLng(coordinates)
                let markerDOM = InitMarkers.markersArrow[id].getElement();
                if (markerDOM) {
                    markerDOM.children[0].style.transform = `rotate(${course}deg)`
                }
                InitMarkers.markers[id].setPopupContent(`Группа: ${group}<br>Объект: ${name}<br>Актуальность данных: ${relevance}<br>Cостояние: ${state}<br>${state === 'Поездка' ? `Скорость: ${speed} км/ч<br>` : ''}Координаты: ${coordinates}`);
            } else {  // Иначе создаем новый маркер
                const marker = L.marker(coordinates, { icon: iconCar }).addTo(this.map);
                const markers = L.marker(coordinates, { icon: divIcon })
                if (this.geoTrack[id] !== undefined) {
                    const coordTrack = this.geoTrack[id] !== undefined ? this.geoTrack[id].geo : null
                    const poly = L.polyline(coordTrack, { color: 'rgb(0, 0, 204)', weight: 1 });
                    InitMarkers.poly[id] = poly
                }
                state !== 'Стоянка' ? markers.addTo(this.map) : this.map.removeLayer(markers);
                marker.bindPopup(`Группа: ${group}<br>Объект: ${name}<br>Актуальность данных: ${relevance}<br>Cостояние: ${state}<br>${state === 'Поездка' ? `Скорость: ${speed} км/ч<br>` : ''}Координаты: ${coordinates}`, { className: 'my-popup-markers' });
                marker.group = group;
                marker.name = name;
                marker.id = id;
                marker.on('mouseover', function (e) {
                    this.openPopup();
                });
                marker.on('mouseout', function (e) {
                    this.closePopup();
                });
                // Сохраняем маркер в хранилище
                InitMarkers.markers[id] = marker;
                InitMarkers.markersArrow[id] = markers;

                if (!marker.clickEventAttached) { // Verify if a click event is already attached
                    marker.on('click', this.clickMarkers.bind(this))
                    marker.clickEventAttached = true; // Mark this marker that a click event has been attached
                }

            }

        });
    }

}