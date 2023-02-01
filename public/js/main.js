
import { init } from './modules/menu.js'
import { speed } from './modules/speed.js'
import { liCreate } from './modules/visual.js'
import { select } from './modules/configurator.js'


//запуск функции атворизации на wialon--> запрос параметров созданых объектов--> отрисовка меню
init();

//условия для запроса графика скорости
//speed();

//отрисовка списка под параметры
//liCreate()

const detaly = document.querySelector('.detaly')
detaly.addEventListener('click', () => {
    const detalisation = document.querySelector('.detalisation')
    detalisation.style.display = 'flex'
})








const Obj = {
    'PressurePro 933': 25343786,
    'TDRMX 339': 26421451,
    'TDRMX 652': 25594204,
    'КранГаличанин Р858ОР178': 25766831

}



/*
export function testfn() {
    let nowDate = Math.round(new Date().getTime() / 1000)
    let nDate = new Date();
    let timeFrom = Math.round(nDate.setHours(nDate.getHours() - 12) / 1000);
    console.log(timeFrom)

    const prmsT = {
        "itemId": 25766831,
        "timeFrom": timeFrom,//1657205816,
        "timeTo": nowDate,//2757209816,
        "flags": 1,
        "flagsMask": 65281,
        "loadCount": 82710
    }

    const remoteT = wialon.core.Remote.getInstance();
    remoteT.remoteCall('messages/load_interval', prmsT,
        function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            const arr2 = Object.values(result);
            console.log(arr2[1])
            //  console.log(arr2[1][0].pos.x)
            //  console.log(arr2[1][0].pos.y)
            const geo = [];
            const arrIterTimeDate = [];
            var rows = arr2[1].length;
            for (var i = 0; i < rows; i++) {
                geo.push([]);
            }
            geo.forEach((el, index) => {
                el.push(arr2[1][index].pos.x, arr2[1][index].pos.y);
            })
            console.log(geo)


            //   console.log(arrGeoX)
            //   console.log(arrGeoY)
            /* arrIterTime.forEach(item => {
                 dateObj = new Date(item * 1000);
                 utcString = dateObj.toString();
                 arrTimeDate = utcString.slice(8, 24);
                 arrIterTimeDate.push(arrTimeDate);
             })
let t = 0;
            //  arrIterTimeDateT = arrIterTimeDate.filter(e => (++t) % 8 === 0);



        });
}*/

