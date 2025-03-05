


export class AddMapClass {
    constructor(mapContainer) {
        this.mapContainer = mapContainer
        this.initMap()
    }

    initMap() {
        console.log('рисуем карту')
        const karta = document.getElementById('reportsMap')
        if (!karta) {
            const div = document.createElement('div')
            div.classList.add('miniMapReports')
            div.setAttribute('id', 'reportsMap')
            div.style.width = '100%'
            div.style.height = '100%'
            div.style.zIndex = 0;
            this.mapContainer.appendChild(div)
            this.map = L.map('reportsMap').setView([59.9386, 30.3141], 9);

            this.map.attributionControl.setPrefix(false);
            const leaf = document.querySelector('.leaflet-control-attribution');
            leaf.style.display = 'none';
            const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
            L.control.scale({ imperial: '' }).addTo(this.map);
            this.map.addLayer(layer);
            setTimeout(() => {
                this.map.invalidateSize();
            }, 0);
        }
    }

    createMarker(geo, color, typeIcon) {
        const newHtml = `<i class="${typeIcon} geo_position" style="color: ${color}"></i>`;
        const greenIcon = L.divIcon({
            html: newHtml,
            iconSize: [30, 20],
            iconAnchor: [20, 20],
            popupAnchor: [0, 0],
            className: 'custom-marker'
        });


        if (this.marker) {
            this.marker._icon.innerHTML = newHtml;
            // Если маркер уже существует, обновляем его координаты
            this.marker.setLatLng(geo);
            this.map.setView(geo, 13);
        } else {
            // Если маркера нет, создаем его и сохраняем ссылку
            this.marker = L.marker(geo, {
                icon: greenIcon,
            }).addTo(this.map);
            this.map.setView(geo, 13);
        }

    }
}
