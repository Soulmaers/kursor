const databaseService = require('./database.service');
const { HelpersUpdateParams } = require('./HelpersUpdateParams')

class UpdateSetStor {
    constructor(imei, port, info, id) {
        this.imei = imei
        this.port = port
        this.info = info
        this.id = id

        this.init()
    }


    init() {
        this.setDataToBase()

    }


    getTarirTableToBase = async (idw, param) => {
        const res = await databaseService.getTarirData(idw, param)
        return res
    }

    async setHistoryStatistiks(data, coefPWR) {
        const speed = data.find(e => e.params === 'speed')
        const lastTime = data.find(e => e.params === 'last_valid_time')
        const engine = data.find(e => e.params === 'engine')
        const pwr = data.find(e => e.params === 'pwr')
        const mileage = data.find(e => e.params === 'mileage')
        const idTyres = data.filter(el => el.idTyres).map(e => e)

        const arrayData = idTyres.map(el => {
            let check = null
            if (coefPWR && engine && pwr) {
                check = engine.value === '1' && Number(pwr.value) >= Number(coefPWR[0].value) ? '1' : '0'
            }
            return ({
                engine: check,
                idObject: data[0].idw,
                speed: speed ? speed.value : null,
                mileage: mileage && mileage.value ? Number(mileage.value).toFixed(0) : null,
                time: lastTime ? lastTime.value : null,
                ...el

            })
        })
        await databaseService.setStatistiksPressure(arrayData)
    }


    setDataToBase = async () => {
        const data = await databaseService.getSensStorMetaFilter(this.imei, this.port, this.id) //получение привязанных параметров
        if (data.length !== 0) {
            const idw = data[0].idw
            const [coefEngine, coefPWR, coefMileage] = await Promise.all([
                databaseService.getValuePWRToBase(idw, 'engine'), // получение порогового значения по зажиганию
                databaseService.getValuePWRToBase(idw, 'pwr'), // получение порогового значения по питанию
                databaseService.getValuePWRToBase(idw, 'mileage') // получение порогового значения по пробегу
            ]);
            this.setHistoryStatistiks(data, coefPWR)
            const now = new Date();
            const nowTime = Math.floor(now.getTime() / 1000);
            const lastObject = this.info[this.info.length - 1]
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
                            const tarirData = await this.getTarirTableToBase(idw, val.params);
                            if (tarirData.length !== 0) {
                                const sensOil = this.sortTarirOil(tarirData, propertyValue);
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
                const summatorValue = this.calculateSummatorOil(value, params)
                const objectToUpdate = value.find(e => e.params === 'summatorOil');
                objectToUpdate.value = summatorValue ? String(summatorValue) : summatorValue
                objectToUpdate.data = nowTime
                objectToUpdate.status = 'true'
            }
            await databaseService.setUpdateValueSensStorMeta(this.imei, this.port, value)  //обновление значений привязанных параметров

            const tcpObject = this.info
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
                    obj['imei'] = this.imei
                    obj['port'] = this.port
                    obj['data'] = String(nowTime)
                    obj['time'] = String(elem.time)




                    // Создаем Map для хранения новых значений для params
                    const updatedValues = new Map();
                    for (let val of data.filter(e => e.params.startsWith('oil') && e.params.length <= 4)) {
                        if (val && elem.hasOwnProperty(val.meta)) {
                            const propertyValue = parseInt(lastObject[val.meta]);
                            if (!isNaN(propertyValue)) {
                                if (propertyValue < 4100) {
                                    const tarirData = await this.getTarirTableToBase(idw, val.params);
                                    if (tarirData.length !== 0) {
                                        const sensOil = this.sortTarirOil(tarirData, propertyValue);
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
                        const summatorValue = this.calculateSummatorOil(value, params)
                        obj['summatorOil'] = summatorValue ? String(summatorValue) : summatorValue
                    }

                    await databaseService.setAddDataToGlobalBase(obj)  //запись отфильтрованных параметров и значений в накопительную таблицу датчиков
                    await HelpersUpdateParams.temporary(obj)
                }
            }
        }
    }

    calculateSummatorOil(value, params) {
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


    sortTarirOil = (data, dut) => {
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
        const coeffs = this.polynomialApproximation(x, y, degree)
        const approximated = this.evaluatePolynomial([dut], coeffs)[0];
        const znak = Number((approximated * 0.9987).toFixed(0))
        return znak
    }
    polynomialApproximation(x, y, degree) {
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
    evaluatePolynomial(x, a) {
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
}



module.exports = { UpdateSetStor }