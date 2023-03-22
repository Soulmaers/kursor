import { alternativa } from './canvas.js'

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
            const data = res.arrSpeed.map(function (i, ind) {
                return {
                    speed: i,
                    time: res.arrIterTimeDateU[ind]

                }
            })
            alternativa(data)


        });
}
