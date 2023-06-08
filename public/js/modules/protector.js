
import { objColors, gener } from './content.js'
import { removeArrElem } from './helpersFunc.js'

export async function reqProtectorBase() {
    console.log('ра?')
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
    const res = await fetch('api/techViewAll', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idw })
    })
    const dannie = await res.json();
    console.log(dannie)

    if (dannie.values.length == 0) {
        fnCanvas([])
    }
    else {
        const result = Object.values(dannie.values.reduce(
            (acc, val) => {
                acc[val.identificator] = Object.assign(acc[val.identificator] ?? {}, val);
                return acc;
            },
            {}
        ));
        fnCanvas(result)
    }
}

function fnCanvas(arg) {
    console.log(arg)
    const wrapCanvas = document.querySelectorAll('.wrapCanvas')
    const dan = document.querySelectorAll('.dan')
    if (wrapCanvas) {
        removeArrElem(wrapCanvas)
    }
    if (dan) {
        removeArrElem(dan)
    }
    const tiresLink = document.querySelectorAll('.tires_link_test')
    arg.forEach(el => {
        const massProtector = [];
        const protec = [];
        tiresLink.forEach(it => {
            if (el.idTyres == it.id) {
                massProtector.push(el.N1, el.N2, el.N3, el.N4)
                massProtector.forEach(el => {
                    if (el !== '') {
                        protec.push(el)
                    }
                })
                const mm = el.maxMM * 10
                const wrap = document.createElement('div')
                wrap.classList.add('wrapCanvas')
                it.children[0].appendChild(wrap)
                const bar = document.createElement('div')
                bar.classList.add(`contBar${it.id}`)
                const bar2 = document.createElement('div')
                bar2.classList.add(`contBar${it.id}`)
                const bar3 = document.createElement('div')
                bar3.classList.add(`contBar${it.id}`)
                wrap.appendChild(bar)
                wrap.appendChild(bar2)
                wrap.appendChild(bar3)
                const canvas = document.createElement('canvas')
                canvas.setAttribute('id', `${it.id}p`)
                const canvas2 = document.createElement('canvas')
                canvas2.setAttribute('id', `${it.id}v`)
                const canvas3 = document.createElement('canvas')
                canvas3.setAttribute('id', `${it.id}t`)
                bar.appendChild(canvas)
                bar2.appendChild(canvas2)
                bar3.appendChild(canvas3)
                canvas.setAttribute('height', 20);
                canvas2.setAttribute('height', 20);
                canvas3.setAttribute('height', 20);
                viewPicture(protec, it.id, it, mm);
            }
        })
    });
}
function viewPicture(arr, id, elem, mm) {
    console.log(arr, id, elem, mm)
    const conts = document.querySelectorAll(`.contBar${id}`)
    conts.forEach(el => {
        el.style.display = 'none'
    })
    const arrAll = [];
    arr.forEach(el => {
        arrAll.push(el * 10)
    })
    let y1;
    let y2;
    let y3;
    let y4;
    if (arr.length === 0) {
        conts.forEach(e => {
            e.style.display = 'block'
            e.style.width = '16px'
        })
        protekGrafFreeAll(arr, id, elem, mm)
    }
    if (arrAll.length == 2) {
        if (mm <= 120) {
            y1 = ((mm - arrAll[0]) / 6).toFixed(0)
            y2 = ((mm - arrAll[1]) / 6).toFixed(0)
        }
        if (mm > 120 && mm <= 180) {
            y1 = ((mm - arrAll[0]) / 9).toFixed(0)
            y2 = ((mm - arrAll[1]) / 9).toFixed(0)
        }
        if (mm > 180) {
            y1 = ((mm - arrAll[0]) / 12).toFixed(0)
            y2 = ((mm - arrAll[1]) / 12).toFixed(0)
        }
        conts[0].style.display = 'block'
        conts[0].style.width = '48px'
        protekGrafTwoAll(y1, y2, arr, id, elem, mm)
    }
    if (arrAll.length == 3) {
        if (mm <= 120) {
            y1 = ((mm - arrAll[0]) / 6).toFixed(0)
            y2 = ((mm - arrAll[1]) / 6).toFixed(0)
            y3 = ((mm - arrAll[2]) / 6).toFixed(0)
        }
        if (mm > 120 && mm <= 180) {
            y1 = ((mm - arrAll[0]) / 9).toFixed(0)
            y2 = ((mm - arrAll[1]) / 9).toFixed(0)
            y3 = ((mm - arrAll[2]) / 9).toFixed(0)
        }
        if (mm > 180) {
            y1 = ((mm - arrAll[0]) / 12).toFixed(0)
            y2 = ((mm - arrAll[1]) / 12).toFixed(0)
            y3 = ((mm - arrAll[2]) / 12).toFixed(0)
        }
        conts[0].style.display = 'block'
        conts[1].style.display = 'block'
        conts[0].style.width = '24px'
        conts[1].style.width = '24px'
        protekGrafThreeAll(y1, y2, y3, arr, id, elem, mm)
    }
    if (arrAll.length === 4) {
        conts.forEach(e => {
            e.style.display = 'block'
            e.style.width = '16px'
        })
        if (mm <= 120) {
            y1 = ((mm - arrAll[0]) / 6).toFixed(0)
            y2 = ((mm - arrAll[1]) / 6).toFixed(0)
            y3 = ((mm - arrAll[2]) / 6).toFixed(0)
            y4 = ((mm - arrAll[3]) / 6).toFixed(0)
        }
        if (mm > 120 && mm <= 180) {
            y1 = ((mm - arrAll[0]) / 9).toFixed(0)
            y2 = ((mm - arrAll[1]) / 9).toFixed(0)
            y3 = ((mm - arrAll[2]) / 9).toFixed(0)
            y4 = ((mm - arrAll[3]) / 9).toFixed(0)
        }
        if (mm > 180) {
            y1 = ((mm - arrAll[0]) / 12).toFixed(0)
            y2 = ((mm - arrAll[1]) / 12).toFixed(0)
            y3 = ((mm - arrAll[2]) / 12).toFixed(0)
            y4 = ((mm - arrAll[3]) / 12).toFixed(0)
        }
        protekGrafFourAll(y1, y2, y3, y4, arr, id, elem, mm)
    }
}

