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
    const arrayId = Array.from(list).reduce((acc, el) => {
        acc.push(el.id)
        return acc
    }, [])
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ arrayId }))
    }
    const res = await fetch('/api/getGeo', params)
    const results = await res.json()
    const result = results.map(el => {
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
    initsmarkers = new InitMarkers(itog, map, resultGeoTrack)
    initsmarkers.addMarkersToMap()
    initsmarkers.viewHiddenMenuMap()
    initsmarkers.viewHiddenInfoMap()

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

