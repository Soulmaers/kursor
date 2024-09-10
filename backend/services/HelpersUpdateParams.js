const databaseService = require('./database.service');

const getDataObjectsToList = require('../services/GetDataObjectsToList')
const { SummaryStatistiks } = require('../modules/statistika.module.js')
const { AlarmControll } = require('../modules/alarm.module.js')
const { Events } = require('../modules/events.module.js')

class HelpersUpdateParams {


    static async update(session) {
        console.time('updatedata')
        const datas = await getDataObjectsToList.getAccountsAddListKursor() //получем данные из БД по объектам wialona
        const result = await getDataObjectsToList.getAccountGroupsAndObjects(datas) //получем данные из БД по объектам wialona
        await Promise.all([
            new AlarmControll(result),
            //   new Events(result, session),
            new SummaryStatistiks(result)
        ]);

        console.timeEnd('updatedata')
    }

    static temporary = (() => {
        let lastDayChecked = new Date().toISOString().split('T')[0]; // Хранит последний проверенный день
        return async function (value) {
            const columns = ['idw', 'data', 'lat', 'lon', 'speed', 'sats', 'oil', 'course', 'pwr', 'engine', 'mileage', 'engineOn', 'last_valid_time'];
            // Фильтруем значения
            const filteredValue = Object.keys(value)
                .filter(key => columns.includes(key))
                .reduce((acc, key) => {
                    acc[key] = value[key]; // Создаем новый объект с отфильтрованными значениями
                    return acc;
                }, {});
            const currentDate = new Date().toISOString().split('T')[0]; // Получаем текущую дату в формате YYYY-MM-DD
            // Проверка, изменился ли день
            if (lastDayChecked !== currentDate) {
                await databaseService.clearTemporary(); // Очищаем таблицу, если день изменился
                lastDayChecked = currentDate; // Обновляем последний проверенный день
            }
            await databaseService.setTemporary(filteredValue); // Записываем данные в таблицу
        };
    })();
}

module.exports = { HelpersUpdateParams }