const min = arr => arr.reduce((x, y) => Math.min(x, y));
export function protekGrafTwoAll(y1, y2, arr, id, elem, mm) {
    const mmAction = mm / 10
    let number = min(arr)
    const dan = document.createElement('div')
    const dan1 = document.createElement('div')
    dan.classList.add('dan')
    dan1.classList.add('dan')
    elem.children[1].appendChild(dan)
    elem.children[1].appendChild(dan1)
    dan.textContent = number + 'мм'
    dan1.textContent = (number / mmAction * 100).toFixed() + '%'
    const percent = (number / mmAction * 100).toFixed(0)
    elem.children[1].style.color = objColors[gener(percent)];
    const c2 = document.getElementById(`${id}p`);
    c2.width = 48
    c2.heigth = 20
    const ctx2 = c2.getContext("2d");
    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 20);
    ctx2.lineTo(0, y1);
    ctx2.lineTo(48, y2);
    ctx2.lineTo(48, 20);
    ctx2.lineTo(0, 20);
    ctx2.fillStyle = objColors[gener(percent)];
    ctx2.fill();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 18);
    ctx2.lineTo(0.688, 18);
    ctx2.lineTo(1.376, 0);
    ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();


    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(22.96, 0);
    ctx2.lineTo(22.96 + 0.688, 18);
    ctx2.lineTo(22.96 + 1.376, 18);
    ctx2.lineTo(22.96 + 2.064, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();


    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(48, 36);
    ctx2.lineTo(48 - 0.688, 18);
    ctx2.lineTo(48 - 1.376, 0);
    ctx2.lineTo(48, 0);
    ctx2.fillStyle = "rgba(14, 12, 11, 1);";
    ctx2.fill();
}

