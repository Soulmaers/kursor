
import { RequestStaticMetods } from "./RequestStaticMetods.js";

export class Helpers {
    static getCurrentDate() {
        const date = new Date(); // Получаем текущую дату и время
        const year = date.getFullYear(); // Получаем год
        const month = date.getMonth() + 1; // Получаем месяц (getMonth возвращает месяцы от 0 до 11)
        const day = date.getDate(); // Получаем день
        // Форматируем месяц и день, чтобы они всегда были в двухзначном формате
        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDay = day < 10 ? `0${day}` : day;
        return `${formattedDay}-${formattedMonth}-${year}`;
    }
    static raschet(techInfo, pro) {
        const sezon = techInfo.querySelector('.sezon_type').value
        const protectorDefault = techInfo.querySelector('.protector_passport').value
        console.log(sezon)
        console.log(protectorDefault)
        const valuesArray = [...pro].map(it => it.value)
        const filteredArr = valuesArray.filter(num => num !== undefined && num !== null && num !== '').map(num => parseFloat(num));
        const minNumber = Math.min(...filteredArr);
        const minMM = sezon === 'Лето' ? 2 : 4;
        let percentage = ((minNumber - minMM) / (protectorDefault - minMM)) * 100;
        percentage = Math.min(percentage, 100);
        return percentage.toFixed(1); // Округление до двух знаков после запятой и возвращение результата
    }


    static viewRemark(element, color, text) {
        element.textContent = text
        element.style.color = color
        setTimeout(() => element.textContent = '', 3000)
    }


    static async mileageCalc(resMileage, probegNow) {
        const res = await RequestStaticMetods.getParams()
        const mileageTyres = (Number(res) - Number(resMileage)) + Number(probegNow)
        return ({ mileageTyres: mileageTyres, mileage: res })
    }


    static validationModelTyres(element) {
        // Сначала выполняем валидацию всех полей
        const fields = [
            '#type_tire', '#marka', '#model', '#type_tyres',
            '#radius', '#profil', '#width', '#sezon',
            '#index_speed', '#index_massa'
        ];

        let isValid = true;
        fields.forEach(selector => {
            const field = element.querySelector(selector);
            console.log(field)
            if (!field.value.trim()) isValid = false;
        });

        return isValid
    }





    static raschetProtector(techInfo, pro) {
        const sezon = techInfo.querySelector('#sezon_wiew').textContent
        const protectorDefault = techInfo.querySelector('#protektor_passport_wiew').value
        const valuesArray = [...pro].map(it => it.value)
        const filteredArr = valuesArray.filter(num => num !== undefined && num !== null && num !== '').map(num => parseFloat(num));
        const minNumber = Math.min(...filteredArr);
        const minMM = sezon === 'Лето' ? 2 : 4;
        let percentage = ((minNumber - minMM) / (protectorDefault - minMM)) * 100;
        percentage = Math.min(percentage, 100);
        return percentage.toFixed(1); // Округление до двух знаков после запятой и возвращение результата
    }

}