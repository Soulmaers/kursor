

export async function geoloc() {
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
        body: (JSON.stringify({ nowDate, timeFrom, idw }))
    }
    const geoTest = await fetch('/api/geoloc', params)
    const geoCard = await geoTest.json()
    const geo = geoCard.resTrack
    const geoMarker = geoCard.resMarker
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
    const polyline = L.polyline(geo, { color: 'rgb(0, 0, 204)', weight: 1 });
    polyline.addTo(map);
    let iss;
    const nameCar = document.querySelector('.color').children[0].children[0].textContent
    const center = [geoMarker.geoY, geoMarker.geoX,]
    console.log(center)
    map.setView(center, 15)
    map.flyTo(center, 15)
    if (!iss) {
        var LeafIcon = L.Icon.extend({
            options: {
                iconSize: [30, 30],
                iconAnchor: [10, 18],
                popupAnchor: [0, 0]
            }
        });
        var greenIcon = new LeafIcon({
            iconUrl: '../../image/iconCar2.png',
        })
        iss = L.marker(center, { icon: greenIcon }).bindPopup(nameCar).addTo(map);
        iss.on('mouseover', function (e) {
            this.openPopup();
        });
        iss.on('mouseout', function (e) {
            this.closePopup();
        });
    }
    iss.setLatLng(center, /*{ icon: greenIcon }*/).update();
}