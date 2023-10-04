
export class InitMarkers {
    static markers = {}; // Хранилище для маркеров
    static iconsMode = "normal";
    constructor(list, map) {
        this.list = list;
        this.map = map;
        this.objIconsMarkers = {}

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
                    className: 'custom-markers'
                });
            }
            marker.setIcon(newIcon);
        });
    }


    addMarkersToMap() {
        const uniqueElements = Array.from(new Set(this.list.map(subarr => subarr[4])));
        uniqueElements.forEach((el, index) => {
            this.objIconsMarkers[el] = `../../../image/${index + 1}.png`
        })
        console.log(this.objIconsMarkers)
        console.log('запуск класса')
        this.list.forEach(item => {
            const [id, coordinates, course, name, group] = item

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
                popupAnchor: [0, 0],
                className: 'custom-markers'
            });

            if (InitMarkers.markers[id]) {  // Если маркер с таким ID уже есть, просто обновляем его координаты
                InitMarkers.markers[id].setLatLng(coordinates);
            } else {  // Иначе создаем новый маркер
                const marker = L.marker(coordinates, { icon: iconCar }).addTo(this.map);
                marker.bindPopup(`Группа: ${group}<br>Объект: ${name}<br>Координаты: ${coordinates}`, { className: 'my-popup-markers' });
                marker.group = group;
                marker.on('mouseover', function (e) {
                    this.openPopup();
                });
                marker.on('mouseout', function (e) {
                    this.closePopup();
                });
                // Сохраняем маркер в хранилище
                InitMarkers.markers[id] = marker;
            }
        });
    }
}