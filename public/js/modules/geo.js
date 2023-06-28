
const login = document.querySelectorAll('.log')[1].textContent
let isProcessing = false;
export async function geoloc() {
    if (isProcessing) {
        return;
    }
    isProcessing = true;
    console.log('гео')
    let nowDate = Math.round(new Date().getTime() / 1000)
    let nDate = new Date();
    let timeFrom = Math.round(nDate.setHours(nDate.getHours() - 12) / 1000);
    const idw = document.querySelector('.color').id
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ nowDate, timeFrom, idw, login }))
    }
    const geoTest = await fetch('/api/geoloc', params)
    const geoCard = await geoTest.json()
    const geo = geoCard.resTrack
    const geoMarker = geoCard.resMarker
    createMap(geo, geoMarker)

}

export function createMap(geo, geoMarker, geoTrack) {
    console.log(geoMarker)
    console.log(geoTrack)
    const mapss = document.getElementById('map')
    if (mapss) {
        mapss.remove();
    }
    let count = 0;
    count++
    const container = L.DomUtil.get('map');
    if (container != null) {
        container._leaflet_id = null;
    }
    const wrap = document.querySelector('.wrapper_up')
    const maps = document.createElement('div')
    maps.setAttribute('id', 'map')
    maps.style.width = '100%';
    maps.style.height = '90vh',
        wrap.appendChild(maps)
    const map = L.map('map')
    map.attributionControl.setPrefix(false)
    const leaf = document.querySelector('.leaflet-control-attribution');
    leaf.style.display = 'none';
    const layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">!</a> contributors'
    });
    map.addLayer(layer);
    //if (geo) {
    const polyline = L.polyline(geo, { color: !geoTrack ? 'rgb(0, 0, 204)' : 'darkred', weight: 2 });
    polyline.addTo(map);
    // }

    let iss;
    let iss2;
    const nameCar = document.querySelector('.color').children[0].textContent


    const center = [geoMarker.geoY, geoMarker.geoX]
    console.log(center)


    if (!iss) {
        var LeafIcon = L.Icon.extend({
            options: {
                iconSize: [30, 30],
                iconAnchor: [10, 18],
                popupAnchor: [0, 0]
            }
        });
        var greenIcon = new LeafIcon({
            iconUrl: '../../image/iconCar2.png'

        })
        const alarmMarker = new LeafIcon({
            iconUrl: '../../image/er.png'
        })
        if (geoTrack) {
            iss = L.marker(center, { icon: greenIcon }).bindPopup(nameCar).addTo(map);
            iss.on('mouseover', function (e) {
                this.openPopup();
            });
            iss.on('mouseout', function (e) {
                this.closePopup();
            });
            const alarmCenter = [geoTrack.geoY, geoTrack.geoX]
            map.setView(alarmCenter, 12)
            map.flyTo(alarmCenter, 12)
            iss2 = L.marker(alarmCenter, { icon: alarmMarker }).bindPopup(`Объект: ${geoTrack.info.car}\nВремя: ${geoTrack.info.time}\nКолесо: ${geoTrack.info.tyres}\nP,bar: ${geoTrack.info.bar}\nt,C: ${geoTrack.info.temp}\nАларм: ${geoTrack.info.alarm}`, { className: 'my-popup' }).addTo(map);
            iss2.on('mouseover', function (e) {
                this.openPopup();
            });
            iss2.on('mouseout', function (e) {
                this.closePopup();
            });
        } else {
            map.setView(center, 12)
            map.flyTo(center, 12)
            iss = L.marker(center, { icon: greenIcon }).bindPopup(nameCar).addTo(map);
            iss.on('mouseover', function (e) {
                this.openPopup();
            });
            iss.on('mouseout', function (e) {
                this.closePopup();
            });
        }
    }
    iss.setLatLng(center, /*{ icon: greenIcon }*/).update();
    isProcessing = false;
}
