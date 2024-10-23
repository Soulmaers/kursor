
const { HelpersDefault } = require('../../../services/HelpersDefault')
const { ToBaseMethods } = require('./ToBaseMethods')

class DrainCalculate {
    constructor(data, settings, id) {
        this.dataOrigin = data;
        this.settings = settings;
        this.id = id
        this.increasingIntervals = [];
    }


    async init() {
        this.config = await ToBaseMethods.getConfigs(this.id)
        if (!this.config) { return null }
        await this.filtration()
        this.calculateIntervals(this.data);
        this.volume = this.filterIntervals();

        this.oil = this.volume.reduce((acc, el) => {
            const diff = this.calkut(Number(el[0].dut) - Number(el[el.length - 1].dut))
            return acc + diff;
        }, 0);

        const count = this.volume.map(el => {
            const start = this.findStartDrain(el)
            return {
                time: start.last_valid_time,
                geo: [start.lat, start.lon],
                startOil: this.calkut(Number(el[0].dut)),
                finishOil: this.calkut(Number(el[el.length - 1].dut)),
                value: 0,
                value2: this.calkut(Number(el[0].dut)) - this.calkut(Number(el[el.length - 1].dut))
            };
        });
        return [this.oil, count];
    }

    findStartDrain(kortezh) {
        let delta = 0
        let startTime = null
        for (let i = 0; i < kortezh.length - 1; i++) {
            const raznost = Number(kortezh[i].dut) - Number(kortezh[i + 1].dut)
            if (raznost > delta) {
                delta = raznost
                startTime = kortezh[i]
            }
        }
        return startTime
    }
    calculateIntervals(data) {
        let segment = [];
        let segmentStarted = false; // Флаг, указывающий, что сегмент уже начался

        for (let i = 0; i < data.length; i++) {
            // Если сегмент еще не начался
            if (!segmentStarted) {
                segment.push(data[i]);
                segmentStarted = true; // Установим флаг, что сегмент начался
            } else {
                const lastDut = Number(segment[segment.length - 1].dut);
                const currentDut = Number(data[i].dut);

                // Если текущее значение больше последнего в сегменте, продлеваем сегмент
                if (currentDut < lastDut) {
                    segment.push(data[i]);
                }
                // Если текущее значение равно последнему в сегменте, проверяем, если сегмент уже был начат.
                else if (currentDut === lastDut) {
                    // Равные значения не добавляются в сегмент, если предыдущее значение было больше
                    if (segment.length > 0 && lastDut < Number(segment[segment.length - 1].dut)) {
                        segment.push(data[i]);
                    }
                }
                // Если текущее значение меньше последнего, мы завершаем сегмент
                else {
                    // Сохраним сегмент, если он больше 1
                    if (segment.length > 1) {
                        this.increasingIntervals.push(segment);
                    }
                    // Начать новый сегмент
                    segment = [data[i]];
                    segmentStarted = true; // Сброс флага и снова начнем сегмент
                }
            }
        }

        // Добавление последнего сегмента, если он больше 1
        if (segment.length > 1) {
            this.increasingIntervals.push(segment);
        }
    }

    async filtration() {
        this.data = HelpersDefault.filtersOil(this.dataOrigin, Number(this.config.dopValue))
    }
    filterIntervals() {
        const time = 300
        const { volume, duration } = this.settings['Топливо'];
        const minTime = this.timeStringToUnix(duration.timeDrain)
        const volumeValue = Number(volume.volumeDrain)

        // Шаг 1: Объединяем интервалы
        /* let mergedIntervals = [];
         let index = 0;
         while (index < this.increasingIntervals.length) {
             const currentInterval = this.increasingIntervals[index];
 
             // Проверяем, есть ли следующий интервал
             if (index < this.increasingIntervals.length - 1) {
                 const nextInterval = this.increasingIntervals[index + 1];
                 const currentTime = currentInterval[currentInterval.length - 1].last_valid_time;
                 const nextTime = nextInterval[0].last_valid_time;
 
                 const timeDifference = Number(nextTime) - Number(currentTime);
 
                 // Если временной промежуток меньше minTime, объединяем интервалы
                 if (timeDifference < minTime) {
                     // Объединяем текущий интервал с следующим
                     // Добавляем все элементы следующего интервала в текущий
                     currentInterval.push(...nextInterval);
                     // Удаляем следующий интервал, так как он объединен
                     index++; // Пропускаем следующий интервал, так как он объединен
                 }
             }
 
             // Добавляем текущий интервал (либо объединенный, либо без изменений) в массив
             mergedIntervals.push(currentInterval);
             index++; // Переходим к следующему интервалу
         }*/

        return this.increasingIntervals.filter(interval => {
            const firstOil = interval[0].dut;
            const startTime = interval[0].last_valid_time
            const lastOil = interval[interval.length - 1].dut;
            const finishTime = interval[interval.length - 1].last_valid_time
            const differenceDUT = Number(firstOil) - Number(lastOil);
            const diffenenceTime = Number(finishTime) - Number(startTime)

            const differenceOil = this.calkut(differenceDUT);
            return differenceOil > volumeValue && diffenenceTime < time;
        });
    }
    timeStringToUnix(timeString) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        const milliseconds = (hours * 3600 + minutes * 60 + seconds);
        return milliseconds
    }

    calkut(dut) {
        function transformExpressionWithExponent(str, x) {
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

        const formattedExpression = this.config.formula.replace(/,/g, '.');
        const transformedExpression = transformExpressionWithExponent(formattedExpression, dut);
        try {
            const result = eval(transformedExpression);
            return parseInt(result)


        } catch (error) {
            console.error("Ошибка при вычислении:", error);
        }

    }
}


module.exports = { DrainCalculate }