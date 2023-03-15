
import { convert } from './visual.js'

import { objColors, gener } from './content.js'

export async function reqProtectorBase() {
    console.log('рабоатем?')
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

    const res = await fetch('api/techViewAll', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activePost })
    })

    const dannie = await res.json();
    if (dannie.values.length == 0) {
        fnCanvas([])
    }
    else {
        fnCanvas(dannie.values)
    }
    console.log(dannie.values)
}


function fnCanvas(arg) {
    // console.log('апг')
    const tiresLink = document.querySelectorAll('.tires_link')
    //   console.log(tiresLink)
    arg.forEach(el => {
        const massProtector = [];
        const protec = [];
        tiresLink.forEach(it => {
            // console.log(it.id)
            // console.log(el)
            if (el.idTyres == it.id) {
                console.log(it)
                massProtector.push(el.N1, el.N2, el.N3, el.N4)
                massProtector.forEach(el => {
                    if (el !== '') {
                        protec.push(el)
                    }
                })
                const wrap = document.createElement('div')
                wrap.classList.add('wrapCanvas')
                it.children[0].appendChild(wrap)
                const bar = document.createElement('div')
                bar.classList.add(`contBar${it.id}`)
                const bar2 = document.createElement('div')
                bar2.classList.add(`contBar${it.id}`)
                const bar3 = document.createElement('div')
                bar3.classList.add(`contBar${it.id}`)
                bar.style.background = 'black'
                bar2.style.background = 'black'
                bar3.style.background = 'black'
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
                //  console.log(massProtector)
                // canvas.setAttribute('width', bodySize.width * 0.8);
                canvas.setAttribute('height', 20);
                canvas2.setAttribute('height', 20);
                canvas3.setAttribute('height', 20);
                // canvas.setAttribute('border-radius', '30% 0 0 0');
                // canvas.style.height = '40px'
                // canvas2.style.height = '40px'
                //  canvas3.style.height = '40px'
                //  canvas.style.width = '20px'
                //  canvas2.style.width = '20px'
                //  canvas3.style.width = '20px'
                viewPicture(protec, it.id, it);
            }


        })


    });

}


function viewPicture(arr, id, elem) {
    const conts = document.querySelectorAll(`.contBar${id}`)
    console.log(arr)
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

    console.log(arrAll)
    if (arr.length === 0) {
        conts.forEach(e => {
            e.style.display = 'block'
            e.style.width = '20px'
        })
        protekGrafFreeAll(arr, id, elem)
    }
    if (arrAll.length == 2) {
        y1 = ((200 - arrAll[0]) / 10).toFixed(0)
        y2 = ((200 - arrAll[1]) / 10).toFixed(0)

        conts[0].style.display = 'block'
        conts[0].style.width = '60px'
        protekGrafTwoAll(y1, y2, arr, id, elem)
    }
    if (arrAll.length == 3) {
        console.log('условия 3')
        y1 = ((120 - arrAll[0]) / 6).toFixed(0)
        y2 = ((120 - arrAll[1]) / 6).toFixed(0)
        y3 = ((120 - arrAll[2]) / 6).toFixed(0)

        conts[0].style.display = 'block'
        conts[1].style.display = 'block'
        conts[0].style.width = '30px'
        conts[1].style.width = '30px'
        console.log(conts)
        protekGrafThreeAll(y1, y2, y3, arr, id, elem)
    }
    if (arrAll.length === 4) {
        conts.forEach(e => {
            e.style.display = 'block'
            e.style.width = '20px'
        })
        console.log(conts)
        y1 = ((120 - arrAll[0]) / 6).toFixed(0)
        y2 = ((120 - arrAll[1]) / 6).toFixed(0)
        y3 = ((120 - arrAll[2]) / 6).toFixed(0)
        y4 = ((120 - arrAll[3]) / 6).toFixed(0)
        protekGrafFourAll(y1, y2, y3, y4, arr, id, elem)
    }


}




