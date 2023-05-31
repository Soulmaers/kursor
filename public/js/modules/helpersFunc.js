

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