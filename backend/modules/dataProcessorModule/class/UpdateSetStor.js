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
        if (this.id == 28526128) {
            // console.log(this.imei, this.port, this.id)
        }
        //   console.log(this.imei, this.port, this.id)
        this.data = await databaseService.getSensStorMetaFilter(this.imei, this.port, this.id) //получение привязанных параметров
        // console.log(this.id, this.data.length)
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