const min = arr => arr.reduce((x, y) => Math.min(x, y));

export function protekGrafTwoAll(y1, y2, arr, id, elem) {
    console.log(y1, y2, arr, id, elem)
    let number = min(arr)
    const dan = document.createElement('div')
    const dan1 = document.createElement('div')
    dan.classList.add('dan')
    dan1.classList.add('dan')
    elem.children[1].appendChild(dan)
    elem.children[1].appendChild(dan1)
    dan.textContent = number + 'мм'
    dan1.textContent = (number / 18 * 100).toFixed(0) + '%'
    //elem.children[1].textContent = number / 10 * 100 + '%';
    elem.children[1].style.color = objColors[gener(number)];
    console.log(id)
    const c2 = document.getElementById(`${id}p`);
    c2.width = 60
    c2.heigth = 20
    const ctx2 = c2.getContext("2d");
    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 20);
    ctx2.lineTo(0, y1);
    ctx2.lineTo(60, y2);
    ctx2.lineTo(60, 20);
    ctx2.lineTo(0, 20);
    ctx2.fillStyle = objColors[gener(number)];
    ctx2.fill();
    //  ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 18);
    ctx2.lineTo(0.86, 18);
    ctx2.lineTo(1.72, 0);
    ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //  ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";

    ctx2.moveTo(28.7, 0);
    ctx2.lineTo(28.7 + 0.86, 18);
    ctx2.lineTo(28.7 + 1.72, 18);
    ctx2.lineTo(28.7 + 2.58, 0);
    //  ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(60, 36);
    ctx2.lineTo(60 - 0.86, 18);
    ctx2.lineTo(60 - 1.72, 0);
    ctx2.lineTo(60, 0);
    ctx2.fillStyle = "rgba(14, 12, 11, 1);";
    ctx2.fill();
    //  ctx2.stroke();

}



export function protekGrafThreeAll(y1, y2, y3, arr, id, elem) {
    console.log(y1, y2, y3)
    let number = min(arr)

    const dan = document.createElement('div')
    const dan1 = document.createElement('div')
    dan.classList.add('dan')
    dan1.classList.add('dan')
    elem.children[1].appendChild(dan)
    elem.children[1].appendChild(dan1)
    dan.textContent = number + 'мм'
    dan1.textContent = (number / 10 * 100).toFixed(0) + '%'
    //elem.children[1].textContent = number / 10 * 100 + '%';
    elem.children[1].style.color = objColors[gener(number)];
    console.log(id)
    console.log('работаем')
    const c2 = document.getElementById(`${id}p`);
    console.log(c2)
    const ctx2 = c2.getContext("2d");
    c2.width = 30
    c2.heigth = 20
    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 20);
    ctx2.lineTo(0, y1);
    ctx2.lineTo(30, y2);
    ctx2.lineTo(30, 20);
    ctx2.lineTo(0, 20);
    ctx2.fillStyle = objColors[gener(number)];
    ctx2.fill();
    //  ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 0);
    ctx2.lineTo(0, 18);
    ctx2.lineTo(0.86, 18);
    ctx2.lineTo(1.72, 0);
    ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    // ctx2.stroke();

    ctx2.beginPath();
    //ctx2.lineWidth = "1";
    //ctx2.strokeStyle = "#000";
    ctx2.moveTo(30, 18);
    ctx2.lineTo(30 - 0.86, 18);
    ctx2.lineTo(30 - 1.72, 0);
    ctx2.lineTo(30, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //  ctx2.stroke();

    const c3 = document.getElementById(`${id}v`);
    c3.width = 30
    c3.heigth = 20
    const ctx3 = c3.getContext("2d");
    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, y2);
    ctx3.lineTo(30, y3);
    ctx3.lineTo(30, 20);
    ctx3.lineTo(0, 20);
    ctx3.fillStyle = objColors[gener(number)];
    ctx3.fill();
    // ctx3.stroke();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, 0);
    ctx3.lineTo(0, 18);
    ctx3.lineTo(0.86, 18);
    ctx3.lineTo(1.72, 0);
    ctx3.lineTo(0, 0);
    //ctx2.lineTo(0, 60);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
    //  ctx3.stroke();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(30, 18);
    ctx3.lineTo(29, 18);
    ctx3.lineTo(28, 0);
    ctx3.lineTo(30, 0);
    //ctx2.lineTo(0, 60);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
    //  ctx3.stroke();


}


