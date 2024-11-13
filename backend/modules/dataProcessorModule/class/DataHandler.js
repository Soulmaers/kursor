const { ToBaseMethods } = require('./ToBaseMethods')

class DataHandlerUpdateBase {
    constructor(imei, port, info, id, data, configs) {
        this.imei = imei
        this.port = port
        this.lastObject = info[info.length - 1]
        this.id = id
        this.data = data
        this.configs = configs
        this.init()
    }



    async init() {
        this.getTime()
        this.checkTarirovka()
        await this.defaultUpdateParams()
        await this.setUpdateParams()
    }
    async setUpdateParams() {
        await ToBaseMethods.setUpdateValueSensStorMeta(this.imei, this.port, this.object)
    }

    checkTarirovka() {
        this.bool = this.configs.find(e => e.param === 'oil')
    }
    async defaultUpdateParams() {
        this.object = await Promise.all(this.data.map(async el => {
            const hasValue = this.lastObject.hasOwnProperty(el.meta) && this.lastObject[el.meta] !== null;
            const status = hasValue ? 'true' : 'false';
            const dataTime = hasValue ? this.nowTime : el.data;

            if (!hasValue) {
                return { key: el.meta, params: el.params, value: el.value, status, data: dataTime };
            }

            let computedValue = String(this.lastObject[el.meta]);
            const findConfig = this.configs.find(it => it.param === el.params)

            if (findConfig && findConfig.param !== 'pwr') {
                const result = await this.convertionEval(findConfig, this.lastObject[el.meta]);
                switch (result) {
                    case true: computedValue = 1; break;
                    case false: computedValue = 0; break;
                    default: computedValue = result ? result.toFixed(2) : result //parseFloat(result.toFixed(2));
                }
            }
            return { key: el.meta, params: el.params, value: String(computedValue), status, data: dataTime };
        }));
    }


    async convertionEval(formula, value) {
        let x = Number(value)
        let formattedFormula;
        // Выполняем замену 'x' на значение переменной
        if (formula.param === 'oil') {
            if (x > 4100) return null
            if (Number(formula.dopValue) > 1) {
                const array = await this.getValueKoef(formula, this.id)
                array.push({ 'dut': x })
                x = this.average(array)
            }
            const formattedExpression = formula.formula.replace(/,/g, '.');
            formattedFormula = this.transformExpressionWithExponent(formattedExpression, x);
        }
        else {
            formattedFormula = formula.formula.replace(/x/g, x);
        }
        // Используем eval для оценки выражения
        const result = eval(formattedFormula);
        return result
    }

    transformExpressionWithExponent(str, x) {
        // Убираем пробелы вокруг x и степеней
        str = str.replace(/\s+/g, '');
        // Добавляем знак умножения перед 'x', если его нет
        str = str.replace(/(\d)(x)/g, '$1*$2');
        // Заменяем выражения вида x2 на Math.pow(x, 2)
        str = str.replace(/x(\d+)/g, 'Math.pow(x, $1)');
        // Заменяем все оставшиеся 'x' на значение переменной x
        str = str.replace(/x/g, x);

        return str;
    }

    average(array) {
        const total = array.reduce((sum, obj) => sum + Number(obj.dut), 0);
        return parseInt(total / array.length);
    }
    async getValueKoef(filtr, id) {
        const res = await ToBaseMethods.getOil(filtr.dopValue, id)
        return res
    }
    getTime() {
        const now = new Date();
        this.nowTime = Math.floor(now.getTime() / 1000);
    }
}

module.exports = { DataHandlerUpdateBase }