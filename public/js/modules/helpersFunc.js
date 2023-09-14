

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


export function convertTime(seconds) {
    var days = Math.floor(seconds / (24 * 60 * 60));
    var hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    var minutes = Math.floor((seconds % (60 * 60)) / 60);
    if (days > 0) {
        return days + " д. " + hours + " ч. " + minutes + " мин. ";
    } else if (hours > 0) {
        return hours + " ч. " + minutes + " мин.";
    } else {
        return minutes + " мин.";
    }
}
