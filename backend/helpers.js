const databaseService = require('./services/database.service');
exports.createDate = () => {
    let today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    today = day + '.' + month + '.' + year;
    let time = new Date();
    const hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    time = hour + ':' + minutes
    const todays = today + ' ' + time
    return [todays]

}

exports.convert = (ob) => {
    const uniq = new Set(ob.map(e => JSON.stringify(e)));
    return Array.from(uniq).map(e => JSON.parse(e));
}


exports.processing = async (arr, timez, idw, geoLoc, group, name, start) => {
    const newdata = arr[0]
    let mess;
    const res = await databaseService.dostupObject(idw)
    const event = newdata.event
    if (event === 'Заправка') {
        mess = [{ event: event, group: `Компания: ${group}`, name: `${name}`, litrazh: `${start}`, time: `${newdata.time}` }]
    }
    if (event === 'Простой') {
        mess = [{ event: event, group: `Компания: ${group}`, name: `${name}`, time: `${newdata.time}`, alarm: `${newdata.alarm}` }]
    }
    if (event === 'Предупреждение') {
        mess = [{ event: event, name: `${name}`, time: `${newdata.time}`, tyres: `${newdata.tyres}`, param: `${newdata.param}`, alarm: `${newdata.alarm}` }]
    }
    if (event === 'Слив') {
        mess = [{ event: event, group: `Компания: ${group}`, name: `${name}`, litrazh: `${start}`, time: `${newdata.time}` }]
    }
    if (event === 'Потеря связи') {
        mess = [{ event: event, group: `Компания: ${group}`, name: `${name}`, lasttime: `${newdata.lasttime}` }]
    }
    if (event === 'Состояние') {
        mess = [{ event: event, group: `Компания: ${group}`, name: `${name}`, condition: `${newdata.lasttime}` }]
    }
    return { msg: mess, logins: res }
}


exports.sortData = (datas) => {
    const res = Object.values(datas.reduce((acc, elem) => {
        if (!acc[elem.idg]) {
            acc[elem.idg] = {
                idg: elem.idg,
                name_g: elem.name_g,
                sub: [],
                objects: []
            };
        }
        if (elem.id_sub_g !== null) {
            const subExists = acc[elem.idg].sub.some(item => item.id_sub_g === elem.id_sub_g);
            if (!subExists) {
                acc[elem.idg].sub.push({
                    id_sub_g: elem.id_sub_g,
                    name_sub_g: elem.name_sub_g,
                    objects: []
                })
            }
            acc[elem.idg].sub.find(item => item.id_sub_g === elem.id_sub_g).objects.push({
                idObject: elem.idObject,
                nameObject: elem.nameObject,
                imei: elem.imei,
                phone: elem.phone
            })
        }
        else {
            acc[elem.idg].objects.push({
                idObject: elem.idObject,
                nameObject: elem.nameObject,
                imei: elem.imei,
                phone: elem.phone
            })
        }
        return acc;
    }, {}));
    return res
}



exports.setDataToBase = async (imei, port, info, object) => {
    console.log(imei, port)
    const data = await databaseService.getSensStorMetaFilter(imei, port)
    if (data.length !== 0) {
        console.log(data)
        const now = new Date();
        const nowTime = Math.floor(now.getTime() / 1000);

        const lastObject = !object ? info[info.length - 1] : info
        const value = data.map(el => {
            if (lastObject.hasOwnProperty(el.meta)) {
                return lastObject[el.meta] !== null ? { key: el.meta, params: el.params, value: String(lastObject[el.meta]), status: 'true', data: nowTime } : { key: el.meta, params: el.params, value: el.value, status: 'false', data: el.data }
            }
            else {
                return { key: el.meta, params: el.params, value: el.value, status: 'false', data: el.data }
            }
        })
        await databaseService.setUpdateValueSensStorMeta(imei, port, value)

        const tcpObject = !object ? info : [info]
        for (let elem of tcpObject) {
            const value = data.map(el => {
                if (elem.hasOwnProperty(el.meta)) {
                    return elem[el.meta] !== null ? { key: el.meta, params: el.params, value: String(elem[el.meta]), status: 'true' } : { key: el.meta, params: el.params, value: el.value, status: 'false' }
                }
                else {
                    return { key: el.meta, params: el.params, value: el.value, status: 'false' }
                }
            })

            if (value.length !== 0) {
                const obj = {}
                const nowTime = Math.floor(new Date().getTime() / 1000)
                obj['idw'] = data[0].idw
                obj['imei'] = imei
                obj['port'] = port
                obj['data'] = String(nowTime)
                obj['time'] = String(elem.time)

                value.forEach(e => {
                    obj[e.params] = e.value
                })
                await databaseService.setAddDataToGlobalBase(obj)
            }
        }

    }
}
