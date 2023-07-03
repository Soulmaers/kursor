
import { fnParMessage, fnPar } from './grafiks.js'

export async function startAllStatic(objects) {
    const login = document.querySelectorAll('.log')[1].textContent
    let globalInfo = {};
    const result = objects
        .map(el => Object.values(el)) // получаем массивы всех значений свойств объектов
        .flat()

    const array = result
        .filter(e => e[0].message.startsWith('Sitrack'))
        .map(e => e);
    console.log(array);
    globalInfo = {
        quantityTS: array.length,
        quantityTSjob: 0
    }

    const interval = timefn()
    const timeOld = interval[1]
    const timeNow = interval[0]

    const res = await loadValue(array, timeOld, timeNow, login)
    const sens = await timeSens(res.jobTS, timeOld, timeNow, login)

    globalInfo.quantityTSjob = res.quantityTSjob
    globalInfo.probeg = res.probeg
    globalInfo.rashod = sens.rashod

    console.log(globalInfo)

    const arr = Object.values(globalInfo)

    const todayValue = document.querySelectorAll('.today_value')

    arr.forEach((e, index) => {
        todayValue[index].textContent = arr[index] ? arr[index] : '-'
    })

}

async function loadValue(array, timeOld, timeNow, login) {
    let countTS = 0;
    let probeg = 0;
    let jobTS = []
    for (const e of array) {
        const idw = e[4];
        console.log(idw);
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw, timeOld, timeNow, login }))
        };
        try {
            const res = await fetch('/api/loadInterval', param);
            const itog = await res.json();
            console.log(itog)
            const probegZero = Number((itog.messages[0].p.can_mileage).toFixed(0));
            const probegNow = Number((itog.messages[itog.messages.length - 1].p.can_mileage).toFixed(0));
            const probegDay = probegNow - probegZero;
            if (probegDay > 5) {
                countTS++;
                probeg += probegDay
                jobTS.push(idw)
            }
        } catch (error) {
            console.log(error);
        }
    }
    return { quantityTSjob: countTS, probeg: probeg, jobTS: jobTS }
}


async function timeSens(array) {
    let rashod = 0;
    for (const e of array) {
        const idw = e
        const sensArr = await fnPar(idw)
        const nameSens = await fnParMessage(idw)
        const allArrNew = [];
        nameSens.forEach((item) => {
            allArrNew.push({ sens: item[0], params: item[1], value: [] })
        })
        sensArr.forEach(el => {
            for (let i = 0; i < allArrNew.length; i++) {
                allArrNew[i].value.push(Object.values(el)[i])
            }
        })
        allArrNew.forEach(it => {
            if (it.sens.startsWith('Топливо')) {
                console.log(it.value[it.value.length - 1])
                console.log(it.value[0])
                rashod += it.value[0] - it.value[it.value.length - 1]
            }
        })
        console.log(allArrNew)
    }
    return { rashod: Number(rashod.toFixed(0)) }
}

function timefn() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startOfTodayUnix = Math.floor(currentDate.getTime() / 1000);
    console.log(startOfTodayUnix);

    const unix = Math.floor(new Date().getTime() / 1000);
    console.log(unix)
    const timeNow = unix
    const timeOld = startOfTodayUnix
    return [timeNow, timeOld]

}