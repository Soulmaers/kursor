
export let mapLocal, iss, marker;

import { GetDataTime } from '../../../class/GetDataTime.js'
import { Tooltip } from '../../../class/Tooltip.js';
export class CreateMarkersEvent {
    constructor(id) {
        this.id = id;
        this.markerCreator = null;
        this.tool = null;
        this.track = null;
        this.eventMarkers = null;
        this.poly = null;
        this.startTrack = null
        this.imei = null;
        this.time = null
        this.trackMarkers = {}
        this.pref = document.querySelector('.color').classList.contains('wialon') ? 'wialon' : 'kursor'
        this.setTrack = document.querySelector('.togTrack');
        this.calendar = document.querySelector('.calendar_track')
        this.button = this.calendar.querySelectorAll('.btm_formStart')
        // Сохраняем привязанные методы
        this.boundClear = this.clear.bind(this);
        this.boundOk = this.ok.bind(this);
        this.boundToggleCalendar = this.toggleCalendar.bind(this);
        this.init();
        this.initEventListeners();
    }

    reinitialize(newId) {
        this.removeEventListeners(); // Удаление старых слушателей событий
        this.id = newId; // Обновление id
        this.init(); // Переинициализация с новым id
        this.initEventListeners(); // Повторное добавление слушателей событий
    }

    initEventListeners() {
        this.button[0].addEventListener('click', this.boundClear);
        this.button[1].addEventListener('click', this.boundOk);
        this.setTrack.addEventListener('click', this.boundToggleCalendar);
    }
    removeEventListeners() {
        this.button[0].removeEventListener('click', this.boundClear);
        this.button[1].removeEventListener('click', this.boundOk);
        this.setTrack.removeEventListener('click', this.boundToggleCalendar);
    }

    times(time) {
        const day = time.getDate();
        const month = (time.getMonth() + 1).toString().padStart(2, '0');
        const year = time.getFullYear();
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
        return formattedDate
    }
    async toggleCalendar(event) {
        const element = event.target
        console.log(element)
        element.classList.toggle('activeTrack')
        if (element.classList.contains('activeTrack')) {
            this.calendar.style.display = 'flex'
            const getTime = new GetDataTime()
            this.time = await getTime.getTimeInterval(this.calendar)
        }
        else {
            this.calendar.style.display = 'none'
            Object.values(this.trackMarkers).forEach(e => {
                mapLocal.removeLayer(e.marker);
                e.marker.closeTooltip()
            })
            mapLocal.removeLayer(this.poly);
            this.startTrack ? mapLocal.removeLayer(this.startTrack) : null
            this.markerCreator.deleteMarkers()
        }
    }

    ok() {
        console.log(this.time)
        if (this.time) {
            this.calendar.style.display = 'none'
            this.calendar.children[0].children[0].value = ''
            this.viewTrackAndMarkersEnent()
        } else {
            this.calendar.children[0].children[0].value = 'выберите дату'
        }
    }
    clear() {
        console.log('здесь')
        this.calendar.style.display = 'none'
        this.calendar.previousElementSibling.classList.remove('activeTrack')
        this.calendar.children[0].children[0].value = ''
    }

