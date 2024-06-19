
import { RequestStaticMetods } from "./RequestStaticMetods.js";
import { Tooltip } from "../../../class/Tooltip.js";
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


    static async mileageCalc(resMileage, probegNow, idw) {
        const res = await RequestStaticMetods.getParams(idw)
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
            if (!field.value.trim()) isValid = false;
        });

        return isValid
    }

    static protek(wheels) {
        const protector = [];
        protector.push(wheels.N1, wheels.N2, wheels.N3, wheels.N4)
        const pro = protector.filter(e => e !== '').map(it => it)
        return pro
    }
    static tooltipView(classDOM, text, parent) {
        const elem = parent.querySelectorAll(`.${classDOM}`)
        elem.forEach(el => {
            new Tooltip(el, [text])
        })
    }

    static validatonPunctuation(input) {
        input.addEventListener('input', function () {
            if (input.value.includes(',')) {
                const newValue = input.value.replace(',', '.');
                input.value = newValue;
            }
        });
        input.addEventListener('keydown', (e) => {
            const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter', '.', ','];

            if (!allowedKeys.includes(e.key) && !/\d/.test(e.key)) {
                e.preventDefault(); // Блокировка всех символов, кроме разрешённых
            }
        });
    }

    static renderProtektors(data, container) {
        const fields = [
            { id: '#N1_wiew_chart', value: data.N1 },
            { id: '#N2_wiew_chart', value: data.N2 },
            { id: '#N3_wiew_chart', value: data.N3 },
            { id: '#N4_wiew_chart', value: data.N4 }
        ];

        fields.forEach(field => {
            const fieldElement = container.querySelector(field.id);
            if (fieldElement) {
                if (field.value === null || field.value === "") {
                    fieldElement.parentElement.style.display = 'none';
                } else {
                    fieldElement.parentElement.style.display = 'flex'; // Показываем элемент, если он был скрыт ранее
                    const valueText = `${field.value} мм`;
                    if (fieldElement.tagName.toLowerCase() === 'input') {
                        fieldElement.value = valueText;
                    } else {
                        fieldElement.textContent = valueText;
                    }
                }
            }
        });
    }
    static raschetProtector(techInfo, pro) {
        const sezon = techInfo.querySelector('#sezon_wiew').textContent
        const protectorDefault = techInfo.querySelector('#protektor_passport_wiew').value
        if (!protectorDefault) return null
        const valuesArray = [...pro].map(it => it.value)
        const nValues = valuesArray.filter(num => num !== undefined && num !== null && num !== '').map(num => parseFloat(num));
        if (nValues.length === 0) return null
        const minNumber = Math.min(...nValues)
        const minMM = sezon === 'Лето' ? 2 : 4;
        let percentage = ((minNumber - minMM) / (protectorDefault - minMM)) * 100;
        percentage = Math.min(percentage, 100);
        return percentage.toFixed(1); // Округление до двух знаков после запятой и возвращение результата
    }

    static validateSelection(actionSelect) {
        if (actionSelect.value === "-") {
            actionSelect.classList.add('invalid');
            setTimeout(() => actionSelect.classList.remove('invalid'), 1000)
            return false;
        } else {
            return true;
        }
    }
    static validationInput(container) {
        const elements = container.querySelectorAll('.valid_input');
        let allValid = true;
        elements.forEach(element => {
            if (!element.value.trim()) {
                allValid = false;
                element.style.border = '1px solid red';
                setTimeout(() => {
                    element.style.border = '';
                }, 3000);
            }
        });
        return allValid;
    }
    static addStruktura(data, historyWheel) {
        const priceNew = Number(data.price);
        const probegPassport = Number(data.probeg_passport);
        const protektorPassport = Number(data.protektor_passport);
        // Формируем данные для графика
        const dataWithPrice = historyWheel.map(d => {
            const nValues = [d.N1, d.N2, d.N3, d.N4]
                .filter(x => x !== '' && x !== null)
                .map(Number);
            return {
                probegNow: Number(d.probeg_now),
                price: priceNew,//Math.round((priceNew - (pricePerKm * Number(d.probeg_now))).toFixed(0)),
                minN: nValues.length > 0 ? Math.min(...nValues) : null,
                id: d.id
            };
        });
        // Удаление элементов с null значением minN
        const validDataWithPrice = dataWithPrice.filter(item => item.minN !== null);
        const uniqueDataWithPrice = Array.from(
            new Map(validDataWithPrice.map(item => [item.minN, item])).values()
        );
        const struktura = Helpers.calculate(priceNew, probegPassport, protektorPassport, uniqueDataWithPrice)
        return struktura
    }

    static calcPrognozPobeg(data) {
        const pro = Math.min(...Helpers.protek(data))
        const protektorPassport = Number(data.protektor_passport);
        const defaultProtektor = Math.round((protektorPassport / Number(data.probeg_passport)) * 100000) / 100000;
        const protektorOneKM = pro === protektorPassport ? defaultProtektor : Math.round(((protektorPassport - pro) / Number(data.probeg_now)) * 100000) / 100000;
        const lastZamer = pro
            / protektorOneKM;
        const last = lastZamer - Number(data.probeg_now)
        return last.toFixed(0)
    }

    static addContent(discription, dataWheel) {
        console.log(dataWheel)
        const result = Helpers.calcPrognozPobeg(dataWheel)
        const row = discription.querySelectorAll('.row_text_shina')
        row[0].textContent = `ID: ${dataWheel.idw_tyres}`
        row[1].textContent = `Монтаж: ${dataWheel.dateInstall}`
        row[2].textContent = `Остаток пробега: ${result} км`
    }
    static calculate(priceNew, probegPassport, protektorPassport, uniqueDataWithPrice) {
        const priceOneMM = priceNew / protektorPassport;
        const defaultPrice = Math.round((priceNew / probegPassport) * 100) / 100;
        const defaultProtektor = Math.round((protektorPassport / probegPassport) * 100000) / 100000;
        uniqueDataWithPrice.forEach((el, index) => {
            if (el.price === priceNew && el.minN === protektorPassport || el.probegNow == 0) {
                el.priceOneKM = Math.round((priceNew / probegPassport) * 100) / 100;
                el.protektorOneKM = Math.round((protektorPassport / probegPassport) * 100000) / 100000;
                el.priceOneKMLine = el.priceOneKM;
                el.protektorOneKMLine = el.protektorOneKM;
                el.defaultPrice = defaultPrice
                el.defaultProtektor = defaultProtektor
            } else {
                el.priceOneKM = Math.round(((protektorPassport - el.minN) * priceOneMM / el.probegNow) * 100) / 100;
                el.protektorOneKM = Math.round(((protektorPassport - el.minN) / el.probegNow) * 100000) / 100000;
                el.defaultPrice = defaultPrice
                el.defaultProtektor = defaultProtektor
                if (index > 0) {
                    const prev = uniqueDataWithPrice[index - 1];
                    el.priceOneKMLine = Math.round(((prev.minN - el.minN) * priceOneMM / (el.probegNow - prev.probegNow === 0 ? 1 : el.probegNow - prev.probegNow)) * 100) / 100;
                    el.protektorOneKMLine = Math.round(((prev.minN - el.minN) / (el.probegNow - prev.probegNow === 0 ? 1 : el.probegNow - prev.probegNow)) * 100000) / 100000;
                } else {
                    el.priceOneKMLine = el.priceOneKM;
                    el.protektorOneKMLine = el.protektorOneKM;
                }
            }
        });
        return uniqueDataWithPrice
    }

}