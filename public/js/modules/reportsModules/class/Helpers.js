


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

        if (interval === 'Выбранный интервал') {
            start = now;
            end = now; // Добавляем 1 день

        }
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
        console.log([start, end])
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


    static validateTime(input, prefix) {
        let value = input.value;
        let selectionStart = input.selectionStart; // Сохраняем позицию курсора
        let selectionEnd = input.selectionEnd;
        // Убираем все символы, кроме цифр и двоеточия
        value = value.replace(/[^0-9:]/g, '');

        // Разбиваем на часы и минуты
        let [hours, minutes] = value.split(':');

        // Валидация часов
        if (prefix) {
            if (hours !== undefined) {
                hours = hours.replace(/[^0-9]/g, ''); // Убираем нецифровые символы

                if (hours.length > 2) {
                    hours = hours.slice(0, 2); // Ограничиваем до 2 символов

                }
                if (hours.length === 2) {
                    hours = hours[1] + hours[0]
                }


                const hoursValue = parseInt(hours);
                if (hoursValue > 23) {
                    hours = '23'; // Максимальное значение - 23
                }


                if (hours.length === 1 && selectionStart === 1) {
                    //добавляем ноль и сдвигаем курсор
                    hours = '0' + hours
                    input.value = `${hours || '00'}:${minutes || '00'}`;
                    input.setSelectionRange(0, 1);
                    return
                }
                if (hours.length === 1 && selectionStart === 0) {
                    input.value = `${'00'}:${minutes || '00'}`;
                    input.setSelectionRange(0, 2);
                    return
                }

                if (hours.length === 2) {
                    input.value = `${hours || '00'}:${minutes || '00'}`;
                    // Ничего не делаем, просто даем ввести второй символ
                    if (selectionStart === 1) {
                        input.setSelectionRange(2, 2);
                    } else {
                        input.setSelectionRange(0, 0);
                    }
                }

                if (hours.length === 0) {
                    hours = '00';
                }
            } else {
                hours = '00';
            }

        }
        else {
            // Валидация минут
            if (minutes !== undefined) {
                minutes = minutes.replace(/[^0-9]/g, ''); // Убираем нецифровые символы
                if (minutes.length > 2) {
                    minutes = minutes.slice(0, 2); // Ограничиваем до 2 символов
                }
                if (minutes.length === 2) {
                    minutes = minutes[1] + minutes[0]
                }
                const minutesValue = parseInt(minutes);

                if (minutesValue > 59) {
                    minutes = '59'; // Максимальное значение - 59
                }

                if (minutes.length === 1 && selectionStart === 4) {
                    minutes = '0' + minutes
                    input.value = `${hours || '00'}:${minutes || '00'}`;
                    input.setSelectionRange(3, 4);
                    return
                }
                if (minutes.length === 1 && selectionStart === 3) {
                    minutes = '0' + minutes
                    input.value = `${hours || '00'}:${'00'}`;
                    input.setSelectionRange(3, 5);
                    return
                }
                if (minutes.length === 2) {
                    if (selectionStart === 4) {
                        console.log(selectionStart)
                        input.setSelectionRange(5, 5);
                    } else {
                        input.setSelectionRange(3, 3);
                    }
                }

                else if (minutes.length === 0) {
                    minutes = '00';
                }
            } else {
                minutes = '00';
            }
            input.value = `${hours || '00'}:${minutes || '00'}`;
        }

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
        const lastClassRow = stata.length === 1 ? '-' : 'vis';
        console.log(lastClassRow)
        const isVisible = object[name]?.[prop] === true;

        const displayClass = isVisible ? 'vis' : visibleClass; // Используем переменную видимости
        const currentSymbol = isVisible ? '-' : toggleSymbol;
        console.log(isVisible, displayClass)
        const symbolRow = displayClass === 'vis' ? '-' : 'vis';
        console.log(symbolRow)
        return [displayClass, currentSymbol, symbolRow]
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
            const summary = e.parentElement.nextElementSibling.nextElementSibling
            if (summary) {
                console.log(znak)
                summary.style.display = `${znak === '-' ? 'none' : 'flex'}`

            }
            style === 'none' ? e.classList.remove('toggleClass') :
                e.classList.add('toggleClass')
        })
    }
    static toggleWiewList(e, vis, prop) {
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

    static toggleTrList(e) {
        e.classList.toggle('toggleClass')
        const count = Number(e.id)
        let currentElement = e.closest('.row_table_tr').nextElementSibling;
        if (e.classList.contains('toggleClass')) {
            e.textContent = '-'
            e.closest('.row_table_tr').style.backgroundColor = 'lightgray'
            for (let i = 0; i < count && currentElement; i++) {
                if (currentElement.classList.contains('sub_interval')) {
                    currentElement.style.display = 'table-row'; // Показываем элемент
                }
                currentElement = currentElement.nextElementSibling; // Переходим к следующему элементу
            }
        }
        else {
            e.textContent = '+'
            e.closest('.row_table_tr').style.backgroundColor = '#fff'  // Начинаем с первого соседнего элемента
            for (let i = 0; i < count && currentElement; i++) {
                if (currentElement.classList.contains('sub_interval')) {
                    currentElement.style.display = 'none'; // Скрываем элемент
                }
                currentElement = currentElement.nextElementSibling; // Переходим к следующему элементу
            }
        }
    }
    static hiddenWiewElements(wrap, swich, prop, text) {
        wrap.style.display = `${prop}`
        const summary = wrap.nextElementSibling
        if (summary) {
            summary.style.display = `${text === '-' ? 'none' : 'flex'}`
        }
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
    static processConvertData(unixtime) {
        const date = new Date(unixtime * 1000);
        const day = date.getDate();
        const month = date.toLocaleString('ru-RU', { month: 'long' });
        const year = date.getFullYear();
        // Форматируем дату в нужный формат
        const formattedDate = `${day} ${month} ${year}`;
        return formattedDate
    }

}