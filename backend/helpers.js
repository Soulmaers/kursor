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
exports.getDataToInterval = async (active, t1, t2) => {
    const resnew = await databaseService.geoLastInterval(t1, t2, active)
    const meta = ['idw', 'data', 'lat', 'lon', 'speed', 'sats', 'geo', 'oil', 'course', 'pwr', 'engine', 'mileage', 'engineOn']
    const arrayData = resnew.map(e => {
        return Object.keys(e).reduce((acc, key) => {
            if (meta.includes(key)) {
                acc[key] = e[key];
            }
            return acc;
        }, {});
    });
    return arrayData
}


exports.timefn = () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startOfTodayUnix = Math.floor(currentDate.getTime() / 1000);
    const unix = Math.floor(new Date().getTime() / 1000);
    const timeNow = unix
    const timeOld = startOfTodayUnix
    return [timeNow, timeOld]
}
exports.format = (data) => {
    const resultData = data.flat().flatMap(el => {
        let res = [Number(el[4]), el[0].message, el[6], el[el.length - 1]];
        if (el.length === 10 && el[8].sub && el[8].sub.length !== 0) {
            return el[8].sub.flat().map(it => [Number(it[4]), it[0].message, it[6], it[it.length - 1]]);
        }
        return [res]; // Обернули res в массив, чтобы сохранить формат двумерного массива
    });
    const uniqueMap = new Map(resultData.map(subArr => [subArr[0], subArr]));
    const uniqueArr = Array.from(uniqueMap.values());
    return uniqueArr
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
    //  console.log(datas)
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

exports.setDataToBase = async (imei, port, info, id) => {
    const data = await databaseService.getSensStorMetaFilter(imei, port, id)
    if (data.length !== 0) {
        const idw = data[0].idw
        const coefEngine = await databaseService.getValuePWRToBase(idw, 'engine')
        const coefPWR = await databaseService.getValuePWRToBase(idw, 'pwr')
        const coefMileage = await databaseService.getValuePWRToBase(idw, 'mileage')

        const now = new Date();
        const nowTime = Math.floor(now.getTime() / 1000);

        const lastObject = info[info.length - 1]
        const value = data.map(el => {
            // Базовая проверка наличия значения
            const hasValue = lastObject.hasOwnProperty(el.meta) && lastObject[el.meta] !== null;
            // Определение статуса и времени
            const status = hasValue ? 'true' : 'false';
            const dataTime = hasValue ? nowTime : el.data;
            // Если значение отсутствует, возвращаем базовую структуру
            if (!hasValue) {
                return { key: el.meta, params: el.params, value: el.value, status, data: dataTime };
            }
            // Обработка специфических параметров
            let computedValue = String(lastObject[el.meta]);
            if (el.params === 'engine' && coefEngine) {
                computedValue = Number(computedValue) > Number(coefEngine[0].value) ? '1' : '0';
            } else if (el.params === 'mileage' && coefMileage) {
                computedValue = Number(computedValue) + Number(coefMileage[0].value);
            }
            return { key: el.meta, params: el.params, value: String(computedValue), status, data: dataTime };
        });
        await databaseService.setUpdateValueSensStorMeta(imei, port, value)
        const tcpObject = info
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
                if (coefPWR) {
                    data.forEach(el => {
                        if (el.params === 'pwr') {
                            obj['engineOn'] = obj['engine'] === '1' && Number(el.value) > Number(coefPWR[0].value) ? '1' : '0'
                        }
                    });
                }
                await databaseService.setAddDataToGlobalBase(obj)
            }
        }

    }
}
