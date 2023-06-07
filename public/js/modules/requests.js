
import { viewDinamic } from './visual.js'


export function postModel(massModel) {
    const active = document.querySelectorAll('.color')
    const activePost = active[0].textContent.replace(/\s+/g, '')
    const idw = document.querySelector('.color').id
    fetch('api/updateModel', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ massModel, idw, activePost, gosp }),
    })
        .then((res) =>
            res.json())
    const messaga = document.querySelector('.messageId')
    messaga.textContent = 'Модель добавлена'
    messaga.style.color = 'green'
    setTimeout(() => messaga.textContent = '', 2000)
}

export function postTyres(tyres) {
    const active = document.querySelectorAll('.color')
    const activePost = active[0].textContent.replace(/\s+/g, '')
    const name = active[0].textContent.replace(/\s+/g, '')
    const idw = document.querySelector('.color').id
    fetch('api/tyres', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tyres, activePost, idw }),
    })
        .then((res) => res.json())
        .then(res => console.log(res))
    const messaga = document.querySelector('.messageId')
    messaga.textContent = 'Датчики добавлены'
    messaga.style.color = 'green'
    setTimeout(() => messaga.textContent = '', 2000)
}

export const reqDelete = (idw) => {
    const centerOs = document.querySelectorAll('.centerOs')
    const osi = document.querySelectorAll('.osi')
    const tires = document.querySelectorAll('.tires')
    fetch('api/delete', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idw }),
    })
        .then((res) => res.json())
        .then((res) => console.log(res))

    const containerAlt = document.querySelector('.containerAlt')
    containerAlt.remove();
    const messaga = document.querySelector('.messageId')
    messaga.textContent = 'Модель удалена'
    messaga.style.color = 'green'
    setTimeout(() => messaga.textContent = '', 2000)

}
export const barDelete = async (idw) => {
    const modalCenterOs = document.querySelector('.modalCenterOs')
    modalCenterOs.style.display = 'none'
    const complete = await fetch('api/barDelete', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idw }),
    })
    const result = await complete.json()
}
export const paramsDelete = (idw) => {
    fetch('api/paramsDelete', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idw }),
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
    let count = 0;
    count++
    const container = L.DomUtil.get('map');
    if (container != null) {
        container._leaflet_id = null;
    }
    const wrap = document.querySelector('.wrapper_up')
    const maps = document.createElement('div')
    maps.setAttribute('id', 'map')
    maps.style.width = '100%';
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
    polyline.addTo(map);
    let iss;
    const act = document.querySelector('.color')
    const active = act.children[0].textContent
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
            const center = [geo.geoY, geo.geoX,]
            map.setView(center, 15)
            map.flyTo(center, 15)
            if (!iss) {
                var LeafIcon = L.Icon.extend({
                    options: {
                        iconSize: [30, 30],
                        iconAnchor: [10, 18],
                        popupAnchor: [0, 0]
                    }
                });
                var greenIcon = new LeafIcon({
                    iconUrl: '../../image/iconCar2.png',
                })
                iss = L.marker(center, { icon: greenIcon }).bindPopup(active).addTo(map);
                iss.on('mouseover', function (e) {
                    this.openPopup();
                });
                iss.on('mouseout', function (e) {
                    this.closePopup();
                });
            }
            iss.setLatLng(center, /*{ icon: greenIcon }*/).update();
        })
}
export async function reqModalBar(arr, id) {
    let activePost;
    const active = document.querySelectorAll('.color')
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.link_menu')[0]
        activePost = listItem.textContent.replace(/\s+/g, '')
    }
    else {
        activePost = active[0].textContent.replace(/\s+/g, '')
    }
    const idw = document.querySelector('.color').id
    const arrValue = [];
    const divFinal = document.querySelectorAll('.divfinal')
    const normal = document.querySelector('.normal')
    arrValue.push(idw)
    arrValue.push(activePost)
    arrValue.push(id)
    arrValue.push(normal.value)
    divFinal.forEach(el => {
        arrValue.push(el.textContent)
    })

    console.log(arrValue)
    const bar = await fetch('api/modalBar', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, arr, arrValue, idw }),
    })
    const result = await bar.json();
}
export async function viewBar(id) {
    console.log(id)
    let activePost;
    const active = document.querySelectorAll('.color')
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.link_menu')[0]
        activePost = listItem.textContent.replace(/\s+/g, '')
    }
    else {
        activePost = active[0].textContent.replace(/\s+/g, '')
    }
    const idw = document.querySelector('.color').id
    const bar = await fetch('api/barView', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, activePost, idw })
    })
    const barValue = await bar.json();
    console.log(barValue)
    const keys = [];
    if (barValue.values.length) {
        for (let key in barValue.values[0]) {
            keys.push(key);
        }

        const nval = (Object.entries(barValue.values[0]))
        console.log(nval)
        nval.shift()
        nval.shift()
        nval.shift()
        nval.shift()
        const divfinal = document.querySelectorAll('.divfinal')
        const inpfinal = document.querySelectorAll('.inpfinal')
        const normal = document.querySelector('.normal')
        normal.value = nval[0][1]
        nval.shift()
        divfinal.forEach((el, index) => {
            el.textContent = nval[index][1]
            inpfinal[index].value = ((parseFloat(el.textContent * 100) / normal.value)).toFixed(2)
        })
    }
}
export function viewTech(id) {
    const rad = document.querySelectorAll('[name=radio]')
    rad[0].checked = true
    let activePost;
    const active = document.querySelectorAll('.color')
    const idw = document.querySelector('.color').id
    if (active[0] == undefined) {
        const listItem = document.querySelectorAll('.link_menu')[0]
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
        body: JSON.stringify({ id, activePost, idw })
    })
        .then((res) => res.json())
        .then(res => {
            const result = res.values[res.values.length - 1]
            const keys = [];
            if (result) {
                for (let key in result) {
                    keys.push(key);
                }
            }
            const number = document.querySelectorAll('.number')
            const text = document.querySelectorAll('.text')
            const titleMM = document.querySelectorAll('.titleMM')
            const inputMM = document.querySelector('.mmtext')
            if (!result || result.length === 0) {
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
            else {
                number[0].textContent = keys[9]
                number[1].textContent = keys[10]
                number[2].textContent = keys[11]
                number[3].textContent = keys[12]
                text[0].textContent = result.N1 + 'мм',
                    text[1].textContent = result.N2 + 'мм',
                    text[2].textContent = result.N3 + 'мм',
                    text[3].textContent = result.N4 + 'мм';
                inputMM.innerHTML = result.maxMM + 'mm';
                const protector = [];
                protector.push(result.N1, result.N2, result.N3, result.N4)
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
                const maxStoc = result.maxMM
                rad.forEach(el => {
                    el.addEventListener('change', () => {
                        el.id === '1' ? viewDinamic(protectorClear, maxStoc) : viewDinamic(reverseprotectorClear, maxStoc)
                    })
                })
                viewDinamic(protectorClear, maxStoc)
                const nval = (Object.entries(result))
                const dd = nval.splice(8, 1)
                nval.splice(12, 0, dd[0])
                const id = nval.splice(2, 1)
                const idbaseTyres = document.querySelector('.idbaseTyres')
                idbaseTyres.innerHTML = id[0][1]
                const tiresActiv = document.querySelector('.tiresActiv')
                tiresActiv.setAttribute('rel', id[0][1])
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


/*
export function loadParamsViewShina() {
    const titleCar = document.querySelector('.title_two')
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
}*/

