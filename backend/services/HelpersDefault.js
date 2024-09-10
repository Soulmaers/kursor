const databaseService = require('./database.service');

class HelpersDefault {


    static async getDataToInterval(active, t1, t2) {
        const columns = ['idw', 'data', 'lat', 'lon', 'speed', 'sats', 'oil', 'course', 'pwr', 'engine', 'mileage', 'engineOn', 'last_valid_time']
        const resnew1 = await databaseService.getParamsToPressureAndOilToBase(t1, t2, active, columns, 0)  //получение параметров за интервал
        const arrayData = resnew1.map(e => {
            return Object.keys(e).reduce((acc, key) => {
                if (columns.includes(key)) {
                    acc[key] = e[key];
                }
                return acc;
            }, {});
        });
        return arrayData
    }


    static timefn = () => { //форматирование интервала времени с 0 часов
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const startOfTodayUnix = Math.floor(currentDate.getTime() / 1000);
        const unix = Math.floor(new Date().getTime() / 1000);
        const timeNow = unix
        const timeOld = startOfTodayUnix
        return [timeNow, timeOld]
    }
    static format = (data) => {  //форматирование структуры данных
        const resultData = data.flat().flatMap(el => {
            let res = [Number(el[4]), el[0].message, el[7], el[el.length - 1]];
            if (el.length === 10 && el[8].sub && el[8].sub.length !== 0) {
                return el[8].sub.flat().map(it => [Number(it[4]), it[0].message, it[7], it[it.length - 1]]);
            }
            return [res]; // Обернули res в массив, чтобы сохранить формат двумерного массива
        });
        const uniqueMap = new Map(resultData.map(subArr => [subArr[0], subArr]));
        const uniqueArr = Array.from(uniqueMap.values());
        return uniqueArr
    }

    static formats = (data) => {
        // Функция для извлечения всех объектов из группы
        const res = data.flatMap(account => [
            ...account.groups.flatMap(group => group.objects),
            ...account.ungroupedObjects
        ]);
        const filteredObjects = res
            .filter(obj => obj) // Фильтруем по наличию ключа '6'
            .map(obj => [obj.object_id, obj.object_name, obj.group_name ? obj.group_name : 'Без группы', obj.group_id ? obj.group_id : 'ungrouped']); // Извлекаем значение по ключу '6'

        return filteredObjects
    }

    static formatFinal = (data) => {
        const res = data.flatMap(account => [
            ...account.groups.flatMap(group => group.objects),
            ...account.ungroupedObjects
        ]);
        return res
    }


    static processing = async (arr, timez, idw, geoLoc, group, name, start) => { // подготовка шаблона строки события
        const newdata = arr[0]
        let mess;
        // const res = await databaseService.dostupObject(idw) //проверка наличия объекта в БД
        const event = newdata.event
        if (event === 'Заправка') {
            mess = [{ event: event, group: `Компания: ${group}`, name: `${name}`, litrazh: `${start}`, time: `${newdata.time}` }]
        }
        if (event === 'Простой') {
            mess = [{ event: event, group: `Компания: ${group}`, name: `${name}`, time: `${newdata.time}`, alarm: `${newdata.alarm}` }]
        }
        if (event === 'Предупреждение') {
            mess = [{ event: event, name: `${name}`, time: `${newdata.time}`, tyres: `${newdata.tyres}`, param: `${newdata.param}`, alarm: `${newdata.alarm}` }]
        }
        if (event === 'Слив') {
            mess = [{ event: event, group: `Компания: ${group}`, name: `${name}`, litrazh: `${start}`, time: `${newdata.time}` }]
        }
        if (event === 'Потеря связи') {
            mess = [{ event: event, group: `Компания: ${group}`, name: `${name}`, lasttime: `${newdata.lasttime}` }]
        }
        if (event === 'Состояние') {
            mess = [{ event: event, group: `Компания: ${group}`, name: `${name}`, condition: `${newdata.lasttime}` }]
        }
        return { msg: mess, logins: ['admin', 'soulmaers'] }//res }
    }

    static convert = (ob) => {  //фильтрация уникальных элементов
        const uniq = new Set(ob.map(e => JSON.stringify(e)));
        return Array.from(uniq).map(e => JSON.parse(e));
    }



    static createDate = () => {   //форматироваие даты
        let today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
        today = day + '.' + month + '.' + year;
        let time = new Date();
        const hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
        const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        time = hour + ':' + minutes
        const todays = today + ' ' + time
        return [todays]

    }
    static getCurrentDate = () => {
        const date = new Date(); // Получаем текущую дату и время
        const year = date.getFullYear(); // Получаем год
        const month = date.getMonth() + 1; // Получаем месяц (getMonth возвращает месяцы от 0 до 11)
        const day = date.getDate(); // Получаем день
        const hours = date.getHours(); // Получаем часы
        const minutes = date.getMinutes(); // Получаем минуты
        const seconds = date.getSeconds(); // Получаем секунды

        // Форматируем месяц, день, часы, минуты и секунды, чтобы они всегда были в двухзначном формате
        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

        return `${formattedDay}-${formattedMonth}-${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };
}



module.exports = { HelpersDefault }