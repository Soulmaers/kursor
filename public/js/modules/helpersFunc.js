

export function removeElem(el) {
    el.remove()
}

export function clearElem(el) {
    el = ''
}


export function timeConvert(d) {
    const date = new Date(d);
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeString = `${month} ${day}, ${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
    return timeString;
}


export function removeArrElem(arr) {
    arr.forEach(el => {
        el.remove()
    });
}
export const convert = (ob) => {
    const uniq = new Set(ob.map(e => JSON.stringify(e)));
    return Array.from(uniq).map(e => JSON.parse(e));
}


export function convertTime(seconds) {
    var days = Math.floor(seconds / (24 * 60 * 60));
    var hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    var minutes = Math.floor((seconds % (60 * 60)) / 60);
    var remainingSeconds = seconds % 60; // Рассчитываем оставшиеся секунды

    if (days > 0) {
        return `${days} д. ${hours} ч. ${minutes} мин.`;
    } else if (hours > 0) {
        return `${hours} ч. ${minutes} мин.`;
    } else if (minutes === 0) {
        // Включаем секунды в последнее условие
        return `${minutes} мин. ${remainingSeconds} сек.`;
    }
    else {
        return `${minutes} мин.`
    }
}

export function convertDate(num) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - num)
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');
    const data = `${year}-${month}-${day} `;
    return data
}

export function timefn() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startOfTodayUnix = Math.floor(currentDate.getTime() / 1000);
    const unix = Math.floor(new Date().getTime() / 1000);
    const timeNow = unix
    const timeOld = startOfTodayUnix
    return [timeNow, timeOld]
}
