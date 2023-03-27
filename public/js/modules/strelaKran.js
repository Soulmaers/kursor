
export function kranParams() {
    const active = document.querySelector('.color')
    const act = active.children[0].textContent
    if (act && act === "КранГаличанин Р858ОР178") {
        const contKran = document.querySelector('.contKran')
        contKran.style.display = 'flex'

    }
    //   console.log('икон')

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
        if (it.nm === act && act == 'КранГаличанин Р858ОР178') {
            //   console.log(it.lmsg.p.user_2u_1)
            //  if (it.lmsg.p.user_2u_1) {

            const starterValue = document.querySelector('.starter_value')
            it.lmsg.p.pwr_ext.toFixed(1) >= 26.5 ? starterValue.textContent = 'Включено' : starterValue.textContent = 'Выключено';


            const str = it.lmsg.p.user_2u_1
            if (str) {

                if (str && str !== strela[strela.length - 1]) {
                    strela.push(str)
                    // console.log(strela)
                    drawMyLine(strela[strela.length - 1], strela[strela.length - 2], true)
                }
            }
            if (!str) {
                drawMyLine(null, null, false)
            }
        }
    })
}

export function drawMyLine(angleDeg, angleDeg2, boolean) {//Угол в градусах
    console.log(angleDeg, angleDeg2, boolean)
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
        console.log('черное')
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
        console.log('зеленое')
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

//drawMyLine(45, 80)
