
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
    globalInfo = {
        quantityTS: array.length,
        quantityTSjob: 0
    }
    const interval = timefn()
    const timeOld = interval[1]
    const timeNow = interval[0]
    const res = await loadValue(array, timeOld, timeNow, login)

    console.log(res)
    globalInfo.quantityTSjob = res.quantityTSjob
    globalInfo.probeg = res.probeg
    globalInfo.rashod = res.rashod
    globalInfo.zapravka = res.zapravka;
    globalInfo.lifting = res.lifting;
    globalInfo.jobHours = res.moto;
    globalInfo.prostoy = 'в работе';
    globalInfo.medium = res.medium;
    const arr = Object.values(globalInfo)
    const todayValue = document.querySelectorAll('.today_value')
    // console.log(arr)
    arr.forEach((e, index) => {
        todayValue[index].textContent = (e !== undefined && e !== null) ? e : '-'
    })
}

async function loadValue(array, timeOld, timeNow, login) {
    let countTS = 0;
    let probeg = 0;
    let rashod = 0;
    let lifting = 0
    let zapravka = 0;
    let motoTime = [];
    let jobTS = []
    const times = []
    for (const e of array) {
        let sumRashod = 0;
        let sumZapravka = 0;
        let motoTimeIter;
        const time = [];
        const idw = e[4];
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
            itog.messages.forEach(el => {
                const timestamp = el.t;
                const date = new Date(timestamp * 1000);
                const isoString = date.toISOString();
                time.push(new Date(isoString))
            })
            const probegZero = Number((itog.messages[0].p.can_mileage).toFixed(0));
            const probegNow = Number((itog.messages[itog.messages.length - 1].p.can_mileage).toFixed(0));
            const probegDay = probegNow - probegZero;
            if (probegDay > 5) {
                countTS++;
                probeg += probegDay
                jobTS.push(idw)
            }
            const sensArr = await fnPar(idw)
            const nameSens = await fnParMessage(idw)
            const allArrNew = [];
            nameSens.forEach((item) => {
                allArrNew.push({ sens: item[0], params: item[1], value: [] })
            })
            sensArr.forEach(el => {
                for (let i = 0; i < allArrNew.length; i++) {
                    allArrNew[i].value.push(Number(Object.values(el)[i].toFixed(0)))
                }
            })
            allArrNew.forEach(el => {
                el.time = time
            })
            console.log(allArrNew)
            allArrNew.forEach(it => {
                if (it.sens.startsWith('Топливо')) {
                    const res = rashodCalc(it)
                    sumRashod += res[0].rashod;
                    sumZapravka += res[0].zapravka;
                }
                if (it.sens.startsWith('Подъем')) {
                    it.value >= 33 ? lifting++ : 0
                }
                if (it.sens.startsWith('Зажигание')) {
                    const res = moto(it);
                    motoTimeIter = res

                }
            })
        } catch (error) {
            console.log(error);
        }
        motoTime.push(motoTimeIter)
        rashod += sumRashod;
        zapravka += sumZapravka;

    }
    const motoHours = timesDate(motoTime)
    console.log(motoHours)
    console.log(rashod, zapravka)
    const medium = Number(((rashod / probeg) * 100).toFixed(2))

    return { quantityTSjob: countTS, probeg: probeg, rashod: rashod, zapravka: zapravka, lifting: lifting, jobTS: jobTS, medium: medium, moto: motoHours }
}



function timesDate(dates) {
    let totalMs;
    const [date1, date2] = dates.map(dateStr => dateStr);
    const diffMs = date2 + date1; // разница между датами в миллисекундах
    totalMs = diffMs;
    const totalSeconds = Math.floor(totalMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const motoHours = `${hours}:${minutes}:${seconds}`
    return motoHours
}

function moto(data) {
    const zeros = [];
    const ones = [];
    let startIndex = 0;
    data.value.forEach((values, index) => {
        if (values !== data.value[startIndex]) {
            const subarray = data.time.slice(startIndex, index);
            (data.value[startIndex] === 0 ? zeros : ones).push([subarray[0], subarray[subarray.length - 1]]);
            startIndex = index;
        }
    });
    const subarray = data.time.slice(startIndex);
    (data.value[startIndex] === 0 ? zeros : ones).push([subarray[0], subarray[subarray.length - 1]]);
    console.log(zeros)
    console.log(ones)
    let totalMs = 0;
    ones.forEach(dates => {
        const [date1, date2] = dates.map(dateStr => new Date(dateStr));
        const diffMs = date2.getTime() - date1.getTime(); // разница между датами в миллисекундах
        totalMs += diffMs;
    });

    console.log(totalMs)
    const totalSeconds = Math.floor(totalMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const motoHours = totalMs// `${hours}:${minutes}:${seconds}`
    return motoHours
}

function rashodCalc(data) {
    const resArray = [];
    const zapravka = [];
    const ras = [];

    for (let i = 0; i < data.value.length - 5; i++) {
        data.value[i] === 0 ? data.value[i] = data.value[i - 1] : data.value[i] = data.value[i]
        data.value[i + 1] === 0 ? data.value[i + 1] = data.value[i - 1] : data.value[i + 1] = data.value[i + 1]
        if (data.value[i] <= data.value[i + 1]) {
            let oneNum = data.value[i]
            let fiveNum = data.value[i + 5]
            const res = fiveNum - oneNum
            res > Number((5 / 100.05 * oneNum).toFixed(0)) ? resArray.push([oneNum, data.time[i]]) : null

        }
        else {
            if (resArray.length !== 0) {
                zapravka.push({ start: resArray[0], end: [data.value[i], data.time[i]] })
                if (zapravka.length === 1) {
                    ras.push([{ start: [data.value[0], data.time[0]], end: [resArray[0][0], resArray[0][1]] }])
                    ras.push([{ start: [data.value[i], data.time[i]], end: [data.value[data.value.length - 1], data.time[data.time.length - 1]] }])
                }
                else {
                    ras.push([{ start: [data.value[i], data.time[i]], end: [resArray[0][0], resArray[0][1]] }])
                    ras.push([{ start: [data.value[i], data.time[i]], end: [data.value[data.value.length - 1], data.time[data.time.length - 1]] }])
                }
                resArray.length = 0
            }
        }
    }
    if (zapravka.length === 0) {
        ras.push([{ start: [data.value[0], data.time[0]], end: [data.value[data.value.length - 1], data.time[data.time.length - 1]] }])
    }
    const sum = zapravka.reduce((acc, el) => acc + el.end[0], 0) + data.value[0];
    const rashod = ras.reduce((acc, el) => acc + el[0].end[0], 0)
    const potracheno = sum - rashod;
    const zapravleno = (zapravka.reduce((acc, el) => acc + el.end[0], 0) - zapravka.reduce((acc, el) => acc + el.start[0], 0))
    return [{ rashod: potracheno, zapravka: zapravleno }]
}

async function timeSens(array, time) {
    console.log(time)
    let rashod = 0;
    let lifting = 0
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
            if (it.sens.startsWith('Подъем')) {
                it.value >= 33 ? lifting++ : 0
            }
        })
        console.log(allArrNew)
    }
    return { rashod: Number(rashod.toFixed(0)), lifting: lifting }

}
function timefn() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startOfTodayUnix = Math.floor(currentDate.getTime() / 1000);
    const unix = Math.floor(new Date().getTime() / 1000);
    const timeNow = unix
    const timeOld = startOfTodayUnix
    return [timeNow, timeOld]
}