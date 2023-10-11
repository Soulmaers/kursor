
export let mapLocal, iss, marker, poly, eventMarkers;



export class CreateMarkersEvent {
    constructor(id) {
        this.id = id

    }
    async init() {
        this.updateInterval = setInterval(() => {
            this.update();
        }, 30000);
        const eventTrack = await this.getEventObject()
        const geo = await this.getLastGeoPosition()
        this.createMapMainObject(geo, eventTrack)
    }

    async update() {
        const eventTrack = await this.getEventObject()
        const geo = await this.getLastGeoPosition()
        this.createMapMainObject(geo, eventTrack)
    }
    async getEventObject() {
        const id = this.id
        let nowDate = Math.round(new Date().getTime() / 1000);
        let nDate = new Date();
        let timeFrom = Math.round(nDate.setHours(nDate.getHours() - 12) / 1000);
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ id, nowDate, timeFrom }))

        }
        const res = await fetch('api/getEventMarkers', params)
        const result = await res.json()
        const geo = Object.values(result.trips[0]).reduce((acc, el) => {
            el.msgs.forEach(e => {
                acc.push({ geo: [e.y, e.x], speed: e.s, time: e.tm })
            });
            return acc
        }, [])
        return geo
    }
    async getLastGeoPosition() {
        const idw = this.id
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw }))
        }
        const res = await fetch('api/parametrs', params)
        const result = await res.json()

        return [result.item.pos.y, result.item.pos.x, result.item.pos.c]
    }


    createMapMainObject(geo, eventTrack) {
        console.log(eventTrack)
        const center = [geo[0], geo[1]];
        const geoTrack = eventTrack.reduce((acc, el) => {
            acc.push(el.geo)
            return acc
        }, [])
        const maxSpeed = eventTrack.filter(el => el.speed > 90)
        console.log(maxSpeed)
        if (!mapLocal) {
            const wrap = document.querySelector('.wrapper_up');
            const maps = document.createElement('div');
            maps.setAttribute('id', 'map');
            maps.style.width = '100%';
            maps.style.height = '450px';
            wrap.appendChild(maps);
            mapLocal = L.map('map');
            mapLocal.attributionControl.setPrefix(false);

            const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            }).addTo(mapLocal);

            L.control.scale({ imperial: '' }).addTo(mapLocal);
            mapLocal.addLayer(layer);

        }
        //   mapLocal.removeLayer(eventMarkers);
        mapLocal.setView(center, 12);
        mapLocal.flyTo(center, 12);

        const nameCar = document.querySelector('.color').children[0].textContent;
        const res = `${geo[0]}, ${geo[1]}` // await reverseGeocode(geoMarker.geoY, geoMarker.geoX)
        console.log(iss)
        if (!iss) {
            const LeafIcon = L.Icon.extend({
                options: {
                    iconSize: [30, 30],
                    iconAnchor: [10, 18],
                    popupAnchor: [0, 0]
                }
            });
            const greenIcon = new LeafIcon({
                iconUrl: '../../image/trailer.png',
                iconSize: [30, 22],
                iconAnchor: [20, 20],
                popupAnchor: [0, 0],
                className: 'custom-marker'
            });
            const maxspeed = new LeafIcon({
                iconUrl: '../../image/er.png',
                iconSize: [22, 22],
                iconAnchor: [20, 20],
                popupAnchor: [0, 0],
                className: 'custom-marker'
            });
            const divIcon = L.divIcon({
                className: 'custom-marker-arrow',
                html: `<div class="wrapContainerArrow" style="pointer-events: none;height: 75px;transform: rotate(${geo[2]}deg);"><img src="../../image/arrow2.png" style="width: 20px"></div>`
            });

            iss = L.marker(center, { icon: greenIcon }).bindPopup(`${nameCar}<br>${res}`).addTo(mapLocal);
            marker = L.marker(center, { icon: divIcon }).addTo(mapLocal);
            Array.from(maxSpeed).forEach(it => {
                eventMarkers = L.marker(it.geo, { icon: maxspeed }).addTo(mapLocal);
            })


            poly = L.polyline(geoTrack, { color: 'rgb(0, 0, 204)', weight: 2 }).addTo(mapLocal);
            iss.getPopup().options.className = 'my-popup-all';

            iss.on('mouseover', function (e) {
                this.openPopup();
            });
            iss.on('mouseout', function (e) {
                this.closePopup();
            });
        } else {
            if (poly) {
                mapLocal.removeLayer(poly);
            }
            poly = L.polyline(geoTrack, { color: 'rgb(0, 0, 204)', weight: 2 }).addTo(mapLocal);
            iss.setLatLng(center).bindPopup(`${nameCar}<br>${res}`).update();
            marker.setLatLng(center).update();

            const divIconUpdated = L.divIcon({
                className: 'custom-marker-arrow',
                html: `<div class="wrapContainerArrow" style="pointer-events: none;height: 75px;transform: rotate(${geo[2]}deg);"><img src="../../image/arrow2.png" style="width: 20px"></div>`
            });

            marker.setIcon(divIconUpdated);
        }

        //  mapLocal.on('zoomend', function () {
        //      mapLocal.panTo(center);
        //  });
    }
}
