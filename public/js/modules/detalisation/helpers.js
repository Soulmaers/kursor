
import { cal2, cal3 } from '../content.js'

export function updateHTML() {
    console.log('работает апдейт')
    const jobTSDetalisationGraf = document.querySelector(".jobTSDetalisationGraf")
    jobTSDetalisationGraf.style.flexDirection = 'row'
    jobTSDetalisationGraf.style.justifyContent = 'center'
    const jobTSDetalisationLine = document.querySelector(".jobTSDetalisationLine")
    jobTSDetalisationLine.style.width = '200px'
    const chartJobTS = document.querySelectorAll('.chartJobTS')
    const jobTSDetalisationDate = document.querySelectorAll(".jobTSDetalisationDate")
    jobTSDetalisationDate.forEach(el => {
        el.style.fontSize = '13px'
    })
    chartJobTS.forEach(el => {
        el.style.alignItems = 'start'
    })
}

export function convertToHoursAndMinutes(value) {
    const hours = Math.floor(value / 3600)
    const lastSeconds = value % 3600
    const minutes = Math.floor(lastSeconds / 60)
    return { hours: hours, minutes: minutes };
}

export function eskiz(today, yestoday, week, objectRazmetka) {
    today.textContent = `Сегодня: ${convertTime(1)}`
    yestoday.innerHTML = `Вчера: ${convertTime(2)}<div class="calen" rel="cal2"></div>${cal2}`
    week.innerHTML = `Неделя: ${convertTime(3)}<div class="calen" rel="cal3"></div>${cal3}`

    for (let key in objectRazmetka) {
        objectRazmetka[key].title.to = `Сегодня: ${convertTime(1)}`
        objectRazmetka[key].title.yes = `Вчера: ${convertTime(2)}<div class="calen" rel="cal2"></div>${cal2}`
        objectRazmetka[key].title.week = `Неделя: ${convertTime(3)}<div class="calen" rel="cal3"></div>${cal3}`

    }

}
export function convertTime(num) {
    if (num === 1) {
        const todayData = new Date();
        var day = String(todayData.getDate()).padStart(2, '0');
        var month = String(todayData.getMonth() + 1).padStart(2, '0');
        var year = todayData.getFullYear();
        var formattedDate = day + "." + month + "." + year;
        return formattedDate
    }
    if (num === 2) {
        const todayData = new Date();
        todayData.setDate(todayData.getDate() - 1);
        const day = String(todayData.getDate()).padStart(2, '0');
        const month = String(todayData.getMonth() + 1).padStart(2, '0');
        const year = todayData.getFullYear();
        const formattedDate = day + "." + month + "." + year;
        return formattedDate;

    }
    if (num === 3 || num === 4) {
        const todayData = new Date();
        var day = String(todayData.getDate() - (num !== 4 ? 7 : 10)).padStart(2, '0');
        var month = String(todayData.getMonth() + 1).padStart(2, '0');
        var year = todayData.getFullYear();
        if (day <= 0) {
            // Если день стал отрицательным, значит нужно уменьшить месяц на 1
            todayData.setMonth(todayData.getMonth() - 1);
            // Получаем последний день предыдущего месяца
            const lastDayOfPrevMonth = new Date(todayData.getFullYear(), todayData.getMonth() + 1, 0).getDate();
            // Устанавливаем день на последний день предыдущего месяца
            day = String(lastDayOfPrevMonth + (Number(day))).padStart(2, '0');
            month = String(todayData.getMonth() + 1).padStart(2, '0');
        }
        var formattedDate = day + "." + month + "." + year;
        const todayData2 = new Date();
        todayData2.setDate(todayData2.getDate() - 1); // Вычитаем 1 день из текущей даты
        var day2 = String(todayData2.getDate()).padStart(2, '0');
        var month2 = String(todayData2.getMonth() + 1).padStart(2, '0');
        var year2 = todayData2.getFullYear();
        if (day2 <= 0) {
            // Если день стал отрицательным, значит нужно уменьшить месяц на 1
            todayData2.setMonth(todayData2.getMonth() - 1);
            // Получаем последний день предыдущего месяца
            const lastDayOfPrevMonth = new Date(todayData2.getFullYear(), todayData2.getMonth() + 1, 0).getDate();
            // Устанавливаем день на последний день предыдущего месяца
            day2 = String(lastDayOfPrevMonth + Number(day2)).padStart(2, '0');
            month = String(todayData.getMonth() + 1).padStart(2, '0');
        }
        var formattedDate2 = day2 + "." + month2 + "." + year2;
        return `${formattedDate}-${formattedDate2}`
    }
}
export function yesTo() {
    // Получаем текущую дату и время в формате JavaScript Date
    const currentDate = new Date();
    // Вычисляем времена для вчерашнего дня
    const yesterdayStart = new Date(currentDate);
    yesterdayStart.setDate(currentDate.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);
    const yesterdayEnd = new Date(currentDate);
    yesterdayEnd.setDate(currentDate.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);
    // Переводим времена в формат юникс-времени (миллисекунды)
    const unixTimeYesterdayStart = Math.floor(yesterdayStart.getTime() / 1000);
    const unixTimeYesterdayEnd = Math.floor(yesterdayEnd.getTime() / 1000);
    return [unixTimeYesterdayEnd, unixTimeYesterdayStart]
}
export function weekTo() {
    // Получаем текущую дату и время в формате JavaScript Date
    const currentDate = new Date();
    // Вычисляем времена для вчерашнего дня
    const yesterdayStart = new Date(currentDate);
    yesterdayStart.setDate(currentDate.getDate() - 7);
    yesterdayStart.setHours(0, 0, 0, 0);
    const yesterdayEnd = new Date(currentDate);
    yesterdayEnd.setDate(currentDate.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);
    // Переводим времена в формат юникс-времени (миллисекунды)
    const unixTimeYesterdayStart = Math.floor(yesterdayStart.getTime() / 1000);
    const unixTimeYesterdayEnd = Math.floor(yesterdayEnd.getTime() / 1000);
    return [unixTimeYesterdayEnd, unixTimeYesterdayStart]

}