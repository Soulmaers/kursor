import { visual } from '../../visual.js'


export class InitMarkers {
    static markers = {}; // Хранилище для маркеров
    static markersArrow = {}//Хранилище маркеров курса
    static polyMode = {}//Хранилище полилиний
    static iconsMode = "normal";
    static namesMode = 'normal'
    static trackMode = 'normal'
    constructor(list, map, geoTrack) {
        this.list = list;
        this.map = map;
        this.geoTrack = geoTrack;
        this.settings = document.querySelector('.settingsMap')
        this.container = document.querySelector('.containerSettingsMap')
        this.objIconsMarkers = {}
        this.listObject = document.querySelectorAll('.listItem')
        this.tableInfoCar = document.querySelector('.tableInfoCar')
    }

    opasityMarkers(event) {
        const objectId = event.id
        const marker = InitMarkers.markers[objectId]
        const markerArrow = InitMarkers.markersArrow[objectId]
        if (marker) {
            console.log(marker)
            Object.values(InitMarkers.markers).forEach(e => {
                e.setOpacity(0.0)
                if (e._tooltip) {
                    e.closeTooltip()
                }

            })
            Object.values(InitMarkers.markersArrow).forEach(e => {
                e.setOpacity(0.0)
                if (e._tooltip) {
                    e.closeTooltip()
                }
            })
            if (marker._tooltip) {
                marker.openTooltip()
            }
            marker.setOpacity(1)
            markerArrow.setOpacity(1)
            const markerPosition = marker.getLatLng()
            this.map.setView(markerPosition, 8)
        }
    }
    opasityMarkersBack(event) {
        Object.values(InitMarkers.markers).forEach(e => {
            e.setOpacity(1)
            if (e._tooltip) {
                e.openTooltip()
            }
        })
        Object.values(InitMarkers.markersArrow).forEach(e => {
            e.setOpacity(1)
        })
        //  this.map.setView([59.9386, 30.3141], 9)
    }
    clickMarkers(event) {
        const marker = event.target
        console.log(marker)
        this.listObject.forEach(el => {
            if (el.id === marker.id) {
                visual(el)
            }
        })
    }

    viewHiddenInfoMap() {
        this.tableInfoCar.addEventListener('mouseenter', () => {
            Array.from(this.tableInfoCar.children[0].children).forEach(el => {
                el.style.display = 'flex'
            })
            this.tableInfoCar.children[0].style.justifyContent = 'space-around'
            this.tableInfoCar.children[0].style.width = '300px'
        })
        this.tableInfoCar.addEventListener('mouseleave', () => {
            const iconMapsInfoActive = document.querySelector('.iconMapsInfoActive')
            if (!iconMapsInfoActive) {
                console.log('тут?')
                Array.from(this.tableInfoCar.children[0].children).forEach(el => {
                    el.style.display = 'none'
                    this.tableInfoCar.children[0].children[0].style.display = 'flex'
                })
                this.tableInfoCar.children[0].style.justifyContent = ''
                this.tableInfoCar.children[0].style.width = ''
            }

        })
    }

    viewHiddenMenuMap() {
        this.settings.addEventListener('mouseenter', () => {
            this.container.style.display = 'flex'
            this.settings.style.width = '165px'
            this.settings.firstElementChild.innerHTML = `<i class="fas fa-cogs" style="padding-right:10px" ></i> Настройки`
        })
        this.settings.addEventListener('mouseleave', () => {
            this.container.style.display = 'none'
            this.settings.style.width = '30px'
            this.settings.firstElementChild.innerHTML = `<i class="fas fa-cogs"></i>`
        })
    }

