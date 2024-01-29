
import { convertDate } from '../helpersFunc.js'


export function prostoyNew(tsi, newdata) {
    if (newdata.length === 0) {
        return undefined
    }
    else {
        const res = newdata.reduce((acc, e) => {
            if (e.pwr >= tsi && e.speed === 0 && e.sats > 4) {
                if (Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length > 0
                    && acc[acc.length - 1][0].pwr >= tsi && acc[acc.length - 1][0].speed === 0 && acc[acc.length - 1][0].sats > 4) {
                    acc[acc.length - 1].push(e);
                } else {
                    acc.push([e]);
                }
            } else if (e.pwr < tsi && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0
                || e.speed > 0 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0
                || e.sats <= 4 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0) {
                acc.push([]);
            }

            return acc;
        }, []).filter(el => el.length > 0).reduce((acc, el) => {
            if (((el[el.length - 1].time.getTime()) / 1000) - ((el[0].time.getTime()) / 1000) > 600) {
                acc.push([[el[0].time, el[0].geo, el[0].oil], [el[el.length - 1].time, el[el.length - 1].geo, el[el.length - 1].oil]])
            }
            return acc
        }, [])
        return res
    }

}

export async function dannieOilTS(idw, num, interval) {
    let number;
    let data
    if (interval) {
        data = [interval[0][0], interval[1][0]]
    }
    else {
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
    models.sort((a, b) => {
        if (a.data > b.data) {
            return 1;
        }
        if (a.data < b.data) {
            return -1;
        }
        return 0;
    })
    let obj = {}
    if (num === 4) {
        obj = models.map(it => {
            return { data: `${it.data.split('-')[2]}-${it.data.split('-')[1]}`, melagi: it.probeg }
        })
        return obj
    }
    else {
        let zap = models.reduce((acc, el) => Number(el.zapravka) + acc, 0)
        let ras = models.reduce((acc, el) => Number(el.rashod) + acc, 0)
        zap !== 0 ? obj['Заправлено'] = zap : null
        ras !== 0 ? obj['Израсходовано'] = ras : null
        return obj
    }


}


export function dannieSortJobTS(datas, ele, num) {
    const data = datas.map(el => ({
        geo: el.geo,
        sats: el.sats,
        pwr: el.pwr,
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