
import { convertDate } from '../startAllStatic.js'
export function prostoy(data, tsi) {
    if (data.pwr.length === 0) {
        return undefined
    }
    else {
        const prostoy = [];
        const korzina = [];
        let startIndex = 0;
        data.pwr.forEach((values, index) => {
            if (values !== data.pwr[startIndex]) {
                const speedTime = { speed: data.speed.slice(startIndex, index), time: data.time.slice(startIndex, index), geo: data.geo.slice(startIndex, index) };
                (data.pwr[startIndex] <= tsi ? korzina : prostoy).push(speedTime);
                startIndex = index;
            }
        });
        const speedTime = { speed: data.speed.slice(startIndex), time: data.time.slice(startIndex), geo: data.geo.slice(startIndex) };
        (data.pwr[startIndex] <= tsi ? korzina : prostoy).push(speedTime);
        const filteredData = prostoy.map(obj => {
            const newS = [];
            const timet = [];
            const geo = []
            for (let i = 0; i < obj.speed.length; i++) {
                if (obj.speed[i] < 5) {
                    newS.push(obj.speed[i]);
                    timet.push(obj.time[i])
                    geo.push(obj.geo[i])
                } else {
                    break;
                }
            }
            return { speed: newS, time: timet, geo: geo };
        });
        const timeProstoy = filteredData.map(el => {
            return [el.time[0], el.time[el.time.length - 1], el.geo[0]]
        })
        const unixProstoy = [];
        timeProstoy.forEach(it => {
            if (it[0] !== undefined) {
                const diffInSeconds = (it[1].getTime() - it[0].getTime()) / 1000;
                if (diffInSeconds > 1200 && data.value[data.value.length - 1] <= tsi || diffInSeconds > 1200 && data.speed[data.speed.length - 1] >= 5) {
                    unixProstoy.push([diffInSeconds, it[0], it[1], it[2]])
                }
            }
        })
        const timeBukl = unixProstoy[unixProstoy.length - 1]
        return timeBukl
    }
}

export async function dannieOilTS(idw, num) {
    let number;
    let data
    if (num === 1) {
        number = 0
        data = [convertDate(number)]
    }
    if (num === 2) {
        number = 1
        data = [convertDate(number)]
    }
    if (num === 3) {
        number = 7
        data = [convertDate(number), convertDate(1)]
    }
    if (num === 4) {
        number = 10
        data = [convertDate(number), convertDate(1)]
    }
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, idw }),
    };
    const mods = await fetch('/api/summaryIdwToBase', params);
    const models = await mods.json();

    let obj = {}
    if (num === 4) {
        obj = models.map(it => {
            return { data: `${it.data.split('-')[2]}-${it.data.split('-')[1]}`, melagi: it.probeg }
        })
        return obj
    }
    else {
        let zap = models.reduce((acc, el) => el.zapravka + acc, 0)
        let ras = models.reduce((acc, el) => el.rashod + acc, 0)
        console.log(zap, ras)
        zap !== 0 ? obj['Заправлено'] = zap : null
        ras !== 0 ? obj['Израсходовано'] = ras : null
        console.log(obj)
        return obj
    }


}


export function dannieSortJobTS(datas, ele, num) {
    const data = datas.map(el => ({
        geo: el.geo,
        sats: el.sats,
        pwr: el.pwr,
        value: el.value,
        time: el.time,
        speed: el.speed,
        condition: el.condition === 'Повернут ключ зажигания' ? 'Парковка' : el.condition
    }));
    const obj = {};
    let start;
    let end;
    let currentCondition;
    for (let i = 0; i < data.length; i++) {
        const current = data[i];

        if (current.condition !== currentCondition) {
            if (start && end) {
                const duration = subtractTimes(end, start);
                obj[currentCondition] = obj[currentCondition] || 0;
                obj[currentCondition] += duration;
            }
            start = current.time;
        }
        end = current.time;
        currentCondition = current.condition;
    }
    // Добавляем последний отрезок времени
    if (start && end && currentCondition) {
        const duration = subtractTimes(end, start);
        obj[currentCondition] = obj[currentCondition] || 0;
        obj[currentCondition] += duration;
    }
    function subtractTimes(end, start) {
        const diff = (end.getTime() / 1000) - (start.getTime() / 1000)
        return diff
    }
    return obj

}