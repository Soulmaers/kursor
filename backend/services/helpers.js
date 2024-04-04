const databaseService = require('./database.service');
exports.createDate = () => {   //форматироваие даты
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

exports.convert = (ob) => {  //фильтрация уникальных элементов
    const uniq = new Set(ob.map(e => JSON.stringify(e)));
    return Array.from(uniq).map(e => JSON.parse(e));
}
exports.getDataToInterval = async (active, t1, t2) => {
    const resnew = await databaseService.geoLastInterval(t1, t2, active)  //получение параметров за интервал
    const meta = ['idw', 'data', 'lat', 'lon', 'speed', 'sats', 'geo', 'oil', 'course', 'pwr', 'engine', 'mileage', 'engineOn', 'last_valid_time']
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


exports.timefn = () => { //форматирование интервала времени с 0 часов
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startOfTodayUnix = Math.floor(currentDate.getTime() / 1000);
    const unix = Math.floor(new Date().getTime() / 1000);
    const timeNow = unix
    const timeOld = startOfTodayUnix
    return [timeNow, timeOld]
}
exports.format = (data) => {  //форматирование структуры данных
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

exports.processing = async (arr, timez, idw, geoLoc, group, name, start) => { // подготовка шаблона строки события
    const newdata = arr[0]
    let mess;
    const res = await databaseService.dostupObject(idw) //проверка наличия объекта в БД
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


exports.sortData = (datas) => {  // подготовка вложенности структуры групп и объектов
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
    const data = await databaseService.getSensStorMetaFilter(imei, port, id) //получение привязанных параметров
    if (data.length !== 0) {
        const idw = data[0].idw
        const coefEngine = await databaseService.getValuePWRToBase(idw, 'engine') //получение порогового значения по зажиганию
        const coefPWR = await databaseService.getValuePWRToBase(idw, 'pwr')  //получение порогового значения по питанию
        const coefMileage = await databaseService.getValuePWRToBase(idw, 'mileage') //получение порогового значения по пробегу
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
                computedValue = Number(computedValue) >= Number(coefEngine[0].value) ? '1' : '0';
            } else if (el.params === 'mileage' && coefMileage) {
                computedValue = Number(computedValue) + Number(coefMileage[0].value);
            }
            else if (el.params.startsWith('tpms_press') && idw == 26702383) {
                computedValue = String(Number(computedValue) / 10)
            }
            return { key: el.meta, params: el.params, value: String(computedValue), status, data: dataTime };
        });

        // Создаем Map для хранения новых значений для params
        const updatedValues = new Map();
        for (let val of data.filter(e => e.params.startsWith('oil') && e.params.length <= 4)) {
            if (lastObject.hasOwnProperty(val.meta)) {
                const propertyValue = parseInt(lastObject[val.meta]);
                if (!isNaN(propertyValue)) {
                    if (propertyValue < 4100) {
                        const tarirData = await getTarirTableToBase(idw, val.params);
                        if (tarirData.length !== 0) {
                            const sensOil = sortTarirOil(tarirData, propertyValue);
                            updatedValues.set(val.params, String(sensOil));
                        }
                    } else {
                        updatedValues.set(val.params, null);
                    }
                }
            }
        }
        // Проходим по исходному массиву один раз, обновляя значения согласно Map
        for (let e of value) {
            if (updatedValues.has(e.params)) {
                e.value = updatedValues.get(e.params);
            }
        }
        const summator = data.find(e => e.params === 'summatorOil');
        if (summator && summator.meta === 'ON') {
            const params = await databaseService.getSummatorToBase(idw) //получение параметров в сумматоре топлива
            if (params.length === 0) {
                const objectToUpdate = value.find(e => e.params === 'summatorOil');
                objectToUpdate.meta = 'OFF'
                objectToUpdate.data = objectToUpdate.data
                objectToUpdate.status = 'false'
                return
            }
            const summatorValue = calculateSummatorOil(value, params)
            const objectToUpdate = value.find(e => e.params === 'summatorOil');
            objectToUpdate.value = summatorValue ? String(summatorValue) : summatorValue
            objectToUpdate.data = nowTime
            objectToUpdate.status = 'true'
        }
        await databaseService.setUpdateValueSensStorMeta(imei, port, value)  //обновление значений привязанных параметров

        const tcpObject = info
        for (let elem of tcpObject) {
            const value = data.map(el => {
                if (elem.hasOwnProperty(el.meta)) {
                    let val = String(elem[el.meta])
                    if (el.params.startsWith('tpms_press') && idw == 26702383) {
                        val = String(Number(elem[el.meta]) / 10)
                    }
                    return elem[el.meta] !== null ? { key: el.meta, params: el.params, value: val, status: 'true' } : { key: el.meta, params: el.params, value: el.value, status: 'false' }
                }
                else {
                    return { key: el.meta, params: el.params, value: null, status: 'false' }
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




                // Создаем Map для хранения новых значений для params
                const updatedValues = new Map();
                for (let val of data.filter(e => e.params.startsWith('oil') && e.params.length <= 4)) {
                    if (val && elem.hasOwnProperty(val.meta)) {
                        const propertyValue = parseInt(lastObject[val.meta]);
                        if (!isNaN(propertyValue)) {
                            if (propertyValue < 4100) {
                                const tarirData = await getTarirTableToBase(idw, val.params);
                                if (tarirData.length !== 0) {
                                    const sensOil = sortTarirOil(tarirData, propertyValue);
                                    updatedValues.set(val.params, String(sensOil));
                                }
                            } else {
                                updatedValues.set(val.params, null);
                            }
                        }
                    }
                }
                // Проходим по исходному массиву один раз, обновляя значения согласно Map
                for (let e of value) {
                    if (updatedValues.has(e.params)) {
                        e.value = updatedValues.get(e.params);
                    }
                }
                value.forEach(e => {
                    obj[e.params] = e.value
                })
                if (coefPWR) {
                    data.forEach(el => {
                        if (el.params === 'pwr') {
                            obj['engineOn'] = obj['engine'] === '1' && Number(el.value) >= Number(coefPWR[0].value) ? '1' : '0'
                        }
                    });
                }
                const summator = data.find(e => e.params === 'summatorOil');
                if (summator && summator.meta === 'ON') {
                    const params = await databaseService.getSummatorToBase(idw)
                    if (params.length === 0) {
                        obj['summatorOil'] = null
                        return
                    }
                    const summatorValue = calculateSummatorOil(value, params)
                    obj['summatorOil'] = summatorValue ? String(summatorValue) : summatorValue
                }
                await databaseService.setAddDataToGlobalBase(obj)  //запись отфильтрованных параметров и значений в накопительную таблицу датчиков
            }
        }
    }
}


function calculateSummatorOil(value, params) {
    const values = params.map(it => it.param)
    const summatorValue = value.reduce((acc, e) => {
        if (acc === null) return null; // Если уже встретился null, возвращаем null для всех последующих итераций
        if (values.includes(e.params)) {
            if (e.value === null) return null; // Возвращаем null, если значение null и params в списке values
            return acc + Number(e.value); // Суммируем значения, если они не null
        }
        return acc; // Возвращаем текущий аккумулятор, если params не в списке values
    }, 0);// Начальное значение аккумулятора
    return summatorValue
}
const getTarirTableToBase = async (idw, param) => {
    const res = await databaseService.getTarirData(idw, param)
    return res
}

const sortTarirOil = (data, dut) => {
    const x = [];
    const y = [];
    const points = []
    data.forEach(el => {
        const point = []
        x.push(Number(el.dut))
        y.push(Number(el.litrazh))
        point.push(Number(el.dut))
        point.push(Number(el.litrazh))
        points.push(point)
    })
    let degree = x.length < 3 ? 1 : 6
    const coeffs = polynomialApproximation(x, y, degree)
    const approximated = evaluatePolynomial([dut], coeffs)[0];
    const znak = Number((approximated * 0.9987).toFixed(0))
    return znak
}
function polynomialApproximation(x, y, degree) {
    const n = x.length;
    const m = degree + 1;
    let A = Array.from({ length: m }, () => new Array(m).fill(0));
    let B = new Array(m).fill(0);
    let a = new Array(m).fill(0);
    for (let i = 0; i < n; i++) {
        let xi = x[i];
        let yi = y[i];
        for (let j = 0; j < m; j++) {
            for (let k = 0; k < m; k++) {
                let val = Math.pow(xi, j + k);
                if (Number.isFinite(val)) {
                    A[j][k] += val;
                }
            }
            let val = Math.pow(xi, j) * yi;
            if (Number.isFinite(val)) {
                B[j] += val;
            }
        }
    }
    for (let j = 0; j < m; j++) {
        for (let k = j + 1; k < m; k++) {
            let coef = A[k][j] / A[j][j];
            B[k] -= coef * B[j];
            for (let l = j; l < m; l++) {
                let val = A[j][l] * coef;
                if (Number.isFinite(val)) {
                    A[k][l] -= val;
                }
            }
        }
    }
    for (let j = m - 1; j >= 0; j--) {
        let tmp = B[j];
        for (let k = j + 1; k < m; k++) {
            tmp -= a[k] * A[j][k];
        }
        let val = A[j][j];
        if (!Number.isFinite(val)) {
            val = Number.MAX_VALUE;
        }
        a[j] = tmp / val;
    }
    return a;
}
function evaluatePolynomial(x, a) {
    const n = a.length;
    const y = new Array(x.length).fill(0);
    for (let i = 0; i < x.length; i++) {
        let xi = x[i];
        for (let j = n - 1; j >= 0; j--) {
            y[i] = y[i] * xi + a[j];
        }
    }
    return y;
}
