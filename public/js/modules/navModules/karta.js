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
    const objCondition = {
        0: 'Стоянка',
        1: 'Движется',
        2: 'Остановка'
    }
    const arrayId = Array.from(list).map(el => el.id)
    const promises = arrayId.map(async el => {
        const idw = el
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw }))
        }
        const res = await fetch('api/getSens', param)
        const data = await res.json()
        const speed = data.find(e => e.params === 'speed')
        const lat = data.find(e => e.params === 'lat')
        const lon = data.find(e => e.params === 'lon')
        const course = data.find(e => e.params === 'course')
        const engine = data.find(e => e.params === 'engine')
        const lastTime = data.find(e => e.params === 'last_valid_time')
        let condition;
        if (speed.value && engine.value) {
            const num = (Number(speed.value) > 0 && Number(engine.value) === 1) ? 1
                : (Number(speed.value) === 0 && Number(engine.value) === 1) ? 2
                    : (Number(speed.value) === 0 && Number(engine.value) === 0) ? 0 : undefined;
            condition = objCondition[num]
        }
        const geo = [lat.value, lon.value]
        if (lastTime.value !== null) {
            return ([el, geo, Number(course.value), Number(speed.value), condition, lastTime.value])
        }
        else {
            return []
        }
    }).filter(t => t.length !== 0)
    const res = await Promise.allSettled(promises)
    const allData = res
        .filter(promise => promise.status === 'fulfilled')
        .map(promise => promise.value);

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
        const lastTime = Math.floor(new Date().getTime() / 1000) - Number(el[5])
        newArr[5] = el[5] == null ? null : convertTime(Number(lastTime))
        newArr.push(el[5] !== null ? lastTime > 3600 ? 'off' : 'on' : '-')
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
    initsmarkers.toggleMarkersIcon()
    initsmarkers.createInfoControll()

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

