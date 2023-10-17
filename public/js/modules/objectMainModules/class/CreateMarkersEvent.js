
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
        this.setTrack = document.querySelector('.togTrack');
        this.boundViewTrackAndMarkersEvent = this.viewTrackAndMarkersEnent.bind(this);
        this.setTrack.addEventListener('click', this.boundViewTrackAndMarkersEvent);
    }

    viewTrackAndMarkersEnent() {
        console.log('нажал?')
        this.setTrack.classList.toggle('activeTrack')
        if (this.setTrack.classList.contains('activeTrack')) {
            if (this.poly) {
                mapLocal.removeLayer(this.poly);
                this.startTrack ? mapLocal.removeLayer(this.startTrack) : null
            }
            this.poly = L.polyline(this.track, { color: 'rgb(0, 0, 204)', weight: 2 }).addTo(mapLocal);
            this.startTrack ? this.startTrack.addTo(mapLocal) : null
            this.markerCreator.createMarker(this.eventMarkers)
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
        }, 10000);
        this.update();
    }

    async update() {
        const geo = await this.getLastGeoPosition()
        this.createMapMainObject(geo)
        const track = await this.getIntervalTrack()

        const prostoy = await this.getEventProstoy()
        const pressure = await this.getEventPressure()
        this.track = track.reduce((acc, el) => {
            acc.push(el.geo)
            return acc
        }, [])
        console.log(track)
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
        console.log(startTrack)
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
        const idw = this.id
        let nowDate = Math.round(new Date().getTime() / 1000);
        let nDate = new Date();
        let timeFrom = Math.round(nDate.setHours(nDate.getHours() - 10) / 1000);
        const paramss = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ nowDate, timeFrom, idw }))
        }
        const geoTest = await fetch('/api/geoLastInterval', paramss)
        const geoCard = await geoTest.json();
        const data = geoCard.resTrack.reduce((acc, el) => {
            acc.push({ geo: [el[0], el[1]], speed: el[3], time: el[4], sats: el[5], course: el[2] })
            return acc
        }, [])
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
        console.log(result)
    }


    async getEventObject(track, prostoy) {
        const id = this.id
        let nowDate = Math.round(new Date().getTime() / 1000);
        let nDate = new Date();
        let timeFrom = Math.round(nDate.setHours(nDate.getHours() - 10) / 1000);
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ id, nowDate, timeFrom }))
        }
        const res = await fetch('api/getEventMarkers', params)
        const result = await res.json()
        console.log(result)
        let oilEvent;
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
        console.log(oilEvent)
        const maxSpeed = track.filter(el => el.speed > 100 && el.speed < 140)
        const oil = oilEvent !== undefined ? oilEvent.filter(el => el.oil) : []
        const nooil = oilEvent !== undefined ? oilEvent.filter(el => el.nooil) : []
        const eventMarkersGlobal = []
        eventMarkersGlobal.push(...maxSpeed, ...oil, ...nooil, ...prostoy)
        console.log(eventMarkersGlobal)
        return eventMarkersGlobal
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
        console.log('делите?')
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
    createMarker(events) {
        this.deleteMarkers();
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
