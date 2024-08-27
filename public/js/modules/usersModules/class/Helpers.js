import { Requests } from './RequestStaticMethods.js'

export class Helpers {
    static viewRemark(element, color, text) {
        console.log(element, color, text)
        element.textContent = text
        element.style.color = color
        setTimeout(() => element.textContent = '', 5000)
    }

    static arraysAreEqual = (arr1, arr2) => {
        console.log(arr1)
        console.log(arr2)
        if (arr1.length !== arr2.length) return false;
        // Создаем копии массивов и сортируем их
        const sortedArr1 = [...arr1].sort();
        const sortedArr2 = [...arr2].sort();

        // Проверяем, равны ли отсортированные массивы
        return sortedArr1.every((value, index) => Number(value) === sortedArr2[index]);
    };

    static async getAccountAll() {
        const all = await Requests.getAccountCreater(this.creater)
        console.log(all)
        return all

    }
    static convertUnixToDateTime(unixTimestamp) {
        // Создаем объект Date из Unix timestamp (в секундах)
        const date = new Date(unixTimestamp * 1000);

        // Получаем компоненты даты и времени
        const day = String(date.getDate()).padStart(2, '0'); // Два символа для дня
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // Формируем строку в формате день-месяц-год часы:минуты:секунды
        const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        console.log(formattedDate)
        return formattedDate;
    }

}