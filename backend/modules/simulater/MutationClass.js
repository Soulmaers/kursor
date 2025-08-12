const GetToBaseClass = require('./GetToBaseClass')

class MutationClass {
    constructor(setting, data, params, tyres) {
        this.setting = setting
        this.params = params
        this.tyresModel = tyres.map(e => e.pressure)
        this.lastValidTime = (params.find(e => e.params === 'last_valid_time')).value
        this.low = [setting.low_min, setting.low_max]
        this.normal = [setting.norma_min, setting.norma_max]
        this.high = [setting.high_min, setting.high_max]
        this.diapazonsState = {
            'low': this.low,
            'normal': this.normal,
            'high': this.high
        }
        this.UTCSecBAR = 0.00024306
        this.highPorog = 9.3
        this.lowPorog = 8.5
        this.timeDiff = Number(setting.time_parking) //время определеия парковки
        this.data = data //массив с данными
        this.defaultStateCube = this.diapazonsState['normal']//стартовый диапазон для первого сообщения  
        this.stateCube = setting.stateCube //состояние кубика  1
        this.prevStateCube = setting.prevStateCube //предыдущее состояние кубика  1
        this.stateTravel = setting.stateTravel //состояние объекта (рейс или парковка 1-рейс 0-парковка)  1
        this.timeParking = setting.timeParking; //время рейса с выкл двигателем   1
        this.lastParkingTime = setting.lastParkingTime;//предыдущее время сообщения   1
        this.flagMutation = setting.flagMutation === 'true'  //1
        this.timeMsg = setting.timeMsg;  //1
        this.lastTimeMsg = setting.lastTimeMsg;  //1
        this.flagLowpressure = setting.flagLowpressure === 'true'   //1
        this.indexTyres = {}
        this.swap = [8.6, 9.2]
        this.flagstartReys = setting.flagstartReys === 'true'   //1
    }



    async init() {
        this.processTemplate() //собираем стор состояний шагов и условий
        this.process()
        await GetToBaseClass.updateTemplateVariables(this.setting.id, this.stateCube, this.prevStateCube,
            this.stateTravel, this.timeParking, this.lastParkingTime, this.flagMutation, this.timeMsg, this.lastTimeMsg,
            this.flagLowpressure, this.flagstartReys)
    }

    process() {
        this.randomCube() //бросаем кубик  и обновляем состояние кубика текущее и предыдущее
        this.iteration()

    }

    iteration() {
        this.data.forEach((tyres, index) => {
            this.installStateMsg(tyres)  //меняем состояние статуса мутировать или нет в зависимости от интервала времени и обновляем переменные времени
            this.installStateTravel(tyres, index) //определяем состояние рейс или паркин и меняем переменные
            if (!this.lastValidTime && index === 0) { this.mutationFirstMsg(tyres) } //мутируем первое сообщение
            else this.mutation(tyres, index) //мутируем другие сообщения
        })
        /* if (this.setting.id_object == '28526628ido') {
             this.data.forEach(e => {
                 this.tyresModel.forEach(it => {
                     console.log(e[it])
                 })
             })
 
         }*/
    }


    installStateMsg(msg) {
        const currentTime = msg.last_valid_time
        if (this.timeMsg >= this.timeDiff) {
            this.flagMutation = true
            this.timeMsg = 0
            this.lastTimeMsg = null;
        }
        else {
            if (!this.lastTimeMsg) this.lastTimeMsg = currentTime
            else {
                this.timeMsg += currentTime - this.lastTimeMsg
                this.lastTimeMsg = currentTime
            }
            this.flagMutation = false
        }
        if (this.setting.id_object == '28526628ido') {
            console.log('состояние мутации')
            console.log(this.flagMutation)
        }
    }
    mutation(tyres, index) {

        const param = this.params.filter(e => this.tyresModel.includes(e.params))

        param.forEach(item => {
            if (this.flagMutation) {
                this.randomCube()
            }
            const vector = this.stor[`${this.prevStateCube}${this.stateCube}`]
            this.celevoy = vector.celevoy
            this.step = this.randomStep(vector.arrayStep)

            tyres.cube = this.stateCube
            tyres.state = this.stateTravel === 1 ? 'рейс' : 'парковка'
            const mutationValue = this.getMutationValue(item, tyres, this.celevoy, this.step, index)
            tyres[item.params] = mutationValue

        })
    }

