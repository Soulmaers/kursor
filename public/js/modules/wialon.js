import { chrt1 } from './canvas.js'
import { zapros } from './menu.js';
import { geoPosition } from './requests.js'
//запрос на wialon за данными по скорости
export function graf(t1, t2, int, id) {
    console.log(t1, t2, int, id)
    const prms2 = {
        "itemId": id,   //25343786,

        "timeFrom": t1,//t1,//timeFrom,//1657205816,
        "timeTo": t2,//t2,//nowDate,//2757209816,
        "flags": 1,
        "flagsMask": 65281,
        "loadCount": 161000//82710
    }
    const remote2 = wialon.core.Remote.getInstance();
    remote2.remoteCall('messages/load_interval', prms2,
        function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            const arr2 = Object.values(result);
            console.log(arr2)
            const arrIterTime = [];
            const arrIterTimeDate = [];
            arr2[1].forEach(el => {
                arrIterTime.push(el.t);
            })
            arrIterTime.forEach(item => {
                const dateObj = new Date(item * 1000);
                const utcString = dateObj.toString();
                const arrTimeDate = utcString.slice(8, 24);
                arrIterTimeDate.push(arrTimeDate);
            })
            let t = 0;
            const arrIterTimeDateT = arrIterTimeDate.filter(e => (++t) % int === 0);
            console.log(arrIterTimeDateT)
            const arrSpee = [];
            arr2[1].forEach(el => {
                arrSpee.push(el.pos.s)
            })
            let s = 0;
            const arrSpeed = arrSpee.filter(e => (++s) % int === 0)
            chrt1(arrSpeed, arrIterTimeDateT);

        });
}

export function geoloc() {
    // console.log('запуск карты')
    let nowDate = Math.round(new Date().getTime() / 1000)
    let nDate = new Date();
    let timeFrom = Math.round(nDate.setHours(nDate.getHours() - 12) / 1000);
    //  console.log(timeFrom)


    const flags = 1 + 1024
    const prms = {
        "spec": {
            "itemsType": "avl_unit",
            "propName": "sys_name",
            "propValueMask": "*",
            "sortType": "sys_name"
        },
        "force": 1,
        "flags": flags,
        "from": 0,
        "to": 0
    };

    const remote1 = wialon.core.Remote.getInstance();
    remote1.remoteCall('core/search_items', prms,
        function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            const arr1 = Object.values(result);
            const arrCar = arr1[5];
            //  console.log(arr1[5])
            const active = document.querySelector('.color')

            //   console.log(act)
            arrCar.forEach(it => {
                const active = document.querySelector('.color')
                const act = active.children[0].textContent
                //  console.log(active)
                if (it.nm === act) {
                    console.log(act)
                    const prmsT = {
                        "itemId": it.id,
                        "timeFrom": timeFrom,//1657205816,
                        "timeTo": nowDate,//2757209816,
                        "flags": 1,
                        "flagsMask": 65281,
                        "loadCount": 82710
                    }
                    console.log('запуск гео')

                    const remoteT = wialon.core.Remote.getInstance();
                    remoteT.remoteCall('messages/load_interval', prmsT,
                        function (code, result) {
                            if (code) {
                                console.log(wialon.core.Errors.getErrorText(code));
                            }
                            const arr2 = Object.values(result);
                            //  console.log(arr2[1])
                            // console.log(arr2[1][0].pos.x)
                            //  console.log(arr2[1][0].pos.y)
                            const geo = [];
                            const arrIterTimeDate = [];
                            var rows = arr2[1].length;
                            for (var i = 0; i < rows; i++) {
                                geo.push([]);
                            }
                            geo.forEach((el, index) => {
                                el.push(arr2[1][index].pos.y, arr2[1][index].pos.x);
                            })

                            geoPosition(geo);
                        })
                }
            });
        })
}






