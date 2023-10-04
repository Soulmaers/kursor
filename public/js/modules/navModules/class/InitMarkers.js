
export class InitMarkers {
    static markers = {}; // Хранилище для маркеров
    constructor(list, map) {
        this.list = list;
        this.map = map;

    }

    addMarkersToMap() {
        console.log('запуск класса')
        this.list.forEach(item => {
            const id = item[0];
            const coordinates = item[1];
            const course = item[2];
            const name = item[3];
            const LeafIcon = L.Icon.extend({
                options: {
                    iconSize: [30, 30],
                    iconAnchor: [10, 18],
                    popupAnchor: [0, 0]
                }
            });

            const iconCar = new LeafIcon({
                iconUrl: '../../../image/trailer.png',
                iconSize: [30, 22],
                iconAnchor: [20, 20],
                popupAnchor: [0, 0],
                className: 'custom-markers'
            });

            if (InitMarkers.markers[id]) {  // Если маркер с таким ID уже есть, просто обновляем его координаты
                InitMarkers.markers[id].setLatLng(coordinates);
            } else {  // Иначе создаем новый маркер
                const marker = L.marker(coordinates, { icon: iconCar }).addTo(this.map);
                marker.bindPopup(`Объект: ${name}<br>Координаты: ${coordinates}`);
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