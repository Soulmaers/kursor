
import { divClear, osmView } from './visual.js'

export function postModel(model) {
    const active = document.querySelectorAll('.color')
    const activePost = active[0].textContent.replace(/\s+/g, '')
    console.log(activePost)
    fetch('api/model', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model, activePost }),
    })
        .then((res) => res.json())
}


export function postTyres(tyres) {
    const active = document.querySelectorAll('.color')
    const activePost = active[0].textContent.replace(/\s+/g, '')
    fetch('api/tyres', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tyres, activePost }),
    })
        .then((res) => res.json())
        .then(res => console.log(res))
}


export const reqDelete = (name) => {
    //const div = document.querySelector('.alarm')
    const centerOs = document.querySelectorAll('.centerOs')
    const osi = document.querySelectorAll('.osi')
    const tires = document.querySelectorAll('.tires')
    fetch('api/delete', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    })
        .then((res) => res.json())
        .then((res) => console.log(res))
    console.log(osi)
    divClear(osi)
    divClear(tires)
    divClear(centerOs)
}


export const paramsDelete = (name) => {
    fetch('api/paramsDelete', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    })
        .then((res) => res.json())
        .then((res) => console.log(res))
    const tyresD = document.querySelectorAll('.tiresD')
    const tyresT = document.querySelectorAll('.tiresT')
    tyresD.forEach(e => {
        e.textContent = ''
        e.style.background = '#fff'
    })
    tyresT.forEach(e => {
        e.textContent = ''
        e.style.background = '#fff'
    })
}




export const geoPosition = (map) => {
    let iss;
    const active = document.querySelectorAll('.color')[0].textContent
    console.log(active)
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
            console.log('запрос2')
            console.log(center)
            //map.setView([59.9386, 30.3141], 8);
            // L.marker(center).addTo(map);
            if (!iss) {
                var LeafIcon = L.Icon.extend({
                    options: {
                        iconSize: [28, 28],
                        //   shadowSize: [50, 64],
                        iconAnchor: [0, 0],
                        // shadowAnchor: [4, 62],
                        popupAnchor: [0, 0]
                    }
                });

                var greenIcon = new LeafIcon({
                    iconUrl: '../../image/iconCar.png',
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
