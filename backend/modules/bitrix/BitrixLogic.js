const databaseService = require('../../services/database.service')
const BitrixGetData = require('./BitrixGetData')


class BitrixLogic {

    static objColors = {
        4: 'зеленый', //зеленый
        3: 'зеленый',//желтый
        2: 'желтый',//оранж
        1: 'красный'//красный
    }

    static gener(el) {
        let generatedValue;
        if (el === 100) {
            generatedValue = 4;
        }
        if (el >= 80 && el < 100) {
            generatedValue = 3;
        }
        if (el >= 40 && el < 80) {
            generatedValue = 2;
        }
        if (el < 40) {
            generatedValue = 1;
        }
        return generatedValue;
    };

    static createData(result) {
        const obj = {
            Parameter1: result.N1,
            Parameter2: result.N2,
            Parameter3: result.N3,
            Parameter4: result.N4,
            Parameter5: result.ostatok,
            Parameter6: BitrixLogic.objColors[BitrixLogic.gener(result.ostatok)],
            Parameter7: result.dateZamer,
            Parameter8: result.probegVal
        }
        return obj
    }


    static async getStruktura(result) {
        const idw = result[0].idw
        const coefPWR = await databaseService.getValuePWRToBase(idw, 'pwr')  //получение порогового значения по питанию
        const object = {
            mileage: null,
            oil: null,
            summatorOil: null,
            pwr: null,
            engineOn: null,
            condition: null,
            lat: null,
            lon: null,
            geo: null
        }
        const objCondition = {
            0: 'Парковка',
            1: 'Движение',
            2: 'Стоянка'
        }

        const engine = result.find(e => e.params === 'engine')
        const engineValue = engine ? Number(engine.value) : null
        const speed = result.find(e => e.params === 'speed')
        const speedValue = speed ? Number(speed.value) : null
        result.forEach(el => {
            if (object.hasOwnProperty(el.params))
                object[el.params] = el.value

            if (el.params === 'pwr') {
                console.log(engineValue, Number(el.value), Number(coefPWR[0].value))
                object['engineOn'] = engineValue === 1 && Number(el.value) >= Number(coefPWR[0].value) ? 'Запущен' : 'Не запущен'
            }
        });

        if (speedValue !== '-' && (speedValue || speedValue === 0)) {
            const num = (speedValue > 0 && engineValue === 1) ? 1 : (speedValue === 0 && engineValue === 1) ? 2 :
                (speedValue === 0 && engineValue === 0) ? 0 : undefined;
            object.condition = objCondition[num]
        }
        const geo = await BitrixLogic.geoCoding(object.lat, object.lon)
        object.geo = geo
        return object
    }


    static async geoCoding(geoY, geoX) {
        const axios = require('axios');

        const API_KEY = 'e156e8924c3a4e75bc1eac26f153457e';
        const API_URL = `https://api.opencagedata.com/geocode/v1/json`;

        // Подставьте ваши координаты широты и долготы
        var lat = geoY; // Ваша широта
        var lng = geoX; // Ваша долгота
        const response = await axios.get(`${API_URL}`, {
            params: {
                q: `${lat},${lng}`,
                key: API_KEY,
                no_annotations: 1,
                language: 'ru'
            }
        });
        const data = response.data; // данные ответа от API
        const address = data.results[0].components;
        const adres = [];
        adres.push(address.road_reference)
        adres.push(address.municipality)
        adres.push(address.county)
        adres.push(address.road)
        adres.push(address.town)
        adres.push(address.state)
        adres.push(address.country)
        const res = Object.values(adres).filter(val => val !== undefined).join(', ');
        return res

    }

    static createDataObject(result) {
        const obj = {
            Parameter1: Math.round(parseFloat(result.mileage)),
            Parameter2: result.summatorOil ? Number(result.summatorOil) : Number(result.oil),
            Parameter3: Number(result.pwr),
            Parameter4: result.engineOn,
            Parameter5: result.condition,
            Parameter6: result.geo
        }
        return obj
    }

    static async createDataEvent(array, geo, idObject, name, idBitrix, time) {
        const koordinates = await BitrixLogic.geoCoding(geo[0], geo[1])
        const event = array[0].event === 'Предупреждение' ? 'Давление колеса' : array[0].event

        const obj = {
            Parameter1: event,
            Parameter3: null,
            Parameter4: event,
            Parameter5: BitrixLogic.timeFormat(time),
            Parameter6: null,
            Parameter7: koordinates,
            Parameter8: `${geo[1]},${geo[0]}`,
            Parameter9: null
        }
        const res = await BitrixGetData.BitrixGetData.getDataBitrix(idBitrix)
        console.log(res)
        const mileage = res.find(e => e.params === 'mileage' && e.idBitrixObject === idBitrix)
        console.log('пробег:', mileage)
        obj.Parameter9 = mileage && mileage.value ? Math.round(parseFloat(mileage.value)) : null
        if (array[0].event === 'Предупреждение') {
            console.log(array)
            const param = res.find(e => e.params === array[0].tyres && e.idBitrixObject === idBitrix)
            console.log('id колеса:', param)
            obj.Parameter3 = param ? param.idBitrix : null
            obj.Parameter6 = `${array[0].param},${array[0].alarm}`
        }
        if (array[0].event === 'Заправка' || array[0].event === 'Слив') {
            obj.Parameter6 = array[0].litrazh
        }
        if (array[0].event === 'Потеря связи') {
            obj.Parameter6 = array[0].lasttime
        }
        return obj
    }

    static timeFormat(time) {
        const times = new Date(time * 1000)
        const day = times.getDate();
        const month = (times.getMonth() + 1).toString().padStart(2, '0');
        const year = times.getFullYear();
        const hours = times.getHours().toString().padStart(2, '0');
        const minutes = times.getMinutes().toString().padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }


}



module.exports = {
    BitrixLogic
}