export function protekGrafFourAll(y1, y2, y3, y4, arr, id, elem) {
    console.log(elem)
    let number = min(arr)
    const dan = document.createElement('div')
    const dan1 = document.createElement('div')
    dan.classList.add('dan')
    dan1.classList.add('dan')
    elem.children[1].appendChild(dan)
    elem.children[1].appendChild(dan1)
    dan.textContent = number + 'мм'
    dan1.textContent = (number / 10 * 100).toFixed(0) + '%'
    //elem.children[1].textContent = number / 10 * 100 + '%';
    elem.children[1].style.color = objColors[gener(number)];
    const c2 = document.getElementById(`${id}p`);
    //  console.log(c2)
    const ctx2 = c2.getContext("2d");
    c2.width = 20
    c2.heigth = 20
    ctx2.beginPath();
    // ctx2.lineWidth = "1";
    // ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 20);
    ctx2.lineTo(0, y1);
    ctx2.lineTo(20, y2);
    ctx2.lineTo(20, 20);
    ctx2.lineTo(0, 20);
    ctx2.fillStyle = objColors[gener(number)];
    ctx2.fill();
    // ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 0);
    ctx2.lineTo(0, 18);
    ctx2.lineTo(0.86, 18);
    ctx2.lineTo(1.72, 0);
    ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //  ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(20, 18);
    ctx2.lineTo(20 - 0.86, 18);
    ctx2.lineTo(20 - 1.72, 0);
    ctx2.lineTo(20, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //  ctx2.stroke();

    const c3 = document.getElementById(`${id}v`);
    const ctx3 = c3.getContext("2d");
    c3.width = 20
    c3.heigth = 20
    ctx3.beginPath();
    //  ctx3.lineWidth = "1";
    // ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, y2);
    ctx3.lineTo(20, y3);
    ctx3.lineTo(20, 20);
    ctx3.lineTo(0, 20);
    ctx3.fillStyle = objColors[gener(number)];
    ctx3.fill();
    // ctx3.stroke();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, 0);
    ctx3.lineTo(0, 18);
    ctx3.lineTo(0.86, 18);
    ctx3.lineTo(1.72, 0);
    ctx3.lineTo(0, 0);
    //ctx2.lineTo(0, 60);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
    // ctx3.stroke();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(20, 18);
    ctx3.lineTo(19, 18);
    ctx3.lineTo(18, 0);
    ctx3.lineTo(20, 0);
    //ctx2.lineTo(0, 60);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
    // ctx3.stroke();

    const c4 = document.getElementById(`${id}t`);
    const ctx4 = c4.getContext("2d");
    c4.width = 20
    c4.heigth = 20
    ctx4.beginPath();
    //  ctx4.lineWidth = "1";
    //  ctx4.strokeStyle = "#000";
    ctx4.moveTo(0, y3);
    ctx4.lineTo(20, y4);
    ctx4.lineTo(20, 20);
    ctx4.lineTo(0, 20);
    ctx4.fillStyle = objColors[gener(number)];
    ctx4.fill();
    //  ctx4.stroke();

    ctx4.beginPath();
    ctx4.lineWidth = "1";
    ctx4.strokeStyle = "#000";
    ctx4.moveTo(0, 0);
    ctx4.lineTo(0, 18);
    ctx4.lineTo(0.86, 18);
    ctx4.lineTo(1.72, 0);
    ctx4.lineTo(0, 0);
    //ctx2.lineTo(0, 60);
    ctx4.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx4.fill();
    //  ctx4.stroke();

    ctx4.beginPath();
    ctx4.lineWidth = "1";
    ctx4.strokeStyle = "#000";
    ctx4.moveTo(20, 18);
    ctx4.lineTo(19, 18);
    ctx4.lineTo(18, 0);
    ctx4.lineTo(20, 0);
    //ctx2.lineTo(0, 60);
    ctx4.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx4.fill();
    // ctx4.stroke();

}




export function protekGrafFreeAll(arr, id, elem) {
    const c2 = document.getElementById(`${id}p`);
    const ctx2 = c2.getContext("2d");
    c2.width = 20
    c2.heigth = 20
    ctx2.beginPath();
    // ctx2.lineWidth = "1";
    // ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 20);
    ctx2.lineTo(0, 0);
    ctx2.lineTo(20, 0);
    ctx2.lineTo(20, 20);
    ctx2.lineTo(0, 20);
    ctx2.fillStyle = "green";
    ctx2.fill();
    // ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 0);
    ctx2.lineTo(0, 18);
    ctx2.lineTo(0.86, 18);
    ctx2.lineTo(1.72, 0);
    ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //  ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(20, 18);
    ctx2.lineTo(20 - 0.86, 18);
    ctx2.lineTo(20 - 1.72, 0);
    ctx2.lineTo(20, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //  ctx2.stroke();

    const c3 = document.getElementById(`${id}v`);
    const ctx3 = c3.getContext("2d");
    c3.width = 20
    c3.heigth = 20
    ctx3.beginPath();
    //  ctx3.lineWidth = "1";
    // ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, 0);
    ctx3.lineTo(20, 0);
    ctx3.lineTo(20, 20);
    ctx3.lineTo(0, 20);
    ctx3.fillStyle = "green";
    ctx3.fill();
    // ctx3.stroke();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, 0);
    ctx3.lineTo(0, 18);
    ctx3.lineTo(0.86, 18);
    ctx3.lineTo(1.72, 0);
    ctx3.lineTo(0, 0);
    //ctx2.lineTo(0, 60);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
    // ctx3.stroke();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(20, 18);
    ctx3.lineTo(19, 18);
    ctx3.lineTo(18, 0);
    ctx3.lineTo(20, 0);
    //ctx2.lineTo(0, 60);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
    // ctx3.stroke();

    const c4 = document.getElementById(`${id}t`);
    const ctx4 = c4.getContext("2d");
    c4.width = 20
    c4.heigth = 20
    ctx4.beginPath();
    //  ctx4.lineWidth = "1";
    //  ctx4.strokeStyle = "#000";
    ctx4.moveTo(0, 0);
    ctx4.lineTo(20, 0);
    ctx4.lineTo(20, 20);
    ctx4.lineTo(0, 20);
    ctx4.fillStyle = 'green'
    ctx4.fill();
    //  ctx4.stroke();

    ctx4.beginPath();
    ctx4.lineWidth = "1";
    ctx4.strokeStyle = "#000";
    ctx4.moveTo(0, 0);
    ctx4.lineTo(0, 18);
    ctx4.lineTo(0.86, 18);
    ctx4.lineTo(1.72, 0);
    ctx4.lineTo(0, 0);
    //ctx2.lineTo(0, 60);
    ctx4.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx4.fill();
    //  ctx4.stroke();

    ctx4.beginPath();
    ctx4.lineWidth = "1";
    ctx4.strokeStyle = "#000";
    ctx4.moveTo(20, 18);
    ctx4.lineTo(19, 18);
    ctx4.lineTo(18, 0);
    ctx4.lineTo(20, 0);
    //ctx2.lineTo(0, 60);
    ctx4.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx4.fill();
    // ctx4.stroke();

}