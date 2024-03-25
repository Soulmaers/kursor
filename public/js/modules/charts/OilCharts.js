import { dataInfo, model } from '../paramsTyresView.js'

let isCanceled = false;
export class OilCharts {
    constructor() {
        this.t1 = t1
        this.t2 = t2
        this.data = null
        this.graf = null
        this.init()

    }
    async init() {
        if (isCanceled) {
            return Promise.reject(new Error('Запрос отменен'));
        }
        isCanceled = true; // Устанавливаем флаг в значение true, чтобы прервать предыдущее выполнение
        this.data = await this.createStructura()
        if (this.data.length === 0) {
            document.querySelector('.noGraf').style.display = 'block'
            const grafOld = document.querySelector('.infoGraf')
            if (grafOld) {
                grafOld.remove()
            }
            const loaders = document.querySelector('.loaders_charts')
            loaders.style.display = 'none';
            isCanceled = false;
            return
        }
        this.createChart()
    }

    createChart() {
        this.createContainer()
        //  this.createLegend()
        //  this.createBodyCharts()
        // this.createIconsCar()
        // this.toggleChecked()
        const loaders = document.querySelector('.loaders_charts')
        loaders.style.display = 'none';
        isCanceled = false;

    }
    async createStructura() {
        const [params, tyres, osibar] = dataInfo
        // Преобразование массива osss в объект для быстрого доступа
        const osssMap = {};
        osibar.forEach(e => {
            osssMap[e.idOs] = e;
        });
        const idw = Number(document.querySelector('.color').id)
        const t1 = this.t1
        const t2 = this.t2
        const paramss = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw, t1, t2 }))
        }
        const res = await fetch('/api/getDataParamsInterval', paramss)
        const data = await res.json();
        const newGlobal = data.map(it => {
            return {
                id: it.idw,
                time: new Date(Number(it.last_valid_time) * 1000),
                speed: Number(it.speed),
                geo: [Number(it.lat), Number(it.lon)],
                oil: Number(it.oil),
                pwr: Number(it.pwr),
                engine: Number(it.engine),
                mileage: Number(it.mileage),
                curse: Number(it.course),
                sats: Number(it.sats),
                engineOn: Number(it.engineOn),
                summatorOil: summatorOil ? Number(it.summatorOil) : null
            }
        })
        newGlobal.sort((a, b) => a.time - b.time)
        if (data.length === 0) {
            document.querySelector('.noGraf').style.display = 'block'
            const grafOld = document.querySelector('.infoGraf')
            if (grafOld) {
                grafOld.remove()
            }
            const loaders = document.querySelector('.loaders_charts')
            loaders.style.display = 'none';
            isCanceled = false;
            return
        }
        document.querySelector('.noGraf').style.display = 'none'
        console.log(newGlobal)
    }
}