export function geolocTwo() {
    // console.log('запуск карты')
    let nowDate = Math.round(new Date().getTime() / 1000)
    let nDate = new Date();
    let timeFrom = Math.round(nDate.setHours(nDate.getHours() - 12) / 1000);
    //  console.log(timeFrom)


    const flags = 1 + 1024
    const prms = {
        "spec": {
            "itemsType": "avl_unit",
            "propName": "sys_name",
            "propValueMask": "*",
            "sortType": "sys_name"
        },
        "force": 1,
        "flags": flags,
        "from": 0,
        "to": 0
    };

    const remote1 = wialon.core.Remote.getInstance();
    remote1.remoteCall('core/search_items', prms,
        function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            const arr1 = Object.values(result);
            const arrCar = arr1[5];
            //  console.log(arr1[5])


            //  const active = document.querySelector('.color')
            //  console.log(active)

            const prmsT = {
                "itemId": arrCar[0].id,
                "timeFrom": timeFrom,//1657205816,
                "timeTo": nowDate,//2757209816,
                "flags": 1,
                "flagsMask": 65281,
                "loadCount": 82710
            }
            //  console.log('запуск гео')

            const remoteT = wialon.core.Remote.getInstance();
            remoteT.remoteCall('messages/load_interval', prmsT,
                function (code, result) {
                    if (code) {
                        console.log(wialon.core.Errors.getErrorText(code));
                    }
                    const arr2 = Object.values(result);
                    //  console.log(arr2[1])
                    // console.log(arr2[1][0].pos.x)
                    //  console.log(arr2[1][0].pos.y)
                    const geo = [];
                    const arrIterTimeDate = [];
                    var rows = arr2[1].length;
                    for (var i = 0; i < rows; i++) {
                        geo.push([]);
                    }
                    geo.forEach((el, index) => {
                        el.push(arr2[1][index].pos.y, arr2[1][index].pos.x);
                    })

                    geoPositionTwo(geo);
                })


        })
}


const geoPositionTwo = (geo) => {
    // console.log('запуск геокарты')
    let count = 0;
    count++
    // console.log(new Date())
    const container = L.DomUtil.get('map');
    if (container != null) {
        container._leaflet_id = null;
    }
    const map = L.map('map')
    const layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    map.addLayer(layer);

    const polyline = L.polyline(geo, { color: 'rgb(0, 0, 204)', weight: 1 });
    //console.log(polyline)
    polyline.addTo(map);
    let iss;
    const act = document.querySelectorAll('.listItem')
    const active = act[0].children[0].textContent
    // console.log(active)
    // const activePost = active[0].textContent.replace(/\s+/g, '')
    fetch('/api/datawialonGeo', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }),

    })
        .then((res) => res.json())
        .then((res) => {
            const geo = res
            //console.log(geo)
            const center = [geo.geoY, geo.geoX,]
            map.setView(center, 15)
            //  console.log('запрос2')
            //  console.log(center)
            //map.setView([59.9386, 30.3141], 8);
            // L.marker(center).addTo(map);
            map.flyTo(center, 15)
            if (!iss) {
                var LeafIcon = L.Icon.extend({
                    options: {
                        iconSize: [30, 30],
                        //   shadowSize: [50, 64],
                        iconAnchor: [10, 18],
                        // shadowAnchor: [4, 62],
                        popupAnchor: [0, 0]
                    }
                });

                var greenIcon = new LeafIcon({
                    iconUrl: '../../image/iconCar2.png',
                    // shadowUrl: 'er.png'
                })

                // var myIcon2 = L.divIcon({ className: 'my-div-icon' });
                iss = L.marker(center, { icon: greenIcon }).bindPopup(active).addTo(map);
                //map.panTo(new L.LatLng(center));
                //marker.bindPopup("Popup content");
                iss.on('mouseover', function (e) {
                    this.openPopup();
                });
                iss.on('mouseout', function (e) {
                    this.closePopup();
                });
            }
            iss.setLatLng(center, /*{ icon: greenIcon }*/).update();
            //  setTimeout(geoPosition, 6000);
        })
}