//e156e8924c3a4e75bc1eac26f153457e-ключ апи https://opencagedata.com/dashboard#geocoding
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
    console.log(geoMarker)
    const mapss = document.getElementById('map')
    if (mapss) {
        mapss.remove();
    }
    Object.keys(geoMarker).length !== 0 ? createMap(geo, geoMarker) : isProcessing = false;
}

export async function createMap(geo, geoMarker) {
    let count = 0;
    count++;
    const container = L.DomUtil.get('map');
    if (container != null) {
        container._leaflet_id = null;
    }
    const wrap = document.querySelector('.wrapper_up');
    const maps = document.createElement('div');
    maps.setAttribute('id', 'map');
    maps.style.width = '100%';
    maps.style.height = '450px';
    wrap.appendChild(maps);
    const map = L.map('map');
    map.attributionControl.setPrefix(false);
    const leaf = document.querySelector('.leaflet-control-attribution');
    leaf.style.display = 'none';
    const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);
    L.control.scale({
        imperial: ''
    }).addTo(map);

    map.addLayer(layer);

    const polyline = L.polyline(geo, { color: 'rgb(0, 0, 204)', weight: 2 });
    polyline.addTo(map);
    let iss;

    const nameCar = document.querySelector('.color').children[0].textContent;
    const center = [geoMarker.geoY, geoMarker.geoX];

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
            iconSize: [30, 30],
            iconAnchor: [20, 20],
            popupAnchor: [0, 0],
            className: 'custom-marker'
        });

        map.setView(center, 12);
        map.flyTo(center, 12);
        const res = await reverseGeocode(geoMarker.geoY, geoMarker.geoX)
        iss = L.marker(center, { icon: greenIcon }).bindPopup(`${nameCar}<br>${res}`).addTo(map);
        iss.getPopup().options.className = 'my-popup-all';
        iss.on('mouseover', function (e) {
            this.openPopup();
        });
        iss.on('mouseout', function (e) {
            this.closePopup();
        });

    }

    map.on('zoomend', function () {
        map.panTo(center);
    });

    isProcessing = false;
}


