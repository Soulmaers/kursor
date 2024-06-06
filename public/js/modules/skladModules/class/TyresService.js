import { RequestStaticMetods } from './RequestStaticMetods.js';
import { Helpers } from './Helpers.js'
export class TyresService {
    // Метод для создания нового колеса
    static async createTyre(uniqId, fields) {
        const obj = await TyresService.createObject(fields, uniqId)
        console.log(obj)
        // Сохранение колеса в базу данных
        const result = await RequestStaticMetods.saveDataToDBTyres(obj);
        return result;
    }

    // Метод для обновления информации о колесе
    static async updateTyre(dropzone, model) {

        const mileage = model[2].result.find(e => e.params === 'mileage')
        const obj = {}
        obj.idw_tyres = dropzone.getAttribute('rel')
        obj.nameCar = model[0].message
        obj.dateInputSklad = '-'
        obj.dateOutputSklad = Helpers.getCurrentDate()// получаем дату
        obj.dateInstall = Helpers.getCurrentDate()// получаем дату
        obj.idObject = String(model[4])
        obj.mileage = mileage ? Math.round(parseFloat(mileage.value)) : '-'
        obj.flag_status = '0'
        obj.identifikator = dropzone.id
        obj.typeOs = dropzone.parentElement.querySelector('.centerOs_shema_car').getAttribute('rel')
        obj.numberOs = dropzone.parentElement.querySelector('.centerOs_shema_car').id
        obj.login = document.querySelectorAll('.log')[1].textContent // получаем логин
        const result = await RequestStaticMetods.updateDataInDB(obj);
        return result;
    }



    // Метод для обновления информации о колесе
    static async updateTyreSklad(id, data, model, flag_status, comments) {
        const mileage = model[2].result.find(e => e.params === 'mileage')
        console.log(data, mileage.value)
        const obj = {}
        obj.idw_tyres = id
        obj.nameCar = '-'
        obj.dateInputSklad = Helpers.getCurrentDate()// получаем дату
        obj.dateOutputSklad = '-'
        obj.dateInstall = '-'
        obj.idObject = '-'
        obj.mileage = '-'
        obj.flag_status = flag_status
        obj.identifikator = '-'
        obj.typeOs = '-'
        obj.numberOs = '-'
        obj.login = document.querySelectorAll('.log')[1].textContent // получаем логин
        obj.probeg_now = mileage ? (Math.round(parseFloat(mileage.value)) - Math.round(parseFloat(data.mileage))) + Math.round(parseFloat(data.probeg_now)) : Math.round(parseFloat(data.probeg_now))
        obj.probeg_last = Number(data.probeg_passport) - obj.probeg_now
        obj.comments = comments
        console.log(obj)
        const result = await RequestStaticMetods.updateTyreSklad(obj);
        return result;
    }


    static async generateUniqueId() {
        return await RequestStaticMetods.findIdTyres() // Метод для генерации уникального ID (пример)
    }
    static async createObject(fields, uniqId) {
        const obj = {}
        fields.forEach(el => {
            obj[el.getAttribute('id')] = el.value //наполняем объект данными
        });
        obj.login = document.querySelectorAll('.log')[1].textContent // получаем логин
        obj.dateInputSklad = Helpers.getCurrentDate()// получаем дату
        obj.idw_tyres = await TyresService.generateUniqueId();   // Генерация уникального ID для колеса (можно использовать UUID или другой метод)
        obj.flag_status = '1' //ставим статус 1 - на складе
        obj.uniqTyresID = uniqId //добавляем id модели колеса
        obj.dateZamer = obj.ostatok ? Helpers.getCurrentDate() : '-'
        return obj
    }
}