export function protekGrafThreeAll(y1, y2, y3, arr, id, elem, mm) {
    let number = min(arr)
    const mmAction = mm / 10
    const dan = document.createElement('div')
    const dan1 = document.createElement('div')
    dan.classList.add('dan')
    dan1.classList.add('dan')
    elem.children[1].appendChild(dan)
    elem.children[1].appendChild(dan1)
    dan.textContent = number + 'мм'
    dan1.textContent = (number / mmAction * 100).toFixed(0) + '%'
    const percent = (number / mmAction * 100).toFixed(0)
    elem.children[1].style.color = objColors[gener(percent)];
    const c2 = document.getElementById(`${id}p`);
    const ctx2 = c2.getContext("2d");
    c2.width = 24
    c2.heigth = 20
    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 20);
    ctx2.lineTo(0, y1);
    ctx2.lineTo(24, y2);
    ctx2.lineTo(24, 20);
    ctx2.lineTo(0, 20);
    ctx2.fillStyle = objColors[gener(percent)];
    ctx2.fill();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 0);
    ctx2.lineTo(0, 18);
    ctx2.lineTo(0.688, 18);
    ctx2.lineTo(1.376, 0);
    ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();


    ctx2.beginPath();
    ctx2.moveTo(24, 18);
    ctx2.lineTo(24 - 0.688, 18);
    ctx2.lineTo(24 - 1.376, 0);
    ctx2.lineTo(24, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();

    const c3 = document.getElementById(`${id}v`);
    c3.width = 24
    c3.heigth = 20
    const ctx3 = c3.getContext("2d");
    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, y2);
    ctx3.lineTo(24, y3);
    ctx3.lineTo(24, 20);
    ctx3.lineTo(0, 20);
    ctx3.fillStyle = objColors[gener(percent)];
    ctx3.fill();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, 0);
    ctx3.lineTo(0, 18);
    ctx3.lineTo(0.688, 18);
    ctx3.lineTo(1.376, 0);
    ctx3.lineTo(0, 0);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(24, 18);
    ctx3.lineTo(23.2, 18);
    ctx3.lineTo(22.4, 0);
    ctx3.lineTo(24, 0);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
}

export function protekGrafFourAll(y1, y2, y3, y4, arr, id, elem, mm) {
    const mmAction = mm / 10
    let number = min(arr)
    const dan = document.createElement('div')
    const dan1 = document.createElement('div')
    dan.classList.add('dan')
    dan1.classList.add('dan')
    elem.children[1].appendChild(dan)
    elem.children[1].appendChild(dan1)
    dan.textContent = number + 'мм'
    dan1.textContent = (number / mmAction * 100).toFixed(0) + '%'
    const percent = (number / mmAction * 100).toFixed(0)
    elem.children[1].style.color = objColors[gener(percent)];
    const c2 = document.getElementById(`${id}p`);
    const ctx2 = c2.getContext("2d");
    c2.width = 16
    c2.heigth = 20
    ctx2.beginPath();
    ctx2.moveTo(0, 20);
    ctx2.lineTo(0, y1);
    ctx2.lineTo(16, y2);
    ctx2.lineTo(16, 20);
    ctx2.lineTo(0, 20);
    ctx2.fillStyle = objColors[gener(percent)];
    ctx2.fill();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 0);
    ctx2.lineTo(0, 18);
    ctx2.lineTo(0.688, 18);
    ctx2.lineTo(1.376, 0);
    ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(16, 18);
    ctx2.lineTo(16 - 0.688, 18);
    ctx2.lineTo(16 - 1.376, 0);
    ctx2.lineTo(16, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();

    const c3 = document.getElementById(`${id}v`);
    const ctx3 = c3.getContext("2d");
    c3.width = 16
    c3.heigth = 20
    ctx3.beginPath();
    ctx3.moveTo(0, y2);
    ctx3.lineTo(16, y3);
    ctx3.lineTo(16, 20);
    ctx3.lineTo(0, 20);
    ctx3.fillStyle = objColors[gener(percent)];
    ctx3.fill();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, 0);
    ctx3.lineTo(0, 18);
    ctx3.lineTo(0.688, 18);
    ctx3.lineTo(1.376, 0);
    ctx3.lineTo(0, 0);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(16, 18);
    ctx3.lineTo(15.2, 18);
    ctx3.lineTo(14.4, 0);
    ctx3.lineTo(16, 0);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();

    const c4 = document.getElementById(`${id}t`);
    const ctx4 = c4.getContext("2d");
    c4.width = 16
    c4.heigth = 20
    ctx4.beginPath();
    ctx4.moveTo(0, y3);
    ctx4.lineTo(16, y4);
    ctx4.lineTo(16, 20);
    ctx4.lineTo(0, 20);
    ctx4.fillStyle = objColors[gener(percent)];
    ctx4.fill();

    ctx4.beginPath();
    ctx4.lineWidth = "1";
    ctx4.strokeStyle = "#000";
    ctx4.moveTo(0, 0);
    ctx4.lineTo(0, 18);
    ctx4.lineTo(0.688, 18);
    ctx4.lineTo(1.376, 0);
    ctx4.lineTo(0, 0);
    ctx4.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx4.fill();

    ctx4.beginPath();
    ctx4.lineWidth = "1";
    ctx4.strokeStyle = "#000";
    ctx4.moveTo(16, 18);
    ctx4.lineTo(15.2, 18);
    ctx4.lineTo(14.4, 0);
    ctx4.lineTo(16, 0);
    ctx4.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx4.fill();
}