    async viewTrackAndMarkersEnent() {
        this.track = await this.getIntervalTrack()
        const track = this.track.map(e => e.geo)
        const prostoy = await this.getEventProstoy()
        this.eventMarkers = await this.getEventObject(track, prostoy)
        this.eventMarkers ? this.markerCreator.createMarker(this.eventMarkers, this.track) : null
        if (this.poly) {
            mapLocal.removeLayer(this.poly);
            this.startTrack ? mapLocal.removeLayer(this.startTrack) : null
        }
        this.poly = L.polyline(track, { color: 'rgb(0, 0, 204)', weight: 2 }).addTo(mapLocal);
        //  this.startTrack ? this.startTrack.addTo(mapLocal) : null
        this.track.forEach((it, i) => {
            const icon = L.icon({
                iconUrl: '../../image/starttrack.png',
                iconSize: [10, 10],
                iconAnchor: [10, 10],
                popupAnchor: [0, 0],
                className: 'custom-marker'
            });
            if (i % 20 === 0) {
                const time = this.times(new Date(Number(it.time) * 1000));

                const divIconUpdated = L.divIcon({
                    className: 'custom-marker-arrow',
                    html: `<div class="wrapContainerArrowStart" style="pointer-events: none;transform: rotate(${it.course}deg);"><img src="../../image/arr.png" style="width: 15px; height:15px"></div>`
                });

                let direction;
                let offset;
                if (it.course >= 315 || it.course < 45) {
                    direction = "right";
                    offset = [15, 0]
                } else if (it.course >= 45 && it.course < 135) {
                    direction = "bottom";
                    offset = [0, 15]
                } else if (it.course >= 135 && it.course < 225) {
                    direction = "left";
                    offset = [-15, 0]

                } else if (it.course >= 225 && it.course < 315) {
                    direction = "top";
                    offset = [0, -15]
                }
                const eventMarkers = L.marker(it.geo, { icon: divIconUpdated }).addTo(mapLocal)
                eventMarkers.bindTooltip(`${time}<br>${it.speed} км/ч`, {
                    permanent: true,    // делает тултип постоянным
                    direction: direction,
                    offset: offset,
                    className: 'custom-tooltip',  // указываем класс тултипа для дальнейшего стилизования
                })
                eventMarkers.setOpacity(0);
                this.trackMarkers[i] = { marker: eventMarkers, tooltipText: `${time}<br>${it.speed} км/ч` };
            }
        });
        this.zoomToggleView()

    }
    zoomToggleView() {
        // Проверка масштаба карты
        if (mapLocal.getZoom() >= 12) {
            Object.values(this.trackMarkers).forEach(e => {
                e.marker.setOpacity(1)
                e.marker.openTooltip()
            });
        } else {
            Object.values(this.trackMarkers).forEach(e => {
                e.marker.setOpacity(0);
                e.marker.closeTooltip();
            });
        }
        let self = this
        // Проверка масштаба карты
        mapLocal.on('zoomend', function () {
            if (mapLocal.getZoom() >= 12) {
                self.trackMarkers ? Object.values(self.trackMarkers).forEach(e => {
                    e.marker.setOpacity(1);
                    e.marker.openTooltip();
                }) : null;
                console.log(self.trackMarkers)
            }
            else {
                self.trackMarkers ? Object.values(self.trackMarkers).forEach(e => {
                    e.marker.setOpacity(0)
                    e.marker.closeTooltip()
                }) : null;

            }
        })
    }
    hiddenTrackAndMarkersEnent() {
        Object.values(this.trackMarkers).forEach(e => {
            mapLocal.removeLayer(e.marker);
        })
        this.setTrack.classList.remove('activeTrack')
        //   this.setTrack.removeEventListener('click', this.boundViewTrackAndMarkersEvent);
        this.poly ? mapLocal.removeLayer(this.poly) : null
        this.startTrack ? mapLocal.removeLayer(this.startTrack) : null
        this.markerCreator ? this.markerCreator.deleteMarkers() : null
    }
    async init() {
        this.time = null
        this.updateInterval = setInterval(() => {
            this.update();
        }, 110000);
        this.update();
    }

    async update() {
        const geo = await this.lastGeo()
        this.createMapMainObject(geo)
        if (!this.markerCreator) {
            this.markerCreator = new MarkerCreator(mapLocal);
        }

    }