    getMutationValue(tyresOld, tyres, celevoy, step, index) {

        const value = index === 0 || this.data.length === 1 ? Number(tyresOld.value) : (this.data[index - 1][tyresOld.params] ? Number(this.data[index - 1][tyresOld.params]) : Number(tyresOld.value))
        let mutationValue;
        if (this.stateTravel === 1) {

            if (tyres.state === 'парковка') {
                mutationValue = value <= this.lowPorog ? (Math.random() * (this.swap[1] - this.swap[0]) + this.swap[0]) :
                    value
            }
            else {
                if (this.flagMutation) {
                    if (value < celevoy) {
                        mutationValue = (value + step) > celevoy ? value : value + step;
                    } else if (value > celevoy) {
                        mutationValue = (value - step) < celevoy ? value : value - step;
                    } else {
                        mutationValue = value;
                    }
                } else {
                    //  this.randomCube()
                    mutationValue = value;
                }
            }

        } else {
            mutationValue = this.lowDinalicalPressureParking(tyresOld, tyres, value, index)
        }
        //  console.log('валуе')
        // console.log(mutationValue)
        return parseFloat(Number(mutationValue).toFixed(1))
    }

    lowDinalicalPressureParking(tyresOld, tyres, value, index) {
        const timenow = tyres.last_valid_time
        const timeold = index === 0 || this.data.length === 1 ? this.lastValidTime : this.data[index - 1].last_valid_time
        const step = this.UTCSecBAR * (timenow - timeold)
        let newValue;
        if (this.indexTyres[tyresOld.params] && value > 9) {
            newValue = value - step < 9 ? 9 : value - step
        }
        else {
            newValue = value
        }
        return newValue
    }


    mutationFirstMsg(tyres) {

        for (let elem of this.tyresModel) {
            const randomValue = this.randomPressureToDiapazon()
            tyres[elem] = randomValue
            tyres.cube = this.stateCube
            tyres.state = this.stateTravel === 1 ? 'рейс' : 'парковка'
        }
    }

    installStateTravel(msg, index) {
        const currentTime = Math.floor(new Date(msg.dates).getTime() / 1000);
        if (msg.stop === 0) {
            if (!this.lastParkingTime) {
                this.lastParkingTime = currentTime
            } else {
                this.timeParking += currentTime - this.lastParkingTime
                this.lastParkingTime = currentTime
            }
            if (this.timeParking >= this.timeDiff) {
                this.stateTravel = 0;
                this.flagLowpressure = false
                this.timeParking = 0;
                this.lastParkingTime = null
                if (!this.flagLowpressure) {
                    const param = this.params.filter(e => this.tyresModel.includes(e.params))
                    param.forEach(item => {
                        if (item.value !== '') {
                            value = index === 0 || this.data.length === 1 ? item.value : this.data[index - 1][item.params]
                            value >= 9.3 ? this.indexTyres[item.params] = true : this.indexTyres[item.params] = false
                        }
                    })
                    this.flagLowpressure = true
                }

            }
        } else {
            if (this.stateTravel === 0) {
                this.randomCube()
            }
            this.timeParking = 0;
            this.lastParkingTime = null
            this.stateTravel = 1

        }
    }

    randomPressureToDiapazon() {
        const low = parseFloat(this.defaultStateCube[0])
        const high = parseFloat(this.defaultStateCube[1])
        const value = Math.random() * (high - low) + low
        const roundedNumber = parseFloat(value.toFixed(1));
        return roundedNumber
    }
    randomCube() {
        if (this.stateCube) {
            this.prevStateCube = this.stateCube
        }
        const keys = Object.keys(this.diapazonsState);
        const randomIndex = Math.floor(Math.random() * keys.length);
        this.stateCube = keys[randomIndex]
    }

    randomStep(array) {
        const step = Math.floor(Math.random() * array.length)
        return array[step]
    }
    processTemplate() {
        this.stor = {
            'normallow': { celevoy: Number(this.diapazonsState['low'][0]), arrayStep: [0.1, 0.2, 0.3] },
            'normalnormal': { celevoy: 9, arrayStep: [0.1] },
            'normalhigh': { celevoy: Number(this.diapazonsState['high'][1]), arrayStep: [0.1, 0.2] },
            'lowlow': { celevoy: Number(this.diapazonsState['low'][0]), arrayStep: [0.1, 0.2, 0.3] },
            'lownormal': { celevoy: 9, arrayStep: [0.1, 0.2] },
            'lowhigh': { celevoy: Number(this.diapazonsState['high'][1]), arrayStep: [0.1, 0.2] },
            'highlow': { celevoy: Number(this.diapazonsState['low'][0]), arrayStep: [0.1, 0.2, 0.3] },
            'highnormal': { celevoy: 9, arrayStep: [0.1, 0.2, 0.3] },
            'highhigh': { celevoy: Number(this.diapazonsState['high'][1]), arrayStep: [0.1, 0.2] },
        }
    }

}

module.exports = MutationClass