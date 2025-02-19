


export class Helpers {

    static viewRemark(element, color, text) {
        console.log(element, color, text)
        element.textContent = text
        element.style.color = color
        setTimeout(() => element.textContent = '', 3000)
    }

    static ToggleClassElements(elements, element) {
        elements.forEach(it => it.classList.remove('activeTitleReports'))
        element.classList.toggle('activeTitleReports')
    }

    static getTimeInterval(interval) {
        console.log(interval)
        var nowa = new Date(); // Текущая дата и время
        var currentDay = nowa.getDay()
        const nows = new Date();
        let now = Math.floor(new Date(nows.getFullYear(), nows.getMonth(), nows.getDate(), 0, 0, 0).getTime() / 1000);
        let start, end;

        if (interval === 'Неделя') {
            const time = Helpers.getPreviousWeekUnixTimestamps()
            start = time[0]
            end = time[1]

        }
        if (interval === 'Месяц') {
            const time = Helpers.getPreviousMonthUnixTimestamps()
            start = time[0]
            end = time[1]
        }
        if (interval === 'Вчера') {
            start = now - (1 * 86400); // 1 день в секундах
            end = start + 86399; // Добавляем 1 день
        }
        if (interval === 'Сегодня') {
            start = now;
            end = start + 86399; // Добавляем 1 день
        }
        return [start, end]
    }

    static getPreviousMonthUnixTimestamps() {
        const currentDate = new Date();
        const previousMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const previousMonthStartUnixTime = Math.floor(previousMonthStartDate.getTime() / 1000);
        const previousMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const previousMonthEndUnixTime = Math.floor(previousMonthEndDate.getTime() / 1000) - 1;
        return [previousMonthStartUnixTime, previousMonthEndUnixTime];
    }
    static getPreviousWeekUnixTimestamps() {
        const now = new Date();
        const currentDay = now.getDay();
        const oneDayMilliseconds = 24 * 60 * 60 * 1000;
        const elapsedMilliseconds = (currentDay - 1) * oneDayMilliseconds;
        const startPreviousWeekMilliseconds = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime()) - elapsedMilliseconds - (7 * oneDayMilliseconds);
        const endPreviousWeekMilliseconds = startPreviousWeekMilliseconds + (7 * oneDayMilliseconds) - 1000;
        const startPreviousWeekUnix = Math.floor(startPreviousWeekMilliseconds / 1000);
        const endPreviousWeekUnix = Math.floor(endPreviousWeekMilliseconds / 1000);
        return [startPreviousWeekUnix, endPreviousWeekUnix];
    }


    static trueTitles(obj) {
        const resultArray = [];
        const checkProperties = (obj) => {
            for (let key in obj) {
                if (Array.isArray(obj[key])) {
                    if (obj[key].some(item => item.checked)) {
                        resultArray.push(key);
                    }
                } else if (typeof obj[key] === 'object') {
                    checkProperties(obj[key]);
                }
            }
        };
        checkProperties(obj)
        return resultArray
    }
    static trueAttributes(obj) {
        const res = obj.filter(e => e.checked === true).map(it => it)
        return res
    }

    static returnVariable(stata, object, name, prop) {
        const visibleClass = stata.length === 1 ? 'vis' : '';
        const toggleSymbol = stata.length === 1 ? '-' : '+';

        const isVisible = object[name]?.[prop] === true;
        const displayClass = isVisible ? 'vis' : visibleClass; // Используем переменную видимости
        const currentSymbol = isVisible ? '-' : toggleSymbol;

        return [displayClass, currentSymbol]
    }
    static timeStringToUnix(timeString) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        const milliseconds = (hours * 3600 + minutes * 60 + seconds);
        return milliseconds
    }

    static visiale_toggle_global(objects, znak, styleparent) {
        objects.forEach(e => {
            e.parentElement.previousElementSibling.children[0].textContent = `${znak}`
            styleparent === 'none' ? e.parentElement.previousElementSibling.children[0].classList.add('toggleClass') :
                e.parentElement.previousElementSibling.children[0].classList.remove('toggleClass')
            e.parentElement.style.display = `${styleparent}`
        })
    }

    static visible_all_objects(reports, znak, style) {
        reports.forEach(e => {
            e.textContent = `${znak}`
            e.parentElement.nextElementSibling.style.display = `${style}`
            style === 'none' ? e.classList.remove('toggleClass') :
                e.classList.add('toggleClass')
        })
    }
    static toggleWiewList(e, vis) {
        e.classList.toggle('toggleClass')
        const full = e.parentElement.querySelector('.full_screen')
        const wrapObject = e.parentElement.nextElementSibling
        if (e.classList.contains('toggleClass')) {
            if (full) full.style.display = 'block'
            !vis ? Helpers.hiddenWiewElements(wrapObject, e, 'none', '+') : Helpers.hiddenWiewElements(wrapObject, e, 'block', '-')
        }
        else {
            if (full) full.style.display = 'none'
            !vis ? Helpers.hiddenWiewElements(wrapObject, e, 'block', '-') : Helpers.hiddenWiewElements(wrapObject, e, 'none', '+')
        }
    }

    static hiddenWiewElements(wrap, swich, prop, text) {
        wrap.style.display = `${prop}`
        swich.textContent = text

    }

    static formatUnixTime(unixTimestamp) {

        // Создаем оъект Date из UNIX времени (умножаем на 1000, так как Date принимает миллисекунды)
        const date = new Date(unixTimestamp * 1000);
        // Получаем часы, минуты и секунды
        const hours = String(date.getHours()).padStart(2, '0'); // Форматируем с ведущим нулем
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Форматируем с ведущим нулем
        const seconds = String(date.getSeconds()).padStart(2, '0'); // Форматируем с ведущим нулем
        // Получаем день и месяц
        const day = String(date.getDate()).padStart(2, '0'); // Форматируем с ведущим нулем
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
        // Форматируем время и дату
        const timeString = `${hours}:${minutes}:${seconds}`;
        const dateString = `${day}.${month}`;
        return { timeString, dateString };
    }

    static timesFormat(dates) {
        const totalSeconds = Math.floor(dates);
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        const motoHours = `${hours}:${minutes}`;
        return motoHours;
    }

}