export function protekGrafFreeAll(arr, id, elem) {
    const c2 = document.getElementById(`${id}p`);
    const ctx2 = c2.getContext("2d");
    c2.width = 16
    c2.heigth = 20
    ctx2.beginPath();
    ctx2.moveTo(0, 20);
    ctx2.lineTo(0, 0);
    ctx2.lineTo(16, 0);
    ctx2.lineTo(16, 20);
    ctx2.lineTo(0, 20);
    ctx2.fillStyle = "green";
    ctx2.fill();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 0);
    ctx2.lineTo(0, 18);
    ctx2.lineTo(0.688, 18);
    ctx2.lineTo(1.376, 0);
    ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(16, 18);
    ctx2.lineTo(16 - 0.688, 18);
    ctx2.lineTo(16 - 1.376, 0);
    ctx2.lineTo(16, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();

    const c3 = document.getElementById(`${id}v`);
    const ctx3 = c3.getContext("2d");
    c3.width = 16
    c3.heigth = 20
    ctx3.beginPath();
    ctx3.moveTo(0, 0);
    ctx3.lineTo(16, 0);
    ctx3.lineTo(16, 20);
    ctx3.lineTo(0, 20);
    ctx3.fillStyle = "green";
    ctx3.fill();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, 0);
    ctx3.lineTo(0, 18);
    ctx3.lineTo(0.688, 18);
    ctx3.lineTo(1.376, 0);
    ctx3.lineTo(0, 0);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(16, 18);
    ctx3.lineTo(15.2, 18);
    ctx3.lineTo(14.4, 0);
    ctx3.lineTo(16, 0);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();

    const c4 = document.getElementById(`${id}t`);
    const ctx4 = c4.getContext("2d");
    c4.width = 16
    c4.heigth = 20
    ctx4.beginPath();
    ctx4.moveTo(0, 0);
    ctx4.lineTo(16, 0);
    ctx4.lineTo(16, 20);
    ctx4.lineTo(0, 20);
    ctx4.fillStyle = 'green'
    ctx4.fill();

    ctx4.beginPath();
    ctx4.lineWidth = "1";
    ctx4.strokeStyle = "#000";
    ctx4.moveTo(0, 0);
    ctx4.lineTo(0, 18);
    ctx4.lineTo(0.688, 18);
    ctx4.lineTo(1.376, 0);
    ctx4.lineTo(0, 0);
    ctx4.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx4.fill();

    ctx4.beginPath();
    ctx4.lineWidth = "1";
    ctx4.strokeStyle = "#000";
    ctx4.moveTo(16, 18);
    ctx4.lineTo(15.2, 18);
    ctx4.lineTo(14.4, 0);
    ctx4.lineTo(16, 0);
    ctx4.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx4.fill();
}