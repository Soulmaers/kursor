


export class ExportExceltarir {
    constructor(id, param) {
        this.id = id
        this.param = param

        this.init()
    }


    async init() {
        await this.getTarirTable()
        this.exportExcel()
    }


    async getTarirTable() {
        const idw = this.id
        const param = this.param
        console.log(idw, param)
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ idw, param })
        }
        const res = await fetch('api/getTarirTable', params)
        const result = await res.json()
        this.data = result.map(e => ({ dut: e.dut, litrazh: e.litrazh }))
        console.log(this.data)
    }


    exportExcel() {
        // Создание новой рабочей книги
        const wb = XLSX.utils.book_new();
        // Преобразование данных в формат, пригодный для импорта в Excel
        const ws = XLSX.utils.json_to_sheet(this.data);
        // Добавление листа в книгу
        const sheetName = new Date().toLocaleDateString(); // Имя листа - текущая дата
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        // Сохранение файла
        XLSX.writeFile(wb, `${sheetName}.xlsx`);
    }

}