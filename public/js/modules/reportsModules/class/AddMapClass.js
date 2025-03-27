


export class AddMapClass {
    constructor(mapContainer) {
        this.mapContainer = mapContainer
        this.initMap()
    }

    initMap() {
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
        const greenIcon = this.paramsIcon(newHtml)
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

    paramsIcon(newHtml, z) {
        const greenIcon = L.divIcon({
            html: newHtml,
            iconSize: [30, 20],
            iconAnchor: [20, 20],
            popupAnchor: [0, 0],
            className: z ? 'origin_class' : 'custom-marker'
        });

        return greenIcon
    }
    createPolyLine(track, color, weight, sub) {
        let polyline;
        if (!sub) {
            if (this.poly) {
                this.clearPoly(this.poly)
            }
            if (this.trackPoly) {
                this.clearPoly(this.trackPoly)
            }
            polyline = L.polyline(track, { color: color, weight: weight }).addTo(this.map);
            this.poly = polyline;
        } else {
            this.createMarkerTrek(track)
            polyline = this.addTrackPolyline(track, color, weight);

        }
        // Получаем границы полилинии
        const bounds = polyline.getBounds();
        // Масштабируем карту, чтобы полилиния была видна
        this.map.fitBounds(bounds);
    }

    // Метод для добавления полилинии трека
    addTrackPolyline(track, color, weight) {
        if (this.trackPoly) {
            this.clearPoly(this.trackPoly)
        }
        const polyline = L.polyline(track, { color: color, weight: weight }).addTo(this.map);
        this.trackPoly = polyline;

        return track.length !== 0 ? polyline : this.poly
    }

    clearPoly(poly) {
        if (poly) {
            this.map.removeLayer(poly);
        }
        else {
            if (this.poly) this.map.removeLayer(this.poly)
            if (this.trackPoly) this.map.removeLayer(this.trackPoly)
        }
    }

    clearMarker() {
        if (this.marker) (this.map.removeLayer(this.marker), this.marker = null);
        if (this.start) (this.map.removeLayer(this.start), this.start = null);
        if (this.finish) (this.map.removeLayer(this.finish), this.finish = null);
    }
    createMarkerTrek(track) {
        if (track.length === 0) {
            this.clearMarker()
            return
        }
        if (this.start) {
            this.start.setLatLng(track[0]);
            this.finish.setLatLng(track[track.length - 1]);
        }
        else {
            const startHTML = `<i class="fas fa-flag geo_position" style="color: #4CC417"></i>`;
            const finishHTML = `<img class="finish_position" src="../../../../image/finish.png">`;

            const icon_start = this.paramsIcon(startHTML, 'z')
            const icon_finish = this.paramsIcon(finishHTML)

            this.start = L.marker(track[0], {
                icon: icon_start,
            }).addTo(this.map);
            this.finish = L.marker(track[track.length - 1], {
                icon: icon_finish,
            }).addTo(this.map);
        }
    }


}
