
const GetToBaseClass = require('./GetToBaseClass')
const MutationClass = require('./MutationClass')
const XLSX = require('xlsx')

class CompilingStruktura {
    constructor(value, id) {
        this.data = value
        this.idDonor = id
    }

    async init() {
        // this.dateConvert()

        return await this.getData()

    }

    async getData() {

        this.settings = await GetToBaseClass.getSettingSimulation(this.idDonor)
        console.log(this.data)
        if (!this.settings || this.settings.start === 0) return
        this.id = this.settings[0].id_object //получаем id сима

        const promises = this.settings.map(async e => {
            this.tyres = await GetToBaseClass.getTyres(e.id_object)
            this.parametrs = await GetToBaseClass.getParametrs(e.id_object)

            if (!this.tyres) return []

            this.data = await this.processFormStrukture(e)


            const instance = new MutationClass(e, this.data, this.parametrs)
            const mutationData = instance.init()
            // this.exportToExcel(this.data[8].val);
            return { data: this.data, idObject: e.id_object }
        })
        const result = await Promise.all(promises)
        //  console.log(result)
        console.log(result[0].data[0].val)
    }


    exportToExcel(data) {
        // Создаем новую рабочую книгу
        const wb = XLSX.utils.book_new();

        // Преобразуем массив в формат, подходящий для Excel
        const worksheetData = data.map(e => ({
            State: e.state,
            Cube: e.cube,
            Value: e.value,
            Dates: new Date(e.dates)
        }));

        // Создаем рабочий лист
        const ws = XLSX.utils.json_to_sheet(worksheetData);

        // Добавляем лист в книгу
        XLSX.utils.book_append_sheet(wb, ws, 'Данные');

        // Генерируем файл и скачиваем его
        XLSX.writeFile(wb, 'data.xlsx');
    }



    dateConvert() {
        const allEqual = this.time.every(val => val === this.time[0]);
        if (allEqual) {
            const [time1, time2] = this.time

            const formattedDateTime1 = `${time1.split('.')[2]}-${time1.split('.')[1]}-${time1.split('.')[0]}`
            const formattedDateTime2 = `${time2.split('.')[2]}-${time2.split('.')[1]}-${time2.split('.')[0]}`
            const timeStart = Math.floor(new Date(formattedDateTime1).getTime() / 1000)
            const timeFinish = Math.floor(new Date(formattedDateTime2).getTime() / 1000)
            this.time = [timeStart - 10800, timeFinish + 86399 - 10800]
        }
        else {
            this.time = this.time.map(e => {
                const formattedDate = `${e.split('.')[2]}-${e.split('.')[1]}-${e.split('.')[0]}`
                const unix = Math.floor(new Date(formattedDate).getTime() / 1000)
                return unix
            })
            this.time = [this.time[0] - 10800, this.time[1] + 86399 - 10800]
        }
    }


    async processFormStrukture(settings) {
        const porog = await GetToBaseClass.getPorog(this.idDonor, 'pwr')
        console.log(porog)
        const { low_min, low_max, normal_min, normal_max, high_min, high_max } = settings
        this.data.sort((a, b) => Number(a.last_valid_time) - Number(b.last_valid_time));
        const paramnew = this.tyres.reduce((acc, el) => {
            const sens = this.parametrs.find(it => Object.values(it).includes(el.pressure));
            if (!sens) return acc;
            const processedData = this.data.map(elem => ({
                dates: new Date(Number(elem.last_valid_time) * 1000),
                sats: Number(elem.sats),
                speed: Number(elem.speed),
                stop: elem.pwr >= Number(porog[0].value) ? 1 : 0,//Number(elem.engineOn),
                value: elem[el.pressure] ? Number(elem[el.pressure]) : -0.1,
                tvalue: elem[el.temp] ? (Number(elem[el.temp]) !== -128 && Number(elem[el.temp]) !== -50 && Number(elem[el.temp]) !== -51 ? Number(elem[el.temp]) : -0.1) : -0.1
            }));

            acc.push({
                sens: sens.sens,
                position: Number(el.tyresDiv),
                parametr: el.pressure,
                bar: { low: [low_min, low_max], normal: [normal_min, normal_max], high: [high_min, high_max] },
                val: processedData
            });

            return acc;
        }, []);
        paramnew.sort((a, b) => a.position - b.position);
        //  console.log(paramnew)
        return paramnew;
    }


}





module.exports = CompilingStruktura