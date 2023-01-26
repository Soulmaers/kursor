//import { divClear } from './func.js'
import { view2 } from '../kran858.js'
//import { view2 } from '../kran858.js'
import { divClear2 } from './func2.js'
import { map } from './osm.js'
const osi = document.querySelectorAll('.osi')
const tires = document.querySelectorAll('.tires')
const tiresInside = document.querySelectorAll('.tiresInside')
const centerOs = document.querySelectorAll('.centerOs');



let iss2;
export const geoPosition2 = () => {
    console.log('запрос')
    fetch('/api/datawialonGeo2', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((res) => res.json())
        .then((res) => {
            const geo = res
            console.log(geo)
            const center = [geo.geoY2, geo.geoX2]
            console.log('запрос2')
            console.log(center)
            //map.setView([59.9386, 30.3141], 8);
            //  L.marker(center).addTo(map);
            if (!iss2) {
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
                iss2 = L.marker(center, { icon: greenIcon }).bindPopup('PP933').addTo(map);
                //marker.bindPopup("Popup content");
                iss2.on('mouseover', function (e) {
                    this.openPopup();
                });
                iss2.on('mouseout', function (e) {
                    this.closePopup();
                });
            }
            iss2.setLatLng(center, /*{ icon: greenIcon }*/).update();
            setTimeout(geoPosition2, 6000);
        })
}



export const loadModel2 = () => {
    const osi = document.querySelectorAll('.osi')
    //const tires = document.querySelectorAll('.tires')
    //const tiresInside = document.querySelectorAll('.tiresInside')
    const centerOs = document.querySelectorAll('.centerOs');
    fetch('api/model2', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((res) => res.json())
        .then((res) => {
            const model = res
            console.log(model.values)
            console.log(osi)
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
        fetch('api/tyres2', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((res) => res.json())
            .then((res) => {
                const params = res
                console.log(params.values)

                fetch('api/wialon2', {
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
                        view2(data.values, params.values)
                    })
            })
}






export const reqDelete2 = () => {
    const div2 = document.querySelector('.alarm')
    div2.style.display = 'none'
    fetch('api/delete2', {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((res) => console.log(res))
    divClear2(osi)
    divClear2(tiresInside)
    divClear2(tires)
    centerOs.forEach(e => {
        e.style.backgroundImage = "url('../image/line.png')"
    })

}




export const paramsDelete2 = () => {
    fetch('api/paramsDelete2', {
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


