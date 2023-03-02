
import { divClear, viewDinamic } from './visual.js'

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
export const geoPosition = (geo) => {
    const mapss = document.getElementById('map')
    if (mapss) {
        mapss.remove();
    }

    console.log('запуск геокарты')
    let count = 0;
    count++
    // console.log(new Date())
    const container = L.DomUtil.get('map');
    if (container != null) {
        container._leaflet_id = null;
    }
    const wrap = document.querySelector('.wrapper_up')
    const maps = document.createElement('div')
    maps.setAttribute('id', 'map')
    maps.style.width = '336px';
    maps.style.height = '300px',
        wrap.appendChild(maps)

    const map = L.map('map')
    map.attributionControl.setPrefix(false)
    const leaf = document.querySelector('.leaflet-control-attribution');
    leaf.style.display = 'none';
    const layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">!</a> contributors'
    });
    map.addLayer(layer);

    const polyline = L.polyline(geo, { color: 'rgb(0, 0, 204)', weight: 1 });
    //console.log(polyline)
    polyline.addTo(map);
    let iss;
    const act = document.querySelector('.color')
    const active = act.children[0].textContent
    // console.log(act)
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
            //   console.log('запрос2')
            //    console.log(center)
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


export async function reqModalBar(arr, id) {
    console.log('запуск')
    let activePost;
    const active = document.querySelectorAll('.color')
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.link_menu')[0]
        //  console.log(listItem.textContent)
        activePost = listItem.textContent.replace(/\s+/g, '')

    }
    else {
        activePost = active[0].textContent.replace(/\s+/g, '')
    }
    const arrValue = [];
    const modalInput = document.querySelectorAll('.modalInput')
    // console.log(JSON.stringify({ id, arr, arrValue, activePost }))
    arrValue.push(id)

    modalInput.forEach(el => {
        arrValue.push(el.value)
    })
    console.log(id)
    console.log(arr)
    console.log(arrValue)
    console.log(activePost)

    const bar = await fetch('api/modalBar', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, arr, arrValue, activePost }),
    })
    const result = await bar.json();
    console.log(result)

}

export function reqTech(arr, id) {
    console.log('запуск')
    let activePost;
    const active = document.querySelectorAll('.color')
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.link_menu')[0]
        //  console.log(listItem.textContent)
        activePost = listItem.textContent.replace(/\s+/g, '')

    }
    else {
        activePost = active[0].textContent.replace(/\s+/g, '')
    }
    const arrValue = [];
    const formValue = document.querySelectorAll('.formValue')
    // console.log(JSON.stringify({ id, arr, arrValue, activePost }))
    arrValue.push(id)

    formValue.forEach(el => {
        arrValue.push(el.value)
    })
    // console.log(arrValue)

    fetch('api/tech', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, arr, arrValue, activePost }),
    })
        .then((res) => res.json())
        .then(res => console.log(res))

}


export async function viewBar(id) {
    console.log(id)
    let activePost;
    const active = document.querySelectorAll('.color')
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.link_menu')[0]
        console.log(listItem.textContent)
        activePost = listItem.textContent.replace(/\s+/g, '')

    }
    else {
        activePost = active[0].textContent.replace(/\s+/g, '')
    }

    const bar = await fetch('api/barView', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, activePost })
    })
    const barValue = await bar.json();
    console.log(barValue.values)
    const keys = [];
    if (barValue.values.length) {
        for (let key in barValue.values[0]) {
            keys.push(key);
        }
        const nval = (Object.entries(barValue.values[0]))
        nval.shift()
        const modalInput = document.querySelectorAll('.modalInput')
        modalInput.forEach((el, index) => {
            el.value = nval[index][1]
        })
    }

}

