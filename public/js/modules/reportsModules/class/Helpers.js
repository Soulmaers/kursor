


export class Helpers {

    static viewRemark(element, color, text) {
        console.log(element, color, text)
        element.textContent = text
        element.style.color = color
        setTimeout(() => element.textContent = '', 3000)
    }
}