import { divClear } from './func.js'
import { view } from '../pp933.js'
//import { view2 } from '../kran858.js'
import { map } from './osm.js'
const osi = document.querySelectorAll('.osi')
const tires = document.querySelectorAll('.tires')
const tiresInside = document.querySelectorAll('.tiresInside')
const centerOs = document.querySelectorAll('.centerOs');



let iss;
export const geoPosition = () => {
    console.log('запрос')
    fetch('/api/datawialonGeo', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((res) => res.json())
        .then((res) => {
            const geo = res
            console.log(geo)
            const center = [geo.geoY, geo.geoX]
            console.log('запрос2')
            console.log(center)
            //map.setView([59.9386, 30.3141], 8);
            //  L.marker(center).addTo(map);
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
                iss = L.marker(center, { icon: greenIcon }).bindPopup('Кран858').addTo(map);
                //marker.bindPopup("Popup content");
                iss.on('mouseover', function (e) {
                    this.openPopup();
                });
                iss.on('mouseout', function (e) {
                    this.closePopup();
                });
            }
            iss.setLatLng(center, /*{ icon: greenIcon }*/).update();
            setTimeout(geoPosition, 6000);
        })
}


export const loadModel = () => {
    fetch('api/model', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((res) => res.json())
        .then((res) => {
            const model = res
            console.log(model.values)
            if (model.values.length > 0) {
                model.values.forEach(el => {
                    osi[el.osi - 1].style.display = 'flex';
                    centerOs[el.osi - 1].style.display = 'flex';
                    el.trailer == 'Прицеп' ?
                        centerOs[el.osi - 1].style.backgroundImage = "url('../image/line_red.png')" :
                        centerOs[el.osi - 1].style.backgroundImage = "url('../image/line_gray.png')"
                    if (el.tyres == 2) {
                        centerOs[el.osi - 1].previousElementSibling.children[0].style.display = 'flex';
                        centerOs[el.osi - 1].nextElementSibling.children[1].style.display = 'flex';
                        centerOs[el.osi - 1].previousElementSibling.children[1].style.display = 'none';
                        centerOs[el.osi - 1].nextElementSibling.children[0].style.display = 'none';
                    }
                    else {
                        centerOs[el.osi - 1].previousElementSibling.children[0].style.display = 'flex';
                        centerOs[el.osi - 1].previousElementSibling.children[1].style.display = 'flex';
                        centerOs[el.osi - 1].nextElementSibling.children[0].style.display = 'flex';
                        centerOs[el.osi - 1].nextElementSibling.children[1].style.display = 'flex';
                    }
                })
            }
            else {
                console.log('база пустая')
            }
        }),
        fetch('api/tyres', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((res) => res.json())
            .then((res) => {
                const params = res
                console.log(params.values)

                fetch('api/wialon', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then((res) => res.json())
                    .then((res) => {
                        const data = res

                        data.values.sort((prev, next) => {
                            if (prev.name < next.name) return -1;
                            if (prev.name < next.name) return 1;
                        })
                        view(data.values, params.values)
                    })
            })
}




export const reqDelete = () => {
    const div = document.querySelector('.alarm')
    div.style.display = 'none'
    fetch('api/delete', {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((res) => console.log(res))
    divClear(osi)
    divClear(tiresInside)
    divClear(tires)
    centerOs.forEach(e => {
        e.style.backgroundImage = "url('../image/line.png')"
    })

}




export const paramsDelete = () => {
    fetch('api/paramsDelete', {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
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




export function postModel(arrTwo) {
    console.log(arrTwo)
    // const base = [];
    // base.push(osy, trailer, tyres)
    //   console.log(tu)
    fetch('api/model', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(arrTwo),
    })
        .then((res) => res.json())
}


export function postModel2(arrTwo) {
    console.log(arrTwo)
    // const base = [];
    // base.push(osy, trailer, tyres)
    //   console.log(tu)
    fetch('api/model2', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(arrTwo),
    })
        .then((res) => res.json())
}