export function viewTech(id) {
    console.log(id)
    let activePost;
    const active = document.querySelectorAll('.color')
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.link_menu')[0]
        console.log(listItem.textContent)
        activePost = listItem.textContent.replace(/\s+/g, '')

    }
    else {
        activePost = active[0].textContent.replace(/\s+/g, '')
    }

    fetch('api/techView', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, activePost })
    })
        .then((res) => res.json())
        .then(res => {
            console.log(res.values)



            const keys = [];
            if (res.values) {
                for (let key in res.values[0]) {
                    keys.push(key);
                }
            }
            console.log(keys)

            const number = document.querySelectorAll('.number')
            const text = document.querySelectorAll('.text')
            const titleMM = document.querySelectorAll('.titleMM')
            const rad = document.querySelectorAll('[name=radio]')
            console.log(titleMM)
            if (res.values.length === 0) {
                number.forEach(e => {
                    e.textContent = ''
                })
                text.forEach(e => {
                    e.textContent = ''
                })
                rad.forEach(el => {
                    el.addEventListener('change', () => {
                        viewDinamic([])
                    })
                })
                viewDinamic([])
            }
            else if (res.values.length > 0) {
                number[0].textContent = keys[8]
                number[1].textContent = keys[9]
                number[2].textContent = keys[10]
                number[3].textContent = keys[11]
                text[0].textContent = res.values[0].N1 + 'мм',
                    text[1].textContent = res.values[0].N2 + 'мм',
                    text[2].textContent = res.values[0].N3 + 'мм',
                    text[3].textContent = res.values[0].N4 + 'мм';

                const protector = [];
                protector.push(res.values[0].N1, res.values[0].N2, res.values[0].N3, res.values[0].N4)
                const protectorClear = [];
                const protectorClearRigth = [];
                titleMM.forEach(el => {
                    el.style.display = 'flex';
                    if (el.children[1].textContent == 'мм' || el.children[1].textContent == '') {
                        el.style.display = 'none';
                    }
                })
                protector.forEach(el => {
                    if (el !== '') {
                        protectorClear.push(el)
                        protectorClearRigth.push(el)
                    }
                })
                const reverseprotectorClear = protectorClearRigth.reverse();

                rad.forEach(el => {
                    el.addEventListener('change', () => {
                        el.id === '1' ? (viewDinamic(protectorClear),
                            text[0].textContent = res.values[0].N1 + 'мм',
                            text[1].textContent = res.values[0].N2 + 'мм',
                            text[2].textContent = res.values[0].N3 + 'мм',
                            text[3].textContent = res.values[0].N4 + 'мм') :
                            (viewDinamic(reverseprotectorClear),
                                text[3].textContent = res.values[0].N1 + 'мм',
                                text[2].textContent = res.values[0].N2 + 'мм',
                                text[1].textContent = res.values[0].N3 + 'мм',
                                text[0].textContent = res.values[0].N4 + 'мм')
                    })
                })
                viewDinamic(protectorClear)

                const nval = (Object.entries(res.values[0]))
                const massVal = nval.shift()
                const formValue = document.querySelectorAll('.formValue')
                formValue.forEach((el, index) => {
                    el.value = nval[index][1]
                })
            }
            const inputPSI = document.querySelector('.jobDav')
            const inputBar = document.querySelector('.bar')
            inputBar.textContent = (inputPSI.value / 14.504).toFixed(1);
            const probeg = document.querySelectorAll('.probeg')
            probeg[2].textContent = probeg[1].value - probeg[0].value
        }
        )


}


export function loadParamsViewShina() {
    const titleCar = document.querySelector('.title_two')
    const listItem = document.querySelectorAll('.link_menu')[0]
    let activePost;
    const active = document.querySelectorAll('.color')
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.listItem')[0]

        activePost = listItem.textContent.replace(/\s+/g, '')
        titleCar.textContent = listItem.textContent
    }
    else {
        activePost = active[0].textContent.replace(/\s+/g, '')
    }
    fetch('api/modelView', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ activePost }))
    })
        .then((res) => res.json())
        .then((res) => {
            const model = res

            const osi = document.querySelectorAll('.osi')
            const centerOs = document.querySelectorAll('.centerOs')
            if (model.values.length > 0) {
                model.values.forEach(el => {

                    osi[el.osi - 1].style.display = 'flex';
                    centerOs[el.osi - 1].style.display = 'flex';
                    el.trailer == 'Прицеп' ?
                        pricep(centerOs[el.osi - 1])
                        :
                        centerOs[el.osi - 1].style.backgroundImage = "url('../image/line_blue.png')"
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

        })
}

