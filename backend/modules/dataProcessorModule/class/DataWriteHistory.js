
const { ToBaseMethods } = require('./ToBaseMethods')
const { HelpersUpdateParams } = require('../../../services/HelpersUpdateParams')
class DataWriteHistory {
    constructor(imei, port, info, id, data, configs) {
        this.imei = imei
        this.port = port
        this.lastObject = info
        this.id = id
        this.data = data
        this.configs = configs
        this.init()
    }



    init() {
        this.checkTarirovka()
        this.defaultUpdateParams()

    }
    async setWriteParams(obj) {
        await ToBaseMethods.setAddDataToGlobalBase(obj)
        await HelpersUpdateParams.temporary(obj)
    }

    checkTarirovka() {
        this.bool = this.configs.find(e => e.param === 'oil')
    }
    defaultUpdateParams() {
        for (let elem of this.lastObject) {

            const obj = {}
            this.data.forEach(el => {
                const nowTime = Math.floor(new Date().getTime() / 1000)
                obj['idw'] = this.id
                obj['imei'] = this.imei
                obj['port'] = this.port
                obj['data'] = String(nowTime)
                obj['time'] = String(elem.time)


                let computedValue = elem.hasOwnProperty(el.meta) ? elem[el.meta] : null;
                const findConfig = this.configs.find(it => it.param === el.params)



                if (findConfig && elem[el.meta]) {
                    //  if (this.id == 28526128) {
                    // console.log(elem[el.meta], findConfig)
                    //  }
                    const result = this.convertionEval(findConfig, elem[el.meta])

                    switch (result) {
                        case true: computedValue = 1
                            break;
                        case false: computedValue = 0
                            break;
                        default: computedValue = result ? result.toFixed(2) : result
                    }
                }
                //  if (this.id == 28526128) {
                //  console.log(computedValue)
                //   }
                obj[el.params] = computedValue
                if (el.params === 'oil') {
                    obj['dut'] = String(elem[el.meta])
                }
            });
            obj['engineOn'] = Number(obj['engine']) === 1 && Number(obj['pwr']) === 1 ? '1' : '0'
            const pwr = this.data.find(e => e.params === 'pwr')
            if (pwr) obj['pwr'] = String(elem[pwr.meta])
            obj['oil'] = !this.bool ? null : obj['oil']


            this.setWriteParams(obj)
        }
    }

    convertionEval(formula, value) {
        const x = Number(value)
        let formattedFormula;
        // Выполняем замену 'x' на значение переменной
        if (formula.param === 'oil') {
            if (x > 4100) return null
            const formattedExpression = formula.formula.replace(/,/g, '.');
            formattedFormula = this.transformExpressionWithExponent(formattedExpression, x);
        }
        else {
            formattedFormula = formula.formula.replace(/x/g, x);
        }
        // Используем eval для оценки выражения
        const result = eval(formattedFormula);
        //   if (this.id == '28602115') {
        // console.log(result)
        //  }
        return result
    }

    transformExpressionWithExponent(str, x) {
        // Убираем пробелы вокруг x и степеней
        str = str.replace(/\s+/g, '');
        // Добавляем знак умножения перед 'x', если его нет
        str = str.replace(/(\d)(x)/g, '$1*$2');
        // Заменяем выражения вида x2 на Math.pow(x, 2)
        str = str.replace(/x\^(\d+)/g, 'Math.pow(x, $1)');  //str.replace(/x(\d+)/g, 'Math.pow(x, $1)');
        // Заменяем все оставшиеся 'x' на значение переменной x
        str = str.replace(/x/g, x);

        return str;
    }

}

module.exports = { DataWriteHistory }