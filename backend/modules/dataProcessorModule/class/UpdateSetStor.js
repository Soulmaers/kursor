const databaseService = require('../../../services/database.service');

const { DataHandlerUpdateBase } = require('./DataHandler')
const { DataWriteHistory } = require('./DataWriteHistory')

const { ToBaseMethods } = require('./ToBaseMethods')

class UpdateSetStor {
    constructor(imei, port, info, id) {
        this.imei = imei
        this.port = port
        this.info = info
        this.id = id
        this.init()
    }


    async init() {
        this.data = await databaseService.getSensStorMetaFilter(this.imei, this.port, this.id) //получение привязанных параметров
        if (this.data.length === 0) return
        this.configs = await ToBaseMethods.getConfigs(this.id)
        new DataHandlerUpdateBase(this.imei, this.port, this.info, this.id, this.data, this.configs)
        new DataWriteHistory(this.imei, this.port, this.info, this.id, this.data, this.configs)
        this.setHistoryStatistiks(this.data)
    }


    getTarirTableToBase = async (idw, param) => {
        const res = await databaseService.getTarirData(idw, param)
        return res
    }

    async setHistoryStatistiks(data) {
        const params = {};
        data.forEach(e => {
            if (['speed', 'last_valid_time', 'engine', 'pwr', 'mileage'].includes(e.params)) {
                params[e.params] = e;
            }
        });

        const { speed, last_valid_time: lastTime, engine, pwr, mileage } = params;
        const idTyres = data.filter(el => el.idTyres).map(e => e)
        const configPWR = this.configs.find(e => e.param === 'pwr')
        const arrayData = idTyres.map(el => {
            let check = null
            if (configPWR && engine && pwr) {
                const formattedFormula = configPWR.formula.replace(/x/g, pwr.value);
                const result = eval(formattedFormula);
                check = engine.value === '1' && result ? '1' : '0'
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





}



module.exports = { UpdateSetStor }



/*
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
    // для хистори
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
    }*/