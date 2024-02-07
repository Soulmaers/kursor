
export let mapLocal, iss, marker;

import { times } from '../../popup.js'
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
        this.pref = document.querySelector('.color').classList.contains('wialon') ? 'wialon' : 'kursor'
        this.setTrack = document.querySelector('.togTrack');
        this.boundViewTrackAndMarkersEvent = this.viewTrackAndMarkersEnent.bind(this);
        this.setTrack.addEventListener('click', this.boundViewTrackAndMarkersEvent)
    }

    viewTrackAndMarkersEnent() {
        const track = this.track.map(e => e.geo)
        this.setTrack.classList.toggle('activeTrack')
        if (this.setTrack.classList.contains('activeTrack')) {
            if (this.poly) {
                mapLocal.removeLayer(this.poly);
                this.startTrack ? mapLocal.removeLayer(this.startTrack) : null
            }
            this.poly = L.polyline(track, { color: 'rgb(0, 0, 204)', weight: 2 }).addTo(mapLocal);

            this.startTrack ? this.startTrack.addTo(mapLocal) : null
            this.eventMarkers ? this.markerCreator.createMarker(this.eventMarkers, this.track) : null
        } else {
            mapLocal.removeLayer(this.poly);
            this.startTrack ? mapLocal.removeLayer(this.startTrack) : null
            this.markerCreator.deleteMarkers()
        }
    }
    hiddenTrackAndMarkersEnent() {
        this.setTrack.classList.remove('activeTrack')
        this.setTrack.removeEventListener('click', this.boundViewTrackAndMarkersEvent);
        this.poly ? mapLocal.removeLayer(this.poly) : null
        this.startTrack ? mapLocal.removeLayer(this.startTrack) : null
        this.markerCreator ? this.markerCreator.deleteMarkers() : null
    }
    async init() {
        this.updateInterval = setInterval(() => {
            this.update();
        }, 60000);
        this.update();
    }

    async update() {
        const track = await this.getIntervalTrack()
        console.log(track)
        const geo = track.length !== 0 ? [track[track.length - 1].geo[0], track[track.length - 1].geo[1], track[track.length - 1].course] : []
        this.createMapMainObject(geo)
        const prostoy = await this.getEventProstoy()
        //  const pressure = await this.getEventPressure()
        this.track = track
        /* this.track = track.reduce((acc, el) => {
             acc.push(el.geo)
             return acc
         }, [])*/
        //  this.eventMarkers = null;
        this.eventMarkers = await this.getEventObject(track, prostoy)
        if (!this.markerCreator) {
            this.markerCreator = new MarkerCreator(mapLocal);
        }
        if (track.length !== 0) {
            const startTrack = {
                geo: track[0].geo, course: track[0].course, time: track[0].time
            }
            this.getStartTrack(startTrack)
        }
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
        const idw = this.id
        let nowDate = Math.round(new Date().getTime() / 1000);
        let nDate = new Date();
        let timeFrom = Math.round(nDate.setHours(nDate.getHours() - 10) / 1000);
        let data;
        if (!category.classList.contains('kursor')) {
            const t1 = timeFrom
            const t2 = nowDate
            const active = idw
            const param = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: (JSON.stringify({ active, t1, t2 }))
            }
            const rest = await fetch('/api/viewSortChart', param)
            const resultt = await rest.json()
            // console.log(resultt)
            resultt.sort((a, b) => Number(a.time) - Number(b.time));
            data = resultt.reduce((acc, el) => {
                acc.push({ geo: [JSON.parse(el.geo)[0], JSON.parse(el.geo)[1]], speed: el.speed, time: el.time, sats: el.sats, course: el.curse })
                return acc
            }, [])
        }
        else {
            const paramss = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: (JSON.stringify({ nowDate, timeFrom, idw }))
            }
            const geoTest = await fetch('/api/geoLastIntervalKursor', paramss)
            const geoCard = await geoTest.json();
            data = geoCard.resTrack.reduce((acc, el) => {
                acc.push({ geo: [el[0], el[1]], speed: el[3], time: el[4], sats: el[5], course: el[2] })
                return acc
            }, [])
        }
        //  console.log(data)
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
            const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            }).addTo(mapLocal);
            L.control.scale({ imperial: '' }).addTo(mapLocal);
            mapLocal.addLayer(layer);
        }
        mapLocal.setView(center, 8);
        mapLocal.flyTo(center, 8);
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
        track.forEach(it => {
            const icon = L.icon({
                iconUrl: '../../image/arrow2.png',
                iconSize: [5, 5],
                iconAnchor: [5, 5],
                popupAnchor: [0, 0],
                className: 'custom-marker'
            });
            const time = times(new Date(Number(it.time) * 1000));
            const eventMarkers = L.marker(it.geo, { icon }).bindPopup(`Время: ${time}<br>Скорость:${it.speed} км/ч`).addTo(this.map);
            eventMarkers.setOpacity(0);
            eventMarkers.on('mouseover', function (e) {
                this.openPopup();
            });
            eventMarkers.on('mouseout', function (e) {
                this.closePopup();
            });
        })
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
            const time = times(new Date(Number(e.time) * 1000));
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
