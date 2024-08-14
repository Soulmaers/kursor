


export class Helpers {

    //готовим нужный интервал
    static getIntervalDate(interval) {
        const data = [];
        let int;
        if (interval === 'Неделя') {
            int = 7
        }
        if (interval === 'Месяц') {
            int = 30
        }
        if (interval === 'Вчера') {
            int = 1
        }
        if (interval === 'Сегодня') {
            int = 0
        }
        if (interval.length === 2) {
            data.push(interval[0], interval[1])
        }
        else if (int <= 1) {
            data.push(Helpers.convertDate(int))
        }
        else {
            data.push(Helpers.convertDate(int), Helpers.convertDate(1))
        }

        return data
    }
    //форматируем юникс в дату
    static convertDate(num) {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - num)
        const year = yesterday.getFullYear();
        const month = String(yesterday.getMonth() + 1).padStart(2, '0');
        const day = String(yesterday.getDate()).padStart(2, '0');
        const data = `${year}-${month}-${day}`;
        return data
    }

    //забираем из бд данные
    static async getRequestSummaryToBase(data, ids) {
        const arrayId = ids.map(String);
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ data, arrayId }))
        }
        try {
            const mods = await fetch('/api/summaryYestoday', params)
            const models = await mods.json()
            models.sort((a, b) => a.data - b.data)
            return models
        }
        catch (e) {
            console.log(e)
        }
    }

    //сверка активных объектов с данными для подсчета саммари и отображения
    static controllActiveObject(array) {
        const checkObjectsId = Array.from(document.querySelectorAll('.checkInList')).reduce((acc, el) => {
            if (el.classList.contains('changeColorCheck')) {
                acc.push(Number(el.closest('.listItem').id))
            }
            return acc
        }, [])
        const originalObjectsData = array.reduce((acc, el) => {
            if (!checkObjectsId.includes(Number(el.idw))) {
                acc.push(el)
            }
            return acc
        }, [])
        return originalObjectsData
    }
}