    async lastGeo() {
        const category = document.querySelector('.color')
        const idw = category.id
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idw })
        }
        const geoTest = await fetch('/api/getSens', params)
        const geoCard = await geoTest.json();
        const lat = geoCard.find(e => e.params === 'lat')
        const lon = geoCard.find(e => e.params === 'lon')
        const geo = lat && lon ? [Number(lat.value), Number(lon.value)] : []
        return geo
    }

    async getStartTrack(startTrack) {
        if (!this.startTrack) {
            const divIconUpdated = L.divIcon({
                className: 'custom-marker-arrow',
                html: `<div class="wrapContainerArrowStart" style="pointer-events: none;transform: rotate(${startTrack.course}deg);"><img src="../../image/starttrack.png" style="width: 15px; height:15px"></div>`
            });
            this.startTrack = L.marker(startTrack.geo, { icon: divIconUpdated })

        }
        else {
            this.startTrack.setLatLng(startTrack.geo).update();
            const divIconUpdated = L.divIcon({
                className: 'custom-marker-arrow',
                html: `<div class="wrapContainerArrowStart" style="pointer-events: none;transform: rotate(${startTrack.course}deg);"><img src="../../image/starttrack.png" style="width: 15px; height:15px"></div>`
            });
            this.startTrack.setIcon(divIconUpdated);
        }
    }

    async getEventProstoy() {
        const idw = this.id
        let nowDate = Math.round(new Date().getTime() / 1000);
        let nDate = new Date();
        let timeFrom = Math.round(nDate.setHours(nDate.getHours() - 10) / 1000);
        console.log(nowDate, timeFrom, idw)
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ nowDate, timeFrom, idw }))
        }
        const geoTest = await fetch('/api/logsViewId', params)
        const geoCard = await geoTest.json();
        const eventProstoy = geoCard.reduce((acc, el) => {
            const parse = JSON.parse(el.content)
            if (parse[0].event === 'Простой') {
                acc.push({ geo: JSON.parse(el.geo), prostoy: parse[0].alarm, time: el.time })
            }
            return acc
        }, [])
        return eventProstoy
    }

    createTrackMap(geoTrack) {
        if (poly) {
            mapLocal.removeLayer(poly);
        }
        poly = L.polyline(geoTrack, { color: 'rgb(0, 0, 204)', weight: 2 })
    }

    async getIntervalTrack() {
        const category = document.querySelector('.color')
        const idw = category.id
        let nowDate = Math.round(new Date().getTime() / 1000);
        let nDate = new Date();
        let timeFrom = Math.round(nDate.setHours(nDate.getHours() - 1) / 1000);
        const t1 = !this.time ? timeFrom : this.time[0]
        const t2 = !this.time ? nowDate : this.time[1] === this.time[0] ? this.time[1] + 86399 : this.time[1]
        let data;
        console.log(t1, t2)
        const paramss = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw, t1, t2 }))
        }
        console.log('тутада???')
        const geoTest = await fetch('/api/geoLastInterval', paramss)
        const geoCard = await geoTest.json();
        data = geoCard.resTrack.reduce((acc, el) => {
            acc.push({ geo: [el[0], el[1]], speed: el[3], time: el[4], sats: el[5], course: el[2] })
            return acc
        }, [])
        console.log(data)
        data.sort((a, b) => Number(a.time) - Number(b.time))
        return data
    }

    async getEventPressure() {
        const idw = this.id
        let nowDate = Math.round(new Date().getTime() / 1000);
        let nDate = new Date();
        let timeFrom = Math.round(nDate.setHours(nDate.getHours() - 10) / 1000);
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ nowDate, timeFrom, idw }))
        }
        const pressure = await fetch('/api/alarmViewId', params)
        const press = await pressure.json();
        const groupedObj = {};
        for (const item of press) {
            const { senspressure, ...rest } = item;
            if (!groupedObj[senspressure]) {
                groupedObj[senspressure] = [{ senspressure, ...rest }];
            } else {
                groupedObj[senspressure].push({ senspressure, ...rest });
            }
        }
        const results = Object.values(groupedObj);
        const result = [];
        results.forEach(el => {
            let count = 0;
            let num = 0;
            while (count < el.length) {
                if (el[count].alarm === 'Норма') {
                    //   result.push(el[count]); // добавляем текущий элемент
                    const nextIndex = count + 1;
                    if (el[nextIndex]) {
                        result.push(el[nextIndex]); // добавляем следующий элемент, если он существует и имеет alarm равный 'Норма'
                        count = nextIndex + 1; // пропускаем следующий элемент
                    } else {
                        el[num].alarm !== 'Норма' ? result.push(el[num]) : null
                        count = nextIndex; // просто пропускаем текущий элемент

                    }
                } else {
                    count++;
                }
            }
            let bool = false;
            el.forEach(e => {
                if (Object.values(e).includes('Норма')) {
                    bool = true
                }
            })
            if (!bool) {
                result.push(el[0])
            }
        })
    }

    async getEventObject(track, prostoy) {
        const id = this.id
        let nowDate = Math.round(new Date().getTime() / 1000);
        let nDate = new Date();
        let timeFrom = Math.round(nDate.setHours(nDate.getHours() - 10) / 1000);
        let oilEvent;
        if (this.pref !== 'kursor') {
            const params = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: (JSON.stringify({ id, nowDate, timeFrom }))
            }
            const res = await fetch('api/getEventMarkers', params)
            const result = await res.json()
            console.log(id, result)

            if (result.lls && Object.keys(result.lls).length !== 0) {
                oilEvent = Object.values(Object.values(result.lls)[0]).reduce((acc, e) => {
                    acc.push({
                        geo: [e.from.y, e.from.x],
                        [parseFloat(e.filled.toFixed(0)) > 0 ? 'oil' : 'nooil']: parseFloat(e.filled.toFixed(0)),
                        time: e.from.t
                    });
                    return acc
                }, [])
            }
        }
        const maxSpeed = track.filter(el => el.speed > 100 && el.speed < 140)
        const oil = oilEvent !== undefined ? oilEvent.filter(el => el.oil) : []
        const nooil = oilEvent !== undefined ? oilEvent.filter(el => el.nooil) : []
        const eventMarkersGlobal = []

        eventMarkersGlobal.push(...maxSpeed, ...oil, ...nooil, ...prostoy)
        return eventMarkersGlobal
    }

    createMapMainObject(geo) {
        const center = [geo[0], geo[1]];
        if (!mapLocal) {
            const wrap = document.querySelector('.wrapper_up');
            const maps = document.createElement('div');
            maps.setAttribute('id', 'map');
            maps.style.width = '100%';
            maps.style.height = '450px';
            wrap.appendChild(maps);
            mapLocal = L.map('map');
            mapLocal.attributionControl.setPrefix(false);
            const leaf = document.querySelector('.leaflet-control-attribution');
            leaf.style.display = 'none';
            const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            }).addTo(mapLocal);
            L.control.scale({ imperial: '' }).addTo(mapLocal);
            mapLocal.addLayer(layer);
            mapLocal.setView(center, 8);
            mapLocal.flyTo(center, 8);
        }
        else {
            var currentZoom = mapLocal.getZoom();
            mapLocal.setView(center, currentZoom);
            //   mapLocal.flyTo(center, 8);
        }

        const nameCar = document.querySelector('.color').children[0].textContent;
        const res = `${geo[0]}, ${geo[1]}` // await reverseGeocode(geoMarker.geoY, geoMarker.geoX)
        this.tool = new Tooltip(this.setTrack, [this.setTrack.getAttribute('rel')])
        if (!this.tool) {
            new Tooltip(this.setTrack, [this.setTrack.getAttribute('rel')])
        }
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
            const divIcon = L.divIcon({
                className: 'custom-marker-arrow',
                html: `<div class="wrapContainerArrow" style="pointer-events: none;height: 75px;transform: rotate(${geo[2]}deg);"><img src="../../image/arrow2.png" style="width: 20px"></div>`
            });

            iss = L.marker(center, { icon: greenIcon }).bindPopup(`${nameCar}<br>${res}`).addTo(mapLocal);
            marker = L.marker(center, { icon: divIcon }).addTo(mapLocal);
            iss.getPopup().options.className = 'my-popup-all';
            iss.on('mouseover', function (e) {
                this.openPopup();
            });
            iss.on('mouseout', function (e) {
                this.closePopup();
            });


        } else {
            console.log('здесь?')
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

export class MarkerCreator {
    constructor(map) {
        this.map = map;
        this.iconUrls = {
            speed: '../../image/upspeed.png',
            oil: '../../image/oil1.png',
            nooil: '../../image/refuel.png',
            prostoy: '../../image/pr.png'
        };
        this.markers = [];
    }

    deleteMarkers() {
        for (let marker of this.markers) {
            this.map.removeLayer(marker);
        }
        this.markers = [];
    }
    contentPopup(e) {
        return {
            speed: `Скорость: ${e.speed} км/ч`,
            oil: `Заправка: ${e.oil} л`,
            nooil: `Слив: ${e.nooil} л`,
            prostoy: `Простой: ${e.prostoy}`


        };
    }
    createMarker(events, track) {
        this.deleteMarkers();
        // console.log(track)

        events.forEach(e => {
            const key = Object.keys(e)[1];
            const iconUrl = this.iconUrls[key]
            const icon = L.icon({
                iconUrl: iconUrl,
                iconSize: [20, 20],
                iconAnchor: [20, 20],
                popupAnchor: [0, 0],
                className: 'custom-marker'
            });
            const contentPopup = this.contentPopup(e)[key];
            const time = this.times(new Date(Number(e.time) * 1000));
            const eventMarkers = L.marker(e.geo, { icon }).bindPopup(`${contentPopup}<br>Время: ${time}`).addTo(this.map);
            eventMarkers.on('mouseover', function (e) {
                this.openPopup();
            });
            eventMarkers.on('mouseout', function (e) {
                this.closePopup();
            });
            this.markers.push(eventMarkers);
        })
    }
}
