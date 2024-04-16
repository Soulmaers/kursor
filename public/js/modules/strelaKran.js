const login = document.querySelectorAll('.log')[1].textContent
export async function kranParams() {
    const active = document.querySelector('.color')
    const act = active.children[0].textContent
    if (act && act === "КранГаличанин Р858ОР178") {
        const contKran = document.querySelector('.contKran')
        contKran.style.display = 'flex'

        const idw = document.querySelector('.color').id
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw }))
        }
        const res = await fetch('/api/getSens', param)
        const data = await res.json()
        console.log(data)
        loadKran(data);
    }
}
const strela = [];
function loadKran(data) {
    const sensors = data.find(el => el.params === 'lift')
    if (sensors && sensors.value) {
        const str = sensors.value
        if (str) {
            if (str && str !== strela[strela.length - 1]) {
                strela.push(str)
                drawMyLine(strela[strela.length - 1], strela[strela.length - 2], true)
            }
        }
        if (!str) {
            drawMyLine(null, null, false)
        }
    }

}



export function drawMyLine(angleDeg, angleDeg2, boolean) {//Угол в градусах
    const argRed = document.querySelector('.argRed')
    const argGreen = document.querySelector('.argGreen')
    angleDeg2 ? argRed.textContent = angleDeg2 + '°' : null
    angleDeg ? argGreen.textContent = angleDeg + '°' : null
    const strela = document.getElementById('krans')
    const ctx = strela.getContext("2d");
    ctx.width = 180
    ctx.heigth = 180
    length = 150
    const angle = angleDeg * Math.PI / 180;
    const angleUnnext = angleDeg2 * Math.PI / 180;
    if (boolean === false) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();
        ctx.setLineDash([5, 0]);
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'black';
        ctx.moveTo(0, 180);
        ctx.lineTo(150, 180)
        ctx.stroke();
    }
    else {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();
        ctx.setLineDash([5, 0]);
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'green';
        ctx.moveTo(0, 180);
        ctx.lineTo(0 + Math.cos(angle) * length, 180 - (0 + Math.sin(angle) * length));
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'red';
        ctx.setLineDash([5, 3]);
        ctx.moveTo(0, 180);
        ctx.lineTo(0 + Math.cos(angleUnnext) * length, 180 - (0 + Math.sin(angleUnnext) * length));
        ctx.stroke();
    }
}

