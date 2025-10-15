const databaseService = require('./database.service');
const wialonModule = require('../modules/wialon.module');
const axios = require('axios');
const XLSX = require('xlsx');
class HelpersDefault {
    //39e1405494b595e6890a684bdb998c657B0E5B18E670CCE536AD11EB368A1DD86776273D
    //39e1405494b595e6890a684bdb998c65381701F3CB8D7773666633574238F6E412740CC9
    static async getSessionWialon() {


        const session = await wialonModule.login(`"a3f748fdc918b08cc0836aa5cc8265198E8CA903791530EAA7F11945BDB2B4ABBCA520E1"`);
        console.log('сессия', session.eid)
        //  const res = await HelpersDefault.updateToken()
        return session
    }


    static async updateToken() {
        const url = `https://hst-api.watchit.ru/wialon/ajax.html?svc=token/update&params={
        "callMode":"create","h":"","app":"cursor-gps", "at":0,"dur":0,"fl":-1,"p":"{}","items":[],"deleteAll":false}`;

        const headers = {
            'Content-Type': 'application/json'
        };

        try {
            const response = await axios.post(url, {}, { headers: headers })
            console.log(response.data)
        }
        catch (e) {
            pm
            console.log(e)
        }
    }
    static async getDataToInterval(active, t1, t2) {
        const columns = ['idw', 'data', 'lat', 'lon', 'speed', 'sats', 'oil', 'course', 'pwr', 'engine', 'mileage', 'engineOn', 'last_valid_time']
        const resnew1 = await databaseService.getParamsToPressureAndOilToBase(t1, t2, active, columns, 0)  //получение параметров за интервал
        const arrayData = resnew1.map(e => {
            return Object.keys(e).reduce((acc, key) => {
                if (columns.includes(key)) {
                }
                return acc;
            }, {});
        });
        return arrayData
    }

    static filtersOil(array, koef) {

        const average = array
            .filter(e => Number(e.dut) < 4097)
            .map(it => ({
                ...it,
                dut: Number(it.dut)
            }));

        const medianArray = []

        medianArray.push(...average.slice(0, koef));
        for (let i = koef; i < average.length; i++) {
            const previousElements = average.slice(i - koef, i + 1);
            const validPreviousElements = previousElements.filter(val =>
                val.dut !== undefined &&
                !isNaN(val.dut)
            );
            if (validPreviousElements.length > 0) {
                const sum = validPreviousElements.reduce((acc, val) => acc + Number(val.dut), 0);
                const averages = sum / validPreviousElements.length;
                //   average[i].dut = Math.round(averages); // Округляем

                const newElement = { ...average[i], dut: Math.round(averages) };
                medianArray.push(newElement);
            } else {
                average[i].dut = 0;
            }
        }
        return medianArray
    }

    static medianFilters(array, koef) {
        let celevoy = array
            .filter(e => Number(e.dut) < 4097)
            .map(it => ({
                ...it,
                dut: Number(it.dut)
            }));

        const medianArray = []
        if (celevoy.length < 3) {
            return [...celevoy]
        }
        if (koef === 0) {
            medianArray.push(...celevoy.slice(0, 3));
            for (let i = 3; i < celevoy.length; i++) {
                const previuosElements = celevoy.slice(i - 3, i)
                previuosElements.sort((a, b) => Number(a.dut) - Number(b.dut))
                const median = previuosElements[1].dut
                const newElement = { ...celevoy[i], dut: median };
                medianArray.push(newElement);
            }
        }
        else {
            const window = koef % 2 === 0 ? koef - 1 : koef
            medianArray.push(...celevoy.slice(0, window));
            for (let i = window; i < celevoy.length; i++) {
                const windowElements = celevoy.slice(i - window, i)
                windowElements.sort((a, b) => Number(a.dut) - Number(b.dut))
                let median;
                /* if (windowElements.length % 2 === 0) {
                     const indexNumber = windowElements.length / 2
                     median = (parseInt(Number(windowElements[indexNumber - 1].dut) + Number(windowElements[indexNumber].dut))) / 2
                 }
                 else {*/

                const indexNumber = Math.floor(windowElements.length / 2)
                median = Number(windowElements[indexNumber].dut)
                //   }
                const newElement = { ...celevoy[i], dut: median };
                medianArray.push(newElement);
            }
        }
        return medianArray
    }

