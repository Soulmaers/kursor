import { InitMarkers } from './class/InitMarkers.js'
import { convertTime } from '..//helpersFunc.js';

export let initsmarkers;
let resultGeoTrack = {}
export let map


export async function kartaContainer(elem) {
    const karta = document.getElementById('gMap')
    if (!karta) {
        const div = document.createElement('div')
        div.classList.add('globalmap')
        div.setAttribute('id', 'gMap')
        div.style.width = '100%'
        div.style.height = '100%'
        div.style.zIndex = 0;
        elem.appendChild(div)

        map = L.map('gMap').setView([59.9386, 30.3141], 9);
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
        setTimeout(() => {
            map.invalidateSize();
        }, 0);
    }
    const list = document.querySelectorAll('.listItem')

    const arrayId = [];
    const arrayIdKursor = [];

    Array.from(list).reduce((acc, el) => {
        if (el.classList.contains('wialon')) {
            arrayId.push(el.id);
        }
        if (el.classList.contains('kursor')) {
            arrayIdKursor.push(el.id);
        }
        return acc;
    }, []);

    const paramsW = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ arrayId }),
    };


    const resW = await fetch('/api/getGeo', paramsW);
    const resultsW = await resW.json();
    console.log(resultsW)
    const promises = arrayIdKursor.map(async el => {
        const idw = el
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw }))
        }
        const ress = await fetch('api/objectId', param)
        const object = await ress.json()
        const port = object[0].port
        const paramsK = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idw, port }),
        };
        const resK = await fetch('/api/getParamsKursor', paramsK);
        const resultsK = await resK.json();
        console.log(resultsK)
        const res = resultsK.reduce((acc, e) => {
            const geo = [e.lat, e.lon]
            const status = Number(e.speed) === 0 ? 'Стоянка' : 'Поездка'
            const meliage = Number(Number(e.meliage).toFixed(2))
            const speed = Number(Number(e.speed).toFixed(0))
            acc.push(e.idObject, geo, Number(e.course), speed, status, meliage)
            return acc
        }, [])
        return res
    })
    const res = await Promise.allSettled(promises)
    const resultsK = res
        .filter(promise => promise.status === 'fulfilled')
        .map(promise => promise.value);
    const allData = resultsW.concat(resultsK)
    const clearArray = Array.from(document.querySelectorAll('.checkInList')).reduce((acc, el) => {
        acc.push(el.closest('.listItem').id)
        return acc
    }, [])
    const originalObjectsData = allData.reduce((acc, el) => {
        if (clearArray.includes(el[0])) {
            acc.push(el)
        }
        return acc
    }, [])
    const result = originalObjectsData.map(el => {
        let newArr = [...el]
        newArr[5] = el[5] == null ? undefined : convertTime(el[5])
        newArr.push(el[5] > 3600 ? 'off' : 'on')
        return newArr
    })
    const itog = result.reduce((acc, el) => {
        const element = Array.from(list).filter(it => el[0] === it.id)
        const name = element[0].children[0].textContent
        const group = element[0].closest('.groups').getAttribute('rel')
        acc.push([...el, name, group])
        return acc
    }, [])
    console.log(itog)
    initsmarkers = new InitMarkers(itog, map, resultGeoTrack)
    initsmarkers.addMarkersToMap()
    initsmarkers.viewHiddenMenuMap()
    initsmarkers.viewHiddenInfoMap()
    initsmarkers.toggleMarkersIcon()

    const checkMarkers = document.querySelectorAll('.checkMarkers')


    checkMarkers.forEach((marker, index) => {
        if (!marker.hasListener) {
            marker.addEventListener('click', () => {
                marker.classList.toggle('checkMark');
                switch (index) {
                    case 0:
                        const checkMark = marker.classList.contains('checkMark');
                        const siblingTextElement = marker.nextSibling; // assuming text node is next sibling
                        if (siblingTextElement) {
                            siblingTextElement.textContent = checkMark ? 'Группа' : 'Тип';
                        }
                        initsmarkers.changeMarkersIcon();
                        break;
                    case 1:
                        initsmarkers.nameObjectView();
                        break;
                    default:
                        break;
                }
            });
            marker.hasListener = true;
        }
    });
}

