import { Requests } from './RequestStaticMethods.js'

export class Helpers {
    static viewRemark(element, color, text) {
        console.log(element, color, text)
        element.textContent = text
        element.style.color = color
        setTimeout(() => element.textContent = '', 5000)
    }

    static arraysAreEqual = (arr1, arr2) => {
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

}