    static datatime(timestamp) {

        // Создаем новый объект Date с временем в миллисекундах
        const date = new Date(timestamp * 1000);

        // Получаем часы, минуты и секунды
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // Получаем дату в формате "ГГГГ-ММ-ДД ЧЧ:ММ:СС"
        const formattedDate = date.toISOString().split('T')[0] + ' ' + `${hours}:${minutes}:${seconds}`;

        return formattedDate
    }
    static excel(array, modifiedArray, koef) {
        // Создаем книгу Excel и лист
        const wb = XLSX.utils.book_new();

        // Создаем заголовки для столбцов
        const header = ['Index', 'Original Value', 'Modified Value'];
        // Создаем данные для листа
        const data = [header]; // Начинаем с заголовков
        array.forEach((value, index) => {
            //  console.log(Number(value.last_valid_time))
            data.push([HelpersDefault.datatime(Number(value.last_valid_time)), Number(value.dut), Number(modifiedArray[index].dut)]);
        });

        // Создаем лист из данных
        const ws = XLSX.utils.aoa_to_sheet(data);

        // Добавляем лист в книгу
        XLSX.utils.book_append_sheet(wb, ws, 'Modified Data');

        // Сохраняем книгу с именем файла
        XLSX.writeFile(wb, `${koef}modified_data.xlsx`);
    }
    static sortTarirOil = (data, dut) => {
        const x = [];
        const y = [];
        const points = []
        data.forEach(el => {
            const point = []
            x.push(Number(el.dut))
            y.push(Number(el.litrazh))
            point.push(Number(el.dut))
            point.push(Number(el.litrazh))
            points.push(point)
        })
        let degree = x.length < 3 ? 1 : 6
        const coeffs = this.polynomialApproximation(x, y, degree)
        const approximated = this.evaluatePolynomial([dut], coeffs)[0];
        const znak = Number((approximated * 0.9987).toFixed(0))
        return znak
    }
    static polynomialApproximation(x, y, degree) {
        const n = x.length;
        const m = degree + 1;
        let A = Array.from({ length: m }, () => new Array(m).fill(0));
        let B = new Array(m).fill(0);
        let a = new Array(m).fill(0);
        for (let i = 0; i < n; i++) {
            let xi = x[i];
            let yi = y[i];
            for (let j = 0; j < m; j++) {
                for (let k = 0; k < m; k++) {
                    let val = Math.pow(xi, j + k);
                    if (Number.isFinite(val)) {
                        A[j][k] += val;
                    }
                }
                let val = Math.pow(xi, j) * yi;
                if (Number.isFinite(val)) {
                    B[j] += val;
                }
            }
        }
        for (let j = 0; j < m; j++) {
            for (let k = j + 1; k < m; k++) {
                let coef = A[k][j] / A[j][j];
                B[k] -= coef * B[j];
                for (let l = j; l < m; l++) {
                    let val = A[j][l] * coef;
                    if (Number.isFinite(val)) {
                        A[k][l] -= val;
                    }
                }
            }
        }
        for (let j = m - 1; j >= 0; j--) {
            let tmp = B[j];
            for (let k = j + 1; k < m; k++) {
                tmp -= a[k] * A[j][k];
            }
            let val = A[j][j];
            if (!Number.isFinite(val)) {
                val = Number.MAX_VALUE;
            }
            a[j] = tmp / val;
        }

        return a;
    }

    static formula(coefficients) {
        coefficients.reverse()
        const formula = coefficients.reduce((acc, coeff, index) => {
            const exponent = coefficients.length - 1 - index;
            let term;
            if (exponent === 0) {
                term = `${coeff}`;
            } else if (exponent === 1) {
                term = `${coeff}x`;
            } else {
                term = `${coeff}x^${exponent}`;
            }
            return acc + (coeff < 0 ? ` - ${term.replace('-', '')}` : ` + ${term}`);
        }, '');
        return formula.replace(/^ \+ /, ''); // remove leading '+'
    }
    static evaluatePolynomial(x, a) {
        const n = a.length;
        const y = new Array(x.length).fill(0);
        for (let i = 0; i < x.length; i++) {
            let xi = x[i];
            for (let j = n - 1; j >= 0; j--) {
                y[i] = y[i] * xi + a[j];
            }
        }
        return y;
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
        // console.log(res)
        const filteredObjects = res
            .filter(obj => obj) // Фильтруем по наличию ключа '6'
            .map(obj => [obj.object_id, obj.object_name, obj.group_name ? obj.group_name : 'Без группы', obj.group_id ? obj.group_id : 'ungrouped', obj.typeobject]); // Извлекаем значение по ключу '6'

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