export async function reverseGeocode(geoY, geoX) {
    const API_KEY = 'e156e8924c3a4e75bc1eac26f153457e';
    const API_URL = `https://api.opencagedata.com/geocode/v1/json`
    var lat = geoY; // Ваша широта
    var lng = geoX; // Ваша долгота

    try {
        const responses = await fetch(`${API_URL}?q=${lat},${lng}&key=${API_KEY}&no_annotations=1&language=ru`);
        const data = await responses.json();
        var address = data.results[0].components;
        const adres = [];
        adres.push(address.road_reference)
        adres.push(address.municipality)
        adres.push(address.county)
        adres.push(address.town)
        adres.push(address.state)
        adres.push(address.country)
        const res = Object.values(adres).filter(val => val !== undefined).join(', ');
        return res
    }
    catch (e) {
        console.log(e)
        return [geoY, geoX]
    }

}
export async function createMapsUniq(geoTrack, geo, num) {
    const mapss = document.getElementById('mapOil')
    if (mapss) {
        mapss.remove();
    }
    const main = document.querySelector('.main')
    const maps = document.createElement('div')
    maps.classList.add('mapsOilCard')
    maps.setAttribute('id', 'mapOil')
    main.style.position = 'relative'
    maps.style.zIndex = 2099;
    main.appendChild(maps)
    const map = L.map('mapOil')
    console.log(maps)

    const polyline = L.polyline(geoTrack, { color: 'darkred', weight: 2 });
    polyline.addTo(map);
    var LeafIcon = L.Icon.extend({
        options: {
            iconSize: [30, 30],
            iconAnchor: [0, -10],
            popupAnchor: [20, 24]
        }
    });

    let cl;
    let iss;
    let center;
    let formattedDate;
    const nameCar = document.querySelector('.color').children[0].textContent
    var customIcon = new LeafIcon({
        iconUrl: num !== 'oil?' ? '../../image/iconCar2.png' : '../../image/ref.png',
        iconSize: [30, 30],
        iconAnchor: [0, -10],
        popupAnchor: [20, 24],
        className: 'custom-marker-alarm'
    });
    if (num === 'bar') {
        const center = [geo.geo[0], geo.geo[1]];
        const date = new Date(geo.dates);
        const day = date.getDate();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
        maps.style.width = '300px';
        maps.style.height = '300px';
        maps.style.position = 'absolute';
        maps.style.left = '25px';
        maps.style.top = '500px';
        const iss = L.marker(center, { icon: customIcon }).addTo(map);
        const popupContent = `Объект: ${nameCar}<br>Время: ${formattedDate}<br>Скорость: ${geo.speed} км/ч<br>Зажигание: ${geo.stop}`;
        const popup = L.popup({ className: 'my-popup-bar', autoPan: false });
        iss.bindPopup(popup).addTo(map);
        popup.setContent(popupContent);
        map.setView(center, 12);
        map.flyTo(center, 12);
        map.attributionControl.setPrefix(false);
        const leaf = document.querySelector('.leaflet-control-attribution');
        leaf.style.display = 'none';
        const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        L.control.scale({ imperial: '' }).addTo(map);
        map.addLayer(layer);
        map.on('zoomend', function () {
            map.panTo(center);
        });
        const res = await reverseGeocode(center[0], center[1])
        if (res) {
            const updatedContent = `${popupContent}<br>Адрес: ${res}`;
            popup.setContent(updatedContent);
        }
        iss.on('mouseover', function (e) {
            this.openPopup();
        });

        iss.on('mouseout', function (e) {
            this.closePopup();
        });
    }
    else {
        if (num === 'oil') {
            center = [geo.geo[0], geo.geo[1]]
            const res = await reverseGeocode(center[0], center[1])
            maps.style.width = '300px';
            maps.style.height = '300px'
            maps.style.position = 'absolute'
            maps.style.left = '25px';
            maps.style.top = '500px';
            cl = 'my-popup-oil'
            iss = L.marker(center, { icon: customIcon }).bindPopup(`Объект: ${nameCar}<br>Заправлено: ${geo.zapravka} л.<br>Дата: ${geo.time}<br>Адрес: ${res}`, { className: 'my-popup-oil' }).addTo(map);
        }
        if (num === 'alarm') {
            center = [geo.geoY, geo.geoX]
            const res = await reverseGeocode(center[0], center[1])
            maps.style.width = '350px';
            maps.style.height = '350px'
            maps.style.position = 'absolute'
            maps.style.left = '580px';
            maps.style.top = '40px';
            cl = 'my-popup-alarm'
            iss = L.marker(center, { icon: customIcon }).bindPopup(`Объект: ${geo.info.car}\nВремя: ${geo.info.time}\nКолесо: ${geo.info.tyres}\nP,bar: ${geo.info.bar}\nt,C: ${geo.info.temp}\nСкорость: ${geo.speed} км/ч\nУведомление: ${geo.info.alarm}\nАдрес: ${res}`, { width: 60, className: 'my-popup-alarm', autoPan: false }).addTo(map);
        }

        map.setView(center, 12)
        map.flyTo(center, 12)
        // const iss = L.marker(alarmCenter, { icon: customIcon }).bindPopup(`Объект: ${geoTrack.info.car}\nВремя: ${geoTrack.info.time}\nКолесо: ${geoTrack.info.tyres}\nP,bar: ${geoTrack.info.bar}\nt,C: ${geoTrack.info.temp}\nСкорость: ${geoTrack.speed} км/ч\nУведомление: ${geoTrack.info.alarm}`, { width: 60, className: 'my-popup-alarm', autoPan: false }).addTo(map);
        iss.getPopup().options.className = cl
        iss.on('mouseover', function (e) {
            this.openPopup();
        });
        iss.on('mouseout', function (e) {
            this.closePopup();
        });
        map.attributionControl.setPrefix(false)
        const leaf = document.querySelector('.leaflet-control-attribution');
        leaf.style.display = 'none';
        const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        L.control.scale({
            imperial: ''
        }).addTo(map);
        map.addLayer(layer);
        map.on('zoomend', function () {
            map.panTo(center);
        });
    }
}
