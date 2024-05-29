

export function removeElem(el) {
    el.remove()
}

export function clearElem(el) {
    el = ''
}

export function getHoursDiff(startDate, nowDate) {
    var diff = nowDate - startDate;
    let dayS;
    let hourS;
    const minutes = Math.floor(diff / 60)
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const day = days % 60;
    const hour = hours % 24;
    const minut = minutes % 60;
    day === 0 ? dayS = '' : dayS = days + 'д ';
    hour === 0 ? hourS = '' : hourS = hour + 'ч ';
    const mess = `${dayS} ${hourS} ${minut} мин`
    return mess;
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


export function focusCorrect(td) {
    td.addEventListener('focus', () => {
        td.dataset.oldContent = td.textContent;
        td.textContent = '';
    });
    // Восстанавливаем старый текст при потере фокуса, если новый текст не был введен
    td.addEventListener('blur', () => {
        if (td.textContent.trim() === '') {
            td.textContent = td.dataset.oldContent;
        }
    });
}
export function focusCorrectValue(td) {
    td.addEventListener('focus', () => {
        td.dataset.oldvalue = td.value;
        td.value = '';
    });
    // Восстанавливаем старый текст при потере фокуса, если новый текст не был введен
    td.addEventListener('blur', () => {
        if (td.value.trim() === '') {
            td.value = td.dataset.oldvalue;
        }
    });
}

export async function reverseGeocode(geoY, geoX) {
    const API_KEY = 'e156e8924c3a4e75bc1eac26f153457e';
    const API_URL = `https://api.opencagedata.com/geocode/v1/json`
    var lat = geoY; // Ваша широта
    var lng = geoX; // Ваша долгота
    console.log(lat, lng)
    try {
        const responses = await fetch(`${API_URL}?q=${lat},${lng}&key=${API_KEY}&no_annotations=1&language=ru`);
        const data = await responses.json();
        console.log(data.results)
        console.log(responses.status)
        if (!responses.ok) {
            if (responses.status === 402) {

                return [geoY, geoX];
            }
        }
        else {
            console.log('рекорд')
            const address = data.results[0].components;
            const adres = [];
            adres.push(address.road_reference)
            adres.push(address.municipality)
            adres.push(address.county)
            adres.push(address.town)
            adres.push(address.state)
            adres.push(address.country)
            const res = Object.values(adres).filter(val => val !== undefined).join(', ');
            return res
        }

    }
    catch (e) {
        return [geoY, geoX]
    }
}
