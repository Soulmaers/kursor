

export function removeElem(el) {
    el.remove()
}

export function clearElem(el) {
    el = ''
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


export function convertTime(unixTime) {

    const date = new Date(unixTime * 1000);

    // Извлекаем данные о времени и дате
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
    const year = date.getFullYear();

    // Формируем строку в нужном формате
    const formattedDate = `${hours}:${minutes} ${day}.${month}.${year}`;

    return formattedDate
}