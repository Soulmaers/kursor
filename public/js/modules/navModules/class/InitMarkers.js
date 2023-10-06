
export class InitMarkers {
    static markers = {}; // Хранилище для маркеров
    static markersArrow = {}//Хранилище маркеров курса
    static iconsMode = "normal";
    constructor(list, map) {
        this.list = list;
        this.map = map;
        this.objIconsMarkers = {}

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
            } else {
                newIcon = new LeafIcon({
                    iconUrl: this.objIconsMarkers[marker.group],
                    iconSize: [30, 30],
                    iconAnchor: [20, 20],
                    popupAnchor: [0, 0],
                    className: 'custom-markers-group'
                });
            }
            marker.setIcon(newIcon);
        });
    }
    addMarkersToMap() {
        console.log('есть?')
        const uniqueElements = Array.from(new Set(this.list.map(subarr => subarr[7])));
        uniqueElements.forEach((el, index) => {
            this.objIconsMarkers[el] = `../../../image/${index + 1}.png`
        })
        this.list.forEach(item => {
            const [id, coordinates, course, speed, state, relevance, name, group] = item

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
                state !== 'Стоянка' ? markers.addTo(this.map) : this.map.removeLayer(markers);
                marker.bindPopup(`Группа: ${group}<br>Объект: ${name}<br>Актуальность данных: ${relevance}<br>Cостояние: ${state}<br>${state === 'Поездка' ? `Скорость: ${speed} км/ч<br>` : ''}Координаты: ${coordinates}`, { className: 'my-popup-markers' });
                marker.group = group;
                marker.on('mouseover', function (e) {
                    this.openPopup();
                });
                marker.on('mouseout', function (e) {
                    this.closePopup();
                });
                // Сохраняем маркер в хранилище
                InitMarkers.markers[id] = marker;
                InitMarkers.markersArrow[id] = markers;
            }
        });
    }
}