import { chrt1 } from './canvas.js'

//запрос на wialon за данными по скорости
export function graf(t1, t2, int, id) {
    console.log(t1, t2, int, id)
    fetch('api/speedData', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ t1, t2, int, id })
    })
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            chrt1(res.arrSpeed, res.arrIterTimeDateT, res.arrIterTimeDateU)

        }); //передача данных в канвас для отображения)
}
