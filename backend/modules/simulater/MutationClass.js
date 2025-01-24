

class MutationClass {
    constructor(setting, data, params) {

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
        this.defaultStateCube = this.diapazonsState['normal']//стартовый диапазон для первого сообщения  1
        this.stateCube = null //состояние кубика  1
        this.prevStateCube = 'normal' //предыдущее состояние кубика  1
        this.stateTravel = 1 //состояние объекта (рейс или парковка 1-рейс 0-парковка)  1
        this.timeParking = 0; //время рейса с выкл двигателем   1
        this.lastParkingTime = null;//предыдущее время сообщения   1
        this.flagMutation = false   //1
        this.timeMsg = 0;  //1
        this.lastTimeMsg = null;  //1
        this.flagLowpressure = false  //1
        this.indexTyres = {}
        this.swap = [8.6, 9.2]
        this.flagstartReys = false  //1
        console.log(this.lastValidTime)
    }



    updateProps(newsetting, newdata) {
        this.low = [newsetting.low_min, newsetting.low_max]
        this.normal = [newsetting.norma_min, newsetting.norma_max]
        this.high = [newsetting.high_min, newsetting.high_max]
        this.diapazonsState = {
            'low': this.low,
            'normal': this.normal,
            'high': this.high
        }
        this.timeDiff = Number(newsetting.time_parking) //время определеия парковки
        this.data = newdata

        this.init()
    }
    init() {
        this.processTemplate() //собираем стор состояний шагов и условий
        this.process()
    }

    process() {
        this.randomCube() //бросаем кубик  и обновляем состояние кубика текущее и предыдущее
        this.iteration()
        console.log(this.indexTyres)

    }

    iteration() {

        this.data[0].val.forEach((tyres, index) => {
            this.installStateMsg(tyres)  //меняем состояние статуса мутировать или нет в зависимости от интервала времени и обновляем переменные времени
            this.installStateTravel(tyres, index) //определяем состояние рейс или паркин и меняем переменные
            if (!this.lastValidTime && index === 0) { this.mutationFirstMsg(index) } //мутируем первое сообщение
            else this.mutation(index) //мутируем другие сообщения
        })
    }


    installStateMsg(msg) {
        const currentTime = Math.floor(new Date(msg.dates).getTime() / 1000);
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
    }
    mutation(index) {
        const vector = this.stor[`${this.prevStateCube}${this.stateCube}`]
        this.celevoy = vector.celevoy
        this.data.forEach((tyres, indx) => {
            this.step = this.randomStep(vector.arrayStep)
            const ind = index - 1
            this.mutationValue = this.getMutationValue(tyres.val[ind], tyres.val[index].dates, this.celevoy, this.step, indx)
            tyres.val[index].value = this.mutationValue
            tyres.val[index].state = this.stateTravel === 1 ? 'рейс' : 'парковка'
            tyres.val[index].cube = this.stateCube

        })
    }

    getMutationValue(tyres, timevalue, celevoy, step, indx) {
        const value = tyres.value
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
                    this.randomCube()
                    mutationValue = value;
                }
            }

        } else {
            mutationValue = this.lowDinalicalPressureParking(value, timevalue, tyres, indx)
        }
        return parseFloat(mutationValue.toFixed(1))
    }

    lowDinalicalPressureParking(value, timevalue, tyres, indx) {
        const timenow = Math.floor(new Date(timevalue).getTime() / 1000)
        const timeold = Math.floor(new Date(tyres.dates).getTime() / 1000)
        const step = this.UTCSecBAR * (timenow - timeold)
        let newValue;
        if (this.indexTyres[indx] && value > 9) {
            newValue = value - step < 9 ? 9 : value - step
        }
        else {
            newValue = value
        }
        return newValue
    }


    mutationFirstMsg(index) {
        this.data.forEach(tyres => {
            const randomValue = this.randomPressureToDiapazon(index)
            tyres.val[index].value = randomValue
            tyres.val[index].state = this.stateTravel === 1 ? 'рейс' : 'парковка'
        })
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
                    this.data.forEach((it, indexTyres) => {
                        it.val[index - 1].value >= 9.3 ? this.indexTyres[indexTyres] = true : this.indexTyres[indexTyres] = false
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