    nameObjectView() {
        console.log(InitMarkers.namesMode)
        InitMarkers.namesMode = InitMarkers.namesMode === 'normal' ? 'alternate' : 'normal';
        console.log(InitMarkers.namesMode)
        Object.values(InitMarkers.markers).forEach(marker => {
            if (InitMarkers.namesMode !== 'normal') {
                marker.bindTooltip(InitMarkers.iconsMode === 'normal' ? marker.group : marker.name, {
                    permanent: true,    // делает тултип постоянным
                    direction: "top",  // устанавливает позицию тултипа относительно маркера
                    className: 'my-custom-tooltip',  // указываем класс тултипа для дальнейшего стилизования
                }).openTooltip();
            }
            else {
                marker.unbindTooltip();
            }

        });
    }
    toggleMarkersIcon() {
        console.log('здесь?')
        const checkInList = document.querySelectorAll('.checkInList')
        checkInList.forEach(el => {
            const idw = el.closest('.listItem').id

            if (InitMarkers.markers[idw]) {
                if (el.classList.contains('changeColorCheck')) {
                    this.map.removeLayer(InitMarkers.markers[idw]);
                    this.map.removeLayer(InitMarkers.markersArrow[idw]);
                    InitMarkers.markers[idw].isTrackActive ? InitMarkers.polyMode[idw].remove(this.map) : null
                }
                else {
                    InitMarkers.markers[idw].addTo(this.map)
                    InitMarkers.markers[idw].isTrackActive ? InitMarkers.polyMode[idw].addTo(this.map) : null
                    this.list.forEach(it => {
                        if (it[0] === idw) {
                            it[4] !== 'Стоянка' ? InitMarkers.markersArrow[idw].addTo(this.map) : this.map.removeLayer(InitMarkers.markersArrow[idw]);
                        }
                    })
                }
            }
        })
    }
    changeMarkersIcon() {
        InitMarkers.iconsMode = InitMarkers.iconsMode === "normal" ? "alternate" : "normal";
        Object.values(InitMarkers.markers).forEach(marker => {
            let newIcon;
            const LeafIcon = L.Icon.extend({
                options: {
                    iconSize: [30, 30],
                    iconAnchor: [10, 18],
                    popupAnchor: [0, 0]
                }
            });
            if (InitMarkers.iconsMode === 'normal') {
                newIcon = new LeafIcon({
                    iconUrl: '../../image/trailer.png',
                    iconSize: [30, 22],
                    iconAnchor: [20, 20],
                    popupAnchor: [0, 0],
                    className: 'custom-markers'
                });
                marker.setTooltipContent(marker.group)
            } else {
                newIcon = new LeafIcon({
                    iconUrl: this.objIconsMarkers[marker.group],
                    iconSize: [30, 30],
                    iconAnchor: [20, 20],
                    popupAnchor: [0, 0],
                    className: 'custom-markers-group'
                });
                marker.setTooltipContent(marker.name)
            }
            marker.setIcon(newIcon);
        });
    }

    async lastTravelTrek(event) {
        let nowDate = Math.round(new Date().getTime() / 1000);
        let nDate = new Date();
        let timeFrom = Math.round(nDate.setHours(nDate.getHours() - 12) / 1000);
        const idw = event.target.id;
        const marker = InitMarkers.markers[idw];
        marker.isTrackActive = !marker.isTrackActive;

        if (marker.isTrackActive) {
            event.target.style.color = 'rgba(6, 28, 71, 1)'
            const params = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: (JSON.stringify({ nowDate, timeFrom, idw }))
            }
            const geoTest = await fetch('/api/geoloc', params)
            const geoCard = await geoTest.json();
            const coordinates = geoCard.resTrack.reduce((acc, el) => {
                acc.push([el[0], el[1]])
                return acc
            }, [])
            if (InitMarkers.polyMode[idw]) {
                InitMarkers.polyMode[idw].setLatLngs(coordinates);
            }
            else {
                const poly = L.polyline(coordinates, { color: 'rgb(0, 0, 204)', weight: 1 });
                InitMarkers.polyMode[idw] = poly
            }
            InitMarkers.polyMode[idw].addTo(this.map);
        }

