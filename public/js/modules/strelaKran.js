
export function kranParams() {
    const active = document.querySelector('.color')
    const act = active.children[0].textContent
    if (act && act === "КранГаличанин Р858ОР178") {
        const contKran = document.querySelector('.contKran')
        contKran.style.display = 'flex'

    }
    console.log('икон')

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
            loadKran(arrCar);
        });
}

const strela = [];
function loadKran(arrCar) {
    const active = document.querySelector('.color')
    const act = active.children[0].textContent

    arrCar.forEach(it => {
        if (it.nm === act) {
            if (it.lmsg.p.user_2u_1) {
                const str = (it.lmsg.p.user_2u_1).toFixed(0);
                if (str !== strela[strela.length - 1]) {
                    strela.push(str)
                    drawMyLine(strela[strela.length - 1], strela[strela.length - 2])
                }



            }
        }
    })
}

export function drawMyLine(angleDeg, angleDeg2) {//Угол в градусах
    console.log(angleDeg, angleDeg2)

    const argRed = document.querySelector('.argRed')
    const argGreen = document.querySelector('.argGreen')
    angleDeg2 ? argRed.textContent = angleDeg2 + '°' : null

    argGreen.textContent = angleDeg + '°'
    const strela = document.getElementById('krans')
    const ctx = strela.getContext("2d");

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();


    ctx.width = 180
    ctx.heigth = 180
    length = 150
    const angle = angleDeg * Math.PI / 180;
    const angleUnnext = angleDeg2 * Math.PI / 180;

    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = 'green';
    ctx.moveTo(0, 180);
    ctx.lineTo(0 + Math.cos(angle) * length, 180 - (0 + Math.sin(angle) * length));
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.setLineDash([5, 3]);
    ctx.strokeStyle = 'red';
    ctx.moveTo(0, 180);
    ctx.lineTo(0 + Math.cos(angleUnnext) * length, 180 - (0 + Math.sin(angleUnnext) * length));
    ctx.stroke();

}

