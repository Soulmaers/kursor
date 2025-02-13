
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

        if (!this.settings) return

        const promises = this.settings.map(async e => {
            try {
                const dataCopy = this.data.map(item => ({ ...item }))
                const tyres = await GetToBaseClass.getTyres(e.id_object)
                const parametrs = await GetToBaseClass.getParametrs(e.id_object)

                if (!tyres || e.start === 0) return null

                const dopdata = await this.processFormStrukture(e, dataCopy)
                const instance = new MutationClass(e, dopdata, parametrs, tyres)
                await instance.init()
                return { data: dopdata, idObject: e.id_object }
            }
            catch (e) {
                console.log(e)
            }
        })
        const result = await Promise.all(promises)
        //  console.log(result)
        return result

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


    async processFormStrukture(e, dataCopy) {
        const porog = await GetToBaseClass.getPorog(this.idDonor, 'pwr')
        dataCopy.sort((a, b) => Number(a.last_valid_time) - Number(b.last_valid_time));
        const processedData = dataCopy.map(elem => {
            return {
                ...elem,
                stop: elem.pwr >= Number(porog[0].value) ? 1 : 0,
                port: 'simulator',
                idObject: e.id_object,
                imei: e.imei_object
            }

        });
        return processedData

    }
}





module.exports = CompilingStruktura