        else {
            event.target.style.color = 'gray'
            InitMarkers.polyMode[idw].remove(this.map)
        }
    }

    addMarkersToMap() {
        const uniqueElements = Array.from(new Set(this.list.map(subarr => subarr[8])));
        uniqueElements.forEach((el, index) => {
            this.objIconsMarkers[el] = `../../../image/${index + 1}.png`
        })
        this.list.forEach(item => {
            const [id, coordinates, course, speed, state, relevance, , name, group] = item

            const LeafIcon = L.Icon.extend({
                options: {
                    iconSize: [30, 30],
                    iconAnchor: [10, 18],
                    popupAnchor: [0, 0]
                }
            });
            const iconCar = new LeafIcon({
                iconUrl: '../../image/trailer.png',
                iconSize: [30, 22],
                iconAnchor: [20, 20],
                popupAnchor: [0, -10],
                className: 'custom-markers'
            });
            var divIcon = L.divIcon({
                className: 'custom-marker-arrow',
                html: `<div class="wrapContainerArrow" style="pointer-events: none;height: 75px;transform: rotate(${course}deg);"><img src="../../image/arrow2.png" style="width: 20px"></div>`
            });
            const buttonHTML = `<i class="fas fa-check markerTrack" id=${id} style="margin-right:5px; cursor:pointer"></i><span class="titlePopupPoly">Построить трек</span>`;

            if (InitMarkers.markers[id]) {  // Если маркер с таким ID уже есть, просто обновляем его координаты
                InitMarkers.markers[id].setLatLng(coordinates);
                InitMarkers.markersArrow[id].setLatLng(coordinates)
                let markerDOM = InitMarkers.markersArrow[id].getElement();
                if (markerDOM) {
                    markerDOM.children[0].style.transform = `rotate(${course}deg)`
                }
                InitMarkers.markers[id].setPopupContent(`Группа: ${group}<br>Объект: ${name}<br>Актуальность данных: ${relevance}<br>Cостояние: ${state}<br>${state === 'Поездка' ? `Скорость: ${speed} км/ч<br>` : ''}Координаты: ${coordinates}<br>${buttonHTML}`);
            } else {  // Иначе создаем новый маркер
                const marker = L.marker(coordinates, { icon: iconCar }).addTo(this.map);
                const markers = L.marker(coordinates, { icon: divIcon })
                state !== 'Стоянка' ? markers.addTo(this.map) : this.map.removeLayer(markers);

                marker.bindPopup(`Группа: ${group}<br>Объект: ${name}<br>Актуальность данных: ${relevance}<br>Cостояние: ${state}<br>${state === 'Поездка' ? `Скорость: ${speed} км/ч<br>` : ''}Координаты: ${coordinates}<br>${buttonHTML}`, { className: 'my-popup-markers' });
                marker.group = group;
                marker.name = name;

                marker.id = id;
                marker.isTrackActive = false;
                marker.on('mouseover', function (e) {
                    this.openPopup();
                });
                marker.on('mouseout', function (e) {
                    setTimeout(() => this.closePopup(), 2000);
                });
                // Слушатель событий popupopen
                marker.on('popupopen', (e) => {
                    let popupContent = e.popup._contentNode;
                    const element = popupContent.querySelector('.markerTrack');
                    const marker = InitMarkers.markers[id];
                    marker.isTrackActive ? element.style.color = 'rgba(6, 28, 71, 1)' : element.style.color = 'gray'
                    // Проверяем, было ли уже добавлено событие click
                    if (!popupContent.clickEventAttached) {
                        popupContent.addEventListener('click', (ev) => {
                            if (ev.target.matches('.markerTrack')) {
                                this.lastTravelTrek.bind(this)(ev);

                            }
                        });
                        // Обозначаем, что событие click было установлено
                        popupContent.clickEventAttached = true;
                    }
                });
                // Сохраняем маркер в хранилище
                InitMarkers.markers[id] = marker;
                InitMarkers.markersArrow[id] = markers;

                // Проверяем, было ли добавлено событие click к маркеру
                if (!marker.clickEventAttached) {
                    marker.on('click', this.clickMarkers.bind(this));
                    // Обозначаем, что событие click было установлено
                    marker.clickEventAttached = true;
                }
            }

        });
    }

}