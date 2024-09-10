


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
}